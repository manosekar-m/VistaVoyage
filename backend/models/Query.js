const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status:  { 
    type: String, 
    enum: ['Pending', 'Action Taken', 'Cancelled'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Query', querySchema);
