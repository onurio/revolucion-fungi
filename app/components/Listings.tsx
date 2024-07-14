// src/components/Registries.tsx
import React, { useEffect, useState } from "react";
import RegistryListing from "./RegistryListing";
import { deleteRegistry, getRegistries } from "../utils/idbHelpers";
import { Registry } from "~/types";
import { useNavigate } from "@remix-run/react";

const Listings: React.FC = () => {
  const [listings, setListings] = useState<Registry[]>([]);
  const navigate = useNavigate();

  const fetchRegistries = async () => {
    const data = await getRegistries();
    setListings(data);
  };

  useEffect(() => {
    fetchRegistries();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/listing/${id}`);
  };

  const handleSync = (id: string) => {
    // Handle sync logic here
    alert(`Sync registry with id: ${id}`);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this registry?"
    );
    if (confirmDelete && id) {
      await deleteRegistry(id);
      fetchRegistries();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Registries</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {listings.length === 0 ? (
          <p>No registries found.</p>
        ) : (
          listings.map((listing) => (
            <RegistryListing
              key={listing.id}
              registry={listing}
              onEdit={handleEdit}
              onSync={handleSync}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Listings;
