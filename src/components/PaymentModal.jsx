import React, { useState, useEffect } from 'react';
import { X, Check, Copy, Clock, ShieldCheck, ArrowRight, CheckCircle2, QrCode, AlertCircle } from 'lucide-react';
import { paymentMethods } from '../data/products';
import { formatRupiah } from '../utils/format';

export default function PaymentModal({
  isOpen,
  onClose,
  checkoutData,
  onPaymentSuccess
}) {
  if (!isOpen || !checkoutData) return null;

  const [selectedMethodId, setSelectedMethodId] = useState("qris");
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 menit
  const [copiedText, setCopiedText] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectedMethod = paymentMethods.find((m) => m.id === selectedMethodId) || paymentMethods[0];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      onPaymentSuccess({
        ...checkoutData,
        paymentMethod: selectedMethod,
        paidAt: new Date(),
        paymentStatus: "Lunas / Pembayaran Berhasil"
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div 
          className="relative glass-ios border border-white/80 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/60 flex items-center justify-between bg-white/40 backdrop-blur-md">
            <div className="flex items-center space-x-3 text-left">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-sm shadow-sm">
                6
              </span>
              <div>
                <h2 className="text-xl font-black text-black">Simulasi Pembayaran</h2>
                <p className="text-xs text-gray-500 font-medium">Pilih channel pembayaran dan konfirmasi transaksi</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 glass-ios-pill hover:bg-white/80 rounded-full text-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto text-left">
            {/* Total Pembayaran & Batas Waktu */}
            <div className="glass-ios-dark p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl border border-white/20">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total yang Harus Dibayar</span>
                <h3 className="text-3xl font-black text-white mt-1">
                  {formatRupiah(checkoutData.summary.grandTotal)}
                </h3>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <div className="text-xs">
                  <span className="text-gray-300 block">Sisa Waktu Pembayaran</span>
                  <span className="font-mono font-black text-white text-sm">{formatTimer(timeLeft)}</span>
                </div>
              </div>
            </div>

            {/* Pilihan Metode Pembayaran */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-black mb-3">
                Pilih Metode Pembayaran:
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                {paymentMethods.map((pm) => {
                  const isSelected = selectedMethodId === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setSelectedMethodId(pm.id)}
                      className={`p-3.5 rounded-2xl border transition-all text-left ${
                        isSelected
                          ? 'border-black bg-black text-white shadow-lg'
                          : 'glass-ios-card border-white/75 hover:border-white text-gray-900 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{pm.icon}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <span className={`text-xs font-bold block leading-snug ${isSelected ? 'text-white' : 'text-black'}`}>{pm.name}</span>
                      <span className={`text-[10px] font-medium ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{pm.category}</span>
                    </button>
                  );
                })}
              </div>

              {/* Rincian Instruksi Pembayaran Sesuai Metode */}
              <div className="glass-ios-card border border-white/80 rounded-3xl p-6 shadow-sm">
                {selectedMethod.id === 'qris' && (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <span className="text-xs font-extrabold text-black uppercase tracking-wider">
                      Scan QRIS Menggunakan Aplikasi Mobile Banking / E-Wallet Anda
                    </span>
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-md border border-white/80">
                      <img
                        src={selectedMethod.details.qrCodeImage}
                        alt="QRIS Barcode"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    <div className="text-xs text-gray-600 max-w-sm space-y-1">
                      <p>1. Buka aplikasi GoPay, OVO, DANA, BCA Mobile, atau Livin' by Mandiri.</p>
                      <p>2. Pilih menu <strong>Scan / Bayar QRIS</strong>.</p>
                      <p>3. Arahkan kamera ke kode QR di atas & masukkan PIN pembayaran Anda.</p>
                    </div>
                  </div>
                )}

                {selectedMethod.id.includes('va') && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/60">
                      <div>
                        <span className="text-xs text-gray-500 block">Bank Penerbit Virtual Account</span>
                        <h5 className="text-sm font-extrabold text-black">{selectedMethod.details.bankName}</h5>
                      </div>
                      <span className="text-xs font-bold bg-green-100/80 text-green-800 border border-emerald-300 px-3 py-1 rounded-full shadow-xs">
                        Otomatis Terverifikasi
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Nomor Virtual Account</span>
                      <div className="flex items-center justify-between bg-white/70 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/80 shadow-xs">
                        <span className="font-mono text-base font-black tracking-wider text-black">
                          {selectedMethod.details.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedMethod.details.accountNumber)}
                          className="px-3.5 py-1.5 glass-ios-dark rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedText ? 'Tersalin!' : 'Salin'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1 pt-2">
                      <p className="font-bold text-black">Petunjuk Pembayaran:</p>
                      <p>• Masuk ke m-Banking → Pilih Transfer → Virtual Account.</p>
                      <p>• Masukkan nomor VA di atas, nominal akan muncul otomatis.</p>
                      <p>• Konfirmasi dan masukkan PIN transaksi Anda.</p>
                    </div>
                  </div>
                )}

                {selectedMethod.id === 'ewallet-gopay' && (
                  <div className="space-y-3 text-center sm:text-left">
                    <h5 className="text-sm font-bold text-black">Pembayaran via GoPay / DANA</h5>
                    <p className="text-xs text-gray-600">
                      Kami akan mengirimkan notifikasi persetujuan bayar sebesar{' '}
                      <strong>{formatRupiah(checkoutData.summary.grandTotal)}</strong> ke nomor HP terdaftar Anda:{' '}
                      <strong className="text-black font-bold">{checkoutData.customer.phoneNumber}</strong>.
                    </p>
                  </div>
                )}

                {selectedMethod.id === 'cod' && (
                  <div className="space-y-3">
                    <h5 className="text-sm font-bold text-black">Cash On Delivery (Bayar di Tempat)</h5>
                    <p className="text-xs text-gray-600">
                      Anda cukup membayar tunai sebesar{' '}
                      <strong>{formatRupiah(checkoutData.summary.grandTotal)}</strong> langsung kepada kurir{' '}
                      <strong>{checkoutData.courier.name}</strong> saat paket tiba di alamat Anda.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Simulasi Pembayaran Sesuai Flow Assignment */}
            <div className="space-y-3 pt-4 border-t border-white/60">
              <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Mode Simulasi:</strong> Klik tombol di bawah ini untuk mensimulasikan sistem pembayaran berhasil tanpa gateway sungguhan, lalu langsung melihat halaman Konfirmasi Pesanan & Pelacakan Pengiriman.
                </span>
              </div>

              <button
                type="button"
                disabled={isSimulating}
                onClick={handleSimulatePayment}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-full font-black text-sm tracking-tight transition-all active:scale-[0.99] flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl"
              >
                {isSimulating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Pembayaran...</span>
                  </div>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Simulasikan Pembayaran Berhasil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
