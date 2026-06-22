const Promo = require('../models/Promo');

// Admin: Get all promos
exports.getPromos = async (req, res) => {
  try {
    const promos = await Promo.find().sort({ createdAt: -1 });
    res.json({ success: true, count: promos.length, promos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Create promo
exports.createPromo = async (req, res) => {
  try {
    const { code, discount, expiryDate, isActive } = req.body;
    const existing = await Promo.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(400).json({ success: false, message: 'Promo code already exists' });

    const promo = await Promo.create({ code, discount, expiryDate, isActive });
    res.status(201).json({ success: true, promo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update promo
exports.updatePromo = async (req, res) => {
  try {
    const { code, discount, expiryDate, isActive } = req.body;
    const promo = await Promo.findByIdAndUpdate(
      req.params.id,
      { code, discount, expiryDate, isActive },
      { new: true, runValidators: true }
    );
    if (!promo) return res.status(404).json({ success: false, message: 'Promo not found' });
    res.json({ success: true, promo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Delete promo
exports.deletePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);
    if (!promo) return res.status(404).json({ success: false, message: 'Promo not found' });
    res.json({ success: true, message: 'Promo deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// User: Validate promo
exports.validatePromo = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Promo code is required' });

    const promo = await Promo.findOne({ code: code.toUpperCase(), isActive: true });
    if (!promo) return res.status(404).json({ success: false, message: 'Invalid or inactive promo code' });

    if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'Promo code has expired' });
    }

    res.json({ success: true, discount: promo.discount, message: 'Promo code applied successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
