const mongoose = require('mongoose');

const aiPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  days: { type: Number, required: true },
  travelers: { type: String, required: true },
  preferences: { type: String },
  result: {
    title: String,
    summary: String,
    itinerary: [{
      day: Number,
      title: String,
      activities: [String]
    }],
    travelTips: String
  },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  emailsSent: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('AIPlan', aiPlanSchema);
