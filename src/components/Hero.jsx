'use client';

import React from 'react';

export default function Hero() {
  return (
    <section className="tss-hero-section" id="hero">
      <div className="container">
        <div className="hero-slider-card">
          <div>
            <span className="hero-tag-tss">⚡ LATEST 2026 STREETWEAR DROP</span>
            <h1 className="hero-title-tss">
              HEAVYWEIGHT <br />
              <span className="red-accent">OVERSIZED</span> COUTURE
            </h1>
            <p className="hero-sub-tss">
              Ultra-dense 240–420 GSM French Terry cotton, authentic pop-culture anime graphics, and dropped-shoulder silhouettes.
            </p>
            <div className="hero-btn-group">
              <a href="#catalog-section" className="btn-tss-primary">SHOP THE DROP →</a>
              <a href="#tryon-studio" className="btn-tss-outline">✨ VIRTUAL TRY-ON STUDIO</a>
            </div>
          </div>

          <div className="hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
              alt="TSS Heavyweight Streetwear"
              className="hero-hero-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
