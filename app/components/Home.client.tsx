// src/components/Home.tsx
import React from "react";
import { Link } from "@remix-run/react";

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold m-6">Bienvenido al Fungarium Perú</h1>
        <p className="text-gray-600 mb-6">
          Explora la diversidad de hongos encontrados en Perú
        </p>

        <div className="space-y-4">
          <Link
            to="/fungarium"
            className="block w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            Ver Fungarium
          </Link>
          
          <Link
            to="/dashboard"
            className="block w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Panel de Control
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
