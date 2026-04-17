/**
 * @file server/seed/adminSeed.js
 * @description Script to promote an existing user to admin, or create a new admin user.
 * Usage:
 *   Promote existing:  node seed/adminSeed.js user@example.com
 *   Create new admin:  node seed/adminSeed.js user@example.com --create "Admin Name" "password123"
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const run = async () => {
  const email = process.argv[2];
  const createFlag = process.argv[3] === '--create';
  const name = process.argv[4];
  const password = process.argv[5];

  if (!email) {
    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('  🔐 K_M_Cart — Admin Promotion Script');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log('  Promote existing user:');
    console.log('    node seed/adminSeed.js <email>');
    console.log('');
    console.log('  Create NEW admin user:');
    console.log('    node seed/adminSeed.js <email> --create "<name>" "<password>"');
    console.log('');
    console.log('  Examples:');
    console.log('    node seed/adminSeed.js admin@gkcart.com');
    console.log('    node seed/adminSeed.js admin@gkcart.com --create "Admin" "admin123"');
    console.log('');
    console.log('═══════════════════════════════════════════════');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MONGO_URI not found in environment variables.');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Promote existing user
      if (user.role === 'admin') {
        console.log(`ℹ️  User "${user.name}" (${user.email}) is already an admin.`);
        process.exit(0);
      }

      user.role = 'admin';
      await user.save();

      console.log('');
      console.log('═══════════════════════════════════════════════');
      console.log('  ✅ User promoted to Admin successfully!');
      console.log('═══════════════════════════════════════════════');
      console.log(`  Name:  ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role:  ${user.role}`);
      console.log('═══════════════════════════════════════════════');
    } else if (createFlag) {
      // Create new admin user
      if (!name || !password) {
        console.error('❌ Please provide name and password:');
        console.error('   node seed/adminSeed.js <email> --create "<name>" "<password>"');
        process.exit(1);
      }

      if (password.length < 6) {
        console.error('❌ Password must be at least 6 characters.');
        process.exit(1);
      }

      user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: 'admin',
      });

      console.log('');
      console.log('═══════════════════════════════════════════════');
      console.log('  ✅ New Admin user created successfully!');
      console.log('═══════════════════════════════════════════════');
      console.log(`  Name:     ${user.name}`);
      console.log(`  Email:    ${user.email}`);
      console.log(`  Role:     ${user.role}`);
      console.log(`  Password: (as provided)`);
      console.log('═══════════════════════════════════════════════');
    } else {
      // User not found and no --create flag
      console.error(`❌ User with email "${email}" not found.`);
      console.log('');
      console.log('   To create a NEW admin user, run:');
      console.log(`   node seed/adminSeed.js ${email} --create "Your Name" "your-password"`);
      process.exit(1);
    }

    console.log('');
    console.log('  Log in with this email to access /admin/dashboard');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

run();
