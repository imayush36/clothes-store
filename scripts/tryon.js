// THE SOULED STORE (TSS) - Interactive Virtual Try-On & AI Stylist Engine (2026 Edition)

const TryOnStudio = {
  activeAvatar: 'male-street',
  activeLayers: {
    top: null,
    outerwear: null,
    bottom: null,
    shoes: null
  },

  avatars: {
    'male-street': {
      name: 'Aarav (Streetwear Fit • 6\'0")',
      image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80',
      gender: 'men'
    },
    'male-athletic': {
      name: 'Kabir (Athletic Cut • 5\'10")',
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80',
      gender: 'men'
    },
    'female-street': {
      name: 'Riya (Oversized Slouch • 5\'6")',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
      gender: 'women'
    }
  },

  init() {
    // Set default initial look
    this.activeLayers.top = PRODUCTS.find(p => p.id === 'prod-01') || PRODUCTS[0];
    this.activeLayers.outerwear = PRODUCTS.find(p => p.id === 'prod-05') || PRODUCTS[4];
    this.activeLayers.bottom = PRODUCTS.find(p => p.id === 'prod-07') || PRODUCTS[6];
    this.activeLayers.shoes = PRODUCTS.find(p => p.id === 'prod-12') || PRODUCTS[10];

    this.renderAvatarSelector();
    this.renderSlotSelectors();
    this.updateStudioCanvas();
    this.bindEvents();
  },

  renderAvatarSelector() {
    const container = document.getElementById('tryon-avatar-selector-container');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap;">
        <span style="font-size:0.8rem; font-weight:800; color:var(--text-secondary);">CHOOSE AVATAR:</span>
        ${Object.keys(this.avatars).map(key => `
          <button class="avatar-pill-btn ${this.activeAvatar === key ? 'active' : ''}" onclick="TryOnStudio.setAvatar('${key}')">
            ${this.avatars[key].name}
          </button>
        `).join('')}
      </div>
    `;
  },

  setAvatar(avatarKey) {
    this.activeAvatar = avatarKey;
    this.renderAvatarSelector();
    this.updateStudioCanvas();
    App.showToast(`Switched Model to: ${this.avatars[avatarKey].name}`, 'info');
  },

  renderSlotSelectors() {
    const slots = [
      { id: 'top', label: '1. Topwear / Tees', icon: '👕', items: PRODUCTS.filter(p => p.tryonType === 'top') },
      { id: 'outerwear', label: '2. Hoodies & Jackets', icon: '🧥', items: PRODUCTS.filter(p => p.tryonType === 'outerwear') },
      { id: 'bottom', label: '3. Bottoms & Cargos', icon: '👖', items: PRODUCTS.filter(p => p.tryonType === 'bottom') },
      { id: 'shoes', label: '4. Sneakers & Kicks', icon: '👟', items: PRODUCTS.filter(p => p.tryonType === 'shoes') }
    ];

    const controlsContainer = document.getElementById('tryon-controls-container');
    if (!controlsContainer) return;

    controlsContainer.innerHTML = slots.map(slot => `
      <div class="tryon-slot-group">
        <div class="slot-header">
          <div style="display:flex; align-items:center; gap:6px;">
            <span>${slot.icon}</span>
            <span style="font-weight:800;">${slot.label}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="slot-selected-name" id="label-${slot.id}">${this.activeLayers[slot.id]?.name || 'None'}</span>
            ${this.activeLayers[slot.id] ? `
              <button class="slot-clear-btn" onclick="TryOnStudio.removeLayer('${slot.id}')" title="Remove Layer">✕</button>
            ` : ''}
          </div>
        </div>
        <div class="slot-items-grid">
          ${slot.items.map(item => `
            <div class="slot-item-card ${this.activeLayers[slot.id]?.id === item.id ? 'selected' : ''}"
                 data-slot="${slot.id}" data-prod-id="${item.id}">
              <img src="${item.images[0]}" class="slot-thumb" alt="${item.name}" loading="lazy"/>
              <div class="slot-name">${item.name}</div>
              <div class="slot-price">${App.formatPrice(App.isClubMember ? item.clubPrice : item.price)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Attach click events to slot items
    controlsContainer.querySelectorAll('.slot-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const slot = card.dataset.slot;
        const prodId = card.dataset.prodId;
        const product = PRODUCTS.find(p => p.id === prodId);
        this.selectItem(slot, product);
      });
    });
  },

  selectItem(slot, product) {
    this.activeLayers[slot] = product;
    
    // Update active highlight in DOM
    const group = document.querySelectorAll(`[data-slot="${slot}"]`);
    group.forEach(card => {
      card.classList.toggle('selected', card.dataset.prodId === product.id);
    });

    const labelElem = document.getElementById(`label-${slot}`);
    if (labelElem) labelElem.textContent = product.name;

    this.renderSlotSelectors();
    this.updateStudioCanvas();
    App.showToast(`Selected: ${product.name}`, 'info');
  },

  removeLayer(slot) {
    this.activeLayers[slot] = null;
    this.renderSlotSelectors();
    this.updateStudioCanvas();
    App.showToast(`Removed ${slot} from outfit`, 'info');
  },

  updateStudioCanvas() {
    const canvasImg = document.getElementById('tryon-visual-main');
    const badgeOuter = document.getElementById('tryon-badge-outer');
    const badgeTop = document.getElementById('tryon-badge-top');
    const badgeBottom = document.getElementById('tryon-badge-bottom');
    const totalElem = document.getElementById('tryon-bundle-price');
    const savingsElem = document.getElementById('tryon-bundle-savings');

    let totalPrice = 0;
    let originalPrice = 0;
    let itemCount = 0;

    Object.values(this.activeLayers).forEach(item => {
      if (item) {
        totalPrice += App.isClubMember ? item.clubPrice : item.price;
        originalPrice += item.originalPrice || item.price;
        itemCount++;
      }
    });

    if (totalElem) {
      totalElem.textContent = App.formatPrice(totalPrice);
    }
    if (savingsElem) {
      const savings = originalPrice - totalPrice;
      savingsElem.textContent = savings > 0 ? `You Save ${App.formatPrice(savings)} (${Math.round((savings / originalPrice) * 100)}% OFF)` : '';
    }

    if (badgeOuter) {
      badgeOuter.style.display = this.activeLayers.outerwear ? 'inline-block' : 'none';
      if (this.activeLayers.outerwear) badgeOuter.textContent = `🧥 ${this.activeLayers.outerwear.name}`;
    }
    if (badgeTop) {
      badgeTop.style.display = this.activeLayers.top ? 'inline-block' : 'none';
      if (this.activeLayers.top) badgeTop.textContent = `👕 ${this.activeLayers.top.name}`;
    }
    if (badgeBottom) {
      badgeBottom.style.display = this.activeLayers.bottom ? 'inline-block' : 'none';
      if (this.activeLayers.bottom) badgeBottom.textContent = `👖 ${this.activeLayers.bottom.name}`;
    }

    // Canvas visual background based on avatar + outer / top selection
    if (canvasImg) {
      if (this.activeLayers.outerwear) {
        canvasImg.src = this.activeLayers.outerwear.images[0];
      } else if (this.activeLayers.top) {
        canvasImg.src = this.activeLayers.top.images[0];
      } else {
        canvasImg.src = this.avatars[this.activeAvatar].image;
      }
    }

    this.generateAISynergy();
  },

  generateAISynergy() {
    const aiText = document.getElementById('ai-synergy-text');
    const scoreElem = document.getElementById('ai-synergy-score-val');
    if (!aiText) return;

    const layersCount = Object.values(this.activeLayers).filter(Boolean).length;
    let score = 85 + (layersCount * 3);
    if (score > 99) score = 99;

    if (scoreElem) scoreElem.textContent = `${score}/100`;

    const insights = [
      `AI Synergy: ${score}/100 • Perfectly balanced drop-shoulder silhouette with heavy-density terry draping and tactical cargo contrast.`,
      `AI Synergy: ${score}/100 • Contemporary boxy proportions with tonal harmony. Optimal thermal breathability and comfort.`,
      `AI Synergy: ${score}/100 • High-energy pop-culture streetwear aesthetic. High contrast and clean sneaker alignment.`
    ];

    aiText.textContent = insights[Math.floor(Math.random() * insights.length)];
  },

  addEntireLookToCart() {
    let addedCount = 0;
    Object.values(this.activeLayers).forEach(item => {
      if (item) {
        App.addToCart(item.id, item.sizes[0], item.colors[0].name, false);
        addedCount++;
      }
    });

    if (addedCount === 0) {
      App.showToast('Please select at least one garment for your look!', 'info');
      return;
    }

    App.updateCartUI();
    App.openCartDrawer();
    App.showToast(`🎉 Added full ${addedCount}-piece look to your bag with instant discount!`, 'success');
  },

  randomizeLook() {
    const tops = PRODUCTS.filter(p => p.tryonType === 'top');
    const outer = PRODUCTS.filter(p => p.tryonType === 'outerwear');
    const bottoms = PRODUCTS.filter(p => p.tryonType === 'bottom');
    const shoes = PRODUCTS.filter(p => p.tryonType === 'shoes');

    this.activeLayers.top = tops[Math.floor(Math.random() * tops.length)];
    this.activeLayers.outerwear = outer[Math.floor(Math.random() * outer.length)];
    this.activeLayers.bottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    this.activeLayers.shoes = shoes[Math.floor(Math.random() * shoes.length)];

    this.renderSlotSelectors();
    this.updateStudioCanvas();
    App.showToast('🎲 AI generated a fresh curated streetwear look!', 'info');
  },

  bindEvents() {
    const addAllBtn = document.getElementById('tryon-add-all-btn');
    if (addAllBtn) {
      addAllBtn.onclick = () => this.addEntireLookToCart();
    }

    const randomizeBtn = document.getElementById('tryon-randomize-btn');
    if (randomizeBtn) {
      randomizeBtn.onclick = () => this.randomizeLook();
    }
  }
};

window.TryOnStudio = TryOnStudio;
