/**
 * Payment Controller - Dummy payment simulation
 */
const Booking = require('../models/Booking');
const { sendBookingConfirmation } = require('../services/emailService');

// POST /api/payment/process
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, cardNumber, cardName, expiry, cvv } = req.body;

    // Validate dummy card (any 16-digit number works)
    if (!cardNumber || cardNumber.replace(/\s/g,'').length !== 16)
      return res.status(400).json({ success: false, message: 'Invalid card number' });

    // Simulate processing delay
    await new Promise(r => setTimeout(r, 1500));

    // Generate dummy transaction ID
    const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Update booking
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'Confirmed', paymentStatus: 'Paid', paymentId },
      { new: true }
    ).populate('package', 'title location images');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Async email send - Only after successful payment, with a 3-second delay as requested
    setTimeout(() => {
      sendBookingConfirmation(booking).catch(console.error);
    }, 3000);

    res.json({ success: true, message: 'Payment successful!', paymentId, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
