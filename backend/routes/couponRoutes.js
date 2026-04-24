const express = require('express');
const router = express.Router();
const { createCoupon, getCoupons, updateCoupon, deleteCoupon, applyCoupon } = require('../controllers/couponController');
const { protectUser, protectAdmin } = require('../middleware/auth');

// Admin routes
router.post('/', protectAdmin, createCoupon);
router.get('/', protectAdmin, getCoupons);
router.put('/:id', protectAdmin, updateCoupon);
router.delete('/:id', protectAdmin, deleteCoupon);

// User route
router.post('/apply', protectUser, applyCoupon);

module.exports = router;
