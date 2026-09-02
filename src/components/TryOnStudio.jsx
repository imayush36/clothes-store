'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS } from '@/lib/seedData';

const AVATARS = {
  'male-street': {
    name: 'Aarav (Streetwear Fit • 6\'0")',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80'
  },
  'male-athletic': {
    name: 'Kabir (Athletic Cut • 5\'10")',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80'
  },
  'female-street': {
    name: 'Riya (Oversized Slouch • 5\'6")',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'
  }
};

export default function TryOnStudio() {
  const { isClubMember, formatPrice, addToCart, setIsCartOpen, showToast } = useStore();

  const [activeAvatar, setActiveAvatar] = useState('male-street');
  const [layers, setLayers] = useState({
    top: PRODUCTS.find((p) => p.id === 'prod-01') || PRODUCTS[0],
    outerwear: PRODUCTS.find((p) => p.id === 'prod-05') || PRODUCTS[4],
    bottom: PRODUCTS.find((p) => p.id === 'prod-07') || PRODUCTS[6],
    shoes: PRODUCTS.find((p) => p.id === 'prod-12') || PRODUCTS[11]
  });

  const slots = [
    { id: 'top', label: '1. Topwear / Tees', icon: '👕', items: PRODUCTS.filter((p) => p.tryonType === 'top') },
    { id: 'outerwear', label: '2. Hoodies & Jackets', icon: '🧥', items: PRODUCTS.filter((p) => p.tryonType === 'outerwear') },
    { id: 'bottom', label: '3. Bottoms & Cargos', icon: '👖', items: PRODUCTS.filter((p) => p.tryonType === 'bottom') },
    { id: 'shoes', label: '4. Sneakers & Kicks', icon: '👟', items: PRODUCTS.filter((p) => p.tryonType === 'shoes') }
  ];

  const totalBundlePrice = Object.values(layers).reduce((sum, item) => {
    if (!item) return sum;
    return sum + (isClubMember ? item.clubPrice : item.price);
  }, 0);

  const totalOriginalPrice = Object.values(layers).reduce((sum, item) => {
    if (!item) return sum;
    return sum + (item.originalPrice || item.price);
  }, 0);

  const savings = totalOriginalPrice - totalBundlePrice;

  const selectItem = (slotId, product) => {
    setLayers((prev) => ({ ...prev, [slotId]: product }));
    showToast(`Selected: ${product.name}`);
  };

  const removeLayer = (slotId) => {
    setLayers((prev) => ({ ...prev, [slotId]: null }));
    showToast(`Removed ${slotId} layer from outfit`);
  };

  const addEntireLookToBag = () => {
    let count = 0;
    Object.values(layers).forEach((item) => {
      if (item) {
        addToCart(item, item.sizes?.[0] || 'M', item.colors?.[0]?.name || 'Default', false);
        count++;
      }
    });

    if (count === 0) {
      showToast('Please choose at least one garment for your look!');
      return;
    }

    setIsCartOpen(true);
    showToast(`🎉 Added full ${count}-piece look to your bag!`, 'success');
  };

  const randomizeLook = () => {
    const tops = PRODUCTS.filter((p) => p.tryonType === 'top');
    const outer = PRODUCTS.filter((p) => p.tryonType === 'outerwear');
    const bottoms = PRODUCTS.filter((p) => p.tryonType === 'bottom');
    const shoes = PRODUCTS.filter((p) => p.tryonType === 'shoes');

    setLayers({
      top: tops[Math.floor(Math.random() * tops.length)],
      outerwear: outer[Math.floor(Math.random() * outer.length)],
      bottom: bottoms[Math.floor(Math.random() * bottoms.length)],
      shoes: shoes[Math.floor(Math.random() * shoes.length)]
    });

    showToast('🎲 AI generated a fresh curated streetwear look!', 'info');
  };

  // Main visual
  const canvasImage = layers.outerwear?.images?.[0] || layers.top?.images?.[0] || AVATARS[activeAvatar].image;

  return (
    <section className="tryon-section" id="tryon-studio">
      <div className="container">
        <div className="section-headline-tss">
          <span style={{ color: 'var(--tss-red)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em' }}>
            TSS INTERACTIVE STYLIST
          </span>
          <h2>VIRTUAL FITTING & OUTFIT MIXER</h2>
        </div>

        {/* Avatar Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>CHOOSE AVATAR:</span>
          {Object.keys(AVATARS).map((key) => (
            <button
              key={key}
              className={`avatar-pill-btn ${activeAvatar === key ? 'active' : ''}`}
              onClick={() => {
                setActiveAvatar(key);
                showToast(`Switched model to ${AVATARS[key].name}`);
              }}
            >
              {AVATARS[key].name}
            </button>
          ))}
        </div>

        <div className="tryon-studio-card">
          {/* Left Canvas Preview */}
          <div className="tryon-avatar-box">
            <div className="tryon-canvas-wrapper">
              <img src={canvasImage} alt="TSS TryOn Model" className="tryon-model-bg" />

              <div className="tryon-overlay-layer">
                {layers.outerwear && <span className="layer-badge">🧥 {layers.outerwear.name}</span>}
                {layers.top && <span className="layer-badge">👕 {layers.top.name}</span>}
                {layers.bottom && <span className="layer-badge">👖 {layers.bottom.name}</span>}
              </div>
            </div>

            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 800 }}>TOTAL OUTFIT BUNDLE</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', fontWeight: 900, color: 'var(--tss-red)' }}>
                {formatPrice(totalBundlePrice)}
              </div>
              {savings > 0 && (
                <div style={{ fontSize: '0.8rem', color: '#1b8755', fontWeight: 800, marginTop: 2 }}>
                  You Save {formatPrice(savings)} ({Math.round((savings / totalOriginalPrice) * 100)}% OFF)
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 14 }}>
              <button className="btn-tss-primary" style={{ flexGrow: 1, padding: 12 }} onClick={addEntireLookToBag}>
                🛍️ ADD ENTIRE LOOK TO BAG
              </button>
              <button className="btn-card-add" onClick={randomizeLook} title="Shuffle Look">
                🎲 SHUFFLE
              </button>
            </div>
          </div>

          {/* Right Slot Controls */}
          <div className="tryon-controls">
            <div
              style={{
                background: 'var(--tss-red-light)',
                border: '1px dashed var(--tss-red)',
                borderRadius: 'var(--radius-sm)',
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              <div style={{ fontSize: '1.6rem' }}>🔥</div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--tss-red)' }}>
                  TSS Streetwear Synergy Score: 98/100
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  AI Synergy: Perfectly balanced drop-shoulder silhouette with heavy-density terry draping and tactical cargo contrast.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {slots.map((slot) => (
                <div key={slot.id} className="tryon-slot-group">
                  <div className="slot-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{slot.icon}</span>
                      <span style={{ fontWeight: 800 }}>{slot.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="slot-selected-name">{layers[slot.id]?.name || 'None'}</span>
                      {layers[slot.id] && (
                        <button className="slot-clear-btn" onClick={() => removeLayer(slot.id)} title="Remove Layer">
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="slot-items-grid">
                    {slot.items.map((item) => (
                      <div
                        key={item.id}
                        className={`slot-item-card ${layers[slot.id]?.id === item.id ? 'selected' : ''}`}
                        onClick={() => selectItem(slot.id, item)}
                      >
                        <img src={item.images[0]} className="slot-thumb" alt={item.name} loading="lazy" />
                        <div className="slot-name">{item.name}</div>
                        <div className="slot-price">{formatPrice(isClubMember ? item.clubPrice : item.price)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
