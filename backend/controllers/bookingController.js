/**
 * Booking Controller
 */
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const Waitlist = require('../models/Waitlist');
const { sendBookingConfirmation } = require('../services/emailService');

// POST /api/bookings  (User)
exports.createBooking = async (req, res) => {
  try {
    const { packageId, travelDate, adults, children, couponCode, foodPreference, stayPreference, usePoints } = req.body;
    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    if (pkg.status !== 'Active') return res.status(400).json({ success: false, message: 'Package not available' });

    if (pkg.bookedSlots >= pkg.totalSlots) {
      return res.status(400).json({ 
        success: false, 
        message: 'This package is currently sold out.', 
        isSoldOut: true 
      });
    }

    const user = await User.findById(req.user._id);

    const numAdults = Number(adults) || 1;
    const numChildren = Number(children) || 0;
    const childCost = pkg.childPrice || Math.round(pkg.price * 0.5);
    let totalAmount = (pkg.price * numAdults) + (childCost * numChildren);
    let discountApplied = 0;
    let pointsUsed = 0;

    if (couponCode && typeof couponCode === 'string') {
      const normalizedCode = couponCode.replace(/\s/g, '').toUpperCase();
      const coupon = await Coupon.findOne({ code: normalizedCode });
      if (coupon && coupon.isActive) {
        const expiryDate = new Date(coupon.validUntil);
        expiryDate.setHours(23, 59, 59, 999);
        
        if (expiryDate >= new Date()) {
          discountApplied = coupon.discountAmount;
          totalAmount = Math.max(0, totalAmount - discountApplied);
        }
      }
    }

    if (usePoints && user.loyaltyPoints > 0) {
      pointsUsed = Math.min(user.loyaltyPoints, totalAmount);
      totalAmount -= pointsUsed;
      user.loyaltyPoints -= pointsUsed;
    }

    const booking = await Booking.create({
      user: user._id,
      package: pkg._id,
      name:  user.name,
      email: user.email,
      phone: user.phone,
      travelDate: new Date(travelDate),
      persons: numAdults + numChildren,
      adults: numAdults,
      children: numChildren,
      foodPreference: foodPreference || 'Not Specified',
      stayPreference: stayPreference || 'Not Specified',
      totalAmount,
      discountApplied: discountApplied + pointsUsed,
      couponCode: couponCode ? couponCode.toUpperCase() : '',
      pointsEarned: Math.floor(totalAmount / 100)
    });

    // Grant points to user
    await user.updateLoyalty(booking.pointsEarned);

    // Update slots
    pkg.bookedSlots += 1;
    await pkg.save();

    const populated = await booking.populate('package', 'title location images');
    
    res.status(201).json({ success: true, booking: populated, user: { loyaltyPoints: user.loyaltyPoints, membershipTier: user.membershipTier } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/bookings/my  (User - own bookings)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('package', 'title location price duration images')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/bookings/:id/cancel  (User)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'Cancelled') return res.status(400).json({ success: false, message: 'Already cancelled' });

    booking.status = 'Cancelled';
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/bookings/:id  (User)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/bookings  (Admin - all bookings)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('package', 'title location')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/bookings/:id/status  (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('user', 'name email')
      .populate('package', 'title');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/bookings/:id/rate  (User)
exports.rateBooking = async (req, res) => {
  try {
    const { rating } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    booking.rating = Number(rating);
    await booking.save();

    // Update Package aggregate rating
    const allBookings = await Booking.find({ package: booking.package, rating: { $exists: true, $ne: null } });
    
    const count = allBookings.length;
    const avg = count > 0 
      ? allBookings.reduce((acc, curr) => acc + curr.rating, 0) / count 
      : 0;

    await Package.findByIdAndUpdate(booking.package, {
      averageRating: Number(avg.toFixed(1)),
      totalReviews: count
    });

    res.json({ success: true, message: 'Rating submitted', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/bookings/waitlist (User)
exports.joinWaitlist = async (req, res) => {
  try {
    const { packageId, travelDate } = req.body;
    
    const wait = await Waitlist.create({
      user: req.user._id,
      package: packageId,
      travelDate: new Date(travelDate)
    });

    res.status(201).json({ success: true, message: 'Added to waitlist. We will notify you if a slot opens up!', wait });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

