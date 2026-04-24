const router = require('express').Router();
const { processPayment } = require('../controllers/paymentController');
const { protectUser } = require('../middleware/auth');

router.post('/process', protectUser, processPayment);

module.exports = router;
