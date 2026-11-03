const Case = require('../models/Case');
const CaseTimeline = require('../models/CaseTimeline');

exports.createCase = async (req, res) => {
  try {
    const { clientId, title, description, caseType, court } = req.body;
    const newCase = await Case.create({ clientId, lawyerId: req.user._id, title, description, caseType, court });
    await CaseTimeline.create({ caseId: newCase._id, activity: 'Case Filed', description: 'Case has been filed', performedBy: req.user._id });
    res.status(201).json(newCase);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCases = async (req, res) => {
  try {
    const filter = req.user.role === 'lawyer' ? { lawyerId: req.user._id } : { clientId: req.user._id };
    const cases = await Case.find(filter)
      .populate('clientId', 'name email')
      .populate('lawyerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id).populate('clientId', 'name email phone').populate('lawyerId', 'name email');
    if (!caseData) return res.status(404).json({ message: 'Case not found' });
    const timeline = await CaseTimeline.find({ caseId: req.params.id }).populate('performedBy', 'name').sort({ timestamp: -1 });
    res.json({ case: caseData, timeline });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateCase = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: 'Case not found' });
    const prevStatus = caseData.status;
    Object.assign(caseData, req.body);
    await caseData.save();
    if (req.body.status && req.body.status !== prevStatus) {
      await CaseTimeline.create({ caseId: caseData._id, activity: `Status updated to ${req.body.status}`, performedBy: req.user._id });
    }
    res.json(caseData);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addHearing = async (req, res) => {
  try {
    const { date, description, court } = req.body;
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: 'Case not found' });
    caseData.hearings.push({ date, description, court });
    caseData.nextHearingDate = new Date(date);
    caseData.status = 'Hearing';
    await caseData.save();
    await CaseTimeline.create({ caseId: caseData._id, activity: `Hearing scheduled for ${new Date(date).toDateString()}`, performedBy: req.user._id });
    res.json(caseData);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.uploadCaseDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });
    const docs = req.files.map(f => ({ name: f.originalname, url: `/uploads/${f.filename}`, type: f.mimetype, uploadedAt: new Date() }));
    const caseData = await Case.findByIdAndUpdate(req.params.id, { $push: { documents: { $each: docs } } }, { new: true });
    await CaseTimeline.create({ caseId: req.params.id, activity: `${docs.length} document(s) uploaded`, performedBy: req.user._id });
    res.json({ message: 'Documents uploaded', documents: docs });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addTimelineEntry = async (req, res) => {
  try {
    const entry = await CaseTimeline.create({ caseId: req.params.id, ...req.body, performedBy: req.user._id });
    res.status(201).json(entry);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
