'use client';

import { useState } from 'react';
import Features from './components/Features';

export default function Page() {
  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnimating(true);
    setError('');

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, password: isProtected ? password : null }),
      });
      const data = await res.json();

      if (res.ok) {
        setShortUrl(`http://${data.shortUrl}`);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to shorten URL');
    } finally {
      setIsAnimating(false);
    }
  };

  const togglePasswordProtection = () => {
    setIsProtected(!isProtected);
    if (!isProtected) {
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Navigation Bar */}
      <nav className="backdrop-blur-md bg-white/10 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-white">🔗</span>
              <span className="text-white font-bold text-xl">URLify</span>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <a href="#" className="text-white hover:text-pink-200 transition-colors duration-200 font-medium">Home</a>
                <a href="#" className="text-white hover:text-pink-200 transition-colors duration-200 font-medium">Contact</a>
                <a href="#" className="bg-white text-purple-600 px-4 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105">Login</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Shorten Your URLs
            <span className="block text-pink-200">With Style & Security</span>
          </h1>
          <p className="text-white/80 text-lg mb-12">
            Transform your long URLs into memorable, shareable links with optional password protection
          </p>

          {/* URL Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl">
              <div className="flex flex-col space-y-4">
                {/* URL Input */}
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your long URL here..."
                    className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200"
                    required
                  />
                </div>

                {/* Password Protection Toggle */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={togglePasswordProtection}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isProtected
                      ? 'bg-pink-500/20 text-pink-200'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                  >
                    {isProtected ? '🔒' : '🔓'}
                    {isProtected ? 'Password Protected' : 'Add Password Protection'}
                  </button>
                </div>

                {/* Password Input */}
                {isProtected && (
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password for protection..."
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200"
                      required={isProtected}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-200"
                    >
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full md:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-medium text-white hover:opacity-90 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 flex items-center justify-center gap-2 ${isAnimating ? 'animate-pulse' : ''
                    }`}
                >
                  Shorten URL
                  <span>➡️</span>
                </button>
              </div>

              {/* Result Section */}
              {shortUrl && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2 text-white">
                    <span>🌐</span>
                    <span>{shortUrl}</span>
                    {isProtected && <span className="text-pink-400">🔒</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(shortUrl)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    <span className="text-white">📋</span>
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 rounded-xl border border-red-500/30 text-pink-200 animate-fade-in">
                  {error}
                </div>
              )}
            </div>
          </form>

          {/* Features */}
          <Features />
        </div>
      </main>
    </div>
  );
}