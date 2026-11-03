const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
router.get('/profile', protect, authorize('client'), (req, res) => res.json(req.user));
module.exports = router;
