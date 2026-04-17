/**
 * @file client/src/components/Chatbot/TypingIndicator.jsx
 * @description Animated three-dot typing indicator shown when the bot is
 * "thinking" / processing a response. Uses staggered CSS bounce animation.
 */

/**
 * TypingIndicator component — renders three bouncing dots to simulate
 * the bot typing a response. Each dot has a staggered animation delay.
 *
 * @returns {JSX.Element} Animated typing indicator
 */
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 animate-fade-in">
      {/* Bot avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 
                      flex items-center justify-center flex-shrink-0 shadow-md">
        <span className="text-white text-xs font-bold">G</span>
      </div>

      {/* Typing dots bubble */}
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {/* Dot 1 — no delay */}
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-dot"
            style={{ animationDelay: '0ms' }}
          />
          {/* Dot 2 — 150ms delay */}
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-dot"
            style={{ animationDelay: '150ms' }}
          />
          {/* Dot 3 — 300ms delay */}
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-dot"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
