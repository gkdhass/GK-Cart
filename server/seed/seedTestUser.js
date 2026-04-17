/**
 * @file server/seed/seedTestUser.js
 * @description Seeds the demo/test user for K_M_Cart.
 * Run: node seed/seedTestUser.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const DEMO_USER = {
  name: 'Test User',
  email: 'test@gkcart.com',
  password: 'Test@1234',
};

async function seedTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existing = await User.findOne({ email: DEMO_USER.email });
    if (existing) {
      console.log('ℹ️  Demo user already exists:', DEMO_USER.email);
    } else {
      await User.create(DEMO_USER);
      console.log('✅ Demo user created:', DEMO_USER.email, '/ Password:', DEMO_USER.password);
    }

    await mongoose.disconnect();
    console.log('✅ Done. Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test user:', error.message);
    process.exit(1);
  }
}

seedTestUser();
