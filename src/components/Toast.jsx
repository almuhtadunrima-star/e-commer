import React from 'react';
import { CheckCircle, Heart, ShoppingBag } from 'lucide-react';

export default function Toast({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="glass-ios-dark text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-white/20 backdrop-blur-xl">
        {type === 'bag' ? (
          <ShoppingBag className="w-4 h-4 text-white" />
        ) : type === 'fav' ? (
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
        ) : (
          <CheckCircle className="w-4 h-4 text-green-400" />
        )}
        <span className="text-xs sm:text-sm font-semibold tracking-tight">{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xs font-bold pl-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
