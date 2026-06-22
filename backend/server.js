/**
 * VistaVoyage - Main Server Entry Point
 * Initializes Express app, connects MongoDB, registers all routes
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
// ── Stripe Webhook (must be before express.json) ──────────────
app.post('/api/payment/webhook', express.raw({type: 'application/json'}), require('./controllers/paymentController').webhookHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', require('express').static(require('path').join(__dirname, 'uploads')));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/admin',     require('./routes/adminRoutes'));
app.use('/api/packages',  require('./routes/packageRoutes'));
app.use('/api/bookings',  require('./routes/bookingRoutes'));
app.use('/api/feedback',  require('./routes/feedbackRoutes'));
app.use('/api/users',     require('./routes/userRoutes'));
app.use('/api/ai',        require('./routes/aiRoutes'));
app.use('/api/payment',   require('./routes/paymentRoutes'));
app.use('/api/promos',    require('./routes/promoRoutes'));
app.use('/api/queries',   require('./routes/queryRoutes'));
app.use('/api/reviews',   require('./routes/reviewRoutes'));
// ── Health Check ────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'VistaVoyage API is running 🌍' }));

// ── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ── Connect DB & Start Server ───────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch(err => { 
    console.error('⚠️  MongoDB connection error:', err.message);
    console.log('⚠️  Server will run without database - reconnection attempts will continue');
  });

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

