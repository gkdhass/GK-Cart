/**
 * @file server/models/User.js
 * @description Mongoose model for User collection.
 * Handles user authentication data with password hashing via bcryptjs.
 * Includes pre-save hook for automatic password hashing and
 * instance method for password comparison during login.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/** Number of salt rounds for bcrypt hashing */
const SALT_ROUNDS = 12;

/**
 * User Schema Definition
 * @property {String} name - User's full name (required)
 * @property {String} email - User's email address (required, unique, lowercase)
 * @property {String} password - Hashed password (required, hidden from queries by default)
 * @property {Date} createdAt - Account creation timestamp
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin',
      },
      default: 'user',
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    googleId: {
      type: String,
      default: null,
    },
    githubId: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false, // We use our own createdAt field
  }
);

/**
 * Pre-save hook: Hash password before saving to database.
 * Only hashes if the password field has been modified (new user or password change).
 */
userSchema.pre('save', async function (next) {
  // Skip hashing if password hasn't been modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method: Compare a candidate password with the stored hash.
 * Used during login to verify user credentials.
 * @param {String} candidatePassword - Plain text password to compare
 * @returns {Promise<Boolean>} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Ensure password is never included in JSON output
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
