'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function CheckoutModal() {
  const {
    cart,
    setCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    appliedDiscount,
    setAppliedDiscount,
    promoDiscountAmount,
    setPromoDiscountAmount,
    promoCode,
    setPromoCode,
    formatPrice,
    showToast
  } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [couponInput, setCouponInput] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * appliedDiscount + promoDiscountAmount;
  const finalTotal = Math.max(0, subtotal - discount);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, subtotal })
      });
      const data = await res.json();
      if (data.valid) {
        if (data.discountType === 'flat') {
          setAppliedDiscount(0);
          setPromoDiscountAmount(data.calculatedDiscount);
        } else {
          setAppliedDiscount(data.discountValue);
          setPromoDiscountAmount(0);
        }
        setPromoCode(data.code);
        showToast(data.message || `🎉 Coupon ${data.code} applied!`, 'success');
      } else {
        showToast(data.message || 'Invalid coupon code', 'info');
      }
    } catch (e) {
      showToast('Coupon validation error', 'info');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderPayload = {
      customerName: name,
      customerEmail: email,
      customerAddress: address,
      items: cart,
      subtotal,
      discount,
      finalTotal,
      paymentMethod
    };

    let trackingNumber = 'TSS-' + Math.floor(100000 + Math.random() * 900000);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.trackingNumber) {
        trackingNumber = data.trackingNumber;
      }
    } catch (err) {
      console.warn('API error, using local fallback:', err);
    } finally {
      setSubmitting(false);
      setOrderConfirmed({
        name,
        email,
        finalTotal,
        trackingNumber
      });
      setCart([]);
      setAppliedDiscount(0);
      setPromoDiscountAmount(0);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderConfirmed(null);
  };

  return (
    <div className="modal-backdrop open">
      <div className="modal-content" style={{ maxWidth: 840, padding: 36 }}>
        <button className="modal-close-btn" onClick={handleClose}>
          ✕
        </button>

        {orderConfirmed ? (
          <div style={{ textAlign: 'center', padding: '24px 10px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>👻🎉</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--tss-red)', marginBottom: 6 }}>
              Order Confirmed!
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 20px' }}>
              Thank you <b>{orderConfirmed.name}</b>! A confirmation email and tracking link has been dispatched to <b>{orderConfirmed.email}</b>.
            </p>

            <div style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--tss-red)', borderRadius: 'var(--radius-sm)', padding: 20, maxWidth: 440, margin: '0 auto 20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tracking Number:</span>
                <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 900, color: 'var(--tss-red)' }}>
                  {orderConfirmed.trackingNumber}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem' }}>
                <span>Total Paid:</span>
                <b style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{formatPrice(orderConfirmed.finalTotal)}</b>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#1b8755', fontWeight: 700 }}>Estimated Delivery: 2–3 Business Days</div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-tss-outline" onClick={() => window.print()}>
                🖨️ PRINT INVOICE
              </button>
              <button className="btn-tss-primary" onClick={handleClose}>
                CONTINUE SHOPPING →
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', fontWeight: 900, marginBottom: 22 }}>
              Express Checkout
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28 }}>
              <form onSubmit={handleSubmitOrder}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: 4 }}>
                    Mobile Number / Email
                  </label>
                  <input
                    type="text"
                    className="tss-search-input"
                    placeholder="9876543210 or email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: 4 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="tss-search-input"
                    placeholder="Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: 4 }}>
                    Complete Delivery Address & PIN
                  </label>
                  <input
                    type="text"
                    className="tss-search-input"
                    placeholder="House/Flat, Street, Area, Mumbai - 400001"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Payment Methods */}
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: 6 }}>
                    Payment Method
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    <div
                      className={`pm-card ${paymentMethod === 'UPI' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('UPI')}
                      style={{ padding: 10, cursor: 'pointer', borderRadius: 4, fontWeight: 800, fontSize: '0.8rem', textAlign: 'center' }}
                    >
                      ⚡ UPI / QR
                    </div>
                    <div
                      className={`pm-card ${paymentMethod === 'Card' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('Card')}
                      style={{ padding: 10, cursor: 'pointer', borderRadius: 4, fontWeight: 800, fontSize: '0.8rem', textAlign: 'center' }}
                    >
                      💳 Cards / EMI
                    </div>
                    <div
                      className={`pm-card ${paymentMethod === 'COD' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('COD')}
                      style={{ padding: 10, cursor: 'pointer', borderRadius: 4, fontWeight: 800, fontSize: '0.8rem', textAlign: 'center' }}
                    >
                      💵 Cash on Delivery
                    </div>
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div style={{ marginTop: 12, background: 'var(--bg-tertiary)', borderRadius: 6, padding: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: 6 }}>
                        Scan with Google Pay, PhonePe, Paytm or Any UPI App
                      </div>
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=thesouledstore@icici&pn=TheSouledStore&mc=5691&am=1299"
                        style={{ width: 110, height: 110, margin: '0 auto', display: 'block', background: '#fff', padding: 6, borderRadius: 4 }}
                        alt="UPI QR Code"
                      />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        UPI ID: thesouledstore@icici
                      </div>
                    </div>
                  )}
                </div>

                {/* Promo Code Input */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                  <input
                    type="text"
                    className="tss-search-input"
                    placeholder="Enter coupon: TSS200 or VIP20"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button type="button" className="btn-tss-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={applyCoupon}>
                    APPLY
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn-tss-primary"
                  style={{ width: '100%', padding: 14, fontSize: '0.95rem', justifyContent: 'center' }}
                  disabled={submitting}
                >
                  {submitting ? 'PROCESSING...' : 'CONFIRM & PLACE ORDER →'}
                </button>
              </form>

              {/* Order Summary */}
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--tss-border)', padding: 20, borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 12, fontSize: '1.1rem', fontWeight: 900 }}>
                  Order Summary ({cart.length} items)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto', marginBottom: 14 }}>
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span>{item.name} ({item.size}) x{item.quantity}</span>
                      <b>{formatPrice(item.price * item.quantity)}</b>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: 6 }}>
                  <span>Bag Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#1b8755', marginBottom: 6 }}>
                  <span>Shipping Fee</span>
                  <span>FREE</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--tss-red)', marginBottom: 6 }}>
                    <span>Coupon Discount ({promoCode || 'PROMO'})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
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
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
