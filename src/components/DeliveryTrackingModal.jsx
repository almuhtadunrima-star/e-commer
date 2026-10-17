import React, { useState, useEffect } from 'react';
import { 
  X, Truck, CheckCircle2, Clock, Package, MapPin, Copy, 
  ChevronRight, Play, RefreshCw, Check, Navigation, ExternalLink, 
  Activity, ShieldCheck 
} from 'lucide-react';
import { formatRupiah, formatDateIndo } from '../utils/format';
import LiveRouteMap from './LiveRouteMap';

export default function DeliveryTrackingModal({
  isOpen,
  onClose,
  order,
  onUpdateOrderStatus
}) {
  if (!isOpen || !order) return null;

  const [copiedResi, setCopiedResi] = useState(false);

  // Deteksi Otomatis Mode Gelap/Terang Default Perangkat (Device Default Setting)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDeviceThemeChange = (e) => setIsDarkMode(e.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDeviceThemeChange);
      return () => mediaQuery.removeEventListener('change', handleDeviceThemeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleDeviceThemeChange);
      return () => mediaQuery.removeListener(handleDeviceThemeChange);
    }
  }, []);

  // Daftar 6 Alur Status Sesuai Petunjuk Soal:
  // Pesanan Dibuat → Pembayaran Berhasil → Pesanan Diproses → Diserahkan ke Kurir → Dalam Pengiriman → Pesanan Sampai
  const trackingSteps = [
    {
      step: 1,
      title: "Pesanan Dibuat",
      desc: "Order berhasil dibuat di sistem e-commerce.",
      time: "10 Okt 21:05 WIB"
    },
    {
      step: 2,
      title: "Pembayaran Berhasil",
      desc: `Pembayaran terverifikasi lunas via ${order.paymentMethod?.name || 'QRIS'}.`,
      time: "10 Okt 21:07 WIB"
    },
    {
      step: 3,
      title: "Pesanan Diproses",
      desc: "Produk dicek kualitas (QC) dan dipacking kardus aman di Gudang.",
      time: "10 Okt 21:20 WIB"
    },
    {
      step: 4,
      title: "Diserahkan ke Kurir",
      desc: `Paket telah di-pickup oleh kurir operasional ${order.courier?.name || 'JNE'}.`,
      time: "10 Okt 22:00 WIB"
    },
    {
      step: 5,
      title: "Dalam Pengiriman",
      desc: `Kurir sedang menuju ke alamat tujuan (${order.customer?.cityRegion || 'Jakarta'}).`,
      time: "11 Okt 09:30 WIB"
    },
    {
      step: 6,
      title: "Pesanan Sampai",
      desc: `Paket diterima langsung oleh ${order.customer?.fullName || 'Penerima'}.`,
      time: "11 Okt 13:45 WIB"
    }
  ];

  // Default step: step 3 (Pesanan Diproses) or order.currentStep
  const currentStep = order.currentStep || 3;

  // Koordinat simulasi GPS rute pengiriman (Hub Gudang -> Penerima)
  const mapCoordinates = {
    1: { label: "Gudang Pusat MOVEO (Jakarta Barat)", status: "Menunggu Diproses di Hub", speed: "0 km/h", eta: "2-3 Hari", dist: "18.4 km" },
    2: { label: "Sentra Pembayaran & Tagging", status: "Pembayaran Lunas Terverifikasi", speed: "0 km/h", eta: "2-3 Hari", dist: "18.4 km" },
    3: { label: "Hub Sortir Logistik Cengkareng", status: "Pengemasan Kardus Aman (QC Selesai)", speed: "0 km/h", eta: "1-2 Hari", dist: "16.8 km" },
    4: { label: "Gerbang Tol Distribusi Ekspedisi", status: "Paket Di-Pickup Kurir Ekspedisi", speed: "28 km/h", eta: "Hari Ini", dist: "9.5 km" },
    5: { label: `Jl. Utama Menuju ${order.customer?.cityRegion || 'Lokasi Tujuan'}`, status: "Kurir On The Way Menuju Tujuan", speed: "42 km/h", eta: "12 Menit", dist: "1.2 km" },
    6: { label: `Alamat Rumah: ${order.customer?.fullName || 'Penerima'}`, status: "Paket Telah Sampai & Diterima", speed: "0 km/h", eta: "Telah Tiba", dist: "0 km" }
  };

  const currentCoords = mapCoordinates[currentStep] || mapCoordinates[3];

  const targetCity = order.customer?.cityRegion || 'Jakarta';
  const targetAddress = order.customer?.fullAddress ? `${order.customer.fullAddress}, ${targetCity}` : targetCity;
  const googleMapsDirectionsUrl = `https://www.google.com/maps?saddr=${encodeURIComponent('Hub Logistik MA Store Jakarta Barat, Indonesia')}&daddr=${encodeURIComponent(targetAddress + ', Indonesia')}&output=embed`;
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(targetAddress + ', Indonesia')}&t=m&z=13&ie=UTF8&iwloc=&output=embed`;
  const googleMapsDirectUrl = `https://www.google.com/maps/dir/?api=1&origin=Jakarta+Logistics+Hub&destination=${encodeURIComponent(targetAddress + ', Indonesia')}&travelmode=driving`;

  const handleNextStep = () => {
    if (currentStep < 6) {
      onUpdateOrderStatus(order.orderId, currentStep + 1);
    }
  };

  const handleResetStep = () => {
    onUpdateOrderStatus(order.orderId, 2);
  };

  const handleCopyResi = (resi) => {
    navigator.clipboard.writeText(resi);
    setCopiedResi(true);
    setTimeout(() => setCopiedResi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div 
          className="relative glass-ios border border-slate-300/80 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-300/70 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-sm shadow-sm">
                8
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-900">Pelacakan Pengiriman (Live Tracking)</h2>
                <p className="text-xs text-slate-600 font-semibold">Lacak perjalanan kurir dan paket pesanan Anda secara real-time</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 glass-ios-pill hover:bg-white/80 rounded-full text-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto">
            {/* Banner Nomor Resi & Kurir */}
            <div className="glass-ios-dark text-white p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl border border-white/20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{order.courier?.icon || '🚚'}</span>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-gray-300">
                    {order.courier?.name || 'JNE Regular'} ({order.courier?.service || 'Reguler'})
                  </span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-xs text-gray-300">Nomor Resi:</span>
                  <span className="font-mono text-base sm:text-lg font-black tracking-wider text-amber-300">
                    {order.resiNumber}
                  </span>
                  <button
                    onClick={() => handleCopyResi(order.resiNumber)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    title="Salin Nomor Resi"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copiedResi && <span className="text-[11px] text-green-300 font-bold">Tersalin!</span>}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-right">
                <span className="text-[11px] text-gray-300 block">Estimasi Sampai:</span>
                <span className="text-xs sm:text-sm font-bold text-white">{order.courier?.etd || '2 - 3 Hari Kerja'}</span>
              </div>
            </div>

            {/* LIVE INTERACTIVE ROUTE MAP & MOVING VEHICLE GPS SIMULATION */}
            <LiveRouteMap
              currentStep={currentStep}
              courier={order.courier}
              customer={order.customer}
              currentCoords={currentCoords}
              isDarkMode={isDarkMode}
              googleMapsEmbedUrl={googleMapsEmbedUrl}
              googleMapsDirectUrl={googleMapsDirectUrl}
              googleMapsDirectionsUrl={googleMapsDirectionsUrl}
              onStepChange={(newStep) => onUpdateOrderStatus(order.orderId, newStep)}
            />

            {/* Stepper Status 6 Tahapan Visual */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-black">
                  Progres Perjalanan Pesanan
                </h3>
                <span className="text-xs font-extrabold px-3.5 py-1 glass-ios-pill rounded-full text-black border border-white/70 shadow-xs">
                  Status: {trackingSteps[currentStep - 1].title}
                </span>
              </div>

              {/* Progress Stepper Bar */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/15">
                {trackingSteps.map((step) => {
                  const isDone = currentStep >= step.step;
                  const isCurrent = currentStep === step.step;

                  return (
                    <div key={step.step} className="relative flex items-start gap-4">
                      {/* Step Dot Icon */}
                      <div
                        className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          isDone
                            ? 'bg-black text-white ring-4 ring-black/10 shadow-md'
                            : 'bg-black/10 text-gray-400'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : step.step}
                      </div>

                      {/* Step Text Info */}
                      <div className={`flex-1 -mt-1 p-3.5 rounded-2xl transition-all ${
                        isCurrent ? 'glass-ios border border-white/90 shadow-sm' : ''
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <h4 className={`text-sm font-black ${
                            isCurrent ? 'text-black font-extrabold' : isDone ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {step.title}
                          </h4>
                          <span className="text-[11px] font-semibold text-gray-400">
                            {isDone ? step.time : 'Menunggu'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tombol Interaktif Penguji Alur: Percepat Status Kurir */}
            <div className="glass-ios-card border border-white/80 p-5 rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-black tracking-wider">
                    Panel Simulasi Kurir (Fitur Evaluasi User Flow)
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Klik tombol di samping untuk memajukan status pengiriman kurir ke langkah selanjutnya.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleResetStep}
                    className="p-2.5 glass-ios-pill border border-white/70 hover:bg-white rounded-xl text-xs font-bold text-gray-700 transition-all shadow-xs"
                    title="Ulangi simulasi dari awal"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    disabled={currentStep >= 6}
                    onClick={handleNextStep}
                    className="px-4 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-gray-300 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{currentStep >= 6 ? 'Paket Telah Tiba' : 'Percepat Status Pengiriman (+1 Step)'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Informasi Barang & Penerima */}
            <div className="glass-ios-card p-4 rounded-2xl border border-white/80 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-xs">
              <div>
                <span className="text-gray-400 font-bold block mb-1">Tujuan Pengiriman</span>
                <p className="font-black text-black">{order.customer?.fullName} ({order.customer?.phoneNumber})</p>
                <p className="text-gray-600">{order.customer?.fullAddress}, {order.customer?.cityRegion}</p>
              </div>

              <div>
                <span className="text-gray-400 font-bold block mb-1">Total Pesanan</span>
                <p className="font-black text-black">{formatRupiah(order.summary?.grandTotal)}</p>
                <p className="text-gray-600">{order.items?.length} Produk Sepatu & Apparel</p>
              </div>
            </div>
          </div>

          {/* Footer Close */}
          <div className="p-4 border-t border-white/60 bg-white/40 backdrop-blur-md flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 glass-ios-dark rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg"
            >
              Tutup Pelacakan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
