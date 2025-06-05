import CSVImport from "~/components/CSVImport.client";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <p className="mt-2 text-gray-600">
            Gestiona los datos del fungarium
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Importar Datos desde CSV
              </h2>
              <CSVImport />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}