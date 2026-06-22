/**
 * seedAdmin.js
 * Ensures the default admin account exists in the database
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
dotenv.config();

async function seed() {
  console.log('🚀 Checking Admin Account...');
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = process.env.ADMIN_EMAIL || 'admin@vistavoyage.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';

    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      console.log(`📦 Creating Admin: ${email}...`);
      await Admin.create({
        name: 'System Admin',
        email: email,
        password: password,
        phone: '1234567890'
      });
      console.log('✨ Admin account created successfully!');
    } else {
      console.log('ℹ️ Admin account already exists.');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
  }
}

seed();
