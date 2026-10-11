import React, { useState } from 'react';
import { 
  X, Truck, CheckCircle2, Clock, Package, MapPin, Copy, 
  ChevronRight, Play, RefreshCw, Check, Navigation, Compass, 
  Layers, LocateFixed, Activity, ShieldCheck 
} from 'lucide-react';
import { formatRupiah, formatDateIndo } from '../utils/format';

export default function DeliveryTrackingModal({
  isOpen,
  onClose,
  order,
  onUpdateOrderStatus
}) {
  if (!isOpen || !order) return null;

  const [copiedResi, setCopiedResi] = useState(false);
  const [mapTheme, setMapTheme] = useState('dark'); // 'dark' | 'light'
  const [zoomLevel, setZoomLevel] = useState(1);

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
    1: { x: 75, y: 195, label: "Gudang Pusat MOVEO", status: "Menunggu Diproses", speed: "0 km/h", eta: "2-3 Hari", dist: "18.4 km", pct: "10%" },
    2: { x: 145, y: 180, label: "Sentra Pembayaran & Tagging", status: "Pembayaran Lunas", speed: "0 km/h", eta: "2-3 Hari", dist: "18.4 km", pct: "25%" },
    3: { x: 230, y: 155, label: "Hub Sortir Logistik", status: "Pengemasan Selesai", speed: "0 km/h", eta: "1-2 Hari", dist: "16.8 km", pct: "45%" },
    4: { x: 325, y: 130, label: "Gerbang Tol Distribusi", status: "Paket Di-Pickup Kurir", speed: "28 km/h", eta: "Hari Ini", dist: "9.5 km", pct: "65%" },
    5: { x: 420, y: 95, label: "Arteri Menuju Lokasi", status: "Kurir On The Way", speed: "42 km/h", eta: "12 Menit", dist: "1.2 km", pct: "85%" },
    6: { x: 505, y: 65, label: "Alamat Penerima", status: "Paket Berhasil Diterima", speed: "0 km/h", eta: "Tiba", dist: "0 km", pct: "100%" }
  };

  const currentCoords = mapCoordinates[currentStep] || mapCoordinates[3];

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
          className="relative glass-ios border border-white/80 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/60 flex items-center justify-between bg-white/40 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-sm shadow-sm">
                8
              </span>
              <div>
                <h2 className="text-xl font-black text-black">Pelacakan Pengiriman (Live Tracking)</h2>
                <p className="text-xs text-gray-500 font-medium">Lacak status perjalanan kurir dan paket pesanan Anda secara real-time</p>
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

            {/* PETA LIVE GPS DELIVERY TRACKING (INTERACTIVE RADAR & ROUTE MAP) */}
            <div className="glass-ios-card rounded-3xl border border-white/90 overflow-hidden shadow-lg relative">
              {/* Map Bar Header */}
              <div className="px-5 py-3.5 bg-neutral-900/90 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black tracking-wider uppercase text-white">
                      Live GPS Tracking Satelit
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Sinyal 5G Aktif
                  </span>
                </div>

                {/* Map Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMapTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/10 hover:bg-white/20 transition-all border border-white/10 flex items-center gap-1"
                    title="Ubah Tampilan Peta"
                  >
                    <Layers className="w-3 h-3" />
                    <span>{mapTheme === 'dark' ? 'Tema Gelap' : 'Tema Terang'}</span>
                  </button>

                  <div className="flex items-center bg-white/10 rounded-lg border border-white/10 text-xs overflow-hidden">
                    <button 
                      onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
                      className="px-2 py-1 hover:bg-white/20 font-bold transition-colors"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <span className="px-1.5 text-[10px] font-mono text-gray-300">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button 
                      onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                      className="px-2 py-1 hover:bg-white/20 font-bold transition-colors"
                      title="Zoom In"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Map Canvas SVG */}
              <div 
                className={`relative w-full h-[250px] sm:h-[280px] overflow-hidden transition-colors duration-300 ${
                  mapTheme === 'dark' 
                    ? 'bg-gradient-to-b from-neutral-950 via-slate-900 to-neutral-900' 
                    : 'bg-gradient-to-b from-slate-100 via-sky-50 to-slate-200'
                }`}
              >
                <div 
                  className="w-full h-full transition-transform duration-300 origin-center flex items-center justify-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <svg 
                    viewBox="0 0 580 260" 
                    className="w-full h-full select-none"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      {/* Grid Pattern */}
                      <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path 
                          d="M 30 0 L 0 0 0 30" 
                          fill="none" 
                          stroke={mapTheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} 
                          strokeWidth="1" 
                        />
                      </pattern>

                      {/* Route Glow Filter */}
                      <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>

                      {/* Route Line Gradient */}
                      <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>

                    {/* Background Grid */}
                    <rect width="580" height="260" fill="url(#gridPattern)" />

                    {/* Urban Road Network Vectors (Background Map) */}
                    <g stroke={mapTheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'} strokeWidth="2" fill="none">
                      {/* Arterial Roads */}
                      <path d="M 0 100 Q 150 120 300 80 T 580 90" strokeWidth="3" />
                      <path d="M 0 200 Q 200 180 400 220 T 580 180" strokeWidth="2.5" />
                      <path d="M 100 0 Q 120 130 90 260" strokeWidth="2" />
                      <path d="M 260 0 Q 240 140 280 260" strokeWidth="2.5" />
                      <path d="M 450 0 Q 430 110 470 260" strokeWidth="2" />
                      {/* Ring Road Bypass */}
                      <circle cx="290" cy="130" r="95" strokeWidth="1.5" strokeDasharray="4 4" />
                    </g>

                    {/* River / Water Feature Accent */}
                    <path 
                      d="M -10 220 Q 180 260 250 200 T 590 240" 
                      fill="none" 
                      stroke={mapTheme === 'dark' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(56, 189, 248, 0.35)'} 
                      strokeWidth="12" 
                      strokeLinecap="round"
                    />

                    {/* Urban Zones / Landmarks */}
                    <text x="35" y="240" fill={mapTheme === 'dark' ? '#64748b' : '#94a3b8'} fontSize="9" fontWeight="bold">
                      JAKARTA BARAT
                    </text>
                    <text x="250" y="35" fill={mapTheme === 'dark' ? '#64748b' : '#94a3b8'} fontSize="9" fontWeight="bold">
                      TRANS-JAVA HIGHWAY
                    </text>
                    <text x="440" y="240" fill={mapTheme === 'dark' ? '#64748b' : '#94a3b8'} fontSize="9" fontWeight="bold">
                      {order.customer?.cityRegion ? order.customer.cityRegion.toUpperCase() : 'JAKARTA SELATAN'}
                    </text>

                    {/* The Active GPS Delivery Route Path */}
                    {/* Path coordinates: Start (75, 195) -> Hub (145, 180) -> Sortir (230, 155) -> Tol (325, 130) -> Main Street (420, 95) -> Destination (505, 65) */}
                    <path 
                      id="fullDeliveryPath"
                      d="M 75 195 C 120 190, 180 170, 230 155 C 280 140, 310 135, 360 120 C 400 105, 460 85, 505 65" 
                      fill="none" 
                      stroke={mapTheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'} 
                      strokeWidth="5" 
                      strokeLinecap="round"
                    />

                    {/* Animated Route Glow Line */}
                    <path 
                      d="M 75 195 C 120 190, 180 170, 230 155 C 280 140, 310 135, 360 120 C 400 105, 460 85, 505 65" 
                      fill="none" 
                      stroke="url(#routeGradient)" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                      strokeDasharray="8 6"
                      filter="url(#routeGlow)"
                      className="animate-pulse"
                    />

                    {/* Origin Point: MOVEO Central Logistics Hub */}
                    <g transform="translate(75, 195)">
                      <circle r="12" fill={mapTheme === 'dark' ? '#1e293b' : '#ffffff'} stroke="#10b981" strokeWidth="2.5" />
                      <circle r="5" fill="#10b981" />
                      {/* Label Pin */}
                      <rect x="-55" y="-32" width="110" height="20" rx="10" fill={mapTheme === 'dark' ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.95)'} stroke="#10b981" strokeWidth="1" />
                      <text x="0" y="-18" textAnchor="middle" fill={mapTheme === 'dark' ? '#ffffff' : '#0f172a'} fontSize="8.5" fontWeight="900">
                        📦 MOVEO HUB
                      </text>
                    </g>

                    {/* Destination Point: Customer Location */}
                    <g transform="translate(505, 65)">
                      {/* Pulsing Target Halo */}
                      <circle r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
                      <circle r="12" fill={mapTheme === 'dark' ? '#1e293b' : '#ffffff'} stroke="#ef4444" strokeWidth="2.5" />
                      <circle r="5" fill="#ef4444" />
                      {/* Destination Label Pin */}
                      <rect x="-65" y="-32" width="130" height="20" rx="10" fill={mapTheme === 'dark' ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.95)'} stroke="#ef4444" strokeWidth="1" />
                      <text x="0" y="-18" textAnchor="middle" fill={mapTheme === 'dark' ? '#ffffff' : '#0f172a'} fontSize="8.5" fontWeight="900">
                        📍 TUJUAN PEMESAN
                      </text>
                    </g>

                    {/* Moving Live Courier Vehicle Pin */}
                    <g 
                      transform={`translate(${currentCoords.x}, ${currentCoords.y})`}
                      className="transition-all duration-700 ease-out"
                    >
                      {/* Radar Pulse Wave Rings */}
                      <circle r="24" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.3" className="animate-ping" />
                      <circle r="16" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" strokeWidth="1.5" className="animate-pulse" />
                      
                      {/* Main Courier Marker Base */}
                      <circle r="13" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" filter="url(#routeGlow)" />
                      
                      {/* Motor / Truck Icon Graphic */}
                      <text x="0" y="4" textAnchor="middle" fontSize="11" fill="#ffffff" fontWeight="bold">
                        {currentStep >= 4 ? '🛵' : '🏢'}
                      </text>

                      {/* Floating Courier Badge */}
                      <g transform="translate(0, -22)">
                        <rect x="-55" y="-12" width="110" height="18" rx="9" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                        <text x="0" y="0" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                          {currentCoords.status}
                        </text>
                      </g>
                    </g>
                  </svg>
                </div>

                {/* Telemetry Badge Overlay (Floating on Map Bottom Left) */}
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl text-white shadow-xl flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-300 font-semibold uppercase">Posisi Kurir:</span>
                      <span className="text-xs font-black text-white">{currentCoords.label}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] font-bold">
                      <span className="text-emerald-400">Kecepatan: {currentCoords.speed}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-cyan-300">Sisa Jarak: {currentCoords.dist}</span>
                    </div>
                  </div>
                </div>

                {/* Compass Floating Indicator Top Right */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 w-8 h-8 rounded-full flex items-center justify-center text-white/80 shadow-md">
                  <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '20s' }} />
                </div>
              </div>

              {/* Realtime Fleet Telemetry Bar */}
              <div className="p-3.5 bg-neutral-900 border-t border-white/10 text-white grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 block font-semibold">Armada Kurir</span>
                  <span className="font-bold text-white text-xs truncate block">{order.courier?.name || 'JNE'} Fleet</span>
                </div>
                <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 block font-semibold">Nama Driver</span>
                  <span className="font-bold text-emerald-400 text-xs block">Budi Pratama</span>
                </div>
                <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 block font-semibold">Plat Nomor</span>
                  <span className="font-bold text-amber-300 font-mono text-xs block">B 4921 TXP</span>
                </div>
                <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 block font-semibold">Estimasi Tiba</span>
                  <span className="font-bold text-cyan-300 text-xs block">{currentCoords.eta}</span>
                </div>
              </div>
            </div>

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
