const router = require('express').Router();
const { getPackageReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protectUser } = require('../middleware/auth');

router.get('/:packageId', getPackageReviews);
router.post('/', protectUser, createReview);
router.delete('/:id', protectUser, deleteReview);

module.exports = router;
