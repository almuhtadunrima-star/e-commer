import React, { useState } from 'react';
import { Heart, Plus, Check, Star } from 'lucide-react';
import { formatRupiah } from '../utils/format';

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onQuickAdd
}) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const currentColor = product.colors[selectedColorIndex] || product.colors[0];

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    onQuickAdd({
      ...product,
      selectedColor: currentColor.name,
      selectedSize: product.sizes[2] || product.sizes[0],
      selectedImage: currentColor.image
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="group flex flex-col cursor-pointer text-left select-none glass-ios-card rounded-2xl sm:rounded-3xl overflow-hidden p-2.5 sm:p-3.5 transition-all duration-300 relative border border-white/95 hover:border-black/20 shadow-sm hover:shadow-xl"
      onClick={() => onOpenDetail(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-gradient-to-b from-slate-100/90 to-white backdrop-blur-md rounded-2xl overflow-hidden mb-3 border border-slate-200/90 flex items-center justify-center shadow-inner group-hover:bg-white transition-colors">
        {/* Product Image */}
        <img
          src={currentColor.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />

        {/* Brand & Status Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          <div className="flex items-center gap-1.5">
            <span 
              className="w-6 h-6 rounded-lg bg-black text-white font-black text-xs flex items-center justify-center shadow-md tracking-tight border border-white/20"
              title="MA Official Brand"
            >
              M
            </span>
            {discountPercent > 0 && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm bg-red-600 text-white">
                -{discountPercent}%
              </span>
            )}
            {product.badge && !product.badge.includes('Diskon') && (
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm ${
                product.badge === 'Terlaris'
                  ? 'glass-ios-dark text-white'
                  : 'bg-amber-500 text-white'
              }`}>
                {product.badge}
              </span>
            )}
          </div>
          {product.stock <= 5 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full glass-ios-pill text-amber-950 border border-amber-300/80 shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Sisa {product.stock} pcs!
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          aria-label="Tambah ke Favorit"
          className="absolute top-2.5 right-2.5 p-2 glass-ios-pill hover:bg-white rounded-full transition-all text-black shadow-sm z-10 active:scale-90"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              isFavorite ? 'fill-red-600 text-red-600' : 'text-slate-700 hover:text-black'
            }`}
          />
        </button>

        {/* Desktop Quick View & Add Pill Bar */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-10 hidden sm:flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="px-3 py-1.5 glass-ios-dark text-white text-[11px] font-bold rounded-full shadow-lg backdrop-blur-md border border-white/20">
            Lihat Detail
          </span>
          <button
            onClick={handleQuickAdd}
            title="Tambah Cepat ke Keranjang"
            className="p-2 glass-ios-dark text-white hover:bg-black rounded-full shadow-lg transition-transform active:scale-90 flex items-center justify-center border border-white/20"
          >
            {justAdded ? <Check className="w-4 h-4 text-green-400" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Quick Add Button */}
        <div className="absolute bottom-2 right-2 z-10 sm:hidden">
          <button
            onClick={handleQuickAdd}
            title="Tambah Cepat ke Keranjang"
            className="p-2 glass-ios-dark text-white hover:bg-black rounded-full shadow-md transition-transform active:scale-90 flex items-center justify-center border border-white/20"
          >
            {justAdded ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Color Swatches */}
      {product.colors.length > 1 && (
        <div 
          className="flex items-center space-x-1.5 mb-1.5 py-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {product.colors.map((col, idx) => (
            <button
              key={col.name}
              onClick={() => setSelectedColorIndex(idx)}
              title={col.name}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all ${
                selectedColorIndex === idx
                  ? 'ring-2 ring-black border-white scale-110'
                  : 'border-slate-400 hover:border-black'
              }`}
              style={{ backgroundColor: col.hex }}
            />
          ))}
          <span className="text-[10px] sm:text-[11px] text-slate-600 ml-1 font-bold truncate">
            {currentColor.name}
          </span>
        </div>
      )}

      {/* Product Details */}
      <div className="space-y-1 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <div className="flex items-center space-x-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="font-extrabold text-slate-900 text-[11px] sm:text-xs">{product.rating}</span>
              <span className="text-slate-500 font-medium text-[10px] sm:text-[11px]">({product.reviewsCount})</span>
            </div>
            <span className="text-[9px] font-black tracking-widest text-slate-800 uppercase bg-slate-200/80 px-2 py-0.5 rounded-md">
              MA STORE
            </span>
          </div>

          <h3 className="text-xs sm:text-sm md:text-[15px] font-black text-black group-hover:text-blue-600 line-clamp-1 leading-snug transition-colors">
            {product.name}
          </h3>

          <p className="text-[11px] sm:text-xs text-slate-600 font-medium line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing in Rupiah */}
        <div className="pt-2 flex items-baseline space-x-2">
          <span className="text-sm sm:text-base md:text-lg font-black text-black">
            {formatRupiah(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through font-semibold">
              {formatRupiah(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
