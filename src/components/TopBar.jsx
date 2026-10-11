import React, { useState } from 'react';
import { MapPin, HelpCircle, User, LogOut, Truck } from 'lucide-react';

export default function TopBar({ user, onOpenAuth, onSignOut, onOpenTrackLookup }) {
  const [showHelpMenu, setShowHelpMenu] = useState(false);

  return (
    <div className="bg-[#e2e8f1]/80 backdrop-blur-xl text-[11px] font-bold text-slate-800 px-6 lg:px-12 py-1.5 flex justify-between items-center border-b border-slate-300/70 select-none">
      {/* Brand Badge */}
      <div className="flex items-center space-x-2">
        <span className="font-black text-[11px] tracking-wider uppercase text-black">
          MA STORE
        </span>
        <span className="text-gray-300">|</span>
        <span className="text-[10px] text-gray-500 font-semibold hidden sm:inline">Official Store Indonesia</span>
      </div>

      {/* Utility links */}
      <div className="flex items-center space-x-4 text-[#111111]">
        <button 
          onClick={onOpenTrackLookup}
          className="hover:text-black transition-colors flex items-center space-x-1 font-bold text-gray-800"
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Lacak Resi Pesanan</span>
        </button>
        <span className="text-gray-300">|</span>

        <button 
          onClick={() => alert("Gerai Resmi Indonesia: Grand Indonesia (Jakarta), Senayan City, Pondok Indah Mall, Tunjungan Plaza (Surabaya), Paris Van Java (Bandung).")}
          className="hover:text-black/70 transition-colors flex items-center space-x-1"
        >
          <span>Lokasi Gerai</span>
        </button>
        <span className="text-gray-300">|</span>

        {/* Help Menu Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowHelpMenu(!showHelpMenu)}
            onBlur={() => setTimeout(() => setShowHelpMenu(false), 200)}
            className="hover:text-black/70 transition-colors flex items-center space-x-1"
          >
            <span>Bantuan</span>
          </button>

          {showHelpMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 glass-ios-card rounded-2xl p-3 z-50 text-left">
              <div className="font-bold text-xs pb-2 border-b border-gray-100 text-[#111]">Pusat Bantuan</div>
              <ul className="py-2 space-y-2 text-xs text-gray-700">
                <li className="hover:text-black cursor-pointer" onClick={onOpenTrackLookup}>Status & Lacak Pesanan</li>
                <li className="hover:text-black cursor-pointer">Ongkos & Estimasi Kirim</li>
                <li className="hover:text-black cursor-pointer">Panduan Retur & Garansi</li>
                <li className="hover:text-black cursor-pointer">Tabel Ukuran Sepatu</li>
                <li className="hover:text-black cursor-pointer">Customer Service WhatsApp</li>
              </ul>
            </div>
          )}
        </div>
        <span className="text-gray-300">|</span>

        {user ? (
          <div className="flex items-center space-x-3">
            <span className="font-bold text-black flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              Halo, {user.name}
            </span>
            <button 
              onClick={onSignOut}
              className="text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 font-semibold"
              title="Keluar"
            >
              <LogOut className="w-3 h-3" />
              <span>Keluar</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onOpenAuth('join')}
              className="hover:text-black/70 transition-colors"
            >
              Daftar Member
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => onOpenAuth('signin')}
              className="hover:text-black/70 transition-colors font-bold text-black"
            >
              Masuk
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
