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
    { title: 'Rajasthan Desert Safari', location: 'Jaisalmer, Rajasthan', price: 10500, duration: 4, description: 'Dive deep into the Thar desert magic. Camp under the stars, ride camels, and explore ancient forts in the Golden City.', images: ['https://images.unsplash.com/photo-1599824683076-74fc21584c3c?w=800'], status: 'Active', highlights: ['Jaisalmer Fort', 'Sam Sand Dunes', 'Desert Camping', 'Folk Dance'] },
    { title: 'Kodaikanal Mist & Mountains', location: 'Kodaikanal, Tamil Nadu', price: 5000, duration: 3, description: 'Relax in the serene hills of Kodaikanal, known for its star-shaped lake, pine forests, and magnificent view points.', images: ['https://images.unsplash.com/photo-1596426745199-6f5df844ac16?w=800'], status: 'Active', highlights: ['Kodai Lake', 'Coaker\'s Walk', 'Pine Forest', 'Pillar Rocks'] },
    { title: 'Manali Valley Trek', location: 'Manali, Himachal Pradesh', price: 8500, duration: 4, description: 'For the adventure lovers! A breathtaking trekking route through green valleys, pine trees, and fresh mountain streams.', images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'], status: 'Active', highlights: ['Solang Valley', 'Trekking', 'Campfire', 'Vashisht Hot Springs'] },
    { title: 'Thanjavur Temple Heritage', location: 'Thanjavur, Tamil Nadu', price: 4000, duration: 2, description: 'Discover the rich history and magnificent Chola architecture. A deep dive into ancient culture, arts, and spirituality.', images: ['https://images.unsplash.com/photo-1621235313982-f17ab8bf8f61?w=800'], status: 'Active', highlights: ['Brihadeeswarar Temple', 'Maratha Palace', 'Saraswathi Mahal', 'Art Gallery'] },
    { title: 'Kashmir Paradise on Earth', location: 'Srinagar, Kashmir', price: 18000, duration: 6, description: 'Experience the unparalleled beauty of Kashmir. Enjoy Shikara rides on Dal Lake, snow valleys in Gulmarg, and lush meadows.', images: ['https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800'], status: 'Active', highlights: ['Dal Lake Shikara', 'Gulmarg Gondola', 'Pahalgam Valleys', 'Mughal Gardens'] },
    { title: 'Swiss Alps Adventure', location: 'Zurich & Lucerne, Switzerland', price: 120000, duration: 7, description: 'A magical journey through the Swiss Alps. Enjoy scenic train rides, picturesque villages, and majestic snow-capped peaks.', images: ['https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800'], status: 'Active', highlights: ['Mt. Titlis', 'Lake Lucerne Cruise', 'Jungfraujoch', 'Swiss Chocolates'] },
    { title: 'Bali Tropical Getaway', location: 'Bali, Indonesia', price: 45000, duration: 6, description: 'Relax on beautiful beaches, explore lush rice terraces, and immense yourself in cultural temples in this tropical paradise.', images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'], status: 'Active', highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Water Sports', 'Balinese Spa'] },
  ];

  await Package.deleteMany({});
  await Package.insertMany(packages);
  console.log('✅ Sample packages seeded');

  mongoose.disconnect();
  console.log('🎉 Seeding complete!');
};

seedData().catch(err => { console.error(err); process.exit(1); });
