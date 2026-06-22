/**
 * Auth Controller - User & Admin login/register
 */
const User  = require('../models/User');
const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// ── USER AUTH ────────────────────────────────────────────────

// POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const user  = await User.create({ name, email, password, phone });
    const token = generateToken(user._id, 'user');

    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to VistaVoyage!',
        message: `Hi ${user.name},\n\nWelcome to VistaVoyage! We're thrilled to have you on board. Start exploring our amazing travel packages today.\n\nBest regards,\nThe VistaVoyage Team`
      });
    } catch (error) {
      console.error('Welcome email could not be sent:', error);
    }

    res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact support.' });

    const token = generateToken(user._id, 'user');
    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN AUTH ───────────────────────────────────────────────

// POST /api/auth/admin/login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });

    const token = generateToken(admin._id, 'admin');
    res.json({ success: true, token, admin: { _id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me  (user)
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// GET /api/auth/admin/me
exports.getAdminMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};
