/**
 * @file client/src/components/Chatbot/ProductCard.jsx
 * @description Compact product card rendered inside chat messages.
 * Designed to fit within a ~360px chat window width.
 * Shows product image, name, brand, price, rating, discount, review count,
 * and Add to Cart + Buy Now buttons wired to CartContext.
 */

import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaBolt } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

/**
 * Renders star rating icons (filled, half, empty) based on numeric rating.
 * @param {Number} rating - Product rating from 0 to 5
 * @returns {JSX.Element} Star rating row
 */
function StarRating({ rating }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} className="text-amber-400 text-[11px]" />);
    } else if (i === fullStars && hasHalf) {
      stars.push(<FaStarHalfAlt key={i} className="text-amber-400 text-[11px]" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-amber-400 text-[11px]" />);
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
}

/**
 * ProductCard component — compact product display for chat messages.
 * Fits within the chat modal width (~360px) with image, details, and dual CTAs.
 *
 * @param {Object} props
 * @param {Object} props.product - Product data from MongoDB
 * @returns {JSX.Element} Compact product card
 */
function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const hasDiscount = product.discount > 0;

  /**
   * Handle add-to-cart click with visual feedback.
   */
  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  /**
   * Handle buy now — add to cart and navigate to checkout.
   */
  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  /**
   * Format price in Indian Rupee format (e.g., ₹1,29,999)
   * @param {Number} price - Price value
   * @returns {String} Formatted price string
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden
                 hover:shadow-md transition-all duration-200"
    >
      <div className="flex gap-3 p-3">
        {/* Product Image */}
        <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 relative">
          <img
            src={imgError ? 'https://via.placeholder.com/80x96?text=No+Img' : product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
          {/* Discount badge */}
          {hasDiscount && (
            <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] px-1.5 py-0.5
                            rounded-full font-bold">
              −{product.discount}%
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          {/* Brand badge */}
          <span className="inline-block text-[10px] font-medium text-indigo-600 bg-indigo-50
                          px-1.5 py-0.5 rounded-full">
            {product.brand}
          </span>

          {/* Name (truncated to 1 line) */}
          <h4 className="text-sm font-semibold text-gray-900 truncate mt-0.5">
            {product.name}
          </h4>

          {/* Rating + Review count */}
          <div className="flex items-center gap-1 mt-1">
            <StarRating rating={product.rating} />
            <span className="text-[10px] text-gray-600 font-medium">{product.rating}</span>
            {product.reviewCount > 0 && (
              <span className="text-[10px] text-gray-400">
                ({product.reviewCount.toLocaleString('en-IN')})
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-base font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && product.originalPrice > 0 && (
              <span className="text-[10px] text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dual Action Buttons */}
      <div className="flex">
        <button
          onClick={handleAddToCart}
          disabled={added || product.stock === 0}
          className={`flex-1 py-2 text-xs font-semibold transition-all duration-200
                     flex items-center justify-center gap-1 border-t border-r border-gray-100
                     ${added
                       ? 'bg-emerald-50 text-emerald-600'
                       : product.stock === 0
                         ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                         : 'bg-white text-indigo-600 hover:bg-indigo-50'
                     }`}
        >
          {added ? '✓ Added!' : <><FaShoppingCart className="text-[10px]" /> Add to Cart</>}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="flex-1 py-2 text-xs font-semibold transition-all duration-200
                     bg-gradient-to-r from-indigo-600 to-purple-600 text-white
                     hover:from-indigo-700 hover:to-purple-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-1 border-t border-gray-100"
        >
          <FaBolt className="text-[10px]" /> Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
