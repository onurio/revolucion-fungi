import React from "react";
import { Link } from "@remix-run/react";
import ProtectedRoute from "~/components/ProtectedRoute.client";
import Listings from "~/components/Listings";

export default function FungiTablePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  📊 Base de Datos de Hongos
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Vista completa de todos los registros con capacidades de edición
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  ← Volver al Dashboard
                </Link>
                <Link
                  to="/admin/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  + Nuevo Hongo
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <Listings mode="full" showAllColumns={true} />
        </div>
      </div>
    </ProtectedRoute>
  );
}