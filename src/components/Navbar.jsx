import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';

export default function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onSelectProduct
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoverCategory, setHoverCategory] = useState(null);
  const searchInputRef = useRef(null);

  const navItems = [
    { label: "New & Featured", category: "All", badge: null },
    { label: "Men", category: "Men", badge: null },
    { label: "Women", category: "Women", badge: null },
    { label: "Kids", category: "Kids", badge: null },
    { label: "Jordan", category: "Jordan", badge: null },
    { label: "Sale", category: "Sale", badge: "Extra 20%" },
  ];

  const popularSearches = [
    "Air Force 1", "Air Jordan 1", "Air Max", "Vomero 5", 
    "Pegasus 41", "Metcon", "Running Shoes", "Basketball", "Dunk Low"
  ];

  return (
    <>
      <nav className="bg-white sticky top-0 z-40 transition-shadow border-b border-[#f0f0f0]">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Nike Swoosh Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => onSelectCategory("All")}
              className="group focus:outline-none"
              title="Nike Home"
            >
              <svg 
                className="h-14 w-16 fill-[#111111] group-hover:opacity-75 transition-opacity"
                viewBox="0 0 24 24"
              >
                <path d="M21.707 5.293c-2.478 2.05-6.398 4.965-10.742 7.747-3.05 1.954-5.698 3.523-7.534 4.542-.716.398-1.472.778-2.187 1.092l-.128.055a.75.75 0 01-.989-.988c.328-.737.728-1.517 1.144-2.257 1.054-1.875 2.673-4.577 4.673-7.689 2.846-4.429 5.823-8.432 7.915-10.871a.75.75 0 011.08.026c.394.462.674.997.808 1.554.237.99-.04 2.112-.767 3.267 1.583-.984 3.738-2.217 6.137-3.414.288-.144.629-.024.773.264a.75.75 0 01-.183.672z" />
              </svg>
            </button>
          </div>

          {/* Central Category Navigation (Desktop) */}
          <div className="hidden lg:flex items-center space-x-7">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onSelectCategory(item.category)}
                onMouseEnter={() => setHoverCategory(item.label)}
                onMouseLeave={() => setHoverCategory(null)}
                className={`text-[15px] font-semibold tracking-tight py-5 relative transition-colors ${
                  activeCategory === item.category ? 'text-black font-bold' : 'text-[#111111] hover:text-[#707072]'
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-red-600 text-white rounded font-bold uppercase">
                    {item.badge}
                  </span>
                )}
                {activeCategory === item.category && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></span>
                )}
              </button>
            ))}
          </div>

          {/* Right Actions: Search & Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Input Bar */}
            <div className="relative hidden sm:block">
              <div className="flex items-center bg-[#f5f5f5] hover:bg-[#ebebeb] transition-colors rounded-full px-4 py-2 w-44 md:w-56 focus-within:w-72 focus-within:bg-white focus-within:ring-1 focus-within:ring-black">
                <Search className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="bg-transparent text-sm w-full outline-none placeholder-gray-500 font-medium"
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

              {/* Quick Search Dropdown / Recommendations */}
              {searchFocused && (
                <div 
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 text-left"
                  onMouseDown={(e) => e.preventDefault()} // prevent input blur on click
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Popular Terms</span>
                    <button 
                      onClick={() => setSearchFocused(false)}
                      className="text-gray-400 hover:text-black text-xs font-medium"
                    >
                      Close
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
                        className="text-xs px-3 py-1.5 bg-[#f5f5f5] hover:bg-black hover:text-white rounded-full font-medium transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => {
                const query = prompt("Search Nike products:");
                if (query !== null) onSearchChange(query);
              }}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-full transition-colors text-black"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist / Favorites Button */}
            <button
              onClick={onOpenWishlist}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative text-black"
              title="Favorites"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Bag / Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative text-black"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors text-black"
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed top-0 right-0 bottom-0 w-[300px] sm:w-[350px] bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Close Button */}
              <div className="flex justify-end mb-6">
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
                    placeholder="Search Nike"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-transparent text-sm w-full outline-none"
                  />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      onSelectCategory(item.category);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left text-xl font-bold py-2 border-b border-gray-100 ${
                      activeCategory === item.category ? 'text-black' : 'text-gray-700 hover:text-black'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                <button 
                  onClick={() => {
                    onOpenWishlist();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 text-base font-semibold text-gray-800 hover:text-black"
                >
                  <Heart className="w-5 h-5" />
                  <span>Favorites ({wishlistCount})</span>
                </button>
                <button 
                  onClick={() => {
                    onOpenCart();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 text-base font-semibold text-gray-800 hover:text-black"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Bag ({cartCount})</span>
                </button>
              </div>
            </div>

            {/* Mobile Footer info */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium">
                Become a Nike Member for the best products, inspiration and stories in sport.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
