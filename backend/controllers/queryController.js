const Query = require('../models/Query');

// POST /api/queries - Public: Submit a new contact message
exports.createQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const query = await Query.create({ name, email, subject, message });
    res.status(201).json({ success: true, query });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/queries - Admin: Fetch all queries
exports.getQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json({ success: true, count: queries.length, queries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/queries/:id/status - Admin: Update status
exports.updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const query = await Query.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: true }
    );
    if (!query) return res.status(404).json({ success: false, message: 'Query not found' });
    res.json({ success: true, query });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
