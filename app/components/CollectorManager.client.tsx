import React, { useState, useEffect } from "react";
import { Collector, NewCollector } from "~/types";
import { getAllCollectors, createCollectorFromName } from "~/utils/collectorHelpers";
import { db } from "~/firebase.client";
import { collection, doc, setDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";

const CollectorManager: React.FC = () => {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [fungiCounts, setFungiCounts] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCollector, setNewCollector] = useState<NewCollector>({
    name: "",
    email: "",
    phone: "",
    institution: "",
    notes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    fetchCollectors();
  }, []);

  const fetchCollectors = async () => {
    try {
      const collectorList = await getAllCollectors();
      setCollectors(collectorList);
      
      // Fetch fungi counts for each collector
      const counts = new Map<string, number>();
      for (const collector of collectorList) {
        const fungiCollection = collection(db, "fungi");
        const q = query(fungiCollection, where("collectorIds", "array-contains", collector.id));
        const querySnapshot = await getDocs(q);
        counts.set(collector.id, querySnapshot.size);
      }
      setFungiCounts(counts);
    } catch (error) {
      console.error("Error fetching collectors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollector = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCollector.name.trim()) {
      alert("El nombre es requerido");
      return;
    }

    try {
      await createCollectorFromName(newCollector.name);
      
      // If additional fields are provided, update the collector
      if (newCollector.email || newCollector.phone || newCollector.institution || newCollector.notes) {
        const collectorsCollection = collection(db, "collectors");
        const collectorId = `${newCollector.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}-${Date.now().toString(36)}`;
        
        const cleanCollectorData = Object.fromEntries(
          Object.entries({
            ...newCollector,
            id: collectorId,
            updatedAt: new Date(),
          }).filter(([key, value]) => value !== undefined && value !== "")
        );

        const collectorDoc = doc(collectorsCollection, collectorId);
        await setDoc(collectorDoc, cleanCollectorData, { merge: true });
      }
      
      await fetchCollectors();
      setShowAddForm(false);
      setNewCollector({
        name: "",
        email: "",
        phone: "",
        institution: "",
        notes: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error adding collector:", error);
      alert("Error al agregar colector");
    }
  };

  const handleDeleteCollector = async (collectorId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este colector?")) {
      return;
    }

    try {
      const collectorsCollection = collection(db, "collectors");
      const collectorDoc = doc(collectorsCollection, collectorId);
      await deleteDoc(collectorDoc);
      await fetchCollectors();
    } catch (error) {
      console.error("Error deleting collector:", error);
      alert("Error al eliminar colector");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Colectores</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showAddForm ? "Cancelar" : "Agregar Colector"}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Nuevo Colector</h3>
          <form onSubmit={handleAddCollector} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={newCollector.name}
                  onChange={(e) => setNewCollector({...newCollector, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newCollector.email}
                  onChange={(e) => setNewCollector({...newCollector, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={newCollector.phone}
                  onChange={(e) => setNewCollector({...newCollector, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institución
                </label>
                <input
                  type="text"
                  value={newCollector.institution}
                  onChange={(e) => setNewCollector({...newCollector, institution: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={newCollector.notes}
                onChange={(e) => setNewCollector({...newCollector, notes: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Agregar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Collectors List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Institución
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hongos Colectados
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {collectors.map((collector) => (
              <tr key={collector.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {collector.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {collector.email || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {collector.institution || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {fungiCounts.get(collector.id) || 0}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {collector.createdAt?.toLocaleDateString() || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteCollector(collector.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {collectors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay colectores registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectorManager;