// The Souled Store (TSS) - Frontend API Service Client

const API_BASE = window.location.origin.includes('localhost:5000') || window.location.origin.includes('127.0.0.1:5000')
  ? '/api'
  : (window.location.protocol.startsWith('http') ? 'http://localhost:5000/api' : 'http://localhost:5000/api');

const API = {
  isBackendAvailable: false,

  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        this.isBackendAvailable = true;
        console.log('✅ Connected to live Node.js Express SQLite backend!');
      }
    } catch (e) {
      this.isBackendAvailable = false;
      console.log('ℹ️ Running in frontend client mode with local dataset fallback.');
    }
  },

  // Products
  async getProducts(params = {}) {
    if (!this.isBackendAvailable) {
      // Fallback to local PRODUCTS array in data.js
      return PRODUCTS;
    }

    try {
      const query = new URLSearchParams();
      if (params.gender) query.append('gender', params.gender);
      if (params.category) query.append('category', params.category);
      if (params.fandom) query.append('fandom', params.fandom);
      if (params.search) query.append('search', params.search);
      if (params.maxPrice) query.append('maxPrice', params.maxPrice);
      if (params.sort) query.append('sort', params.sort);

      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.products || PRODUCTS;
    } catch (e) {
      console.warn('API fetch products error, using fallback:', e);
      return PRODUCTS;
    }
  },

  async getProductById(id) {
    if (!this.isBackendAvailable) {
      return PRODUCTS.find(p => p.id === id) || null;
    }

    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch (e) {
      return PRODUCTS.find(p => p.id === id) || null;
    }
  },

  // Orders
  async createOrder(orderPayload) {
    if (!this.isBackendAvailable) {
      const trackingNumber = 'TSS-' + Math.floor(100000 + Math.random() * 900000);
      return {
        success: true,
        trackingNumber,
        orderDetails: {
          customerName: orderPayload.customerName,
          finalTotal: orderPayload.finalTotal
        }
      };
    }

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to place order');
    }

    return await res.json();
  },

  async trackOrder(trackingNumber) {
    if (!this.isBackendAvailable) {
      return {
        trackingNumber: trackingNumber.toUpperCase(),
        orderStatus: 'In Transit',
        timeline: [
          { title: 'Order Placed & Verified', time: 'Completed', status: 'done', desc: 'Order received at Mumbai Central Hub' },
          { title: 'Packed & Quality Inspected', time: 'Completed', status: 'done', desc: 'Passed weight & stitch verification' },
          { title: 'Dispatched via BlueDart Air', time: 'In Transit', status: 'active', desc: 'Package currently in transit' },
          { title: 'Out for Delivery', time: 'Tomorrow by 6:00 PM', status: 'pending', desc: 'Delivery by courier partner' }
        ]
      };
    }

    const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(trackingNumber)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'No order found');
    }

    return await res.json();
  },

  // Coupons
  async validateCoupon(code, subtotal) {
    if (!this.isBackendAvailable) {
      const c = code.trim().toUpperCase();
      if (c === 'TSS200') return { valid: true, code: 'TSS200', calculatedDiscount: 200, message: '🎉 Flat ₹200 OFF Applied!' };
      if (c === 'VIP20') return { valid: true, code: 'VIP20', calculatedDiscount: Math.round(subtotal * 0.20), message: '🎉 20% VIP Discount Applied!' };
      if (c === 'AURA2026') return { valid: true, code: 'AURA2026', calculatedDiscount: Math.round(subtotal * 0.15), message: '🎉 15% Streetwear Drop Discount!' };
      return { valid: false, message: 'Invalid coupon code.' };
    }

    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal })
    });

    return await res.json();
  },

  // Reviews
  async submitReview(reviewPayload) {
    if (!this.isBackendAvailable) {
      return { success: true, message: 'Review recorded locally!' };
    }

    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewPayload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit review');
    }

    return await res.json();
  }
};

window.API = API;
