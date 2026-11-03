const User = require('../models/User');
const LawyerProfile = require('../models/LawyerProfile');
const Case = require('../models/Case');
const Appointment = require('../models/Appointment');

exports.getDashboard = async (req, res) => {
  try {
    const [totalLawyers, totalClients, totalCases, pendingLawyers, totalAppointments] = await Promise.all([
      User.countDocuments({ role: 'lawyer', status: 'active' }),
      User.countDocuments({ role: 'client' }),
      Case.countDocuments(),
      User.countDocuments({ role: 'lawyer', status: 'pending' }),
      Appointment.countDocuments()
    ]);
    const casesByStatus = await Case.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const recentCases = await Case.find().populate('clientId', 'name').populate('lawyerId', 'name').sort({ createdAt: -1 }).limit(5);
    const recentUsers = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).limit(5).select('-password');
    res.json({ stats: { totalLawyers, totalClients, totalCases, pendingLawyers, totalAppointments }, casesByStatus, recentCases, recentUsers });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPendingLawyers = async (req, res) => {
  try {
    const lawyers = await User.find({ role: 'lawyer', status: 'pending' }).select('-password');
    const result = await Promise.all(lawyers.map(async l => {
      const profile = await LawyerProfile.findOne({ userId: l._id });
      return { user: l, profile };
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.approveLawyer = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'active' });
    await LawyerProfile.findOneAndUpdate({ userId: req.params.id }, { isVerified: true });
    res.json({ message: 'Lawyer approved successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.rejectLawyer = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.json({ message: 'Lawyer rejected' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = { role: { $ne: 'admin' } };
    if (role) filter.role = role;
    const users = await User.find(filter).select('-password').skip((page-1)*limit).limit(parseInt(limit)).sort({ createdAt: -1 });
    const total = await User.countDocuments(filter);
    res.json({ users, total, pages: Math.ceil(total/limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.blockUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'blocked' });
    res.json({ message: 'User blocked' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllCases = async (req, res) => {
  try {
    const cases = await Case.find().populate('clientId', 'name email').populate('lawyerId', 'name email').sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCaseStats = async (req, res) => {
  try {
    const stats = await Case.aggregate([{ $group: { _id: '$caseType', count: { $sum: 1 } } }]);
    res.json(stats);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getLocationStats = async (req, res) => {
  try {
    const stats = await LawyerProfile.aggregate([{ $group: { _id: '$location', count: { $sum: 1 } } }]);
    res.json(stats);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getLawyerPerformance = async (req, res) => {
  try {
    const stats = await Case.aggregate([
      {
        $group: {
          _id: '$lawyerId',
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $in: ['$status', ['Filed', 'In Progress', 'Hearing']] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $in: ['$status', ['Closed', 'Won', 'Lost']] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'lawyer'
        }
      },
      { $unwind: '$lawyer' },
      {
        $project: {
          name: '$lawyer.name',
          total: 1,
          active: 1,
          closed: 1
        }
      }
    ]);
    res.json(stats);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMonthlyGrowth = async (req, res) => {
  try {
    const stats = await Case.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          month: '$_id.month',
          year: '$_id.year',
          count: 1,
          _id: 0
        }
      }
    ]);
    // Format to string like "Jan 2026"
    const formatted = stats.map(s => ({
      month: new Date(s.year, s.month - 1).toLocaleString('default', { month: 'short' }) + ' ' + s.year,
      count: s.count
    }));
    res.json(formatted);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
