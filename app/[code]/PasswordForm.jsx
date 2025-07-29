"use client";

import { useState } from "react";

export default function PasswordForm({ code, originalUrl, initialError }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError || "");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!originalUrl) {
      setError("URL not found");
      return;
    }

    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password }),
      });

      if (res.ok) {
        const { originalUrl: redirectUrl } = await res.json();
        window.location.href = redirectUrl; // Direct redirect
      } else {
        const data = await res.json();
        setError(data.message || "Incorrect password");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="w-full px-6 py-4 rounded-xl bg-gray-700/30 border border-gray-600/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
          >
            {showPassword ? "👁️‍🗨️" : "👁️"}
          </button>
        </div>
        <button
          type="submit"
          className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl font-medium text-white hover:from-blue-500 hover:to-indigo-600 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Submit
        </button>
      </form>
      {error && <p className="mt-4 text-red-300 text-center">{error}</p>}
    </>
  );
}
