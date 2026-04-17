/**
 * @file client/src/pages/ForgotPassword.jsx
 * @description Two-step Forgot Password page.
 * Step 1: Enter email to receive reset link.
 * Step 2: Success confirmation with resend countdown.
 * Route: /forgot-password
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaSpinner, FaCheckCircle, FaRedo } from 'react-icons/fa';
import api from '../utils/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1 = enter email, 2 = success
  const [resendTimer, setResendTimer] = useState(0);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validateEmail = (val) => {
    if (!val.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email: email.trim() });

      if (response.data.success) {
        setStep(2);
        setResendTimer(60); // disable resend for 60 seconds
      } else {
        setError(response.data.message || 'Something went wrong.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset email. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      setResendTimer(60);
    } catch (err) {
      setError('Failed to resend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Back to login */}
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 mb-6 transition-colors">
          <FaArrowLeft size={12} /> Back to Login
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          {step === 1 ? (
            // ── STEP 1: Enter Email ─────────────────────────────────────
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                                bg-indigo-100 text-indigo-600 mb-4">
                  <FaEnvelope size={24} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                <p className="text-sm text-gray-500">
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fp-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      id="fp-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
                      onBlur={() => setEmailError(validateEmail(email))}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-gray-900
                                 placeholder:text-gray-400 outline-none transition-all duration-200
                                 ${emailError
                                   ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                                   : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                 }`}
                      autoComplete="email"
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold
                             rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                             shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            // ── STEP 2: Success Message ─────────────────────────────────
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full
                              bg-emerald-100 text-emerald-600 mb-5">
                <FaCheckCircle size={28} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your Email!</h2>
              <p className="text-sm text-gray-500 mb-1">
                We've sent a password reset link to:
              </p>
              <p className="text-sm font-semibold text-indigo-600 mb-6">{email}</p>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 mb-6">
                <p>Check your inbox and spam folder. The link will expire in 15 minutes.</p>
              </div>

              {/* Resend button */}
              <button
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className="inline-flex items-center gap-2 text-sm font-medium
                           text-indigo-600 hover:text-indigo-700 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                <FaRedo size={12} className={loading ? 'animate-spin' : ''} />
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend email'}
              </button>

              <div className="border-t border-gray-100 pt-5 mt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <FaArrowLeft size={12} />
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
