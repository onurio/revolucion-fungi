import React, { useEffect, useState } from "react";
import { Fungi } from "~/types";
import { useNavigate } from "@remix-run/react";
import { db } from "~/firebase.client";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const Listings: React.FC = () => {
  const [fungi, setFungi] = useState<Fungi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
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
        fungiData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          fecha: doc.data().fecha?.toDate() || undefined,
        } as Fungi);
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

  const handleView = (id: string) => {
    navigate(`/fungi/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/listing/${id}/edit`);
  };

  const filteredFungi = fungi.filter(f => 
    f.codigoFungario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.genero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.especie && f.especie.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (f.lugar && f.lugar.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Reset to page 1 when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredFungi.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFungi = filteredFungi.slice(startIndex, endIndex);

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

      {/* Results Count */}
      {fungi.length > 0 && (
        <div className="text-sm text-gray-600">
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredFungi.length)} de {filteredFungi.length} registros
          {filteredFungi.length !== fungi.length && ` (${fungi.length} total)`}
        </div>
      )}

      {/* Fungi List */}
      <div className="space-y-4">
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
          currentFungi.map((fungus) => (
            <div
              key={fungus.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {fungus.codigoFungario}
                    </h3>
                    {fungus.adnExtraido && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ADN
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 italic mb-2">
                    <span className="font-medium">{fungus.genero}</span>
                    {fungus.especie && <span> {fungus.especie}</span>}
                  </p>
                  
                  <div className="text-sm text-gray-500 space-y-1">
                    {fungus.lugar && (
                      <p>📍 {fungus.lugar}</p>
                    )}
                    {fungus.fecha && (
                      <p>📅 {fungus.fecha.toLocaleDateString()}</p>
                    )}
                    {fungus.images.length > 0 && (
                      <p>🖼️ {fungus.images.length} imagen{fungus.images.length !== 1 ? 'es' : ''}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleView(fungus.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => handleEdit(fungus.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
    </div>
  );
};

export default Listings;
