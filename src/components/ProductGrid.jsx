import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { SlidersHorizontal, ChevronDown, Check, Sparkles, LayoutGrid, Grid3X3, X, RotateCcw } from 'lucide-react';
import { formatRupiah } from '../utils/format';

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
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(true);
  const [gridColumns, setGridColumns] = useState(4);

  const categories = ["All", "Hoodie", "Lifestyle", "Running", "Basketball", "Training", "Jordan"];

  const hasActiveFilters = selectedSport !== "All" || selectedGender !== "All" || priceFilter !== "All" || inStockOnly;

  const handleResetAllFilters = () => {
    setSelectedSport("All");
    setSelectedGender("All");
    setPriceFilter("All");
    setInStockOnly(false);
    onSelectCategory("All");
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Navbar category
      if (activeCategory === "Jordan" && p.category !== "Jordan") return false;
      if (activeCategory === "Hoodie" && p.category !== "Hoodie") return false;
      if (activeCategory === "Sale" && !p.originalPrice) return false;
      if (activeCategory === "Pria" && p.gender !== "Pria" && p.gender !== "Unisex") return false;
      if (activeCategory === "Wanita" && p.gender !== "Wanita" && p.gender !== "Unisex") return false;

      // Subcategory / Sport
      if (selectedSport !== "All" && p.category !== selectedSport) return false;

      // Gender filter
      if (selectedGender !== "All" && p.gender !== selectedGender) return false;

      // Stock filter
      if (inStockOnly && p.stock <= 0) return false;

      // Price filter in Rupiah
      if (priceFilter === "under2m" && p.price >= 2000000) return false;
      if (priceFilter === "2m-3m" && (p.price < 2000000 || p.price > 3000000)) return false;
      if (priceFilter === "over3m" && p.price <= 3000000) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSub = p.subtitle.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        if (!matchesName && !matchesSub && !matchesCategory && !matchesDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviewsCount - a.reviewsCount;
      return 0; // featured
    });
  }, [products, activeCategory, selectedSport, selectedGender, priceFilter, inStockOnly, sortBy, searchQuery]);

  return (
    <section id="products-section" className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 overflow-hidden">
      {/* Header Katalog: Judul, Jumlah Produk, Tombol Filter, Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-[#111111]">
            {searchQuery 
              ? `Hasil Pencarian: "${searchQuery}"` 
              : activeCategory === "All" 
              ? "Koleksi Sepatu & Perlengkapan" 
              : activeCategory === "Hoodie"
              ? "Koleksi Hoodie & Apparel"
              : `Koleksi ${activeCategory}`}
          </h2>
          <span className="text-xs sm:text-sm text-[#707072] font-medium">
            Menampilkan {filteredProducts.length} produk pilihan
          </span>
        </div>

        {/* Controls: Filter Toggle, Grid Switcher & Sort */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 glass-ios-pill hover:bg-white rounded-full text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}</span>
          </button>

          {/* Grid Layout Switcher (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1 glass-ios-pill p-1 rounded-full border border-slate-300/70">
            <button
              onClick={() => setGridColumns(3)}
              title="Tampilan 3 Kolom (Besar)"
              className={`p-1.5 rounded-full transition-all ${
                gridColumns === 3 ? 'bg-black text-white shadow-xs' : 'text-slate-600 hover:text-black'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGridColumns(4)}
              title="Tampilan 4 Kolom (Padat)"
              className={`p-1.5 rounded-full transition-all ${
                gridColumns === 4 ? 'bg-black text-white shadow-xs' : 'text-slate-600 hover:text-black'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none glass-ios-pill hover:bg-white pl-4 pr-10 py-2 rounded-full text-xs sm:text-sm font-bold outline-none cursor-pointer transition-colors shadow-xs"
            >
              <option value="featured">Urutkan: Terpopuler</option>
              <option value="price-low">Harga: Termurah ke Termahal</option>
              <option value="price-high">Harga: Termahal ke Termurah</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="reviews">Ulasan Terbanyak</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Filter Chips Row - Bold & Confident */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-4 pb-2 border-b border-slate-200/80 animate-in fade-in duration-200">
          <span className="text-xs font-black text-slate-900 mr-1 uppercase tracking-wider">Filter Aktif:</span>
          {selectedSport !== "All" && (
            <button
              onClick={() => setSelectedSport("All")}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-900 text-white hover:bg-black transition-all shadow-xs"
            >
              <span>Kategori: {selectedSport}</span>
              <X className="w-3.5 h-3.5 ml-1 text-slate-300" />
            </button>
          )}
          {selectedGender !== "All" && (
            <button
              onClick={() => setSelectedGender("All")}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-900 text-white hover:bg-black transition-all shadow-xs"
            >
              <span>Gender: {selectedGender}</span>
              <X className="w-3.5 h-3.5 ml-1 text-slate-300" />
            </button>
          )}
          {priceFilter !== "All" && (
            <button
              onClick={() => setPriceFilter("All")}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-900 text-white hover:bg-black transition-all shadow-xs"
            >
              <span>
                Harga: {priceFilter === "under-1.5m" ? "< Rp 1.5 Jt" : priceFilter === "1.5m-2.5m" ? "Rp 1.5 - 2.5 Jt" : "> Rp 2.5 Jt"}
              </span>
              <X className="w-3.5 h-3.5 ml-1 text-slate-300" />
            </button>
          )}
          {inStockOnly && (
            <button
              onClick={() => setInStockOnly(false)}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-xs"
            >
              <span>Ready Stock Saja</span>
              <X className="w-3.5 h-3.5 ml-1 text-emerald-200" />
            </button>
          )}
          <button
            onClick={handleResetAllFilters}
            className="inline-flex items-center space-x-1 text-xs font-black text-red-600 hover:text-red-700 ml-2 py-1 px-3 rounded-full bg-red-100/70 hover:bg-red-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3 mr-0.5" />
            <span>Reset Semua</span>
          </button>
        </div>
      )}

      {/* Main Container with Sidebar + Product Grid */}
      <div className="flex pt-6 gap-6 lg:gap-8 w-full min-w-0">
        {/* Filter Sidebar (Desktop) */}
        {showFilters && (
          <aside className="w-64 flex-shrink-0 hidden md:block space-y-7 select-none text-left glass-ios p-6 rounded-3xl border border-slate-300/70 shadow-lg h-fit">
            {/* Category / Sport Filter */}
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                Kategori Produk
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedSport(cat)}
                    className={`block w-full text-left text-xs sm:text-sm py-2 px-3.5 rounded-xl font-bold transition-all ${
                      selectedSport === cat
                        ? 'glass-ios-dark text-white shadow-md'
                        : 'text-slate-800 hover:bg-slate-200/70'
                    }`}
                  >
                    {cat === "All" ? "Semua Kategori" : cat === "Hoodie" ? "Hoodie & Apparel" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div className="pt-4 border-t border-slate-300/60">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                Gender
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-bold text-slate-800">
                {["All", "Pria", "Wanita", "Unisex"].map((g) => (
                  <label key={g} className="flex items-center space-x-2.5 cursor-pointer hover:text-black">
                    <input
                      type="radio"
                      name="gender"
                      checked={selectedGender === g}
                      onChange={() => setSelectedGender(g)}
                      className="accent-black"
                    />
                    <span>{g === "All" ? "Semua Gender" : g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter in Rupiah */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xs font-black text-black uppercase tracking-wider mb-3">
                Rentang Harga
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-semibold text-gray-700">
                <label className="flex items-center space-x-2.5 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === "All"}
                    onChange={() => setPriceFilter("All")}
                    className="accent-black"
                  />
                  <span>Semua Harga</span>
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === "under2m"}
                    onChange={() => setPriceFilter("under2m")}
                    className="accent-black"
                  />
                  <span>Di Bawah Rp 2 Juta</span>
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === "2m-3m"}
                    onChange={() => setPriceFilter("2m-3m")}
                    className="accent-black"
                  />
                  <span>Rp 2 Juta – Rp 3 Juta</span>
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === "over3m"}
                    onChange={() => setPriceFilter("over3m")}
                    className="accent-black"
                  />
                  <span>Di Atas Rp 3 Juta</span>
                </label>
              </div>
            </div>

            {/* Stock Availability Toggle */}
            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs sm:text-sm font-bold text-gray-800">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-black w-4 h-4 rounded"
                />
                <span>Hanya Ready Stock</span>
              </label>
            </div>

            {/* Quick Reset Button */}
            {(selectedSport !== "All" || selectedGender !== "All" || priceFilter !== "All" || inStockOnly || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setSelectedSport("All");
                  setSelectedGender("All");
                  setPriceFilter("All");
                  setInStockOnly(false);
                  onSelectCategory("All");
                }}
                className="w-full py-2.5 bg-gray-200 hover:bg-black hover:text-white text-xs font-bold rounded-xl transition-colors"
              >
                Reset Semua Filter
              </button>
            )}
          </aside>
        )}

        {/* Product Cards Grid */}
        <div className="flex-1 min-w-0 w-full overflow-hidden">
          {/* Mobile Category Horizontal Pills */}
          <div className="flex md:hidden overflow-x-auto no-scrollbar space-x-2 mb-6 pb-2 w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSport(cat)}
                className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedSport === cat
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white text-slate-800 hover:bg-slate-100 hover:text-black border border-slate-200/90 shadow-xs'
                }`}
              >
                {cat === "All" ? "Semua Kategori" : cat}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4 bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <Sparkles className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-xl font-bold text-gray-800">
                Tidak ada produk yang cocok dengan kriteria filter.
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Coba ganti rentang harga, reset kategori, atau ketik kata kunci lain seperti "Air Force", "Jordan", atau "Vomero".
              </p>
              <button
                onClick={() => {
                  setSelectedSport("All");
                  setSelectedGender("All");
                  setPriceFilter("All");
                  setInStockOnly(false);
                  onSelectCategory("All");
                }}
                className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors shadow-md"
              >
                Bersihkan Filter
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-2 sm:grid-cols-2 ${gridColumns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'} gap-3 sm:gap-6`}>
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
