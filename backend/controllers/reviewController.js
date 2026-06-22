const Review = require('../models/Review');
const Package = require('../models/Package');

// Add a review
exports.addReview = async (req, res) => {
  try {
    const { packageId, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if user already reviewed
    const existingReview = await Review.findOne({ user: userId, package: packageId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this package' });
    }

    const review = await Review.create({
      user: userId,
      package: packageId,
      rating: Number(rating),
      comment
    });

    // Update package average rating
    const pkg = await Package.findById(packageId);
    if (pkg) {
      const newTotal = pkg.totalRatings + 1;
      const newAverage = ((pkg.averageRating * pkg.totalRatings) + Number(rating)) / newTotal;
      
      pkg.totalRatings = newTotal;
      pkg.averageRating = Math.round(newAverage * 10) / 10; // Round to 1 decimal
      await pkg.save();
    }

    res.status(201).json({ success: true, review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this package' });
    }
    console.error('Add review error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get reviews for a package
exports.getPackageReviews = async (req, res) => {
  try {
    const { packageId } = req.params;
    const reviews = await Review.find({ package: packageId }).populate('user', 'name').sort('-createdAt');
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
