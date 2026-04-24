/**
 * Auth Controller - User & Admin login/register
 */
const User  = require('../models/User');
const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

// ── USER AUTH ────────────────────────────────────────────────

// POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const referralCode = name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    const user  = await User.create({ name, email, password, phone, referralCode });
    const token = generateToken(user._id, 'user');

    res.status(201).json({ 
      success: true, 
      token, 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        loyaltyPoints: user.loyaltyPoints,
        membershipTier: user.membershipTier,
        referralCode: user.referralCode
      } 
    });
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
    res.json({ 
      success: true, 
      token, 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        loyaltyPoints: user.loyaltyPoints,
        membershipTier: user.membershipTier,
        referralCode: user.referralCode
      } 
    });
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
