import React, { useState } from 'react';
import { MapPin, HelpCircle, User, LogOut, Truck } from 'lucide-react';

export default function TopBar({ user, onOpenAuth, onSignOut, onOpenTrackLookup }) {
  const [showHelpMenu, setShowHelpMenu] = useState(false);

  return (
    <div className="bg-[#f5f5f5] text-[11px] font-semibold text-[#111111] px-6 lg:px-12 py-1.5 flex justify-between items-center border-b border-[#e5e5e5] select-none">
      {/* Brand Logos */}
      <div className="flex items-center space-x-6">
        {/* Jordan Jumpman Logo */}
        <a 
          href="#jordan" 
          title="Jordan Collection"
          className="opacity-80 hover:opacity-100 transition-opacity flex items-center"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M18.89 3.01c-.13 0-.25.04-.36.11l-4.7 3.23-1.61-2.22c-.22-.3-.59-.44-.95-.36-.36.08-.64.35-.73.71l-1.42 5.56-2.9-1.93c-.32-.21-.73-.2-.1.01l-3.8 3.8a.996.996 0 101.41 1.41l2.97-2.97 3.32 2.21c.29.19.66.21.96.06.31-.15.51-.46.53-.8l.21-3.69 1.15 1.58c.21.29.56.44.91.41.36-.04.67-.25.82-.57l2.87-5.99c.19-.4-.01-.88-.42-1.07-.1-.05-.2-.08-.3-.08z"/>
          </svg>
        </a>

        {/* Converse Star Chevron Logo */}
        <a 
          href="#converse" 
          title="Converse"
          className="opacity-80 hover:opacity-100 transition-opacity flex items-center"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l2.6 6.3 6.8.6-5.1 4.5 1.5 6.6L12 16.5l-5.8 3.5 1.5-6.6L2.6 8.9l6.8-.6L12 2z"/>
          </svg>
        </a>
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
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#e5e5e5] rounded-xl shadow-xl p-3 z-50 text-left">
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
