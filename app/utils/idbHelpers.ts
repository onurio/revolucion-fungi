// src/utils/indexedDB.ts
import { openDB } from "idb";
import { v4 as uuidv4 } from "uuid";
import { NewRegistry, Registry } from "~/types";

const DB_NAME = "fungarium";
const STORE_NAME = "registries";

export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
  return db;
};

export const saveRegistry = async (registry: NewRegistry) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  if (!registry.id) {
    registry.id = uuidv4();
  }

  console.log(registry);
  await store.put(registry);
  await tx.done;
};

export const deleteRegistry = async (id: string) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.delete(id);
  await tx.done;
};

export const getRegistries = async (): Promise<Registry[]> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const allRegistries = await store.getAll();
  await tx.done;
  return allRegistries;
};

export const getRegistryById = async (id: string): Promise<Registry> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const registry = await store.get(id);
  await tx.done;
  return registry;
};
