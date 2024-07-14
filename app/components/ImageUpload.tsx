// src/components/ImageUpload.tsx
import React, { useState, useEffect } from "react";

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void;
  existingImages?: File[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesChange,
  existingImages = [],
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    setSelectedImages(existingImages);
  }, [existingImages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = [...selectedImages, ...filesArray];
      setSelectedImages(newImages);
      onImagesChange(newImages);
    }
  };

  const handleImageDelete = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <label
        htmlFor="image-upload"
        className="block text-sm font-medium text-gray-700"
      >
        Add Images
      </label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="mt-2"
        id="image-upload"
      />
      <div className="mt-4 flex flex-wrap">
        {selectedImages.map((image, index) => (
          <div key={index} className="mr-2 mb-2 relative">
            <img
              src={URL.createObjectURL(image)}
              alt={`selected ${index}`}
              className="h-24 w-24 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => handleImageDelete(index)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
