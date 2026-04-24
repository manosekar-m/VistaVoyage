const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const Package = require('../models/Package');

async function updatePackages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await Package.updateMany({}, {
      $set: {
        location: 'New Delhi, India',
        destinationCity: 'New Delhi',
        destinationState: 'Delhi',
        destinationCountry: 'India',
        coordinates: {
          lat: 28.6139,
          lng: 77.2090
        }
      }
    });

    console.log(`Successfully updated ${result.modifiedCount} packages to New Delhi.`);
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
}

updatePackages();
