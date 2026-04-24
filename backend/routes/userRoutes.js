const router = require('express').Router();
const { getProfile, updateProfile, toggleWishlist, getWishlist } = require('../controllers/userController');
const { protectUser } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile',  protectUser, getProfile);
router.put('/profile',  protectUser, upload.single('avatar'), updateProfile);
router.post('/wishlist/:packageId', protectUser, toggleWishlist);
router.get('/wishlist', protectUser, getWishlist);

module.exports = router;
