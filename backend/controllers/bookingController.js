/**
 * Booking Controller
 */
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const sendEmail = require('../utils/sendEmail');

// POST /api/bookings  (User)
exports.createBooking = async (req, res) => {
  try {
    const { packageId, travelDate, persons, children, promoCode, foodType, roomType } = req.body;
    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    if (pkg.status !== 'Active') return res.status(400).json({ success: false, message: 'Package not available' });

    const numAdults = Number(persons || 1);
    const numChildren = Number(children || 0);
    let totalAmount = (pkg.price * numAdults) + ((pkg.childPrice || 0) * numChildren);
    let discountAmount = 0;

    // Apply Promo if provided
    if (promoCode) {
      const Promo = require('../models/Promo');
      const promo = await Promo.findOne({ code: promoCode.toUpperCase(), isActive: true });
      if (promo) {
        // Simple expiry check
        if (!promo.expiryDate || new Date(promo.expiryDate) > new Date()) {
          discountAmount = Math.round((totalAmount * promo.discount) / 100);
          totalAmount -= discountAmount;
        }
      }
    }

    const booking = await Booking.create({
      user: req.user._id,
      package: pkg._id,
      name:  req.user.name,
      email: req.user.email,
      phone: req.body.phone || req.user.phone,
      travelDate: new Date(travelDate),
      persons: numAdults,
      children: numChildren,
      totalAmount,
      promoCode: promoCode ? promoCode.toUpperCase() : '',
      discountAmount,
      foodType: foodType || 'Veg',
      roomType: roomType || '3 Star',
    });

    const populated = await booking.populate('package', 'title location images');

    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Booking Initialized - VistaVoyage',
        message: `Hi ${req.user.name},\n\nYour booking for ${pkg.title} has been initialized. \n\nTotal Amount: ₹${totalAmount}\nBooking ID: ${booking._id}\n\nPlease proceed to payment to confirm your booking.\n\nBest regards,\nThe VistaVoyage Team`
      });
    } catch (error) {
      console.error('Booking email could not be sent:', error);
    }

    res.status(201).json({ success: true, booking: populated });
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
    if (booking.status === 'Confirmed') return res.status(400).json({ success: false, message: 'Cannot cancel a confirmed booking' });

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
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'Confirmed') return res.status(400).json({ success: false, message: 'Confirmed bookings cannot be removed' });

    await booking.deleteOne();
    res.json({ success: true, message: 'Booking removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/bookings/:id/rate (User)
exports.rateBooking = async (req, res) => {
  try {
    const { rating } = req.body;
    console.log(`[rateBooking] rating requested:`, rating, 'for package:', req.params.id);
    if (!rating || rating < 1 || rating > 5) {
      console.log(`[rateBooking] invalid rating`);
      return res.status(400).json({ success: false, message: 'Valid rating between 1 and 5 is required' });
    }

    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) {
      console.log(`[rateBooking] booking not found`);
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.status !== 'Confirmed') {
      console.log(`[rateBooking] booking not confirmed. Status:`, booking.status);
      return res.status(400).json({ success: false, message: 'Only confirmed bookings can be rated' });
    }

    booking.rating = rating;
    await booking.save();
    console.log(`[rateBooking] saved rating to booking`);

    // Recalculate average rating for the package
    const stats = await Booking.aggregate([
      { $match: { package: booking.package, rating: { $gt: 0 } } },
      { $group: { _id: '$package', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
      await Package.findByIdAndUpdate(booking.package, {
        averageRating: Math.round(stats[0].avgRating * 10) / 10,
        totalRatings: stats[0].count
      });
      console.log(`[rateBooking] saved package stats:`, stats[0]);
    }

    res.json({ success: true, message: 'Rating submitted successfully', booking });
  } catch (err) {
    console.error(`[rateBooking] Server Error:`, err);
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
