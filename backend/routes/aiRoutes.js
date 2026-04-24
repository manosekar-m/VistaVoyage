const router = require('express').Router();
const { chat, generateItinerary, getAIPlans, updatePlanStatus, deletePlan, sendPlanEmail } = require('../controllers/aiController');
const { protectUser, protectAdmin } = require('../middleware/auth');

router.post('/chat', chat);
router.post('/generate-itinerary', protectUser, generateItinerary);

// Admin Routes
router.get('/all', protectAdmin, getAIPlans);
router.put('/:id/status', protectAdmin, updatePlanStatus);
router.delete('/:id', protectAdmin, deletePlan);
router.post('/:id/email', protectAdmin, sendPlanEmail);

module.exports = router;
