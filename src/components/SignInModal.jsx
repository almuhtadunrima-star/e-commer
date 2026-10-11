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
          className="relative glass-ios border border-white/80 w-full max-w-md rounded-3xl shadow-2xl p-8 sm:p-10 z-10 text-center animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full glass-ios-pill hover:bg-white/80 text-black transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* MA Store Brand Name */}
          <div className="flex justify-center mb-3">
            <span className="font-black text-3xl tracking-tight text-black uppercase">
              MA STORE
            </span>
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
            <div className="mb-4 text-xs font-semibold text-red-600 bg-red-50/70 border border-red-200 p-2.5 rounded-xl text-left">
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
                  className="w-full px-4 py-3 rounded-2xl border border-white/80 glass-ios-input text-sm outline-none focus:border-black transition-all font-semibold"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-white/80 glass-ios-input text-sm outline-none focus:border-black transition-all font-semibold"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-white/80 glass-ios-input text-sm outline-none focus:border-black transition-all font-semibold"
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
              Dengan masuk, Anda menyetujui <a href="#" className="underline text-gray-600">Kebijakan Privasi</a> dan <a href="#" className="underline text-gray-600">Ketentuan Layanan</a> MA Store.
            </p>

            <button
              type="submit"
              className="w-full py-4 bg-black text-white hover:bg-neutral-800 rounded-full font-black text-sm tracking-tight transition-all active:scale-95 shadow-xl hover:shadow-2xl"
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
