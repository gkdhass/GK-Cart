/**
 * @file client/src/pages/OrderSuccess.jsx
 * @description Order success confirmation page with payment details.
 * Shows animated checkmark, order info, payment status, timeline, and nav buttons.
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaListAlt } from 'react-icons/fa';

/**
 * OrderSuccess page component.
 * Reads order data from React Router location.state.
 * Redirects to home if accessed directly without state.
 */
function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (price) => '₹' + price.toLocaleString('en-IN');

  /** Determine payment badge styles */
  const paymentIsPaid = order.paymentStatus === 'Paid' || order.paymentId;
  const paymentBadge = paymentIsPaid
    ? { text: 'Paid', bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200' }
    : { text: 'Pay on Delivery', bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200' };

  /** Order detail rows */
  const orderDetails = [
    { label: 'Order ID', value: order.orderId, highlight: true },
    { label: 'Status', value: order.status, badge: true },
    { label: 'Payment Method', value: order.paymentMethod || 'COD' },
    { label: 'Payment Status', value: paymentBadge.text, paymentBadge: true },
    ...(order.paymentId ? [{ label: 'Payment ID', value: order.paymentId, mono: true }] : []),
    { label: 'Estimated Delivery', value: formatDate(order.estimatedDelivery) },
    { label: 'Total Paid', value: formatPrice(order.totalAmount), bold: true },
    ...(order.itemCount ? [{ label: 'Items', value: `${order.itemCount} item(s)` }] : []),
  ];

  /** What's Next timeline steps */
  const nextSteps = [
    { emoji: '📦', title: 'Order Confirmed', desc: "We've received your order" },
    { emoji: '🚚', title: 'Getting Shipped', desc: 'Your order will be shipped in 1-2 days' },
    { emoji: '🏠', title: 'Delivered', desc: `Expected by ${formatDate(order.estimatedDelivery)}` },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 page-enter">
      <div className="max-w-lg mx-auto px-4">
        {/* ── Success Animation ─────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full
                         bg-green-100 animate-success-bounce mb-5">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500">Thank you for shopping with K_M_Cart!</p>
        </div>

        {/* ── Order Details Card ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
          {orderDetails.map((row, index) => (
            <div key={row.label}>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500">{row.label}</span>
                {row.highlight ? (
                  <span className="font-mono font-bold text-indigo-600 text-sm">{row.value}</span>
                ) : row.badge ? (
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                    {row.value}
                  </span>
                ) : row.paymentBadge ? (
                  <span className={`px-3 py-1 ${paymentBadge.bg} ${paymentBadge.color} text-xs font-semibold rounded-full border ${paymentBadge.border}`}>
                    {row.value}
                  </span>
                ) : row.mono ? (
                  <span className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">{row.value}</span>
                ) : row.bold ? (
                  <span className="font-bold text-gray-900">{row.value}</span>
                ) : (
                  <span className="font-medium text-gray-700 text-sm">{row.value}</span>
                )}
              </div>
              {index < orderDetails.length - 1 && (
                <div className="border-b border-gray-50" />
              )}
            </div>
          ))}
        </div>

        {/* ── What's Next Section ──────────────────────────────────── */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">What&apos;s Next?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {nextSteps.map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4 text-center
                         hover:shadow-sm transition-shadow duration-200"
              >
                <div className="text-3xl mb-2">{step.emoji}</div>
                <p className="text-sm font-semibold text-gray-800 mb-1">{step.title}</p>
                <p className="text-xs text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Navigation Buttons ───────────────────────────────────── */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl
                       hover:bg-indigo-700 transition-all duration-200
                       shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <FaListAlt /> Track My Order
          </button>
          <button
            onClick={() => navigate('/products')}
            className="w-full py-3.5 border-2 border-indigo-600 text-indigo-600 font-semibold
                       rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200
                       flex items-center justify-center gap-2"
          >
            <FaShoppingBag /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
