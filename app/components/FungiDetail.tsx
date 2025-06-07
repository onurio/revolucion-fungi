import React, { useState } from "react";
import { Fungi, Collector } from "~/types";

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

interface FungiDetailProps {
  fungi: Fungi;
  collectors?: Collector[];
}

const FungiDetail: React.FC<FungiDetailProps> = ({ fungi, collectors = [] }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [modalImageLoading, setModalImageLoading] = useState<boolean>(false);

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "number" && isNaN(value)) return "-";
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (value instanceof Date) return value.toLocaleDateString();
    if (value === "" || value === "-") return "-";
    return String(value);
  };

  const openImageModal = (imageUrl: string, index: number) => {
    setModalImageLoading(true);
    setSelectedImage(imageUrl);
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalImageLoading(false);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!fungi.images.length) return;
    
    let newIndex = selectedImageIndex;
    if (direction === 'prev') {
      newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : fungi.images.length - 1;
    } else {
      newIndex = selectedImageIndex < fungi.images.length - 1 ? selectedImageIndex + 1 : 0;
    }
    
    setModalImageLoading(true);
    setSelectedImageIndex(newIndex);
    setSelectedImage(fungi.images[newIndex]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {fungi.codigoFungario}
        </h1>
        <p className="text-xl text-gray-600 mt-2">
          <em>{fungi.genero}</em>
          {fungi.especie && (
            <span> <em>{fungi.especie}</em></span>
          )}
        </p>
      </div>

      {/* Images */}
      {fungi.images.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Imágenes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fungi.images.map((imageUrl, index) => (
              <div 
                key={index} 
                className="aspect-square overflow-hidden rounded-lg cursor-pointer"
                onClick={() => openImageModal(imageUrl, index)}
              >
                <LazyImage
                  src={imageUrl}
                  alt={`${fungi.codigoFungario} - Imagen ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Taxonomic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Información Taxonómica
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Género:</span>
              <span className="ml-2 text-gray-900 italic">{formatValue(fungi.genero)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Especie:</span>
              <span className="ml-2 text-gray-900 italic">{formatValue(fungi.especie)}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Estado de Muestra
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Muestra conservada:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.muestraConservada)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">ADN extraído:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.adnExtraido)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Número extracto ADN:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.numeroExtractoAdn)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">PCR:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.pcr)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ecological Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Información Ecológica
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Sustrato:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.sustrato)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Árbol asociado:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.arbolAsociado)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Nativa/Exótica:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.nativaExotica)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Hábito:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.habito)}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Características Morfológicas
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Número de carpóforos:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.numeroCarpoforos)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Olor:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.olor)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Himenio:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.himenio)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Anillo:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.anillo)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Volva:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.volva)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Physical Measurements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Medidas Físicas
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Largo del cuerpo (cm):</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.largoCuerpo)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Diámetro del sombrero (cm):</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.diametroSombrero)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Textura:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.textura)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Color:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.color)}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Información de Recolección
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Fecha:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.fecha)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Lugar:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.lugar)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Distrito:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.distrito)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Provincia:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.provincia)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Región:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.region)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Colector{collectors.length > 1 ? 'es' : ''}:</span>
              <span className="ml-2 text-gray-900">
                {collectors.length > 0 
                  ? collectors.map(collector => collector.name).join(', ')
                  : "Desconocido"
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Coordinates */}
      {(fungi.coordenadaX || fungi.coordenadaY || fungi.utmX || fungi.utmY) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Coordenadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">Coordenadas X, Y:</span>
              <span className="ml-2 text-gray-900">
                {formatValue(fungi.coordenadaX)}, {formatValue(fungi.coordenadaY)}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">UTM X, Y:</span>
              <span className="ml-2 text-gray-900">
                {formatValue(fungi.utmX)}, {formatValue(fungi.utmY)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Spore Information */}
      {(fungi.sporeprint || fungi.esporadaColor) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Información de Esporas
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Sporeprint:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.sporeprint)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Color de esporada:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.esporadaColor)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {fungi.notas && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notas</h2>
          <p className="text-gray-700 leading-relaxed">{fungi.notas}</p>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-full min-w-96 min-h-96 p-4 bg-gray-900 rounded-lg">
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation buttons */}
            {fungi.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </button>
              </>
            )}

            {/* Loading overlay */}
            {modalImageLoading && (
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-lg p-4">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* Image */}
            <img
              src={selectedImage}
              alt={`${fungi.codigoFungario} - Imagen ${selectedImageIndex + 1}`}
              className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${modalImageLoading ? 'opacity-0' : 'opacity-100'}`}
              onClick={(e) => e.stopPropagation()}
              onLoad={() => setModalImageLoading(false)}
              onError={() => setModalImageLoading(false)}
            />

            {/* Image counter */}
            {fungi.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                {selectedImageIndex + 1} / {fungi.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FungiDetail;