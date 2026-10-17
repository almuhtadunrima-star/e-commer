import React, { useState } from 'react';
import { Mail, Check, Copy, Sparkles, Gift, Bell } from 'lucide-react';

export default function VipNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('MAVIP10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 my-10 sm:my-14 select-none">
      <div className="relative glass-ios-dark rounded-3xl p-6 sm:p-12 md:p-16 border border-white/20 shadow-2xl overflow-hidden text-center text-white">
        {/* Ambient Gradient Glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-ios-pill border border-white/30 text-white text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>MA Store VIP Membership</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-nike-bold tracking-tight uppercase mb-4 text-white">
            DAPATKAN DISKON 10% UNTUK PESANAN PERTAMAMU
          </h2>

          <p className="text-xs sm:text-base text-gray-300 font-medium max-w-xl mx-auto mb-8">
            Daftarkan email kamu untuk menjadi bagian dari komunitas eksklusif MA Store. Dapatkan akses utama ke rilisan sneakers limited edition dan penawaran private sale.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="Masukkan alamat email kamu..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white/10 border border-white/25 text-white placeholder-gray-400 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-white text-black hover:bg-white/90 rounded-full font-black text-xs sm:text-sm tracking-tight transition-all active:scale-95 shadow-xl flex-shrink-0"
              >
                Klaim Voucher 10%
              </button>
            </form>
          ) : (
            <div className="max-w-md mx-auto p-5 rounded-2xl glass-ios-card bg-white/10 border border-white/30 text-white animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-center space-x-2 text-emerald-400 font-black text-sm mb-2">
                <Check className="w-5 h-5" />
                <span>Selamat! Email kamu telah terdaftar.</span>
              </div>
              <p className="text-xs text-gray-300 mb-3">
                Gunakan kode kupon di bawah ini saat checkout atau di keranjang belanja:
              </p>
              <div className="flex items-center justify-center space-x-3 bg-black/40 border border-white/20 p-2.5 rounded-xl">
                <span className="font-mono font-black text-base tracking-widest text-amber-300">
                  MAVIP10
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-700" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Three Perks Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/15 text-left max-w-2xl mx-auto">
            <div className="flex items-center space-x-2.5">
              <Gift className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs font-bold text-gray-200">Diskon 10% Langsung</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-xs font-bold text-gray-200">Akses Drop Sneakers Terbatas</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Bell className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span className="text-xs font-bold text-gray-200">Info Event & Private Sale</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
