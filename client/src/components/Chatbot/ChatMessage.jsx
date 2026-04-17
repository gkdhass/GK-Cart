/**
 * @file client/src/components/Chatbot/ChatMessage.jsx
 * @description Single message bubble component for the chatbot.
 * Renders user messages (right-aligned, indigo) and bot messages (left-aligned, gray).
 * Supports special rendering for product results and order status data.
 */

import ProductCard from './ProductCard';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

/**
 * Format a Date object to a short time string (e.g., "2:45 PM")
 * @param {Date|String} date - Date to format
 * @returns {String} Formatted time string
 */
const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get the appropriate status icon and color for an order status.
 * @param {String} status - Order status string
 * @returns {Object} { icon, color, bgColor }
 */
const getStatusConfig = (status) => {
  const configs = {
    Pending: { icon: <FaClock />, color: 'text-amber-600', bgColor: 'bg-amber-50', label: 'Pending' },
    Shipped: { icon: <FaTruck />, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Shipped' },
    Delivered: { icon: <FaCheckCircle />, color: 'text-emerald-600', bgColor: 'bg-emerald-50', label: 'Delivered' },
    Cancelled: { icon: <FaTimesCircle />, color: 'text-red-600', bgColor: 'bg-red-50', label: 'Cancelled' },
  };
  return configs[status] || configs.Pending;
};

/**
 * Renders an order status card within the chat.
 * Shows order ID, status with icon, products summary, total, and estimated delivery.
 *
 * @param {Object} props
 * @param {Object} props.order - Order data from MongoDB
 * @returns {JSX.Element} Order status card
 */
function OrderCard({ order }) {
  const statusConfig = getStatusConfig(order.status);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-2">
      {/* Order Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBox className="text-indigo-600 text-sm" />
            <span className="text-sm font-bold text-gray-900">{order.orderId}</span>
          </div>
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full 
                           ${statusConfig.bgColor} ${statusConfig.color}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Order Details */}
      <div className="px-4 py-3 space-y-2">
        {/* Products list */}
        {order.products && order.products.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <span className="text-gray-600 truncate max-w-[60%]">
              {item.name} × {item.qty}
            </span>
            <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
          </div>
        ))}

        {/* Divider */}
        <div className="border-t border-gray-100 pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total</span>
            <span className="text-sm font-bold text-indigo-600">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        {/* Estimated Delivery */}
        {order.estimatedDelivery && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Est. Delivery</span>
            <span className="font-medium">
              {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Parse simple markdown-like formatting in bot messages.
 * Handles **bold** and line breaks.
 * @param {String} text - Raw message text
 * @returns {String} HTML-safe formatted text
 */
function formatMessage(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

/**
 * ChatMessage component — renders a single message bubble.
 * User messages: right-aligned with indigo background.
 * Bot messages: left-aligned with gray background and avatar.
 * Supports embedded ProductCard grid and OrderCard for rich responses.
 *
 * @param {Object} props
 * @param {Object} props.message - Message object
 * @param {String} props.message.role - "user" or "bot"
 * @param {String} props.message.type - "text", "products", or "order"
 * @param {String} props.message.content - Message text content
 * @param {*} props.message.data - Optional data (products array or order object)
 * @param {Date} props.message.timestamp - Message timestamp
 * @param {Boolean} props.message.isError - If true, style as error message
 * @param {Boolean} props.message.showQuickReplies - If true, show quick reply buttons after
 * @param {Function} props.onQuickReply - Handler for quick reply button clicks
 * @param {Array<String>} props.quickReplies - Quick reply button labels
 * @returns {JSX.Element} Message bubble with optional rich content
 */
function ChatMessage({ message, onQuickReply, quickReplies }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar (bot only) */}
        {!isUser && (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 
                          flex items-center justify-center flex-shrink-0 shadow-md mt-1">
            <span className="text-white text-xs font-bold">G</span>
          </div>
        )}

        {/* Message content */}
        <div className="space-y-1">
          {/* Message bubble */}
          <div
            className={`px-4 py-2.5 text-sm leading-relaxed break-words chat-message
                        ${isUser
                          ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-br-sm shadow-md'
                          : message.isError
                            ? 'bg-red-50 text-red-800 border border-red-200 rounded-2xl rounded-bl-sm'
                            : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm shadow-sm'
                        }`}
            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          />

          {/* Product cards grid (for product search results) */}
          {message.type === 'products' && message.data && message.data.length > 0 && (
            <div className="grid grid-cols-1 gap-2 mt-2">
              {message.data.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Order status card */}
          {message.type === 'order' && message.data && (
            <OrderCard order={message.data} />
          )}

          {/* Quick reply buttons */}
          {message.showQuickReplies && quickReplies && onQuickReply && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => onQuickReply(reply)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full
                             bg-white border border-indigo-200 text-indigo-600
                             hover:bg-indigo-50 hover:border-indigo-300
                             active:scale-95 transition-all duration-150
                             shadow-sm"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <p className={`text-[10px] px-1 ${isUser ? 'text-right text-gray-400' : 'text-gray-400'}`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
