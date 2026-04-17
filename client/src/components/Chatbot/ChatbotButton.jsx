/**
 * @file client/src/components/Chatbot/ChatbotButton.jsx
 * @description Floating action button (FAB) that toggles the chatbot modal.
 * Fixed position at bottom-right corner with gradient background,
 * pulse animation ring, hover scale effect, and unread message badge.
 */

import { FaRobot, FaTimes } from 'react-icons/fa';

/**
 * ChatbotButton component — floating circular trigger button.
 * Features:
 * - Gradient background (indigo → purple)
 * - Pulsing animation ring to attract attention
 * - Unread message badge counter
 * - Smooth icon transition between robot and close icons
 *
 * @param {Object} props
 * @param {Boolean} props.isOpen - Whether the chat modal is currently open
 * @param {Number} props.unreadCount - Number of unread messages
 * @param {Function} props.onClick - Toggle handler
 * @returns {JSX.Element} Floating action button
 */
function ChatbotButton({ isOpen, unreadCount, onClick }) {
  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50" id="chatbot-fab">
      {/* Pulse ring animation (only visible when chat is closed) */}
      {!isOpen && (
        <span
          className="absolute inset-0 rounded-full bg-indigo-400 opacity-30 animate-pulse-ring"
          aria-hidden="true"
        />
      )}

      {/* Main FAB button */}
      <button
        onClick={onClick}
        className={`relative w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full
                   bg-gradient-to-br from-indigo-600 to-purple-600
                   text-white shadow-lg
                   flex items-center justify-center
                   hover:scale-110 hover:shadow-button-glow
                   active:scale-95
                   transition-all duration-300 ease-out
                   focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2`}
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
        title={isOpen ? 'Close chat' : 'Chat with K_M_Cart Assistant'}
      >
        {/* Icon toggle: Robot ↔ Close */}
        <span
          className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
        >
          {isOpen ? (
            <FaTimes className="text-xl" />
          ) : (
            <FaRobot className="text-xl sm:text-2xl" />
          )}
        </span>

        {/* Unread message badge */}
        {!isOpen && unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 
                       bg-red-500 text-white text-[10px] font-bold
                       rounded-full flex items-center justify-center
                       shadow-md animate-scale-in"
            aria-label={`${unreadCount} unread messages`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

export default ChatbotButton;
