"use client";

import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function LoginButton() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { isDarkMode } = useTheme();

  if (isLoading) {
    return (
      <div
        className={`px-4 py-2 rounded-lg ${
          isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
        }`}
      >
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-3">
        {user?.image && (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span
          className={`text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-300"
          }`}
        >
          {user?.name}
        </span>
        <button
          onClick={logout}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isDarkMode
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => login("google")}
      className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
        isDarkMode
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
      }`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span>Sign in with Google</span>
    </button>
  );
}
