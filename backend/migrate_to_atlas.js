/**
 * migrate_to_atlas.js
 * Migrates all data from local MongoDB to MongoDB Atlas
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const LOCAL_URI = 'mongodb://localhost:27017/vistavoyage';
const ATLAS_URI = process.env.MONGO_URI;

async function migrate() {
  console.log('🚀 Starting Migration...');
  
  try {
    // 1. Connect to Local
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Connected to Local DB');

    // 2. Connect to Atlas
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Connected to MongoDB Atlas');

    // List of collections to migrate
    const collections = ['users', 'packages', 'bookings', 'feedbacks', 'promos', 'queries'];

    for (const collName of collections) {
      console.log(`📦 Migrating collection: ${collName}...`);
      
      const localColl = localConn.collection(collName);
      const atlasColl = atlasConn.collection(collName);

      // Fetch all data from local
      const data = await localColl.find({}).toArray();
      console.log(`   - Found ${data.length} documents in ${collName}`);

      if (data.length > 0) {
        // Clear Atlas collection first (safety)
        await atlasColl.deleteMany({});
        // Insert into Atlas
        await atlasColl.insertMany(data);
        console.log(`   - Successfully migrated ${collName}`);
      } else {
        console.log(`   - Skipping ${collName} (empty)`);
      }
    }

    console.log('\n✨ Migration Completed Successfully!');
    process.exit(0);

  } catch (err) {
    console.error('\n❌ Migration Failed:', err);
    process.exit(1);
  }
}

migrate();
