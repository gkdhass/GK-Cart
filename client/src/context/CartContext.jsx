/**
 * @file client/src/context/CartContext.jsx
 * @description React Context for global cart state management.
 * Manages cart items array with localStorage persistence, provides
 * computed values (cartCount, cartTotal), and cart manipulation functions.
 *
 * Usage: Wrap app with <CartProvider>, then use useCart() hook in components.
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

/** Cart context with default null value */
const CartContext = createContext(null);

/** localStorage key for persisting cart data */
const CART_STORAGE_KEY = 'gkcart_items';

/**
 * Safely read cart items from localStorage.
 * Returns an empty array if parsing fails or no data exists.
 *
 * @returns {Array} Stored cart items or empty array
 */
function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  return [];
}

/**
 * Persist cart items to localStorage.
 *
 * @param {Array} items - Cart items array to save
 */
function saveCartToStorage(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

/**
 * CartProvider component — wraps the app to provide cart state globally.
 * Handles:
 * - Restoring cart from localStorage on mount
 * - Adding, removing, updating cart items
 * - Computing cartCount (total qty) and cartTotal (sum of price × qty)
 * - Toggling cart drawer visibility
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Context provider wrapping children
 */
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage());
  const [isCartOpen, setIsCartOpen] = useState(false);

  /**
   * Persist cartItems to localStorage whenever they change.
   */
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  /**
   * Add a product to the cart.
   * If the product already exists, increase qty by 1 (capped at product.stock).
   * If it's a new product, add it with qty: 1.
   *
   * @param {Object} product - Product object with _id, name, image, price, brand, stock
   */
  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item._id === product._id);

      if (existingIndex > -1) {
        // Product already in cart — increase qty (cap at stock)
        const updated = [...prev];
        const currentItem = updated[existingIndex];
        const maxStock = product.stock ?? currentItem.stock ?? 99;
        if (currentItem.qty < maxStock) {
          updated[existingIndex] = { ...currentItem, qty: currentItem.qty + 1 };
        }
        return updated;
      }

      // New product — add with qty: 1
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          brand: product.brand || 'Generic',
          qty: 1,
          stock: product.stock ?? 99,
        },
      ];
    });
  }, []);

  /**
   * Remove a product from the cart by its _id.
   *
   * @param {String} productId - The _id of the product to remove
   */
  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  }, []);

  /**
   * Update the quantity of a cart item.
   * If newQty < 1, removes the item.
   * If newQty > stock, caps at stock.
   *
   * @param {String} productId - The _id of the product to update
   * @param {Number} newQty - The desired new quantity
   */
  const updateQty = useCallback(
    (productId, newQty) => {
      if (newQty < 1) {
        removeFromCart(productId);
        return;
      }

      setCartItems((prev) =>
        prev.map((item) => {
          if (item._id === productId) {
            const cappedQty = Math.min(newQty, item.stock);
            return { ...item, qty: cappedQty };
          }
          return item;
        })
      );
    },
    [removeFromCart]
  );

  /**
   * Clear all items from the cart and remove from localStorage.
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  /**
   * Toggle the cart drawer open/closed.
   */
  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  /**
   * Computed: total number of items in cart (sum of all qty values).
   */
  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.qty, 0),
    [cartItems]
  );

  /**
   * Computed: total price of all cart items (sum of price × qty).
   */
  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.qty, 0),
    [cartItems]
  );

  // Context value exposed to consumers
  const value = useMemo(
    () => ({
      cartItems,
      isCartOpen,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      toggleCart,
    }),
    [cartItems, isCartOpen, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart, toggleCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Custom hook to access cart context.
 * Must be used within a CartProvider.
 *
 * @returns {Object} { cartItems, isCartOpen, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart, toggleCart }
 * @throws {Error} If used outside of CartProvider
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
