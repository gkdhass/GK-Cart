/**
 * @file server/routes/orderRoutes.js
 * @description Order routes for placing and fetching orders.
 * Prefixed with /api/orders (configured in server.js).
 */

const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderByOrderId } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/orders/place
 * @desc    Place a new order from cart items
 * @access  Protected (JWT required)
 */
router.post('/place', protect, placeOrder);

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get all orders for the authenticated user
 * @access  Protected (JWT required)
 */
router.get('/my-orders', protect, getMyOrders);

/**
 * @route   GET /api/orders/:orderId
 * @desc    Get order by human-readable orderId string (e.g., ORD-2024-0042)
 * @access  Protected (JWT required)
 */
router.get('/:orderId', protect, getOrderByOrderId);

module.exports = router;
