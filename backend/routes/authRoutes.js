const router = require('express').Router();
const { registerUser, loginUser, loginAdmin, getMe, getAdminMe } = require('../controllers/authController');
const { protectUser, protectAdmin } = require('../middleware/auth');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

router.post('/register',      registerUser);
router.post('/login',         loginUser);
router.post('/admin/login',   loginAdmin);
router.get('/me',             protectUser,  getMe);
router.get('/admin/me',       protectAdmin, getAdminMe);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google_failed` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const userData = JSON.stringify({ _id: req.user._id, name: req.user.name, email: req.user.email });
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?token=${token}&user=${encodeURIComponent(userData)}`);
  }
);

module.exports = router;
