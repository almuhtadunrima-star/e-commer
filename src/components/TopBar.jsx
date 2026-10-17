import React, { useState } from 'react';
import { MapPin, HelpCircle, User, LogOut, Truck } from 'lucide-react';

export default function TopBar({ user, onOpenAuth, onSignOut, onOpenTrackLookup }) {
  const [showHelpMenu, setShowHelpMenu] = useState(false);

  return (
    <div className="hidden sm:flex bg-slate-950 text-[11px] font-bold text-slate-200 px-6 lg:px-12 py-2 justify-between items-center border-b border-slate-800 select-none w-full max-w-full overflow-hidden shadow-xs">
      {/* Brand Badge */}
      <div className="flex items-center space-x-2">
        <span className="font-black text-[11px] tracking-wider uppercase text-white">
          MA STORE
        </span>
        <span className="text-slate-700">|</span>
        <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">Official Store Indonesia</span>
      </div>

      {/* Utility links */}
      <div className="flex items-center space-x-4 text-slate-300">
        <button 
          onClick={onOpenTrackLookup}
          className="hover:text-white transition-colors flex items-center space-x-1.5 font-bold text-slate-200"
        >
          <Truck className="w-3.5 h-3.5 text-amber-400" />
          <span>Lacak Resi Pesanan</span>
        </button>
        <span className="text-slate-700">|</span>

        <button 
          onClick={() => alert("Gerai Resmi Indonesia: Grand Indonesia (Jakarta), Senayan City, Pondok Indah Mall, Tunjungan Plaza (Surabaya), Paris Van Java (Bandung).")}
          className="hover:text-white transition-colors flex items-center space-x-1"
        >
          <span>Lokasi Gerai</span>
        </button>
        <span className="text-slate-700">|</span>

        {/* Help Menu Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowHelpMenu(!showHelpMenu)}
            onBlur={() => setTimeout(() => setShowHelpMenu(false), 200)}
            className="hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>Bantuan</span>
          </button>

          {showHelpMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl p-3 z-50 text-left border border-slate-200">
              <div className="font-bold text-xs pb-2 border-b border-gray-100 text-black">Pusat Bantuan</div>
              <ul className="py-2 space-y-2 text-xs text-slate-700">
                <li className="hover:text-black cursor-pointer" onClick={onOpenTrackLookup}>Status & Lacak Pesanan</li>
                <li className="hover:text-black cursor-pointer">Ongkos & Estimasi Kirim</li>
                <li className="hover:text-black cursor-pointer">Panduan Retur & Garansi</li>
                <li className="hover:text-black cursor-pointer">Tabel Ukuran Sepatu</li>
                <li className="hover:text-black cursor-pointer">Customer Service WhatsApp</li>
              </ul>
            </div>
          )}
        </div>
        <span className="text-slate-700">|</span>

        {user ? (
          <div className="flex items-center space-x-3">
            <span className="font-bold text-white flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              Halo, {user.name}
            </span>
            <button 
              onClick={onSignOut}
              className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 font-semibold"
              title="Keluar"
            >
              <LogOut className="w-3 h-3" />
              <span>Keluar</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onOpenAuth('join')}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Daftar Member
            </button>
            <span className="text-slate-700">|</span>
            <button 
              onClick={() => onOpenAuth('signin')}
              className="hover:text-white transition-colors font-black text-white"
            >
              Masuk
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
