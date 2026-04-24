const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  location:    { type: String, required: true },
  price:       { type: Number, required: true },
  childPrice:  { type: Number },
  duration:    { type: Number, required: true }, // days
  description: { type: String, required: true },
  images:      [{ type: String }],
  highlights:  [{ type: String }],
  category:    { type: String, enum: ['Adventure', 'Romantic', 'Family', 'Pilgrimage', 'Luxury', 'Budget'], default: 'Adventure' },
  status:      { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  destinationCity: { type: String },
  destinationState: { type: String },
  destinationCountry: { type: String },
  coordinates: {
    lat: { type: Number, default: 28.6139 }, // Default Delhi
    lng: { type: Number, default: 77.2090 }
  },
  nights: { type: Number },
  startingLocation: { type: String },
  bestTimeToVisit: { type: String },
  itinerary: [{
    day: { type: Number },
    title: { type: String },
    activities: [{ type: String }]
  }],
  includedActivities: [{ type: String }],
  availableFoodOptions: [{ type: String }],
  availableStayOptions: [{ type: String }],
  travelTips: {
    localCulture:       { type: String, default: '' },
    safetyTips:         { type: String, default: '' },
    weather:            { type: String, default: '' },
    clothingSuggestions:{ type: String, default: '' },
  },
  averageRating: { type: Number, default: 0 },
  totalReviews:  { type: Number, default: 0 },
  totalSlots:    { type: Number, default: 20 },
  bookedSlots:   { type: Number, default: 0 },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
