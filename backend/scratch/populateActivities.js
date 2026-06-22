const mongoose = require('mongoose');
require('dotenv').config();
const Package = require('../models/Package');

const activityData = {
  "Ooty": ["Toy Train ride", "Botanical Garden tour", "Boating at Ooty Lake", "Doddabetta Peak viewing"],
  "Alleppey": ["Houseboat cruise", "Kayaking", "Alleppey Lighthouse visit", "Cultural temple tour"],
  "Jaipur": ["Amber Palace tour", "Hawa Mahal visit", "City Palace exploration", "Bazaar shopping"],
  "Goa": ["Water sports", "Old Goa church tour", "Spice plantation visit", "Beach party experience"],
  "Manali": ["Solang Valley paragliding", "Hidimba Devi Temple visit", "Jogini Falls trekking", "Atal Tunnel excursion"],
  "Interlaken": ["Scenic train journey", "Matterhorn visit", "Lake Lucerne boat ride", "Swiss chocolate tasting"],
  "Ubud": ["Uluwatu temple tour", "Tanah Lot visit", "Rice terraces trekking", "Yoga session"],
  "Dubai": ["Burj Khalifa viewing", "Desert safari (Dune bashing)", "Dubai Mall shopping", "Fountain show"],
  "Malé": ["Scuba diving", "Snorkeling", "Sunset dolphin cruise", "Island hopping tour"],
  "Port Blair": ["Scuba diving", "Cellular Jail tour", "Radhanagar Beach visit", "Coral reef snorkeling"],
  "Jaisalmer": ["Camel safari", "Desert camping", "Jaisalmer Fort tour", "Cultural folk show"],
  "Kodaikanal": ["Kodaikanal Lake boating", "Pillar Rocks viewing", "Pine Forest trekking", "Bryant Park tour"],
  "Thanjavur": ["Big Temple heritage tour", "Thanjavur Palace visit", "Bronze art workshop"],
  "Srinagar": ["Dal Lake Shikhara ride", "Mughal Gardens tour", "Gulmarg gondola ride", "Saffron field visit"]
};

async function populate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const packages = await Package.find({});
    console.log(`Found ${packages.length} packages to update.`);

    for (const pkg of packages) {
      const city = pkg.destination?.city;
      if (city && activityData[city]) {
        pkg.activities = activityData[city];
        await pkg.save();
        console.log(`Updated activities for: ${pkg.title} (${city})`);
      } else {
        // Default activities if city not explicitly mapped
        pkg.activities = ["Guided city tour", "Local market visit", "Cultural experience", "Scenic viewpoints"];
        await pkg.save();
        console.log(`Updated default activities for: ${pkg.title}`);
      }
    }

    console.log('Finished updating activities!');
  } catch (err) {
    console.error('Error during population:', err);
  } finally {
    mongoose.disconnect();
  }
}

populate();
