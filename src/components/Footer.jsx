import React from 'react';
import { MapPin, Truck, ShieldCheck, RefreshCw, CreditCard } from 'lucide-react';

export default function Footer({ onOpenTrackLookup }) {
  const footerLinks = {
    resources: [
      "Temukan Gerai Resmi",
      "Daftar Member MA Store",
      "Diskon Mahasiswa / Pelajar",
      "Kirim Masukan & Ulasan"
    ],
    help: [
      "Pusat Bantuan Pelanggan",
      "Status & Lacak Pengiriman",
      "Informasi Pengiriman & Ekspedisi",
      "Garansi Retur 60 Hari",
      "Metode Pembayaran (QRIS, VA, COD)",
      "Hubungi Kami di WhatsApp"
    ],
    company: [
      "Tentang MA Store Indonesia",
      "Berita & Rilis Sneakers",
      "Karier di MA Store",
      "Keberlanjutan Lingkungan",
      "Program Komunitas"
    ],
    promotions: [
      "Promo Gratis Ongkir Nasional",
      "Kupon Diskon Member",
      "Poin Reward Belanja",
      "Hadiah Ulang Tahun Member"
    ]
  };

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 select-none">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#222222] text-left">
          <div className="flex items-center space-x-3.5">
            <Truck className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h5 className="text-xs font-black uppercase text-white">Gratis Ongkir</h5>
              <p className="text-[11px] text-[#888888]">Min. belanja Rp 1.500.000</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <h5 className="text-xs font-black uppercase text-white">100% Produk Original</h5>
              <p className="text-[11px] text-[#888888]">Garansi keaslian resmi pabrik</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <RefreshCw className="w-6 h-6 text-sky-400 flex-shrink-0" />
            <div>
              <h5 className="text-xs font-black uppercase text-white">Garansi Retur 60 Hari</h5>
              <p className="text-[11px] text-[#888888]">Bisa tukar ukuran tanpa ribet</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <CreditCard className="w-6 h-6 text-pink-400 flex-shrink-0" />
            <div>
              <h5 className="text-xs font-black uppercase text-white">Metode Bayar Lengkap</h5>
              <p className="text-[11px] text-[#888888]">QRIS, Virtual Account, COD</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-b border-[#222222] text-left">
          {/* Col 1: Resources */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-white mb-4">
              Layanan Utama
            </h4>
            <ul className="space-y-3 text-xs text-[#8e8e8e]">
              {footerLinks.resources.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Help */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-white mb-4">
              Bantuan
            </h4>
            <ul className="space-y-3 text-xs text-[#8e8e8e]">
              {footerLinks.help.map((link, idx) => (
                <li key={idx}>
                  <button 
                    onClick={link.includes('Lacak') ? onOpenTrackLookup : undefined}
                    className="hover:text-white transition-colors text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-white mb-4">
              Tentang Kami
            </h4>
            <ul className="space-y-3 text-xs text-[#8e8e8e]">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Promotions */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-white mb-4">
              Program & Promo
            </h4>
            <ul className="space-y-3 text-xs text-[#8e8e8e]">
              {footerLinks.promotions.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Social Media */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 flex lg:justify-end items-start space-x-3">
            <a href="https://twitter.com/nike" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#333333] hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://facebook.com/nike" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#333333] hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/></svg>
            </a>
            <a href="https://instagram.com/nike" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#333333] hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>

        {/* Bottom Legal & Location Row */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between text-[11px] text-[#7e7e7e] gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-white font-bold">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Indonesia / Bahasa Indonesia</span>
            </div>
            <span>© 2026 MA Store Indonesia. All Rights Reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-white transition-colors">Panduan Belanja</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan Transaksi</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Pilihan Kurir Ekspedisi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
