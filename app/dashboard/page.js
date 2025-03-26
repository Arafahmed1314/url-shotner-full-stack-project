import { connectToDatabase } from '../../lib/mongodb';

export default async function DashboardPage() {
    let urls = [];
    let error = null;

    try {
        const { db } = await connectToDatabase();
        urls = await db.collection('urls').find({}).toArray();
    } catch (err) {
        console.error('Error fetching URLs:', err);
        error = 'Failed to load analytics';
    }

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
                            <a
                                href="/"
                                className="text-gray-300 hover:text-teal-400 transition-colors duration-300 font-medium"
                            >
                                Home
                            </a>
                            <a
                                href="/dashboard"
                                className="text-gray-300 hover:text-teal-400 transition-colors duration-300 font-medium"
                            >
                                Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12 tracking-tight">
                        Analytics Dashboard
                    </h1>

                    {error ? (
                        <div className="p-6 bg-red-500/20 rounded-2xl border border-red-500/30 text-red-200 text-center text-lg">
                            {error}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {urls.length === 0 ? (
                                <p className="text-gray-300 text-center text-lg">No URLs found.</p>
                            ) : (
                                urls.map((url) => (
                                    <div
                                        key={url.shortCode}
                                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:bg-white/20 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="space-y-3">
                                            {/* Short URL */}
                                            <p className="text-white text-lg">
                                                <span className="font-semibold text-gray-300">Short URL:</span>{' '}
                                                <a
                                                    href={`http://${process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000'}/${url.shortCode
                                                        }`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-teal-400 hover:underline"
                                                >
                                                    {`http://${process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000'}/${url.shortCode
                                                        }`}
                                                </a>
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