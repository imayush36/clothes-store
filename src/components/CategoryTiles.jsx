'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { CATEGORIES } from '@/lib/seedData';

export default function CategoryTiles() {
  const { setActiveCategory } = useStore();

  const handleSelect = (catId) => {
    setActiveCategory(catId);
    const catalogElem = document.getElementById('catalog-section');
    if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="category-tiles-section">
      <div className="container">
        <div className="section-headline-tss">
          <h3>CATEGORIES TO EXPLORE</h3>
        </div>
        <div className="cat-tiles-grid">
          {CATEGORIES.slice(1).map((cat) => (
            <div key={cat.id} className="cat-tile-card" onClick={() => handleSelect(cat.id)}>
              <img src={cat.image} className="cat-tile-img" alt={cat.name} loading="lazy" />
              <div className="cat-tile-name">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
