/**
 * Package Controller - CRUD for travel packages
 */
const Package    = require('../models/Package');
const { cloudinary } = require('../config/cloudinary');

// GET /api/packages  - Public: all active packages
exports.getPackages = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, duration, status } = req.query;
    const filter = {};

    // Admin can filter by status; public only sees Active
    if (req.admin) {
      if (status) filter.status = status;
    } else {
      filter.status = 'Active';
    }

    if (location) {
      filter.$or = [
        { 'destination.city': { $regex: location, $options: 'i' } },
        { 'destination.state': { $regex: location, $options: 'i' } },
        { 'destination.country': { $regex: location, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (duration) filter['duration.days'] = Number(duration);

    const packages = await Package.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: packages.length, packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/packages/:id
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, package: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/packages  (Admin)
exports.createPackage = async (req, res) => {
  try {
    const { title, destination, duration, startingLocation, price, description, status, highlights, itinerary, travelTips, bestTimeToVisit, childPrice, roomTypes, activities } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const pkg = await Package.create({
      title, 
      destination: typeof destination === 'string' ? JSON.parse(destination) : destination,
      duration:    typeof duration === 'string' ? JSON.parse(duration) : duration,
      startingLocation,
      price: Number(price), 
      childPrice: Number(childPrice || 0),
      description, status: status || 'Active',
      highlights: highlights ? JSON.parse(highlights) : [],
      itinerary:  itinerary ? JSON.parse(itinerary) : [],
      travelTips: travelTips ? JSON.parse(travelTips) : {},
      bestTimeToVisit: bestTimeToVisit || 'Year-round',
      roomTypes: roomTypes ? JSON.parse(roomTypes) : ['3 Star'],
      activities: activities ? JSON.parse(activities) : [],
      images,
      createdBy: req.admin._id,
    });
    res.status(201).json({ success: true, package: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/packages/:id  (Admin)
exports.updatePackage = async (req, res) => {
  try {
    const { title, destination, duration, startingLocation, price, description, status, highlights, itinerary, travelTips, bestTimeToVisit, childPrice, roomTypes, activities } = req.body;
    const update = { 
      title, 
      price: Number(price), 
      childPrice: Number(childPrice || 0),
      description, status, bestTimeToVisit,
      startingLocation,
      roomTypes: roomTypes ? JSON.parse(roomTypes) : undefined,
      activities: activities ? JSON.parse(activities) : undefined
    };
    if (destination) update.destination = typeof destination === 'string' ? JSON.parse(destination) : destination;
    if (duration)    update.duration    = typeof duration === 'string' ? JSON.parse(duration) : duration;
    if (highlights) update.highlights = JSON.parse(highlights);
    if (itinerary)  update.itinerary  = JSON.parse(itinerary);
    if (travelTips) update.travelTips = JSON.parse(travelTips);
    if (req.files?.length) update.images = req.files.map(f => `/uploads/${f.filename}`);

    const pkg = await Package.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, package: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/packages/:id  (Admin)
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
