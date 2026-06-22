const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId:   { type: String, unique: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package:     { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  travelDate:  { type: Date, required: true },
  persons:     { type: Number, required: true, min: 1 }, // Adults
  children:    { type: Number, default: 0, min: 0 },
  foodType:    { type: String, enum: ['Veg', 'Non-Veg', 'Special + Pub activities'], default: 'Veg' },
  totalAmount: { type: Number, required: true },
  status:      { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  paymentId:   { type: String, default: '' },
  promoCode:   { type: String, default: '' },
  discountAmount: { type: Number, default: 0 },
  rating:      { type: Number, min: 0, max: 5, default: 0 },
  roomType:    { type: String, enum: ['5 Star', '4 Star', '3 Star'], required: true },
}, { timestamps: true });

// Auto-generate booking ID
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `VV${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
