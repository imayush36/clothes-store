'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS } from '@/lib/seedData';

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart, formatPrice } = useStore();

  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <div className={`drawer-backdrop ${isWishlistOpen ? 'open' : ''}`} onClick={() => setIsWishlistOpen(false)} />
      <aside className={`drawer-panel ${isWishlistOpen ? 'open' : ''}`}>
        <div className="drawer-header-tss">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 900 }}>
            MY WISHLIST ♥ ({wishlist.length})
          </h3>
          <button
            style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setIsWishlistOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 10px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>♥</div>
              <h4 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>
                Your Wishlist is Empty
              </h4>
              <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Tap the heart icon on any style to save it here!</p>
            </div>
          ) : (
            items.map((p) => (
              <div key={p.id} className="cart-item-row">
                <img src={p.images[0]} alt={p.name} className="cart-item-img" />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.88rem' }}>{p.name}</div>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--tss-red)' }}>{formatPrice(p.price)}</div>
                  <button
                    className="btn-tss-primary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem', marginTop: 6 }}
                    onClick={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0]?.name || 'Default')}
                  >
                    + Move to Bag
                  </button>
                </div>
                <button
                  style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.1rem' }}
                  onClick={() => toggleWishlist(p.id)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
