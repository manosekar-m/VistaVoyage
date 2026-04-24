const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone:    { type: String, required: true },
  avatar:   { type: String, default: '' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Package' }],
  loyaltyPoints: { type: Number, default: 0 },
  membershipTier: { type: String, enum: ['Explorer', 'Voyager', 'Elite'], default: 'Explorer' },
  referralCode: { type: String, unique: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function(entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.updateLoyalty = async function(pointsEarned) {
  this.loyaltyPoints += pointsEarned;
  
  if (this.loyaltyPoints >= 2000) this.membershipTier = 'Elite';
  else if (this.loyaltyPoints >= 500) this.membershipTier = 'Voyager';
  else this.membershipTier = 'Explorer';
  
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
