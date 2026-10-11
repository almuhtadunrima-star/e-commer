import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Heart, Star, Truck, ShieldCheck, RefreshCw, 
  Check, Plus, Minus, Zap, Share2, CheckCircle2, 
  ThumbsUp, Package, Shield, Ruler, ChevronRight 
} from 'lucide-react';
import { formatRupiah } from '../utils/format';

export default function ProductDetailPage({
  product,
  allProducts = [],
  onBackToCatalog,
  onSelectProduct,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onDirectCheckout
}) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[2] || product?.sizes[0] || 'EU 42');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset variant choices when product changes
  useEffect(() => {
    setSelectedColorIdx(0);
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[2] || product.sizes[0]);
    }
    setQuantity(1);
    setAddedSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product?.id]);

  if (!product) return null;

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];
  const isApparel = product.category === 'Hoodie' || product.sizes[0] === 'S' || product.subtitle?.toLowerCase().includes('jaket');

  // Related products prioritizing same category
  const sameCategoryProducts = allProducts.filter((p) => p.id !== product.id && p.category === product.category);
  const otherProducts = allProducts.filter((p) => p.id !== product.id && p.category !== product.category);
  const relatedProducts = [...sameCategoryProducts, ...otherProducts].slice(0, 4);

  const handleAdd = () => {
    onAddToCart({
      ...product,
      selectedColor: activeColor.name,
      selectedSize: selectedSize,
      selectedImage: activeColor.image,
      quantity: quantity
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    onDirectCheckout({
      ...product,
      selectedColor: activeColor.name,
      selectedSize: selectedSize,
      selectedImage: activeColor.image,
      quantity: quantity
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Mock verified Indonesian customer reviews
  const reviews = [
    {
      id: 1,
      author: "Reza Pratama",
      location: "Jakarta Selatan",
      rating: 5,
      date: "3 hari yang lalu",
      verified: true,
      size: "EU 42",
      variant: activeColor.name,
      comment: "Kualitas original 100%! Nyaman banget dipakai jalan seharian, bantalan empuk dan grip mantap. Pengiriman via SiCepat kilat cuma 1 hari sampai.",
      likes: 14
    },
    {
      id: 2,
      author: "Budi Santoso",
      location: "Surabaya",
      rating: 5,
      date: "1 minggu yang lalu",
      verified: true,
      size: "EU 43",
      variant: activeColor.name,
      comment: "Ukuran pas banget sesuai standar panduan size MA Store. Box mulus tidak penyok, dapet double box packing. Recommended seller!",
      likes: 9
    },
    {
      id: 3,
      author: "Fitri Handayani",
      location: "Bandung",
      rating: 4,
      date: "2 minggu yang lalu",
      verified: true,
      size: "EU 40",
      variant: activeColor.name,
      comment: "Desain keren abis, warna aslinya lebih cakep dari foto. Worth it untuk dipakai olahraga maupun hangout kasual.",
      likes: 6
    }
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#111111] pb-24">
      {/* 1. Breadcrumb & Back Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <button
              onClick={onBackToCatalog}
              className="inline-flex items-center space-x-1.5 font-bold text-gray-600 hover:text-black py-1 px-2.5 rounded-lg hover:bg-gray-100 transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Katalog</span>
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 hidden sm:inline">{product.category}</span>
            <span className="text-gray-300 hidden sm:inline">/</span>
            <span className="font-bold text-black truncate max-w-[180px] sm:max-w-[280px]">
              {product.name}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
              title="Bagikan Tautan Produk"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700 font-bold">Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Product Showcase Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* KOLOM KIRI: Galeri Foto Produk & Varian (7 Kolom) */}
          <div className="lg:col-span-7">
            <div className="sticky top-32 space-y-5">
              
              {/* Gambar Utama Besar */}
              <div className="relative aspect-square w-full bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex items-center justify-center p-8 group">
                <img
                  src={activeColor.image}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />

                {/* Brand Logo "M" & Badge Status di Pojok Gambar */}
                <div className="absolute top-5 left-5 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-9 h-9 rounded-xl bg-black text-white font-black text-base flex items-center justify-center shadow-xl border border-white/40 tracking-tighter"
                      title="MOVEO Brand Logo"
                    >
                      M
                    </span>
                    {product.badge && (
                      <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-black text-white shadow-md">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-green-800 bg-green-100/90 backdrop-blur-sm px-3 py-1 rounded-full border border-green-300 shadow-sm flex items-center gap-1.5 w-fit">
                    <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                    Ready Stock ({product.stock} unit)
                  </span>
                </div>

                {/* Favorite Button on Image */}
                <button
                  onClick={() => onToggleFavorite(product)}
                  className="absolute top-5 right-5 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg text-black transition-all active:scale-90"
                  aria-label="Simpan ke Favorit"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-600 text-red-600' : 'text-gray-700'}`} />
                </button>
              </div>

              {/* Selector Thumbnail Warna */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                    Varian Warna: <strong className="text-black">{activeColor.name}</strong>
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">
                    {product.colors.length} Pilihan Warna
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColorIdx(i)}
                      className={`group relative rounded-xl border-2 p-1.5 transition-all bg-gray-50 flex items-center gap-2 pr-3.5 ${
                        selectedColorIdx === i 
                          ? 'border-black ring-2 ring-black/20 shadow-md bg-white scale-[1.02]' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-white overflow-hidden p-0.5">
                        <img src={c.image} alt={c.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="text-left">
                        <span className="block text-xs font-black text-black">{c.name}</span>
                        <span className="block text-[10px] text-gray-400 font-medium">Original Edition</span>
                      </div>
                      {selectedColorIdx === i && (
                        <CheckCircle2 className="w-4 h-4 text-black ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jaminan Layanan Resmi */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
                  <ShieldCheck className="w-5 h-5 mx-auto text-black mb-1.5" />
                  <span className="block text-[11px] font-black">100% Asli</span>
                  <span className="block text-[10px] text-gray-500">Garansi Original</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
                  <Truck className="w-5 h-5 mx-auto text-black mb-1.5" />
                  <span className="block text-[11px] font-black">Bebas Ongkir</span>
                  <span className="block text-[10px] text-gray-500">Min. Rp 1.5 Jt</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
                  <RefreshCw className="w-5 h-5 mx-auto text-black mb-1.5" />
                  <span className="block text-[11px] font-black">Garansi Retur</span>
                  <span className="block text-[10px] text-gray-500">60 Hari Tukar</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
                  <Package className="w-5 h-5 mx-auto text-black mb-1.5" />
                  <span className="block text-[11px] font-black">Double Box</span>
                  <span className="block text-[10px] text-gray-500">Packing Aman</span>
                </div>
              </div>

            </div>
          </div>

          {/* KOLOM KANAN: Detail Informasi, Ukuran & Aksi Pembelian (5 Kolom) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              
              {/* Header Info */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black tracking-wider uppercase text-gray-500 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-black text-white font-black text-[11px] flex items-center justify-center shadow-sm">M</span>
                    <span>MOVEO • {product.category} • {product.gender}</span>
                  </span>
                  
                  {/* Rating Badge */}
                  <div className="flex items-center space-x-1.5 text-xs font-extrabold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400 font-normal">({product.reviewsCount} Ulasan)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm font-semibold text-gray-500 mt-1">
                  {product.subtitle}
                </p>
              </div>

              {/* Harga & Penawaran Diskon */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 block mb-0.5">Harga Resmi:</span>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-2xl sm:text-3xl font-black text-black">
                      {formatRupiah(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through font-semibold">
                        {formatRupiah(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {product.originalPrice && (
                  <span className="text-xs font-black text-red-600 bg-red-100 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                    Hemat {formatRupiah(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              {/* Pemilihan Ukuran (Size Selection) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-black">
                    PILIH UKURAN: <strong className="text-black font-extrabold">{selectedSize}</strong>
                  </span>
                  <button
                    onClick={() => setShowSizeModal(true)}
                    className="inline-flex items-center space-x-1 text-xs text-gray-600 hover:text-black font-bold underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Panduan Ukuran</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-xl text-xs sm:text-sm font-black border transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white shadow-md scale-[1.02]'
                          : 'border-gray-200 hover:border-black text-[#111] bg-white hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pemilihan Kuantitas (Quantity Counter) */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-xs font-black text-black block">Jumlah Pesanan</span>
                  <span className="text-[11px] text-gray-500">Maks. {product.stock} unit per transaksi</span>
                </div>

                <div className="flex items-center space-x-3 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1 hover:text-black text-gray-500 disabled:opacity-30 active:scale-90 transition-transform"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-black w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-1 hover:text-black text-gray-500 disabled:opacity-30 active:scale-90 transition-transform"
                    aria-label="Tambah jumlah"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tombol Utama Pembelian (Direct Checkout & Add to Cart) */}
              <div className="space-y-3 pt-2">
                {/* 1. Beli Sekarang -> Langsung Membuka Step 4 Checkout */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-black text-white hover:bg-neutral-800 rounded-full font-black text-sm tracking-wide transition-all active:scale-[0.99] flex items-center justify-center space-x-2.5 shadow-xl hover:shadow-2xl"
                >
                  <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>Beli Sekarang (Langsung Checkout)</span>
                </button>

                {/* 2. Tambah ke Keranjang */}
                <button
                  onClick={handleAdd}
                  className="w-full py-4 border-2 border-black bg-white hover:bg-gray-50 text-black rounded-full font-black text-sm tracking-wide transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-700">Berhasil Masuk Keranjang!</span>
                    </>
                  ) : (
                    <span>Tambah ke Keranjang Belanja</span>
                  )}
                </button>

                {/* 3. Simpan ke Favorit */}
                <button
                  onClick={() => onToggleFavorite(product)}
                  className="w-full py-3.5 border border-gray-200 hover:border-black rounded-full font-bold text-xs text-gray-700 transition-all flex items-center justify-center space-x-2 bg-white"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
                  <span>{isFavorite ? 'Sudah Ada di Favorit (Hapus)' : 'Simpan ke Wishlist Favorit'}</span>
                </button>
              </div>

              {/* Deskripsi & Ringkasan */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-black mb-2">
                  Tentang Produk
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Spesifikasi & Fitur */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-black mb-2.5">
                  Spesifikasi & Keunggulan
                </h3>
                <ul className="text-xs text-gray-600 space-y-2">
                  {product.details?.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0"></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kurir & Ekspedisi Tersedia */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-black">
                  <Truck className="w-4 h-4" />
                  <span>Simulasi Kurir Pengiriman:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['JNE Regular', 'SiCepat BEST', 'J&T Express', 'AnterAja', 'GoSend Instant'].map((courier) => (
                    <span key={courier} className="px-2.5 py-1 bg-white rounded-lg border border-gray-200 text-[11px] font-bold text-gray-700">
                      {courier}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 3. Section Ulasan Pembeli (Customer Reviews) */}
        <div className="mt-16 bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-black">
                Ulasan & Penilaian Pelanggan
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Ulasan nyata dari pembeli terverifikasi di seluruh Indonesia
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1 text-2xl font-black text-black">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-sm text-gray-400 font-semibold">/ 5.0</span>
                </div>
                <span className="text-xs text-gray-500">{product.reviewsCount} Ulasan Terverifikasi</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">{rev.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200/70 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-black text-black">{rev.author}</span>
                    <span className="block text-[11px] text-gray-500">{rev.location} • {rev.size}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500">
                    <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                    <span>{rev.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Rekomendasi Produk Terkait ("Kamu Mungkin Juga Menyukai") */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-black">
                  Kamu Mungkin Juga Menyukai
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {isApparel 
                    ? 'Koleksi pakaian & jaket training rekomendasi terbaik dengan kualitas premium' 
                    : 'Koleksi sepatu rekomendasi terbaik dengan performa serupa'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="bg-white p-4 rounded-2xl border border-gray-200 hover:shadow-xl hover:border-black transition-all cursor-pointer group text-left"
                >
                  <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden p-4 mb-3 relative">
                    <img
                      src={rel.colors[0]?.image}
                      alt={rel.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                    {rel.badge && (
                      <span className="absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-black text-white">
                        {rel.badge}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-black uppercase text-gray-400 block mb-0.5">
                    {rel.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-black truncate group-hover:underline">
                    {rel.name}
                  </h3>
                  <span className="text-xs sm:text-sm font-black text-black block mt-1">
                    {formatRupiah(rel.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal Panduan Ukuran (Size Guide) */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-black" />
                <h3 className="text-base sm:text-lg font-black text-black">
                  {isApparel ? 'Tabel Panduan Ukuran Jaket & Pakaian' : 'Tabel Panduan Ukuran Sepatu'}
                </h3>
              </div>
              <button
                onClick={() => setShowSizeModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              {isApparel
                ? 'Pilih ukuran pakaian sesuai dengan lebar dada dan kenyamanan siluet fitting Anda:'
                : 'Ukur panjang telapak kaki Anda dari tumit hingga ujung jari terpanjang, lalu sesuaikan dengan tabel berikut:'}
            </p>

            <div className="overflow-hidden rounded-xl border border-gray-200 mb-6">
              {isApparel ? (
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 text-gray-700 font-black">
                    <tr>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Lebar Dada (cm)</th>
                      <th className="py-2.5 px-3">Panjang Badan (cm)</th>
                      <th className="py-2.5 px-3">Panjang Lengan (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-black">S</td>
                      <td className="py-2 px-3">52 cm</td>
                      <td className="py-2 px-3">68 cm</td>
                      <td className="py-2 px-3 font-semibold text-gray-700">62 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-black">M</td>
                      <td className="py-2 px-3">55 cm</td>
                      <td className="py-2 px-3">70 cm</td>
                      <td className="py-2 px-3 font-semibold text-gray-700">63 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-black/5">
                      <td className="py-2 px-3 font-black text-black">L (Paling Populer)</td>
                      <td className="py-2 px-3 font-bold text-black">58 cm</td>
                      <td className="py-2 px-3 font-bold text-black">72 cm</td>
                      <td className="py-2 px-3 font-bold text-black">64 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-black">XL</td>
                      <td className="py-2 px-3">61 cm</td>
                      <td className="py-2 px-3">74 cm</td>
                      <td className="py-2 px-3 font-semibold text-gray-700">65 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-black">XXL</td>
                      <td className="py-2 px-3">64 cm</td>
                      <td className="py-2 px-3">76 cm</td>
                      <td className="py-2 px-3 font-semibold text-gray-700">66 cm</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 text-gray-700 font-black">
                    <tr>
                      <th className="py-2.5 px-3">EU Size</th>
                      <th className="py-2.5 px-3">US Size</th>
                      <th className="py-2.5 px-3">UK Size</th>
                      <th className="py-2.5 px-3">Panjang Kaki (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-black">EU 40</td>
                      <td className="py-2 px-3">US 7</td>
                      <td className="py-2 px-3">UK 6</td>
                      <td className="py-2 px-3 font-semibold text-gray-700">25.0 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-black">EU 41</td>
                      <td className="py-2 px-3">US 8</td>
                      <td className="py-2 px-3">UK 7</td>
                      <td className="py-2 px-3 font-semibold text-gray-700">26.0 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-black/5">
                      <td className="py-2 px-3 font-black text-black">EU 42 (Paling Populer)</td>
                      <td className="py-2 px-3">US 8.5</td>
                      <td className="py-2 px-3">UK 7.5</td>
                      <td className="py-2 px-3 font-bold text-black">26.5 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-black">EU 43</td>
                      <td className="py-2 px-3">US 9.5</td>
                      <td className="py-2 px-3">UK 8.5</td>
                      <td className="py-2 px-3 font-semibold text-gray-700">27.5 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-black">EU 44</td>
                      <td className="py-2 px-3">US 10</td>
                      <td className="py-2 px-3">UK 9</td>
                      <td className="py-2 px-3 font-semibold text-gray-700">28.0 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-black">EU 45</td>
                      <td className="py-2 px-3">US 11</td>
                      <td className="py-2 px-3">UK 10</td>
                      <td className="py-2 px-3 font-semibold text-gray-700">29.0 cm</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            <button
              onClick={() => setShowSizeModal(false)}
              className="w-full py-3 bg-black text-white hover:bg-neutral-800 rounded-full font-black text-xs transition-colors"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
