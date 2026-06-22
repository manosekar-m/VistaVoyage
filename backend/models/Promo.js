const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Promo', promoSchema);
