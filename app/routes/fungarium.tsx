import { Link, useSearchParams } from "@remix-run/react";
import { useState, useEffect } from "react";
import { db } from "~/firebase.client";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { Fungi } from "~/types";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

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

  const filteredFungi = fungi.filter(f => 
    f.codigoFungario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.genero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.especie && f.especie.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (f.lugar && f.lugar.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Fungarium Revolución Fungi & Arbio
          </h1>
          <p className="text-gray-600 mb-6">
            Catálogo de hongos encontrados en Perú
          </p>
          
          {/* Search */}
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Buscar por código, género, especie o lugar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredFungi.length} de {fungi.length} registros
          </p>
        </div>

        {/* Fungi Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFungi.map((fungus) => (
            <Link
              key={fungus.id}
              to={`/fungi/${fungus.codigoFungario}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {fungus.images.length > 0 ? (
                    <LazyImage
                      src={fungus.images[0]}
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
      </div>
    </div>
  );
}