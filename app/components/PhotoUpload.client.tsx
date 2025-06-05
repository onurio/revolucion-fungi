import React, { useState, useCallback } from "react";
import { processAndUploadImages } from "~/utils/imageProcessor";

interface PhotoUploadProps {
  codigoFungario: string;
  onImagesUploaded: (imageUrls: string[]) => void;
  existingImages?: string[];
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  codigoFungario, 
  onImagesUploaded, 
  existingImages = [] 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      await uploadFiles(files);
    }
  }, [codigoFungario]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      await uploadFiles(files);
    }
  }, [codigoFungario]);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(`Subiendo ${files.length} imágenes...`);
    
    try {
      const uploadedUrls = await processAndUploadImages(codigoFungario, files);
      const allImages = [...existingImages, ...uploadedUrls];
      onImagesUploaded(allImages);
      setUploadProgress(`${uploadedUrls.length} imágenes subidas exitosamente`);
      
      setTimeout(() => {
        setUploadProgress("");
      }, 3000);
    } catch (error) {
      console.error("Error uploading images:", error);
      setUploadProgress("Error subiendo imágenes");
      
      setTimeout(() => {
        setUploadProgress("");
      }, 3000);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Fotos para {codigoFungario}
      </h3>
      
      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-gray-600">
            <p className="text-lg">Arrastra y suelta las fotos aquí</p>
            <p className="text-sm">o haz clic para seleccionar archivos</p>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, JPEG hasta 10MB cada una
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 text-sm">{uploadProgress}</p>
        </div>
      )}

      {/* Existing Images Preview */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2">
            Imágenes ({existingImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="aspect-square">
                <img
                  src={imageUrl}
                  alt={`${codigoFungario} - ${index + 1}`}
                  className="w-full h-full object-cover rounded-md border border-gray-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;