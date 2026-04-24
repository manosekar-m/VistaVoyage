const router = require('express').Router();
const { getDashboard, getUsers, deleteUser, updateProfile } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/auth');

router.get('/dashboard',      protectAdmin, getDashboard);
router.get('/users',          protectAdmin, getUsers);
router.delete('/users/:id',   protectAdmin, deleteUser);
router.put('/profile',        protectAdmin, updateProfile);

module.exports = router;
