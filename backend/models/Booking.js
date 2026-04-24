const mongoose = require('mongoose');
const Counter = require('./Counter');

const bookingSchema = new mongoose.Schema({
  bookingId:   { type: String, unique: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package:     { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  travelDate:  { type: Date, required: true },
  persons:     { type: Number, required: true, min: 1 },
  adults:      { type: Number, default: 1 },
  children:    { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  discountApplied: { type: Number, default: 0 },
  couponCode:  { type: String, default: '' },
  foodPreference: { type: String, required: true, default: 'Not Specified' },
  stayPreference: { type: String, required: true, default: 'Not Specified' },
  status:      { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  paymentId:   { type: String, default: '' },
  rating:      { type: Number, min: 1, max: 5 },
  pointsEarned: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-generate booking ID
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    try {
      let attempts = 0;
      let success = false;
      
      while (attempts < 10 && !success) {
        const counter = await Counter.findOneAndUpdate(
          { id: 'bookings' },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        const newId = `VV${String(counter.seq).padStart(5, '0')}`;
        
        // Double check if this ID exists (to handle manual sync issues)
        const exists = await mongoose.model('Booking').findOne({ bookingId: newId });
        if (!exists) {
          this.bookingId = newId;
          success = true;
        }
        attempts++;
      }
      
      if (!success) {
        return next(new Error('Could not generate unique Booking ID. Please contact support.'));
      }
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
