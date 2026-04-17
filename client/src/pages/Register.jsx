/**
 * @file client/src/pages/Register.jsx
 * @description Premium registration page with full-screen split layout.
 * Same brand panel as Login. Right side form with full name, email, phone,
 * password with strength meter, confirm password, inline validation on blur.
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash,
  FaMobileAlt, FaTshirt, FaClock, FaLaptop, FaHeadphones,
  FaBluetoothB, FaCheckCircle, FaSpinner,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

/**
 * Register page component — full-screen split layout.
 * @returns {JSX.Element} Registration page
 */
function Register() {
  // ── Form state ──────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── UI state ────────────────────────────────────────────────────────
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // ── Validation functions ────────────────────────────────────────────
  const validators = {
    name: (val) => {
      if (!val.trim()) return 'Full name is required';
      if (val.trim().length < 2) return 'Name must be at least 2 characters';
      return '';
    },
    email: (val) => {
      if (!val.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address';
      return '';
    },
    phone: (val) => {
      if (!val.trim()) return 'Phone number is required';
      if (!/^[6-9]\d{9}$/.test(val)) return 'Enter a valid 10-digit Indian phone number';
      return '';
    },
    password: (val) => {
      if (!val) return 'Password is required';
      if (val.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(val)) return 'Must contain at least one uppercase letter';
      if (!/\d/.test(val)) return 'Must contain at least one number';
      return '';
    },
    confirmPassword: (val) => {
      if (!val) return 'Please confirm your password';
      if (val !== password) return 'Passwords do not match';
      return '';
    },
  };

  /** Validate a single field on blur */
  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validators[field](value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  /** Calculate password strength */
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '', width: '0%' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const levels = [
      { label: 'Weak', color: 'bg-red-500', width: '25%' },
      { label: 'Fair', color: 'bg-orange-500', width: '50%' },
      { label: 'Strong', color: 'bg-emerald-500', width: '75%' },
      { label: 'Very Strong', color: 'bg-emerald-600', width: '100%' },
    ];

    return { score, ...(levels[Math.min(score, 3)] || levels[0]) };
  };

  const passwordStrength = getPasswordStrength(password);

  /** Handle form submission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validate all fields
    const fields = { name, email, phone, password, confirmPassword };
    const newErrors = {};
    const newTouched = {};
    let hasError = false;

    Object.keys(fields).forEach((field) => {
      newTouched[field] = true;
      const err = validators[field](fields[field]);
      newErrors[field] = err;
      if (err) hasError = true;
    });

    setTouched(newTouched);
    setErrors(newErrors);
    if (hasError) return;

    setIsLoading(true);

    try {
      const result = await register(name.trim(), email.trim(), password);
      if (result.success) {
        navigate('/');
      } else {
        setApiError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /** Features list for brand panel */
  const features = [
    '500+ Products across all categories',
    'AI-powered shopping assistant',
    'Fast delivery across India',
  ];

  /** Floating icons for brand panel decoration */
  const floatingIcons = [
    { Icon: FaMobileAlt, top: '12%', left: '10%', delay: '0s', size: 'text-2xl' },
    { Icon: FaTshirt, top: '25%', right: '15%', delay: '0.5s', size: 'text-xl' },
    { Icon: FaClock, bottom: '30%', left: '8%', delay: '1s', size: 'text-lg' },
    { Icon: FaLaptop, top: '55%', right: '10%', delay: '1.5s', size: 'text-2xl' },
    { Icon: FaHeadphones, bottom: '15%', left: '20%', delay: '2s', size: 'text-xl' },
    { Icon: FaBluetoothB, top: '40%', left: '25%', delay: '2.5s', size: 'text-lg' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT HALF: Brand Panel ────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden
                      bg-gradient-to-br from-indigo-600 to-purple-700
                      flex-col items-center justify-center px-12 text-white">
        {/* Floating decorative icons */}
        {floatingIcons.map(({ Icon, delay, size, ...pos }, i) => (
          <div
            key={i}
            className={`absolute ${size} text-white/10 animate-float`}
            style={{ ...pos, animationDelay: delay }}
          >
            <Icon />
          </div>
        ))}

        {/* Glass overlay circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />

        {/* Brand content */}
        <div className="relative z-10 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl
                          bg-white/10 backdrop-blur-sm border border-white/20 mb-6 shadow-xl">
            <HiSparkles className="text-white text-3xl" />
          </div>

          <h1 className="text-4xl font-bold mb-3">K_M_Cart</h1>
          <p className="text-xl text-indigo-200 mb-10 font-light">
            Your Smart Shopping Destination
          </p>

          <div className="space-y-4 text-left">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-indigo-100">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <FaCheckCircle className="text-xs text-emerald-300" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 mt-12">
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-xs text-indigo-300">Products</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <p className="text-2xl font-bold">50K+</p>
              <p className="text-xs text-indigo-300">Happy Users</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <p className="text-2xl font-bold">4.8★</p>
              <p className="text-xs text-indigo-300">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT HALF: Register Form ─────────────────────────────────── */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="max-w-md w-full mx-auto px-2 sm:px-8 py-6">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                            bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg mb-3">
              <HiSparkles className="text-white text-xl" />
            </div>
            <h2 className="text-lg font-bold gradient-text">K_M_Cart</h2>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <p className="text-sm text-gray-500 mt-1">
              Join K_M_Cart for a smart shopping experience
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Already have account?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm
                            animate-fade-in flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {apiError}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: '' })); }}
                  onBlur={() => handleBlur('name', name)}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-gray-900
                             placeholder:text-gray-400 outline-none transition-all duration-200
                             ${touched.name && errors.name
                               ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                               : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                             }`}
                  autoComplete="name"
                />
              </div>
              {touched.name && errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: '' })); }}
                  onBlur={() => handleBlur('email', email)}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-gray-900
                             placeholder:text-gray-400 outline-none transition-all duration-200
                             ${touched.email && errors.email
                               ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                               : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                             }`}
                  autoComplete="email"
                />
              </div>
              {touched.email && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(val);
                    if (errors.phone) setErrors((p) => ({ ...p, phone: '' }));
                  }}
                  onBlur={() => handleBlur('phone', phone)}
                  placeholder="9876543210"
                  maxLength={10}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-gray-900
                             placeholder:text-gray-400 outline-none transition-all duration-200
                             ${touched.phone && errors.phone
                               ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                               : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                             }`}
                  autoComplete="tel"
                />
              </div>
              {touched.phone && errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: '' })); }}
                  onBlur={() => handleBlur('password', password)}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-white text-gray-900
                             placeholder:text-gray-400 outline-none transition-all duration-200
                             ${touched.password && errors.password
                               ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                               : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                             }`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {touched.password && errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

              {/* Password strength meter */}
              {password && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    passwordStrength.score <= 1 ? 'text-red-500'
                    : passwordStrength.score === 2 ? 'text-orange-500'
                    : 'text-emerald-500'
                  }`}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: '' })); }}
                  onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                  placeholder="Re-enter your password"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-white text-gray-900
                             placeholder:text-gray-400 outline-none transition-all duration-200
                             ${touched.confirmPassword && errors.confirmPassword
                               ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                               : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                             }`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-gray-600 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-400 leading-relaxed">
              By registering, you agree to our{' '}
              <span className="text-indigo-600 cursor-pointer hover:underline">Terms of Service</span> and{' '}
              <span className="text-indigo-600 cursor-pointer hover:underline">Privacy Policy</span>
            </p>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold
                         rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
