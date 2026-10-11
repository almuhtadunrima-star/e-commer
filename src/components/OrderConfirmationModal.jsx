import React from 'react';
import { CheckCircle2, ArrowRight, Truck, Package, Printer, Share2, MapPin, CreditCard, Calendar } from 'lucide-react';
import { formatRupiah, formatDateIndo } from '../utils/format';

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  order,
  onOpenTracking
}) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div 
          className="relative glass-ios border border-white/80 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Sukses */}
          <div className="bg-emerald-600/90 backdrop-blur-xl text-white p-8 text-center relative overflow-hidden border-b border-emerald-400/30">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-10">
              <Package className="w-48 h-48" />
            </div>

            <CheckCircle2 className="w-16 h-16 mx-auto mb-3 text-white filter drop-shadow-md" />
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Pembayaran Berhasil & Pesanan Dikonfirmasi!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">
              Terima kasih telah berbelanja. Pesanan Anda saat ini sedang disiapkan oleh tim gudang.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-800/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-white/20 shadow-sm">
              <span>Order ID:</span>
              <span className="text-white tracking-wider">{order.orderId}</span>
            </div>
          </div>

          {/* Rincian Faktur / Invoice Pesanan */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Meta Info Bar: Tanggal, Metode Bayar, Kurir */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 glass-ios-card p-4 rounded-2xl border border-white/80 text-xs shadow-xs">
              <div className="space-y-1">
                <span className="text-gray-400 block font-semibold">Waktu Pemesanan</span>
                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  {formatDateIndo(order.paidAt)}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 block font-semibold">Metode Pembayaran</span>
                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                  {order.paymentMethod.name}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 block font-semibold">Jasa Pengiriman</span>
                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-gray-500" />
                  {order.courier.name} ({order.courier.service})
                </span>
              </div>
            </div>

            {/* Rincian Produk Dipesan */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-black mb-3">
                Rincian Produk ({order.items.length} Item)
              </h4>

              <div className="border border-white/70 rounded-2xl divide-y divide-white/60 overflow-hidden glass-ios-card shadow-xs">
                {order.items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="p-4 flex items-center gap-4 bg-white/40 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-white/60 backdrop-blur-md rounded-xl p-1.5 flex-shrink-0 flex items-center justify-center border border-white/80 shadow-xs">
                      <img
                        src={item.selectedImage || item.colors[0]?.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 text-xs">
                      <h5 className="font-black text-black text-sm">{item.name}</h5>
                      <p className="text-gray-500 mt-0.5">
                        Ukuran: <strong>{item.selectedSize}</strong> • Warna: <strong>{item.selectedColor}</strong> • Qty: <strong>{item.quantity}</strong>
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <span className="font-black text-black text-sm block">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                      <span className="text-gray-400">@{formatRupiah(item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alamat Pengiriman */}
            <div className="glass-ios-card p-4 rounded-2xl border border-white/80 text-xs space-y-1 shadow-xs">
              <span className="font-black text-black uppercase tracking-wider block mb-1">
                Alamat Tujuan Pengiriman
              </span>
              <p className="font-bold text-black">{order.customer.fullName} ({order.customer.phoneNumber})</p>
              <p className="text-gray-600">{order.customer.fullAddress}</p>
              <p className="text-gray-600">{order.customer.cityRegion}, {order.customer.postalCode}</p>
              {order.customer.orderNotes && (
                <p className="text-gray-500 italic pt-1">
                  Catatan: "{order.customer.orderNotes}"
                </p>
              )}
            </div>

            {/* Rincian Keuangan */}
            <div className="glass-ios-card p-4 rounded-2xl border border-white/80 space-y-2 text-xs text-gray-600 shadow-sm">
              <div className="flex justify-between">
                <span>Subtotal Produk</span>
                <span className="font-bold text-black">{formatRupiah(order.summary.subtotal)}</span>
              </div>
              {order.summary.discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>Diskon Kupon Promo ({order.summary.discountPercent}%)</span>
                  <span>-{formatRupiah(order.summary.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Ongkos Kirim ({order.courier.name})</span>
                <span className="font-bold text-black">
                  {order.courier.isFreePromo ? (
                    <span className="text-green-700">Rp 0 (Gratis Ongkir)</span>
                  ) : (
                    formatRupiah(order.courier.finalCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/60 text-base font-black text-black">
                <span>Total Pembayaran</span>
                <span className="text-black">{formatRupiah(order.summary.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Footer Tombol Aksi */}
          <div className="p-6 border-t border-white/60 bg-white/40 backdrop-blur-md flex flex-col sm:flex-row gap-3">
            {/* Tombol Utama: Lacak Pengiriman (Step 8) */}
            <button
              onClick={() => {
                onClose();
                onOpenTracking(order);
              }}
              className="flex-1 py-4 bg-black text-white hover:bg-neutral-800 rounded-full font-black text-sm tracking-tight transition-all active:scale-[0.99] flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl"
            >
              <Truck className="w-4 h-4 text-white" />
              <span>Lacak Pengiriman Pesanan (Tracking Resi)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="py-4 px-6 glass-ios-pill border border-white/80 hover:bg-white/80 rounded-full font-bold text-xs text-gray-800 hover:text-black transition-all"
            >
              Belanja Produk Lain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
