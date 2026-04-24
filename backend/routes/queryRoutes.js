const express = require('express');
const router = express.Router();
const { submitQuery, getQueries, updateQueryStatus } = require('../controllers/queryController');
const { protectAdmin } = require('../middleware/auth');

// Public route for form submissions
router.post('/', submitQuery);

// Protected Admin routes
router.get('/', protectAdmin, getQueries);
router.put('/:id/status', protectAdmin, updateQueryStatus);

module.exports = router;
