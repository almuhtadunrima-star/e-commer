# e-commer 👟🇮🇩

Modern, High-Performance, End-to-End E-Commerce Platform built with **React 18**, **Vite**, and **Tailwind CSS**.

Website toko online modern, profesional, responsive, dan usable dengan alur pembelian **8 Tahap (End-to-End User Flow)** lengkap:
`Discover` → `Product Detail Page` → `Shopping Cart` → `Checkout` → `Delivery` → `Payment` → `Order Confirmation` → `Delivery Tracking`.

---

## 🛒 Alur Pembelian 8 Tahap (User Flow)

### 1. Discover Product (Katalog & Pencarian)
- Katalog produk sepatu & apparel resmi dengan foto resolusi tinggi.
- *Live search* instan real-time berdasarkan kata kunci nama produk, seri, dan deskripsi.
- Filter Kategori (*Running, Basketball, Lifestyle, Gym & Training, All*).
- Filter Gender (*Pria, Wanita, Unisex*).
- Filter Rentang Harga (Rupiah IDR) & switch ketersediaan *Ready Stock*.
- Sorting produk (*Terbaru, Harga Terendah, Harga Tertinggi, Rating Tertinggi*).

### 2. Dedicated Product Detail Page (Halaman Detail Produk Resmi)
- **Halaman Penuh (Bukan Modal / Pop-up)** dengan sticky breadcrumb navigasi.
- Sinkronisasi URL browser dinamis (`?product=:id`) yang mendukung *Back/Forward* browser dan *direct link sharing*.
- Galeri foto utama dengan zoom preview dan thumbnail selector varian warna dinamis.
- Pemilihan varian ukuran resmi (EU 40 - EU 45) dilengkapi modal **Panduan Ukuran (Size Chart)** standar centimeter (cm).
- Selector kuantitas pesanan dibatasi oleh sisa ketersediaan stok fisik.
- Tombol **"Beli Sekarang (Langsung Checkout)"** dan **"Tambah ke Keranjang Belanja"**.
- Section ulasan pembeli terverifikasi dari berbagai kota di Indonesia.
- Rekomendasi produk terkait (*"Kamu Mungkin Juga Menyukai"*).

### 3. Shopping Cart Drawer
- Keranjang belanja interaktif dengan persistensi data di `localStorage`.
- Tambah / kurangi kuantitas item (+ / -) dengan validasi batas stok.
- Hapus item individual atau bersihkan keranjang.
- Bar progres meteran **Gratis Ongkir** (ambang batas Rp 1.500.000).
- Kupon promo aktif: `DISKON10` (potongan 10%) dan `DISKON20` (potongan 20%).
- Rincian biaya subtotal, potongan diskon kupon, dan total belanja real-time.

### 4. Checkout
- Formulir data penerima pesanan:
  - Nama Lengkap
  - Nomor Handphone / WhatsApp
  - Kota & Wilayah (Jabodetabek, Bandung, Surabaya, Medan, Semarang, dll.)
  - Alamat Lengkap & Patokan
  - Kode Pos
  - Catatan Khusus untuk Kurir
- Validasi data input sebelum melangkah ke proses pembayaran.

### 5. Delivery / Shipping (Simulasi Ekspedisi Indonesia)
- Simulasi 5 jasa ekspedisi terpercaya Indonesia dengan tarif ongkir dan estimasi pengiriman dinamis:
  - **JNE Reguler** (Estimasi 2-3 hari)
  - **SiCepat BEST** (Estimasi 1-2 hari)
  - **J&T Express** (Estimasi 2-3 hari)
  - **AnterAja Regular** (Estimasi 2-4 hari)
  - **GoSend Instant** (Estimasi 3-6 jam)
- Potongan ongkir otomatis (Gratis Ongkir) jika memenuhi batas minimum belanja.

### 6. Payment (Simulasi Pembayaran Interaktif)
- Simulasi metode pembayaran populer di Indonesia:
  - **QRIS** (dilengkapi QR code dinamis dan hitung mundur timer pembayaran 15 menit)
  - **BCA Virtual Account** (dilengkapi nomor VA dan tombol *Copy*)
  - **Mandiri Virtual Account** (dilengkapi nomor VA)
  - **E-Wallet** (GoPay, OVO, DANA)
  - **COD (Bayar di Tempat)**
- Tombol **"Simulasikan Pembayaran Berhasil"** untuk melanjutkan alur belanja tanpa memerlukan kartu kredit asli.

### 7. Order Confirmation (Faktur & Invoice)
- Halaman faktur pesanan resmi dengan nomor pesanan unik (`ORD-XXXXXXXX`).
- Status pembayaran lunas terverifikasi.
- Rincian detail produk yang dibeli, harga, ongkir kurir, dan total pembayaran.
- Alamat tujuan pengiriman dan catatan pembeli.
- Tombol langsung untuk memantau status di pelacakan pengiriman.

### 8. Delivery Tracking (Live Tracking Simulator)
- Stepper visual 6 tahapan status pengiriman:
  1. *Pesanan Dibuat*
  2. *Pembayaran Berhasil*
  3. *Pesanan Diproses di Warehouse*
  4. *Diserahkan ke Kurir*
  5. *Dalam Pengiriman ke Alamat Tujuan*
  6. *Pesanan Sampai di Tujuan*
- Nomor Resi AWB unik (`AWB-XXXXXXXXXXXX`) per pesanan.
- Riwayat log stempel waktu perjalanan barang.
- **Tombol Simulator Cepat**: *"Percepat Status Kurir (+1 Tahap)"* untuk melihat perubahan status pengiriman hingga pesanan sampai.
- Fitur pelacakan riwayat pesanan kapan saja melalui menu **"Lacak Pesanan"** di Navbar.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/)
- **Bundler / Dev Server**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser `localStorage` (Cart, Favorites, Order History)

---

## 🚀 Cara Menjalankan Project

1. Clone repositori:
   ```bash
   git clone https://github.com/almuhtadunrima-star/e-commer.git
   cd e-commer/web-ecommer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Buka di browser:
   ```
   http://localhost:3000/
   ```

5. Build untuk produksi:
   ```bash
   npm run build
   ```
