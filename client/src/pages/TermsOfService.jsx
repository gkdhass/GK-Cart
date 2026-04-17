/**
 * @file client/src/pages/TermsOfService.jsx
 * @description Terms of Service page for K_M_Cart.
 * Route: /terms-of-service
 */

import { Link } from 'react-router-dom';
import { FaArrowLeft, FaFileContract } from 'react-icons/fa';

function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 page-enter">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 mb-6 transition-colors">
          <FaArrowLeft size={12} /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <FaFileContract size={20} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-sm text-gray-400">Last updated: April 2026</p>
            </div>
          </div>

          <div className="prose prose-sm prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing and using K_M_Cart, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform. These terms apply to all visitors, users, and customers of K_M_Cart.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">2. Products & Services</h2>
              <p>
                K_M_Cart offers a selection of electronics, accessories, and lifestyle products. We strive to display accurate product descriptions, images, and pricing. However, we do not guarantee that all information is error-free. Prices are subject to change without notice.
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Product availability is subject to stock levels</li>
                <li>Images are for illustration purposes and may vary slightly from the actual product</li>
                <li>We reserve the right to limit quantities on any order</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">4. Orders & Payments</h2>
              <p>By placing an order, you agree to the following:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All orders are subject to acceptance and availability</li>
                <li>We accept Cash on Delivery (COD) and online payments via Razorpay (UPI, Credit/Debit Card, Net Banking)</li>
                <li>Order confirmation is sent upon successful placement</li>
                <li>GST (18%) is applied to all orders as required by Indian tax law</li>
                <li>Delivery charges apply for orders below ₹500</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">5. Shipping & Delivery</h2>
              <p>
                We aim to deliver all orders within 5-7 business days across India. Delivery times may vary based on your location and product availability. You will receive tracking updates via your account dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">6. Returns & Refunds</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Products can be returned within 7 days of delivery</li>
                <li>Items must be in original condition with tags and packaging intact</li>
                <li>Refunds will be processed within 5-7 business days after return approval</li>
                <li>Certain products (personal care, innerwear) are not eligible for return</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">7. Limitation of Liability</h2>
              <p>
                K_M_Cart shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. Our total liability is limited to the amount you paid for the specific product or service giving rise to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of K_M_Cart after changes constitutes acceptance of the new terms. We encourage you to review this page periodically.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">9. Contact Us</h2>
              <p>
                For questions about these terms, please contact us at{' '}
                <a href="mailto:support@gkcart.com" className="text-indigo-600 hover:underline">support@gkcart.com</a>{' '}
                or visit our <Link to="/contact" className="text-indigo-600 hover:underline">Contact Us</Link> page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
