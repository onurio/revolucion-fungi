import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "@remix-run/react";
import { db } from "~/firebase.client";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { Fungi } from "~/types";
import { useUser } from "~/contexts/UserContext.client";
import EnumFilters from "~/components/EnumFilters";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton/Loading Animation */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      
      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-xs">Error</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function FungariumPage() {
  const [fungi, setFungi] = useState<Fungi[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(12); // Grid layout works better with 12 (3x4 or 4x3)
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUser();
  
  // Get values from URL search params
  const searchTerm = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState({
    himenio: searchParams.get("himenio") || '',
    habito: searchParams.get("habito") || '',
    nativaExotica: searchParams.get("nativaExotica") || '',
    sustratoTipo: searchParams.get("sustratoTipo") || '',
    adnExtraido: searchParams.get("adnExtraido") || '',
    muestraConservada: searchParams.get("muestraConservada") || '',
    anillo: searchParams.get("anillo") || '',
    volva: searchParams.get("volva") || ''
  });
  
  // List of authorized admin emails
  const AUTHORIZED_ADMINS = [
    "omrinuri@gmail.com",
    "micelio@revolucionfungi.com",
  ];
  
  const isAdmin = user && AUTHORIZED_ADMINS.includes(user.email || "");

  useEffect(() => {
    const fetchFungi = async () => {
      try {
        const fungiCollection = collection(db, "fungi");
        const fungiQuery = query(fungiCollection, orderBy("codigoFungario"));
        const snapshot = await getDocs(fungiQuery);
        
        const fungiData: Fungi[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fecha: doc.data().fecha?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Fungi[];
        
        setFungi(fungiData);
      } catch (error) {
        console.error("Error fetching fungi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFungi();
  }, []);

  const filteredFungi = fungi.filter(f => {
    // Text search filter
    const matchesSearch = f.codigoFungario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.genero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.especie && f.especie.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.lugar && f.lugar.toLowerCase().includes(searchTerm.toLowerCase()));

    // Enum filters
    const matchesHimenio = !filters.himenio || f.himenio === filters.himenio;
    const matchesHabito = !filters.habito || f.habito === filters.habito;
    const matchesNativaExotica = !filters.nativaExotica || f.nativaExotica === filters.nativaExotica;
    const matchesSustratoTipo = !filters.sustratoTipo || f.sustratoTipo === filters.sustratoTipo;

    // Boolean filters
    const matchesAdnExtraido = !filters.adnExtraido || f.adnExtraido === (filters.adnExtraido === 'true');
    const matchesMuestraConservada = !filters.muestraConservada || f.muestraConservada === (filters.muestraConservada === 'true');
    const matchesAnillo = !filters.anillo || f.anillo === (filters.anillo === 'true');
    const matchesVolva = !filters.volva || f.volva === (filters.volva === 'true');

    return matchesSearch && matchesHimenio && matchesHabito && matchesNativaExotica && matchesSustratoTipo && 
           matchesAdnExtraido && matchesMuestraConservada && matchesAnillo && matchesVolva;
  });

  // Reset to page 1 when search term or filters change
  React.useEffect(() => {
    if ((searchTerm || Object.values(filters).some(f => f)) && currentPage !== 1) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", "1");
        return newParams;
      });
    }
  }, [searchTerm, filters, currentPage, setSearchParams]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredFungi.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFungi = filteredFungi.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page.toString());
      return newParams;
    });
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set("search", value);
        newParams.set("page", "1"); // Reset to page 1 on new search
      } else {
        newParams.delete("search");
        newParams.set("page", "1");
      }
      return newParams;
    });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(filterType, value);
      } else {
        newParams.delete(filterType);
      }
      newParams.set("page", "1"); // Reset to page 1 on filter change
      return newParams;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando fungarium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Fungarium Revolución Fungi
            </h1>
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ir Al Admin
              </Link>
            )}
          </div>
          <p className="text-gray-600 mb-6">
            Catálogo de hongos encontrados en Perú
          </p>
          
          {/* Search */}
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Buscar por código, género, especie o lugar..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <EnumFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            showAdvanced={false}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredFungi.length)} de {filteredFungi.length} registros
            {filteredFungi.length !== fungi.length && ` (${fungi.length} total)`}
          </p>
        </div>

        {/* Fungi Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentFungi.map((fungus) => (
            <Link
              key={fungus.id}
              to={`/fungi/${fungus.codigoFungario}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {fungus.images.length > 0 ? (
                    <LazyImage
                      src={fungus.thumbnailUrl || fungus.images[0]}
                      alt={fungus.codigoFungario}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {fungus.codigoFungario}
                </h3>
                
                <p className="text-gray-600 italic mb-2">
                  {fungus.genero}
                  {fungus.especie && <span> {fungus.especie}</span>}
                </p>
                
                {fungus.lugar && (
                  <p className="text-sm text-gray-500 mb-2">
                    📍 {fungus.lugar}
                  </p>
                )}
                
                {fungus.fecha && (
                  <p className="text-sm text-gray-500">
                    📅 {fungus.fecha.toLocaleDateString()}
                  </p>
                )}
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {fungus.muestraConservada && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Conservada
                    </span>
                  )}
                  {fungus.adnExtraido && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      ADN
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredFungi.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron hongos que coincidan con tu búsqueda.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
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
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}