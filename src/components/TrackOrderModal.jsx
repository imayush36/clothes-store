'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function TrackOrderModal() {
  const { isTrackOrderOpen, setIsTrackOrderOpen, showToast } = useStore();
  const [trackingInput, setTrackingInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isTrackOrderOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) {
      showToast('Please enter an Order or Tracking ID', 'info');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setOrderResult(null);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(trackingInput.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setOrderResult(data);
      } else {
        setErrorMsg(`No order found matching "${trackingInput}".`);
      }
    } catch (err) {
      setErrorMsg('Failed to fetch tracking data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsTrackOrderOpen(false);
    setOrderResult(null);
    setErrorMsg(null);
    setTrackingInput('');
  };

  return (
    <div className="modal-backdrop open">
      <div className="modal-content" style={{ maxWidth: 550, padding: 32 }}>
        <button className="modal-close-btn" onClick={handleClose}>
          ✕
        </button>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, marginBottom: 6 }}>
          Track Your Package 🚚
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 18 }}>
          Enter your TSS Order Tracking ID (e.g. TSS-842918).
        </p>

        <form onSubmit={handleTrack}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              className="tss-search-input"
              placeholder="e.g. TSS-842918"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              required
            />
            <button type="submit" className="btn-tss-primary" style={{ padding: '10px 20px' }} disabled={loading}>
              {loading ? '...' : 'TRACK'}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div style={{ background: 'var(--tss-red-light)', border: '1px solid var(--tss-red)', borderRadius: 'var(--radius-sm)', padding: 16, marginTop: 16, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: 'var(--tss-red)', fontSize: '0.9rem' }}>⚠️ Order Not Found</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{errorMsg}</div>
          </div>
        )}

        {orderResult && (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--tss-border)', borderRadius: 'var(--radius-sm)', padding: 18, marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--tss-border)', paddingBottom: 10 }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tracking ID:</div>
                <div style={{ fontWeight: 900, fontFamily: 'monospace', color: 'var(--tss-red)', fontSize: '1.1rem' }}>
                  {orderResult.trackingNumber}
                </div>
              </div>
              <span style={{ background: '#e8f5e9', color: '#1b8755', fontSize: '0.75rem', fontWeight: 800, padding: '4px 8px', borderRadius: 4 }}>
                {orderResult.orderStatus?.toUpperCase() || 'IN TRANSIT'} 🚚
              </span>
            </div>

            <div className="tracking-steps-timeline">
              {orderResult.timeline?.map((step) => (
                <div key={step.title} className={`track-step ${step.status}`}>
                  <span className="step-dot">{step.status === 'done' ? '✓' : (step.status === 'active' ? '⚡' : '○')}</span>
                  <div>
                    <div className="step-title">{step.title}</div>
                    <div className="step-time">{step.desc} • <small>{step.time}</small></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
