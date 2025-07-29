'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Link from 'next/link';

export default function SignIn() {
    const { isAuthenticated, login, isLoading } = useAuth();
    const { isDarkMode } = useTheme();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode
                    ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900'
                    : 'bg-gradient-to-br from-gray-900 to-blue-900'
                }`}>
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-all duration-500 ${isDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900'
                : 'bg-gradient-to-br from-gray-900 to-blue-900'
            }`}>
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className={`max-w-md w-full space-y-8 p-8 rounded-2xl backdrop-blur-md border ${isDarkMode
                        ? 'bg-gray-800/30 border-gray-600/30'
                        : 'bg-white/10 border-white/20'
                    }`}>
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <span className="text-white text-3xl">🔗</span>
                            <span className="text-white font-bold text-2xl">URLify</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white">
                            Welcome back
                        </h2>
                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-300'
                            }`}>
                            Sign in to your account to access your dashboard
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => login('google')}
                            className={`w-full flex justify-center items-center space-x-3 py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${isDarkMode
                                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                                    : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
                                }`}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC04"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span>Continue with Google</span>
                        </button>

                        <div className="text-center">
                            <Link
                                href="/"
                                className={`text-sm hover:underline ${isDarkMode ? 'text-blue-400' : 'text-teal-400'
                                    }`}
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
