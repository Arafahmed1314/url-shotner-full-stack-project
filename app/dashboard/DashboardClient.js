'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardClient({ initialUrls, error: initialError, host, protocol }) {
    // console.log('DashboardClient received props:', { initialUrls, initialError, host, protocol });

    const [urls, setUrls] = useState(initialUrls);
    const [error, setError] = useState(initialError);
    const [sortBy, setSortBy] = useState('clicks'); // Options: 'clicks', 'shortCode', 'expirationDate'
    const [sortOrder, setSortOrder] = useState('desc'); // Options: 'asc', 'desc'
    const [filter, setFilter] = useState('all'); // Options: 'all', 'passwordProtected', 'expired'

    // Function to fetch data (used for both polling and manual refresh)
    const fetchData = async () => {
        try {
            const res = await fetch('/api/urls');
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched URLs via polling or refresh:', data);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
            {/* Navigation Bar */}
            <nav className="backdrop-blur-md bg-white/10 fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <span className="text-white text-2xl">🔗</span>
                            <span className="text-white font-bold text-xl">URLify</span>
                        </div>
                        <div className="flex items-center space-x-8">
                            <Link
                                href="/"
                                className="text-gray-300 hover:text-teal-400 transition-colors duration-300 font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-gray-300 hover:text-teal-400 transition-colors duration-300 font-medium"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12 tracking-tight">
                        Analytics Dashboard
                    </h1>

                    {/* Sorting, Filtering, and Refresh Controls */}
                    <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex space-x-4">
                            <div>
                                <label className="text-gray-300 mr-2">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                                >
                                    <option value="clicks">Clicks</option>
                                    <option value="shortCode">Short Code</option>
                                    <option value="expirationDate">Expiration Date</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-gray-300 mr-2">Order:</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div>
                                <label className="text-gray-300 mr-2">Filter:</label>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                                >
                                    <option value="all">All</option>
                                    <option value="passwordProtected">Password Protected</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>
                            <button
                                onClick={fetchData}
                                className="px-4 py-2 cursor-pointer bg-teal-500 rounded-lg text-white hover:bg-teal-600 transition-colors"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {error ? (
                        <div className="p-6 bg-red-500/20 rounded-2xl border border-red-500/30 text-red-200 text-center text-lg">
                            {error}
                            <Link
                                href="/"
                                className="block mt-4 text-teal-400 hover:underline"
                            >
                                Back to Home
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {sortedAndFilteredUrls.length === 0 ? (
                                <p className="text-gray-300 text-center text-lg">No URLs found.</p>
                            ) : (
                                sortedAndFilteredUrls.map((url) => (
                                    <div
                                        key={url.shortCode}
                                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:bg-white/20 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="space-y-3">
                                            {/* Short URL with Copy Button */}
                                            <p className="text-white text-lg">
                                                <span className="font-semibold text-gray-300">Short URL:</span>{' '}
                                                <a
                                                    href={`${protocol}${host}/${url.shortCode}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-teal-400 hover:underline"
                                                >
                                                    {`${protocol}${host}/${url.shortCode}`}
                                                </a>
                                                <button
                                                    onClick={() => copyToClipboard(`${protocol}${host}/${url.shortCode}`)}
                                                    className="ml-2 text-teal-400 cursor-pointer hover:text-teal-300"
                                                    title="Copy to clipboard"
                                                >
                                                    📋
                                                </button>
                                            </p>

                                            {/* Original URL */}
                                            <p className="text-white text-lg">
                                                <span className="font-semibold text-gray-300">Original URL:</span>{' '}
                                                <a
                                                    href={url.originalUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-teal-400 hover:underline break-all"
                                                >
                                                    {url.originalUrl}
                                                </a>
                                            </p>

                                            {/* Clicks */}
                                            <p className="text-white text-lg">
                                                <span className="font-semibold text-gray-300">Clicks:</span>{' '}
                                                <span className="text-teal-400 font-bold text-xl">{url.clicks || 0}</span>
                                            </p>

                                            {/* Expiration Date */}
                                            <p className="text-white text-lg">
                                                <span className="font-semibold text-gray-300">Expires On:</span>{' '}
                                                <span className="text-gray-400">
                                                    {url.expirationDate
                                                        ? new Date(url.expirationDate).toLocaleDateString()
                                                        : 'Never'}
                                                </span>
                                            </p>

                                            {/* Password Protected */}
                                            <p className="text-white text-lg">
                                                <span className="font-semibold text-gray-300">Password Protected:</span>{' '}
                                                <span
                                                    className={
                                                        url.password ? 'text-yellow-400 font-medium' : 'text-gray-400'
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
            </main>
        </div>
    );
}