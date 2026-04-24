const Review = require('../models/Review');
const Package = require('../models/Package');
const Booking = require('../models/Booking');

// GET /api/reviews/:packageId
exports.getPackageReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ package: req.params.packageId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { packageId, rating, comment, images } = req.body;
    
    // Check if user has already reviewed this package
    const existing = await Review.findOne({ user: req.user._id, package: packageId });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this package' });

    // Optional: Check if user has a confirmed booking for this package
    const booking = await Booking.findOne({ 
      user: req.user._id, 
      package: packageId, 
      status: 'Confirmed' 
    });

    const review = await Review.create({
      user: req.user._id,
      package: packageId,
      rating: Number(rating),
      comment,
      images: images || []
    });

    // Update Package rating stats
    const allReviews = await Review.find({ package: packageId });
    const count = allReviews.length;
    const avg = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / count;

    await Package.findByIdAndUpdate(packageId, {
      averageRating: Number(avg.toFixed(1)),
      totalReviews: count
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    // Update stats again
    const allReviews = await Review.find({ package: review.package });
    const count = allReviews.length;
    const avg = count > 0 ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) / count : 0;

    await Package.findByIdAndUpdate(review.package, {
      averageRating: Number(avg.toFixed(1)),
      totalReviews: count
    });

    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
