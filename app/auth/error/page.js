'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';

export default function AuthError() {
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
        <div className={`min-h-screen transition-all duration-500 ${
            isDarkMode 
                ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900' 
                : 'bg-gradient-to-br from-gray-900 to-blue-900'
        }`}>
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className={`max-w-md w-full space-y-8 p-8 rounded-2xl backdrop-blur-md border ${
                    isDarkMode
                        ? 'bg-red-900/30 border-red-600/30'
                        : 'bg-red-500/20 border-red-500/30'
                }`}>
                    <div className="text-center">
                        <div className="text-red-400 text-6xl mb-4">⚠️</div>
                        <h2 className="text-3xl font-extrabold text-white mb-4">
                            Authentication Error
                        </h2>
                        <p className={`text-lg ${
                            isDarkMode ? 'text-red-300' : 'text-red-200'
                        }`}>
                            {getErrorMessage(error)}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/auth/signin"
                            className={`w-full flex justify-center py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                                isDarkMode
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-teal-500 hover:bg-teal-600 text-white'
                            }`}
                        >
                            Try Again
                        </Link>

                        <Link
                            href="/"
                            className={`block text-center text-sm hover:underline ${
                                isDarkMode ? 'text-blue-400' : 'text-teal-400'
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
