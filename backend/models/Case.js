const mongoose = require('mongoose');

const hearingSchema = new mongoose.Schema({
  date: Date,
  description: String,
  court: String,
  result: String
});

const caseSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  caseNumber: { type: String, unique: true },
  caseType: { type: String, default: 'General' },
  court: { type: String, default: '' },
  status: { type: String, enum: ['Filed', 'In Progress', 'Hearing', 'Closed', 'Won', 'Lost'], default: 'Filed' },
  hearings: [hearingSchema],
  nextHearingDate: { type: Date },
  documents: [{ name: String, url: String, type: String, uploadedAt: Date }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

caseSchema.pre('save', function(next) {
  if (!this.caseNumber) {
    this.caseNumber = 'CASE-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Case', caseSchema);
