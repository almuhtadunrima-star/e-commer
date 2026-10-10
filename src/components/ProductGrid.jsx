import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';

export default function ProductGrid({
  products,
  activeCategory,
  onSelectCategory,
  searchQuery,
  favorites,
  onToggleFavorite,
  onOpenDetail,
  onQuickAdd
}) {
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(true);

  const sports = ["All", "Lifestyle", "Running", "Basketball", "Training", "Jordan"];

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter (from top navbar)
      if (activeCategory === "Jordan" && p.category !== "Jordan") return false;
      if (activeCategory === "Sale" && !p.originalPrice) return false;
      if (activeCategory === "Men" && p.gender !== "Men") return false;
      if (activeCategory === "Women" && p.gender !== "Women") return false;
      if (activeCategory === "Kids" && p.gender !== "Kids") return false;

      // Sport / Subcategory filter
      if (selectedSport !== "All" && p.category !== selectedSport) return false;

      // Gender filter
      if (selectedGender !== "All" && p.gender !== selectedGender) return false;

      // Price filter
      if (priceFilter === "under150" && p.price >= 150) return false;
      if (priceFilter === "over150" && p.price < 150) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSub = p.subtitle.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesSub && !matchesCategory) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default featured
    });
  }, [products, activeCategory, selectedSport, selectedGender, priceFilter, sortBy, searchQuery]);

  return (
    <section id="products-section" className="max-w-[1920px] mx-auto px-6 lg:px-12 py-10">
      {/* Wall Header: Title, Count, Filters Toggle, Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
            {searchQuery ? `Search results for "${searchQuery}"` : activeCategory === "All" ? "All Shoes & Gear" : `${activeCategory} Collection`}
          </h2>
          <span className="text-sm text-[#707072] font-medium">
            ({filteredProducts.length} items found)
          </span>
        </div>

        {/* Controls: Filter Toggle & Sort */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:border-black rounded-full text-sm font-semibold transition-all active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 hover:border-black pl-4 pr-10 py-2 rounded-full text-sm font-semibold outline-none cursor-pointer transition-colors"
            >
              <option value="featured">Sort By: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Container with Sidebar + Product Grid */}
      <div className="flex pt-6 gap-8">
        {/* Filter Sidebar (Desktop) */}
        {showFilters && (
          <aside className="w-60 flex-shrink-0 hidden md:block space-y-8 select-none text-left">
            {/* Category / Sport Pill Filter */}
            <div>
              <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-3">
                Category
              </h3>
              <div className="space-y-2">
                {sports.map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`block w-full text-left text-sm py-1 font-medium transition-colors ${
                      selectedSport === sport
                        ? 'text-black font-bold'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-3">
                Shop By Price
              </h3>
              <div className="space-y-2 text-sm font-medium text-gray-700">
                <label className="flex items-center space-x-2.5 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === "All"}
                    onChange={() => setPriceFilter("All")}
                    className="accent-black"
                  />
                  <span>All Prices</span>
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === "under150"}
                    onChange={() => setPriceFilter("under150")}
                    className="accent-black"
                  />
                  <span>Under $150</span>
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === "over150"}
                    onChange={() => setPriceFilter("over150")}
                    className="accent-black"
                  />
                  <span>$150 and Above</span>
                </label>
              </div>
            </div>

            {/* Quick Reset Button */}
            {(selectedSport !== "All" || priceFilter !== "All" || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setSelectedSport("All");
                  setPriceFilter("All");
                  onSelectCategory("All");
                }}
                className="w-full py-2 bg-gray-100 hover:bg-black hover:text-white text-xs font-bold rounded-full transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </aside>
        )}

        {/* Product Cards Grid */}
        <div className="flex-1">
          {/* Mobile Category Horizontal Pills */}
          <div className="flex md:hidden overflow-x-auto no-scrollbar space-x-2 mb-6 pb-2">
            {sports.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSport === sport
                    ? 'bg-black text-white'
                    : 'bg-[#f5f5f5] text-black hover:bg-gray-200'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <h3 className="text-xl font-bold text-gray-800">
                We couldn't find any matches.
              </h3>
              <p className="text-sm text-gray-500">
                Try resetting your filters or search for something else like "Air Force 1" or "Jordan".
              </p>
              <button
                onClick={() => {
                  setSelectedSport("All");
                  setPriceFilter("All");
                  onSelectCategory("All");
                }}
                className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.some((f) => f.id === product.id)}
                  onToggleFavorite={onToggleFavorite}
                  onOpenDetail={onOpenDetail}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
