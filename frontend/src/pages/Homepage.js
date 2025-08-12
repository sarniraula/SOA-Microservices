import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col items-center justify-center px-6">
      {/* Header */}
      <h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center">
        Welcome to <span className="text-blue-500">Servie Oriented Architecture - Final Project</span>
      </h1>        

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg shadow-md hover:bg-green-600 transition-colors"
        >
          Register
        </Link>
      </div>

      {/* Footer Tagline */}
      <p className="mt-12 text-gray-500 italic">
        "Turn your ideas into reality — one line of code at a time."
      </p>
    </div>
  );
}
