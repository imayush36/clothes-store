'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    isClubMember,
    formatPrice,
    addToCart,
    setIsCheckoutOpen,
    setIsFitQuizOpen,
    showToast
  } = useStore();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState(null);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const effectivePrice = isClubMember ? product.clubPrice : product.price;
  const activeImg = selectedImage || (product.images ? product.images[0] : '');
  const activeColor = selectedColor || (product.colors ? product.colors[0]?.name : '');
  const activeSize = selectedSize || (product.sizes ? product.sizes[0] : 'M');

  const checkPin = () => {
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      setPincodeMsg({ success: false, text: 'Please enter a valid 6-digit PIN code.' });
      return;
    }
    setPincodeMsg({ success: true, text: '⚡ Express Delivery available in 2–3 Days • COD Available!' });
    showToast('PIN code serviceable!', 'success');
  };

  const handleClose = () => {
    setQuickViewProduct(null);
    setSelectedImage(null);
    setSelectedColor(null);
    setSelectedSize(null);
    setPincodeMsg(null);
  };

  return (
    <div className="modal-backdrop open">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={handleClose}>
          ✕
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 28 }}>
          {/* Images Gallery */}
          <div>
            <img
              src={activeImg}
              style={{ width: '100%', aspectRatio: '1/1.2', objectFit: 'cover', borderRadius: 6, boxShadow: 'var(--shadow-md)' }}
              alt={product.name}
            />
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto' }}>
                {product.images.map((img) => (
                  <img
                    key={img}
                    src={img}
                    style={{
                      width: 65,
                      height: 75,
                      objectFit: 'cover',
                      borderRadius: 4,
                      cursor: 'pointer',
                      border: `2px solid ${activeImg === img ? 'var(--tss-red)' : 'transparent'}`
                    }}
                    alt="Gallery Thumbnail"
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ background: 'var(--tss-red)', color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '0.7rem', fontWeight: 900, padding: '3px 8px', borderRadius: 4 }}>
                {product.fitType}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#1b8755', fontWeight: 800 }}>
                {product.stockStatus || '✓ In Stock'}
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, margin: '8px 0 4px' }}>
              {product.name}
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              Fandom: <b>{product.fandomTag}</b> • ⭐ {product.rating} ({product.reviewCount || 450} verified reviews)
            </div>

            <div className="pricing-block-tss" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', fontWeight: 900, color: 'var(--tss-red)' }}>
                  {formatPrice(effectivePrice)}
                </span>
                {product.originalPrice && (
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1rem' }}>
                    MRP {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span style={{ color: '#1b8755', fontWeight: 800, fontSize: '0.85rem' }}>
                    ({Math.round(((product.originalPrice - effectivePrice) / product.originalPrice) * 100)}% OFF)
                  </span>
                )}
              </div>

              <div className="club-price-box" style={{ marginTop: 8 }}>
                <span>👑 TSS Exclusive Club Member Price:</span>
                <span className="club-price-val">{formatPrice(product.clubPrice)}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
              {product.description}
            </p>

            <div style={{ background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 4, fontSize: '0.8rem', marginBottom: 16 }}>
              🧵 <b>Fabric:</b> {product.fabric}
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: 6 }}>
                  Select Color: <span style={{ color: 'var(--tss-red)' }}>{activeColor}</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      className={`color-swatch-btn ${activeColor === c.name ? 'active' : ''}`}
                      style={{ background: c.hex, width: 28, height: 28, borderRadius: '50%', border: '2px solid #fff', cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedColor(c.name);
                        if (c.image) setSelectedImage(c.image);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>Select Size:</div>
                  <button
                    onClick={() => {
                      handleClose();
                      setIsFitQuizOpen(true);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--tss-red)', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    📐 Sizing Guide
                  </button>
                </div>
                <div className="size-pill-grid" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`size-pill-tss ${activeSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
              <button
                className="btn-tss-primary"
                style={{ padding: 14, justifyContent: 'center' }}
                onClick={() => {
                  addToCart(product, activeSize, activeColor);
                  handleClose();
                }}
              >
                + ADD TO BAG
              </button>
              <button
                className="btn-tss-primary"
                style={{ background: '#111', color: '#fff', padding: 14, justifyContent: 'center' }}
                onClick={() => {
                  addToCart(product, activeSize, activeColor, false);
                  handleClose();
                  setIsCheckoutOpen(true);
                }}
              >
                BUY NOW ⚡
              </button>
            </div>

            {/* PIN Code Checker */}
            <div style={{ marginTop: 18, borderTop: '1px solid var(--tss-border)', paddingTop: 14 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: 6 }}>📍 Check Delivery & COD Availability</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="tss-search-input"
                  style={{ maxWidth: 180, padding: '6px 12px', fontSize: '0.85rem' }}
                  placeholder="Enter 6-digit PIN"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
                <button className="btn-tss-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={checkPin}>
                  CHECK
                </button>
              </div>
              {pincodeMsg && (
                <div style={{ fontSize: '0.78rem', marginTop: 6, fontWeight: 700, color: pincodeMsg.success ? '#1b8755' : 'var(--tss-red)' }}>
                  {pincodeMsg.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
