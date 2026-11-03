const Appointment = require('../models/Appointment');
const LawyerProfile = require('../models/LawyerProfile');

exports.bookAppointment = async (req, res) => {
  try {
    const { lawyerId, date, timeSlot, reason } = req.body;
    const existing = await Appointment.findOne({ lawyerId, date: new Date(date), timeSlot, status: { $in: ['pending','confirmed'] } });
    if (existing) return res.status(400).json({ message: 'This slot is already booked' });
    const appointment = await Appointment.create({ clientId: req.user._id, lawyerId, date: new Date(date), timeSlot, reason });
    res.status(201).json(appointment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getClientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ clientId: req.user._id })
      .populate('lawyerId', 'name email avatar')
      .populate({ path: 'lawyerId', populate: { path: '_id', model: 'LawyerProfile' } })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getLawyerAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ lawyerId: req.user._id })
      .populate('clientId', 'name email avatar phone')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.lawyerId.toString() !== req.user._id.toString() && appointment.clientId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();
    res.json(appointment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
