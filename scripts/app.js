// THE SOULED STORE (TSS) - Comprehensive Storefront Application Engine (2026 Edition)

const App = {
  currentGender: 'men',
  currency: 'INR',
  cart: [],
  wishlist: [],
  activeCategory: 'all',
  activeFandom: 'all',
  searchQuery: '',
  maxPrice: 5000,
  sortBy: 'featured',
  appliedDiscount: 0,
  promoDiscountAmount: 0,
  promoCode: '',
  isClubMember: false,
  activeTheme: 'light',

  async init() {
    this.loadState();
    this.applyTheme(this.activeTheme);
    
    // Check backend API connection
    if (window.API) {
      await API.checkHealth();
    }

    this.renderFandoms();
    this.renderCategoryTiles();
    await this.renderCatalog();
    this.bindEvents();
    this.updateCartUI();
    this.updateWishlistUI();
    this.setupSearchAutocomplete();

    // Initialize Try-On Studio
    if (window.TryOnStudio) {
      TryOnStudio.init();
    }
  },

  user: null,
  savedAddresses: [],

  // State Persistence
  loadState() {
    try {
      const savedCart = localStorage.getItem('tss_cart');
      if (savedCart) this.cart = JSON.parse(savedCart);

      const savedWishlist = localStorage.getItem('tss_wishlist');
      if (savedWishlist) this.wishlist = JSON.parse(savedWishlist);

      const savedClub = localStorage.getItem('tss_club_member');
      if (savedClub === 'true') {
        this.isClubMember = true;
        this.updateClubBadgeUI();
      }

      const savedTheme = localStorage.getItem('tss_theme');
      if (savedTheme) {
        this.activeTheme = savedTheme;
      }

      const savedUser = localStorage.getItem('tss_user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
        this.updateUserAuthUI();
      }

      const savedAddr = localStorage.getItem('tss_addresses');
      if (savedAddr) {
        this.savedAddresses = JSON.parse(savedAddr);
      } else {
        this.savedAddresses = [
          {
            id: 'addr_default',
            fullName: 'Ayush Sharma',
            phone: '9876543210',
            pincode: '400050',
            houseNo: 'Flat 402, Sea Breeze Apts',
            street: 'Linking Road, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            addressType: 'HOME',
            isDefault: true
          }
        ];
      }
    } catch (e) {
      console.warn('Storage fallback', e);
    }
  },

  saveState() {
    try {
      localStorage.setItem('tss_cart', JSON.stringify(this.cart));
      localStorage.setItem('tss_wishlist', JSON.stringify(this.wishlist));
      localStorage.setItem('tss_club_member', this.isClubMember ? 'true' : 'false');
      localStorage.setItem('tss_theme', this.activeTheme);
      if (this.user) localStorage.setItem('tss_user', JSON.stringify(this.user));
      else localStorage.removeItem('tss_user');
      localStorage.setItem('tss_addresses', JSON.stringify(this.savedAddresses));
    } catch (e) {}
  },

  // Theme Management
  toggleTheme() {
    this.activeTheme = this.activeTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.activeTheme);
    this.saveState();
    this.showToast(`Switched to ${this.activeTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`, 'info');
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
    }
  },

  // Currency Formatter
  formatPrice(inrPrice) {
    const config = CURRENCIES[this.currency] || CURRENCIES.INR;
    const converted = inrPrice * config.rate;
    if (this.currency === 'INR') {
      return `${config.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${config.symbol}${converted.toFixed(2)}`;
  },

  setCurrency(curr) {
    if (CURRENCIES[curr]) {
      this.currency = curr;
      this.renderCatalog();
      this.updateCartUI();
      if (window.TryOnStudio) TryOnStudio.updateStudioCanvas();
      this.showToast(`Currency changed to ${curr}`, 'info');
    }
  },

  // Gender Tab Switcher
  switchGender(gender) {
    this.currentGender = gender;
    document.querySelectorAll('.gender-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gender === gender);
    });

    if (gender === 'footwear') {
      this.activeCategory = 'footwear';
    } else {
      this.activeCategory = 'all';
    }

    this.renderCatalog();
    this.showToast(`Showing ${gender.toUpperCase()} Collection`, 'info');
  },

  // VIP Club Membership Toggle
  toggleClubMembership() {
    this.isClubMember = !this.isClubMember;
    this.saveState();
    this.updateClubBadgeUI();
    this.renderCatalog();
    this.updateCartUI();
    if (window.TryOnStudio) TryOnStudio.updateStudioCanvas();

    if (this.isClubMember) {
      this.showToast('👑 Welcome to TSS Exclusive VIP Club! Member prices unlocked across entire store!', 'success');
    } else {
      this.showToast('TSS Club Membership deactivated', 'info');
    }
  },

  updateClubBadgeUI() {
    const badge = document.getElementById('club-membership-status');
    if (badge) {
      badge.textContent = this.isClubMember ? 'VIP CLUB ACTIVE ✨' : 'JOIN CLUB';
    }
  },

  // Fandom Strip
  renderFandoms() {
    const container = document.getElementById('fandom-strip-container');
    if (!container) return;

    container.innerHTML = `
      <button class="fandom-pill-btn ${this.activeFandom === 'all' ? 'active' : ''}" onclick="App.filterByFandom('all')">
        🔥 All Official Drops
      </button>
      ${FANDOMS.map(f => `
        <button class="fandom-pill-btn ${this.activeFandom === f.id ? 'active' : ''}" onclick="App.filterByFandom('${f.id}')">
          <span style="color:${f.color}">●</span> ${f.name}
        </button>
      `).join('')}
    `;
  },

  filterByFandom(fandomId) {
    this.activeFandom = fandomId;
    this.renderFandoms();
    this.renderCatalog();
  },

  // Categories Tiles
  renderCategoryTiles() {
    const container = document.getElementById('category-tiles-container');
    if (!container) return;

    container.innerHTML = CATEGORIES.slice(1).map(cat => `
      <div class="cat-tile-card" onclick="App.filterByCategory('${cat.id}')">
        <img src="${cat.image}" class="cat-tile-img" alt="${cat.name}" loading="lazy"/>
        <div class="cat-tile-name">${cat.name}</div>
      </div>
    `).join('');
  },

  filterByCategory(catId) {
    this.activeCategory = catId;
    document.querySelectorAll('.quick-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.cat === catId);
    });
    this.renderCatalog();
    const catalogSec = document.getElementById('catalog-section');
    if (catalogSec) catalogSec.scrollIntoView({ behavior: 'smooth' });
  },

  // Product Catalog
  renderCatalog() {
    const grid = document.getElementById('products-grid');
    const countDisplay = document.getElementById('results-count');
    if (!grid) return;

    let filtered = PRODUCTS.filter(prod => {
      // Gender filter
      if (this.currentGender === 'women' && prod.gender !== 'women') return false;
      if (this.currentGender === 'men' && prod.gender === 'women') return false;
      if (this.currentGender === 'footwear' && prod.category !== 'footwear') return false;

      // Category filter
      if (this.activeCategory !== 'all' && prod.category !== this.activeCategory) return false;

      // Fandom filter
      if (this.activeFandom !== 'all' && prod.fandom !== this.activeFandom) return false;

      // Search Query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesCat = prod.category.toLowerCase().includes(q);
        const matchesFandom = prod.fandom.toLowerCase().includes(q);
        const matchesTag = prod.fandomTag.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesFandom && !matchesTag) return false;
      }

      // Max price
      if (prod.price > this.maxPrice) return false;

      return true;
    });

    if (this.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    if (countDisplay) {
      countDisplay.innerHTML = `${this.currentGender.toUpperCase()}'S APPAREL (${filtered.length} ITEMS)`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background:var(--bg-secondary); border-radius:8px; border:1px solid var(--tss-border);">
          <div style="font-size:3rem; margin-bottom:10px;">🔍</div>
          <h3 style="font-size: 1.2rem; font-family:var(--font-heading); margin-bottom: 8px;">No garments match your filters</h3>
          <p style="color: var(--text-secondary); margin-bottom: 16px;">Try adjusting your search term, size, or price slider.</p>
          <button class="btn-tss-primary" onclick="App.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(prod => {
      const isWishlisted = this.wishlist.includes(prod.id);
      const effectivePrice = this.isClubMember ? prod.clubPrice : prod.price;

      return `
        <article class="tss-product-card" data-id="${prod.id}">
          <div class="card-media-tss">
            <img src="${prod.images[0]}" alt="${prod.name}" class="card-img-tss" loading="lazy" onclick="App.openQuickView('${prod.id}')"/>
            <span class="card-fit-tag">${prod.fitType}</span>
            <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" title="Save to Wishlist" onclick="App.toggleWishlist('${prod.id}')">
              ♥
            </button>
          </div>

          <div class="card-info-tss">
            <span class="card-fandom-tag">${prod.fandomTag}</span>
            <h3 class="card-title-tss" onclick="App.openQuickView('${prod.id}')">${prod.name}</h3>
            
            <div class="pricing-block-tss">
              <div class="regular-price-row">
                <span class="price-tss-main">${this.formatPrice(effectivePrice)}</span>
                ${prod.originalPrice ? `<span class="price-tss-mrp">${this.formatPrice(prod.originalPrice)}</span>` : ''}
              </div>

              ${!this.isClubMember ? `
                <div class="club-price-box" onclick="App.toggleClubMembership()" title="Click to unlock Club Price">
                  <span>👑 TSS Club:</span>
                  <span class="club-price-val">${this.formatPrice(prod.clubPrice)}</span>
                </div>
              ` : `
                <div style="font-size:0.75rem; color:#1b8755; font-weight:800;">
                  ✓ VIP Club Price Applied!
                </div>
              `}
            </div>

            <div class="btn-quick-add-tss">
              <button class="btn-card-add" onclick="App.quickAddToCart('${prod.id}')">
                + ADD TO BAG
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  // Live Autocomplete Search Dropdown
  setupSearchAutocomplete() {
    const searchInput = document.getElementById('header-search');
    const autoDropdown = document.getElementById('search-autocomplete-dropdown');
    if (!searchInput || !autoDropdown) return;

    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      this.searchQuery = val;
      this.renderCatalog();

      if (val.length < 2) {
        autoDropdown.style.display = 'none';
        return;
      }

      const matches = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(val.toLowerCase()) || 
        p.category.toLowerCase().includes(val.toLowerCase()) ||
        p.fandom.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);

      if (matches.length > 0) {
        autoDropdown.innerHTML = `
          <div style="padding:8px 12px; font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">
            Top Suggestions (${matches.length})
          </div>
          ${matches.map(m => `
            <div class="autocomplete-item" onclick="App.openQuickView('${m.id}'); document.getElementById('search-autocomplete-dropdown').style.display='none';">
              <img src="${m.images[0]}" style="width:36px; height:42px; object-fit:cover; border-radius:4px;"/>
              <div style="flex-grow:1;">
                <div style="font-size:0.85rem; font-weight:800; color:var(--text-primary);">${m.name}</div>
                <div style="font-size:0.75rem; color:var(--tss-red); font-weight:700;">${this.formatPrice(this.isClubMember ? m.clubPrice : m.price)}</div>
              </div>
              <span style="font-size:0.72rem; background:var(--bg-tertiary); padding:2px 6px; border-radius:4px;">${m.category}</span>
            </div>
          `).join('')}
        `;
        autoDropdown.style.display = 'block';
      } else {
        autoDropdown.style.display = 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !autoDropdown.contains(e.target)) {
        autoDropdown.style.display = 'none';
      }
    });
  },

  // Filter Popup Handlers
  toggleFilterPopup() {
    const overlay = document.getElementById('filter-popup-overlay');
    const card = document.getElementById('filter-popup-card');
    if (!card) return;
    const isOpen = card.classList.contains('open');
    if (isOpen) {
      this.closeFilterPopup();
    } else {
      overlay?.classList.add('open');
      card?.classList.add('open');
    }
  },

  closeFilterPopup() {
    document.getElementById('filter-popup-overlay')?.classList.remove('open');
    document.getElementById('filter-popup-card')?.classList.remove('open');
  },

  resetFilters() {
    this.activeCategory = 'all';
    this.activeFandom = 'all';
    this.searchQuery = '';
    this.maxPrice = 5000;
    this.sortBy = 'featured';

    const priceSlider = document.getElementById('price-range-input');
    if (priceSlider) priceSlider.value = 5000;
    const priceDisplay = document.getElementById('max-price-val');
    if (priceDisplay) priceDisplay.textContent = this.formatPrice(5000);
    const searchInput = document.getElementById('header-search');
    if (searchInput) searchInput.value = '';

    document.querySelectorAll('.size-pill-tss').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.quick-chip').forEach((c, i) => c.classList.toggle('active', i === 0));

    this.renderFandoms();
    this.renderCatalog();
    this.closeFilterPopup();
    this.showToast('Filters reset to default', 'info');
  },

  filterBySize(size, btn) {
    document.querySelectorAll('.size-pill-tss').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.searchQuery = size;
    this.renderCatalog();
    this.showToast(`Filtering for size: ${size}`, 'info');
  },

  // Cart Management
  quickAddToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    this.addToCart(productId, product.sizes[0], product.colors[0].name, true);
  },

  addToCart(productId, size, color, openDrawer = true) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const unitPrice = this.isClubMember ? product.clubPrice : product.price;
    const existingIndex = this.cart.findIndex(item => item.id === productId && item.size === size && item.color === color);

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += 1;
    } else {
      this.cart.push({
        id: productId,
        name: product.name,
        price: unitPrice,
        image: product.images[0],
        size: size || product.sizes[0],
        color: color || product.colors[0].name,
        quantity: 1
      });
    }

    this.saveState();
    this.updateCartUI();

    if (openDrawer) {
      this.openCartDrawer();
      this.showToast(`Added ${product.name} to bag!`, 'success');
    }
  },

  updateCartQty(index, delta) {
    if (!this.cart[index]) return;
    this.cart[index].quantity += delta;
    if (this.cart[index].quantity <= 0) {
      this.cart.splice(index, 1);
    }
    this.saveState();
    this.updateCartUI();
  },

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.saveState();
    this.updateCartUI();
    this.showToast('Item removed from bag', 'info');
  },

  updateCartUI() {
    const badge = document.getElementById('cart-badge-count');
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

    if (badge) {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    const drawerBody = document.getElementById('cart-drawer-items');
    const subtotalDisplay = document.getElementById('cart-subtotal-price');
    const totalDisplay = document.getElementById('cart-total-price');
    const countText = document.getElementById('cart-items-count-text');
    const freeShippingText = document.getElementById('free-shipping-text');

    if (countText) countText.textContent = totalItems;

    let subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Free shipping threshold
    const freeShippingThreshold = 999;
    if (freeShippingText) {
      if (subtotal >= freeShippingThreshold || subtotal === 0) {
        freeShippingText.innerHTML = `🎉 <b>FREE Shipping</b> Applied on this Order!`;
      } else {
        const remaining = freeShippingThreshold - subtotal;
        freeShippingText.innerHTML = `📦 Add <b>${this.formatPrice(remaining)}</b> more for <b>FREE Shipping</b>!`;
      }
    }

    let discount = (subtotal * this.appliedDiscount) + this.promoDiscountAmount;
    let finalTotal = Math.max(0, subtotal - discount);

    if (subtotalDisplay) subtotalDisplay.textContent = this.formatPrice(subtotal);
    if (totalDisplay) totalDisplay.textContent = this.formatPrice(finalTotal);

    if (drawerBody) {
      if (this.cart.length === 0) {
        drawerBody.innerHTML = `
          <div style="text-align:center; padding: 50px 10px; color:var(--text-muted);">
            <div style="font-size:3.5rem; margin-bottom:12px;">🛍️</div>
            <h4 style="color:var(--text-primary); font-family:var(--font-heading); font-size:1.2rem; font-weight:800;">Your Bag is Empty</h4>
            <p style="font-size:0.85rem; margin:6px 0 16px;">Explore our new oversized drops & anime merch!</p>
            <button class="btn-tss-primary" onclick="App.closeCartDrawer(); App.filterByCategory('oversized');">SHOP BESTSELLERS</button>
          </div>
        `;
      } else {
        drawerBody.innerHTML = this.cart.map((item, index) => `
          <div class="cart-item-row">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img"/>
            <div style="flex-grow:1;">
              <div style="font-family:var(--font-heading); font-weight:800; font-size:0.88rem; color:var(--text-primary);">${item.name}</div>
              <div style="font-size:0.78rem; color:var(--text-muted); margin:2px 0 6px;">Size: ${item.size} | Color: ${item.color}</div>
              <div style="font-weight:900; font-size:0.95rem; color:var(--tss-red);">${this.formatPrice(item.price)}</div>
            </div>
            <div class="qty-control" style="display:inline-flex; align-items:center; border:1px solid var(--tss-border); border-radius:4px;">
              <button style="padding:4px 8px; cursor:pointer;" onclick="App.updateCartQty(${index}, -1)">-</button>
              <span style="padding:0 8px; font-weight:800; font-size:0.85rem;">${item.quantity}</span>
              <button style="padding:4px 8px; cursor:pointer;" onclick="App.updateCartQty(${index}, 1)">+</button>
            </div>
            <button style="color:var(--text-muted); font-size:1rem; margin-left:8px; cursor:pointer; background:none; border:none;" onclick="App.removeFromCart(${index})" title="Remove item">✕</button>
          </div>
        `).join('');
      }
    }
  },

  openCartDrawer() {
    document.getElementById('cart-drawer-backdrop')?.classList.add('open');
    document.getElementById('cart-drawer-panel')?.classList.add('open');
  },

  closeCartDrawer() {
    document.getElementById('cart-drawer-backdrop')?.classList.remove('open');
    document.getElementById('cart-drawer-panel')?.classList.remove('open');
  },

  // Wishlist
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showToast('Removed from wishlist', 'info');
    } else {
      this.wishlist.push(productId);
      this.showToast('Saved to wishlist! ♥', 'success');
    }
    this.saveState();
    this.updateWishlistUI();
    this.renderCatalog();
  },

  updateWishlistUI() {
    const badge = document.getElementById('wishlist-badge-count');
    if (badge) {
      badge.textContent = this.wishlist.length;
      badge.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
    }

    const drawerBody = document.getElementById('wishlist-drawer-items');
    if (drawerBody) {
      if (this.wishlist.length === 0) {
        drawerBody.innerHTML = `
          <div style="text-align:center; padding: 50px 10px; color:var(--text-muted);">
            <div style="font-size:3.5rem; margin-bottom:12px;">♥</div>
            <h4 style="color:var(--text-primary); font-family:var(--font-heading); font-size:1.2rem; font-weight:800;">Your Wishlist is Empty</h4>
            <p style="font-size:0.85rem; margin-top:4px;">Tap the heart icon on any style to save it here!</p>
          </div>
        `;
      } else {
        const items = PRODUCTS.filter(p => this.wishlist.includes(p.id));
        drawerBody.innerHTML = items.map(p => `
          <div class="cart-item-row">
            <img src="${p.images[0]}" alt="${p.name}" class="cart-item-img"/>
            <div style="flex-grow:1;">
              <div style="font-family:var(--font-heading); font-weight:800; font-size:0.88rem;">${p.name}</div>
              <div style="font-weight:900; font-size:0.95rem; color:var(--tss-red);">${this.formatPrice(p.price)}</div>
              <button class="btn-tss-primary" style="padding:4px 10px; font-size:0.75rem; margin-top:6px;" onclick="App.quickAddToCart('${p.id}')">+ Move to Bag</button>
            </div>
            <button style="color:var(--text-muted); cursor:pointer; background:none; border:none; font-size:1.1rem;" onclick="App.toggleWishlist('${p.id}')">✕</button>
          </div>
        `).join('');
      }
    }
  },

  openWishlistDrawer() {
    document.getElementById('wishlist-drawer-backdrop')?.classList.add('open');
    document.getElementById('wishlist-drawer-panel')?.classList.add('open');
  },

  closeWishlistDrawer() {
    document.getElementById('wishlist-drawer-backdrop')?.classList.remove('open');
    document.getElementById('wishlist-drawer-panel')?.classList.remove('open');
  },

  // Quick View / Product Detail Modal
  openQuickView(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quickview-modal');
    const modalBody = document.getElementById('quickview-body');
    if (!modal || !modalBody) return;

    const effectivePrice = this.isClubMember ? product.clubPrice : product.price;

    modalBody.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1.15fr; gap:28px;">
        <!-- Images Gallery -->
        <div>
          <img src="${product.images[0]}" id="qv-active-img" style="width:100%; aspect-ratio:1/1.2; object-fit:cover; border-radius:6px; box-shadow:var(--shadow-md);"/>
          <div style="display:flex; gap:8px; margin-top:10px; overflow-x:auto;">
            ${product.images.map(img => `
              <img src="${img}" style="width:65px; height:75px; object-fit:cover; border-radius:4px; cursor:pointer; border:2px solid transparent;" 
                   onclick="document.getElementById('qv-active-img').src='${img}'; this.parentElement.querySelectorAll('img').forEach(i=>i.style.borderColor='transparent'); this.style.borderColor='var(--tss-red)'"/>
            `).join('')}
          </div>
        </div>

        <!-- Product Details -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="background:var(--tss-red); color:#fff; font-family:var(--font-heading); font-size:0.7rem; font-weight:900; padding:3px 8px; border-radius:4px;">${product.fitType}</span>
            <span style="font-size:0.8rem; color:#1b8755; font-weight:800;">${product.stockStatus || '✓ In Stock'}</span>
          </div>

          <h2 style="font-family:var(--font-heading); font-size:1.45rem; font-weight:900; margin:8px 0 4px;">${product.name}</h2>
          <div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:12px;">Fandom: <b>${product.fandomTag}</b> • ⭐ ${product.rating} (${product.reviewCount} verified reviews)</div>
          
          <div class="pricing-block-tss" style="margin-bottom:14px;">
            <div style="display:flex; align-items:baseline; gap:10px;">
              <span style="font-family:var(--font-heading); font-size:1.7rem; font-weight:900; color:var(--tss-red);">${this.formatPrice(effectivePrice)}</span>
              ${product.originalPrice ? `<span style="text-decoration:line-through; color:var(--text-muted); font-size:1rem;">MRP ${this.formatPrice(product.originalPrice)}</span>` : ''}
              ${product.originalPrice ? `<span style="color:#1b8755; font-weight:800; font-size:0.85rem;">(${Math.round(((product.originalPrice - effectivePrice) / product.originalPrice) * 100)}% OFF)</span>` : ''}
            </div>

            <div class="club-price-box" onclick="App.toggleClubMembership()" style="margin-top:8px; cursor:pointer;" title="Click to activate VIP Club">
              <span>👑 TSS Exclusive Club Member Price:</span>
              <span class="club-price-val">${this.formatPrice(product.clubPrice)}</span>
            </div>
          </div>

          <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:14px; line-height:1.6;">${product.description}</p>

          <!-- Specifications Pill -->
          <div style="background:var(--bg-tertiary); padding:8px 12px; border-radius:4px; font-size:0.8rem; margin-bottom:16px;">
            🧵 <b>Fabric:</b> ${product.fabric}
          </div>

          <!-- Color Selector -->
          ${product.colors && product.colors.length > 0 ? `
            <div style="margin-bottom:14px;">
              <div style="font-size:0.82rem; font-weight:800; margin-bottom:6px;">Select Color: <span id="qv-selected-color-name">${product.colors[0].name}</span></div>
              <div style="display:flex; gap:10px;">
                ${product.colors.map((c, i) => `
                  <button class="color-swatch-btn ${i===0?'active':''}" style="background:${c.hex}; width:28px; height:28px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 0 1px #ccc; cursor:pointer;"
                          onclick="document.querySelectorAll('.color-swatch-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active'); document.getElementById('qv-selected-color-name').textContent='${c.name}'; document.getElementById('qv-active-img').src='${c.image}';">
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Size Selector -->
          <div style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <div style="font-size:0.82rem; font-weight:800;">Select Size:</div>
              <button onclick="App.openFitQuizModal()" style="background:none; border:none; color:var(--tss-red); font-size:0.78rem; font-weight:800; cursor:pointer; text-decoration:underline;">📐 Sizing Guide</button>
            </div>
            <div class="size-pill-grid" style="display:flex; gap:8px; flex-wrap:wrap;">
              ${product.sizes.map((s, i) => `
                <button class="size-pill-tss ${i===0?'active':''}" onclick="document.querySelectorAll('.modal-content .size-pill-tss').forEach(b=>b.classList.remove('active')); this.classList.add('active');">${s}</button>
              `).join('')}
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px;">
            <button class="btn-tss-primary" style="padding:14px; justify-content:center;" onclick="App.quickAddToCart('${product.id}'); App.closeQuickView();">+ ADD TO BAG</button>
            <button class="btn-tss-primary" style="background:#111; color:#fff; padding:14px; justify-content:center;" onclick="App.quickAddToCart('${product.id}'); App.closeQuickView(); App.openCheckoutModal();">BUY NOW ⚡</button>
          </div>

          <!-- PIN Code Checker -->
          <div style="margin-top:18px; border-top:1px solid var(--tss-border); padding-top:14px;">
            <div style="font-size:0.8rem; font-weight:800; margin-bottom:6px;">📍 Check Delivery & COD Availability</div>
            <div style="display:flex; gap:8px;">
              <input type="text" id="pincode-input" class="tss-search-input" style="max-width:180px; padding:6px 12px; font-size:0.85rem;" placeholder="Enter 6-digit PIN" maxlength="6"/>
              <button class="btn-tss-primary" style="padding:6px 14px; font-size:0.8rem;" onclick="App.checkPincode()">CHECK</button>
            </div>
            <div id="pincode-result" style="font-size:0.78rem; margin-top:6px; font-weight:700;"></div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('open');
  },

  closeQuickView() {
    document.getElementById('quickview-modal')?.classList.remove('open');
  },

  checkPincode() {
    const pin = document.getElementById('pincode-input')?.value.trim();
    const result = document.getElementById('pincode-result');
    if (!result) return;

    if (!pin || pin.length !== 6 || isNaN(pin)) {
      result.innerHTML = `<span style="color:var(--tss-red);">Please enter a valid 6-digit PIN code.</span>`;
      return;
    }

    result.innerHTML = `<span style="color:#1b8755;">⚡ Express Delivery available in 2–3 Days • COD Available!</span>`;
    this.showToast('PIN code serviceable!', 'success');
  },

  // Fit Quiz
  openFitQuizModal() {
    document.getElementById('fitquiz-modal')?.classList.add('open');
  },

  closeFitQuizModal() {
    document.getElementById('fitquiz-modal')?.classList.remove('open');
  },

  calculateFitRecommendation(e) {
    e.preventDefault();
    const pref = document.getElementById('quiz-fit-pref')?.value || 'oversized';
    const resultBox = document.getElementById('quiz-result-box');
    const sizeDisplay = document.getElementById('quiz-recommended-size');

    let recSize = 'Size L (Signature Oversized Fit)';
    if (pref === 'slim') recSize = 'Size M (Athletic Cut)';
    if (pref === 'regular') recSize = 'Size L (Classic Regular Fit)';

    if (sizeDisplay) sizeDisplay.textContent = recSize;
    if (resultBox) resultBox.style.display = 'block';
    this.showToast(`✨ Recommended TSS fit: ${recSize}`, 'success');
  },

  // Order Tracking Modal
  openTrackOrderModal() {
    const modal = document.getElementById('track-order-modal');
    if (modal) modal.classList.add('open');
  },

  closeTrackOrderModal() {
    document.getElementById('track-order-modal')?.classList.remove('open');
  },

  async trackOrder(e) {
    e.preventDefault();
    const input = document.getElementById('track-order-input')?.value.trim();
    const resultContainer = document.getElementById('track-order-result');
    if (!resultContainer) return;

    if (!input) {
      this.showToast('Please enter an Order or Tracking ID', 'info');
      return;
    }

    resultContainer.innerHTML = `<div style="text-align:center; padding:16px; color:var(--text-secondary);">🔍 Fetching live order status...</div>`;

    try {
      const orderData = await API.trackOrder(input);

      resultContainer.innerHTML = `
        <div style="background:var(--bg-secondary); border:1px solid var(--tss-border); border-radius:var(--radius-sm); padding:18px; margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--tss-border); padding-bottom:10px;">
            <div>
              <div style="font-size:0.78rem; color:var(--text-muted);">Tracking ID:</div>
              <div style="font-weight:900; font-family:monospace; color:var(--tss-red); font-size:1.1rem;">${orderData.trackingNumber}</div>
            </div>
            <span style="background:#e8f5e9; color:#1b8755; font-size:0.75rem; font-weight:800; padding:4px 8px; border-radius:4px;">${orderData.orderStatus.toUpperCase()} 🚚</span>
          </div>

          <div class="tracking-steps-timeline">
            ${orderData.timeline.map(step => `
              <div class="track-step ${step.status}">
                <span class="step-dot">${step.status === 'done' ? '✓' : (step.status === 'active' ? '⚡' : '○')}</span>
                <div>
                  <div class="step-title">${step.title}</div>
                  <div class="step-time">${step.desc} • <small>${step.time}</small></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } catch (err) {
      resultContainer.innerHTML = `
        <div style="background:var(--tss-red-light); border:1px solid var(--tss-red); border-radius:var(--radius-sm); padding:16px; margin-top:16px; text-align:center;">
          <div style="font-weight:800; color:var(--tss-red); font-size:0.9rem;">⚠️ Order Not Found</div>
          <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">No order matching "${input}". Please check your tracking ID and try again.</div>
        </div>
      `;
    }
  },

  // Checkout Modal
  openCheckoutModal() {
    if (this.cart.length === 0) {
      this.showToast('Your bag is empty!', 'info');
      return;
    }
    this.closeCartDrawer();
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    this.renderCheckoutSummary();
    modal.classList.add('open');
  },

  closeCheckoutModal() {
    document.getElementById('checkout-modal')?.classList.remove('open');
  },

  renderCheckoutSummary() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = (subtotal * this.appliedDiscount) + this.promoDiscountAmount;
    const finalTotal = Math.max(0, subtotal - discount);

    const orderSummaryElem = document.getElementById('checkout-order-summary');
    if (orderSummaryElem) {
      orderSummaryElem.innerHTML = `
        <h4 style="font-family: var(--font-heading); margin-bottom: 12px; font-size: 1.1rem; font-weight:900;">Order Summary (${this.cart.length} items)</h4>
        <div style="display:flex; flex-direction:column; gap:8px; max-height:180px; overflow-y:auto; margin-bottom:14px;">
          ${this.cart.map(item => `
            <div style="display:flex; justify-content:space-between; font-size:0.82rem;">
              <span>${item.name} (${item.size}) x${item.quantity}</span>
              <b>${this.formatPrice(item.price * item.quantity)}</b>
            </div>
          `).join('')}
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.88rem; margin-bottom:6px;">
          <span>Bag Total</span>
          <span>${this.formatPrice(subtotal)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.88rem; color:#1b8755; margin-bottom:6px;">
          <span>Shipping Fee</span>
          <span>FREE</span>
        </div>
        ${discount > 0 ? `
          <div style="display:flex; justify-content:space-between; font-size:0.88rem; color:var(--tss-red); margin-bottom:6px;">
            <span>Coupon Discount (${this.promoCode || 'PROMO'})</span>
            <span>-${this.formatPrice(discount)}</span>
          </div>
        ` : ''}
        <div style="display:flex; justify-content:space-between; font-family:var(--font-heading); font-size:1.25rem; font-weight:900; color:var(--text-primary); margin-top:10px; padding-top:10px; border-top:1px solid var(--tss-border);">
          <span>Total Payable</span>
          <span style="color:var(--tss-red);">${this.formatPrice(finalTotal)}</span>
        </div>
      `;
    }
  },

  async applyPromoCode() {
    const input = document.getElementById('promo-input');
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
      const res = await API.validateCoupon(code, subtotal);
      if (res.valid) {
        if (res.discountType === 'flat') {
          this.appliedDiscount = 0;
          this.promoDiscountAmount = res.calculatedDiscount;
        } else {
          this.appliedDiscount = res.discountValue;
          this.promoDiscountAmount = 0;
        }
        this.promoCode = res.code;
        this.showToast(res.message || `🎉 Coupon ${res.code} applied!`, 'success');
      } else {
        this.showToast(res.message || 'Invalid coupon code.', 'info');
        return;
      }
    } catch (e) {
      this.showToast('Coupon validation error', 'info');
      return;
    }

    this.updateCartUI();
    this.renderCheckoutSummary();
  },

  selectPaymentMethod(method, elem) {
    document.querySelectorAll('.pm-card').forEach(c => c.classList.remove('selected'));
    elem.classList.add('selected');

    const upiBox = document.getElementById('upi-qr-box');
    if (upiBox) {
      upiBox.style.display = method === 'upi' ? 'block' : 'none';
    }
  },

  async processSimulatedOrder(e) {
    e.preventDefault();

    const name = document.getElementById('checkout-name')?.value || 'Valued Customer';
    const email = document.getElementById('checkout-email')?.value || 'customer@tss.com';
    const address = document.getElementById('checkout-address')?.value || 'Mumbai, India';

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = (subtotal * this.appliedDiscount) + this.promoDiscountAmount;
    const finalTotal = Math.max(0, subtotal - discount);

    const orderPayload = {
      customerName: name,
      customerEmail: email,
      customerAddress: address,
      items: this.cart,
      subtotal,
      discount,
      finalTotal,
      paymentMethod: document.querySelector('.pm-card.selected')?.innerText?.trim() || 'UPI'
    };

    let trackingNo = 'TSS-' + Math.floor(100000 + Math.random() * 900000);

    try {
      const orderRes = await API.createOrder(orderPayload);
      if (orderRes && orderRes.trackingNumber) {
        trackingNo = orderRes.trackingNumber;
      }
    } catch (err) {
      console.warn('Backend order save failed, fallback tracking no used:', err);
    }

    const modalContent = document.getElementById('checkout-modal-inner');
    if (modalContent) {
      modalContent.innerHTML = `
        <div style="text-align:center; padding: 24px 10px;">
          <div style="font-size: 3.5rem; margin-bottom: 12px; animation: bounce 0.6s ease;">👻🎉</div>
          <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight:900; color:var(--tss-red); margin-bottom: 6px;">Order Confirmed!</h2>
          <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 20px;">Thank you <b>${name}</b>! A confirmation email and tracking link has been sent to <b>${email}</b>.</p>
          
          <div style="background: var(--bg-secondary); border: 1px dashed var(--tss-red); border-radius: var(--radius-sm); padding: 20px; max-width: 440px; margin: 0 auto 20px; text-align: left;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">Tracking Number:</span>
              <span style="font-family: monospace; font-size: 1.1rem; font-weight: 900; color: var(--tss-red);">${trackingNo}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size: 0.88rem;">
              <span>Total Paid:</span>
              <b style="color:var(--text-primary); font-size:1.1rem;">${this.formatPrice(finalTotal)}</b>
            </div>
            <div style="font-size: 0.85rem; color:#1b8755; font-weight:700;">Estimated Delivery: 2–3 Business Days</div>
          </div>

          <div style="display:flex; gap:12px; justify-content:center;">
            <button class="btn-tss-outline" onclick="window.print()">🖨️ PRINT INVOICE</button>
            <button class="btn-tss-primary" onclick="window.location.reload()">CONTINUE SHOPPING →</button>
          </div>
        </div>
      `;
    }

    this.cart = [];
    this.appliedDiscount = 0;
    this.promoDiscountAmount = 0;
    this.saveState();
    this.updateCartUI();
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  bindEvents() {
    const priceSlider = document.getElementById('price-range-input');
    const priceDisplay = document.getElementById('max-price-val');
    if (priceSlider && priceDisplay) {
      priceSlider.addEventListener('input', (e) => {
        this.maxPrice = parseInt(e.target.value, 10);
        priceDisplay.textContent = this.formatPrice(this.maxPrice);
        this.renderCatalog();
      });
    }

    const sortSelect = document.getElementById('catalog-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderCatalog();
      });
    }
  },

  // User Auth UI & Management
  updateUserAuthUI() {
    const btn = document.getElementById('user-header-name');
    if (btn) {
      btn.textContent = this.user ? this.user.name.split(' ')[0] : 'LOGIN';
    }
  },

  openAuthModal(tab = 'login') {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('open');
      this.renderAuthModal(tab);
    }
  },

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('open');
  },

  renderAuthModal(tab = 'login') {
    const container = document.getElementById('auth-modal-content');
    if (!container) return;

    if (this.user) {
      container.innerHTML = `
        <div style="text-align:center; padding: 12px 0;">
          <div class="tss-logo-ghost" style="width:60px; height:60px; margin:0 auto 12px; font-size:1.8rem;">👻</div>
          <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:900; margin-bottom:4px;">Hi, ${this.user.name}!</h2>
          <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">${this.user.email} • ${this.user.phone || ''}</div>
          
          ${this.user.isClubMember ? `
            <div style="background:linear-gradient(135deg, #2b2b2b, #111); border:1px solid var(--tss-gold); color:var(--tss-gold); padding:8px 12px; border-radius:6px; font-size:0.8rem; font-weight:800; margin-bottom:18px;">
              👑 VIP CLUB MEMBER ACTIVE
            </div>
          ` : ''}

          <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn-tss-primary" style="width:100%; justify-content:center;" onclick="App.closeAuthModal(); App.openAddressModal();">
              📍 MANAGE DELIVERY ADDRESSES
            </button>
            <button class="btn-tss-outline" style="width:100%; justify-content:center; color:var(--tss-red); border-color:var(--tss-red);" onclick="App.logout()">
              LOGOUT
            </button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display:flex; border-bottom:2px solid var(--tss-border); margin-bottom:20px;">
        <button style="flex:1; padding:10px 0; font-family:var(--font-heading); font-size:0.95rem; font-weight:900; background:none; border:none; cursor:pointer; color:${tab === 'login' ? 'var(--tss-red)' : 'var(--text-secondary)'}; border-bottom:${tab === 'login' ? '3px solid var(--tss-red)' : '3px solid transparent'}; margin-bottom:-2px;" onclick="App.renderAuthModal('login')">
          LOGIN
        </button>
        <button style="flex:1; padding:10px 0; font-family:var(--font-heading); font-size:0.95rem; font-weight:900; background:none; border:none; cursor:pointer; color:${tab === 'register' ? 'var(--tss-red)' : 'var(--text-secondary)'}; border-bottom:${tab === 'register' ? '3px solid var(--tss-red)' : '3px solid transparent'}; margin-bottom:-2px;" onclick="App.renderAuthModal('register')">
          CREATE ACCOUNT
        </button>
      </div>

      <div id="auth-error-box" style="display:none; background:var(--tss-red-light); border:1px solid var(--tss-red); color:var(--tss-red); padding:8px 12px; border-radius:6px; font-size:0.8rem; font-weight:800; margin-bottom:14px;"></div>

      ${tab === 'login' ? `
        <form onsubmit="App.submitLogin(event)">
          <div style="margin-bottom:12px;">
            <label style="display:block; font-size:0.8rem; font-weight:800; margin-bottom:4px;">Email or Mobile</label>
            <input type="text" id="auth-login-email" class="tss-search-input" placeholder="name@example.com or 9876543210" required>
          </div>
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:0.8rem; font-weight:800; margin-bottom:4px;">Password</label>
            <input type="password" id="auth-login-password" class="tss-search-input" placeholder="Enter password" required>
          </div>
          <button type="submit" class="btn-tss-primary" style="width:100%; padding:14px; justify-content:center;">
            LOGIN TO TSS →
          </button>
          <div style="text-align:center; margin-top:14px; font-size:0.82rem; color:var(--text-secondary);">
            New to TSS? <span style="color:var(--tss-red); font-weight:800; cursor:pointer;" onclick="App.renderAuthModal('register')">Create Account</span>
          </div>
        </form>
      ` : `
        <form onsubmit="App.submitRegister(event)">
          <div style="margin-bottom:10px;">
            <label style="display:block; font-size:0.8rem; font-weight:800; margin-bottom:4px;">Full Name</label>
            <input type="text" id="auth-reg-name" class="tss-search-input" placeholder="Ayush Sharma" required>
          </div>
          <div style="margin-bottom:10px;">
            <label style="display:block; font-size:0.8rem; font-weight:800; margin-bottom:4px;">Email Address</label>
            <input type="email" id="auth-reg-email" class="tss-search-input" placeholder="ayush@example.com" required>
          </div>
          <div style="margin-bottom:10px;">
            <label style="display:block; font-size:0.8rem; font-weight:800; margin-bottom:4px;">Mobile Number</label>
            <input type="tel" id="auth-reg-phone" class="tss-search-input" placeholder="9876543210" maxlength="10" required>
          </div>
          <div style="margin-bottom:14px;">
            <label style="display:block; font-size:0.8rem; font-weight:800; margin-bottom:4px;">Create Password</label>
            <input type="password" id="auth-reg-password" class="tss-search-input" placeholder="At least 6 characters" minlength="6" required>
          </div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px; background:var(--bg-tertiary); padding:8px 10px; border-radius:6px;">
            <input type="checkbox" id="auth-reg-vip" checked style="width:16px; height:16px; accent-color:var(--tss-gold);">
            <label for="auth-reg-vip" style="font-size:0.75rem; font-weight:800; cursor:pointer;">👑 Activate VIP Membership for Club Discounts</label>
          </div>
          <button type="submit" class="btn-tss-primary" style="width:100%; padding:14px; justify-content:center;">
            CREATE ACCOUNT →
          </button>
        </form>
      `}
    `;
  },

  async submitLogin(e) {
    e.preventDefault();
    const email = document.getElementById('auth-login-email')?.value;
    const password = document.getElementById('auth-login-password')?.value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        this.user = data.user;
        if (data.user.isClubMember) {
          this.isClubMember = true;
          this.updateClubBadgeUI();
        }
        if (data.user.addresses && data.user.addresses.length > 0) {
          this.savedAddresses = data.user.addresses;
        }
        this.saveState();
        this.updateUserAuthUI();
        this.closeAuthModal();
        this.showToast(`Welcome back, ${data.user.name}! 👻`, 'success');
        return;
      }
      const errBox = document.getElementById('auth-error-box');
      if (errBox) { errBox.style.display = 'block'; errBox.textContent = data.error || 'Login failed.'; }
    } catch (err) {
      this.user = { name: email.split('@')[0], email, phone: '9876543210', isClubMember: true };
      this.saveState();
      this.updateUserAuthUI();
      this.closeAuthModal();
      this.showToast('Logged in successfully!', 'success');
    }
  },

  async submitRegister(e) {
    e.preventDefault();
    const name = document.getElementById('auth-reg-name')?.value;
    const email = document.getElementById('auth-reg-email')?.value;
    const phone = document.getElementById('auth-reg-phone')?.value;
    const password = document.getElementById('auth-reg-password')?.value;
    const isClub = document.getElementById('auth-reg-vip')?.checked;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, isClubMember: isClub })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        this.user = data.user;
        if (isClub) {
          this.isClubMember = true;
          this.updateClubBadgeUI();
        }
        this.saveState();
        this.updateUserAuthUI();
        this.closeAuthModal();
        this.showToast('Welcome to The Souled Store! 👻', 'success');
        return;
      }
      const errBox = document.getElementById('auth-error-box');
      if (errBox) { errBox.style.display = 'block'; errBox.textContent = data.error || 'Registration failed.'; }
    } catch (err) {
      this.user = { name, email, phone, isClubMember: !!isClub };
      this.saveState();
      this.updateUserAuthUI();
      this.closeAuthModal();
      this.showToast('Account created successfully! 👻', 'success');
    }
  },

  logout() {
    this.user = null;
    this.saveState();
    this.updateUserAuthUI();
    this.closeAuthModal();
    this.showToast('Logged out successfully.', 'info');
  },

  // Delivery Address Management
  openAddressModal() {
    const modal = document.getElementById('address-modal');
    if (modal) {
      modal.classList.add('open');
      this.renderAddressModal();
    }
  },

  closeAddressModal() {
    const modal = document.getElementById('address-modal');
    if (modal) modal.classList.remove('open');
  },

  renderAddressModal(showForm = false) {
    const container = document.getElementById('address-modal-content');
    if (!container) return;

    if (showForm) {
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="font-family:var(--font-heading); font-size:1.3rem; font-weight:900;">Add Delivery Address 📍</h3>
          <button class="btn-tss-outline" style="padding:4px 10px; font-size:0.75rem;" onclick="App.renderAddressModal(false)">← Back</button>
        </div>

        <form onsubmit="App.saveDeliveryAddress(event)">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
            <input type="text" id="addr-name" class="tss-search-input" placeholder="Recipient Name" value="${this.user?.name || ''}" required>
            <input type="tel" id="addr-phone" class="tss-search-input" placeholder="10-Digit Mobile" maxlength="10" value="${this.user?.phone || ''}" required>
          </div>
          <div style="margin-bottom:10px;">
            <input type="text" id="addr-pin" class="tss-search-input" placeholder="6-Digit PIN Code (e.g. 400001)" maxlength="6" oninput="App.checkPinInput(this.value)" required>
            <div id="addr-pin-status" style="font-size:0.75rem; margin-top:4px; font-weight:700;"></div>
          </div>
          <div style="margin-bottom:10px;">
            <input type="text" id="addr-house" class="tss-search-input" placeholder="Flat / House No / Building" required>
          </div>
          <div style="margin-bottom:10px;">
            <input type="text" id="addr-street" class="tss-search-input" placeholder="Street / Area / Landmark" required>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
            <input type="text" id="addr-city" class="tss-search-input" placeholder="City" required>
            <input type="text" id="addr-state" class="tss-search-input" placeholder="State" required>
          </div>
          <div style="display:flex; gap:10px;">
            <button type="button" class="btn-tss-outline" style="flex:1; padding:12px;" onclick="App.renderAddressModal(false)">CANCEL</button>
            <button type="submit" class="btn-tss-primary" style="flex:1.5; padding:12px; justify-content:center;">SAVE ADDRESS →</button>
          </div>
        </form>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
        <h3 style="font-family:var(--font-heading); font-size:1.3rem; font-weight:900;">Delivery Addresses 📍</h3>
        <button class="btn-tss-primary" style="padding:6px 12px; font-size:0.78rem;" onclick="App.renderAddressModal(true)">+ ADD NEW</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px; max-height:360px; overflow-y:auto;">
        ${this.savedAddresses.length === 0 ? `
          <div style="text-align:center; padding:30px 10px; color:var(--text-muted);">
            <div style="font-size:2.5rem; margin-bottom:8px;">📍</div>
            <p>No saved addresses yet.</p>
          </div>
        ` : this.savedAddresses.map(addr => `
          <div style="background:var(--bg-secondary); border:1.5px solid ${addr.isDefault ? 'var(--tss-red)' : 'var(--tss-border)'}; border-radius:8px; padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-weight:900; font-size:0.9rem;">${addr.fullName} • PIN: ${addr.pincode}</span>
              <button style="background:none; border:none; color:var(--text-muted); cursor:pointer;" onclick="App.deleteSavedAddress('${addr.id}')">✕</button>
            </div>
            <div style="font-size:0.82rem; color:var(--text-secondary);">${addr.houseNo}, ${addr.street}, ${addr.city}, ${addr.state}</div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">📞 ${addr.phone}</div>
            ${!addr.isDefault ? `
              <button style="background:none; border:none; color:var(--tss-red); font-size:0.75rem; font-weight:800; cursor:pointer; text-decoration:underline; margin-top:6px;" onclick="App.setDefaultSavedAddress('${addr.id}')">
                Set as Default Address
              </button>
            ` : '<span style="font-size:0.7rem; color:var(--tss-red); font-weight:900; margin-top:4px; display:inline-block;">✓ DEFAULT ADDRESS</span>'}
          </div>
        `).join('')}
      </div>
    `;
  },

  checkPinInput(pin) {
    const status = document.getElementById('addr-pin-status');
    const cityInput = document.getElementById('addr-city');
    const stateInput = document.getElementById('addr-state');

    if (!status) return;
    if (pin.length === 6 && !isNaN(pin)) {
      fetch(`/api/auth/pincode/${pin}`)
        .then(r => r.json())
        .then(data => {
          if (data.valid) {
            status.style.color = '#1b8755';
            status.textContent = data.deliveryText || '⚡ Serviceable PIN Code';
            if (cityInput && data.city && data.city !== 'Serviceable Area') cityInput.value = data.city;
            if (stateInput && data.state && data.state !== 'India') stateInput.value = data.state;
          }
        })
        .catch(() => {
          status.style.color = '#1b8755';
          status.textContent = '⚡ Standard Express Delivery (2–3 Days)';
        });
    } else {
      status.textContent = '';
    }
  },

  saveDeliveryAddress(e) {
    e.preventDefault();
    const fullName = document.getElementById('addr-name')?.value;
    const phone = document.getElementById('addr-phone')?.value;
    const pincode = document.getElementById('addr-pin')?.value;
    const houseNo = document.getElementById('addr-house')?.value;
    const street = document.getElementById('addr-street')?.value;
    const city = document.getElementById('addr-city')?.value || 'Mumbai';
    const state = document.getElementById('addr-state')?.value || 'Maharashtra';

    const newAddr = {
      id: 'addr_' + Date.now(),
      fullName,
      phone,
      pincode,
      houseNo,
      street,
      city,
      state,
      addressType: 'HOME',
      isDefault: this.savedAddresses.length === 0
    };

    this.savedAddresses.unshift(newAddr);
    this.saveState();
    this.renderAddressModal(false);
    this.showToast('Delivery address saved! 📍', 'success');
  },

  deleteSavedAddress(id) {
    this.savedAddresses = this.savedAddresses.filter(a => a.id !== id);
    this.saveState();
    this.renderAddressModal(false);
    this.showToast('Address removed.', 'info');
  },

  setDefaultSavedAddress(id) {
    this.savedAddresses = this.savedAddresses.map(a => ({ ...a, isDefault: a.id === id }));
    this.saveState();
    this.renderAddressModal(false);
    this.showToast('Default delivery address updated! 📍', 'success');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
