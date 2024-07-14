export type Registry = {
  id: string;
  images: File[];
  createdAt: Date;
  updatedAt: Date;
};

// NewRegistry is same as Registry but an optional id field
export type NewRegistry = Omit<Registry, "id"> & { id?: string };
