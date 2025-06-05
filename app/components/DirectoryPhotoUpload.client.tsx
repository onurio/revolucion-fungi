import React, { useState } from "react";
import { processAndUploadImages } from "~/utils/imageProcessor";

interface DirectoryPhotoUploadProps {
  onPhotosProcessed: (results: { [codigoFungario: string]: string[] }) => void;
  fungiCodes: string[];
}

const DirectoryPhotoUpload: React.FC<DirectoryPhotoUploadProps> = ({ 
  onPhotosProcessed, 
  fungiCodes 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [uploadResults, setUploadResults] = useState<{ [codigoFungario: string]: string[] }>({});
  const [errors, setErrors] = useState<string[]>([]);

  const handleDirectorySelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setProcessingStatus("Organizando archivos por código de hongo...");
    setErrors([]);

    try {
      // Group files by fungi code based on file path
      const filesByFungi: { [codigoFungario: string]: File[] } = {};
      
      Array.from(files).forEach(file => {
        // Extract fungi code from file path
        // Expected structure: 2024/2024/FRFA-001/Bajas_/image.jpg or 2024/2025/FRFA-060/Bajas_/image.jpg
        const pathParts = file.webkitRelativePath.split('/');
        
        let fungiCode = '';
        
        // Look for FRFA-XXX pattern in the path
        for (const part of pathParts) {
          if (part.match(/^FRFA-\d+/)) {
            fungiCode = part;
            break;
          }
        }
        
        // Also check if it's an image file (has Bajas_ in path and is an image)
        const isInBajasFolder = pathParts.includes('Bajas_');
        const isImageFile = /\.(jpg|jpeg|png|gif)$/i.test(file.name);
        
        if (fungiCode && fungiCodes.includes(fungiCode) && isInBajasFolder && isImageFile) {
          if (!filesByFungi[fungiCode]) {
            filesByFungi[fungiCode] = [];
          }
          filesByFungi[fungiCode].push(file);
          console.log(`Found image for ${fungiCode}: ${file.webkitRelativePath}`);
        }
      });

      const results: { [codigoFungario: string]: string[] } = {};
      const totalFungi = Object.keys(filesByFungi).length;
      let processedFungi = 0;

      // Upload photos for each fungi
      for (const [fungiCode, fungiFiles] of Object.entries(filesByFungi)) {
        setProcessingStatus(`Subiendo fotos para ${fungiCode} (${processedFungi + 1}/${totalFungi})...`);
        
        try {
          const imageUrls = await processAndUploadImages(fungiCode, fungiFiles);
          results[fungiCode] = imageUrls;
          console.log(`Processed ${imageUrls.length} photos for ${fungiCode}`);
        } catch (error) {
          console.error(`Error uploading photos for ${fungiCode}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          setErrors(prev => [...prev, `Error subiendo fotos para ${fungiCode}: ${errorMessage}`]);
          results[fungiCode] = [];
        }
        
        processedFungi++;
      }

      setUploadResults(results);
      onPhotosProcessed(results);
      
      const totalUploaded = Object.values(results).reduce((sum, urls) => sum + urls.length, 0);
      setProcessingStatus(`Completado: ${totalUploaded} fotos subidas para ${Object.keys(results).length} hongos`);

    } catch (error) {
      console.error("Error processing directory:", error);
      setProcessingStatus("Error procesando directorio de fotos");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Subir Fotos desde Directorio
      </h2>
      
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Instrucciones:</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>Selecciona la carpeta principal que contiene las fotos (ej: la carpeta "2024" exterior)</li>
            <li>La estructura esperada es: <code>2024/2024/FRFA-XXX/Bajas_/*.jpg</code> o <code>2024/2025/FRFA-XXX/Bajas_/*.jpg</code></li>
            <li>Las fotos se organizarán automáticamente por código de hongo</li>
            <li>Solo se procesarán fotos dentro de carpetas "Bajas_" y de hongos incluidos en el CSV</li>
            <li>Archivos soportados: JPG, JPEG, PNG, GIF</li>
          </ul>
        </div>

        {/* Directory Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Directorio de Fotos
          </label>
          <input
            type="file"
            webkitdirectory=""
            multiple
            onChange={handleDirectorySelect}
            disabled={isProcessing}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-gray-500">
            Códigos de hongos a procesar: {fungiCodes.join(', ')}
          </p>
        </div>

        {/* Processing Status */}
        {processingStatus && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-gray-800">
              {isProcessing && (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></span>
              )}
              {processingStatus}
            </p>
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-red-800 font-medium mb-2">Errores:</h3>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Results */}
        {Object.keys(uploadResults).length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Resultados de Subida
            </h3>
            <div className="space-y-2">
              {Object.entries(uploadResults).map(([fungiCode, imageUrls]) => (
                <div key={fungiCode} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="font-medium">{fungiCode}</span>
                  <span className="text-sm text-gray-600">
                    {imageUrls.length} fotos subidas
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryPhotoUpload;