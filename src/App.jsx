import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import PromoBanner from './components/PromoBanner';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrendingCarousel from './components/TrendingCarousel';
import ProductGrid from './components/ProductGrid';
import ProductDetailPage from './components/ProductDetailPage';
import CartDrawer from './components/CartDrawer';
import WishlistModal from './components/WishlistModal';
import CheckoutModal from './components/CheckoutModal';
import PaymentModal from './components/PaymentModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import DeliveryTrackingModal from './components/DeliveryTrackingModal';
import TrackOrderLookupModal from './components/TrackOrderLookupModal';
import MembershipBanner from './components/MembershipBanner';
import Footer from './components/Footer';
import SignInModal from './components/SignInModal';
import Toast from './components/Toast';
import TrustBar from './components/TrustBar';
import SocialProofToast from './components/SocialProofToast';
import VipNewsletter from './components/VipNewsletter';
import { products } from './data/products';
import { generateOrderId, generateResi, formatRupiah } from './utils/format';

export default function App() {
  // Persistence state in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('tokosepatu_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('tokosepatu_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tokosepatu_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [recentOrders, setRecentOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('tokosepatu_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI & Flow State
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  
  // Checkout & Payment & Tracking Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [checkoutDiscount, setCheckoutDiscount] = useState({ percent: 0, amount: 0 });
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [isTrackLookupOpen, setIsTrackLookupOpen] = useState(false);

  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'signin' });
  const [toast, setToast] = useState(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('tokosepatu_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tokosepatu_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('tokosepatu_orders', JSON.stringify(recentOrders));
  }, [recentOrders]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('tokosepatu_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tokosepatu_user');
    }
  }, [user]);

  // Sync URL query (?product=id) with product detail page
  useEffect(() => {
    const syncProductFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product');
      if (prodId) {
        const found = products.find((p) => p.id === parseInt(prodId, 10));
        if (found) {
          setSelectedProduct(found);
          return;
        }
      }
      setSelectedProduct(null);
    };

    syncProductFromUrl();
    window.addEventListener('popstate', syncProductFromUrl);
    return () => window.removeEventListener('popstate', syncProductFromUrl);
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 1 & 2. Cart Actions (Step 3: Shopping Cart)
  const handleAddToCart = (productToAdd) => {
    const qtyToAdd = productToAdd.quantity || 1;
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.id === productToAdd.id &&
          item.selectedSize === productToAdd.selectedSize &&
          item.selectedColor === productToAdd.selectedColor
      );

      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += qtyToAdd;
        return newCart;
      } else {
        return [...prevCart, { ...productToAdd, quantity: qtyToAdd }];
      }
    });

    showToast(`Ditambahkan ke Keranjang: ${productToAdd.name} (${productToAdd.selectedSize})`, 'bag');
  };

  const handleUpdateCartQuantity = (targetItem, newQty) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === targetItem.id &&
        item.selectedSize === targetItem.selectedSize &&
        item.selectedColor === targetItem.selectedColor
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveFromCart = (targetItem) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === targetItem.id &&
            item.selectedSize === targetItem.selectedSize &&
            item.selectedColor === targetItem.selectedColor
          )
      )
    );
    showToast(`Produk dihapus dari keranjang`, 'info');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Direct Checkout (Beli Sekarang dari Modal Produk)
  const handleDirectCheckout = (productItem) => {
    const item = {
      ...productItem,
      quantity: productItem.quantity || 1
    };
    // Add to cart and directly launch checkout modal
    setCart([item]);
    setCheckoutDiscount({ percent: 0, amount: 0 });
    setIsCheckoutOpen(true);
  };

  // Step 3 -> Step 4: Lanjut dari Keranjang ke Checkout
  const handleProceedToCheckout = ({ appliedDiscountPercent, discountAmount }) => {
    if (cart.length === 0) {
      showToast("Keranjang Anda masih kosong", "info");
      return;
    }
    setCheckoutDiscount({
      percent: appliedDiscountPercent,
      amount: discountAmount
    });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Step 4 & 5 -> Step 6: Checkout Form Selesai -> Buka Simulasi Pembayaran
  const handleProceedToPayment = (completedCheckoutData) => {
    setCheckoutData(completedCheckoutData);
    setIsCheckoutOpen(false);
    setIsPaymentOpen(true);
  };

  // Step 6 -> Step 7: Pembayaran Berhasil Disimulasikan -> Buat Order & Tampilkan Konfirmasi
  const handlePaymentSuccess = (paidOrderData) => {
    const newOrderId = generateOrderId();
    const newResi = generateResi(paidOrderData.courier?.name || 'JNE');

    const finalizedOrder = {
      ...paidOrderData,
      orderId: newOrderId,
      resiNumber: newResi,
      currentStep: 3, // Mulai di step "Pesanan Diproses"
      statusTimeline: [
        { title: "Pesanan Dibuat", time: "Baru saja", done: true },
        { title: "Pembayaran Berhasil", time: "Baru saja", done: true },
        { title: "Pesanan Diproses", time: "Sedang berlangsung", done: true },
        { title: "Diserahkan ke Kurir", time: "Menunggu pickup", done: false },
        { title: "Dalam Pengiriman", time: "Estimasi 1-2 hari", done: false },
        { title: "Pesanan Sampai", time: "Menunggu", done: false }
      ]
    };

    // Simpan ke riwayat pesanan & kosongkan cart
    setConfirmedOrder(finalizedOrder);
    setRecentOrders((prev) => [finalizedOrder, ...prev]);
    setCart([]);
    setIsPaymentOpen(false);
    setIsConfirmationOpen(true);
    showToast(`Pembayaran Sukses! No. Pesanan: ${newOrderId}`, 'info');
  };

  // Step 7 -> Step 8: Dari Konfirmasi Pesanan Buka Pelacakan Pengiriman
  const handleOpenTrackingFromConfirmation = (order) => {
    setTrackingOrder(order);
    setIsConfirmationOpen(false);
    setIsTrackingOpen(true);
  };

  // Update Status Pengiriman Kurir (Simulasi Percepat Pengiriman)
  const handleUpdateOrderStatus = (orderId, newStep) => {
    setRecentOrders((prev) =>
      prev.map((ord) =>
        ord.orderId === orderId ? { ...ord, currentStep: newStep } : ord
      )
    );
    if (trackingOrder && trackingOrder.orderId === orderId) {
      setTrackingOrder((prev) => ({ ...prev, currentStep: newStep }));
    }
    showToast(`Status Kurir diperbarui ke Tahap ${newStep}!`, 'info');
  };

  // Favorites Actions
  const handleToggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Dihapus dari Favorit: ${product.name}`, 'fav');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Disimpan ke Favorit: ${product.name}`, 'fav');
        return [...prev, product];
      }
    });
  };

  const handleRemoveFavorite = (product) => {
    setFavorites((prev) => prev.filter((p) => p.id !== product.id));
    showToast(`Dihapus dari Favorit`, 'fav');
  };

  // Product Detail Page Navigation Handlers
  const handleOpenProductDetail = (product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const url = new URL(window.location.href);
    url.searchParams.set('product', product.id);
    window.history.pushState({ productId: product.id }, '', url.toString());
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const url = new URL(window.location.href);
    url.searchParams.delete('product');
    window.history.pushState({}, '', url.toString());
  };

  const handleCategorySelect = (category) => {
    setSelectedProduct(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('product');
    window.history.pushState({}, '', url.toString());
    setActiveCategory(category);
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query && selectedProduct) {
      setSelectedProduct(null);
      const url = new URL(window.location.href);
      url.searchParams.delete('product');
      window.history.pushState({}, '', url.toString());
    }
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#edf1f7] relative flex flex-col text-slate-900 selection:bg-black selection:text-white">
      {/* iOS Liquid Glass Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden w-full h-full">
        <div className="absolute -top-32 -left-32 w-72 sm:w-96 h-72 sm:h-96 bg-blue-300/20 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="absolute top-1/4 -right-32 w-72 sm:w-[450px] h-72 sm:h-[450px] bg-purple-300/20 rounded-full blur-[90px] sm:blur-[120px]" />
        <div className="absolute top-2/3 -left-32 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-200/20 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="absolute -bottom-20 right-1/4 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-sky-200/20 rounded-full blur-[90px] sm:blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        {/* 1. Top Utility Bar */}
      <TopBar
        user={user}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onSignOut={() => {
          setUser(null);
          showToast('Anda telah keluar dari akun');
        }}
        onOpenTrackLookup={() => setIsTrackLookupOpen(true)}
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        cartCount={totalCartItems}
        wishlistCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onOpenTrackLookup={() => setIsTrackLookupOpen(true)}
        products={products}
        onSelectProduct={handleOpenProductDetail}
      />

      {/* 3. Promo Announcements Banner Ticker */}
      <PromoBanner onCategorySelect={handleCategorySelect} />

      {/* Conditional: Dedicated Product Detail Page OR Home & Catalog Grid */}
      {selectedProduct ? (
        /* Step 2: Dedicated Product Detail Page (Bukan Modal/Pop-up) */
        <ProductDetailPage
          product={selectedProduct}
          allProducts={products}
          onBackToCatalog={handleBackToCatalog}
          onSelectProduct={handleOpenProductDetail}
          isFavorite={Boolean(favorites.some((f) => f.id === selectedProduct.id))}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          onDirectCheckout={handleDirectCheckout}
        />
      ) : (
        <>
          {/* 4. Hero Section & Trending (Hanya di mode awal / All) */}
          {!searchQuery && activeCategory === "All" && (
            <>
              <HeroSection onShopCategory={handleCategorySelect} />
              <TrendingCarousel onSelectStoryCategory={handleCategorySelect} />
            </>
          )}

          {/* 5. Enterprise Trust Bar & Guarantees Strip */}
          <TrustBar />

          {/* 6. Discover Product: The Wall / Product Catalog Grid (Step 1) */}
          <ProductGrid
            products={products}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchQuery={searchQuery}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenDetail={handleOpenProductDetail}
            onQuickAdd={handleAddToCart}
          />
        </>
      )}

      {/* 7. MA Store VIP Club & 10% First Order Coupon */}
      <VipNewsletter />

      {/* 8. Membership Banner */}
      {!user && (
        <MembershipBanner
          onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        />
      )}

      {/* 9. Official Footer */}
      <Footer onOpenTrackLookup={() => setIsTrackLookupOpen(true)} />

      {/* --- DIALOGS FOR REMAINING E-COMMERCE USER FLOW --- */}

      {/* Step 3: Shopping Cart Drawer (Kuantitas, Hapus, Subtotal, Kupon) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        onOpenDetail={handleOpenProductDetail}
      />

      {/* Step 4 & 5: Checkout & Delivery Selection Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        discountAmount={checkoutDiscount.amount}
        discountPercent={checkoutDiscount.percent}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Step 6: Payment Simulation Modal (QRIS, BCA VA, Mandiri VA, COD, E-Wallet) */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        checkoutData={checkoutData}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Step 7: Order Confirmation Modal (Order ID, Invoice, Alamat, Kurir) */}
      <OrderConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        order={confirmedOrder}
        onOpenTracking={handleOpenTrackingFromConfirmation}
      />

      {/* Step 8: Delivery Tracking Modal (6 Tahapan Alur, No Resi, Kurir, Simulasi Cepat) */}
      <DeliveryTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        order={trackingOrder}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* Quick Track Order Lookup Modal */}
      <TrackOrderLookupModal
        isOpen={isTrackLookupOpen}
        onClose={() => setIsTrackLookupOpen(false)}
        recentOrders={recentOrders}
        onSelectOrderToTrack={(ord) => {
          setTrackingOrder(ord);
          setIsTrackingOpen(true);
        }}
      />

      {/* Wishlist Favorites Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onAddToCart={handleAddToCart}
        onOpenDetail={handleOpenProductDetail}
      />

      {/* Sign In / Join Member Modal */}
      <SignInModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'signin' })}
        onSignInSuccess={(u) => {
          setUser(u);
          showToast(`Selamat datang kembali, ${u.name}!`);
        }}
      />

      {/* Toast Pop-up Notification */}
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Live Social Proof Activity Toast */}
      <SocialProofToast onSelectProduct={handleOpenProductDetail} />
      </div>
    </div>
  );
}
