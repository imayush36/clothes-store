'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCIES, PRODUCTS } from '@/lib/seedData';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [currentGender, setCurrentGender] = useState('men');
  const [currency, setCurrency] = useState('INR');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFandom, setActiveFandom] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('featured');
  const [isClubMember, setIsClubMember] = useState(false);
  const [theme, setTheme] = useState('light');
  const [toasts, setToasts] = useState([]);

  // Modals & Drawers State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isFitQuizOpen, setIsFitQuizOpen] = useState(false);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  // Discounts
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoDiscountAmount, setPromoDiscountAmount] = useState(0);
  const [promoCode, setPromoCode] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('tss_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('tss_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedClub = localStorage.getItem('tss_club_member');
      if (savedClub === 'true') setIsClubMember(true);

      const savedTheme = localStorage.getItem('tss_theme');
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch (e) {}
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tss_cart', JSON.stringify(cart));
      localStorage.setItem('tss_wishlist', JSON.stringify(wishlist));
      localStorage.setItem('tss_club_member', isClubMember ? 'true' : 'false');
      localStorage.setItem('tss_theme', theme);
    } catch (e) {}
  }, [cart, wishlist, isClubMember, theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`);
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const formatPrice = (inrPrice) => {
    const config = CURRENCIES[currency] || CURRENCIES.INR;
    const converted = inrPrice * config.rate;
    if (currency === 'INR') {
      return `${config.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${config.symbol}${converted.toFixed(2)}`;
  };

  const toggleClubMembership = () => {
    setIsClubMember(prev => {
      const next = !prev;
      if (next) {
        showToast('👑 Welcome to TSS VIP Club! Member prices unlocked storewide!', 'success');
      } else {
        showToast('TSS VIP Membership deactivated', 'info');
      }
      return next;
    });
  };

  const addToCart = (product, size, color, openDrawer = true) => {
    const unitPrice = isClubMember ? product.clubPrice : product.price;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: unitPrice,
          image: product.images ? product.images[0] : (product.colors ? product.colors[0]?.image : ''),
          size: size || (product.sizes ? product.sizes[0] : 'M'),
          color: color || (product.colors ? product.colors[0]?.name : 'Default'),
          quantity: 1
        }
      ];
    });

    if (openDrawer) {
      setIsCartOpen(true);
      showToast(`Added ${product.name} to bag!`, 'success');
    }
  };

  const updateCartQty = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      if (!updated[index]) return prev;
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        updated.splice(index, 1);
        showToast('Item removed from bag', 'info');
      }
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    showToast('Item removed from bag', 'info');
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist! ♥', 'success');
        return [...prev, productId];
      }
    });
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setActiveFandom('all');
    setSearchQuery('');
    setMaxPrice(5000);
    setSortBy('featured');
    setIsFilterPopupOpen(false);
    showToast('Filters reset to default', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentGender,
        setCurrentGender,
        currency,
        setCurrency,
        cart,
        setCart,
        wishlist,
        activeCategory,
        setActiveCategory,
        activeFandom,
        setActiveFandom,
        searchQuery,
        setSearchQuery,
        maxPrice,
        setMaxPrice,
        sortBy,
        setSortBy,
        isClubMember,
        toggleClubMembership,
        theme,
        toggleTheme,
        toasts,
        showToast,
        formatPrice,
        addToCart,
        updateCartQty,
        removeFromCart,
        toggleWishlist,
        resetFilters,
        // Modals & Drawers
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        quickViewProduct,
        setQuickViewProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackOrderOpen,
        setIsTrackOrderOpen,
        isFitQuizOpen,
        setIsFitQuizOpen,
        isFilterPopupOpen,
        setIsFilterPopupOpen,
        // Discounts
        appliedDiscount,
        setAppliedDiscount,
        promoDiscountAmount,
        setPromoDiscountAmount,
        promoCode,
        setPromoCode
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
