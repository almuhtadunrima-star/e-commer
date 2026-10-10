import React, { useState } from 'react';
import { X, Heart, Star, Truck, RefreshCw, Check, ShieldCheck, Plus, Minus, Zap } from 'lucide-react';
import { formatRupiah } from '../utils/format';

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onDirectCheckout
}) {
  if (!isOpen || !product) return null;

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] || product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showShippingInfo, setShowShippingInfo] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];

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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 lg:p-10">
        <div 
          className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Tutup detail produk"
            className="absolute top-5 right-5 p-2.5 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
            {/* Kiri: Galeri Foto Produk (7 kolom) */}
            <div className="lg:col-span-7 bg-[#f6f6f6] p-6 sm:p-10 flex flex-col justify-between items-center relative">
              <div className="w-full flex justify-between items-center mb-4">
                <span className="text-xs font-black text-gray-400 tracking-wider uppercase">
                  {product.category} • {product.gender}
                </span>
                <div className="flex items-center space-x-1 text-sm font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewsCount} Ulasan)</span>
                </div>
              </div>

              {/* Foto Utama */}
              <div className="w-full aspect-square max-w-[460px] flex items-center justify-center py-4">
                <img
                  src={activeColor.image}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Thumbnail Varian Warna */}
              <div className="w-full">
                <span className="text-[11px] font-bold text-gray-500 mb-2 block text-left">
                  PILIH WARNA: <strong className="text-black">{activeColor.name}</strong>
                </span>
                <div className="flex space-x-3">
                  {product.colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColorIdx(i)}
                      className={`w-16 h-16 rounded-xl bg-white border-2 p-1 overflow-hidden transition-all flex items-center justify-center ${
                        selectedColorIdx === i 
                          ? 'border-black ring-2 ring-black/20 shadow-md scale-105' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={c.image} alt={c.name} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Kanan: Spesifikasi, Ukuran & Tombol Checkout (5 kolom) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between text-left">
              <div>
                {/* Badge Status */}
                <div className="flex items-center gap-2 mb-2">
                  {product.badge && (
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-600 text-white">
                      {product.badge}
                    </span>
                  )}
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                    Ready Stock ({product.stock} pcs)
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#111111] leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#707072] font-semibold mt-1 mb-4">
                  {product.subtitle}
                </p>

                {/* Harga dalam Rupiah */}
                <div className="flex items-baseline space-x-3 mb-6 pb-4 border-b border-gray-100">
                  <span className="text-2xl sm:text-3xl font-black text-[#111111]">
                    {formatRupiah(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through font-semibold">
                      {formatRupiah(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      Hemat {formatRupiah(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>

                {/* Pemilihan Ukuran Sepatu (Variant 1) */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-black">
                      PILIH UKURAN: <strong className="text-black font-extrabold">{selectedSize}</strong>
                    </span>
                    <button 
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-xs text-gray-500 hover:text-black font-bold underline"
                    >
                      Panduan Ukuran
                    </button>
                  </div>

                  {showSizeGuide && (
                    <div className="bg-gray-50 p-3 rounded-xl mb-3 text-xs text-gray-700 border border-gray-200">
                      <p className="font-bold mb-1">Standar Ukuran Nike ID:</p>
                      <p>• EU 40 = 25.0 cm | EU 41 = 26.0 cm | EU 42 = 26.5 cm</p>
                      <p>• EU 43 = 27.5 cm | EU 44 = 28.0 cm | EU 45 = 29.0 cm</p>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border transition-all ${
                          selectedSize === size
                            ? 'border-black bg-black text-white shadow-md'
                            : 'border-gray-200 hover:border-black text-[#111] bg-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pemilihan Kuantitas (Quantity) */}
                <div className="mb-6 flex items-center justify-between bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-700">Jumlah Pesanan:</span>
                  <div className="flex items-center space-x-3 bg-white border border-gray-200 rounded-full px-3 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 hover:text-black text-gray-500 active:scale-90"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-1 hover:text-black text-gray-500 active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tombol Aksi Pembelian */}
                <div className="space-y-3 mb-6">
                  {/* Beli Sekarang (Langsung Checkout) */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-4 bg-black text-white hover:bg-gray-800 rounded-full font-bold text-sm tracking-tight transition-all active:scale-[0.99] flex items-center justify-center space-x-2 shadow-xl"
                  >
                    <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>Beli Sekarang (Langsung Checkout)</span>
                  </button>

                  {/* Tambah ke Keranjang */}
                  <button
                    onClick={handleAdd}
                    className="w-full py-3.5 border-2 border-black hover:bg-gray-50 text-black rounded-full font-bold text-sm tracking-tight transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Berhasil Ditambahkan!</span>
                      </>
                    ) : (
                      <span>Tambah ke Keranjang</span>
                    )}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => onToggleFavorite(product)}
                    className="w-full py-3 border border-gray-200 hover:border-black rounded-full font-bold text-xs tracking-tight transition-all text-gray-700 flex items-center justify-center space-x-2"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
                    <span>{isFavorite ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}</span>
                  </button>
                </div>

                {/* Deskripsi Produk */}
                <div className="text-xs text-gray-700 leading-relaxed mb-5 pb-5 border-b border-gray-100">
                  <p>{product.description}</p>
                </div>

                {/* Fitur Utama */}
                <div className="mb-5">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-black mb-2">
                    Spesifikasi & Keunggulan
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
                    {product.details?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Accordion Informasi Pengiriman & Retur */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowShippingInfo(!showShippingInfo)}
                    className="w-full flex items-center justify-between text-xs font-bold text-black py-2 hover:text-gray-600"
                  >
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4" /> Pengiriman Cepat & Garansi Retur 60 Hari
                    </span>
                    <span className="font-bold">{showShippingInfo ? '−' : '+'}</span>
                  </button>
                  {showShippingInfo && (
                    <div className="text-xs text-gray-600 py-2 space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p>• <strong>Gratis Ongkir:</strong> Berlaku otomatis untuk pesanan di atas Rp 1.500.000.</p>
                      <p>• <strong>Pilihan Ekspedisi:</strong> JNE, SiCepat, J&T, AnterAja, dan GoSend Instant.</p>
                      <p>• <strong>100% Original:</strong> Garansi uang kembali jika produk terbukti tidak asli.</p>
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
