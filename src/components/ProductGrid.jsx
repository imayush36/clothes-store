'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';
import { PRODUCTS } from '@/lib/seedData';

export default function ProductGrid() {
  const {
    currentGender,
    activeCategory,
    setActiveCategory,
    activeFandom,
    searchQuery,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    formatPrice,
    resetFilters,
    isFilterPopupOpen,
    setIsFilterPopupOpen,
    setIsFitQuizOpen,
    showToast
  } = useStore();

  const [products, setProducts] = useState(PRODUCTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          gender: currentGender,
          category: activeCategory,
          fandom: activeFandom,
          search: searchQuery,
          maxPrice: maxPrice.toString(),
          sort: sortBy
        });

        const res = await fetch(`/api/products?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        } else {
          // In-memory fallback
          applyClientFilter();
        }
      } catch (e) {
        applyClientFilter();
      } finally {
        setLoading(false);
      }
    }

    function applyClientFilter() {
      let filtered = PRODUCTS.filter((prod) => {
        if (currentGender === 'women' && (prod.gender !== 'women' || prod.category === 'footwear')) return false;
        if (currentGender === 'men' && (prod.gender === 'women' || prod.category === 'footwear')) return false;
        if (currentGender === 'footwear' && prod.category !== 'footwear') return false;
        if (activeCategory !== 'all' && prod.category !== activeCategory) return false;
        if (activeFandom !== 'all' && prod.fandom !== activeFandom) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (!prod.name.toLowerCase().includes(q) && !prod.category.toLowerCase().includes(q)) return false;
        }
        if (prod.price > maxPrice) return false;
        return true;
      });

      if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
      else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
      else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

      setProducts(filtered);
    }

    loadProducts();
  }, [currentGender, activeCategory, activeFandom, searchQuery, maxPrice, sortBy]);

  return (
    <section className="catalog-section" id="catalog-section">
      <div className="container">
        {/* Minimalist Top Filter Bar */}
        <div className="tss-compact-filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-compact-filter-icon" onClick={() => setIsFilterPopupOpen(true)}>
              <span className="filter-icon-svg">🎛️</span>
              <span>FILTERS</span>
            </button>

            <div className="quick-cat-pills-bar">
              {['all', 'oversized', 'hoodies', 'bottoms', 'jackets', 'footwear'].map((cat) => (
                <button
                  key={cat}
                  className={`quick-cat-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)' }}>SORT:</span>
              <select className="sort-select-top" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Popularity & Drops</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated ⭐</option>
              </select>
            </div>
            <span className="results-count-badge" id="results-count">
              {currentGender === 'footwear' ? 'SNEAKERS COLLECTION' : `${currentGender.toUpperCase()}'S APPAREL`} ({products.length} ITEMS)
            </span>
          </div>
        </div>

        {/* Compact Filter Popup Card */}
        {isFilterPopupOpen && (
          <>
            <div className="filter-popup-overlay open" onClick={() => setIsFilterPopupOpen(false)} />
            <div className="filter-popup-card open">
              <div className="filter-popup-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>🎛️</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 900 }}>FILTER APPAREL</h3>
                </div>
                <button className="filter-popup-close" onClick={() => setIsFilterPopupOpen(false)}>
                  ✕
                </button>
              </div>

              <div className="filter-popup-body">
                <div className="filter-popup-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span className="filter-sub-label">Price Range</span>
                    <span style={{ fontWeight: 900, color: 'var(--tss-red)', fontSize: '0.9rem' }}>{formatPrice(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    style={{ width: '100%', accentColor: 'var(--tss-red)' }}
                    min="800"
                    max="5000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>₹800</span>
                    <span>₹5,000</span>
                  </div>
                </div>

                <div className="filter-popup-group">
                  <span className="filter-sub-label">Select Size</span>
                  <div className="size-pill-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <button
                        key={sz}
                        className="size-pill-tss"
                        onClick={() => {
                          showToast(`Filtered for size: ${sz}`);
                          setIsFilterPopupOpen(false);
                        }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn-tss-fit-quiz"
                  onClick={() => {
                    setIsFilterPopupOpen(false);
                    setIsFitQuizOpen(true);
                  }}
                >
                  📐 FIND MY EXACT TSS FIT
                </button>
              </div>

              <div className="filter-popup-footer">
                <button className="btn-reset-top" style={{ flex: 1, padding: 10 }} onClick={resetFilters}>
                  RESET ALL
                </button>
                <button className="btn-tss-primary" style={{ flex: 1.5, padding: 10, justifyContent: 'center' }} onClick={() => setIsFilterPopupOpen(false)}>
                  APPLY
                </button>
              </div>
            </div>
          </>
        )}

        {/* Floating Corner Filter Button */}
        <button className="floating-corner-filter-btn" onClick={() => setIsFilterPopupOpen(true)} title="Open Filters">
          <span>🎛️</span>
          <span className="floating-btn-text">Filters</span>
        </button>

        {/* Products Grid */}
        <div className="products-grid-tss">
          {products.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--tss-border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 10 }}>🔍</div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: 8 }}>No garments match your filters</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Try adjusting your search query, size, or price slider.</p>
              <button className="btn-tss-primary" onClick={resetFilters}>Reset All Filters</button>
            </div>
          ) : (
            products.map((prod) => <ProductCard key={prod.id} product={prod} />)
          )}
        </div>
      </div>
    </section>
  );
}
