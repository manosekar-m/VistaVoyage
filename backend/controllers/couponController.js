const Coupon = require('../models/Coupon');

exports.createCoupon = async (req, res) => {
  try {
    const { code, discountAmount, validUntil, isActive } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });
    
    const normalizedCode = code.toString().replace(/\s/g, '').toUpperCase();
    const existing = await Coupon.findOne({ code: normalizedCode });
    if (existing) return res.status(400).json({ message: 'Coupon code already exists' });

    const coupon = await Coupon.create({
      code: normalizedCode,
      discountAmount,
      validUntil,
      isActive,
      createdBy: req.admin._id
    });
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ message: 'Error creating coupon', error: error.message });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupons', error: error.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { isActive, validUntil } = req.body;
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, { isActive, validUntil }, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ message: 'Error updating coupon', error: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting coupon', error: error.message });
  }
};

exports.applyCoupon = async (req, res) => {
  console.log('[Coupon] Request Body:', JSON.stringify(req.body));
  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') return res.status(400).json({ message: 'Valid coupon code is required' });
    
    const normalizedCode = code.toString().replace(/\s/g, '').toUpperCase();
    console.log(`[Coupon] Normalized Input: "${normalizedCode}"`);
    
    const coupon = await Coupon.findOne({ code: normalizedCode });
    
    if (!coupon) {
      const allCoupons = await Coupon.find({}, 'code');
      console.log(`[Coupon] NOT FOUND: "${normalizedCode}". Available codes:`, allCoupons.map(c => c.code));
      return res.status(404).json({ message: 'Invalid coupon code' });
    }
    
    if (!coupon.isActive) return res.status(400).json({ message: 'This coupon is no longer active' });
    
    // Set expiry to the end of the day (23:59:59.999) to be user-friendly
    const expiryDate = new Date(coupon.validUntil);
    expiryDate.setHours(23, 59, 59, 999);
    
    if (expiryDate < new Date()) return res.status(400).json({ message: 'This coupon has expired' });

    console.log(`[Coupon] Applied successfully: "${normalizedCode}" - Discount: ₹${coupon.discountAmount}`);
    res.json({ success: true, discountAmount: coupon.discountAmount, message: 'Coupon applied successfully' });
  } catch (error) {
    console.error(`[Coupon] Apply error:`, error);
    res.status(500).json({ message: 'Error applying coupon', error: error.message });
  }
};
