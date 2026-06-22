const express = require('express');
const router = express.Router();
const { addReview, getPackageReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addReview);
router.get('/package/:packageId', getPackageReviews);

module.exports = router;
