'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import LoginButton from '../components/LoginButton';
import { useTheme } from '../contexts/ThemeContext';

const ADMIN_EMAIL = 'nayemhasan1314@gmail.com';

export default function DashboardClient({ initialUrls, initialError, host, protocol }) {
    const { isDarkMode } = useTheme();
    const { data: session } = useSession();

    // Check if current user is admin
    const isAdmin = session?.user?.email === ADMIN_EMAIL;

    const [urls, setUrls] = useState(initialUrls);
    const [error, setError] = useState(initialError);
    const [sortBy, setSortBy] = useState('clicks'); // Options: 'clicks', 'shortCode', 'expirationDate'
    const [sortOrder, setSortOrder] = useState('desc'); // Options: 'asc', 'desc'
    const [filter, setFilter] = useState('all'); // Options: 'all', 'passwordProtected', 'expired'
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Function to fetch data (used for both polling and manual refresh)
    const fetchData = async () => {
        try {
            const res = await fetch('/api/urls');
            if (res.ok) {
                const data = await res.json();
                setUrls(data);
                setError(null);
            } else {
                setError('Failed to refresh analytics');
            }
        } catch (err) {
            setError('Failed to refresh analytics');
        }
    };

    // Polling to refresh data every 30 seconds
    useEffect(() => {
        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 30 * 1000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Function to copy text to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }).catch((err) => {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        });
    };

    // Sorting and filtering logic
    const sortedAndFilteredUrls = [...urls]
        .filter((url) => {
            if (filter === 'passwordProtected') return url.password;
            if (filter === 'expired') {
                return url.expirationDate && new Date(url.expirationDate) < new Date();
            }
            return true; // 'all'
        })
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'clicks') {
                comparison = a.clicks - b.clicks;
            } else if (sortBy === 'shortCode') {
                comparison = a.shortCode.localeCompare(b.shortCode);
            } else if (sortBy === 'expirationDate') {
                const dateA = a.expirationDate ? new Date(a.expirationDate) : new Date('9999-12-31');
                const dateB = b.expirationDate ? new Date(b.expirationDate) : new Date('9999-12-31');
                comparison = dateA - dateB;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    return (
        <div className={`min-h-screen transition-all duration-500 ${isDarkMode
            ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900'
            : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
            }`}>
            {/* Navigation Bar */}
            <nav className={`backdrop-blur-md fixed w-full top-0 z-50 transition-all duration-300 ${isDarkMode
                ? 'bg-gray-900/20 border-b border-gray-700/20'
                : 'bg-white/80 border-b border-slate-200 shadow-sm'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <span className={`text-2xl ${isDarkMode ? "text-white" : "text-blue-600"}`}>🔗</span>
                            <span className={`font-bold text-xl ${isDarkMode ? "text-white" : "text-slate-800"}`}>URLify</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                href="/"
                                className={`font-medium transition-colors duration-300 ${isDarkMode
                                    ? 'text-gray-300 hover:text-blue-400'
                                    : 'text-slate-600 hover:text-blue-600'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/dashboard"
                                className={`font-medium transition-colors duration-300 ${isDarkMode
                                    ? 'text-gray-300 hover:text-blue-400'
                                    : 'text-slate-600 hover:text-blue-600'
                                    }`}
                            >
                                Dashboard
                            </Link>
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
                                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
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
                            : 'bg-white/95 border-t border-slate-200 shadow-lg'
                            }`}>
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isDarkMode
                                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isDarkMode
                                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <div className="px-3 py-2">
                                    <LoginButton />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className={`text-4xl sm:text-5xl font-extrabold text-center mb-12 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {isAdmin ? (
                            <>
                                <span className="text-yellow-400">👑</span> Admin Dashboard <span className="text-yellow-400">👑</span>
                                <div className="text-sm font-normal text-yellow-300 mt-2">
                                    Viewing all users&apos; URLs
                                </div>
                            </>
                        ) : (
                            'Analytics Dashboard'
                        )}
                    </h1>

                    {/* Sorting, Filtering, and Refresh Controls */}
                    <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex space-x-4">
                            <div>
                                <label className={`mr-2 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDarkMode
                                        ? 'bg-gray-800 border-gray-600 text-white focus:ring-blue-400 [&>option]:bg-gray-800 [&>option]:text-white'
                                        : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                >
                                    <option value="clicks">Clicks</option>
                                    <option value="shortCode">Short Code</option>
                                    <option value="expirationDate">Expiration Date</option>
                                </select>
                            </div>
                            <div>
                                <label className={`mr-2 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Order:</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDarkMode
                                        ? 'bg-gray-800 border-gray-600 text-white focus:ring-blue-400 [&>option]:bg-gray-800 [&>option]:text-white'
                                        : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div>
                                <label className={`mr-2 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Filter:</label>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDarkMode
                                        ? 'bg-gray-800 border-gray-600 text-white focus:ring-blue-400 [&>option]:bg-gray-800 [&>option]:text-white'
                                        : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                >
                                    <option value="all">All</option>
                                    <option value="passwordProtected">Password Protected</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>
                            <button
                                onClick={fetchData}
                                className={`px-4 py-2 cursor-pointer rounded-lg text-white transition-colors duration-200 ${isDarkMode
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-md'
                                    }`}
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {error ? (
                        <div className={`p-6 rounded-2xl border text-center text-lg ${isDarkMode
                            ? 'bg-red-900/30 border-red-600/30 text-red-300'
                            : 'bg-red-50 border-red-300 text-red-700'
                            }`}>
                            {error}
                            <Link
                                href="/"
                                className={`block mt-4 hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                    }`}
                            >
                                Back to Home
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {sortedAndFilteredUrls.length === 0 ? (
                                <p className={`text-center text-lg ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                                    No URLs found.
                                </p>
                            ) : (
                                sortedAndFilteredUrls.map((url) => (
                                    <div
                                        key={url.shortCode}
                                        className={`backdrop-blur-md border rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${isDarkMode
                                            ? 'bg-gray-800/30 border-gray-600/30 hover:bg-gray-700/40'
                                            : 'bg-white/90 border-slate-200 hover:bg-white shadow-xl'
                                            }`}
                                    >
                                        <div className="space-y-3">
                                            {/* Short URL with Copy Button */}
                                            <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                                <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Short URL:</span>{' '}
                                                <a
                                                    href={`${protocol}${host}/${url.shortCode}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                                        }`}
                                                >
                                                    {`${protocol}${host}/${url.shortCode}`}
                                                </a>
                                                <button
                                                    onClick={() => copyToClipboard(`${protocol}${host}/${url.shortCode}`)}
                                                    className={`ml-2 cursor-pointer transition-colors duration-200 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                                                        }`}
                                                    title="Copy to clipboard"
                                                >
                                                    📋
                                                </button>
                                            </p>

                                            {/* Original URL */}
                                            <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                                <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Original URL:</span>{' '}
                                                <a
                                                    href={url.originalUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`hover:underline break-all ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                                        }`}
                                                >
                                                    {url.originalUrl}
                                                </a>
                                            </p>

                                            {/* User Information (Admin Only) */}
                                            {isAdmin && (
                                                <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                                    <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Created by:</span>{' '}
                                                    <span className={`${isDarkMode ? 'text-yellow-400' : 'text-amber-600'}`}>
                                                        {url.userName || url.userId || 'Anonymous'}
                                                    </span>
                                                    {url.userId && (
                                                        <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                                            ({url.userId})
                                                        </span>
                                                    )}
                                                </p>
                                            )}

                                            {/* Clicks */}
                                            <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                                <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Clicks:</span>{' '}
                                                <span className={`font-bold text-xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                                    }`}>{url.clicks || 0}</span>
                                            </p>

                                            {/* Expiration Date */}
                                            <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                                <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Expires On:</span>{' '}
                                                <span className={isDarkMode ? 'text-gray-400' : 'text-slate-600'}>
                                                    {url.expirationDate
                                                        ? new Date(url.expirationDate).toLocaleDateString()
                                                        : 'Never'}
                                                </span>
                                            </p>

                                            {/* Password Protected */}
                                            <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                                <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Password Protected:</span>{' '}
                                                <span
                                                    className={
                                                        url.password
                                                            ? isDarkMode ? 'text-yellow-300 font-medium' : 'text-amber-600 font-medium'
                                                            : isDarkMode ? 'text-gray-400' : 'text-slate-500'
                                                    }
                                                >
                                                    {url.password ? 'Yes' : 'No'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Contact Footer */}
                <footer className="mt-16 text-center">
                    <div className={`p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 ${isDarkMode
                        ? 'bg-gray-800/30 border-gray-700/50'
                        : 'bg-white/80 border-slate-200 shadow-lg'
                        }`}>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                            Built with ❤️ by{' '}
                            <a
                                href="https://naimul.me"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`font-medium transition-colors duration-200 ${isDarkMode
                                    ? 'text-blue-400 hover:text-blue-300'
                                    : 'text-blue-600 hover:text-blue-700'
                                    }`}
                            >
                                naimul.me
                            </a>
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}