// src/components/Home.tsx
import React from "react";
import { Link } from "@remix-run/react";

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold m-6">Bienvenido al Fungarium Perú</h1>

        <Link
          to="/dashboard"
          className="mt-8 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Ir al Panel de Control
        </Link>
      </div>
    </div>
  );
};

export default Home;
