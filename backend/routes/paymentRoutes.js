const router = require('express').Router();
const { createCheckoutSession } = require('../controllers/paymentController');
const { protectUser } = require('../middleware/auth');

router.post('/create-checkout-session', protectUser, createCheckoutSession);

module.exports = router;
