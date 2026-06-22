const router = require('express').Router();
const { createFeedback, getMyFeedback, getAllFeedback, replyFeedback } = require('../controllers/feedbackController');
const { protectUser, protectAdmin } = require('../middleware/auth');

router.post('/',              protectUser,  createFeedback);
router.get('/my',             protectUser,  getMyFeedback);
router.get('/',               protectAdmin, getAllFeedback);
router.put('/:id/reply',      protectAdmin, replyFeedback);

module.exports = router;
