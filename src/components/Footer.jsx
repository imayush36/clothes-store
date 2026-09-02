'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

export default function Footer() {
  const { setIsTrackOrderOpen, toggleClubMembership, showToast } = useStore();

  return (
    <footer className="site-footer-tss">
      <div className="container">
        <div className="footer-grid-tss">
          <div>
            <div className="tss-logo-link" style={{ marginBottom: 16 }}>
              <div className="tss-logo-ghost">👻</div>
              <span className="tss-logo-main" style={{ color: '#fff' }}>
                The Souled Store
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 340, color: '#a2a8b6' }}>
              India's largest online brand for official pop-culture merchandise, heavyweight oversized streetwear, cargos, winterwear, and sneakers.
            </p>
            <div style={{ marginTop: 16, color: '#fff', fontWeight: 800, fontSize: '0.88rem' }}>
              📍 Crafted with passion in Mumbai, India.
            </div>
          </div>

          <div className="footer-col-tss">
            <h4>NEED HELP?</h4>
            <ul>
              <li>
                <a href="javascript:void(0)" onClick={() => setIsTrackOrderOpen(true)}>
                  Track Your Order 🚚
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" onClick={() => showToast('7-day hassle free returns!')}>
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" onClick={() => showToast('Customer Care: connect@thesouledstore.com')}>
                  FAQs & Customer Support
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" onClick={toggleClubMembership}>
                  Exclusive VIP Club
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col-tss">
            <h4>COMPANY</h4>
            <ul>
              <li>
                <a href="javascript:void(0)" onClick={() => showToast('The Souled Store - Official Pop Culture Merchandise')}>
                  About The Souled Store
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" onClick={() => showToast('50+ Retail stores across Mumbai, Bengaluru, Delhi & Pune!')}>
                  Retail Store Locations
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">Careers & Culture</a>
              </li>
              <li>
                <a href="javascript:void(0)">Official Collabs & Drops</a>
              </li>
            </ul>
          </div>

          <div className="footer-col-tss">
            <h4>100% GENUINE</h4>
            <ul>
              <li>
                <a href="javascript:void(0)">Official Marvel Licensee</a>
              </li>
              <li>
                <a href="javascript:void(0)">Official Warner Bros. / DC</a>
              </li>
              <li>
                <a href="javascript:void(0)">Official Anime / Naruto</a>
              </li>
              <li>
                <a href="javascript:void(0)">100% Encrypted Payments</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-tss">
          <div>© 2026 The Souled Store Retails Pvt. Ltd. All Rights Reserved.</div>
          <div>🔒 100% Secure Checkout | COD Available | Instant UPI & Cards</div>
        </div>
      </div>
    </footer>
  );
}
