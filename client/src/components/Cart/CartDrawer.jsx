/**
 * @file client/src/components/Cart/CartDrawer.jsx
 * @description Slide-in cart drawer component that renders from the right side.
 * Shows cart items with qty controls, subtotal, and checkout button.
 * Includes dark overlay, smooth animation, and responsive design.
 */

import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaTimes, FaShoppingCart, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useState, useCallback } from 'react';

/**
 * CartDrawer component — full-height slide-in panel from the right.
 * Shows cart contents with edit controls, subtotal, and checkout CTA.
 *
 * @returns {JSX.Element} Cart drawer with overlay
 */
function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    cartCount,
    cartTotal,
    updateQty,
    removeFromCart,
    toggleCart,
  } = useCart();

  const navigate = useNavigate();

  /**
   * Handle "Proceed to Checkout" click.
   * Navigates to checkout page and closes the drawer.
   */
  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  /**
   * Handle "Continue Shopping" click.
   * Closes the cart drawer.
   */
  const handleContinueShopping = () => {
    toggleCart();
  };

  /**
   * Format price in Indian Rupee format.
   * @param {Number} price - Price value
   * @returns {String} Formatted price string
   */
  const formatPrice = (price) => {
    return '₹' + price.toLocaleString('en-IN');
  };

  return (
    <>
      {/* ── Dark Overlay ───────────────────────────────────────────── */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={toggleCart}
          aria-hidden="true"
        />
      )}

      {/* ── Cart Panel ─────────────────────────────────────────────── */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50
                    flex flex-col transform transition-transform duration-300 ease-in-out
                    ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">My Cart</h2>
            <span className="text-sm text-gray-400">
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            onClick={toggleCart}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
                       transition-all duration-200"
            aria-label="Close cart"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* ── Items Section ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {cartItems.length === 0 ? (
            /* ── Empty State ────────────────────────────────────── */
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <FaShoppingCart className="text-3xl text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium mb-1">Your cart is empty</p>
              <p className="text-gray-400 text-sm mb-6">
                Looks like you haven't added anything yet
              </p>
              <button
                onClick={handleContinueShopping}
                className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold
                           rounded-xl hover:bg-indigo-700 transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            /* ── Cart Items List ────────────────────────────────── */
            <div className="px-4 py-3 space-y-0">
              {cartItems.map((item, index) => (
                <div key={item._id}>
                  <CartItem
                    item={item}
                    onUpdateQty={updateQty}
                    onRemove={removeFromCart}
                    formatPrice={formatPrice}
                    onNavigate={(productId) => {
                      toggleCart();
                      navigate(`/product/${productId}`);
                    }}
                  />
                  {index < cartItems.length - 1 && (
                    <div className="border-b border-gray-50 my-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Subtotal</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(cartTotal)}
            </span>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-400">
            Taxes and delivery calculated at checkout
          </p>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl
                       hover:bg-indigo-700 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600
                       shadow-lg shadow-indigo-200"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * CartItem component — renders a single cart item row inside the drawer.
 *
 * @param {Object} props
 * @param {Object} props.item - Cart item data
 * @param {Function} props.onUpdateQty - Callback to update quantity
 * @param {Function} props.onRemove - Callback to remove item
 * @param {Function} props.formatPrice - Price formatting function
 * @returns {JSX.Element} Cart item row
 */
function CartItem({ item, onUpdateQty, onRemove, formatPrice, onNavigate }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex gap-3 py-3 group">
      {/* Product Image — clickable */}
      <button
        onClick={() => onNavigate(item._id)}
        className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50
                   hover:ring-2 hover:ring-indigo-300 transition-all duration-200"
        aria-label={`View ${item.name} details`}
      >
        <img
          src={imgError ? 'https://via.placeholder.com/64x64?text=No+Img' : item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </button>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        {/* Name — clickable */}
        <button
          onClick={() => onNavigate(item._id)}
          className="text-sm font-medium text-gray-900 truncate block text-left
                     hover:text-indigo-600 transition-colors duration-200 w-full"
        >
          {item.name}
        </button>

        {/* Brand */}
        <p className="text-xs text-gray-400 mt-0.5">{item.brand}</p>

        {/* Price */}
        <p className="text-sm font-semibold text-gray-800 mt-1">
          {formatPrice(item.price)}
        </p>

        {/* Qty Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-0">
            {/* Minus button */}
            <button
              onClick={() => onUpdateQty(item._id, item.qty - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-l-lg border border-gray-200
                         text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Decrease quantity"
            >
              <FaMinus className="text-[10px]" />
            </button>

            {/* Qty display */}
            <div className="w-9 h-7 flex items-center justify-center border-y border-gray-200
                            text-sm font-medium text-gray-800 bg-gray-50">
              {item.qty}
            </div>

            {/* Plus button */}
            <button
              onClick={() => onUpdateQty(item._id, item.qty + 1)}
              disabled={item.qty >= item.stock}
              className="w-7 h-7 flex items-center justify-center rounded-r-lg border border-gray-200
                         text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <FaPlus className="text-[10px]" />
            </button>
          </div>

          {/* Remove button */}
          <button
            onClick={() => onRemove(item._id)}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50
                       transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Remove item"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;
