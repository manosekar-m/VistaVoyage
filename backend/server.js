const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL, 
  'http://localhost:3000', 
  'https://vistavoyage-frontend.onrender.com',
  'https://vistavoyage-frontend.onrender.com/'
].filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('onrender.com')) {
      callback(null, true);
    } else {
      console.log('[CORS] Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/admin',     require('./routes/adminRoutes'));
app.use('/api/packages',  require('./routes/packageRoutes'));
app.use('/api/bookings',  require('./routes/bookingRoutes'));
app.use('/api/feedback',  require('./routes/feedbackRoutes'));
app.use('/api/users',     require('./routes/userRoutes'));
app.use('/api/ai-planner', require('./routes/aiRoutes'));
app.use('/api/payment',   require('./routes/paymentRoutes'));
app.use('/api/coupons',   require('./routes/couponRoutes'));
app.use('/api/queries',   require('./routes/queryRoutes'));
app.use('/api/reviews',   require('./routes/reviewRoutes'));

// ── Seed Admin ──────────────────────────────────────────────
app.get('/api/seed-admin', async (req, res) => {
  try {
    const Admin = require('./models/Admin');
    const existing = await Admin.findOne({ email: 'admin@vistavoyage.com' });
    if (existing) return res.json({ message: 'Admin already exists' });
    
    await Admin.create({ 
      name: 'System Admin', 
      email: 'admin@vistavoyage.com', 
      password: 'Admin@123' 
    });
    res.json({ message: 'Admin created successfully! You can now login.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({ 
    status: 'ok', 
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});
app.get('/', (req, res) => res.json({ message: 'VistaVoyage API is running 🌍' }));

// ── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ── Connect DB & Start Server ───────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    family: 4
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} [v2: ${new Date().toLocaleTimeString()}]`));
  })
  .catch(err => { 
    console.error('❌ MongoDB error:', err); 
    process.exit(1); 
  });
