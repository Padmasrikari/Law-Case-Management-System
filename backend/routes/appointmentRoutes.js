const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { bookAppointment, getClientAppointments, getLawyerAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
router.post('/', protect, authorize('client'), bookAppointment);
router.get('/client', protect, authorize('client'), getClientAppointments);
router.get('/lawyer', protect, authorize('lawyer'), getLawyerAppointments);
router.put('/:id', protect, updateAppointmentStatus);
module.exports = router;
