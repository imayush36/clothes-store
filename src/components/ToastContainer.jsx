'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

export default function ToastContainer() {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type || 'info'}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
