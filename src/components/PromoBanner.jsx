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
    <div className="bg-white/50 backdrop-blur-xl text-[#111111] py-2 px-4 text-center border-b border-white/50 relative flex items-center justify-center select-none shadow-sm">
      <button 
        onClick={handlePrev}
        aria-label="Previous announcement"
        className="absolute left-4 lg:left-8 p-1 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-200"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="overflow-hidden max-w-xl mx-auto">
        <p className="text-xs sm:text-sm font-semibold tracking-tight transition-all duration-300">
          {promoAnnouncements[currentIndex]}
        </p>
      </div>

      <button 
        onClick={handleNext}
        aria-label="Next announcement"
        className="absolute right-4 lg:right-8 p-1 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-200"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
