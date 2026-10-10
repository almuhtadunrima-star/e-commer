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

          {/* Nike Swoosh Logo */}
          <div className="flex justify-center mb-4">
            <svg className="h-10 w-16 fill-[#111111]" viewBox="0 0 24 24">
              <path d="M21.707 5.293c-2.478 2.05-6.398 4.965-10.742 7.747-3.05 1.954-5.698 3.523-7.534 4.542-.716.398-1.472.778-2.187 1.092l-.128.055a.75.75 0 01-.989-.988c.328-.737.728-1.517 1.144-2.257 1.054-1.875 2.673-4.577 4.673-7.689 2.846-4.429 5.823-8.432 7.915-10.871a.75.75 0 011.08.026c.394.462.674.997.808 1.554.237.99-.04 2.112-.767 3.267 1.583-.984 3.738-2.217 6.137-3.414.288-.144.629-.024.773.264a.75.75 0 01-.183.672z" />
            </svg>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight mb-2">
            {mode === 'signin' ? 'YOUR ACCOUNT FOR EVERYTHING NIKE' : 'BECOME A NIKE MEMBER'}
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            {mode === 'signin' 
              ? 'Enter your email and password to access member benefits.'
              : 'Create your Nike Member profile and get first access to the very best products, inspiration and community.'}
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
