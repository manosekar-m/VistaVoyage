/**
 * Feedback Controller
 */
const Feedback = require('../models/Feedback');

// POST /api/feedback  (User)
exports.createFeedback = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message)
      return res.status(400).json({ success: false, message: 'Subject and message required' });

    const feedback = await Feedback.create({ user: req.user._id, subject, message });
    const populated = await feedback.populate('user', 'name email');
    res.status(201).json({ success: true, feedback: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/feedback/my  (User)
exports.getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/feedback  (Admin)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/feedback/:id/reply  (Admin)
exports.replyFeedback = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ success: false, message: 'Reply text required' });

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { adminReply: reply, repliedAt: new Date(), status: 'Replied' },
      { new: true }
    ).populate('user', 'name email');

    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });
    res.json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
