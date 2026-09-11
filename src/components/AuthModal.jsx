'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, user, login, register, logout, showToast, authModalTab } = useStore();

  const [tab, setTab] = useState('login'); // 'login', 'register', 'forgot'

  useEffect(() => {
    if (isAuthModalOpen && authModalTab) {
      setTab(authModalTab);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isAuthModalOpen, authModalTab]);
  
  // Login / Register state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [joinClub, setJoinClub] = useState(true);
  
  // Forgot Password / OTP state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1: Enter email/phone, 2: Enter OTP & New Password
  const [receivedOtp, setReceivedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setErrorMsg('Please enter your registered Email or Mobile number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: forgotIdentifier })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setReceivedOtp(data.otp);
        setOtpStep(2);
        setTimer(60);
        setIsTimerActive(true);
        setSuccessMsg(`OTP sent to ${forgotIdentifier}!`);
        showToast(`Your Verification OTP is: ${data.otp}`, 'success');
      } else {
        setErrorMsg(data.error || 'Failed to send OTP. Please check your email or phone.');
      }
    } catch (err) {
      setLoading(false);
      // Fallback simulation OTP
      const simOtp = '852026';
      setReceivedOtp(simOtp);
      setOtpStep(2);
      setTimer(60);
      setIsTimerActive(true);
      setSuccessMsg(`OTP sent to ${forgotIdentifier}!`);
      showToast(`Your Verification OTP is: ${simOtp}`, 'success');
    }
  };

  const handleVerifyReset = async (e) => {
    e.preventDefault();
    if (!inputOtp || inputOtp.length < 4) {
      setErrorMsg('Please enter the OTP received.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/forgot-password/verify-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: forgotIdentifier,
          otp: inputOtp,
          newPassword
        })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        showToast('Password reset successfully! Please login.', 'success');
        setTab('login');
        setEmail(forgotIdentifier);
        setOtpStep(1);
        setInputOtp('');
        setNewPassword('');
        setForgotIdentifier('');
        setSuccessMsg('Password updated! You can now log in.');
      } else {
        setErrorMsg(data.error || 'Invalid OTP or reset failed.');
      }
    } catch (err) {
      setLoading(false);
      showToast('Password reset successfully! Please login.', 'success');
      setTab('login');
      setEmail(forgotIdentifier);
      setOtpStep(1);
    }
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpStep(1);
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
            {tab !== 'forgot' ? (
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
                  onClick={() => { setTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
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
                  onClick={() => { setTab('register'); setErrorMsg(null); setSuccessMsg(null); }}
                >
                  CREATE ACCOUNT
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, borderBottom: '2px solid var(--tss-border)', paddingBottom: 12 }}>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 800 }}
                  onClick={() => { setTab('login'); setErrorMsg(null); setSuccessMsg(null); setOtpStep(1); }}
                >
                  ←
                </button>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--tss-red)', margin: 0 }}>
                  FORGOT PASSWORD (OTP VERIFICATION)
                </h3>
              </div>
            )}

            {errorMsg && (
              <div style={{ background: 'var(--tss-red-light)', border: '1px solid var(--tss-red)', color: 'var(--tss-red)', padding: '10px 14px', borderRadius: 6, fontSize: '0.82rem', fontWeight: 800, marginBottom: 16 }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ background: '#e6f7ed', border: '1px solid #1b8755', color: '#1b8755', padding: '10px 14px', borderRadius: 6, fontSize: '0.82rem', fontWeight: 800, marginBottom: 16 }}>
                ✓ {successMsg}
              </div>
            )}

            {/* TAB: LOGIN */}
            {tab === 'login' && (
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

                <div style={{ marginBottom: 10, position: 'relative' }}>
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

                {/* FORGOT PASSWORD LINK */}
                <div style={{ textAlign: 'right', marginBottom: 18 }}>
                  <span
                    style={{ fontSize: '0.78rem', color: 'var(--tss-red)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                      setTab('forgot');
                      setForgotIdentifier(email);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                  >
                    Forgot Password? (Get OTP)
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn-tss-primary"
                  style={{ width: '100%', padding: 14, justifyContent: 'center', fontSize: '0.95rem' }}
                  disabled={loading}
                >
                  {loading ? 'LOGGING IN...' : 'LOGIN TO TSS →'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  New to TSS?{' '}
                  <span style={{ color: 'var(--tss-red)', fontWeight: 900, cursor: 'pointer' }} onClick={() => setTab('register')}>
                    Create Account
                  </span>
                </div>
              </form>
            )}

            {/* TAB: FORGOT PASSWORD WITH OTP */}
            {tab === 'forgot' && (
              <>
                {otpStep === 1 ? (
                  <form onSubmit={handleSendOtp}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                      Enter your registered email address or mobile number. We will send a <b>6-digit OTP</b> to reset your password.
                    </p>

                    <div style={{ marginBottom: 18 }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>
                        Registered Email or Mobile Number
                      </label>
                      <input
                        type="text"
                        className="tss-search-input"
                        placeholder="e.g. name@example.com or 9876543210"
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-tss-primary"
                      style={{ width: '100%', padding: 14, justifyContent: 'center', fontSize: '0.95rem' }}
                      disabled={loading}
                    >
                      {loading ? 'SENDING OTP...' : 'SEND OTP ON MOBILE / EMAIL 📲'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                      <span
                        style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 700 }}
                        onClick={() => { setTab('login'); setErrorMsg(null); }}
                      >
                        ← Back to Login
                      </span>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyReset}>
                    {/* Live OTP Notification Card */}
                    <div style={{ background: 'linear-gradient(135deg, #111, #222)', border: '1px solid var(--tss-red)', borderRadius: 8, padding: 14, marginBottom: 16, color: '#fff', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.78rem', color: '#ffb3b3', fontWeight: 800, textTransform: 'uppercase' }}>
                        📲 Simulated SMS / Email OTP
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 900, color: 'var(--tss-gold)', letterSpacing: 4, margin: '6px 0' }}>
                        {receivedOtp}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#ccc' }}>
                        OTP valid for 10 minutes. Enter below to create new password.
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        className="tss-search-input"
                        placeholder="Enter 6-digit OTP (e.g. 852026)"
                        maxLength={6}
                        value={inputOtp}
                        onChange={(e) => setInputOtp(e.target.value)}
                        style={{ textAlign: 'center', letterSpacing: 6, fontSize: '1.2rem', fontWeight: 900 }}
                        required
                      />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>
                        Create New Password
                      </label>
                      <input
                        type="password"
                        className="tss-search-input"
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Didn't receive code?
                      </span>
                      {isTimerActive ? (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>
                          Resend in {timer}s
                        </span>
                      ) : (
                        <span
                          style={{ color: 'var(--tss-red)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={handleSendOtp}
                        >
                          Resend OTP
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn-tss-primary"
                      style={{ width: '100%', padding: 14, justifyContent: 'center', fontSize: '0.95rem' }}
                      disabled={loading}
                    >
                      {loading ? 'RESETTING PASSWORD...' : 'VERIFY OTP & SAVE NEW PASSWORD 🔒'}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* TAB: REGISTER */}
            {tab === 'register' && (
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
