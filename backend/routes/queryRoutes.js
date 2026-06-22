const express = require('express');
const router  = express.Router();
const queryController = require('../controllers/queryController');
const { protectAdmin } = require('../middleware/auth');


router.post('/', queryController.createQuery);
router.get('/', protectAdmin, queryController.getQueries);
router.patch('/:id/status', protectAdmin, queryController.updateQueryStatus);

module.exports = router;
