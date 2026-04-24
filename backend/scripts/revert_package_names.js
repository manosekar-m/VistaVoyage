const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const Package = require('../models/Package');

const ORIGINAL_DATA = [
  { title: 'Ooty Hill Station Delight', location: 'Ooty, Tamil Nadu', city: 'Ooty', state: 'Tamil Nadu', country: 'India' },
  { title: 'Kerala Backwaters Escape', location: 'Alleppey, Kerala', city: 'Alleppey', state: 'Kerala', country: 'India' },
  { title: 'Rajasthan Royal Heritage', location: 'Jaipur & Jodhpur', city: 'Jaipur', state: 'Rajasthan', country: 'India' },
  { title: 'Goa Beach Bliss', location: 'Goa', city: 'Goa', state: 'Goa', country: 'India' },
  { title: 'Manali Snow Adventure', location: 'Manali, Himachal Pradesh', city: 'Manali', state: 'Himachal Pradesh', country: 'India' },
  { title: 'Andaman Island Paradise', location: 'Port Blair, Andaman', city: 'Port Blair', state: 'Andaman', country: 'India' },
  { title: 'Manali Valley Trek', location: 'Manali', city: 'Manali', state: 'Himachal Pradesh', country: 'India' },
  { title: 'Thanjavur Temple Heritage', location: 'Thanjavur', city: 'Thanjavur', state: 'Tamil Nadu', country: 'India' },
  { title: 'Kashmir Paradise on Earth', location: 'Kashmir', city: 'Srinagar', state: 'Kashmir', country: 'India' },
  { title: 'Dubai Desert Luxury', location: 'Dubai', city: 'Dubai', state: 'Dubai', country: 'UAE' },
  { title: 'Rajasthan Desert Safari', location: 'Rajasthan', city: 'Jaisalmer', state: 'Rajasthan', country: 'India' },
  { title: 'Maldives Overwater Bliss', location: 'Maldives', city: 'Male', state: 'Maldives', country: 'Maldives' }
];

async function revertNames() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const packages = await Package.find({});
    let updatedCount = 0;

    for (const pkg of packages) {
      const match = ORIGINAL_DATA.find(d => d.title === pkg.title);
      if (match) {
        pkg.location = match.location;
        pkg.destinationCity = match.city;
        pkg.destinationState = match.state;
        pkg.destinationCountry = match.country;
        // Keep coordinates at New Delhi as requested for the Interactive Guide
        pkg.coordinates = { lat: 28.6139, lng: 77.2090 };
        await pkg.save();
        updatedCount++;
        console.log(`Reverted: ${pkg.title} -> ${pkg.location}`);
      } else {
        // Fallback deduction for unknown titles
        const titleWords = pkg.title.split(' ');
        const likelyCity = titleWords[0];
        pkg.location = likelyCity + ', India';
        pkg.destinationCity = likelyCity;
        pkg.coordinates = { lat: 28.6139, lng: 77.2090 };
        await pkg.save();
        updatedCount++;
        console.log(`Deduced: ${pkg.title} -> ${pkg.location}`);
      }
    }

    console.log(`Successfully reverted names for ${updatedCount} packages while keeping New Delhi coordinates.`);
    process.exit(0);
  } catch (err) {
    console.error('Revert failed:', err);
    process.exit(1);
  }
}

revertNames();
