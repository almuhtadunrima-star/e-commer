import React from 'react';
import { Sparkles, Truck, Trophy } from 'lucide-react';

export default function MembershipBanner({ onOpenAuth }) {
  const benefits = [
    {
      icon: Sparkles,
      title: "Member Exclusive Drops",
      desc: "Dapatkan akses utama ke rilis sneakers paling dicari dan koleksi eksklusif MA Store."
    },
    {
      icon: Truck,
      title: "Free Shipping & Returns",
      desc: "Nikmati gratis ongkir nasional dan kemudahan garansi retur tukar ukuran 60 hari."
    },
    {
      icon: Trophy,
      title: "MA Store Ecosystem",
      desc: "Bergabung bersama komunitas streetwear dan sneaker enthusiast terbesar."
    }
  ];

  return (
    <section className="max-w-[1920px] mx-auto px-6 lg:px-12 my-12">
      <div className="glass-ios-dark rounded-3xl p-8 sm:p-14 border border-white/20 shadow-2xl relative overflow-hidden text-center">
        <span className="text-xs font-bold tracking-widest uppercase text-gray-300 mb-2 block">
          MA Store Membership
        </span>
        <h2 className="text-3xl sm:text-5xl font-black font-nike-bold tracking-tight uppercase mb-4 text-white">
          BECOME AN MA STORE MEMBER
        </h2>
        <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-8 font-medium">
          Daftar gratis. Bergabunglah dengan komunitas eksklusif dan dapatkan penawaran terbaik dari MA Store langsung ke Anda.
        </p>

        <div className="flex justify-center gap-4 mb-14">
          <button
            onClick={() => onOpenAuth('join')}
            className="px-8 py-3.5 bg-white text-black hover:bg-white/90 rounded-full font-black text-sm tracking-tight transition-all active:scale-95 shadow-xl"
          >
            Join Us
          </button>
          <button
            onClick={() => onOpenAuth('signin')}
            className="px-8 py-3.5 glass-ios-pill border border-white/40 hover:bg-white/20 text-white rounded-full font-black text-sm tracking-tight transition-all active:scale-95 shadow-lg"
          >
            Sign In
          </button>
        </div>

        {/* Benefits Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div 
                key={idx}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all shadow-lg hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl glass-ios-pill flex items-center justify-center mb-4 border border-white/30 text-white shadow-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{b.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed font-normal">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
