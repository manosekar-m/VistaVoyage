/**
 * Database seeder - Creates default admin + sample packages
 * Run: node config/seed.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const Admin   = require('../models/Admin');
const Package = require('../models/Package');

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  // Create default admin
  const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@vistavoyage.com' });
  if (!existing) {
    // Use plain text password here; model's pre-save hook hashes automatically.
    await Admin.create({
      name: 'VistaVoyage Admin',
      email: process.env.ADMIN_EMAIL || 'admin@vistavoyage.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      phone: '9999999999',
    });
    console.log('✅ Admin created: admin@vistavoyage.com / Admin@123');
  } else {
    console.log('ℹ️  Admin already exists');
  }

  // Sample packages
  const packages = [
    { title: 'Ooty Hill Station Delight', location: 'Ooty, Tamil Nadu', price: 4500, duration: 3, description: 'Experience the queen of hill stations with lush tea gardens, toy train rides, and cool misty mornings. Includes hotel, breakfast, and sightseeing.', images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'], status: 'Active', highlights: ['Tea Garden Tour', 'Toy Train Ride', 'Botanical Garden', 'Doddabetta Peak'] },
    { title: 'Kerala Backwaters Escape', location: 'Alleppey, Kerala', price: 7500, duration: 4, description: 'Glide through serene backwaters on a traditional houseboat. Enjoy Ayurvedic massage, fresh seafood and stunning sunsets over the lagoon.', images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'], status: 'Active', highlights: ['Houseboat Stay', 'Ayurvedic Spa', 'Canoe Ride', 'Village Walk'] },
    { title: 'Rajasthan Royal Heritage', location: 'Jaipur & Jodhpur', price: 12000, duration: 6, description: 'Explore the royal palaces, sand dunes, and vibrant markets of Rajasthan. Camel safari at sunset and folk music evenings included.', images: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'], status: 'Active', highlights: ['Amber Fort', 'Camel Safari', 'Desert Camp', 'City Palace'] },
    { title: 'Goa Beach Bliss', location: 'Goa', price: 5500, duration: 3, description: 'Sun, sand, and sea! Enjoy Goa\'s stunning beaches, water sports, vibrant nightlife, and delicious seafood at beachside shacks.', images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'], status: 'Active', highlights: ['Beach Hopping', 'Water Sports', 'Old Goa Churches', 'Night Markets'] },
    { title: 'Manali Snow Adventure', location: 'Manali, Himachal Pradesh', price: 9000, duration: 5, description: 'Adventure awaits in the snowy Himalayas. Skiing, snow treks, river rafting, and cozy bonfire nights in the mountains.', images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'], status: 'Active', highlights: ['Skiing', 'Rohtang Pass', 'River Rafting', 'Hadimba Temple'] },
    { title: 'Andaman Island Paradise', location: 'Port Blair, Andaman', price: 15000, duration: 6, description: 'Pristine beaches with crystal-clear water, world-class snorkeling, and historic Cellular Jail. A tropical paradise off the beaten path.', images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'], status: 'Active', highlights: ['Radhanagar Beach', 'Scuba Diving', 'Glass Bottom Boat', 'Havelock Island'] },
  ];

  await Package.deleteMany({});
  await Package.insertMany(packages);
  console.log('✅ Sample packages seeded');

  mongoose.disconnect();
  console.log('🎉 Seeding complete!');
};

seedData().catch(err => { console.error(err); process.exit(1); });
