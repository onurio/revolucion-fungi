import React, { useState, useEffect } from "react";
import { processAndUploadImages } from "~/utils/imageProcessor";

interface ImageManagementProps {
  codigoFungario: string;
  existingImages: string[];
  selectedThumbnail?: string;
  imageOrder?: number[];
  onImagesChange: (images: string[]) => void;
  onThumbnailChange: (thumbnailUrl: string) => void;
  onImageOrderChange: (order: number[]) => void;
}

const ImageManagement: React.FC<ImageManagementProps> = ({
  codigoFungario,
  existingImages,
  selectedThumbnail,
  imageOrder,
  onImagesChange,
  onThumbnailChange,
  onImageOrderChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Get ordered images based on imageOrder or use default order
  const getOrderedImages = () => {
    if (imageOrder && imageOrder.length === existingImages.length) {
      return imageOrder.map(index => existingImages[index]);
    }
    return existingImages;
  };

  const orderedImages = getOrderedImages();

  // Get effective thumbnail (selected or fallback to first image)
  const getEffectiveThumbnail = () => {
    if (selectedThumbnail && existingImages.includes(selectedThumbnail)) {
      return selectedThumbnail;
    }
    return existingImages.length > 0 ? existingImages[0] : null;
  };

  const effectiveThumbnail = getEffectiveThumbnail();

  // Handle new image uploads
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(`Subiendo ${files.length} imágenes...`);
    
    try {
      const uploadedUrls = await processAndUploadImages(codigoFungario, files);
      const allImages = [...existingImages, ...uploadedUrls];
      onImagesChange(allImages);
      
      // Reset image order since we have new images
      onImageOrderChange([]);
      
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

  // Handle thumbnail selection
  const handleThumbnailSelect = (imageUrl: string) => {
    onThumbnailChange(imageUrl);
  };

  // Handle image reordering
  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Create new order array
    const currentOrder = imageOrder && imageOrder.length === existingImages.length 
      ? [...imageOrder] 
      : existingImages.map((_, i) => i);

    // Move the dragged item
    const draggedItem = currentOrder[draggedIndex];
    currentOrder.splice(draggedIndex, 1);
    currentOrder.splice(dropIndex, 0, draggedItem);

    onImageOrderChange(currentOrder);
    setDraggedIndex(null);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
  };

  // Handle image deletion
  const handleImageDelete = (imageUrl: string) => {
    const newImages = existingImages.filter(img => img !== imageUrl);
    onImagesChange(newImages);
    
    // If deleted image was the thumbnail, clear thumbnail
    if (selectedThumbnail === imageUrl) {
      onThumbnailChange("");
    }
    
    // Reset image order
    onImageOrderChange([]);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
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
            <p className="text-lg">Arrastra y suelta nuevas fotos aquí</p>
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

      {/* Existing Images Management */}
      {existingImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-700">
              Imágenes ({existingImages.length})
            </h4>
            <p className="text-sm text-gray-500">
              Arrastra para reordenar • Haz clic en la estrella para seleccionar miniatura
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {orderedImages.map((imageUrl, displayIndex) => {
              const originalIndex = existingImages.indexOf(imageUrl);
              const isThumbnail = effectiveThumbnail === imageUrl;
              const isSelectedThumbnail = selectedThumbnail === imageUrl;
              
              return (
                <div
                  key={imageUrl}
                  draggable
                  onDragStart={(e) => handleImageDragStart(e, displayIndex)}
                  onDragOver={(e) => handleImageDragOver(e, displayIndex)}
                  onDrop={(e) => handleImageDrop(e, displayIndex)}
                  onDragEnd={handleImageDragEnd}
                  className={`
                    relative group aspect-square cursor-move transition-all duration-200
                    ${draggedIndex === displayIndex ? 'opacity-50 scale-95' : ''}
                    ${isThumbnail ? 'ring-2 ring-yellow-400' : ''}
                  `}
                >
                  <img
                    src={imageUrl}
                    alt={`${codigoFungario} - ${displayIndex + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  
                  {/* Overlay controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
                      {/* Thumbnail selector */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleThumbnailSelect(imageUrl);
                        }}
                        className={`
                          p-2 rounded-full transition-all duration-200
                          ${isSelectedThumbnail 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-white bg-opacity-90 text-gray-700 hover:bg-yellow-500 hover:text-white'
                          }
                        `}
                        title={isSelectedThumbnail ? "Miniatura seleccionada" : isThumbnail ? "Miniatura actual (primera imagen)" : "Seleccionar como miniatura"}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                      
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleImageDelete(imageUrl);
                        }}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                        title="Eliminar imagen"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Thumbnail indicator */}
                  {isThumbnail && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {isSelectedThumbnail ? "Miniatura" : "Principal"}
                    </div>
                  )}
                  
                  {/* Order indicator */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                    {displayIndex + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManagement;