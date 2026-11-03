const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboard, getPendingLawyers, approveLawyer, rejectLawyer, getAllUsers, blockUser, deleteUser, getAllCases, getCaseStats, getLocationStats, getLawyerPerformance, getMonthlyGrowth } = require('../controllers/adminController');
const { preloadLawyers } = require('../controllers/preloadController');

router.use(protect, authorize('admin'));
router.get('/dashboard', getDashboard);
router.get('/pending-lawyers', getPendingLawyers);
router.put('/approve-lawyer/:id', approveLawyer);
router.put('/reject-lawyer/:id', rejectLawyer);
router.get('/users', getAllUsers);
router.put('/block-user/:id', blockUser);
router.delete('/user/:id', deleteUser);
router.get('/cases', getAllCases);

// Analytics Routes
router.get('/case-stats', getCaseStats);
router.get('/location-stats', getLocationStats);
router.get('/lawyer-performance', getLawyerPerformance);
router.get('/monthly-growth', getMonthlyGrowth);

// Preload Lawyers Route
router.post('/preload-lawyers', preloadLawyers);

module.exports = router;
