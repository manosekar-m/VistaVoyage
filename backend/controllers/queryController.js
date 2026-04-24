const mongoose = require('mongoose');
const Query = require('../models/Query');

// POST /api/queries - Public: submit a new contact query
exports.submitQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if(!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const query = await Query.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully', query });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/queries - Admin: Get all queries
exports.getQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json({ success: true, count: queries.length, queries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/queries/:id/status - Admin: Update query status (Accepted/Rejected)
exports.updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const query = await Query.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }

    res.json({ success: true, message: 'Query status updated', query });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
