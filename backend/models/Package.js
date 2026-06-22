const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  destination: {
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    country: { type: String, required: true },
  },
  duration: {
    days:    { type: Number, required: true },
    nights:  { type: Number, required: true },
  },
  startingLocation: { type: String, required: true },
  price:       { type: Number, required: true },
  description: { type: String, required: true },
  images:      [{ type: String }],
  highlights:  [{ type: String }],
  itinerary:   [{ type: String }], // Day-wise plan
  travelTips: {
    culture:  { type: String, default: '' },
    safety:   { type: String, default: '' },
    weather:  { type: String, default: '' },
    clothing: { type: String, default: '' },
  },
  status:      { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  averageRating: { type: Number, default: 0 },
  totalRatings:  { type: Number, default: 0 },
  bestTimeToVisit: { type: String, default: 'Year-round' },
  childPrice:    { type: Number, default: 0 },
  roomTypes:     [{ type: String, enum: ['5 Star', '4 Star', '3 Star'] }],
  activities:    [{ type: String, default: [] }],
  coordinates:   {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
