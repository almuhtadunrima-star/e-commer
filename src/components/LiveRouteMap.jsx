import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, Truck, MapPin, Play, Pause, RotateCcw, 
  ExternalLink, CheckCircle2, ShieldCheck, Activity, Compass, Layers
} from 'lucide-react';

export default function LiveRouteMap({
  currentStep = 4,
  courier,
  customer,
  currentCoords,
  isDarkMode = false,
  googleMapsEmbedUrl,
  googleMapsDirectUrl,
  googleMapsDirectionsUrl,
  onStepChange
}) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [mapViewType, setMapViewType] = useState('directions'); // 'directions' | 'location'
  const [simulationProgress, setSimulationProgress] = useState(() => {
    // Initial progress based on currentStep:
    // step 1: 5%, step 2: 15%, step 3: 35%, step 4: 60%, step 5: 85%, step 6: 100%
    const mapping = { 1: 0.05, 2: 0.15, 3: 0.35, 4: 0.60, 5: 0.85, 6: 1.0 };
    return mapping[currentStep] || 0.60;
  });

  const [vehiclePos, setVehiclePos] = useState({ x: 450, y: 195, angle: 12 });
  const [currentSpeed, setCurrentSpeed] = useState(38);
  const pathRef = useRef(null);
  const animFrameRef = useRef(null);

  // SVG Delivery Polyline Route overlaying the Google Maps canvas (800x360)
  const routePathD = "M 80,260 C 160,260 180,140 260,140 C 340,140 370,220 460,220 C 530,220 560,130 630,130 C 675,130 690,190 730,190";

  // Checkpoints along the route
  const checkpoints = [
    { 
      id: 1, 
      label: "Hub Logistik MA Store", 
      sub: "Jakarta Barat (Asal)", 
      x: 80, 
      y: 260, 
      progress: 0.05,
      type: "origin" 
    },
    { 
      id: 2, 
      label: "Gerbang Tol & Sortir", 
      sub: "Cengkareng Hub", 
      x: 260, 
      y: 140, 
      progress: 0.28,
      type: "transit" 
    },
    { 
      id: 3, 
      label: "Hub Distribusi Wilayah", 
      sub: "Sorting Center", 
      x: 460, 
      y: 220, 
      progress: 0.60,
      type: "transit" 
    },
    { 
      id: 4, 
      label: "Jl. Protokol Menuju Tujuan", 
      sub: "Kurir On The Way", 
      x: 630, 
      y: 130, 
      progress: 0.85,
      type: "transit" 
    },
    { 
      id: 5, 
      label: customer?.fullName || "Rumah Penerima", 
      sub: customer?.cityRegion || "Alamat Tujuan", 
      x: 730, 
      y: 190, 
      progress: 1.0,
      type: "destination" 
    }
  ];

  // Calculate vehicle coordinates and heading angle along the SVG path
  useEffect(() => {
    if (!pathRef.current) return;
    try {
      const path = pathRef.current;
      const totalLen = path.getTotalLength();
      const clampedP = Math.max(0.001, Math.min(0.999, simulationProgress));
      const currentDist = clampedP * totalLen;
      const point = path.getPointAtLength(currentDist);
      const nextPoint = path.getPointAtLength(Math.min(totalLen, currentDist + 3));
      
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
      setVehiclePos({ x: point.x, y: point.y, angle });

      // Dynamic speed calculation based on route segment
      if (clampedP < 0.1) {
        setCurrentSpeed(18); // Warehouse yard
      } else if (clampedP < 0.35) {
        setCurrentSpeed(56); // Highway toll road
      } else if (clampedP < 0.65) {
        setCurrentSpeed(42); // Bypass arterial road
      } else if (clampedP < 0.90) {
        setCurrentSpeed(36); // City road
      } else if (clampedP >= 0.98) {
        setCurrentSpeed(0);  // Arrived at destination
      } else {
        setCurrentSpeed(24); // Complex alley
      }
    } catch {
      // Fallback
    }
  }, [simulationProgress]);

  // Sync simulationProgress with external currentStep when not actively animating
  useEffect(() => {
    if (isSimulating) return;
    const mapping = { 1: 0.05, 2: 0.15, 3: 0.35, 4: 0.60, 5: 0.85, 6: 1.0 };
    setSimulationProgress(mapping[currentStep] || 0.60);
  }, [currentStep, isSimulating]);

  // Animation loop for continuous vehicle driving
  useEffect(() => {
    if (!isSimulating) return;

    let startTime = null;
    const startProgress = simulationProgress >= 0.98 ? 0.05 : simulationProgress;
    const durationMs = 12000; // 12 seconds trip animation

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const fraction = Math.min(1.0, startProgress + (elapsed / durationMs) * (1.0 - startProgress));

      setSimulationProgress(fraction);

      // Trigger status steps in parent
      if (fraction >= 0.98) {
        setIsSimulating(false);
        if (onStepChange) onStepChange(6);
        return;
      } else if (fraction >= 0.85) {
        if (onStepChange && currentStep < 5) onStepChange(5);
      } else if (fraction >= 0.60) {
        if (onStepChange && currentStep < 4) onStepChange(4);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isSimulating]);

  const handleToggleSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
    } else {
      if (simulationProgress >= 0.98) {
        setSimulationProgress(0.05);
      }
      setIsSimulating(true);
    }
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimulationProgress(0.05);
    if (onStepChange) onStepChange(1);
  };

  // Determine active Google Maps iframe URL
  const activeIframeUrl = mapViewType === 'directions' && googleMapsDirectionsUrl 
    ? googleMapsDirectionsUrl 
    : googleMapsEmbedUrl;

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-300/80 shadow-xl bg-slate-900">
      {/* 1. MAP HEADER BAR (Google Maps Branding & Device Mode) */}
      <div className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2.5 ${
        isDarkMode 
          ? 'bg-neutral-900 text-white border-white/10' 
          : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black tracking-wider uppercase">
              Google Maps Asli (Live Tracking)
            </span>
          </div>

          {/* Badge Mode Otomatis Default Perangkat */}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {isDarkMode ? 'Mode Gelap Perangkat' : 'Mode Terang Perangkat'} (Default)
          </span>
        </div>

        {/* Action Controls & External Link */}
        <div className="flex items-center space-x-2">
          {/* Toggle View: Directions vs Pin */}
          <div className="bg-slate-800 p-0.5 rounded-xl flex items-center border border-slate-700 text-xs">
            <button
              onClick={() => setMapViewType('directions')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                mapViewType === 'directions'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Tampilkan Rute Navigasi di Google Maps"
            >
              Rute Google
            </button>
            <button
              onClick={() => setMapViewType('location')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                mapViewType === 'location'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Tampilkan Pin Alamat Tujuan di Google Maps"
            >
              Pin Tujuan
            </button>
          </div>

          <a
            href={googleMapsDirectUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 shadow-xs"
            title="Buka rute langsung di aplikasi Google Maps"
          >
            <span>Buka Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. REAL GOOGLE MAPS IFRAME CONTAINER DENGAN OVERLAY RUTE & KENDARAAN BERGERAK */}
      <div className="relative w-full h-[340px] sm:h-[380px] bg-slate-950 overflow-hidden select-none">
        {/* PETA ASLI GOOGLE MAPS (IFRAME PERMANEN) */}
        <iframe
          title="Google Maps Asli Live Delivery Route"
          src={activeIframeUrl}
          width="100%"
          height="100%"
          style={{
            border: 0,
            filter: isDarkMode 
              ? 'invert(90%) hue-rotate(180deg) contrast(90%) brightness(95%)' 
              : 'none'
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full absolute inset-0"
        />

        {/* TOP COCKPIT CONTROL BAR (DI ATAS GOOGLE MAPS) */}
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Tombol Jalankan / Jeda Kurir Bergerak */}
          <div className="flex items-center space-x-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 shadow-2xl pointer-events-auto">
            <button
              onClick={handleToggleSimulation}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black transition-all shadow-md ${
                isSimulating
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
              }`}
              title={isSimulating ? "Jeda Simulasi Kurir" : "Jalankan Visualisasi Kurir Bergerak"}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Jeda Kurir</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{simulationProgress >= 0.98 ? "Putar Ulang Rute" : "Jalankan Kurir"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetSimulation}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Reset ke Titik Awal Hub MA Store"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] font-extrabold text-slate-200 border-l border-slate-700 pl-2">
              Progres: {Math.round(simulationProgress * 100)}%
            </span>
          </div>

          {/* Live Telemetry Pill */}
          <div className="flex items-center space-x-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/25 text-white shadow-2xl pointer-events-auto">
            <div className="flex items-center space-x-1.5 text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-cyan-300 font-mono">{currentSpeed} km/h</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] font-bold text-slate-200">
              Sisa: {simulationProgress >= 0.98 ? "Tiba" : `${(18.2 * (1 - simulationProgress)).toFixed(1)} km`}
            </span>
          </div>
        </div>

        {/* OVERLAY RUTE & KENDARAAN BERGERAK DI ATAS PETA GOOGLE MAPS ASLI */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <svg 
            viewBox="0 0 800 380" 
            className="w-full h-full preserve-3d"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Neon Glow Filters */}
              <filter id="gmapRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Headlight Cone Gradient */}
              <linearGradient id="gmapHeadlight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
              </linearGradient>

              {/* Traveled Route Gradient */}
              <linearGradient id="gmapTraveledGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* Glowing Base Shadow Track for Readability over Google Maps */}
            <path
              d={routePathD}
              fill="none"
              stroke="#0f172a"
              strokeWidth="10"
              strokeOpacity="0.65"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing Active Route Polyline */}
            <path
              d={routePathD}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeDasharray="10 8"
              filter="url(#gmapRouteGlow)"
              className="animate-[dash_2s_linear_infinite]"
            />

            {/* Traveled Route Segment (Solid Luminous Color) */}
            <path
              d={routePathD}
              fill="none"
              stroke="url(#gmapTraveledGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray={`${simulationProgress * 100} 100`}
            />

            {/* Hidden Reference Path for Coordinates Calculation */}
            <path
              ref={pathRef}
              d={routePathD}
              fill="none"
              stroke="transparent"
              strokeWidth="1"
            />

            {/* Checkpoints Nodes along the Route */}
            {checkpoints.map((cp) => {
              const isPassed = simulationProgress >= cp.progress;
              const isOrigin = cp.type === "origin";
              const isDest = cp.type === "destination";

              return (
                <g key={cp.id} className="transition-transform">
                  {/* Outer Radar Rings for Origin & Destination */}
                  {(isOrigin || isDest) && (
                    <circle
                      cx={cp.x}
                      cy={cp.y}
                      r="16"
                      fill="none"
                      stroke={isDest ? "#10b981" : "#0284c7"}
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={cp.x}
                    cy={cp.y}
                    r={isOrigin || isDest ? "10" : "6"}
                    fill={isPassed ? (isDest ? "#10b981" : "#06b6d4") : "#334155"}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="shadow-md"
                  />

                  {/* Checkpoint Label Pill */}
                  <g transform={`translate(${cp.x}, ${cp.y + (isOrigin || isDest ? 22 : 18)})`}>
                    <rect
                      x="-55"
                      y="-10"
                      width="110"
                      height="22"
                      rx="6"
                      fill="#090d16"
                      fillOpacity="0.9"
                      stroke={isPassed ? "#38bdf8" : "#475569"}
                      strokeWidth="1.2"
                    />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {cp.label}
                    </text>
                    <text
                      x="0"
                      y="9"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="7"
                      fontFamily="sans-serif"
                    >
                      {cp.sub}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* VISUALISASI KENDARAAN BERGERAK (LIVE MOVING COURIER VEHICLE) */}
            <g
              transform={`translate(${vehiclePos.x}, ${vehiclePos.y})`}
              className="transition-transform duration-75"
            >
              {/* Headlight Beam (Rotates with Vehicle Heading) */}
              <g transform={`rotate(${vehiclePos.angle})`}>
                {currentSpeed > 0 && (
                  <polygon
                    points="14,-4 65,-18 65,18 14,4"
                    fill="url(#gmapHeadlight)"
                    opacity="0.5"
                  />
                )}
              </g>

              {/* Pulsing GPS Halo around Vehicle */}
              <circle
                r="18"
                fill="#38bdf8"
                fillOpacity="0.3"
                className="animate-ping"
              />

              {/* Vehicle Body Shadow */}
              <ellipse
                cx="0"
                cy="3"
                rx="16"
                ry="9"
                fill="#000000"
                fillOpacity="0.7"
              />

              {/* Delivery Van Body */}
              <g transform={`rotate(${vehiclePos.angle})`}>
                {/* Main Vehicle Chassis */}
                <rect
                  x="-15"
                  y="-9"
                  width="30"
                  height="18"
                  rx="4"
                  fill="#ffffff"
                  stroke="#0284c7"
                  strokeWidth="2"
                />
                {/* Windshield */}
                <rect
                  x="6"
                  y="-7"
                  width="6"
                  height="14"
                  rx="1.5"
                  fill="#0369a1"
                />
                {/* Brand Logo "MA" on Roof */}
                <text
                  x="-4"
                  y="3"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="7.5"
                  fontWeight="900"
                  fontFamily="sans-serif"
                >
                  MA
                </text>
                {/* Headlights */}
                <circle cx="14" cy="-6" r="1.5" fill="#fef08a" />
                <circle cx="14" cy="6" r="1.5" fill="#fef08a" />
                {/* Taillights */}
                <rect x="-15.5" y="-7" width="1.5" height="3.5" fill="#ef4444" />
                <rect x="-15.5" y="3.5" width="1.5" height="3.5" fill="#ef4444" />
              </g>

              {/* Floating Driver Info Tag Above Vehicle */}
              <g transform="translate(0, -24)">
                <rect
                  x="-55"
                  y="-10"
                  width="110"
                  height="20"
                  rx="10"
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="shadow-2xl"
                />
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8.5"
                  fontWeight="900"
                  fontFamily="sans-serif"
                >
                  🚗 {courier?.name || 'Kurir'} • {currentSpeed} km/h
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* BOTTOM REAL-TIME RADAR TELEMETRY BADGE ON GOOGLE MAPS */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md border border-white/20 px-3.5 py-2.5 rounded-2xl text-white shadow-2xl flex items-center gap-3 text-left max-w-[92%] z-20 pointer-events-auto">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/25 border border-emerald-400/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Truck className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Posisi Kurir:</span>
              <span className="text-xs font-black text-white truncate">
                {simulationProgress >= 0.98 
                  ? "Tiba di Alamat Rumah Penerima" 
                  : simulationProgress >= 0.85 
                  ? "Kurir On The Way ke Alamat Tujuan" 
                  : simulationProgress >= 0.60 
                  ? "Transit di Hub Distribusi Wilayah" 
                  : "Pickup dari Gudang Logistik"}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] font-bold">
              <span className="text-emerald-400">
                {simulationProgress >= 0.98 ? "Paket Telah Tiba" : isSimulating ? "Kurir Sedang Berjalan" : "GPS Real-time Terhubung"}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300 font-mono">{currentSpeed} km/h</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-300 font-mono">
                {simulationProgress >= 0.98 ? "0 m" : `ETA ${Math.max(2, Math.round(18 * (1 - simulationProgress)))} Menit`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. REALTIME FLEET TELEMETRY BAR */}
      <div className={`p-3.5 border-t grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs ${
        isDarkMode 
          ? 'bg-neutral-900 text-white border-white/10' 
          : 'bg-slate-200/95 text-slate-900 border-slate-300'
      }`}>
        <div className={`p-2 rounded-xl border ${
          isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-300/80 shadow-xs'
        }`}>
          <span className="text-[10px] text-slate-500 block font-semibold">Armada Pengiriman</span>
          <span className="font-black text-xs truncate block">{courier?.name || 'JNE'} Fleet Van</span>
        </div>
        <div className={`p-2 rounded-xl border ${
          isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-300/80 shadow-xs'
        }`}>
          <span className="text-[10px] text-slate-500 block font-semibold">Nama Driver Kurir</span>
          <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs block">Budi Pratama</span>
        </div>
        <div className={`p-2 rounded-xl border ${
          isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-300/80 shadow-xs'
        }`}>
          <span className="text-[10px] text-slate-500 block font-semibold">Nomor Plat Mobil</span>
          <span className="font-black text-amber-600 dark:text-amber-300 font-mono text-xs block">B 4921 TXP</span>
        </div>
        <div className={`p-2 rounded-xl border ${
          isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-300/80 shadow-xs'
        }`}>
          <span className="text-[10px] text-slate-500 block font-semibold">Live GPS Telemetri</span>
          <span className="font-black text-cyan-600 dark:text-cyan-300 text-xs block">
            {isSimulating ? "🚗 Kurir Berjalan" : `${currentCoords?.speed || '38 km/h'}`}
          </span>
        </div>
      </div>
    </div>
  );
}
