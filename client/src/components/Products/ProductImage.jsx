/**
 * @file client/src/components/Products/ProductImage.jsx
 * @description Reusable product image component with loading skeleton,
 * error fallback, and lazy loading for performance.
 */

import { useState } from 'react';

/**
 * ProductImage — handles image loading states gracefully.
 * Shows a skeleton while loading, falls back to a branded placeholder on error.
 *
 * @param {string} src        - Image URL
 * @param {string} alt        - Alt text
 * @param {string} name       - Product name (used for fallback text)
 * @param {string} className  - Additional CSS classes for the <img>
 */
function ProductImage({ src, alt, name, className = '' }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const fallbackUrl = `https://placehold.co/300x300/16A34A/FFFFFF?text=${encodeURIComponent(name || alt || 'Product')}`;

  // Determine the final src to use
  const imgSrc = error ? fallbackUrl : (src || fallbackUrl);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton loader — visible while image is loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-lg" />
      )}

      {/* Actual image */}
      <img
        src={imgSrc}
        alt={alt || name || 'Product'}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}

export default ProductImage;
