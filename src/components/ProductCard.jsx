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

  return (
    <div 
      className="group flex flex-col cursor-pointer text-left select-none bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 p-3 border border-gray-100"
      onClick={() => onOpenDetail(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-[#f6f6f6] rounded-lg overflow-hidden mb-3">
        {/* Product Image */}
        <img
          src={currentColor.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-108 transition-transform duration-300"
          loading="lazy"
        />

        {/* MOVEO Brand Mark "M" & Stock Badge */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          <div className="flex items-center gap-1.5">
            <span 
              className="w-6 h-6 rounded-md bg-black text-white font-black text-xs flex items-center justify-center shadow-md border border-white/40 tracking-tight"
              title="MOVEO Brand Logo"
            >
              M
            </span>
            {product.badge && (
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm ${
                product.badge.includes('Diskon')
                  ? 'bg-red-600 text-white'
                  : product.badge === 'Terlaris'
                  ? 'bg-black text-white'
                  : 'bg-amber-500 text-white'
              }`}>
                {product.badge}
              </span>
            )}
          </div>
          {product.stock <= 5 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
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
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-all text-black shadow-md z-10 active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-600 text-red-600' : 'text-gray-600 hover:text-black'
            }`}
          />
        </button>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 right-3 z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleQuickAdd}
            title="Tambah Cepat ke Keranjang"
            className="p-2.5 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg transition-transform active:scale-90 flex items-center justify-center"
          >
            {justAdded ? <Check className="w-4 h-4 text-green-400" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Color Swatches */}
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
                  ? 'ring-2 ring-black border-white scale-110'
                  : 'border-gray-300 hover:border-black'
              }`}
              style={{ backgroundColor: col.hex }}
            />
          ))}
          <span className="text-[11px] text-[#707072] ml-1 font-medium">
            {product.colors.length} Pilihan Warna
          </span>
        </div>
      )}

      {/* Product Details */}
      <div className="space-y-1 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <div className="flex items-center space-x-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
            </div>
            <span className="text-[10px] font-black tracking-wider text-gray-500 uppercase flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded bg-black text-white text-[8px] flex items-center justify-center font-black">M</span>
              MOVEO
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-[#111111] group-hover:text-black line-clamp-1 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-[#707072] font-medium line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing in Rupiah */}
        <div className="pt-2 flex items-baseline space-x-2">
          <span className="text-sm sm:text-base font-extrabold text-[#111111]">
            {formatRupiah(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#707072] line-through font-normal">
              {formatRupiah(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
