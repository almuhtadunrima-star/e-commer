import React from 'react';
import { Sparkles, Truck, Trophy } from 'lucide-react';

export default function MembershipBanner({ onOpenAuth }) {
  const benefits = [
    {
      icon: Sparkles,
      title: "Member Exclusive Drops",
      desc: "Get first access to coveted releases and custom Nike By You designs."
    },
    {
      icon: Truck,
      title: "Free Shipping & Returns",
      desc: "Enjoy free standard delivery on every order over $50 plus 60-day trial returns."
    },
    {
      icon: Trophy,
      title: "Nike App Ecosystem",
      desc: "Connect with Nike Training Club and Nike Run Club for daily workout motivation."
    }
  ];

  return (
    <section className="bg-[#111111] text-white py-16 px-6 lg:px-12 my-12">
      <div className="max-w-[1920px] mx-auto text-center">
        <span className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">
          Nike Membership
        </span>
        <h2 className="text-3xl sm:text-5xl font-black font-nike-bold tracking-tight uppercase mb-4 text-white">
          BECOME A MEMBER
        </h2>
        <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-8 font-medium">
          Sign up for free. Join a global community of athletes and get the best of Nike delivered directly to you.
        </p>

        <div className="flex justify-center gap-4 mb-14">
          <button
            onClick={() => onOpenAuth('join')}
            className="px-8 py-3.5 bg-white text-black hover:bg-gray-200 rounded-full font-bold text-sm tracking-tight transition-all active:scale-95 shadow-xl"
          >
            Join Us
          </button>
          <button
            onClick={() => onOpenAuth('signin')}
            className="px-8 py-3.5 border border-white/40 hover:border-white text-white rounded-full font-bold text-sm tracking-tight transition-all active:scale-95"
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
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{b.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-normal">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
