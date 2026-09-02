# 👻 The Souled Store (TSS) - Full-Stack E-Commerce Platform

> A modern, full-stack D2C streetwear fashion web application inspired by **The Souled Store (TSS)**, built with **Next.js 15 (App Router)**, **React 19**, **MongoDB Atlas (Mongoose)**, and **SQLite fallback engine**.

---

## ✨ Key Features

- ⚡ **Next.js 15 App Router:** Server/Client components, responsive layout, SEO metadata.
- 🍃 **Dual Database Engine:** Live cloud connection with **MongoDB Atlas** and seamless local **SQLite** fallback.
- 👕 **Virtual Try-On & Outfit Mixer:** Interactive fitting studio with model avatars (Aarav, Kabir, Riya), layer stacking, and AI streetwear synergy scoring.
- 👑 **VIP Club Membership:** Storewide member discounts, instant savings calculations, and priority drops.
- 🔍 **Live Search Autocomplete:** Real-time garment search with thumbnail previews and category suggestions.
- 🛍️ **Cart & Wishlist Drawers:** Slide-in panels with quantity modifiers and animated free shipping milestone indicator.
- 💳 **Express Checkout:** 3-step checkout with instant UPI QR code simulator, credit/debit card, and Cash on Delivery (COD) options.
- 🚚 **Order Tracking:** Real-time package delivery tracking with milestone progress timeline (`TSS-XXXXXX`).
- 🌙 **Dark / Light Mode:** Obsidian dark theme and crisp white light theme with persistent storage.
- 🎟️ **Promo Coupons:** Promo code validation engine (`TSS200`, `VIP20`, `AURA2026`).

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, Vanilla CSS (TSS Design System)
- **Backend:** Next.js App Router API Handlers & Express.js
- **Databases:** MongoDB Atlas (Mongoose v8) + SQLite3
- **Styling:** CSS3 Variables, Glassmorphism, Micro-Animations

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/imayush36/clothes-store.git
cd clothes-store
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/souled_store?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
MIT © 2026 The Souled Store Fan Edition
