/**
 * @file server/config/db.js
 * @description MongoDB connection configuration using Mongoose.
 * Connects to MongoDB using the URI from environment variables.
 * Includes error handling and connection event logging.
 */

const mongoose = require('mongoose');

/**
 * Connects to MongoDB database.
 * Uses MONGODB_URI from .env file.
 * Exits process with code 1 if connection fails.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 7+ uses these defaults, but we set them explicitly for clarity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected successfully');
    });
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1); // Exit process with failure code
  }
};

module.exports = connectDB;
