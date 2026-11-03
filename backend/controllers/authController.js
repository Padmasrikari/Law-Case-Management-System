const User = require('../models/User');
const LawyerProfile = require('../models/LawyerProfile');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });
    
    const status = role === 'lawyer' ? 'pending' : 'active';
    const user = await User.create({ name, email, password, role: role || 'client', status, phone });
    
    if (role === 'lawyer') {
      const { specialization, experience, bio, education, barNumber, consultationFee, location } = req.body;
      
      if (role === 'lawyer') {
        const requiredDocs = ['degreeCertificate', 'barCertificate', 'experienceProof', 'idProof'];
        const missingDocs = requiredDocs.filter(doc => !req.files || !req.files[doc]);
        if (missingDocs.length > 0) {
          return res.status(400).json({ message: `Missing required documents: ${missingDocs.join(', ')}` });
        }
      }

      const documents = {};
      if (req.files) {
        if (req.files.degreeCertificate) documents.degreeCertificate = { name: req.files.degreeCertificate[0].originalname, url: `/uploads/${req.files.degreeCertificate[0].filename}`, type: req.files.degreeCertificate[0].mimetype };
        if (req.files.barCertificate) documents.barCertificate = { name: req.files.barCertificate[0].originalname, url: `/uploads/${req.files.barCertificate[0].filename}`, type: req.files.barCertificate[0].mimetype };
        if (req.files.experienceProof) documents.experienceProof = { name: req.files.experienceProof[0].originalname, url: `/uploads/${req.files.experienceProof[0].filename}`, type: req.files.experienceProof[0].mimetype };
        if (req.files.idProof) documents.idProof = { name: req.files.idProof[0].originalname, url: `/uploads/${req.files.idProof[0].filename}`, type: req.files.idProof[0].mimetype };
      }

      await LawyerProfile.create({
        userId: user._id, specialization, experience: experience || 0,
        bio: bio || '', education: education || '', barNumber: barNumber || '',
        consultationFee: consultationFee || 0, location: location || '',
        documents
      });
    }
    
    res.status(201).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
      
    if (user.status === 'blocked') return res.status(403).json({ message: 'Account blocked' });
    if (user.status === 'pending') return res.status(403).json({ message: 'Account under admin verification' });
    if (user.status === 'rejected') return res.status(403).json({ message: 'Account rejected by admin' });
    
    res.json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
