import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';

export default function WishlistModal({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onAddToCart,
  onOpenDetail
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-black">
              Favorites ({favorites.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {favorites.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <p className="text-base font-bold text-gray-700">Your favorites list is empty.</p>
                <p className="text-xs text-gray-500">Items added to your Favorites will be saved here.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800"
                >
                  Explore Shoes
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 space-y-4">
                {favorites.map((product) => (
                  <div key={product.id} className="pt-4 flex gap-4 text-left">
                    <div 
                      onClick={() => {
                        onClose();
                        onOpenDetail(product);
                      }}
                      className="w-24 h-24 bg-[#f6f6f6] rounded-lg p-2 flex-shrink-0 cursor-pointer flex items-center justify-center"
                    >
                      <img
                        src={product.colors[0]?.image}
                        alt={product.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 
                            onClick={() => {
                              onClose();
                              onOpenDetail(product);
                            }}
                            className="text-sm font-bold text-black hover:underline cursor-pointer leading-tight"
                          >
                            {product.name}
                          </h4>
                          <span className="text-sm font-bold text-black ml-2">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{product.subtitle}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => {
                            onAddToCart({
                              ...product,
                              selectedColor: product.colors[0].name,
                              selectedSize: product.sizes[0],
                              selectedImage: product.colors[0].image
                            });
                          }}
                          className="px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>

                        <button
                          onClick={() => onRemoveFavorite(product)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
