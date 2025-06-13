import React, { useState, useEffect, useMemo } from "react";
import { Link } from "@remix-run/react";
import { Fungi, Collector, FungiField, FungiWithDynamicFields } from "~/types";
import { Himenio, Habito, NativaExotica, SustratoTipo } from "~/types/fungi-enums";
import { getDynamicFields } from "~/services/dynamicFields";
import { useUser } from "~/contexts/UserContext.client";
import { checkAdminStatus } from "~/utils/admin.client";

// Helper functions to get emojis for enum values
const getHimenioEmoji = (value: string | null | undefined): string => {
  if (!value) return "";
  switch (value) {
    case Himenio.APOTECIO: return "🥣";
    case Himenio.ARRUGADO: return "🌊";
    case Himenio.CORAL: return "🪸";
    case Himenio.CORALOIDE: return "🪸";
    case Himenio.DIENTES: return "🦷";
    case Himenio.ESTROMA_CON_PERITECIOS: return "⚫";
    case Himenio.ESTROMA_REDONDA: return "⭕";
    case Himenio.GASTEROIDE: return "🎈";
    case Himenio.GELATINOSO: return "🟦";
    case Himenio.LAMINILLAS: return "📄";
    case Himenio.LAMINAS: return "📋";
    case Himenio.MASA_INTERNA_ESPORAS: return "🔵";
    case Himenio.MASA_LIQUIDA_ESPORAS: return "💧";
    case Himenio.NIDO: return "🪺";
    case Himenio.POROS: return "🧽";
    case Himenio.POROS_MICROSCOPICOS: return "🔍";
    default: return "";
  }
};

const getHabitoEmoji = (value: string | null | undefined): string => {
  if (!value) return "";
  switch (value) {
    case Habito.SOLITARIO: return "🍄";
    case Habito.GREGARIO: return "🍄🍄";
    case Habito.CESPITOSO: return "🍄🍄🍄";
    case Habito.SOLITARIO_GREGARIO: return "🍄/🍄🍄";
    case Habito.SOLITARIO_CESPITOSO: return "🍄🍄🍄";
    case Habito.SOLITARIO_DISPERSO: return "🍄💨";
    case Habito.GREGARIO_CESPITOSO: return "🍄🍄🍄";
    case Habito.GREGARIO_DISPERSO: return "🍄🍄💨";
    case Habito.GREGARIO_CESPITOSO_DISPERSO: return "🍄🍄🍄💨";
    default: return "";
  }
};

const getNativaExoticaEmoji = (value: string | null | undefined): string => {
  if (!value) return "";
  switch (value) {
    case NativaExotica.NATIVA: return "🌿";
    case NativaExotica.EXOTICA: return "🌍";
    default: return "";
  }
};

const getSustratoTipoEmoji = (value: string | null | undefined): string => {
  if (!value) return "";
  switch (value) {
    case SustratoTipo.PASTO: return "🌱";
    case SustratoTipo.PINOCHA: return "🌲";
    case SustratoTipo.HOJARASCA: return "🍂";
    case SustratoTipo.MADERA_MUERTA: return "🪵";
    case SustratoTipo.MADERA_VIVA: return "🌳";
    case SustratoTipo.MUSGO: return "🌿";
    case SustratoTipo.ARENA: return "🏖️";
    case SustratoTipo.ESTIERCOL: return "💩";
    case SustratoTipo.EN_ANIMAL_PARASITO: return "🐛";
    case SustratoTipo.OTRO: return "❓";
    default: return "";
  }
};

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
  fungi: FungiWithDynamicFields;
  collectors?: Collector[];
}

