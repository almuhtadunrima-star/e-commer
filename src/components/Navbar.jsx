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
    { label: "Semua Produk", category: "All", badge: null },
    { label: "Hoodie & Apparel", category: "Hoodie", badge: "Baru" },
    { label: "Pria", category: "Pria", badge: null },
    { label: "Wanita", category: "Wanita", badge: null },
    { label: "Jordan", category: "Jordan", badge: null },
    { label: "Promo Diskon", category: "Sale", badge: "Hemat" },
  ];

  const popularSearches = [
    "Hoodie MOVEO", "Crewneck Fleece", "MOVEO Air Force 1", "MOVEO Jordan", 
    "MOVEO Air Max", "MOVEO Pegasus", "Running", "Training"
  ];

  return (
    <>
      <nav className="bg-white sticky top-0 z-40 transition-shadow border-b border-[#f0f0f0] select-none">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo MA Store & Brand Identity */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onSelectCategory("All")}
              className="group focus:outline-none flex items-center gap-2.5 py-1"
              title="MA Store Official Store"
            >
              <img 
                src="/logo.png" 
                alt="MA Store" 
                className="h-10 sm:h-11 w-auto object-contain rounded-xl filter drop-shadow-sm transition-transform group-hover:scale-105" 
              />
              <div className="flex flex-col text-left">
                <span className="font-black text-lg sm:text-xl tracking-tight leading-none text-black uppercase">
                  MA STORE
                </span>
                <span className="text-[9px] font-extrabold tracking-widest text-gray-400 uppercase">
                  Official Store
                </span>
              </div>
            </button>
          </div>

          {/* Central Category Navigation (Desktop) */}
          <div className="hidden lg:flex items-center space-x-7">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onSelectCategory(item.category)}
                className={`text-[14px] font-bold tracking-tight py-5 relative transition-colors ${
                  activeCategory === item.category ? 'text-black' : 'text-[#444444] hover:text-black'
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[9px] bg-red-600 text-white rounded font-extrabold uppercase">
                    {item.badge}
                  </span>
                )}
                {activeCategory === item.category && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-black rounded-t"></span>
                )}
              </button>
            ))}

            {/* Tombol Navigasi Lacak Pesanan Langsung */}
            <button
              onClick={onOpenTrackLookup}
              className="text-[13px] font-bold text-gray-700 hover:text-black flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Truck className="w-4 h-4 text-black" />
              <span>Lacak Pesanan</span>
            </button>
          </div>

          {/* Right Actions: Search & Icons */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            {/* Search Input Bar (Desktop) */}
            <div className="relative hidden sm:block">
              <div className="flex items-center bg-[#f5f5f5] hover:bg-[#ebebeb] transition-colors rounded-full px-4 py-2 w-48 md:w-56 focus-within:w-72 focus-within:bg-white focus-within:ring-1 focus-within:ring-black">
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
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 text-left"
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
                        className="text-xs px-3 py-1.5 bg-[#f5f5f5] hover:bg-black hover:text-white rounded-full font-semibold transition-all"
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

          <div className="fixed top-0 right-0 bottom-0 w-[300px] sm:w-[350px] bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mb-6">
                <div className="flex items-center bg-[#f5f5f5] rounded-full px-4 py-2.5">
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
