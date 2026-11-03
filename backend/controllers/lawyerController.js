const User = require('../models/User');
const LawyerProfile = require('../models/LawyerProfile');
const Appointment = require('../models/Appointment');
const Case = require('../models/Case');
const Review = require('../models/Review');

exports.getAllLawyers = async (req, res) => {
  try {
    const { specialization, minRating, minExperience, search, page = 1, limit = 10 } = req.query;
    const filter = { isVerified: true };
    if (specialization) filter.specialization = new RegExp(specialization, 'i');
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (minExperience) filter.experience = { $gte: parseInt(minExperience) };
    
    let profiles = await LawyerProfile.find(filter)
      .populate('userId', 'name email status avatar')
      .skip((page - 1) * limit).limit(parseInt(limit));
    
    if (search) {
      profiles = profiles.filter(p => 
        p.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.specialization?.toLowerCase().includes(search.toLowerCase())
      );
    }
    profiles = profiles.filter(p => p.userId?.status === 'active');
    const total = await LawyerProfile.countDocuments(filter);
    res.json({ lawyers: profiles, total, pages: Math.ceil(total / limit), currentPage: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLawyerProfile = async (req, res) => {
  try {
    const profile = await LawyerProfile.findOne({ userId: req.params.id }).populate('userId', 'name email avatar phone');
    if (!profile) return res.status(404).json({ message: 'Lawyer not found' });
    const reviews = await Review.find({ lawyerId: req.params.id }).populate('clientId', 'name avatar').limit(10);
    res.json({ profile, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await LawyerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });
    const docs = req.files.map(f => ({ name: f.originalname, url: `/uploads/${f.filename}`, type: f.mimetype }));
    const profile = await LawyerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $push: { documents: { $each: docs } } },
      { new: true }
    );
    res.json({ message: 'Documents uploaded', documents: docs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setTimeSlots = async (req, res) => {
  try {
    const profile = await LawyerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { timeSlots: req.body.timeSlots },
      { new: true }
    );
    res.json({ message: 'Time slots updated', timeSlots: profile.timeSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLawyerDashboard = async (req, res) => {
  try {
    const lawyerId = req.user._id;
    const [totalCases, activeCases, closedCases, appointments, profile] = await Promise.all([
      Case.countDocuments({ lawyerId }),
      Case.countDocuments({ lawyerId, status: { $in: ['Filed', 'In Progress', 'Hearing'] } }),
      Case.countDocuments({ lawyerId, status: { $in: ['Closed', 'Won', 'Lost'] } }),
      Appointment.find({ lawyerId }).populate('clientId', 'name email avatar').sort({ date: -1 }).limit(10),
      LawyerProfile.findOne({ userId: lawyerId })
    ]);
    const recentCases = await Case.find({ lawyerId }).populate('clientId', 'name email').sort({ createdAt: -1 }).limit(5);
    res.json({ stats: { totalCases, activeCases, closedCases, rating: profile?.rating || 0, totalReviews: profile?.totalReviews || 0 }, appointments, recentCases });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
