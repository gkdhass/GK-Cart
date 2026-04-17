/**
 * @file server/middleware/authMiddleware.js
 * @description JWT authentication middleware for protecting routes.
 * Verifies the JWT token from the Authorization header (Bearer scheme),
 * decodes the user ID, and attaches the user object to the request.
 * Protected routes use this middleware to ensure only authenticated users can access them.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware that verifies JWT tokens.
 * Expects: Authorization header with "Bearer <token>" format.
 *
 * On success: Attaches user object (without password) to req.user
 * On failure: Returns 401 Unauthorized response
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protect = async (req, res, next) => {
  let token;

  try {
    // Check for Authorization header with Bearer scheme
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, deny access
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — no token provided. Please log in.',
      });
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded ID (exclude password from result)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — user no longer exists.',
      });
    }

    // Attach user to request object for use in subsequent middleware/controllers
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors with meaningful messages
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — invalid token.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — token has expired. Please log in again.',
      });
    }

    // Generic error
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized — authentication failed.',
    });
  }
};

module.exports = { protect };
