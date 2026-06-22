const router = require('express').Router();
const { getDashboard, getUsers, deleteUser, updateProfile, getRatings } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/auth');

router.get('/dashboard',      protectAdmin, getDashboard);
router.get('/users',          protectAdmin, getUsers);
router.delete('/users/:id',   protectAdmin, deleteUser);
router.put('/profile',        protectAdmin, updateProfile);
router.get('/ratings',        protectAdmin, getRatings);

module.exports = router;
