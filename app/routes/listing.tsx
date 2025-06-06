import React from "react";
import ProtectedRoute from "~/components/ProtectedRoute.client";
import AdminLayout from "~/components/AdminLayout.client";
import FungiForm from "~/components/FungiForm.client";

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
          
          <FungiForm />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default Index;
