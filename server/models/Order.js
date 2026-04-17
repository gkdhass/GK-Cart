/**
 * @file server/models/Order.js
 * @description Mongoose model for Order collection.
 * Represents customer orders with products, delivery address, payment info,
 * status tracking, and estimated delivery dates. Each order has a unique
 * orderId string (e.g., "ORD-2024-0042") for easy reference.
 */

const mongoose = require('mongoose');

/** Valid order status values */
const ORDER_STATUSES = ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

/** Valid payment methods */
const PAYMENT_METHODS = ['COD', 'UPI', 'Card', 'NetBanking', 'Online'];

/** Valid payment statuses */
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed'];

/**
 * Sub-schema for individual products within an order.
 * Each item stores a snapshot of the product at time of purchase.
 */
const orderProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      default: 'Generic',
    },
    qty: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false }
);

/**
 * Sub-schema for delivery address.
 */
const deliveryAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required'],
    },
    addressLine2: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
    },
  },
  { _id: false }
);

/**
 * Order Schema Definition
 * @property {ObjectId} userId - Reference to the User who placed the order
 * @property {String} orderId - Human-readable unique order ID (e.g., "ORD-2024-0042")
 * @property {Array} products - Array of purchased products with qty and price snapshot
 * @property {Object} deliveryAddress - Delivery address details
 * @property {String} paymentMethod - Payment method used (COD|UPI|Card|NetBanking)
 * @property {String} paymentStatus - Payment status (Pending|Paid|Failed)
 * @property {Number} subtotal - Order subtotal before taxes and delivery
 * @property {Number} deliveryCharge - Delivery charge amount
 * @property {Number} tax - Tax amount (GST)
 * @property {Number} totalAmount - Total order amount in INR
 * @property {String} status - Current order status
 * @property {Date} estimatedDelivery - Expected delivery date
 * @property {Date} createdAt - Order creation timestamp
 */
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for an order'],
    },
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      unique: true,
      trim: true,
    },
    products: {
      type: [orderProductSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Order must contain at least one product',
      },
    },
    deliveryAddress: {
      type: deliveryAddressSchema,
      required: [true, 'Delivery address is required'],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: PAYMENT_METHODS,
        message: `Payment method must be one of: ${PAYMENT_METHODS.join(', ')}`,
      },
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: {
        values: PAYMENT_STATUSES,
        message: `Payment status must be one of: ${PAYMENT_STATUSES.join(', ')}`,
      },
      default: 'Pending',
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: [0, 'Delivery charge cannot be negative'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ORDER_STATUSES,
        message: `Status must be one of: ${ORDER_STATUSES.join(', ')}`,
      },
      default: 'Pending',
    },
    estimatedDelivery: {
      type: Date,
      required: [true, 'Estimated delivery date is required'],
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

/** Index on userId for quick order lookup by customer */
orderSchema.index({ userId: 1 });

/** Index on orderId for chatbot order tracking queries */
orderSchema.index({ orderId: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
