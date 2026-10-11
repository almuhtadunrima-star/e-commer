import React, { useState } from 'react';
import { X, ArrowRight, Truck, MapPin, User, Phone, FileText, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { shippingCouriers } from '../data/products';
import { formatRupiah } from '../utils/format';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  discountAmount,
  discountPercent,
  onProceedToPayment
}) {
  if (!isOpen) return null;

  // Form State
  const [formData, setFormData] = useState({
    fullName: "Ahmad Fauzi",
    phoneNumber: "081298765432",
    cityRegion: "DKI Jakarta, Jakarta Selatan",
    fullAddress: "Jl. Senopati No. 45, RT 04 / RW 02, Kebayoran Baru",
    postalCode: "12190",
    orderNotes: "Tolong pastikan kotak sepatu dalam kondisi mulus, jangan ditumpuk berat."
  });

  const [selectedCourierId, setSelectedCourierId] = useState("jne-reg");
  const [formErrors, setFormErrors] = useState({});

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeShippingEligible = subtotal >= 1500000;
  
  const selectedCourier = shippingCouriers.find((c) => c.id === selectedCourierId) || shippingCouriers[0];
  const actualShippingCost = isFreeShippingEligible ? 0 : selectedCourier.cost;
  const grandTotal = Math.max(0, subtotal - (discountAmount || 0) + actualShippingCost);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateAndProceed = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Nama lengkap wajib diisi";
    if (!formData.phoneNumber.trim()) errors.phoneNumber = "Nomor WhatsApp wajib diisi";
    if (!formData.cityRegion.trim()) errors.cityRegion = "Kota / Wilayah wajib diisi";
    if (!formData.fullAddress.trim()) errors.fullAddress = "Alamat lengkap wajib diisi";
    if (!formData.postalCode.trim()) errors.postalCode = "Kode pos wajib diisi";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onProceedToPayment({
      customer: formData,
      courier: {
        ...selectedCourier,
        finalCost: actualShippingCost,
        isFreePromo: isFreeShippingEligible
      },
      summary: {
        subtotal,
        discountAmount: discountAmount || 0,
        discountPercent: discountPercent || 0,
        shippingCost: actualShippingCost,
        grandTotal
      },
      items: cartItems
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div 
          className="relative glass-ios border border-white/80 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/60 flex items-center justify-between bg-white/40 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-sm shadow-sm">
                4
              </span>
              <div>
                <h2 className="text-xl font-black text-black">Checkout & Pengiriman</h2>
                <p className="text-xs text-gray-500 font-medium">Lengkapi alamat pengiriman dan pilih jasa kurir</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 glass-ios-pill hover:bg-white/80 rounded-full text-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form + Ringkasan Pesanan (Grid Layout) */}
          <form onSubmit={validateAndProceed} className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto text-left">
            {/* Bagian Kiri: Data Pengiriman & Opsi Kurir (7 Kolom) */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-8 bg-transparent border-r border-white/60">
              {/* Bagian 1: Data Penerima */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-black" />
                  1. Informasi Penerima Paket
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Contoh: Ahmad Fauzi"
                      className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm outline-none transition-all ${
                        formErrors.fullName ? 'border-red-500 bg-red-50/50' : 'border-white/80 glass-ios-input focus:border-black'
                      }`}
                    />
                    {formErrors.fullName && <p className="text-[11px] text-red-500 mt-1 font-semibold">{formErrors.fullName}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Nomor WhatsApp / HP *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="0812xxxxxxxx"
                      className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm outline-none transition-all ${
                        formErrors.phoneNumber ? 'border-red-500 bg-red-50/50' : 'border-white/80 glass-ios-input focus:border-black'
                      }`}
                    />
                    {formErrors.phoneNumber && <p className="text-[11px] text-red-500 mt-1 font-semibold">{formErrors.phoneNumber}</p>}
                  </div>
                </div>
              </div>

              {/* Bagian 2: Alamat Lengkap */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-black" />
                  2. Alamat Tujuan Pengiriman
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-gray-700 block mb-1">Provinsi, Kota / Wilayah *</label>
                      <select
                        name="cityRegion"
                        value={formData.cityRegion}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-2xl border border-white/80 glass-ios-input text-xs sm:text-sm outline-none focus:border-black font-semibold cursor-pointer"
                      >
                        <option value="DKI Jakarta, Jakarta Selatan">DKI Jakarta - Jakarta Selatan</option>
                        <option value="DKI Jakarta, Jakarta Pusat">DKI Jakarta - Jakarta Pusat</option>
                        <option value="DKI Jakarta, Jakarta Barat">DKI Jakarta - Jakarta Barat</option>
                        <option value="Jawa Barat, Bandung">Jawa Barat - Kota Bandung</option>
                        <option value="Banten, Tangerang Selatan">Banten - Tangerang Selatan (BSD/Bintaro)</option>
                        <option value="Jawa Timur, Surabaya">Jawa Timur - Kota Surabaya</option>
                        <option value="DI Yogyakarta, Sleman">DI Yogyakarta - Sleman</option>
                        <option value="Bali, Denpasar">Bali - Denpasar</option>
                        <option value="Sumatera Utara, Medan">Sumatera Utara - Medan</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Kode Pos *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="12190"
                        className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm outline-none transition-all ${
                          formErrors.postalCode ? 'border-red-500 bg-red-50/50' : 'border-white/80 glass-ios-input focus:border-black'
                        }`}
                      />
                      {formErrors.postalCode && <p className="text-[11px] text-red-500 mt-1 font-semibold">{formErrors.postalCode}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Alamat Lengkap (Jalan, No. Rumah, RT/RW, Patokan) *</label>
                    <textarea
                      rows={2}
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleInputChange}
                      placeholder="Nama jalan, gedung, blok, nomor rumah, nomor unit"
                      className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm outline-none transition-all resize-none ${
                        formErrors.fullAddress ? 'border-red-500 bg-red-50/50' : 'border-white/80 glass-ios-input focus:border-black'
                      }`}
                    />
                    {formErrors.fullAddress && <p className="text-[11px] text-red-500 mt-1 font-semibold">{formErrors.fullAddress}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Catatan Tambahan untuk Kurir (Opsional)</label>
                    <input
                      type="text"
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      placeholder="Contoh: Titip ke satpam cluster bila rumah kosong"
                      className="w-full px-4 py-2.5 rounded-2xl border border-white/80 glass-ios-input text-xs sm:text-sm outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 3: Pilihan Kurir Ekspedisi (Step 5) */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                    <Truck className="w-4 h-4 text-black" />
                    3. Pilih Layanan Pengiriman (Kurir)
                  </h3>
                  {isFreeShippingEligible && (
                    <span className="text-[11px] font-bold text-green-700 glass-ios-pill border border-emerald-300 px-3 py-1 rounded-full shadow-xs">
                      Promo Bebas Ongkir Aktif
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {shippingCouriers.map((courier) => {
                    const isSelected = selectedCourierId === courier.id;
                    const finalRate = isFreeShippingEligible ? 0 : courier.cost;

                    return (
                      <div
                        key={courier.id}
                        onClick={() => setSelectedCourierId(courier.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-black bg-black text-white shadow-lg'
                            : 'glass-ios-card border-white/75 hover:border-white text-gray-900 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5">
                          <span className="text-2xl">{courier.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className={`text-sm font-extrabold ${isSelected ? 'text-white' : 'text-black'}`}>{courier.name}</h4>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-gray-700'
                              }`}>
                                {courier.service}
                              </span>
                            </div>
                            <p className={`text-xs mt-0.5 font-medium ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                              Estimasi Tiba: <strong className={isSelected ? 'text-white' : 'text-gray-800'}>{courier.etd}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          {isFreeShippingEligible ? (
                            <div className="space-y-0.5">
                              <span className={`text-sm font-black ${isSelected ? 'text-emerald-300' : 'text-green-700'}`}>GRATIS</span>
                              <p className={`text-[10px] line-through font-semibold ${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>
                                {formatRupiah(courier.cost)}
                              </p>
                            </div>
                          ) : (
                            <span className={`text-sm font-extrabold ${isSelected ? 'text-white' : 'text-black'}`}>
                              {formatRupiah(courier.cost)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bagian Kanan: Ringkasan Produk & Total (5 Kolom) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-white/30 backdrop-blur-md flex flex-col justify-between border-t lg:border-t-0 border-white/60">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-black mb-4">
                  Ringkasan Pesanan ({cartItems.length} Produk)
                </h3>

                {/* Daftar Produk Singkat */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-6 divide-y divide-white/60">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="pt-3 flex gap-3">
                      <div className="w-14 h-14 bg-white/50 backdrop-blur-md rounded-xl p-1 border border-white/80 flex-shrink-0 flex items-center justify-center shadow-xs">
                        <img
                          src={item.selectedImage || item.colors[0]?.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex justify-between font-bold text-gray-900">
                          <span className="line-clamp-1">{item.name}</span>
                          <span>{formatRupiah(item.price * item.quantity)}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {item.selectedSize} • {item.selectedColor} • x{item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Perhitungan Biaya Real-time */}
                <div className="glass-ios-card p-4 rounded-2xl border border-white/80 space-y-2 text-xs text-gray-600 mb-6 shadow-sm">
                  <div className="flex justify-between">
                    <span>Subtotal Produk</span>
                    <span className="font-bold text-black">{formatRupiah(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Potongan Kupon ({discountPercent}%)</span>
                      <span>-{formatRupiah(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Ongkos Kirim ({selectedCourier.name})</span>
                    <span className="font-bold text-black">
                      {isFreeShippingEligible ? (
                        <span className="text-green-700">Rp 0 (Gratis)</span>
                      ) : (
                        formatRupiah(selectedCourier.cost)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-white/60 text-sm sm:text-base font-black text-black">
                    <span>Total Pembayaran</span>
                    <span className="text-black">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Tombol Lanjut ke Simulasi Pembayaran (Step 6) */}
              <div className="space-y-3 pt-4 border-t border-white/60">
                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white hover:bg-neutral-800 rounded-full font-black text-sm tracking-tight transition-all active:scale-[0.99] flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl"
                >
                  <span>Lanjut ke Metode Pembayaran</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Garansi Pengiriman Aman & Terlindungi Asuransi</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
