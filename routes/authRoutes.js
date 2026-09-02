const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// PIN Code lookup
const PIN_DIRECTORY = {
  '400001': { city: 'Mumbai', state: 'Maharashtra', days: 2, cod: true },
  '110001': { city: 'New Delhi', state: 'Delhi', days: 2, cod: true },
  '560001': { city: 'Bengaluru', state: 'Karnataka', days: 2, cod: true },
  '500001': { city: 'Hyderabad', state: 'Telangana', days: 2, cod: true },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', days: 3, cod: true },
  '700001': { city: 'Kolkata', state: 'West Bengal', days: 3, cod: true }
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, isClubMember } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'All fields (name, email, phone, password) are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
        name: String, email: String, phone: String, password: String, isClubMember: Boolean, addresses: Array
      }));

      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const newUser = await User.create({
        name, email: normalizedEmail, phone, password, isClubMember: !!isClubMember, addresses: []
      });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to The Souled Store.',
        user: { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone, isClubMember: newUser.isClubMember, addresses: [] }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Account created (Local mode).',
      user: { id: 'local_' + Date.now(), name, email: normalizedEmail, phone, isClubMember: !!isClubMember, addresses: [] }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email/phone and password.' });
    }

    const normalized = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
        name: String, email: String, phone: String, password: String, isClubMember: Boolean, addresses: Array
      }));

      const user = await User.findOne({ $or: [{ email: normalized }, { phone: normalized }] });
      if (!user) {
        return res.status(404).json({ error: 'No account found with this email or phone.' });
      }
      if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.' });
      }

      return res.json({
        success: true,
        message: `Welcome back, ${user.name}! 👻`,
        user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isClubMember: user.isClubMember, addresses: user.addresses || [] }
      });
    }

    res.json({
      success: true,
      message: 'Logged in successfully.',
      user: { id: 'user_local', name: 'Souled Store Fan', email: normalized, phone: '9876543210', isClubMember: true, addresses: [] }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Save / Add Address
router.post('/address', async (req, res) => {
  try {
    const { email, address } = req.body;
    if (!address || !address.pincode || !address.houseNo || !address.street) {
      return res.status(400).json({ error: 'Please provide all address details including PIN code.' });
    }

    const newAddr = {
      id: 'addr_' + Date.now(),
      fullName: address.fullName || 'Customer',
      phone: address.phone || '9876543210',
      pincode: address.pincode,
      houseNo: address.houseNo,
      street: address.street,
      city: address.city || 'Mumbai',
      state: address.state || 'Maharashtra',
      addressType: address.addressType || 'HOME',
      isDefault: !!address.isDefault
    };

    if (mongoose.connection.readyState === 1 && email) {
      const User = mongoose.models.User || mongoose.model('User');
      const updated = await User.findOneAndUpdate(
        { email: email.toLowerCase().trim() },
        { $push: { addresses: newAddr } },
        { new: true }
      );
      return res.json({ success: true, message: 'Address saved to profile!', address: newAddr, addresses: updated ? updated.addresses : [newAddr] });
    }

    res.json({ success: true, message: 'Address saved locally.', address: newAddr, addresses: [newAddr] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PIN Code Check
router.get('/pincode/:pin', (req, res) => {
  const pin = req.params.pin;
  if (!pin || pin.length !== 6 || isNaN(pin)) {
    return res.status(400).json({ valid: false, message: 'Invalid 6-digit PIN code.' });
  }

  const found = PIN_DIRECTORY[pin];
  if (found) {
    return res.json({
      valid: true,
      pincode: pin,
      city: found.city,
      state: found.state,
      estimatedDays: found.days,
      deliveryText: `⚡ Express Delivery in ${found.days} Days`,
      codAvailable: found.cod
    });
  }

  res.json({
    valid: true,
    pincode: pin,
    city: 'Serviceable Area',
    state: 'India',
    estimatedDays: 3,
    deliveryText: '⚡ Express Delivery in 2–3 Days',
    codAvailable: true
  });
});

// In-memory OTP Store for Express
const otpStore = new Map();

// 1. Send OTP
router.post('/forgot-password/send-otp', async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) {
      return res.status(400).json({ error: 'Please enter registered Email or Mobile number.' });
    }

    const identifier = emailOrPhone.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const User = mongoose.models.User || mongoose.model('User');
      const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
      });

      if (!user) {
        return res.status(404).json({ error: 'No account found with this Email or Mobile number.' });
      }
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(identifier, { otp: generatedOtp, expiresAt: Date.now() + 10 * 60 * 1000 });

    res.json({
      success: true,
      message: `OTP sent successfully to ${identifier}!`,
      otp: generatedOtp,
      expiresInMinutes: 10
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 2. Verify OTP and Reset Password
router.post('/forgot-password/verify-reset', async (req, res) => {
  try {
    const { emailOrPhone, otp, newPassword } = req.body;
    if (!emailOrPhone || !otp || !newPassword) {
      return res.status(400).json({ error: 'All fields (Email/Phone, OTP, New Password) are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const identifier = emailOrPhone.toLowerCase().trim();
    const stored = otpStore.get(identifier);

    if (!stored) {
      return res.status(400).json({ error: 'No active OTP request found. Please request a new OTP.' });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(identifier);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    if (stored.otp.trim() !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid OTP. Please check and try again.' });
    }

    otpStore.delete(identifier);

    if (mongoose.connection.readyState === 1) {
      const User = mongoose.models.User || mongoose.model('User');
      await User.findOneAndUpdate(
        { $or: [{ email: identifier }, { phone: identifier }] },
        { $set: { password: newPassword } }
      );
    }

    res.json({
      success: true,
      message: 'Password reset successfully! You can now login with your new password.'
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
