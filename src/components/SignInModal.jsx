import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function SignInModal({ isOpen, initialMode, onClose, onSignInSuccess }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(initialMode || 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (mode === 'join' && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    const userName = mode === 'join' ? name : email.split('@')[0];
    onSignInSuccess({
      email,
      name: userName.charAt(0).toUpperCase() + userName.slice(1)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div 
          className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 sm:p-10 z-10 text-center animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* MA Store Logo */}
          <div className="flex justify-center mb-3">
            <img src="/logo.png" alt="MA Store" className="h-16 w-auto object-contain rounded-2xl shadow-md" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight mb-2">
            {mode === 'signin' ? 'AKUN RESMI MA STORE ANDA' : 'BERGABUNG JADI MEMBER MA STORE'}
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            {mode === 'signin' 
              ? 'Masukkan email dan password untuk mengakses promo member eksklusif.'
              : 'Buat profil Member MA Store untuk akses produk terfavorit dan penawaran spesial.'}
          </p>

          {error && (
            <div className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
            {mode === 'join' && (
              <div>
                <input
                  type="text"
                  placeholder="First and Last Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none focus:border-black transition-colors"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 py-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-black rounded" />
                <span>Keep me signed in</span>
              </label>
              {mode === 'signin' && (
                <a href="#" className="hover:text-black underline">Forgot password?</a>
              )}
            </div>

            <p className="text-[11px] text-gray-400 text-center py-2">
              By logging in, you agree to Nike's <a href="#" className="underline text-gray-600">Privacy Policy</a> and <a href="#" className="underline text-gray-600">Terms of Use</a>.
            </p>

            <button
              type="submit"
              className="w-full py-3.5 bg-black text-white hover:bg-gray-800 rounded-full font-bold text-sm tracking-tight transition-all active:scale-95 shadow-md"
            >
              {mode === 'signin' ? 'Sign In' : 'Join Us'}
            </button>
          </form>

          {/* Toggle Mode Link */}
          <div className="mt-6 text-xs text-gray-600">
            {mode === 'signin' ? (
              <p>
                Not a Member?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('join');
                    setError('');
                  }}
                  className="text-black font-bold underline ml-1"
                >
                  Join Us
                </button>
              </p>
            ) : (
              <p>
                Already a Member?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError('');
                  }}
                  className="text-black font-bold underline ml-1"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
