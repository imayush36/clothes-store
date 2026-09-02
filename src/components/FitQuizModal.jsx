'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function FitQuizModal() {
  const { isFitQuizOpen, setIsFitQuizOpen, showToast } = useStore();

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [pref, setPref] = useState('oversized');
  const [recommendation, setRecommendation] = useState(null);

  if (!isFitQuizOpen) return null;

  const handleCalculate = (e) => {
    e.preventDefault();

    let recSize = 'Size L (Signature Oversized Drop-Shoulder)';
    if (pref === 'slim') recSize = 'Size M (Athletic Slim Cut)';
    if (pref === 'regular') recSize = 'Size L (Classic Regular Fit)';

    setRecommendation(recSize);
    showToast(`✨ Recommended TSS fit: ${recSize}`, 'success');
  };

  const handleClose = () => {
    setIsFitQuizOpen(false);
    setRecommendation(null);
  };

  return (
    <div className="modal-backdrop open">
      <div className="modal-content" style={{ maxWidth: 520, padding: 32 }}>
        <button className="modal-close-btn" onClick={handleClose}>
          ✕
        </button>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, marginBottom: 6 }}>
          TSS Fit & Sizing Advisor
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 18 }}>
          Calculate your ideal oversized drop-shoulder vs regular fit.
        </p>

        <form onSubmit={handleCalculate}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: 4 }}>
              Height (cm or ft)
            </label>
            <input
              type="text"
              className="tss-search-input"
              placeholder="e.g. 178 cm or 5'10"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: 4 }}>
              Weight (kg)
            </label>
            <input
              type="text"
              className="tss-search-input"
              placeholder="e.g. 72 kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: 4 }}>
              Fit Preference
            </label>
            <select className="tss-search-input" value={pref} onChange={(e) => setPref(e.target.value)}>
              <option value="oversized">Oversized Drop-Shoulder (Signature TSS Look)</option>
              <option value="regular">Regular Classic Tailored Fit</option>
              <option value="slim">Slim Athletic Fit</option>
            </select>
          </div>

          <button type="submit" className="btn-tss-primary" style={{ width: '100%', justifyContent: 'center' }}>
            CALCULATE PERFECT SIZE →
          </button>
        </form>

        {recommendation && (
          <div style={{ marginTop: 18, background: 'var(--tss-red-light)', border: '1px solid var(--tss-red)', borderRadius: 'var(--radius-sm)', padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700 }}>RECOMMENDED TSS SIZE:</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--tss-red)', margin: '4px 0' }}>
              {recommendation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
