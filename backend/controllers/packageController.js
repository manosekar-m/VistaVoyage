/**
 * Package Controller - CRUD for travel packages
 */
const Package    = require('../models/Package');
const { cloudinary } = require('../config/cloudinary');

// GET /api/packages  - Public: all active packages
exports.getPackages = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, duration, status, category, sortBy } = req.query;
    const filter = {};

    // Admin can filter by status; public only sees Active
    if (req.admin) {
      if (status) filter.status = status;
    } else {
      filter.status = 'Active';
    }

    if (location) filter.location = { $regex: location, $options: 'i' };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (duration) filter.duration = Number(duration);

    let sortOption = { createdAt: -1 };
    if (sortBy === 'priceLow') sortOption = { price: 1 };
    else if (sortBy === 'priceHigh') sortOption = { price: -1 };
    else if (sortBy === 'rating') sortOption = { averageRating: -1 };

    const packages = await Package.find(filter).sort(sortOption);
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
    const { title, location, price, childPrice, duration, description, status, highlights, destinationCity, destinationState, destinationCountry, nights, startingLocation, bestTimeToVisit, itinerary, includedActivities, availableFoodOptions, availableStayOptions, travelTips, lat, lng } = req.body;
    const images = req.files ? req.files.map(f => f.path) : [];

    const pkg = await Package.create({
      title, location, price: Number(price), childPrice: childPrice ? Number(childPrice) : undefined, duration: Number(duration),
      description, status: status || 'Active',
      highlights: highlights ? JSON.parse(highlights) : [],
      itinerary: itinerary ? JSON.parse(itinerary) : [],
      includedActivities: includedActivities ? JSON.parse(includedActivities) : [],
      availableFoodOptions: availableFoodOptions ? JSON.parse(availableFoodOptions) : [],
      availableStayOptions: availableStayOptions ? JSON.parse(availableStayOptions) : [],
      travelTips: travelTips ? JSON.parse(travelTips) : {},
      destinationCity, destinationState, destinationCountry, nights: nights ? Number(nights) : undefined, startingLocation, bestTimeToVisit,
      coordinates: { lat: Number(lat) || 28.6139, lng: Number(lng) || 77.2090 },
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
    const { title, location, price, childPrice, duration, description, status, highlights, destinationCity, destinationState, destinationCountry, nights, startingLocation, bestTimeToVisit, itinerary, includedActivities, availableFoodOptions, availableStayOptions, travelTips, existingImages, lat, lng } = req.body;
    const update = { title, location, price: Number(price), childPrice: childPrice ? Number(childPrice) : undefined, duration: Number(duration), description, status, destinationCity, destinationState, destinationCountry, nights: nights ? Number(nights) : undefined, startingLocation, bestTimeToVisit };
    
    if (lat && lng) {
      update.coordinates = { lat: Number(lat), lng: Number(lng) };
    }
    
    if (highlights) update.highlights = JSON.parse(highlights);
    if (itinerary) update.itinerary = JSON.parse(itinerary);
    if (includedActivities) update.includedActivities = JSON.parse(includedActivities);
    if (availableFoodOptions) update.availableFoodOptions = JSON.parse(availableFoodOptions);
    if (availableStayOptions) update.availableStayOptions = JSON.parse(availableStayOptions);
    if (travelTips) update.travelTips = JSON.parse(travelTips);
    
    // Merge existing image URLs with any new uploaded files
    let currentImages = [];
    try {
      if (existingImages) currentImages = JSON.parse(existingImages);
      else if (req.body.images) currentImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } catch (e) {
      console.error('Error parsing existing images:', e);
    }

    const newImages = req.files ? req.files.map(f => f.path) : [];
    update.images = [...currentImages, ...newImages];

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
