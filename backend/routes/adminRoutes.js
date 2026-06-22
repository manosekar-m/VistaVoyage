const router = require('express').Router();
const { getDashboard, getUsers, deleteUser, updateProfile, getRatings, exportBookingsCSV, exportUsersCSV } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/auth');

router.get('/dashboard',          protectAdmin, getDashboard);
router.get('/users',              protectAdmin, getUsers);
router.delete('/users/:id',       protectAdmin, deleteUser);
router.put('/profile',            protectAdmin, updateProfile);
router.get('/ratings',            protectAdmin, getRatings);
router.get('/export/bookings',    protectAdmin, exportBookingsCSV);
router.get('/export/users',       protectAdmin, exportUsersCSV);

module.exports = router;
