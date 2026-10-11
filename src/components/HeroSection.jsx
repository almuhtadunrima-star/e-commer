import React, { useState } from 'react';
import { heroCampaigns } from '../data/products';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSection({ onShopCategory }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const campaign = heroCampaigns[activeSlide];

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + heroCampaigns.length) % heroCampaigns.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % heroCampaigns.length);
  };

  return (
    <section className="relative w-full max-w-full overflow-hidden bg-black text-white">
      {/* Hero Image Container */}
      <div className="relative w-full h-[55vh] sm:h-[75vh] lg:h-[85vh] max-h-[920px]">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover object-[center_25%] transition-all duration-700 ease-in-out scale-100"
        />

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Top-Right Athlete Credit Tag */}
        {campaign.athlete && (
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 lg:right-12 z-20">
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 glass-ios-pill rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide text-white border border-white/40 shadow-sm">
              {campaign.athlete}
            </span>
          </div>
        )}

        {/* Carousel Navigation Arrows */}
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 lg:right-12 z-20 flex space-x-2 sm:space-x-2.5">
          <button
            onClick={handlePrev}
            aria-label="Previous hero campaign"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full glass-ios-pill text-white hover:bg-white hover:text-black flex items-center justify-center transition-all border border-white/50 active:scale-95 shadow-lg"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next hero campaign"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full glass-ios-pill text-white hover:bg-white hover:text-black flex items-center justify-center transition-all border border-white/50 active:scale-95 shadow-lg"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-12 lg:p-16 z-10 max-w-5xl">
          <p className="text-xs sm:text-sm font-bold tracking-widest uppercase mb-1.5 sm:mb-2 text-white/80">
            {campaign.category}
          </p>
          <h1 className="text-3xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-nike-bold tracking-tight uppercase mb-3 sm:mb-4 leading-none text-white drop-shadow-md break-words">
            {campaign.title}
          </h1>
          <p className="text-xs sm:text-base lg:text-lg text-white/90 font-medium max-w-2xl mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-none">
            {campaign.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => onShopCategory(campaign.filterTarget)}
              className="px-5 sm:px-7 py-2.5 sm:py-3.5 bg-white text-black hover:bg-white/90 rounded-full font-black text-xs sm:text-sm tracking-tight transition-all active:scale-95 shadow-xl"
            >
              {campaign.ctaPrimary}
            </button>
            <button
              onClick={() => onShopCategory(campaign.filterTarget)}
              className="px-5 sm:px-7 py-2.5 sm:py-3.5 glass-ios-pill hover:bg-white/30 text-white rounded-full font-black text-xs sm:text-sm tracking-tight transition-all active:scale-95 border border-white/40 shadow-lg"
            >
              {campaign.ctaSecondary}
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center py-2 bg-black gap-1.5">
        {heroCampaigns.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`h-1.5 rounded-full transition-all ${
              activeSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
