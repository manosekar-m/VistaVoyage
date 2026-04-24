const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET /api/users/profile
exports.getProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (name)  user.name  = name;
    if (phone) user.phone = phone;
    if (req.file) user.avatar = req.file.path;

    if (currentPassword && newPassword) {
      const match = await user.matchPassword(currentPassword);
      if (!match) return res.status(400).json({ success: false, message: 'Current password incorrect' });
      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();
    res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, wishlist: user.wishlist } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/users/wishlist/:packageId
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pkgId = req.params.packageId;
    
    const index = user.wishlist.indexOf(pkgId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
      await user.save();
      return res.json({ success: true, message: 'Removed from wishlist', wishlist: user.wishlist });
    } else {
      user.wishlist.push(pkgId);
      await user.save();
      return res.json({ success: true, message: 'Added to wishlist', wishlist: user.wishlist });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
