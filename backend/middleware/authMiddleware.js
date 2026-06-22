/**
 * JWT Authentication Middleware
 * Protects routes for both users and admins
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Protect user routes
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

// Protect admin routes
const adminProtect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });

    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) return res.status(401).json({ success: false, message: 'Admin not found' });
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

// Generate JWT token
const generateToken = (id, role = 'user') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

module.exports = { protect, adminProtect, generateToken };
