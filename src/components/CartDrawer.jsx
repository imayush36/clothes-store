'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    removeFromCart,
    formatPrice,
    appliedDiscount,
    promoDiscountAmount,
    setIsCheckoutOpen,
    setActiveCategory
  } = useStore();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * appliedDiscount + promoDiscountAmount;
  const finalTotal = Math.max(0, subtotal - discount);

  const freeShippingThreshold = 999;
  const remainingForFreeShip = freeShippingThreshold - subtotal;

  return (
    <>
      <div className={`drawer-backdrop ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} />
      <aside className={`drawer-panel ${isCartOpen ? 'open' : ''}`}>
        <div className="drawer-header-tss">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 900 }}>
            MY SHOPPING BAG ({totalItems})
          </h3>
          <button
            style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setIsCartOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div
          style={{
            background: 'var(--tss-red-light)',
            padding: '12px 20px',
            fontSize: '0.82rem',
            color: 'var(--tss-red)',
            fontWeight: 800,
            borderBottom: '1px solid #fcdada'
          }}
        >
          {subtotal >= freeShippingThreshold || subtotal === 0 ? (
            <span>🎉 <b>FREE Express Shipping</b> Applied on this Order!</span>
          ) : (
            <span>📦 Add <b>{formatPrice(remainingForFreeShip)}</b> more for <b>FREE Shipping</b>!</span>
          )}
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 10px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🛍️</div>
              <h4 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>
                Your Bag is Empty
              </h4>
              <p style={{ fontSize: '0.85rem', margin: '6px 0 16px' }}>Explore our new oversized drops & anime merch!</p>
              <button
                className="btn-tss-primary"
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveCategory('oversized');
                }}
              >
                SHOP BESTSELLERS
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item-row">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 6px' }}>
                    Size: {item.size} | Color: {item.color}
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--tss-red)' }}>{formatPrice(item.price)}</div>
                </div>
                <div className="qty-control" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--tss-border)', borderRadius: 4 }}>
                  <button style={{ padding: '4px 8px', cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => updateCartQty(index, -1)}>
                    -
                  </button>
                  <span style={{ padding: '0 8px', fontWeight: 800, fontSize: '0.85rem' }}>{item.quantity}</span>
                  <button style={{ padding: '4px 8px', cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => updateCartQty(index, 1)}>
                    +
                  </button>
                </div>
                <button
                  style={{ color: 'var(--text-muted)', fontSize: '1rem', marginLeft: 8, cursor: 'pointer', background: 'none', border: 'none' }}
                  onClick={() => removeFromCart(index)}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
              <span>Bag Subtotal</span>
              <span style={{ fontWeight: 800 }}>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', color: '#1b8755' }}>
              <span>Shipping Fee</span>
              <span style={{ fontWeight: 900 }}>FREE</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                marginTop: 10,
                paddingTop: 10,
                borderTop: '1px solid var(--tss-border)'
              }}
            >
              <span>Total Payable</span>
              <span style={{ color: 'var(--tss-red)' }}>{formatPrice(finalTotal)}</span>
            </div>

            <button
              className="btn-tss-primary"
              style={{ width: '100%', marginTop: 14, padding: 15, fontSize: '0.95rem', justifyContent: 'center' }}
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            >
              CONTINUE TO CHECKOUT →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
