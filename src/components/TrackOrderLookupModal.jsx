import React, { useState } from 'react';
import { X, Search, Truck, ArrowRight, Package } from 'lucide-react';
import { formatRupiah, formatDateIndo } from '../utils/format';

export default function TrackOrderLookupModal({
  isOpen,
  onClose,
  recentOrders,
  onSelectOrderToTrack
}) {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMsg("Masukkan Order ID atau Nomor Resi.");
      return;
    }

    const found = recentOrders.find(
      (o) =>
        o.orderId.toLowerCase() === searchQuery.trim().toLowerCase() ||
        o.resiNumber.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (found) {
      onSelectOrderToTrack(found);
      onClose();
    } else {
      setErrorMsg("Pesanan tidak ditemukan. Periksa kembali nomor Order ID Anda.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div 
          className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 z-10 text-left animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <Truck className="w-5 h-5 text-black" />
              <h3 className="text-lg font-black text-black">Lacak Status Pesanan</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Pencarian Resi / Order ID */}
          <form onSubmit={handleSearchSubmit} className="mt-5 space-y-3">
            <label className="text-xs font-bold text-gray-700 block">
              Masukkan Order ID (contoh: ORD-...) atau No. Resi (contoh: JNE...ID)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: ORD-20261010-8942"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setErrorMsg('');
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-sm outline-none focus:border-black font-semibold"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>Cari</span>
              </button>
            </div>
            {errorMsg && <p className="text-xs text-red-500 font-bold">{errorMsg}</p>}
          </form>

          {/* Riwayat Pesanan Terbaru di Browser Ini */}
          <div className="mt-8">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">
              Riwayat Transaksi Terakhir Anda ({recentOrders.length})
            </h4>

            {recentOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
                <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p>Belum ada riwayat pesanan aktif.</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Selesaikan satu pesanan untuk melihat pelacakan otomatis di sini.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {recentOrders.map((ord) => (
                  <div
                    key={ord.orderId}
                    onClick={() => {
                      onSelectOrderToTrack(ord);
                      onClose();
                    }}
                    className="p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-black">{ord.orderId}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {ord.courier?.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Resi: <strong>{ord.resiNumber}</strong> • {formatRupiah(ord.summary?.grandTotal)}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-gray-400" />
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
