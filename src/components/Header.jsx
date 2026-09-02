'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS } from '@/lib/seedData';

export default function Header() {
  const {
    currentGender,
    setCurrentGender,
    currency,
    setCurrency,
    cart,
    wishlist,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    isClubMember,
    toggleClubMembership,
    theme,
    toggleTheme,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsTrackOrderOpen,
    setQuickViewProduct,
    formatPrice,
    showToast
  } = useStore();

  const [autocompleteItems, setAutocompleteItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase();
      const matches = PRODUCTS.filter(
        p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.fandom.toLowerCase().includes(q)
      ).slice(0, 5);
      setAutocompleteItems(matches);
      setShowDropdown(matches.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Utilities Gender Bar */}
      <div className="tss-gender-top-bar">
        <div className="container gender-bar-flex">
          <div className="gender-tabs">
            <button
              className={`gender-tab-btn ${currentGender === 'men' ? 'active' : ''}`}
              onClick={() => {
                setCurrentGender('men');
                setActiveCategory('all');
                showToast("Showing Men's Collection");
              }}
            >
              MEN
            </button>
            <button
              className={`gender-tab-btn ${currentGender === 'women' ? 'active' : ''}`}
              onClick={() => {
                setCurrentGender('women');
                setActiveCategory('all');
                showToast("Showing Women's Collection");
              }}
            >
              WOMEN
            </button>
            <button
              className={`gender-tab-btn ${currentGender === 'footwear' ? 'active' : ''}`}
              onClick={() => {
                setCurrentGender('footwear');
                setActiveCategory('footwear');
                showToast("Showing Sneakers Collection 👟");
              }}
            >
              SNEAKERS 👟
            </button>
          </div>

          <div className="top-bar-right-actions">
            <button className="top-nav-link-btn" onClick={() => setIsTrackOrderOpen(true)}>
              <span>🚚</span> Track Order
            </button>

            <select
              className="top-currency-select"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                showToast(`Currency set to ${e.target.value}`);
              }}
            >
              <option value="INR">🇮🇳 INR (₹)</option>
              <option value="USD">🇺🇸 USD ($)</option>
              <option value="EUR">🇪🇺 EUR (€)</option>
              <option value="GBP">🇬🇧 GBP (£)</option>
            </select>

            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>

            <span className="free-shipping-tag">📦 Free Shipping on ₹999+</span>
          </div>
        </div>
      </div>

      {/* Top Promo Ticker */}
      <div className="top-promo-ticker">
        <span>
          FLAT ₹200 OFF on your first streetwear drop order above ₹999 • Code: <span className="promo-code-pill">TSS200</span>
        </span>
      </div>

      {/* Main Header */}
      <header className="site-tss-header">
        <div className="container header-inner">
          {/* TSS Brand Logo */}
          <a href="#hero" className="tss-logo-link">
            <div className="tss-logo-ghost">👻</div>
            <div className="tss-logo-text">
              <span className="tss-logo-main">The Souled Store</span>
              <span className="tss-logo-sub">OFFICIAL MERCHANDISE</span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="tss-nav-menu">
            <span className="tss-nav-item" onClick={() => setActiveCategory('all')}>ALL DROPS</span>
            <span className="tss-nav-item badge-hot-link" onClick={() => setActiveCategory('oversized')}>🔥 OVERSIZED</span>
            <span className="tss-nav-item" onClick={() => setActiveCategory('hoodies')}>HOODIES</span>
            <span className="tss-nav-item" onClick={() => setActiveCategory('bottoms')}>CARGOS</span>
            <span className="tss-nav-item" onClick={() => setActiveCategory('jackets')}>JACKETS</span>
            <span className="tss-nav-item" onClick={() => setActiveCategory('footwear')}>KICKS</span>
          </nav>

          {/* Search Box with Autocomplete */}
          <div className="tss-search-container" ref={searchRef}>
            <span className="tss-search-icon">🔍</span>
            <input
              type="text"
              className="tss-search-input"
              placeholder="Search anime, marvel, oversized tees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />

            {showDropdown && (
              <div className="search-autocomplete-dropdown">
                <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Top Suggestions ({autocompleteItems.length})
                </div>
                {autocompleteItems.map((item) => (
                  <div
                    key={item.id}
                    className="autocomplete-item"
                    onClick={() => {
                      setQuickViewProduct(item);
                      setShowDropdown(false);
                    }}
                  >
                    <img src={item.images[0]} style={{ width: 36, height: 42, objectFit: 'cover', borderRadius: 4 }} alt={item.name} />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--tss-red)', fontWeight: 700 }}>
                        {formatPrice(isClubMember ? item.clubPrice : item.price)}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 4 }}>
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Header Actions */}
          <div className="tss-header-actions">
            <button className="tss-club-vip-pill" onClick={toggleClubMembership}>
              <span>👑</span>
              <span>{isClubMember ? 'VIP CLUB ACTIVE ✨' : 'JOIN CLUB'}</span>
            </button>

            <button className="icon-action-btn" onClick={() => setIsWishlistOpen(true)} title="Wishlist">
              <span>♥</span>
              {wishlist.length > 0 && <span className="action-counter-badge">{wishlist.length}</span>}
            </button>

            <button className="icon-action-btn" onClick={() => setIsCartOpen(true)} title="Cart">
              <span>🛍️</span>
              {totalCartCount > 0 && <span className="action-counter-badge">{totalCartCount}</span>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
