import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { promoAnnouncements } from '../data/products';

export default function PromoBanner({ onCategorySelect }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoAnnouncements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + promoAnnouncements.length) % promoAnnouncements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promoAnnouncements.length);
  };

  return (
    <div className="bg-[#dae1ec]/85 backdrop-blur-xl text-slate-900 py-2 sm:py-2.5 px-8 sm:px-12 text-center border-b border-slate-300/70 relative flex items-center justify-center select-none shadow-xs w-full max-w-full overflow-hidden">
      <button 
        onClick={handlePrev}
        aria-label="Previous announcement"
        className="absolute left-2 sm:left-4 lg:left-8 p-1 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-200"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="overflow-hidden max-w-xl mx-auto px-2">
        <p className="text-[11px] sm:text-sm font-semibold tracking-tight transition-all duration-300 truncate">
          {promoAnnouncements[currentIndex]}
        </p>
      </div>

      <button 
        onClick={handleNext}
        aria-label="Next announcement"
        className="absolute right-2 sm:right-4 lg:right-8 p-1 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-200"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
