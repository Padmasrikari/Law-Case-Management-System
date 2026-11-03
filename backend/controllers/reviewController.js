const Review = require('../models/Review');
const LawyerProfile = require('../models/LawyerProfile');

exports.addReview = async (req, res) => {
  try {
    const { lawyerId, rating, comment } = req.body;
    const existing = await Review.findOne({ clientId: req.user._id, lawyerId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this lawyer' });
    const review = await Review.create({ clientId: req.user._id, lawyerId, rating, comment });
    const reviews = await Review.find({ lawyerId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await LawyerProfile.findOneAndUpdate({ userId: lawyerId }, { rating: avgRating.toFixed(1), totalReviews: reviews.length });
    res.status(201).json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getLawyerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ lawyerId: req.params.lawyerId }).populate('clientId', 'name avatar').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
