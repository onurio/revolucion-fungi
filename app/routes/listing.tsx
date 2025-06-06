import React from "react";
import ProtectedRoute from "~/components/ProtectedRoute.client";
import AdminLayout from "~/components/AdminLayout.client";
import RegistryForm from "~/components/RegistryForm";

const Index: React.FC = () => {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nuevo Registro</h2>
            <p className="text-gray-600">
              Añade un nuevo registro de hongo al fungarium
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <RegistryForm />
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default Index;
