import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import PromoBanner from './components/PromoBanner';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrendingCarousel from './components/TrendingCarousel';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import WishlistModal from './components/WishlistModal';
import MembershipBanner from './components/MembershipBanner';
import Footer from './components/Footer';
import SignInModal from './components/SignInModal';
import Toast from './components/Toast';
import { products } from './data/products';

export default function App() {
  // Persistence state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('nike_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('nike_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nike_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // UI state
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'signin' });
  const [toast, setToast] = useState(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('nike_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nike_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nike_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nike_user');
    }
  }, [user]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Cart actions
  const handleAddToCart = (productToAdd) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.id === productToAdd.id &&
          item.selectedSize === productToAdd.selectedSize &&
          item.selectedColor === productToAdd.selectedColor
      );

      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { ...productToAdd, quantity: 1 }];
      }
    });

    showToast(`Added ${productToAdd.name} (US ${productToAdd.selectedSize}) to Bag`, 'bag');
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
    showToast(`Removed from Bag`, 'info');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Favorites actions
  const handleToggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed ${product.name} from Favorites`, 'fav');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved ${product.name} to Favorites`, 'fav');
        return [...prev, product];
      }
    });
  };

  const handleRemoveFavorite = (product) => {
    setFavorites((prev) => prev.filter((p) => p.id !== product.id));
    showToast(`Removed from Favorites`, 'fav');
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    // Smooth scroll to product grid
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col text-[#111111]">
      {/* Top utility Bar */}
      <TopBar
        user={user}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onSignOut={() => {
          setUser(null);
          showToast('Signed out of Nike Member account');
        }}
      />

      {/* Main Nike Navigation */}
      <Navbar
        cartCount={totalCartItems}
        wishlistCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Announcements ticker banner */}
      <PromoBanner onCategorySelect={handleCategorySelect} />

      {/* Hero Campaign (only on All or when not searching) */}
      {!searchQuery && activeCategory === "All" && (
        <HeroSection onShopCategory={handleCategorySelect} />
      )}

      {/* Trending Stories Carousel */}
      {!searchQuery && activeCategory === "All" && (
        <TrendingCarousel onSelectStoryCategory={handleCategorySelect} />
      )}

      {/* Product Wall Catalog */}
      <ProductGrid
        products={products}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onOpenDetail={setSelectedProduct}
        onQuickAdd={handleAddToCart}
      />

      {/* Nike Membership Callout */}
      {!user && (
        <MembershipBanner
          onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        />
      )}

      {/* Official Nike Footer */}
      <Footer />

      {/* Modals & Slide-overs */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        isFavorite={Boolean(selectedProduct && favorites.some((f) => f.id === selectedProduct.id))}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onAddToCart={handleAddToCart}
        onOpenDetail={setSelectedProduct}
      />

      <SignInModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'signin' })}
        onSignInSuccess={(u) => {
          setUser(u);
          showToast(`Welcome back, ${u.name}!`);
        }}
      />

      {/* Floating Toast Notification */}
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
