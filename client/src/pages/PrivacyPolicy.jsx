/**
 * @file client/src/pages/PrivacyPolicy.jsx
 * @description Privacy Policy page for K_M_Cart.
 * Route: /privacy-policy
 */

import { Link } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

function PrivacyPolicy() {
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
              <FaShieldAlt size={20} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-sm text-gray-400">Last updated: April 2026</p>
            </div>
          </div>

          <div className="prose prose-sm prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and delivery address when you create an account or place an order.</li>
                <li><strong>Payment Information:</strong> Payment details are processed securely through Razorpay. We do not store your card numbers on our servers.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our platform, including pages visited, products viewed, and search queries.</li>
                <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">2. How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and delivery updates</li>
                <li>Provide customer support via our AI chatbot and email</li>
                <li>Personalize your shopping experience with product recommendations</li>
                <li>Improve our platform, services, and user experience</li>
                <li>Prevent fraud and ensure platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">3. Cookies & Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience. Cookies help us remember your preferences, keep you logged in, and analyze site traffic. You can manage cookie preferences in your browser settings. Disabling cookies may affect some features of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">4. Third-Party Services</h2>
              <p>We may share your information with trusted third-party services:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Razorpay:</strong> For secure payment processing</li>
                <li><strong>MongoDB Atlas:</strong> For secure data storage</li>
                <li><strong>Delivery Partners:</strong> To fulfill and deliver your orders</li>
              </ul>
              <p className="mt-2">We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information. All data is encrypted in transit using TLS/SSL. Passwords are hashed using bcrypt with 12 salt rounds. However, no method of electronic transmission or storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access and review your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
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

export default PrivacyPolicy;
