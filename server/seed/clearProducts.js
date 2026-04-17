/**
 * @file server/seed/clearProducts.js
 * @description Clears all products from the database.
 * Run: node seed/clearProducts.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product');
const connectDB = require('../config/db');

async function clearProducts() {
  try {
    await connectDB();
    console.log('\n🗑️  Clearing all products...');

    const result = await Product.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} products from the database.`);
    console.log('   Database is now empty and ready for new products.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing products:', error.message);
    process.exit(1);
  }
}

clearProducts();
