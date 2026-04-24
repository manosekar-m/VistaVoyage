const router = require('express').Router();
const { registerUser, loginUser, loginAdmin, getMe, getAdminMe } = require('../controllers/authController');
const { protectUser, protectAdmin } = require('../middleware/auth');

router.post('/register',      registerUser);
router.post('/login',         loginUser);
router.post('/admin/login',   loginAdmin);
router.get('/me',             protectUser,  getMe);
router.get('/admin/me',       protectAdmin, getAdminMe);

module.exports = router;
