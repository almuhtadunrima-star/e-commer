import React, { useState, useRef } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Truck } from 'lucide-react';

export default function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenTrackLookup
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  const navItems = [
    { label: "Semua", category: "All", badge: null },
    { label: "Hoodie", category: "Hoodie", badge: null },
    { label: "Training", category: "Training", badge: null },
    { label: "Pria", category: "Pria", badge: null },
    { label: "Wanita", category: "Wanita", badge: null },
    { label: "Jordan", category: "Jordan", badge: null },
    { label: "Sale", category: "Sale", badge: "Hemat" },
  ];

  const popularSearches = [
    "Jaket Training", "Hoodie MOVEO", "Crewneck Fleece", "MOVEO Air Force 1", "MOVEO Jordan", 
    "MOVEO Air Max", "MOVEO Pegasus", "Running", "Training"
  ];

  return (
    <>
      <nav className="glass-ios-header sticky top-0 z-40 transition-shadow select-none">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo MA STORE (Nama Saja Sesuai Permintaan) */}
          <div className="flex items-center flex-shrink-0">
            <button 
              onClick={() => onSelectCategory("All")}
              className="group focus:outline-none flex items-center py-1 select-none"
              title="MA STORE"
            >
              <span className="font-black text-2xl sm:text-3xl tracking-tight text-black uppercase group-hover:opacity-75 transition-opacity">
                MA STORE
              </span>
            </button>
          </div>

          {/* Central Category Navigation (Desktop) */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onSelectCategory(item.category)}
                className={`text-[14px] font-bold tracking-tight py-5 relative transition-colors ${
                  activeCategory === item.category ? 'text-black' : 'text-[#555555] hover:text-black'
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[9px] bg-red-600 text-white rounded font-extrabold uppercase shadow-sm">
                    {item.badge}
                  </span>
                )}
                {activeCategory === item.category && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-black rounded-t shadow-sm"></span>
                )}
              </button>
            ))}
          </div>

          {/* Right Actions: Search & Icons */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Search Input Bar (Desktop) */}
            <div className="relative hidden sm:block">
              <div className="flex items-center glass-ios-input hover:bg-white/80 transition-all rounded-full px-4 py-2 w-48 md:w-56 focus-within:w-72 focus-within:bg-white/95 focus-within:ring-2 focus-within:ring-black/20 focus-within:shadow-md">
                <Search className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Cari produk di MA Store..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="bg-transparent text-xs sm:text-sm w-full outline-none placeholder-gray-500 font-semibold"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange("")}
                    className="text-gray-400 hover:text-black text-xs font-bold ml-1"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Quick Search Dropdown */}
              {searchFocused && (
                <div 
                  className="absolute right-0 top-full mt-2 w-80 glass-ios-card rounded-2xl shadow-2xl p-5 z-50 text-left"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pencarian Populer</span>
                    <button 
                      onClick={() => setSearchFocused(false)}
                      className="text-gray-400 hover:text-black text-xs font-medium"
                    >
                      Tutup
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          onSearchChange(term);
                          setSearchFocused(false);
                        }}
                        className="text-xs px-3 py-1.5 glass-ios-pill hover:bg-black hover:text-white rounded-full font-semibold transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Lacak Pesanan Button */}
            <button
              onClick={onOpenTrackLookup}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors text-black"
              title="Lacak Pesanan"
            >
              <Truck className="w-5 h-5" />
            </button>

            {/* Wishlist / Favorit Button */}
            <button
              onClick={onOpenWishlist}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative text-black"
              title="Favorit"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative text-black"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors text-black"
              title="Buka Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 bottom-0 w-[300px] sm:w-[350px] glass-ios border-l border-white/60 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-white/80 rounded-full text-black transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mb-6">
                <div className="flex items-center glass-ios-input rounded-full px-4 py-2.5">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Cari sepatu..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-transparent text-xs w-full outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Mobile Category Links */}
              <div className="space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      onSelectCategory(item.category);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left text-lg font-bold py-2 border-b border-gray-100 ${
                      activeCategory === item.category ? 'text-black' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                <button 
                  onClick={() => {
                    onOpenTrackLookup();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 text-sm font-bold text-gray-800 hover:text-black"
                >
                  <Truck className="w-4 h-4" />
                  <span>Lacak Pesanan (Cek Resi)</span>
                </button>
                <button 
                  onClick={() => {
                    onOpenWishlist();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 text-sm font-bold text-gray-800 hover:text-black"
                >
                  <Heart className="w-4 h-4" />
                  <span>Favorit ({wishlistCount})</span>
                </button>
                <button 
                  onClick={() => {
                    onOpenCart();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 text-sm font-bold text-gray-800 hover:text-black"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Keranjang ({cartCount})</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 text-left">
              <p className="text-xs text-gray-500 font-medium">
                Nikmati Gratis Ongkir & Garansi 100% Produk Original.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
