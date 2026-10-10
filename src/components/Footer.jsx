import React from 'react';
import { MapPin } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    resources: [
      "Find A Store",
      "Become A Member",
      "Send Us Feedback",
      "Student Discounts",
      "Find A Store"
    ],
    help: [
      "Get Help",
      "Order Status",
      "Delivery and Shipping",
      "Returns & Exchanges",
      "Payment Options",
      "Contact Us On Nike.com"
    ],
    company: [
      "About Nike",
      "News",
      "Careers",
      "Investors",
      "Sustainability",
      "Purpose"
    ],
    promotions: [
      "Student Discount",
      "Military Discount",
      "Teacher Discount",
      "First Responders & Medical",
      "Birthday Gift"
    ]
  };

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 select-none">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-16 border-b border-[#222222] text-left">
          {/* Col 1: Resources */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-3 text-xs text-[#7e7e7e]">
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
              Help
            </h4>
            <ul className="space-y-3 text-xs text-[#7e7e7e]">
              {footerLinks.help.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-white mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-xs text-[#7e7e7e]">
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
              Promotions
            </h4>
            <ul className="space-y-3 text-xs text-[#7e7e7e]">
              {footerLinks.promotions.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Social Media */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 flex lg:justify-end items-start space-x-4">
            {/* Twitter / X */}
            <a href="https://twitter.com/nike" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#7e7e7e] hover:bg-white text-black flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* Facebook */}
            <a href="https://facebook.com/nike" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#7e7e7e] hover:bg-white text-black flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/></svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com/user/nike" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#7e7e7e] hover:bg-white text-black flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com/nike" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#7e7e7e] hover:bg-white text-black flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>

        {/* Bottom Legal & Location Row */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between text-[11px] text-[#7e7e7e] gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-white font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>United States / English</span>
            </div>
            <span>© 2026 Nike, Inc. All Rights Reserved</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-white transition-colors">Guides</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Sale</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Nike Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Your Privacy Choices</a>
            <a href="#" className="hover:text-white transition-colors">CA Supply Chains Act</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