const FungiDetail: React.FC<FungiDetailProps> = ({ fungi, collectors = [] }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [modalImageLoading, setModalImageLoading] = useState<boolean>(false);
  const [dynamicFields, setDynamicFields] = useState<FungiField[]>([]);
  const { user } = useUser();
  const isAdmin = checkAdminStatus(user);

  // Get ordered images based on imageOrder or use default order
  const orderedImages = useMemo(() => {
    if (fungi.imageOrder && fungi.imageOrder.length === fungi.images.length) {
      return fungi.imageOrder.map(index => fungi.images[index]);
    }
    return fungi.images;
  }, [fungi.images, fungi.imageOrder]);

  useEffect(() => {
    loadDynamicFields();
  }, []);

  const loadDynamicFields = async () => {
    try {
      const fields = await getDynamicFields();
      setDynamicFields(fields.filter(f => f.visible && fungi[f.key] !== undefined && fungi[f.key] !== null));
    } catch (error) {
      console.error('Error loading dynamic fields:', error);
    }
  };

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
    if (!orderedImages.length) return;
    
    let newIndex = selectedImageIndex;
    if (direction === 'prev') {
      newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : orderedImages.length - 1;
    } else {
      newIndex = selectedImageIndex < orderedImages.length - 1 ? selectedImageIndex + 1 : 0;
    }
    
    setModalImageLoading(true);
    setSelectedImageIndex(newIndex);
    setSelectedImage(orderedImages[newIndex]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
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
          
          {/* Admin Edit Button */}
          {isAdmin && (
            <Link
              to={`/edit/${fungi.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar
            </Link>
          )}
        </div>
      </div>

      {/* Images */}
      {orderedImages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Imágenes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderedImages.map((imageUrl, index) => (
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
            {fungi.sustratoTipo && (
              <div>
                <span className="font-medium text-gray-700">Tipo de Sustrato:</span>
                <span className="ml-2 text-gray-900">
                  {getSustratoTipoEmoji(fungi.sustratoTipo)} {fungi.sustratoTipo.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-700">Descripción del Sustrato:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.sustrato)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Árbol asociado:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.arbolAsociado)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Nativa/Exótica:</span>
              <span className="ml-2 text-gray-900">
                {getNativaExoticaEmoji(fungi.nativaExotica)} {formatValue(fungi.nativaExotica)}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Hábito:</span>
              <span className="ml-2 text-gray-900">
                {getHabitoEmoji(fungi.habito)} {formatValue(fungi.habito)}
              </span>
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
              <span className="ml-2 text-gray-900">
                {getHimenioEmoji(fungi.himenio)} {formatValue(fungi.himenio)}
              </span>
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

      {/* Dynamic Fields */}
      {dynamicFields.length > 0 && (
        <>
          {Object.entries(
            dynamicFields.reduce((acc, field) => {
              const category = field.category || 'Información Adicional';
              if (!acc[category]) acc[category] = [];
              acc[category].push(field);
              return acc;
            }, {} as Record<string, FungiField[]>)
          ).map(([category, fields]) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
              <div className="space-y-3">
                {fields.map((field) => {
                  const value = fungi[field.key];
                  let displayValue = value;
                  
                  if (field.type === 'boolean') {
                    displayValue = value ? 'Sí' : 'No';
                  } else if (field.type === 'date' && value) {
                    displayValue = new Date(value).toLocaleDateString('es-PE');
                  }
                  
                  return (
                    <div key={field.id}>
                      <span className="font-medium text-gray-700">{field.label}:</span>
                      <span className="ml-2 text-gray-900">{formatValue(displayValue)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div className="relative w-[95vw] h-[95vh] bg-gray-900 rounded-lg">
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation buttons */}
            {orderedImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </button>
              </>
            )}

            {/* Loading overlay */}
            {modalImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-lg p-4">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* Image */}
            <img
              src={selectedImage}
              alt={`${fungi.codigoFungario} - Imagen ${selectedImageIndex + 1}`}
              className={`w-full h-full object-contain transition-opacity duration-300 ${modalImageLoading ? 'opacity-0' : 'opacity-100'}`}
              onClick={(e) => e.stopPropagation()}
              onLoad={() => setModalImageLoading(false)}
              onError={() => setModalImageLoading(false)}
            />

            {/* Image counter */}
            {orderedImages.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                {selectedImageIndex + 1} / {orderedImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FungiDetail;