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
  collector?: Collector;
}

const FungiDetail: React.FC<FungiDetailProps> = ({ fungi, collector }) => {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
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
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
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
              <span className="font-medium text-gray-700">Código Andrés:</span>
              <span className="ml-2 text-gray-900">{formatValue(fungi.codigoAndres)}</span>
            </div>
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
              <span className="font-medium text-gray-700">Colector:</span>
              <span className="ml-2 text-gray-900">{collector ? collector.name : "Desconocido"}</span>
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
    </div>
  );
};

export default FungiDetail;