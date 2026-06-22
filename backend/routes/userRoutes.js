const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protectUser } = require('../middleware/auth');

router.get('/profile',  protectUser, getProfile);
router.put('/profile',  protectUser, updateProfile);

router.get('/wishlist', protectUser, require('../controllers/userController').getWishlist);
router.post('/wishlist/:packageId', protectUser, require('../controllers/userController').toggleWishlist);

module.exports = router;
