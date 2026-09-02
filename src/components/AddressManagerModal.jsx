'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { lookupPincode } from '@/lib/pincodeData';

export default function AddressManagerModal() {
  const { isAddressModalOpen, setIsAddressModalOpen, user, savedAddresses, addAddress, removeAddress, setDefaultAddress, showToast } = useStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [pincode, setPincode] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [addressType, setAddressType] = useState('HOME');
  const [isDefault, setIsDefault] = useState(false);
  const [pinValidation, setPinValidation] = useState(null);

  if (!isAddressModalOpen) return null;

  const handlePincodeChange = (e) => {
    const val = e.target.value;
    setPincode(val);

    if (val.length === 6) {
      const result = lookupPincode(val);
      if (result.valid) {
        setCity(result.city !== 'Serviceable Area' ? result.city : '');
        setState(result.state !== 'India' ? result.state : '');
        setPinValidation({ success: true, text: result.deliveryText });
      } else {
        setPinValidation({ success: false, text: result.message });
      }
    } else {
      setPinValidation(null);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (!pincode || pincode.length !== 6) {
      showToast('Please enter a valid 6-digit PIN code.', 'info');
      return;
    }

    const newAddr = {
      id: 'addr_' + Date.now(),
      fullName,
      phone,
      pincode,
      houseNo,
      street,
      landmark,
      city: city || 'Mumbai',
      state: state || 'Maharashtra',
      addressType,
      isDefault
    };

    await addAddress(newAddr);
    setShowAddForm(false);
    resetForm();
    showToast('Delivery address saved successfully! 📍', 'success');
  };

  const resetForm = () => {
    setFullName(user?.name || '');
    setPhone(user?.phone || '');
    setPincode('');
    setHouseNo('');
    setStreet('');
    setLandmark('');
    setCity('');
    setState('');
    setAddressType('HOME');
    setIsDefault(false);
    setPinValidation(null);
  };

  const handleClose = () => {
    setIsAddressModalOpen(false);
    setShowAddForm(false);
  };

  return (
    <div className="modal-backdrop open">
      <div className="modal-content" style={{ maxWidth: 580, padding: 32 }}>
        <button className="modal-close-btn" onClick={handleClose}>
          ✕
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900 }}>
            Delivery Addresses 📍
          </h2>
          {!showAddForm && (
            <button className="btn-tss-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }} onClick={() => setShowAddForm(true)}>
              + ADD NEW ADDRESS
            </button>
          )}
        </div>

        {showAddForm ? (
          <form onSubmit={handleSaveAddress}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  className="tss-search-input"
                  placeholder="Recipient Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>10-Digit Mobile Number</label>
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
            </div>

            {/* PIN Code with live verification */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>6-Digit PIN Code</label>
              <input
                type="text"
                className="tss-search-input"
                placeholder="e.g. 400001 or 110001"
                maxLength={6}
                value={pincode}
                onChange={handlePincodeChange}
                required
              />
              {pinValidation && (
                <div style={{ fontSize: '0.75rem', marginTop: 4, fontWeight: 700, color: pinValidation.success ? '#1b8755' : 'var(--tss-red)' }}>
                  {pinValidation.text}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>Flat / House No. / Building Name</label>
              <input
                type="text"
                className="tss-search-input"
                placeholder="Flat 402, Sea Breeze Apts"
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>Street / Area / Sector</label>
              <input
                type="text"
                className="tss-search-input"
                placeholder="Linking Road, Bandra West"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>City / District</label>
                <input
                  type="text"
                  className="tss-search-input"
                  placeholder="Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>State</label>
                <input
                  type="text"
                  className="tss-search-input"
                  placeholder="Maharashtra"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Address Type & Default */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {['HOME', 'WORK', 'OTHER'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`avatar-pill-btn ${addressType === type ? 'active' : ''}`}
                    style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                    onClick={() => setAddressType(type)}
                  >
                    {type === 'HOME' ? '🏠 Home' : (type === 'WORK' ? '💼 Work' : '📍 Other')}
                  </button>
                ))}
              </div>

              <label style={{ fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} style={{ accentColor: 'var(--tss-red)' }} />
                Set as Default
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn-tss-outline" style={{ flex: 1, padding: 12 }} onClick={() => setShowAddForm(false)}>
                CANCEL
              </button>
              <button type="submit" className="btn-tss-primary" style={{ flex: 1.5, padding: 12, justifyContent: 'center' }}>
                SAVE DELIVERY ADDRESS →
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 380, overflowY: 'auto' }}>
            {savedAddresses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 8 }}>📍</div>
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 4 }}>No Saved Addresses</h4>
                <p style={{ fontSize: '0.85rem', marginBottom: 14 }}>Add your home or office address for fast 1-click checkout!</p>
                <button className="btn-tss-primary" onClick={() => setShowAddForm(true)}>+ ADD FIRST ADDRESS</button>
              </div>
            ) : (
              savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: `1.5px solid ${addr.isDefault ? 'var(--tss-red)' : 'var(--tss-border)'}`,
                    borderRadius: 8,
                    padding: 16,
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 900, fontSize: '0.92rem' }}>{addr.fullName}</span>
                      <span style={{ background: 'var(--bg-tertiary)', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>
                        {addr.addressType}
                      </span>
                      {addr.isDefault && (
                        <span style={{ background: 'var(--tss-red-light)', color: 'var(--tss-red)', fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: 4 }}>
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <button
                      style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                      onClick={() => removeAddress(addr.id)}
                      title="Delete Address"
                    >
                      ✕
                    </button>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {addr.houseNo}, {addr.street}{addr.landmark ? `, Near ${addr.landmark}` : ''}, {addr.city}, {addr.state} - <b>{addr.pincode}</b>
                  </p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    📞 Mobile: <b>{addr.phone}</b>
                  </div>

                  {!addr.isDefault && (
                    <button
                      style={{ marginTop: 8, background: 'none', border: 'none', color: 'var(--tss-red)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => setDefaultAddress(addr.id)}
                    >
                      Set as Default Address
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
