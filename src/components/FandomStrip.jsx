'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { FANDOMS } from '@/lib/seedData';

export default function FandomStrip() {
  const { activeFandom, setActiveFandom } = useStore();

  return (
    <section className="fandom-strip-section">
      <div className="container">
        <div className="section-headline-tss">
          <h3>SHOP BY OFFICIAL FANDOMS & MERCH</h3>
        </div>
        <div className="fandom-pills-flex" id="fandom-strip-container">
          <button
            className={`fandom-pill-btn ${activeFandom === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFandom('all')}
          >
            🔥 All Official Drops
          </button>
          {FANDOMS.map((f) => (
            <button
              key={f.id}
              className={`fandom-pill-btn ${activeFandom === f.id ? 'active' : ''}`}
              onClick={() => setActiveFandom(f.id)}
            >
              <span style={{ color: f.color }}>●</span> {f.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
