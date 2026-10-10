import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2, Tag } from 'lucide-react';
import { formatRupiah } from '../utils/format';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const freeShippingThreshold = 1500000;
  const isFreeShipping = subtotal >= freeShippingThreshold;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'DISKON10' || code === 'NIKE10') {
      setDiscountPercent(10);
      setPromoSuccess('Kupon Aktif: Diskon 10% berhasil dipotong!');
      setPromoError('');
    } else if (code === 'DISKON20' || code === 'NIKE20') {
      setDiscountPercent(20);
      setPromoSuccess('Kupon Eksklusif: Diskon 20% berhasil dipotong!');
      setPromoError('');
    } else {
      setPromoError('Kode kupon tidak valid. Coba gunakan "DISKON10" atau "DISKON20"');
      setPromoSuccess('');
    }
  };

  const handleCheckoutClick = () => {
    onClose();
    onProceedToCheckout({
      appliedDiscountPercent: discountPercent,
      discountAmount: discountAmount
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-black text-black">
              Keranjang Belanja ({items.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Free Shipping Progress Indicator */}
            <div className="bg-[#f5f5f5] p-4 rounded-2xl border border-gray-100">
              {isFreeShipping ? (
                <div className="flex items-center space-x-2 text-xs font-bold text-green-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Selamat! Anda mendapatkan promo <strong>GRATIS ONGKIR</strong>!</span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                    <span>Target Gratis Ongkir (Min. {formatRupiah(freeShippingThreshold)})</span>
                    <span>Kurang {formatRupiah(freeShippingThreshold - subtotal)}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-black h-full transition-all duration-300 rounded-full"
                      style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {items.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <p className="text-base font-bold text-gray-700">Keranjang belanja Anda masih kosong.</p>
                <p className="text-xs text-gray-500">Silakan pilih sepatu favorit Anda dan tambahkan ke keranjang.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors shadow-md"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              /* Items list */
              <div className="space-y-4 divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="pt-4 flex gap-4 text-left">
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-[#f6f6f6] rounded-xl p-2 flex-shrink-0 flex items-center justify-center border border-gray-100">
                      <img
                        src={item.selectedImage || item.colors[0]?.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-black leading-tight line-clamp-1">{item.name}</h4>
                          <span className="text-sm font-extrabold text-black ml-2 whitespace-nowrap">
                            {formatRupiah(item.price * item.quantity)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                        <div className="text-xs text-gray-600 mt-1 space-x-2">
                          <span>Ukuran: <strong>{item.selectedSize}</strong></span>
                          <span>•</span>
                          <span>Warna: <strong>{item.selectedColor}</strong></span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2 border border-gray-200 rounded-full px-2 py-0.5 bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:text-black text-gray-500 active:scale-90"
                            title="Kurangi kuantitas"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-extrabold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item, Math.min(item.stock || 99, item.quantity + 1))}
                            className="p-1 hover:text-black text-gray-500 active:scale-90"
                            title="Tambah kuantitas"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Hapus barang"
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

          {/* Footer / Summary / Proceed to Checkout Button */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Kode Kupon (e.g. DISKON10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full border border-gray-200 rounded-full pl-9 pr-3 py-2 text-xs uppercase outline-none focus:border-black font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-100 hover:bg-black hover:text-white rounded-full text-xs font-bold transition-colors"
                >
                  Gunakan
                </button>
              </form>
              {promoSuccess && <p className="text-xs text-green-600 font-bold">{promoSuccess}</p>}
              {promoError && <p className="text-xs text-red-500 font-medium">{promoError}</p>}

              {/* Rincian Harga Sementara */}
              <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal Produk</span>
                  <span className="font-bold text-black">{formatRupiah(subtotal)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Potongan Kupon ({discountPercent}%)</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimasi Ongkos Kirim</span>
                  <span className="font-semibold text-gray-800">
                    {isFreeShipping ? 'Gratis (Promo)' : 'Dihitung di checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-black pt-2 border-t border-gray-200">
                  <span>Total Sementara</span>
                  <span>{formatRupiah(subtotal - discountAmount)}</span>
                </div>
              </div>

              {/* Tombol Lanjut ke Checkout */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-4 bg-black text-white hover:bg-gray-800 rounded-full font-bold text-sm tracking-tight transition-all active:scale-[0.99] flex items-center justify-center space-x-2 shadow-xl"
                >
                  <span>Lanjut ke Pengiriman & Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  <span>Transaksi Terlindungi & Bergaransi 100%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
