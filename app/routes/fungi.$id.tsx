import { useParams, Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import { db } from "~/firebase.client";
import { doc, getDoc } from "firebase/firestore";
import { Fungi, Collector } from "~/types";
import FungiDetail from "~/components/FungiDetail";

export default function FungiDetailPage() {
  console.log("FungiDetailPage component is rendering!");
  
  const params = useParams();
  const fungiId = params.id;
  
  console.log("All params:", params);
  console.log("Fungi ID from params:", fungiId);
  const [fungi, setFungi] = useState<Fungi | null>(null);
  const [collector, setCollector] = useState<Collector | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFungi = async () => {
      if (!fungiId) {
        setError("ID de hongo no válido");
        setLoading(false);
        return;
      }

      console.log("Fetching fungi with ID:", fungiId);

      try {
        const fungiDoc = doc(db, "fungi", fungiId);
        const snapshot = await getDoc(fungiDoc);
        
        console.log("Document exists:", snapshot.exists());
        if (snapshot.exists()) {
          console.log("Document data:", snapshot.data());
        }
        
        if (snapshot.exists()) {
          const fungiData = {
            id: snapshot.id,
            ...snapshot.data(),
            fecha: snapshot.data().fecha?.toDate(),
            createdAt: snapshot.data().createdAt?.toDate(),
            updatedAt: snapshot.data().updatedAt?.toDate(),
          } as Fungi;
          
          setFungi(fungiData);
          
          // Fetch collector if collectorId exists
          if (fungiData.collectorId) {
            try {
              const collectorDoc = doc(db, "collectors", fungiData.collectorId);
              const collectorSnapshot = await getDoc(collectorDoc);
              
              if (collectorSnapshot.exists()) {
                const collectorData = {
                  id: collectorSnapshot.id,
                  ...collectorSnapshot.data(),
                  createdAt: collectorSnapshot.data().createdAt?.toDate(),
                  updatedAt: collectorSnapshot.data().updatedAt?.toDate(),
                } as Collector;
                
                setCollector(collectorData);
              }
            } catch (collectorError) {
              console.error("Error fetching collector:", collectorError);
            }
          }
        } else {
          setError("Hongo no encontrado");
        }
      } catch (error) {
        console.error("Error fetching fungi:", error);
        setError("Error cargando datos del hongo");
      } finally {
        setLoading(false);
      }
    };

    fetchFungi();
  }, [fungiId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del hongo...</p>
          <p className="text-sm text-gray-500 mt-2">ID: {fungiId}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/fungarium"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Volver al Fungarium
          </Link>
        </div>
      </div>
    );
  }

  if (!fungi) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hongo no encontrado</h1>
          <Link
            to="/fungarium"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Volver al Fungarium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            to="/fungarium"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ← Volver al Fungarium
          </Link>
        </div>

        <FungiDetail fungi={fungi} collector={collector || undefined} />
      </div>
    </div>
  );
}