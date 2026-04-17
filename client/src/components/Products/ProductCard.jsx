/**
 * @file client/src/components/Products/ProductCard.jsx
 * @description Product card for K_M_Cart grocery store.
 * Shows: real product image via ProductImage, English name, Tamil name,
 * price with unit, category badge, featured badge, Add to Cart & Buy Now.
 * Theme: Indigo Blue (#7C8BF2) + Lavender (#DFE1F2)
 */

import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaBolt, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductImage from './ProductImage';

/**
 * Renders star rating icons based on numeric rating.
 */
function StarRating({ rating, size = 'text-sm' }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} className={`text-amber-400 ${size}`} />);
    } else if (i === fullStars && hasHalf) {
      stars.push(<FaStarHalfAlt key={i} className={`text-amber-400 ${size}`} />);
    } else {
      stars.push(<FaRegStar key={i} className={`text-amber-400 ${size}`} />);
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
}

/**
 * ProductCard — K_M_Cart grocery product card.
 */
function ProductCard({ product, onAddToCart, onBuyNow }) {
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const navigate = useNavigate();

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const hasDiscount = product.discount > 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onBuyNow?.(product);
  };

  const formatPrice = (price) => '₹' + price.toLocaleString('en-IN');

  // Get the best image URL: images array → image field → dynamic unsplash fallback
  const productImageUrl =
    product.images?.[0] ||
    product.image ||
    `https://source.unsplash.com/300x300/?grocery,${encodeURIComponent(product.name)}`;

  // Unit display
  const unitLabel = product.unit ? ` / ${product.unit}` : '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
                    hover:shadow-md hover:border-[#C9CDED] hover:scale-[1.02] transition-all duration-200 flex flex-col">
      {/* ── Image Section ──────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-t-xl h-48 bg-gray-100 cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <ProductImage
          src={productImageUrl}
          alt={product.name}
          name={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />

        {/* Category badge top-left */}
        <span className="absolute top-2 left-2 bg-[#7C8BF2] text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm z-10">
          {product.category}
        </span>

        {/* Featured badge top-right */}
        {product.isFeatured && (
          <span className="absolute top-2 right-10 bg-[#5A6BE0] text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm z-10">
            ⭐ Featured
          </span>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm z-10">
            −{product.discount}%
          </span>
        )}

        {/* Wishlist heart */}
        <button
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted); }}
          className={`absolute bottom-2 right-2 p-2 rounded-lg border transition-colors duration-200 z-10
                     ${wishlisted
                       ? 'bg-[#DFE1F2] border-[#7C8BF2] text-[#7C8BF2]'
                       : 'bg-white/90 border-gray-200 text-gray-400 hover:border-[#7C8BF2] hover:text-[#7C8BF2]'
                     }`}
          aria-label="Toggle wishlist"
        >
          {wishlisted ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
        </button>

        {/* Stock badge bottom-left */}
        <span className={`absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium z-10
                         ${isOutOfStock
                           ? 'bg-red-100 text-red-700'
                           : isLowStock
                             ? 'bg-amber-100 text-amber-700'
                             : 'bg-emerald-100 text-emerald-700'
                         }`}>
          {isOutOfStock
            ? 'Out of Stock'
            : isLowStock
              ? `Only ${product.stock} left`
              : 'In Stock'}
        </span>
      </div>

      {/* ── Content Section ────────────────────────────────────── */}
      <div className="p-3 flex flex-col flex-1">
        {/* Product Name (English) */}
        <h3
          className="font-bold text-gray-800 text-sm truncate mb-0.5
                     cursor-pointer hover:text-[#7C8BF2] transition-colors duration-200"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </h3>

        {/* Tamil Name */}
        {product.nameTamil && (
          <p className="text-[#7C8BF2] text-xs mt-0.5 truncate font-medium">{product.nameTamil}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5 mb-1.5">
          <StarRating rating={product.rating} size="text-xs" />
          <span className="text-xs font-bold text-gray-700">{product.rating}</span>
          {product.reviewCount > 0 && (
            <span className="text-xs text-gray-400">
              ({product.reviewCount.toLocaleString('en-IN')})
            </span>
          )}
        </div>

        {/* Price + Unit + Stock */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-[#5A6BE0] font-bold text-base">
            {formatPrice(product.price)}
            <span className="text-gray-500 text-xs font-normal">{unitLabel}</span>
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || added}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-150
                       flex items-center justify-center gap-1.5
                       ${added
                         ? 'border-2 border-emerald-500 text-emerald-600 bg-emerald-50'
                         : isOutOfStock
                           ? 'border-2 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                           : 'border-2 border-[#7C8BF2] text-[#7C8BF2] hover:bg-[#DFE1F2]'
                       }`}
          >
            {added ? '✓ Added' : <><FaShoppingCart className="text-xs" /> Add</>}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[#7C8BF2] text-white
                       hover:bg-[#5A6BE0] transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-1.5"
          >
            <FaBolt className="text-xs" /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
