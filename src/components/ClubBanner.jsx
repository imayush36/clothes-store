'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

export default function ClubBanner() {
  const { toggleClubMembership, isClubMember } = useStore();

  return (
    <section className="tss-club-banner-section">
      <div className="container">
        <div className="club-feature-card">
          <div>
            <span style={{ background: 'var(--tss-gold)', color: '#111', fontWeight: 900, fontSize: '0.75rem', padding: '3px 10px', borderRadius: 4, textTransform: 'uppercase' }}>
              EXCLUSIVE VIP CLUB
            </span>
            <h2 className="club-title">Become a Souled Store Member</h2>
            <p style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
              Save flat ₹200 to ₹600 on every single garment, get 24-hr early access to anime & comic drops, and enjoy unconditional FREE shipping on all orders!
            </p>
            <div className="club-benefits-list">
              <div>👑 <b>Guaranteed Member Pricing</b> on 10,000+ Styles</div>
              <div>⚡ <b>FREE Express Delivery</b> on every order (No minimum order value)</div>
              <div>🎟️ <b>Priority Access</b> to Limited Edition Naruto, Jujutsu Kaisen & Marvel drops</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.08)', padding: 24, borderRadius: 'var(--radius-md)', border: '1px solid rgba(229,169,60,0.3)' }}>
            <div style={{ fontSize: '0.85rem', color: '#d1d5db' }}>Membership at just</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, color: 'var(--tss-gold)', margin: '4px 0' }}>
              ₹199 / yr
            </div>
            <button
              className="btn-tss-primary"
              style={{ width: '100%', background: 'var(--tss-gold)', color: '#111', fontWeight: 900 }}
              onClick={toggleClubMembership}
            >
              {isClubMember ? 'VIP CLUB ACTIVE ✨' : 'ACTIVATE CLUB SAVINGS →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
