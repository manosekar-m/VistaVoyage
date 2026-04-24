const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject:    { type: String, required: true },
  message:    { type: String, required: true },
  adminReply: { type: String, default: '' },
  repliedAt:  { type: Date },
  status:     { type: String, enum: ['Open', 'Replied'], default: 'Open' },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
