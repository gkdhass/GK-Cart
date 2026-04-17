/**
 * @file server/middleware/adminMiddleware.js
 * @description Admin authorization middleware.
 * Verifies that the authenticated user has admin role.
 * Must be used AFTER the 'protect' middleware (which attaches req.user).
 */

/**
 * Admin-only middleware.
 * Checks req.user.role === 'admin' and returns 403 Forbidden if not.
 *
 * @param {Object} req - Express request (must have req.user from protect middleware)
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no user found. Please log in.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied — admin privileges required.',
    });
  }

  next();
};

module.exports = { adminOnly };
