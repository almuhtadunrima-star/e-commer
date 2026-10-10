import React, { useState } from 'react';
import { X, Heart, Star, Truck, RefreshCw, Check, ShieldCheck } from 'lucide-react';

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToCart
}) {
  if (!isOpen || !product) return null;

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] || product.sizes[0]);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showShippingInfo, setShowShippingInfo] = useState(false);

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];

  const handleAdd = () => {
    onAddToCart({
      ...product,
      selectedColor: activeColor.name,
      selectedSize: selectedSize,
      selectedImage: activeColor.image
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div 
          className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close product details"
            className="absolute top-5 right-5 p-2.5 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
            {/* Left: Product Images Gallery (7 cols) */}
            <div className="lg:col-span-7 bg-[#f6f6f6] p-8 flex flex-col justify-between items-center relative">
              <div className="w-full flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                  {product.category}
                </span>
                <div className="flex items-center space-x-1 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Main Shoe Image */}
              <div className="w-full aspect-square max-w-[480px] flex items-center justify-center py-6">
                <img
                  src={activeColor.image}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Color thumbnails row */}
              <div className="flex space-x-3 mt-4">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColorIdx(i)}
                    className={`w-16 h-16 rounded-xl bg-white border-2 p-1 overflow-hidden transition-all ${
                      selectedColorIdx === i ? 'border-black ring-2 ring-black/20' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={c.image} alt={c.name} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Buy Info & Specs (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between text-left">
              <div>
                {product.badge && (
                  <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                    product.badge === 'Sale' ? 'text-red-600' : 'text-[#9e3500]'
                  }`}>
                    {product.badge}
                  </span>
                )}

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-[#707072] font-medium mt-1 mb-4">
                  {product.subtitle}
                </p>

                {/* Pricing */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl font-bold text-[#111111]">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Color Selector */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#111]">Selected Colour:</span>
                    <span className="text-xs text-gray-500 font-medium">{activeColor.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    {product.colors.map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColorIdx(i)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          selectedColorIdx === i ? 'ring-2 ring-black scale-110 border-white' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#111]">Select Size (US Men's)</span>
                    <button 
                      onClick={() => alert("Nike Size Chart: US 8 = EU 41 (26cm), US 9 = EU 42.5 (27cm), US 10 = EU 44 (28cm).")}
                      className="text-xs text-gray-500 hover:text-black font-semibold underline"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 rounded-lg text-sm font-bold border transition-all ${
                          selectedSize === size
                            ? 'border-black bg-black text-white shadow-sm'
                            : 'border-gray-200 hover:border-black text-[#111] bg-white'
                        }`}
                      >
                        US {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="space-y-3 mb-8">
                  <button
                    onClick={handleAdd}
                    className="w-full py-4 bg-black text-white hover:bg-gray-800 rounded-full font-bold text-base tracking-tight transition-all active:scale-[0.99] flex items-center justify-center space-x-2 shadow-lg"
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-5 h-5 text-green-400" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <span>Add to Bag</span>
                    )}
                  </button>

                  <button
                    onClick={() => onToggleFavorite(product)}
                    className="w-full py-3.5 border border-gray-300 hover:border-black rounded-full font-bold text-sm tracking-tight transition-all active:scale-[0.99] flex items-center justify-center space-x-2 text-black"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
                    <span>{isFavorite ? 'Remove from Favorite' : 'Favorite'}</span>
                  </button>
                </div>

                {/* Product Description */}
                <div className="text-sm text-gray-700 leading-relaxed mb-6">
                  <p>{product.description}</p>
                </div>

                {/* Key Benefits */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-2">
                    Key Features
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
                    {product.details?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Free Delivery & Returns Accordion */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowShippingInfo(!showShippingInfo)}
                    className="w-full flex items-center justify-between text-sm font-bold text-black py-2"
                  >
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4" /> Free Delivery and Returns
                    </span>
                    <span>{showShippingInfo ? '−' : '+'}</span>
                  </button>
                  {showShippingInfo && (
                    <div className="text-xs text-gray-600 py-2 space-y-2">
                      <p>• Your order ships free for Nike Members on orders over $50.</p>
                      <p>• Standard delivery arrives in 2–4 business days.</p>
                      <p>• 60-day hassle-free returns for Members.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
