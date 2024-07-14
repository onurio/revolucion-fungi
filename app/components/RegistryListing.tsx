// src/components/Registry.tsx
import React from "react";
import { Registry } from "~/types";

interface RegistryListingProps {
  registry: Registry;
  onEdit: (id: string) => void;
  onSync: (id: string) => void;
  onDelete: (id: string) => void;
}

const RegistryListing: React.FC<RegistryListingProps> = ({
  registry,
  onEdit,
  onSync,
  onDelete,
}) => {
  const { id, images } = registry;

  return (
    <div className="p-4 bg-white max-w-md w-full rounded-md shadow-md mb-4">
      {images && images.length > 0 && (
        <img
          src={URL.createObjectURL(images[0])}
          alt={id}
          className="w-full h-60 object-cover rounded-md mb-4"
        />
      )}
      {/* <h3 className="text-lg font-bold">{name}</h3> */}
      {/* <p className="text-gray-600">{description}</p> */}
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(id)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Edit
        </button>
        <button
          onClick={() => onSync(id)}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Sync
        </button>
        <button
          onClick={() => onDelete(id)}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default RegistryListing;
