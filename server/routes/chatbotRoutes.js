/**
 * @file server/routes/chatbotRoutes.js
 * @description Chatbot route — single endpoint for all chatbot interactions.
 * Prefixed with /api/chatbot (configured in server.js).
 */

const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatbotController');

/**
 * @route   POST /api/chatbot
 * @desc    Process a user message and return AI chatbot response
 * @access  Public (userId optional in body for order tracking)
 * @body    { message: String, userId?: String }
 */
router.post('/', handleChat);

module.exports = router;
