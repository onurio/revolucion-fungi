import React, { useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";
import { getRegistryById, saveRegistry } from "../utils/idbHelpers";
import { NewRegistry } from "~/types";
import { useNavigate, useParams } from "@remix-run/react";

const RegistryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const [name, setName] = useState<string>("");
  const [registry, setRegistry] = useState<NewRegistry>({
    id: id,
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  // const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegistry = async () => {
      if (id) {
        const registry = await getRegistryById(id);
        if (registry) {
          setRegistry(registry);
        }
      }
    };

    fetchRegistry();
  }, [id]);

  const handleImagesChange = (selectedImages: File[]) => {
    setRegistry((prev) => ({
      ...prev,
      images: selectedImages,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveRegistry(registry);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Nuevo Registro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div> */}
        <ImageUpload
          onImagesChange={handleImagesChange}
          existingImages={registry.images}
        />
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default RegistryForm;
