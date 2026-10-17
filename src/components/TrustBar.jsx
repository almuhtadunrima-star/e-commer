import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Zap, Headphones } from 'lucide-react';

export default function TrustBar() {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: "100% Original Authentic",
      desc: "Jaminan keaslian resmi & garansi uang kembali",
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: Truck,
      title: "Gratis Ongkir Nasional",
      desc: "Bebas ongkir min. belanja Rp 1.500.000",
      color: "text-amber-600",
      bgColor: "bg-amber-500/10"
    },
    {
      icon: RefreshCw,
      title: "60-Hari Bebas Tukar Size",
      desc: "Garansi tukar ukuran tanpa biaya tambahan",
      color: "text-sky-600",
      bgColor: "bg-sky-500/10"
    },
    {
      icon: Zap,
      title: "Pengiriman Kilat Same-Day",
      desc: "Order sebelum 15:00 WIB dikirim hari ini",
      color: "text-purple-600",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Headphones,
      title: "Layanan CS Resmi 24/7",
      desc: "Konsultasi ukuran & pelacakan via WhatsApp",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10"
    }
  ];

  return (
    <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-4 select-none">
      <div className="glass-ios-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-300/70 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center space-x-3 p-2 sm:p-2.5 rounded-xl hover:bg-white/40 transition-colors"
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.bgColor} ${item.color} flex items-center justify-center flex-shrink-0 shadow-xs border border-white/50`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                  <h4 className="text-xs sm:text-[13px] font-black tracking-tight text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium truncate">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
