/**
 * @file server/server.js
 * @description Main Express server entry point for K_M_Cart backend.
 * Configures middleware, connects to MongoDB, registers all API routes,
 * and starts the HTTP server.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ─────────────────────────────────────────────────────────────────────
// APP INITIALIZATION
// ─────────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────

/** Enable CORS for all origins (dev-friendly; lock down in production) */
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : '*',
  credentials: true,
}));

/** Parse incoming JSON request bodies (limit to 10mb) */
app.use(express.json({ limit: '10mb' }));

/** Parse URL-encoded form data */
app.use(express.urlencoded({ extended: true }));

/** Request logging middleware (development only) */
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─────────────────────────────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────────────────────────────

/** Health check endpoint */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'K_M_Cart API is running! 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/** Authentication routes (register, login) */
app.use('/api/auth', authRoutes);

/** Chatbot routes (main AI chat endpoint) */
app.use('/api/chatbot', chatbotRoutes);

/** Product routes (listing, details) */
app.use('/api/products', productRoutes);

/** Order routes (my-orders, order lookup) */
app.use('/api/orders', orderRoutes);

/** Payment routes (Razorpay create-order, verify) */
app.use('/api/payment', paymentRoutes);

/** Admin routes (dashboard, products, orders, users, analytics) */
app.use('/api/admin', adminRoutes);

// ─────────────────────────────────────────────────────────────────────
// ERROR HANDLING
// ─────────────────────────────────────────────────────────────────────

/** 404 handler for undefined routes */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/** Global error handler */
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// ─────────────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────────────

/**
 * Connect to MongoDB and start the Express server.
 * Server only starts after successful DB connection.
 */
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log('\n═══════════════════════════════════════════════');
      console.log('  🚀 K_M_Cart Server is running!');
      console.log('═══════════════════════════════════════════════');
      console.log(`  🌐 URL:         http://localhost:${PORT}`);
      console.log(`  📡 API Base:    http://localhost:${PORT}/api`);
      console.log(`  🏥 Health:      http://localhost:${PORT}/api/health`);
      console.log(`  🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('═══════════════════════════════════════════════\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
