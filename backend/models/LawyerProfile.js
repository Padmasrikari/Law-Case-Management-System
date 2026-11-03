const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  day: String,
  startTime: String,
  endTime: String,
  isAvailable: { type: Boolean, default: true }
});

const lawyerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, required: true },
  experience: { type: Number, default: 0 },
  bio: { type: String, default: '' },
  education: { type: String, default: '' },
  barNumber: { type: String, default: '' },
  documents: {
    degreeCertificate: { name: { type: String }, url: { type: String }, type: { type: String } },
    barCertificate: { name: { type: String }, url: { type: String }, type: { type: String } },
    experienceProof: { name: { type: String }, url: { type: String }, type: { type: String } },
    idProof: { name: { type: String }, url: { type: String }, type: { type: String } }
  },
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  consultationFee: { type: Number, default: 0 },
  location: { type: String, default: '' },
  timeSlots: [timeSlotSchema],
  languages: [String],
  achievements: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LawyerProfile', lawyerProfileSchema);
