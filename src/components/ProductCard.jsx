'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist, isClubMember, formatPrice, addToCart, setQuickViewProduct, toggleClubMembership } = useStore();

  const isWishlisted = wishlist.includes(product.id);
  const effectivePrice = isClubMember ? product.clubPrice : product.price;

  return (
    <article className="tss-product-card" data-id={product.id}>
      <div className="card-media-tss">
        <img
          src={product.images ? product.images[0] : (product.colors ? product.colors[0]?.image : '')}
          alt={product.name}
          className="card-img-tss"
          loading="lazy"
          onClick={() => setQuickViewProduct(product)}
        />
        <span className="card-fit-tag">{product.fitType}</span>
        <button
          className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          title="Save to Wishlist"
          onClick={() => toggleWishlist(product.id)}
        >
          ♥
        </button>
      </div>

      <div className="card-info-tss">
        <span className="card-fandom-tag">{product.fandomTag}</span>
        <h3 className="card-title-tss" onClick={() => setQuickViewProduct(product)}>
          {product.name}
        </h3>

        <div className="pricing-block-tss">
          <div className="regular-price-row">
            <span className="price-tss-main">{formatPrice(effectivePrice)}</span>
            {product.originalPrice && <span className="price-tss-mrp">{formatPrice(product.originalPrice)}</span>}
          </div>

          {!isClubMember ? (
            <div className="club-price-box" onClick={toggleClubMembership} title="Click to unlock VIP Price">
              <span>👑 TSS Club:</span>
              <span className="club-price-val">{formatPrice(product.clubPrice)}</span>
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: '#1b8755', fontWeight: 800 }}>
              ✓ VIP Club Price Applied!
            </div>
          )}
        </div>

        <div className="btn-quick-add-tss">
          <button
            className="btn-card-add"
            onClick={() => addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0]?.name || 'Default')}
          >
            + ADD TO BAG
          </button>
        </div>
      </div>
    </article>
  );
}
