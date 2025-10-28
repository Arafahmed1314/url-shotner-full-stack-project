'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';

function AuthErrorContent() {
    const { isDarkMode } = useTheme();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const getErrorMessage = (error) => {
        switch (error) {
            case 'Configuration':
                return 'There is a problem with the server configuration.';
            case 'AccessDenied':
                return 'Access denied. You do not have permission to sign in.';
            case 'Verification':
                return 'The verification token has expired or has already been used.';
            default:
                return 'An error occurred during authentication.';
        }
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${isDarkMode
            ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900'
            : 'bg-gradient-to-br from-slate-50 via-red-50 to-rose-50'
            }`}>
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className={`max-w-md w-full space-y-8 p-8 rounded-2xl backdrop-blur-md border shadow-xl ${isDarkMode
                    ? 'bg-red-900/30 border-red-600/30'
                    : 'bg-white/90 border-red-300'
                    }`}>
                    <div className="text-center">
                        <div className="text-red-400 text-6xl mb-4">⚠️</div>
                        <h2 className={`text-3xl font-extrabold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            Authentication Error
                        </h2>
                        <p className={`text-lg ${isDarkMode ? 'text-red-300' : 'text-red-700'
                            }`}>
                            {getErrorMessage(error)}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/auth/signin"
                            className={`w-full flex justify-center py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-md ${isDarkMode
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            Try Again
                        </Link>

                        <Link
                            href="/"
                            className={`block text-center text-sm hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                }`}
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AuthError() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
                <div className="text-white text-xl">Loading...</div>
            </div>
        }>
            <AuthErrorContent />
        </Suspense>
    );
}
