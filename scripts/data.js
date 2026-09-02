// The Souled Store (TSS) - Comprehensive 2026 Catalog & Fandom Collections

const CURRENCIES = {
  INR: { symbol: '₹', rate: 1, name: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, name: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.011, name: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.0095, name: 'GBP (£)' }
};

const CATEGORIES = [
  { id: 'all', name: 'All Products', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80', tag: 'All' },
  { id: 'oversized', name: 'Oversized T-Shirts', image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=300&q=80', tag: 'Best Seller' },
  { id: 'hoodies', name: 'Hoodies & Sweatshirts', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=300&q=80', tag: 'Winter Edit' },
  { id: 'bottoms', name: 'Cargos & Parachute Pants', image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=300&q=80', tag: 'Trending' },
  { id: 'shirts', name: 'Resort & Cuban Shirts', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=300&q=80', tag: 'Fresh' },
  { id: 'jackets', name: 'Jackets & Bomber', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80', tag: 'Drop' },
  { id: 'polos', name: 'Knit Polos & Sweaters', image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=300&q=80', tag: 'Classics' },
  { id: 'footwear', name: 'Streetwear Sneakers', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=300&q=80', tag: 'New Kicks' }
];

const FANDOMS = [
  { id: 'marvel', name: 'Marvel Avengers', tag: 'Official Merch', color: '#e23636' },
  { id: 'anime', name: 'Anime: Naruto & JJK', tag: 'Trending', color: '#ff6b35' },
  { id: 'dc', name: 'DC: Batman & Superman', tag: 'Official Merch', color: '#004e89' },
  { id: 'disney', name: 'Star Wars & Disney', tag: 'Classic', color: '#1a1c23' },
  { id: 'looney', name: 'Looney Tunes Retro', tag: 'Retro', color: '#f7b801' },
  { id: 'tss', name: 'TSS Originals', tag: 'Signature', color: '#e11b23' }
];

const PRODUCTS = [
  // --- 1. OVERSIZED T-SHIRTS & GRAPHICS (MEN) ---
  {
    id: 'prod-01',
    name: 'Naruto: Itachi Uchiha Crow Oversized Tee',
    gender: 'men',
    category: 'oversized',
    fandom: 'anime',
    fandomTag: 'Official Anime Merch',
    price: 1299,
    originalPrice: 1899,
    clubPrice: 999,
    rating: 4.9,
    reviewCount: 680,
    badge: 'BESTSELLER',
    fitType: 'OVERSIZED FIT',
    fabric: '240 GSM 100% Combed Cotton',
    stockStatus: 'In Stock (Only 4 left in L)',
    description: 'High-density screen printed Itachi Crow silhouette with Japanese kanji typography on heavy-duty 240 GSM bio-washed cotton. Drop shoulders and pre-shrunk construction.',
    colors: [
      { name: 'Onyx Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80' },
      { name: 'Muted Crimson', hex: '#8a2323', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'top',
    reviews: [
      { user: 'Rohan V.', rating: 5, date: '2 days ago', comment: 'Quality is unmatched! Heavyweight 240 GSM cotton feels super premium and fits boxy just like TSS.' },
      { user: 'Siddharth M.', rating: 5, date: '1 week ago', comment: 'The Itachi graphic is crisp. Survived 3 washes with zero peeling!' }
    ]
  },
  {
    id: 'prod-02',
    name: 'Solids: French Vanilla Heavyweight Tee',
    gender: 'men',
    category: 'oversized',
    fandom: 'tss',
    fandomTag: 'TSS Originals',
    price: 1199,
    originalPrice: 1799,
    clubPrice: 899,
    rating: 4.8,
    reviewCount: 940,
    badge: 'MUST HAVE',
    fitType: 'LOOSE OVERSIZED',
    fabric: '240 GSM Bio-Washed Combed Cotton',
    stockStatus: 'In Stock',
    description: 'Crafted from ultra-soft 240 GSM combed cotton with thick ribbed neck collar that never loses structure. Minimalist aesthetic for everyday layered fits.',
    colors: [
      { name: 'Vanilla Cream', hex: '#e8dfd1', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80' },
      { name: 'Sage Green', hex: '#7a8d7d', image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'top',
    reviews: [
      { user: 'Aditya K.', rating: 5, date: '3 days ago', comment: 'Subtle shade, thick collar that holds shape, definitely getting another color.' }
    ]
  },
  {
    id: 'prod-03',
    name: 'Batman: Gotham Knight Acid Wash Tee',
    gender: 'men',
    category: 'oversized',
    fandom: 'dc',
    fandomTag: 'Official DC Comics',
    price: 1299,
    originalPrice: 1899,
    clubPrice: 999,
    rating: 4.9,
    reviewCount: 520,
    badge: 'TRENDING',
    fitType: 'BOXY STREETWEAR',
    fabric: '100% Acid-Washed Cotton 240 GSM',
    stockStatus: 'Selling Fast',
    description: 'Distressed vintage Batman graphic on vintage stone-washed fabric with dropped shoulders and relaxed sleeve length.',
    colors: [
      { name: 'Acid Washed Charcoal', hex: '#2c2d30', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'top',
    reviews: [
      { user: 'Vikram S.', rating: 5, date: 'Yesterday', comment: 'The acid wash finish looks genuinely retro. 10/10 streetwear piece!' }
    ]
  },
  {
    id: 'prod-04',
    name: 'Marvel: Spider-Man Web Slinger Drop Tee',
    gender: 'men',
    category: 'oversized',
    fandom: 'marvel',
    fandomTag: 'Official Marvel Merch',
    price: 1299,
    originalPrice: 1899,
    clubPrice: 999,
    rating: 5.0,
    reviewCount: 710,
    badge: 'HOT DROP',
    fitType: 'OVERSIZED FIT',
    fabric: '240 GSM Combed Cotton',
    stockStatus: 'In Stock',
    description: 'Vibrant comic art graphics on back with minimalist spider chest logo. Built for ultimate casual comfort with double needle stitching.',
    colors: [
      { name: 'Vintage Red', hex: '#a61c1c', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80' },
      { name: 'Midnight Navy', hex: '#16223b', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'top',
    reviews: [
      { user: 'Karan P.', rating: 5, date: '4 days ago', comment: 'Must buy for Spider-Man fans. Fits baggy exactly as shown in photos.' }
    ]
  },

  // --- 2. HOODIES & SWEATSHIRTS ---
  {
    id: 'prod-05',
    name: 'Naruto: Akatsuki Cloud 420 GSM Hoodie',
    gender: 'men',
    category: 'hoodies',
    fandom: 'anime',
    fandomTag: 'Official Anime Merch',
    price: 2499,
    originalPrice: 3499,
    clubPrice: 1999,
    rating: 4.9,
    reviewCount: 430,
    badge: 'BESTSELLER',
    fitType: 'OVERSIZED FIT',
    fabric: '420 GSM Super-Heavy French Terry Cotton',
    stockStatus: 'In Stock',
    description: 'The definitive Akatsuki Cloud winter hoodie. Embossed red cloud embroidery on heavyweight fleece-backed terry cotton with metallic aglets on drawstrings.',
    colors: [
      { name: 'Jet Black', hex: '#0a0a0a', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'outerwear',
    reviews: [
      { user: 'Prateek G.', rating: 5, date: '5 days ago', comment: 'Warm, thick, and looks killer. The embroidery detail is top-tier.' }
    ]
  },
  {
    id: 'prod-06',
    name: 'Star Wars: Galactic Empire Oversized Hoodie',
    gender: 'men',
    category: 'hoodies',
    fandom: 'disney',
    fandomTag: 'Official Lucasfilm Merch',
    price: 2399,
    originalPrice: 3299,
    clubPrice: 1899,
    rating: 4.8,
    reviewCount: 290,
    badge: 'COLLECTOR DROP',
    fitType: 'LOOSE HOODIE',
    fabric: '380 GSM Bio-Washed Fleece',
    stockStatus: 'In Stock',
    description: 'Features high-density Imperial insignia chest print with sleeve galactic coordinates in reflective typography.',
    colors: [
      { name: 'Heather Smoke', hex: '#4a4d52', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'outerwear',
    reviews: [
      { user: 'Nikhil R.', rating: 5, date: '1 week ago', comment: 'Super comfy for winter evenings. Reflective text looks sick at night!' }
    ]
  },

  // --- 3. CARGOS & BOTTOMS ---
  {
    id: 'prod-07',
    name: 'Tactical 8-Pocket Relaxed Street Cargos',
    gender: 'men',
    category: 'bottoms',
    fandom: 'tss',
    fandomTag: 'TSS Originals',
    price: 2199,
    originalPrice: 2999,
    clubPrice: 1699,
    rating: 4.9,
    reviewCount: 850,
    badge: 'TOP RATED',
    fitType: 'RELAXED BAGGY',
    fabric: '100% Heavy Twill Cotton (No-Rip Weave)',
    stockStatus: 'In Stock',
    description: 'Engineered with 8 utility cargo pockets, heavy YKK zippers, reinforced knee panels, and adjustable toggle hems to convert from baggy to tapered.',
    colors: [
      { name: 'Military Olive', hex: '#4b5320', image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80' },
      { name: 'Stealth Black', hex: '#1c1c1e', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'bottom',
    reviews: [
      { user: 'Aryan B.', rating: 5, date: '2 days ago', comment: 'Best cargos in India right now. The fabric is thick and pockets are deep.' }
    ]
  },
  {
    id: 'prod-08',
    name: 'Parachute Tech Baggy Joggers',
    gender: 'men',
    category: 'bottoms',
    fandom: 'tss',
    fandomTag: 'TSS Originals',
    price: 1999,
    originalPrice: 2799,
    clubPrice: 1499,
    rating: 4.7,
    reviewCount: 310,
    badge: 'TRENDING',
    fitType: 'BALLOON BAGGY',
    fabric: 'Lightweight Crinkle Nylon Blend with DWR',
    stockStatus: 'In Stock',
    description: 'Ultra-lightweight Japanese crinkle nylon with elasticated bungee waist and ankle toggles. Effortless oversized street movement.',
    colors: [
      { name: 'Ash Grey', hex: '#878c94', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'bottom',
    reviews: [
      { user: 'Deepak S.', rating: 4.5, date: '3 days ago', comment: 'Great for casual outings and airport fits. Super breathable.' }
    ]
  },

  // --- 4. JACKETS & OUTERWEAR ---
  {
    id: 'prod-09',
    name: 'Marvel: Deadpool Varsity Wool Bomber Jacket',
    gender: 'men',
    category: 'jackets',
    fandom: 'marvel',
    fandomTag: 'Official Marvel Merch',
    price: 3499,
    originalPrice: 4999,
    clubPrice: 2799,
    rating: 5.0,
    reviewCount: 380,
    badge: 'LIMITED EDITION',
    fitType: 'RELAXED BOMBER',
    fabric: 'Heavy Wool Blend Body with Vegan Leather Sleeves',
    stockStatus: 'Low Stock (Only 2 Left)',
    description: 'Chenille Deadpool patch on chest, custom metal snap buttons, ribbed varsity striped cuffs, and diamond-quilted satin lining for all-weather warmth.',
    colors: [
      { name: 'Crimson & Obsidian', hex: '#800000', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'outerwear',
    reviews: [
      { user: 'Varun T.', rating: 5, date: 'Yesterday', comment: 'Hands down the best jacket TSS has ever dropped! Heavyweight and feels expensive.' }
    ]
  },
  {
    id: 'prod-10',
    name: 'Corduroy Overshirt Jacket: Desert Sand',
    gender: 'men',
    category: 'jackets',
    fandom: 'tss',
    fandomTag: 'TSS Originals',
    price: 2299,
    originalPrice: 3199,
    clubPrice: 1799,
    rating: 4.8,
    reviewCount: 220,
    badge: 'NEW ARRIVAL',
    fitType: 'BOX OVERSIZED',
    fabric: '100% 8-Wale Cotton Corduroy',
    stockStatus: 'In Stock',
    description: 'Chunky 8-wale textured corduroy with dual chest flap pockets and tortoise-shell buttons. Can be styled open over white tees or buttoned up.',
    colors: [
      { name: 'Desert Sand', hex: '#c2b280', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'outerwear',
    reviews: [
      { user: 'Sanjay M.', rating: 5, date: '1 week ago', comment: 'Quality corduroy with great drape. Looks very aesthetic on beige pants.' }
    ]
  },

  // --- 5. CASUAL & RESORT SHIRTS ---
  {
    id: 'prod-11',
    name: 'Looney Tunes: Retro Nostalgia Cuban Shirt',
    gender: 'men',
    category: 'shirts',
    fandom: 'looney',
    fandomTag: 'Official Warner Bros.',
    price: 1599,
    originalPrice: 2299,
    clubPrice: 1299,
    rating: 4.7,
    reviewCount: 190,
    badge: 'SUMMER DROP',
    fitType: 'RELAXED CAMP COLLAR',
    fabric: '100% Breathable Rayon Viscose',
    stockStatus: 'In Stock',
    description: 'Camp collar resort silhouette featuring all-over vintage Bugs Bunny and Daffy Duck illustrations. Silky soft and breathable for summer.',
    colors: [
      { name: 'Vintage Ochre', hex: '#d4af37', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'top',
    reviews: [
      { user: 'Rahul D.', rating: 5, date: '4 days ago', comment: 'Got lots of compliments at a beach party. Light and vibrant!' }
    ]
  },

  // --- 6. SNEAKERS & FOOTWEAR ---
  {
    id: 'prod-12',
    name: 'AURA 2026 Chunky Street Sneaker: Ghost White',
    gender: 'men',
    category: 'footwear',
    fandom: 'tss',
    fandomTag: 'TSS Kicks',
    price: 2999,
    originalPrice: 4499,
    clubPrice: 2399,
    rating: 4.9,
    reviewCount: 620,
    badge: 'FLAGSHIP KICKS',
    fitType: 'TRUE TO SIZE',
    fabric: 'Vegan Microfiber Leather & EVA Cloud Cushioning',
    stockStatus: 'In Stock',
    description: 'Engineered high-abrasion rubber outsole with multi-layered architectural upper and responsive bounce insole for all-day streetwear comfort.',
    colors: [
      { name: 'Ghost White & Crimson', hex: '#f0f0f0', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80' },
      { name: 'Stealth Blackout', hex: '#111111', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'shoes',
    reviews: [
      { user: 'Harsh J.', rating: 5, date: '3 days ago', comment: 'Insanely comfortable sole. Goes with every oversized TSS outfit!' }
    ]
  },
  {
    id: 'prod-13',
    name: 'Retro High-Top Suede Kicks: Forest & Cream',
    gender: 'men',
    category: 'footwear',
    fandom: 'tss',
    fandomTag: 'TSS Kicks',
    price: 3299,
    originalPrice: 4799,
    clubPrice: 2599,
    rating: 4.8,
    reviewCount: 340,
    badge: 'TRENDING',
    fitType: 'HIGH TOP',
    fabric: 'Premium Genuine Suede & Breathable Canvas',
    stockStatus: 'In Stock',
    description: 'Heritage basketball inspired silhouette with padded ankle collar, reinforced toe cap, and vintage off-white vulcanized rubber sole.',
    colors: [
      { name: 'Forest Green & Cream', hex: '#2d4f3b', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'shoes',
    reviews: [
      { user: 'Ankit N.', rating: 5, date: '1 week ago', comment: 'The suede texture is soft and high quality. Premium shoe box too!' }
    ]
  },

  // --- 7. WOMEN'S COLLECTION ITEMS (For Women tab) ---
  {
    id: 'prod-14',
    name: 'Jujutsu Kaisen: Gojo Satoru Oversized Crop Tee',
    gender: 'women',
    category: 'oversized',
    fandom: 'anime',
    fandomTag: 'Official Anime Merch',
    price: 1199,
    originalPrice: 1699,
    clubPrice: 899,
    rating: 4.9,
    reviewCount: 510,
    badge: 'BESTSELLER',
    fitType: 'CROPPED OVERSIZED',
    fabric: '220 GSM 100% Bio-Washed Cotton',
    stockStatus: 'In Stock',
    description: 'Signature Gojo Domain Expansion graphic on boxy drop-shoulder cropped tee with ribbed neckline.',
    colors: [
      { name: 'Sky Lavender', hex: '#b3a0cc', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80' },
      { name: 'Pitch Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'top',
    reviews: [
      { user: 'Simran K.', rating: 5, date: '2 days ago', comment: 'Fit is aesthetic and fabric is thick! Gojo graphic is top notch.' }
    ]
  },
  {
    id: 'prod-15',
    name: 'Marvel: Scarlet Witch Heavyweight Fleece Hoodie',
    gender: 'women',
    category: 'hoodies',
    fandom: 'marvel',
    fandomTag: 'Official Marvel Merch',
    price: 2299,
    originalPrice: 3199,
    clubPrice: 1799,
    rating: 4.9,
    reviewCount: 420,
    badge: 'HOT DROP',
    fitType: 'RELAXED BAGGY',
    fabric: '380 GSM Cotton Fleece',
    stockStatus: 'In Stock',
    description: 'Deep crimson hue with high-density Wanda tiara logo on front and spell circle graphic on back.',
    colors: [
      { name: 'Scarlet Crimson', hex: '#900c3f', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'outerwear',
    reviews: [
      { user: 'Tanya P.', rating: 5, date: '5 days ago', comment: 'Super soft inside and very warm. Perfect oversized slouch.' }
    ]
  },
  {
    id: 'prod-16',
    name: 'Wide-Leg Utility Cargo Pants: Sage Dust',
    gender: 'women',
    category: 'bottoms',
    fandom: 'tss',
    fandomTag: 'TSS Originals',
    price: 2099,
    originalPrice: 2899,
    clubPrice: 1599,
    rating: 4.8,
    reviewCount: 390,
    badge: 'TRENDING',
    fitType: 'WIDE LEG CARGO',
    fabric: '100% Lightweight Cotton Twill',
    stockStatus: 'In Stock',
    description: 'High-waisted relaxed silhouette with utility cargo pockets, drawstring tie-up waist, and hem adjusters.',
    colors: [
      { name: 'Sage Dust', hex: '#8b9e8b', image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80' }
    ],
    sizes: ['26', '28', '30', '32', '34'],
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80'
    ],
    tryonType: 'bottom',
    reviews: [
      { user: 'Megha S.', rating: 5, date: '3 days ago', comment: 'Most comfortable cargos ever. Pockets are actual functional pockets!' }
    ]
  }
];
