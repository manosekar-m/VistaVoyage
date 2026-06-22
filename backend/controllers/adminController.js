/**
 * Admin Controller - Dashboard stats, user management, profile
 */
const User     = require('../models/User');
const Booking  = require('../models/Booking');
const Feedback = require('../models/Feedback');
const Package  = require('../models/Package');
const Admin    = require('../models/Admin');
const bcrypt   = require('bcryptjs');

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalBookings, feedbackCount, packages] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Feedback.countDocuments({ status: 'Open' }),
      Package.countDocuments({ status: 'Active' }),
    ]);

    // Total revenue from confirmed/paid bookings
    const revenueData = await Booking.aggregate([
      { $match: { status: 'Confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Monthly bookings for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({ success: true, stats: { totalUsers, totalBookings, totalRevenue, feedbackCount, activePackages: packages }, monthlyBookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/ratings
exports.getRatings = async (req, res) => {
  try {
    const ratings = await Booking.find({ rating: { $gt: 0 } })
      .populate('user', 'name')
      .populate('package', 'title')
      .select('bookingId travelDate rating createdAt user package')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: ratings.length, ratings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (name)  admin.name  = name;
    if (phone) admin.phone = phone;

    if (currentPassword && newPassword) {
      const match = await admin.matchPassword(currentPassword);
      if (!match) return res.status(400).json({ success: false, message: 'Current password incorrect' });
      admin.password = await bcrypt.hash(newPassword, 12);
    }

    await admin.save();
    res.json({ success: true, admin: { _id: admin._id, name: admin.name, email: admin.email, phone: admin.phone } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/export/bookings  (Admin - CSV export)
exports.exportBookingsCSV = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('package', 'title')
      .sort({ createdAt: -1 });

    const rows = bookings.map(b => [
      b.bookingId || b._id,
      b.user?.name || '',
      b.user?.email || '',
      b.package?.title || '',
      new Date(b.travelDate).toLocaleDateString(),
      b.persons,
      b.children,
      b.status,
      b.paymentStatus,
      b.totalAmount,
    ]);

    const csvContent = [
      ['BookingID','User','Email','Package','Travel Date','Adults','Children','Status','Payment','Amount'],
      ...rows,
    ].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="bookings.csv"');
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/export/users  (Admin - CSV export)
exports.exportUsersCSV = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const rows = users.map(u => [
      u._id,
      u.name,
      u.email,
      u.phone,
      u.isActive ? 'Active' : 'Inactive',
      new Date(u.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      ['UserID','Name','Email','Phone','Status','Joined'],
      ...rows,
    ].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
