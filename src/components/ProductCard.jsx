import React, { useState } from 'react';
import { Heart, Plus, Check } from 'lucide-react';

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onQuickAdd
}) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const currentColor = product.colors[selectedColorIndex] || product.colors[0];

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    onQuickAdd({
      ...product,
      selectedColor: currentColor.name,
      selectedSize: product.sizes[Math.floor(product.sizes.length / 2)],
      selectedImage: currentColor.image
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div 
      className="group flex flex-col cursor-pointer text-left select-none"
      onClick={() => onOpenDetail(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-[#f6f6f6] rounded-lg overflow-hidden mb-3">
        {/* Product Image */}
        <img
          src={currentColor.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          aria-label="Add to favorites"
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-all text-black shadow-sm z-10 active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-600 text-red-600' : 'text-gray-700 hover:text-black'
            }`}
          />
        </button>

        {/* Quick Add Button on Hover */}
        <div className="absolute bottom-3 right-3 z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleQuickAdd}
            title="Quick add to bag"
            className="p-2.5 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg transition-transform active:scale-90 flex items-center justify-center"
          >
            {justAdded ? <Check className="w-4 h-4 text-green-400" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Color Swatches (if multiple) */}
      {product.colors.length > 1 && (
        <div 
          className="flex items-center space-x-1.5 mb-2 py-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {product.colors.map((col, idx) => (
            <button
              key={col.name}
              onClick={() => setSelectedColorIndex(idx)}
              title={col.name}
              className={`w-4 h-4 rounded-full border transition-all ${
                selectedColorIndex === idx
                  ? 'ring-1 ring-black border-white scale-110'
                  : 'border-gray-300 hover:border-black'
              }`}
              style={{ backgroundColor: col.hex }}
            />
          ))}
          <span className="text-[11px] text-[#707072] ml-1">
            {product.colors.length} Colour{product.colors.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Product Information */}
      <div className="space-y-1">
        {/* Badge */}
        {product.badge && (
          <span className={`text-[12px] font-bold tracking-tight block ${
            product.badge === 'Sale' ? 'text-red-600' : 'text-[#9e3500]'
          }`}>
            {product.badge}
          </span>
        )}

        {/* Title */}
        <h3 className="text-base font-semibold text-[#111111] group-hover:text-black leading-snug">
          {product.name}
        </h3>

        {/* Subtitle / Category */}
        <p className="text-sm text-[#707072] font-normal">
          {product.subtitle}
        </p>

        {/* Price */}
        <div className="pt-1 flex items-center space-x-2">
          <span className="text-sm font-semibold text-[#111111]">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[#707072] line-through font-normal">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
