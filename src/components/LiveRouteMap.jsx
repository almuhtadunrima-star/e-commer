import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, Truck, MapPin, Play, Pause, RotateCcw, 
  ExternalLink, Eye, CheckCircle2, Radio, Zap, ShieldCheck 
} from 'lucide-react';

export default function LiveRouteMap({
  currentStep = 4,
  courier,
  customer,
  currentCoords,
  isDarkMode = false,
  googleMapsEmbedUrl,
  googleMapsDirectUrl,
  onStepChange
}) {
  const [mapMode, setMapMode] = useState('simulated'); // 'simulated' | 'google'
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(() => {
    // Initial progress based on currentStep:
    // step 1: 0%, step 2: 8%, step 3: 20%, step 4: 48%, step 5: 80%, step 6: 100%
    const mapping = { 1: 0.05, 2: 0.12, 3: 0.25, 4: 0.52, 5: 0.82, 6: 1.0 };
    return mapping[currentStep] || 0.52;
  });

  const [vehiclePos, setVehiclePos] = useState({ x: 395, y: 220, angle: 0 });
  const [currentSpeed, setCurrentSpeed] = useState(38);
  const pathRef = useRef(null);
  const animFrameRef = useRef(null);

  // SVG Winding Delivery Route Path (800x360)
  const routePathD = "M 80,270 C 150,270 170,140 240,140 C 310,140 350,225 430,225 C 500,225 530,120 600,120 C 650,120 670,185 720,185";

  // Checkpoints along the route
  const checkpoints = [
    { 
      id: 1, 
      label: "Hub Logistik MA Store", 
      sub: "Jakarta Barat (Asal)", 
      x: 80, 
      y: 270, 
      progress: 0.05,
      type: "origin" 
    },
    { 
      id: 2, 
      label: "Gerbang Tol & Sortir", 
      sub: "Cengkareng Hub", 
      x: 240, 
      y: 140, 
      progress: 0.28,
      type: "transit" 
    },
    { 
      id: 3, 
      label: "Hub Distribusi Wilayah", 
      sub: "Sorting Center Utama", 
      x: 430, 
      y: 225, 
      progress: 0.52,
      type: "transit" 
    },
    { 
      id: 4, 
      label: "Jl. Protokol Tujuan", 
      sub: "Kurir On The Way", 
      x: 600, 
      y: 120, 
      progress: 0.82,
      type: "transit" 
    },
    { 
      id: 5, 
      label: customer?.fullName || "Rumah Penerima", 
      sub: customer?.cityRegion || "Alamat Tujuan", 
      x: 720, 
      y: 185, 
      progress: 1.0,
      type: "destination" 
    }
  ];

  // Update vehicle position whenever simulationProgress changes
  useEffect(() => {
    if (!pathRef.current) return;
    try {
      const path = pathRef.current;
      const totalLen = path.getTotalLength();
      const clampedP = Math.max(0.001, Math.min(0.999, simulationProgress));
      const currentDist = clampedP * totalLen;
      const point = path.getPointAtLength(currentDist);
      const nextPoint = path.getPointAtLength(Math.min(totalLen, currentDist + 2));
      
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
      setVehiclePos({ x: point.x, y: point.y, angle });

      // Dynamic speed variation based on progress
      if (clampedP < 0.1) {
        setCurrentSpeed(15);
      } else if (clampedP < 0.3) {
        setCurrentSpeed(58); // Tol
      } else if (clampedP < 0.55) {
        setCurrentSpeed(42);
      } else if (clampedP < 0.85) {
        setCurrentSpeed(46);
      } else if (clampedP >= 0.98) {
        setCurrentSpeed(0); // Arrived
      } else {
        setCurrentSpeed(28); // Residential
      }
    } catch {
      // Fallback
    }
  }, [simulationProgress]);

  // Sync simulationProgress with external currentStep when not animating
  useEffect(() => {
    if (isSimulating) return;
    const mapping = { 1: 0.05, 2: 0.12, 3: 0.25, 4: 0.52, 5: 0.82, 6: 1.0 };
    setSimulationProgress(mapping[currentStep] || 0.52);
  }, [currentStep, isSimulating]);

  // Animation loop for continuous vehicle driving
  useEffect(() => {
    if (!isSimulating) return;

    let startTime = null;
    const startProgress = simulationProgress >= 0.98 ? 0.05 : simulationProgress;
    const durationMs = 12000; // 12 seconds full trip

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const fraction = Math.min(1.0, startProgress + (elapsed / durationMs) * (1.0 - startProgress));

      setSimulationProgress(fraction);

      // Auto update step in parent if passed thresholds
      if (fraction >= 0.98) {
        setIsSimulating(false);
        if (onStepChange) onStepChange(6);
        return;
      } else if (fraction >= 0.8) {
        if (onStepChange && currentStep < 5) onStepChange(5);
      } else if (fraction >= 0.5) {
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

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-300/80 shadow-md">
      {/* Map Header with View Switcher & Live GPS Badges */}
      <div className="p-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black tracking-wider uppercase">
              Live Delivery Route
            </span>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            GPS Aktif (100% Live)
          </span>
        </div>

        {/* View Mode Toggle: Interactive Route vs Google Maps */}
        <div className="flex items-center space-x-1.5">
          <div className="bg-slate-800 p-1 rounded-xl flex items-center space-x-1 border border-slate-700">
            <button
              onClick={() => setMapMode('simulated')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center space-x-1.5 ${
                mapMode === 'simulated'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Rute & Kendaraan</span>
            </button>
            <button
              onClick={() => setMapMode('google')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center space-x-1.5 ${
                mapMode === 'google'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Google Maps Asli</span>
            </button>
          </div>

          {/* External Google Maps App Link */}
          <a
            href={googleMapsDirectUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 shadow-xs"
            title="Buka navigasi di aplikasi Google Maps"
          >
            <span>Buka Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* MAP CANVAS CONTENT */}
      {mapMode === 'simulated' ? (
        <div className="relative w-full h-[320px] sm:h-[360px] bg-slate-950 overflow-hidden select-none">
          {/* Subtle Map Grid Lines Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60a5fa" strokeWidth="0.8" />
                </pattern>
                <pattern id="streetGrid" width="160" height="160" patternUnits="userSpaceOnUse">
                  <rect width="160" height="160" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="80" cy="80" r="1.5" fill="#38bdf8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#streetGrid)" />
            </svg>
          </div>

          {/* Top Simulation Playback Control Strip */}
          <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
            {/* Play / Pause / Replay Buttons */}
            <div className="flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-xl">
              <button
                onClick={handleToggleSimulation}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black transition-all ${
                  isSimulating
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                }`}
                title={isSimulating ? "Jeda Simulasi" : "Jalankan Kendaraan Bergerak"}
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
                title="Reset ke Titik Awal Gudang"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] font-bold text-slate-300 border-l border-slate-700 pl-2">
                Progres: {Math.round(simulationProgress * 100)}%
              </span>
            </div>

            {/* Live Telemetry Pill */}
            <div className="flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white shadow-xl">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-cyan-400 font-mono">{currentSpeed} km/h</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-semibold text-slate-300">
                Sisa: {simulationProgress >= 0.98 ? "0 km (Tiba)" : `${(18.4 * (1 - simulationProgress)).toFixed(1)} km`}
              </span>
            </div>
          </div>

          {/* MAIN VECTOR ROUTE & ROADWAY SVG */}
          <svg 
            viewBox="0 0 800 360" 
            className="w-full h-full preserve-3d"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Neon Glow Filters */}
              <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Headlight Cone Gradient */}
              <linearGradient id="headlightCone" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
              </linearGradient>

              {/* Traveled Route Gradient */}
              <linearGradient id="traveledGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* Simulated Road Highway Outlines */}
            <path
              d={routePathD}
              fill="none"
              stroke="#1e293b"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Road Asphalt Inner Surface */}
            <path
              d={routePathD}
              fill="none"
              stroke="#0f172a"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Road Lane Centerline (Dashed White) */}
            <path
              d={routePathD}
              fill="none"
              stroke="#334155"
              strokeWidth="2"
              strokeDasharray="6 8"
            />

            {/* Full Active GPS Polyline with Animated Traffic Dashes */}
            <path
              ref={pathRef}
              d={routePathD}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeDasharray="10 8"
              filter="url(#routeGlow)"
              className="animate-[dash_2s_linear_infinite]"
              style={{
                strokeDashoffset: isSimulating ? undefined : 0
              }}
            />

            {/* Traveled Route Segment (Solid Luminous Green/Cyan) */}
            <path
              d={routePathD}
              fill="none"
              stroke="url(#traveledGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray={`${simulationProgress * 100} 100`}
            />

            {/* Checkpoint Nodes on Map */}
            {checkpoints.map((cp) => {
              const isPassed = simulationProgress >= cp.progress;
              const isOrigin = cp.type === "origin";
              const isDest = cp.type === "destination";

              return (
                <g key={cp.id} className="cursor-pointer transition-transform hover:scale-110">
                  {/* Outer Radar Rings for Origin & Destination */}
                  {(isOrigin || isDest) && (
                    <circle
                      cx={cp.x}
                      cy={cp.y}
                      r="16"
                      fill="none"
                      stroke={isDest ? "#10b981" : "#3b82f6"}
                      strokeWidth="1.5"
                      opacity="0.4"
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
                      x="-60"
                      y="-10"
                      width="120"
                      height="24"
                      rx="6"
                      fill="#0f172a"
                      fillOpacity="0.85"
                      stroke={isPassed ? "#38bdf8" : "#334155"}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {cp.label}
                    </text>
                    <text
                      x="0"
                      y="10"
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

            {/* ANIMATED MOVING VEHICLE (KENDARAAN BERJALAN) */}
            <g
              transform={`translate(${vehiclePos.x}, ${vehiclePos.y})`}
              className="transition-transform duration-75"
            >
              {/* Rotating Headlight Beam (Rotates with Vehicle Heading) */}
              <g transform={`rotate(${vehiclePos.angle})`}>
                {currentSpeed > 0 && (
                  <polygon
                    points="12,-4 55,-16 55,16 12,4"
                    fill="url(#headlightCone)"
                    opacity="0.45"
                  />
                )}
              </g>

              {/* Pulsing GPS Signal Halo around Vehicle */}
              <circle
                r="18"
                fill="#38bdf8"
                fillOpacity="0.25"
                className="animate-ping"
              />

              {/* Vehicle Body Shadow */}
              <ellipse
                cx="0"
                cy="3"
                rx="14"
                ry="8"
                fill="#000000"
                fillOpacity="0.6"
              />

              {/* Delivery Van Body */}
              <g transform={`rotate(${vehiclePos.angle})`}>
                {/* Main Vehicle Chassis */}
                <rect
                  x="-14"
                  y="-8"
                  width="28"
                  height="16"
                  rx="4"
                  fill="#ffffff"
                  stroke="#0284c7"
                  strokeWidth="1.8"
                />
                {/* Windshield */}
                <rect
                  x="5"
                  y="-6"
                  width="6"
                  height="12"
                  rx="1.5"
                  fill="#0369a1"
                />
                {/* Brand Logo "M" on Van Roof */}
                <text
                  x="-4"
                  y="3"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="7"
                  fontWeight="900"
                  fontFamily="sans-serif"
                >
                  MA
                </text>
                {/* Headlights */}
                <circle cx="13" cy="-5" r="1.5" fill="#fef08a" />
                <circle cx="13" cy="5" r="1.5" fill="#fef08a" />
                {/* Taillights */}
                <rect x="-14.5" y="-6" width="1.5" height="3" fill="#ef4444" />
                <rect x="-14.5" y="3" width="1.5" height="3" fill="#ef4444" />
              </g>

              {/* Floating Driver Info Tag Above Vehicle */}
              <g transform="translate(0, -22)">
                <rect
                  x="-55"
                  y="-9"
                  width="110"
                  height="18"
                  rx="9"
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  className="shadow-xl"
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

          {/* Bottom Telemetry HUD Card on Map */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-white/20 px-3.5 py-2.5 rounded-2xl text-white shadow-2xl flex items-center gap-3 text-left max-w-[92%] z-20">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/25 border border-emerald-400/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Truck className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Status Kurir:</span>
                <span className="text-xs font-black text-white truncate">
                  {simulationProgress >= 0.98 
                    ? "Paket Tiba di Lokasi Tujuan" 
                    : simulationProgress >= 0.8 
                    ? "Kurir On The Way ke Alamat Rumah" 
                    : simulationProgress >= 0.5 
                    ? "Transit di Hub Distribusi Wilayah" 
                    : "Pickup dari Gudang Logistik"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] font-bold">
                <span className="text-emerald-400">
                  {simulationProgress >= 0.98 ? "Telah Tiba (Selesai)" : isSimulating ? "Sedang Berjalan (Active Moving)" : "Live GPS Terhubung"}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-300 font-mono">{currentSpeed} km/h</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-300 font-mono">
                  {simulationProgress >= 0.98 ? "0 m" : `ETA ${Math.max(3, Math.round(18 * (1 - simulationProgress)))} Menit`}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* GOOGLE MAPS EMBED IFRAME */
        <div className="relative w-full h-[320px] sm:h-[360px] bg-slate-100 overflow-hidden">
          <iframe
            title="Google Maps Live Delivery Route"
            src={googleMapsEmbedUrl}
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
            className="w-full h-full"
          />
        </div>
      )}

      {/* Realtime Fleet Telemetry Bar */}
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
            {isSimulating ? "🚗 Kurir Bergerak" : `${currentCoords?.speed || '38 km/h'}`}
          </span>
        </div>
      </div>
    </div>
  );
}
