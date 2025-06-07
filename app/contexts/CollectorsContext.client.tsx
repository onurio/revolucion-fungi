import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/firebase.client";
import { Collector } from "~/types";

interface CollectorsContextType {
  collectors: Map<string, Collector>;
  getCollectorById: (id: string) => Collector | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CollectorsContext = createContext<CollectorsContextType | undefined>(undefined);

interface CollectorsProviderProps {
  children: ReactNode;
}

export function CollectorsProvider({ children }: CollectorsProviderProps) {
  const [collectors, setCollectors] = useState<Map<string, Collector>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollectors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const collectorsCollection = collection(db, "collectors");
      const querySnapshot = await getDocs(collectorsCollection);
      
      const collectorsMap = new Map<string, Collector>();
      
      querySnapshot.forEach((doc) => {
        const collectorData = {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        } as Collector;
        
        collectorsMap.set(doc.id, collectorData);
      });
      
      setCollectors(collectorsMap);
    } catch (err) {
      console.error("Error fetching collectors:", err);
      setError("Error loading collectors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const getCollectorById = (id: string): Collector | undefined => {
    return collectors.get(id);
  };

  const value: CollectorsContextType = {
    collectors,
    getCollectorById,
    loading,
    error,
    refetch: fetchCollectors,
  };

  return (
    <CollectorsContext.Provider value={value}>
      {children}
    </CollectorsContext.Provider>
  );
}

export function useCollectors() {
  const context = useContext(CollectorsContext);
  if (context === undefined) {
    throw new Error("useCollectors must be used within a CollectorsProvider");
  }
  return context;
}