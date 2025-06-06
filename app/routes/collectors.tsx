import ProtectedRoute from "~/components/ProtectedRoute.client";
import AdminLayout from "~/components/AdminLayout.client";
import CollectorManager from "~/components/CollectorManager.client";

export default function CollectorsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestionar Colectores</h2>
            <p className="text-gray-600">
              Administra la información de los colectores de hongos
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <CollectorManager />
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}