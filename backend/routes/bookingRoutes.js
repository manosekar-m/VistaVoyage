const router = require('express').Router();
const { createBooking, getMyBookings, cancelBooking, deleteBooking, getAllBookings, updateBookingStatus, rateBooking, joinWaitlist } = require('../controllers/bookingController');
const { protectUser, protectAdmin } = require('../middleware/auth');

router.post('/',              protectUser,  createBooking);
router.post('/waitlist',     protectUser,  joinWaitlist);
router.get('/my',             protectUser,  getMyBookings);
router.put('/:id/cancel',     protectUser,  cancelBooking);
router.delete('/:id',         protectUser,  deleteBooking);
router.put('/:id/rate',       protectUser,  rateBooking);
router.get('/',               protectAdmin, getAllBookings);
router.put('/:id/status',     protectAdmin, updateBookingStatus);

module.exports = router;
