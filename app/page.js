/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Features from './components/Features';
import ThemeToggle from './components/ThemeToggle';
import LoginButton from './components/LoginButton';
import { useTheme } from './contexts/ThemeContext';

export default function Page() {
  const { isDarkMode } = useTheme();
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;
  
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [password, setPassword] = useState('');
  const [expirationDate, setExpirationDate] = useState(''); // New state for expiration date
  const [shortUrl, setShortUrl] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnimating(true);
    setError('');

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          customCode,
          password: isProtected ? password : null,
          expirationDate, // Include expiration date in the request
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setShortUrl(data.shortUrl);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to shorten URL');
    } finally {
      setIsAnimating(false);
      setUrl('');
      setCustomCode('');
      setExpirationDate(''); // Reset expiration date after submission
    }
  };

  const togglePasswordProtection = () => {
    setIsProtected(!isProtected);
    if (!isProtected) {
      setPassword('');
    }
  };

  // Get the minimum date for the expiration input (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900'
        : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
      }`}>
      {/* Navigation Bar */}
      <nav className={`backdrop-blur-md fixed w-full top-0 z-50 transition-all duration-300 ${isDarkMode
          ? 'bg-gray-900/20 border-b border-gray-700/20'
          : 'bg-white/10'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-white">🔗</span>
              <span className="text-white font-bold text-xl">URLify</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className={`font-medium transition-colors duration-200 ${isDarkMode
                  ? 'text-gray-300 hover:text-blue-400'
                  : 'text-white hover:text-pink-200'
                }`}>
                Home
              </a>
              {isAuthenticated && (
                <Link href="/dashboard" className={`font-medium transition-colors duration-200 ${isDarkMode
                    ? 'text-gray-300 hover:text-blue-400'
                    : 'text-white hover:text-pink-200'
                  }`}>
                  Dashboard
                </Link>
              )}
              <a href="#contact" className={`font-medium transition-colors duration-200 ${isDarkMode
                  ? 'text-gray-300 hover:text-blue-400'
                  : 'text-white hover:text-pink-200'
                }`}>
                Contact
              </a>
              <ThemeToggle />
              <LoginButton />
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md transition-colors duration-200 ${isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    : 'text-white hover:text-pink-200 hover:bg-white/10'
                  }`}
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className={`md:hidden transition-all duration-300 ${isDarkMode
                ? 'bg-gray-900/95 border-t border-gray-700/50'
                : 'bg-white/90 border-t border-white/20'
              }`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a 
                  href="#" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                >
                  Home
                </a>
                {isAuthenticated && (
                  <Link 
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                      }`}
                  >
                    Dashboard
                  </Link>
                )}
                <a 
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                >
                  Contact
                </a>
                <div className="px-3 py-2">
                  <LoginButton />
                </div>
              </div>
            </div>
          )}
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
            <div className={`backdrop-blur-lg p-8 rounded-2xl shadow-2xl transition-all duration-300 ${isDarkMode
                ? 'bg-gray-800/30 border border-gray-600/30'
                : 'bg-white/10'
              }`}>
              <div className="flex flex-col space-y-4">
                {/* URL Input */}
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your long URL here..."
                    className={`flex-1 px-6 py-4 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 ${isDarkMode
                        ? 'bg-gray-700/30 border-gray-600/30 text-white placeholder-gray-400 focus:ring-blue-400'
                        : 'bg-white/5 border-white/10 text-white placeholder-white/50 focus:ring-pink-400'
                      }`}
                    required
                  />
                </div>

                {/* Custom Short Code Input */}
                {url && (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value)}
                      placeholder="Custom short code (optional)"
                      className={`w-full px-6 py-4 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 ${isDarkMode
                          ? 'bg-gray-700/30 border-gray-600/30 text-white placeholder-gray-400 focus:ring-blue-400'
                          : 'bg-white/5 border-white/10 text-white placeholder-white/50 focus:ring-pink-400'
                        }`}
                    />
                    <p className={`text-sm text-left ${isDarkMode ? 'text-gray-400' : 'text-white/70'}`}>
                      Enter a custom code (e.g., "mycustomcode"). Leave blank for a random code.
                    </p>
                  </div>
                )}

                {/* Expiration Date Input */}
                {url && (
                  <div className="flex flex-col gap-2">
                    <input
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      min={today} // Prevent selecting past dates
                      className={`w-full px-6 py-4 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 ${isDarkMode
                          ? 'bg-gray-700/30 border-gray-600/30 text-white placeholder-gray-400 focus:ring-blue-400'
                          : 'bg-white/5 border-white/10 text-white placeholder-white/50 focus:ring-pink-400'
                        }`}
                    />
                    <p className={`text-sm text-left ${isDarkMode ? 'text-gray-400' : 'text-white/70'}`}>
                      Set an expiration date (optional). Leave blank for a default of 30 days.
                    </p>
                  </div>
                )}

                {/* Password Protection Toggle */}
                {url && (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={togglePasswordProtection}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isProtected
                        ? isDarkMode
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                          : 'bg-pink-500/20 text-pink-200'
                        : isDarkMode
                          ? 'bg-gray-700/30 text-gray-300 hover:bg-gray-600/30 border border-gray-600/30'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                    >
                      {isProtected ? '🔒' : '🔓'}
                      {isProtected ? 'Password Protected' : 'Add Password Protection'}
                    </button>
                  </div>
                )}

                {/* Password Input */}
                {isProtected && (
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password for protection..."
                      className={`w-full px-6 py-4 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 ${isDarkMode
                          ? 'bg-gray-700/30 border-gray-600/30 text-white placeholder-gray-400 focus:ring-blue-400'
                          : 'bg-white/5 border-white/10 text-white placeholder-white/50 focus:ring-pink-400'
                        }`}
                      required={isProtected}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-white/50 hover:text-white/80'
                        }`}
                    >
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full md:w-auto px-8 py-4 rounded-xl font-medium text-white transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 flex items-center justify-center gap-2 cursor-pointer ${isDarkMode
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 focus:ring-blue-400'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 focus:ring-purple-400'
                    } ${isAnimating ? 'animate-pulse' : ''}`}
                >
                  Shorten URL
                  <span>➡️</span>
                </button>
              </div>

              {/* Result Section */}
              {shortUrl && (
                <div className={`mt-6 p-4 rounded-xl border flex items-center justify-between animate-fade-in ${isDarkMode
                    ? 'bg-gray-700/30 border-gray-600/30'
                    : 'bg-white/5 border-white/10'
                  }`}>
                  <div className="flex items-center gap-2 text-white">
                    <span>🌐</span>
                    <span>{shortUrl}</span>
                    {isProtected && <span className={isDarkMode ? 'text-blue-400' : 'text-pink-400'}>🔒</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(shortUrl)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-600/30' : 'hover:bg-white/10'
                      }`}
                  >
                    <span className="text-white cursor-pointer">📋</span>
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className={`mt-4 p-4 rounded-xl border animate-fade-in ${isDarkMode
                    ? 'bg-red-900/30 border-red-600/30 text-red-300'
                    : 'bg-red-500/20 border-red-500/30 text-pink-200'
                  }`}>
                  {error}
                </div>
              )}
            </div>
          </form>

          {/* Features */}
          <Features />

          {/* Contact Section */}
          <section id="contact" className="mt-16 text-center">
            <div className={`p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${isDarkMode
                ? 'bg-gray-800/30 border-gray-700/50'
                : 'bg-white/10 border-white/20'
              }`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-white'}`}>
                Get in Touch
              </h2>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-pink-100'}`}>
                Have questions or suggestions? Feel free to reach out!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://naimul.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-pink-500 hover:bg-pink-400 text-white'
                    } hover:scale-105 transform`}
                >
                  🌐 Visit naimul.me
                </a>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-pink-200'}`}>
                  Developer & Creator
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}