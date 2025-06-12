import React, { useEffect, useState } from "react";
import { Fungi } from "~/types";
import { useNavigate } from "@remix-run/react";
import { db } from "~/firebase.client";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import BulkEditModal from "./BulkEditModal";

const Listings: React.FC = () => {
  const [fungi, setFungi] = useState<Fungi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedFungi, setSelectedFungi] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const navigate = useNavigate();

  const fetchFungi = async () => {
    try {
      setLoading(true);
      const fungiCollection = collection(db, "fungi");
      const q = query(
        fungiCollection,
        orderBy("codigoFungario")
      );
      const querySnapshot = await getDocs(q);
      
      const fungiData: Fungi[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const fungiItem = {
          ...data,
          id: doc.id, // Ensure Firebase document ID overrides any id in the data
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          fecha: data.fecha?.toDate() || undefined,
        } as Fungi;
        fungiData.push(fungiItem);
      });
      setFungi(fungiData);
    } catch (error) {
      console.error("Error fetching fungi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFungi();
  }, []);

  const handleView = (codigoFungario: string) => {
    navigate(`/fungi/${codigoFungario}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const filteredFungi = fungi.filter(f => 
    f.codigoFungario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.genero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.especie && f.especie.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (f.lugar && f.lugar.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Reset to page 1 when search term or items per page changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredFungi.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFungi = filteredFungi.slice(startIndex, endIndex);

  // Selection handlers
  const handleSelectFungus = (id: string) => {
    const newSelected = new Set(selectedFungi);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedFungi(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    const allCurrentPageSelected = currentFungi.every(f => selectedFungi.has(f.id));
    
    if (allCurrentPageSelected) {
      // Deselect all on current page
      const newSelected = new Set(selectedFungi);
      currentFungi.forEach(f => newSelected.delete(f.id));
      setSelectedFungi(newSelected);
      setShowBulkActions(newSelected.size > 0);
    } else {
      // Select all on current page
      const newSelected = new Set(selectedFungi);
      currentFungi.forEach(f => newSelected.add(f.id));
      setSelectedFungi(newSelected);
      setShowBulkActions(newSelected.size > 0);
    }
  };

  const handleSelectAllFiltered = () => {
    if (selectedFungi.size === filteredFungi.length) {
      // Deselect all
      setSelectedFungi(new Set());
      setShowBulkActions(false);
    } else {
      // Select all filtered
      const allFilteredIds = new Set(filteredFungi.map(f => f.id));
      setSelectedFungi(allFilteredIds);
      setShowBulkActions(true);
    }
  };

  const handleBulkEditSuccess = () => {
    // Refresh data and reset selections
    fetchFungi();
    setSelectedFungi(new Set());
    setShowBulkActions(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por código, género, especie o lugar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => navigate("/listing")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Nuevo Registro
          </button>
        </div>
      </div>

      {/* Results Count and Pagination Controls */}
      {fungi.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredFungi.length)} de {filteredFungi.length} registros
            {filteredFungi.length !== fungi.length && ` (${fungi.length} total)`}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Mostrar:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const newItemsPerPage = parseInt(e.target.value);
                  setItemsPerPage(newItemsPerPage);
                  setCurrentPage(1); // Reset to first page
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={filteredFungi.length}>Todos ({filteredFungi.length})</option>
              </select>
              <span className="text-sm text-gray-600">por página</span>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-blue-900">
                  {selectedFungi.size} registro{selectedFungi.size !== 1 ? 's' : ''} seleccionado{selectedFungi.size !== 1 ? 's' : ''}
                </span>
                {selectedFungi.size > currentFungi.length && (
                  <span className="text-xs text-blue-700">
                    Incluye registros de otras páginas
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <button
                  onClick={handleSelectAllFiltered}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {selectedFungi.size === filteredFungi.length ? 
                    'Deseleccionar todos' : 
                    `Seleccionar todos los filtrados (${filteredFungi.length})`
                  }
                </button>
                {searchTerm && (
                  <span className="text-gray-500">
                    • Incluyendo resultados de búsqueda
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBulkEditModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Editar Seleccionados
              </button>
              <button
                onClick={() => {
                  setSelectedFungi(new Set());
                  setShowBulkActions(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fungi Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {fungi.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay registros de hongos aún.</p>
            <button
              onClick={() => navigate("/listing")}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Crear el primer registro
            </button>
          </div>
        ) : filteredFungi.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No se encontraron hongos que coincidan con tu búsqueda.</p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="relative px-6 py-3 w-12">
                    <div className="flex flex-col items-center">
                      <input
                        type="checkbox"
                        checked={currentFungi.length > 0 && currentFungi.every(f => selectedFungi.has(f.id))}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      {totalPages > 1 && (
                        <span className="text-xs text-gray-500 mt-1">
                          Página
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Género / Especie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lugar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ADN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imágenes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentFungi.map((fungus) => (
                  <tr key={fungus.id} className="hover:bg-gray-50">
                    <td className="relative px-6 py-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedFungi.has(fungus.id)}
                        onChange={() => handleSelectFungus(fungus.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {fungus.codigoFungario}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium italic">{fungus.genero}</span>
                        {fungus.especie && <span className="italic"> {fungus.especie}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {fungus.lugar || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {fungus.fecha ? fungus.fecha.toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fungus.adnExtraido ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Sí
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {fungus.images.length}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(fungus.codigoFungario)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleEdit(fungus.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && itemsPerPage < filteredFungi.length && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              // Show first page, last page, current page, and pages around current
              return page === 1 || 
                     page === totalPages || 
                     Math.abs(page - currentPage) <= 2;
            })
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {/* Add ellipsis if there's a gap */}
                {index > 0 && array[index - 1] < page - 1 && (
                  <span className="px-3 py-2 text-sm font-medium text-gray-500">...</span>
                )}
                <button
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'text-white bg-blue-600 border border-blue-600'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Bulk Edit Modal */}
      <BulkEditModal
        isOpen={showBulkEditModal}
        onClose={() => setShowBulkEditModal(false)}
        selectedFungiIds={selectedFungi}
        onSuccess={handleBulkEditSuccess}
      />
    </div>
  );
};

export default Listings;