/**
 * Payment Controller - Stripe Integration
 */
const Booking = require('../models/Booking');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_123'); // Fallback for local testing

// POST /api/payment/create-checkout-session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('package');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: booking.package.title,
            },
            unit_amount: booking.totalAmount * 100, // Stripe expects amount in cents/paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/my-bookings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/booking/${booking.package._id}`,
      client_reference_id: bookingId.toString(),
    });

    res.json({ success: true, sessionId: session.id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/payment/webhook
exports.webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_123');
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.client_reference_id;

    try {
      await Booking.findByIdAndUpdate(bookingId, { 
        status: 'Confirmed', 
        paymentStatus: 'Paid', 
        paymentId: session.payment_intent 
      });
      console.log(`Booking ${bookingId} payment confirmed via webhook`);
    } catch (err) {
      console.error(`Failed to update booking ${bookingId}:`, err);
    }
  }

  res.status(200).json({ received: true });
};

