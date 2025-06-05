import { db } from "~/firebase.client";
import { collection, doc, setDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { Collector, NewCollector } from "~/types";

export async function createCollectorFromName(name: string): Promise<string> {
  if (!name || name.trim() === "") {
    throw new Error("Collector name is required");
  }

  const trimmedName = name.trim();
  
  // Check if collector already exists
  const existingCollector = await findCollectorByName(trimmedName);
  if (existingCollector) {
    return existingCollector.id;
  }

  // Parse first and last name
  const nameParts = trimmedName.split(' ').filter(part => part.trim() !== '');
  const firstName = nameParts.length > 0 ? nameParts[0] : undefined;
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

  // Create new collector
  const collectorsCollection = collection(db, "collectors");
  const collectorId = generateCollectorId(trimmedName);
  
  const newCollector: NewCollector = {
    name: trimmedName,
    firstName: firstName,
    lastName: lastName,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Remove undefined values for Firestore compatibility
  const cleanCollectorData = Object.fromEntries(
    Object.entries({
      ...newCollector,
      id: collectorId,
    }).filter(([key, value]) => value !== undefined)
  );

  const collectorDoc = doc(collectorsCollection, collectorId);
  await setDoc(collectorDoc, cleanCollectorData);
  
  return collectorId;
}

export async function findCollectorByName(name: string): Promise<Collector | null> {
  try {
    const collectorsCollection = collection(db, "collectors");
    const q = query(collectorsCollection, where("name", "==", name.trim()));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Collector;
  } catch (error) {
    console.error("Error finding collector:", error);
    return null;
  }
}

export async function getAllCollectors(): Promise<Collector[]> {
  try {
    const collectorsCollection = collection(db, "collectors");
    const q = query(collectorsCollection, orderBy("name"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Collector[];
  } catch (error) {
    console.error("Error getting collectors:", error);
    return [];
  }
}

export function generateCollectorId(name: string): string {
  // Generate a simple ID from the name
  const baseId = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .substring(0, 30); // Limit length
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36);
  return `${baseId}-${timestamp}`;
}

export async function getCollectorNameById(collectorId: string): Promise<string> {
  if (!collectorId) return "Desconocido";
  
  try {
    const collectorsCollection = collection(db, "collectors");
    const collectorDoc = doc(collectorsCollection, collectorId);
    const snapshot = await getDocs(query(collectorsCollection, where("__name__", "==", collectorId)));
    
    if (!snapshot.empty) {
      return snapshot.docs[0].data().name || "Desconocido";
    }
    
    return "Desconocido";
  } catch (error) {
    console.error("Error getting collector name:", error);
    return "Desconocido";
  }
}