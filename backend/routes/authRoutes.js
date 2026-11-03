const router = require('express').Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', upload.fields([
  { name: 'degreeCertificate', maxCount: 1 },
  { name: 'barCertificate', maxCount: 1 },
  { name: 'experienceProof', maxCount: 1 },
  { name: 'idProof', maxCount: 1 }
]), register);
router.post('/login', login);
router.get('/me', protect, getMe);
module.exports = router;
