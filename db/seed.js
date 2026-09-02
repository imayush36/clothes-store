// Database Initial Seeder for The Souled Store (TSS) Catalog

function seedDatabase(db) {
  // Check if products already exist
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) {
      console.error('Error checking products count:', err);
      return;
    }

    if (row && row.count > 0) {
      console.log('Database already initialized with', row.count, 'products.');
      return;
    }

    console.log('🌱 Seeding initial products, categories, fandoms, and coupons into SQLite...');

    // 1. Seed Categories
    const categories = [
      { id: 'all', name: 'All Products', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80', tag: 'All' },
      { id: 'oversized', name: 'Oversized T-Shirts', image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=300&q=80', tag: 'Best Seller' },
      { id: 'hoodies', name: 'Hoodies & Sweatshirts', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=300&q=80', tag: 'Winter Edit' },
      { id: 'bottoms', name: 'Cargos & Parachute Pants', image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=300&q=80', tag: 'Trending' },
      { id: 'shirts', name: 'Resort & Cuban Shirts', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=300&q=80', tag: 'Fresh' },
      { id: 'jackets', name: 'Jackets & Bomber', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80', tag: 'Drop' },
      { id: 'polos', name: 'Knit Polos & Sweaters', image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=300&q=80', tag: 'Classics' },
      { id: 'footwear', name: 'Streetwear Sneakers', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=300&q=80', tag: 'New Kicks' }
    ];

    const insertCat = db.prepare('INSERT INTO categories (id, name, image, tag) VALUES (?, ?, ?, ?)');
    categories.forEach(c => insertCat.run(c.id, c.name, c.image, c.tag));
    insertCat.finalize();

    // 2. Seed Fandoms
    const fandoms = [
      { id: 'marvel', name: 'Marvel Avengers', tag: 'Official Merch', color: '#e23636' },
      { id: 'anime', name: 'Anime: Naruto & JJK', tag: 'Trending', color: '#ff6b35' },
      { id: 'dc', name: 'DC: Batman & Superman', tag: 'Official Merch', color: '#004e89' },
      { id: 'disney', name: 'Star Wars & Disney', tag: 'Classic', color: '#1a1c23' },
      { id: 'looney', name: 'Looney Tunes Retro', tag: 'Retro', color: '#f7b801' },
      { id: 'tss', name: 'TSS Originals', tag: 'Signature', color: '#e11b23' }
    ];

    const insertFandom = db.prepare('INSERT INTO fandoms (id, name, tag, color) VALUES (?, ?, ?, ?)');
    fandoms.forEach(f => insertFandom.run(f.id, f.name, f.tag, f.color));
    insertFandom.finalize();

    // 3. Seed Coupons
    const coupons = [
      { code: 'TSS200', discount_type: 'flat', discount_value: 200, min_order: 999, description: 'Flat ₹200 OFF on orders above ₹999' },
      { code: 'VIP20', discount_type: 'percent', discount_value: 0.20, min_order: 0, description: '20% OFF for VIP Club Members' },
      { code: 'AURA2026', discount_type: 'percent', discount_value: 0.15, min_order: 0, description: '15% Streetwear Drop Special' }
    ];

    const insertCoupon = db.prepare('INSERT INTO coupons (code, discount_type, discount_value, min_order, description) VALUES (?, ?, ?, ?, ?)');
    coupons.forEach(cp => insertCoupon.run(cp.code, cp.discount_type, cp.discount_value, cp.min_order, cp.description));
    insertCoupon.finalize();

    // 4. Seed Products
    const products = [
      {
        id: 'prod-01',
        name: 'Naruto: Itachi Uchiha Crow Oversized Tee',
        gender: 'men',
        category: 'oversized',
        fandom: 'anime',
        fandom_tag: 'Official Anime Merch',
        price: 1299,
        original_price: 1899,
        club_price: 999,
        rating: 4.9,
        review_count: 680,
        badge: 'BESTSELLER',
        fit_type: 'OVERSIZED FIT',
        fabric: '240 GSM 100% Combed Cotton',
        stock_status: 'In Stock (Only 4 left in L)',
        description: 'High-density screen printed Itachi Crow silhouette with Japanese kanji typography on heavy-duty 240 GSM bio-washed cotton. Drop shoulders and pre-shrunk construction.',
        colors: JSON.stringify([
          { name: 'Onyx Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80' },
          { name: 'Muted Crimson', hex: '#8a2323', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'top'
      },
      {
        id: 'prod-02',
        name: 'Solids: French Vanilla Heavyweight Tee',
        gender: 'men',
        category: 'oversized',
        fandom: 'tss',
        fandom_tag: 'TSS Originals',
        price: 1199,
        original_price: 1799,
        club_price: 899,
        rating: 4.8,
        review_count: 940,
        badge: 'MUST HAVE',
        fit_type: 'LOOSE OVERSIZED',
        fabric: '240 GSM Bio-Washed Combed Cotton',
        stock_status: 'In Stock',
        description: 'Crafted from ultra-soft 240 GSM combed cotton with thick ribbed neck collar that never loses structure. Minimalist aesthetic for everyday layered fits.',
        colors: JSON.stringify([
          { name: 'Vanilla Cream', hex: '#e8dfd1', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80' },
          { name: 'Sage Green', hex: '#7a8d7d', image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'top'
      },
      {
        id: 'prod-03',
        name: 'Batman: Gotham Knight Acid Wash Tee',
        gender: 'men',
        category: 'oversized',
        fandom: 'dc',
        fandom_tag: 'Official DC Comics',
        price: 1299,
        original_price: 1899,
        club_price: 999,
        rating: 4.9,
        review_count: 520,
        badge: 'TRENDING',
        fit_type: 'BOXY STREETWEAR',
        fabric: '100% Acid-Washed Cotton 240 GSM',
        stock_status: 'Selling Fast',
        description: 'Distressed vintage Batman graphic on vintage stone-washed fabric with dropped shoulders and relaxed sleeve length.',
        colors: JSON.stringify([
          { name: 'Acid Washed Charcoal', hex: '#2c2d30', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'top'
      },
      {
        id: 'prod-04',
        name: 'Marvel: Spider-Man Web Slinger Drop Tee',
        gender: 'men',
        category: 'oversized',
        fandom: 'marvel',
        fandom_tag: 'Official Marvel Merch',
        price: 1299,
        original_price: 1899,
        club_price: 999,
        rating: 5.0,
        review_count: 710,
        badge: 'HOT DROP',
        fit_type: 'OVERSIZED FIT',
        fabric: '240 GSM Combed Cotton',
        stock_status: 'In Stock',
        description: 'Vibrant comic art graphics on back with minimalist spider chest logo. Built for ultimate casual comfort with double needle stitching.',
        colors: JSON.stringify([
          { name: 'Vintage Red', hex: '#a61c1c', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80' },
          { name: 'Midnight Navy', hex: '#16223b', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'top'
      },
      {
        id: 'prod-05',
        name: 'Naruto: Akatsuki Cloud 420 GSM Hoodie',
        gender: 'men',
        category: 'hoodies',
        fandom: 'anime',
        fandom_tag: 'Official Anime Merch',
        price: 2499,
        original_price: 3499,
        club_price: 1999,
        rating: 4.9,
        review_count: 430,
        badge: 'BESTSELLER',
        fit_type: 'OVERSIZED FIT',
        fabric: '420 GSM Super-Heavy French Terry Cotton',
        stock_status: 'In Stock',
        description: 'The definitive Akatsuki Cloud winter hoodie. Embossed red cloud embroidery on heavyweight fleece-backed terry cotton with metallic aglets on drawstrings.',
        colors: JSON.stringify([
          { name: 'Jet Black', hex: '#0a0a0a', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'outerwear'
      },
      {
        id: 'prod-06',
        name: 'Star Wars: Galactic Empire Oversized Hoodie',
        gender: 'men',
        category: 'hoodies',
        fandom: 'disney',
        fandom_tag: 'Official Lucasfilm Merch',
        price: 2399,
        original_price: 3299,
        club_price: 1899,
        rating: 4.8,
        review_count: 290,
        badge: 'COLLECTOR DROP',
        fit_type: 'LOOSE HOODIE',
        fabric: '380 GSM Bio-Washed Fleece',
        stock_status: 'In Stock',
        description: 'Features high-density Imperial insignia chest print with sleeve galactic coordinates in reflective typography.',
        colors: JSON.stringify([
          { name: 'Heather Smoke', hex: '#4a4d52', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'outerwear'
      },
      {
        id: 'prod-07',
        name: 'Tactical 8-Pocket Relaxed Street Cargos',
        gender: 'men',
        category: 'bottoms',
        fandom: 'tss',
        fandom_tag: 'TSS Originals',
        price: 2199,
        original_price: 2999,
        club_price: 1699,
        rating: 4.9,
        review_count: 850,
        badge: 'TOP RATED',
        fit_type: 'RELAXED BAGGY',
        fabric: '100% Heavy Twill Cotton (No-Rip Weave)',
        stock_status: 'In Stock',
        description: 'Engineered with 8 utility cargo pockets, heavy YKK zippers, reinforced knee panels, and adjustable toggle hems to convert from baggy to tapered.',
        colors: JSON.stringify([
          { name: 'Military Olive', hex: '#4b5320', image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80' },
          { name: 'Stealth Black', hex: '#1c1c1e', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['28', '30', '32', '34', '36', '38']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'bottom'
      },
      {
        id: 'prod-08',
        name: 'Parachute Tech Baggy Joggers',
        gender: 'men',
        category: 'bottoms',
        fandom: 'tss',
        fandom_tag: 'TSS Originals',
        price: 1999,
        original_price: 2799,
        club_price: 1499,
        rating: 4.7,
        review_count: 310,
        badge: 'TRENDING',
        fit_type: 'BALLOON BAGGY',
        fabric: 'Lightweight Crinkle Nylon Blend with DWR',
        stock_status: 'In Stock',
        description: 'Ultra-lightweight Japanese crinkle nylon with elasticated bungee waist and ankle toggles. Effortless oversized street movement.',
        colors: JSON.stringify([
          { name: 'Ash Grey', hex: '#878c94', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'bottom'
      },
      {
        id: 'prod-09',
        name: 'Marvel: Deadpool Varsity Wool Bomber Jacket',
        gender: 'men',
        category: 'jackets',
        fandom: 'marvel',
        fandom_tag: 'Official Marvel Merch',
        price: 3499,
        original_price: 4999,
        club_price: 2799,
        rating: 5.0,
        review_count: 380,
        badge: 'LIMITED EDITION',
        fit_type: 'RELAXED BOMBER',
        fabric: 'Heavy Wool Blend Body with Vegan Leather Sleeves',
        stock_status: 'Low Stock (Only 2 Left)',
        description: 'Chenille Deadpool patch on chest, custom metal snap buttons, ribbed varsity striped cuffs, and diamond-quilted satin lining for all-weather warmth.',
        colors: JSON.stringify([
          { name: 'Crimson & Obsidian', hex: '#800000', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'outerwear'
      },
      {
        id: 'prod-10',
        name: 'Corduroy Overshirt Jacket: Desert Sand',
        gender: 'men',
        category: 'jackets',
        fandom: 'tss',
        fandom_tag: 'TSS Originals',
        price: 2299,
        original_price: 3199,
        club_price: 1799,
        rating: 4.8,
        review_count: 220,
        badge: 'NEW ARRIVAL',
        fit_type: 'BOX OVERSIZED',
        fabric: '100% 8-Wale Cotton Corduroy',
        stock_status: 'In Stock',
        description: 'Chunky 8-wale textured corduroy with dual chest flap pockets and tortoise-shell buttons. Can be styled open over white tees or buttoned up.',
        colors: JSON.stringify([
          { name: 'Desert Sand', hex: '#c2b280', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'outerwear'
      },
      {
        id: 'prod-11',
        name: 'Looney Tunes: Retro Nostalgia Cuban Shirt',
        gender: 'men',
        category: 'shirts',
        fandom: 'looney',
        fandom_tag: 'Official Warner Bros.',
        price: 1599,
        original_price: 2299,
        club_price: 1299,
        rating: 4.7,
        review_count: 190,
        badge: 'SUMMER DROP',
        fit_type: 'RELAXED CAMP COLLAR',
        fabric: '100% Breathable Rayon Viscose',
        stock_status: 'In Stock',
        description: 'Camp collar resort silhouette featuring all-over vintage Bugs Bunny and Daffy Duck illustrations. Silky soft and breathable for summer.',
        colors: JSON.stringify([
          { name: 'Vintage Ochre', hex: '#d4af37', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'top'
      },
      {
        id: 'prod-12',
        name: 'AURA 2026 Chunky Street Sneaker: Ghost White',
        gender: 'men',
        category: 'footwear',
        fandom: 'tss',
        fandom_tag: 'TSS Kicks',
        price: 2999,
        original_price: 4499,
        club_price: 2399,
        rating: 4.9,
        review_count: 620,
        badge: 'FLAGSHIP KICKS',
        fit_type: 'TRUE TO SIZE',
        fabric: 'Vegan Microfiber Leather & EVA Cloud Cushioning',
        stock_status: 'In Stock',
        description: 'Engineered high-abrasion rubber outsole with multi-layered architectural upper and responsive bounce insole for all-day streetwear comfort.',
        colors: JSON.stringify([
          { name: 'Ghost White & Crimson', hex: '#f0f0f0', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80' },
          { name: 'Stealth Blackout', hex: '#111111', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'shoes'
      },
      {
        id: 'prod-13',
        name: 'Retro High-Top Suede Kicks: Forest & Cream',
        gender: 'men',
        category: 'footwear',
        fandom: 'tss',
        fandom_tag: 'TSS Kicks',
        price: 3299,
        original_price: 4799,
        club_price: 2599,
        rating: 4.8,
        review_count: 340,
        badge: 'TRENDING',
        fit_type: 'HIGH TOP',
        fabric: 'Premium Genuine Suede & Breathable Canvas',
        stock_status: 'In Stock',
        description: 'Heritage basketball inspired silhouette with padded ankle collar, reinforced toe cap, and vintage off-white vulcanized rubber sole.',
        colors: JSON.stringify([
          { name: 'Forest Green & Cream', hex: '#2d4f3b', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['UK 7', 'UK 8', 'UK 9', 'UK 10']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'shoes'
      },
      {
        id: 'prod-14',
        name: 'Jujutsu Kaisen: Gojo Satoru Oversized Crop Tee',
        gender: 'women',
        category: 'oversized',
        fandom: 'anime',
        fandom_tag: 'Official Anime Merch',
        price: 1199,
        original_price: 1699,
        club_price: 899,
        rating: 4.9,
        review_count: 510,
        badge: 'BESTSELLER',
        fit_type: 'CROPPED OVERSIZED',
        fabric: '220 GSM 100% Bio-Washed Cotton',
        stock_status: 'In Stock',
        description: 'Signature Gojo Domain Expansion graphic on boxy drop-shoulder cropped tee with ribbed neckline.',
        colors: JSON.stringify([
          { name: 'Sky Lavender', hex: '#b3a0cc', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80' },
          { name: 'Pitch Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'top'
      },
      {
        id: 'prod-15',
        name: 'Marvel: Scarlet Witch Heavyweight Fleece Hoodie',
        gender: 'women',
        category: 'hoodies',
        fandom: 'marvel',
        fandom_tag: 'Official Marvel Merch',
        price: 2299,
        original_price: 3199,
        club_price: 1799,
        rating: 4.9,
        review_count: 420,
        badge: 'HOT DROP',
        fit_type: 'RELAXED BAGGY',
        fabric: '380 GSM Cotton Fleece',
        stock_status: 'In Stock',
        description: 'Deep crimson hue with high-density Wanda tiara logo on front and spell circle graphic on back.',
        colors: JSON.stringify([
          { name: 'Scarlet Crimson', hex: '#900c3f', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'outerwear'
      },
      {
        id: 'prod-16',
        name: 'Wide-Leg Utility Cargo Pants: Sage Dust',
        gender: 'women',
        category: 'bottoms',
        fandom: 'tss',
        fandom_tag: 'TSS Originals',
        price: 2099,
        original_price: 2899,
        club_price: 1599,
        rating: 4.8,
        review_count: 390,
        badge: 'TRENDING',
        fit_type: 'WIDE LEG CARGO',
        fabric: '100% Lightweight Cotton Twill',
        stock_status: 'In Stock',
        description: 'High-waisted relaxed silhouette with utility cargo pockets, drawstring tie-up waist, and hem adjusters.',
        colors: JSON.stringify([
          { name: 'Sage Dust', hex: '#8b9e8b', image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80' }
        ]),
        sizes: JSON.stringify(['26', '28', '30', '32', '34']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80'
        ]),
        tryon_type: 'bottom'
      }
    ];

    const insertProd = db.prepare(`
      INSERT INTO products (
        id, name, gender, category, fandom, fandom_tag, price, original_price,
        club_price, rating, review_count, badge, fit_type, fabric, stock_status,
        description, colors, sizes, images, tryon_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    products.forEach(p => {
      insertProd.run(
        p.id, p.name, p.gender, p.category, p.fandom, p.fandom_tag, p.price,
        p.original_price, p.club_price, p.rating, p.review_count, p.badge,
        p.fit_type, p.fabric, p.stock_status, p.description, p.colors,
        p.sizes, p.images, p.tryon_type
      );
    });
    insertProd.finalize();

    // 5. Seed Reviews
    const reviews = [
      { product_id: 'prod-01', user_name: 'Rohan V.', rating: 5, comment: 'Quality is unmatched! Heavyweight 240 GSM cotton feels super premium and fits boxy just like TSS.' },
      { product_id: 'prod-01', user_name: 'Siddharth M.', rating: 5, comment: 'The Itachi graphic is crisp. Survived 3 washes with zero peeling!' },
      { product_id: 'prod-02', user_name: 'Aditya K.', rating: 5, comment: 'Subtle shade, thick collar that holds shape, definitely getting another color.' },
      { product_id: 'prod-05', user_name: 'Prateek G.', rating: 5, comment: 'Warm, thick, and looks killer. The embroidery detail is top-tier.' },
      { product_id: 'prod-07', user_name: 'Aryan B.', rating: 5, comment: 'Best cargos in India right now. The fabric is thick and pockets are deep.' }
    ];

    const insertReview = db.prepare('INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)');
    reviews.forEach(r => insertReview.run(r.product_id, r.user_name, r.rating, r.comment));
    insertReview.finalize();

    console.log('✅ SQLite database seeding completed successfully!');
  });
}

module.exports = seedDatabase;
