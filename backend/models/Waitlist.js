const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  travelDate: { type: Date, required: true },
  status:  { type: String, enum: ['Waiting', 'Notified', 'Booked'], default: 'Waiting' },
  notifiedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Waitlist', waitlistSchema);
