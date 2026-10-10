import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingCost = subtotal >= 50 || subtotal === 0 ? 0 : 8.00;
  const estimatedTax = (subtotal - discountAmount) * 0.08;
  const total = Math.max(0, subtotal - discountAmount + shippingCost + estimatedTax);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'NIKE20' || promoCode.trim().toUpperCase() === 'JUSTDOIT') {
      setDiscountPercent(20);
      setPromoSuccess('Promo code applied: 20% OFF!');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try "NIKE20" or "JUSTDOIT".');
      setPromoSuccess('');
    }
  };

  const handleSimulateCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      onClearCart();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-black">
              Bag ({items.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Free Shipping Meter */}
            <div className="bg-[#f5f5f5] p-3.5 rounded-xl">
              {subtotal >= 50 ? (
                <div className="flex items-center space-x-2 text-xs font-bold text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Congrats! You've qualified for FREE standard delivery!</span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                    <span>Free Shipping</span>
                    <span>Add ${(50 - subtotal).toFixed(2)} more</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-black h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {orderComplete ? (
              <div className="py-16 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
                <h3 className="text-2xl font-black text-black">Order Placed Successfully!</h3>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                  Thank you for shopping at Nike! A confirmation email and tracking number have been generated.
                </p>
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    onClose();
                  }}
                  className="px-8 py-3 bg-black text-white font-bold text-sm rounded-full hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="text-base font-bold text-gray-700">There are no items in your bag.</p>
                <p className="text-xs text-gray-500">Discover new arrivals and trending styles today.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              /* Items list */
              <div className="space-y-4 divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="pt-4 flex gap-4 text-left">
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-[#f6f6f6] rounded-lg p-2 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.selectedImage || item.colors[0]?.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-black leading-tight">{item.name}</h4>
                          <span className="text-sm font-bold text-black ml-2">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                        <div className="text-xs text-gray-500 mt-1 space-x-2">
                          <span>Size: <strong>US {item.selectedSize}</strong></span>
                          <span>•</span>
                          <span>Color: <strong>{item.selectedColor}</strong></span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2 border border-gray-200 rounded-full px-2 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:text-black text-gray-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                            className="p-1 hover:text-black text-gray-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer / Summary / Checkout */}
          {items.length > 0 && !orderComplete && (
            <div className="p-6 border-t border-gray-100 bg-white space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. NIKE20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-xs uppercase outline-none focus:border-black font-semibold"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-100 hover:bg-black hover:text-white rounded-full text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </form>
              {promoSuccess && <p className="text-xs text-green-600 font-semibold">{promoSuccess}</p>}
              {promoError && <p className="text-xs text-red-500 font-medium">{promoError}</p>}

              {/* Order Calculation Details */}
              <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">${subtotal.toFixed(2)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Discount (20%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery & Handling</span>
                  <span className="font-semibold text-black">
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-black">${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-black pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="space-y-2 pt-2">
                <button
                  disabled={isCheckingOut}
                  onClick={handleSimulateCheckout}
                  className="w-full py-4 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 rounded-full font-bold text-sm tracking-tight transition-all active:scale-[0.99] flex items-center justify-center space-x-2 shadow-lg"
                >
                  {isCheckingOut ? (
                    <span className="animate-pulse">Processing Order...</span>
                  ) : (
                    <>
                      <span>Member Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  <span>Secure 256-bit Encrypted Checkout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
