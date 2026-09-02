'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, user, login, register, logout, showToast } = useStore();

  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [joinClub, setJoinClub] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setIsAuthModalOpen(false);
      setEmail('');
      setPassword('');
    } else {
      setErrorMsg(result.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const result = await register({ name, email, phone, password, isClubMember: joinClub });
    setLoading(false);

    if (result.success) {
      setIsAuthModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
    } else {
      setErrorMsg(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMsg(null);
  };

  return (
    <div className="modal-backdrop open">
      <div className="modal-content" style={{ maxWidth: 480, padding: 32 }}>
        <button className="modal-close-btn" onClick={handleClose}>
          ✕
        </button>

        {user ? (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div className="tss-logo-ghost" style={{ width: 64, height: 64, margin: '0 auto 12px', fontSize: '1.8rem' }}>
              👻
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, marginBottom: 4 }}>
              Hi, {user.name}!
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              {user.email} • {user.phone}
            </div>

            {user.isClubMember ? (
              <div style={{ background: 'linear-gradient(135deg, #2b2b2b, #111)', border: '1px solid var(--tss-gold)', color: 'var(--tss-gold)', padding: '10px 14px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800, marginBottom: 20 }}>
                👑 VIP CLUB MEMBER ACTIVE
              </div>
            ) : (
              <div style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 8, fontSize: '0.82rem', marginBottom: 20 }}>
                Regular Member
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn-tss-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  handleClose();
                  showToast('You are already logged in!', 'info');
                }}
              >
                CONTINUE SHOPPING →
              </button>
              <button
                className="btn-tss-outline"
                style={{ width: '100%', justifyContent: 'center', color: 'var(--tss-red)', borderColor: 'var(--tss-red)' }}
                onClick={() => {
                  logout();
                  handleClose();
                }}
              >
                LOGOUT
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header Tabs */}
            <div style={{ display: 'flex', borderBottom: '2px solid var(--tss-border)', marginBottom: 22 }}>
              <button
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 900,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: tab === 'login' ? 'var(--tss-red)' : 'var(--text-secondary)',
                  borderBottom: tab === 'login' ? '3px solid var(--tss-red)' : '3px solid transparent',
                  marginBottom: -2
                }}
                onClick={() => { setTab('login'); setErrorMsg(null); }}
              >
                LOGIN
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 900,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: tab === 'register' ? 'var(--tss-red)' : 'var(--text-secondary)',
                  borderBottom: tab === 'register' ? '3px solid var(--tss-red)' : '3px solid transparent',
                  marginBottom: -2
                }}
                onClick={() => { setTab('register'); setErrorMsg(null); }}
              >
                CREATE ACCOUNT
              </button>
            </div>

            {errorMsg && (
              <div style={{ background: 'var(--tss-red-light)', border: '1px solid var(--tss-red)', color: 'var(--tss-red)', padding: '10px 14px', borderRadius: 6, fontSize: '0.82rem', fontWeight: 800, marginBottom: 16 }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>
                    Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    className="tss-search-input"
                    placeholder="name@example.com or 9876543210"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: 18, position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Password</label>
                    <span
                      style={{ fontSize: '0.75rem', color: 'var(--tss-red)', fontWeight: 800, cursor: 'pointer' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </span>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="tss-search-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-tss-primary"
                  style={{ width: '100%', padding: 14, justifyContent: 'center', fontSize: '0.95rem' }}
                  disabled={loading}
                >
                  {loading ? 'LOGGING IN...' : 'LOGIN TO THE SOULED STORE →'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Don't have an account?{' '}
                  <span style={{ color: 'var(--tss-red)', fontWeight: 900, cursor: 'pointer' }} onClick={() => setTab('register')}>
                    Register Now
                  </span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="tss-search-input"
                    placeholder="Ayush Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="tss-search-input"
                    placeholder="ayush@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>
                    Mobile Number (10 digits)
                  </label>
                  <input
                    type="tel"
                    className="tss-search-input"
                    placeholder="9876543210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Create Password</label>
                    <span
                      style={{ fontSize: '0.75rem', color: 'var(--tss-red)', fontWeight: 800, cursor: 'pointer' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </span>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="tss-search-input"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, background: 'var(--bg-tertiary)', padding: 10, borderRadius: 6 }}>
                  <input
                    type="checkbox"
                    id="join-vip-checkbox"
                    checked={joinClub}
                    onChange={(e) => setJoinClub(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: 'var(--tss-gold)' }}
                  />
                  <label htmlFor="join-vip-checkbox" style={{ fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>
                    👑 Activate TSS VIP Membership for exclusive member discounts!
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-tss-primary"
                  style={{ width: '100%', padding: 14, justifyContent: 'center', fontSize: '0.95rem' }}
                  disabled={loading}
                >
                  {loading ? 'CREATING ACCOUNT...' : 'CREATE MY ACCOUNT →'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
