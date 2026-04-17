/**
 * @file server/models/FAQ.js
 * @description Mongoose model for FAQ (Frequently Asked Questions) collection.
 * Stores common customer questions with answers and keyword arrays
 * for the chatbot's intent-based FAQ matching system.
 * Keywords enable fuzzy matching when users ask questions in different ways.
 */

const mongoose = require('mongoose');

/** Valid FAQ categories for organized retrieval */
const FAQ_CATEGORIES = ['shipping', 'returns', 'payment', 'general'];

/**
 * FAQ Schema Definition
 * @property {String} question - The FAQ question text
 * @property {String} answer - The complete answer text
 * @property {Array<String>} keywords - Array of keywords for intent matching
 * @property {String} category - FAQ category (shipping|returns|payment|general)
 */
const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'FAQ question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'FAQ answer is required'],
      trim: true,
    },
    keywords: {
      type: [String],
      required: [true, 'At least one keyword is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Keywords array must have at least one keyword',
      },
    },
    category: {
      type: String,
      required: [true, 'FAQ category is required'],
      enum: {
        values: FAQ_CATEGORIES,
        message: `Category must be one of: ${FAQ_CATEGORIES.join(', ')}`,
      },
      lowercase: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

/** Index on keywords for efficient chatbot FAQ matching */
faqSchema.index({ keywords: 1 });

/** Index on category for category-based FAQ browsing */
faqSchema.index({ category: 1 });

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;
