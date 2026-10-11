import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredStories } from '../data/products';

export default function TrendingCarousel({ onSelectStoryCategory }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-[1920px] mx-auto px-6 lg:px-12 py-12">
      {/* Header with Title and Scroll Controls */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-[#111111]">
          Featured & Trending
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-10 h-10 rounded-full glass-ios-pill hover:bg-white flex items-center justify-center transition-all text-black active:scale-95 shadow-xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-10 h-10 rounded-full glass-ios-pill hover:bg-white flex items-center justify-center transition-all text-black active:scale-95 shadow-xs"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stories Scrollable Filmstrip */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-5 overflow-x-auto no-scrollbar scroll-smooth pb-4"
      >
        {featuredStories.map((story) => (
          <div
            key={story.id}
            onClick={() => onSelectStoryCategory(story.category)}
            className="flex-shrink-0 w-[300px] sm:w-[420px] lg:w-[460px] group cursor-pointer"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-ios-card p-1.5 mb-4 group-hover:shadow-xl transition-all duration-500">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 glass-ios-dark text-white text-[11px] font-black tracking-wider uppercase rounded-full shadow-md">
                  {story.tag}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-black group-hover:text-gray-600 transition-colors">
                {story.title}
              </h3>
              <p className="text-sm text-[#707072] font-medium mt-1">
                {story.subtitle}
              </p>
              <span className="inline-block mt-3 text-xs font-bold text-black border-b border-black pb-0.5 group-hover:border-gray-500">
                Shop Now
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
