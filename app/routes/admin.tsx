import ProtectedRoute from "~/components/ProtectedRoute.client";
import AdminLayout from "~/components/AdminLayout.client";
import CSVImport from "~/components/CSVImport.client";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Importar CSV</h2>
            <p className="text-gray-600">
              Importa datos de hongos desde archivos CSV y gestiona fotos
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <CSVImport />
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}