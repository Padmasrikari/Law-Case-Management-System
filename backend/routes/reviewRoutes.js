const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { addReview, getLawyerReviews } = require('../controllers/reviewController');
router.post('/', protect, authorize('client'), addReview);
router.get('/:lawyerId', getLawyerReviews);
module.exports = router;
