/**
 * @file server/routes/paymentRoutes.js
 * @description Express routes for Razorpay payment integration.
 * All routes require authentication.
 */

const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

/** POST /api/payment/create-order — Create Razorpay order */
router.post('/create-order', protect, createRazorpayOrder);

/** POST /api/payment/verify — Verify payment signature and save order */
router.post('/verify', protect, verifyPayment);

module.exports = router;
