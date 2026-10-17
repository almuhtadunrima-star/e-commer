import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle, X } from 'lucide-react';
import { products } from '../data/products';

export default function SocialProofToast({ onSelectProduct }) {
  const [visible, setVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  const buyers = [
    { name: "Dimas", city: "Jakarta Selatan", time: "2 menit lalu" },
    { name: "Sarah", city: "Bandung", time: "4 menit lalu" },
    { name: "Fauzan", city: "Surabaya", time: "7 menit lalu" },
    { name: "Amanda", city: "Yogyakarta", time: "11 menit lalu" },
    { name: "Rizky", city: "Medan", time: "14 menit lalu" },
    { name: "Nadia", city: "Tangerang", time: "18 menit lalu" }
  ];

  useEffect(() => {
    if (dismissed) return;

    // Show first toast after 6 seconds
    const initialTimer = setTimeout(() => {
      triggerNewEvent();
    }, 6000);

    // Rotate every 24 seconds
    const interval = setInterval(() => {
      if (!dismissed) {
        triggerNewEvent();
      }
    }, 24000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  const triggerNewEvent = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
    
    setCurrentEvent({
      product: randomProduct,
      buyer: randomBuyer
    });
    setVisible(true);

    // Auto hide after 7 seconds
    setTimeout(() => {
      setVisible(false);
    }, 7000);
  };

  if (!visible || !currentEvent || dismissed) return null;

  const { product, buyer } = currentEvent;
  const image = product.colors?.[0]?.image || '/hoodies/moveo-modest-long.png';

  return (
    <aside 
      aria-label="Notifikasi Aktivitas Pembelian"
      className="fixed bottom-5 left-4 sm:left-6 z-40 max-w-[340px] sm:max-w-[380px] select-none animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div 
        onClick={() => {
          if (onSelectProduct) {
            onSelectProduct(product);
          }
        }}
        className="glass-ios border border-white/95 rounded-2xl p-3 shadow-2xl hover:shadow-2xl transition-all cursor-pointer flex items-center space-x-3 text-left relative group backdrop-blur-2xl bg-white/95"
      >
        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
            setDismissed(true);
          }}
          aria-label="Tutup notifikasi"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Thumbnail */}
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-slate-100/90 p-1 flex-shrink-0 flex items-center justify-center border border-slate-200 shadow-xs overflow-hidden">
          <img 
            src={image} 
            alt={product.name}
            className="w-full h-full object-contain" 
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-800">
            <span className="text-slate-900 font-extrabold">{buyer.name}</span>
            <span className="text-slate-500 font-normal">di {buyer.city}</span>
            <CheckCircle className="w-3 h-3 text-emerald-600 inline ml-0.5" />
          </div>
          <p className="text-xs font-black text-slate-950 truncate mt-0.5">
            Baru saja checkout {product.name}
          </p>
          <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-500 font-medium">
            <span className="flex items-center text-emerald-700 font-bold">
              <ShoppingBag className="w-3 h-3 mr-1" />
              Verified Order
            </span>
            <span>•</span>
            <span>{buyer.time}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
