/**
 * @file server/controllers/paymentController.js
 * @description Razorpay payment integration controller.
 * Handles creating Razorpay orders and verifying payment signatures.
 */

const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * Lazy-initialize Razorpay so missing keys don't crash the server on startup.
 * The instance is created once on first use and reused afterwards.
 */
let razorpayInstance = null;

function getRazorpay() {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error(
        'Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file.'
      );
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

/**
 * @route   POST /api/payment/create-order
 * @desc    Creates a Razorpay order before showing payment popup
 * @access  Private (requires auth)
 *
 * @param {Object} req.body - { amount, currency, receipt }
 * @returns {Object} { success, orderId, amount, currency, keyId }
 */
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    // amount must be in paise (₹1 = 100 paise)
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || 'receipt_' + Date.now(),
      notes: { userId: req.user._id.toString() },
    };

    const razorpayOrder = await getRazorpay().orders.create(options);

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/payment/verify
 * @desc    Verifies Razorpay payment signature after payment completes
 * @access  Private (requires auth)
 *
 * @param {Object} req.body - { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData }
 * @returns {Object} { success, message, order }
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

    // Validate all required fields exist
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }
    if (!orderData || !orderData.cartItems || !orderData.deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Missing order data' });
    }

    // CRITICAL: Signature must be "orderId|paymentId" (pipe separator, no spaces)
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      console.error('Signature mismatch:', { expected: expectedSig, received: razorpay_signature });
      return res.status(400).json({ success: false, message: 'Invalid payment signature - payment verification failed' });
    }

    // Signature verified — save order to DB
    const userId = req.user._id || req.user.id;
    const count = await Order.countDocuments();
    const orderId = 'ORD-' + new Date().getFullYear() + '-' + String(count + 1).padStart(4, '0');

    const newOrder = new Order({
      userId,
      orderId,
      products: orderData.cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        image: item.image || '',
        brand: item.brand || '',
        price: item.price,
        qty: item.qty
      })),
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: 'Online',
      paymentStatus: 'Paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      subtotal: orderData.subtotal,
      deliveryCharge: orderData.deliveryCharge || 0,
      tax: orderData.tax || 0,
      totalAmount: orderData.totalAmount,
      status: 'Confirmed',
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });

    await newOrder.save();

    // Reduce stock
    await Promise.all(
      orderData.cartItems.map(item =>
        Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } })
      )
    );

    return res.status(201).json({
      success: true,
      message: 'Payment verified and order placed!',
      order: {
        orderId: newOrder.orderId,
        status: newOrder.status,
        estimatedDelivery: newOrder.estimatedDelivery,
        totalAmount: newOrder.totalAmount,
        paymentId: razorpay_payment_id,
        paymentMethod: 'Online',
        paymentStatus: 'Paid',
        itemCount: orderData.cartItems.length,
      },
    });
  } catch (error) {
    console.error('verifyPayment error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };
