const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Case = require('../models/Case');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getDashboard = async (req, res) => {
  try {
    const clientId = req.user._id;
    const [appointments, cases] = await Promise.all([
      Appointment.find({ clientId }).populate('lawyerId', 'name email').sort({ date: -1 }),
      Case.find({ clientId }).populate('lawyerId', 'name email').sort({ createdAt: -1 })
    ]);
    res.json({ appointments, cases });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
