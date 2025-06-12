import { useParams, Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import { db } from "~/firebase.client";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FungiWithDynamicFields, Collector } from "~/types";
import FungiDetail from "~/components/FungiDetail";
import { useCollectors } from "~/contexts/CollectorsContext.client";

export default function FungiDetailPage() {
  const params = useParams();
  const codigoFungario = params.id;
  const [fungi, setFungi] = useState<FungiWithDynamicFields | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getCollectorById } = useCollectors();

  useEffect(() => {
    const fetchFungi = async () => {
      if (!codigoFungario) {
        setError("Código fungario no válido");
        setLoading(false);
        return;
      }

      try {
        const fungiCollection = collection(db, "fungi");
        const q = query(
          fungiCollection,
          where("codigoFungario", "==", codigoFungario)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const docData = doc.data();
          const fungiData = {
            id: doc.id,
            ...docData,
            fecha: docData.fecha?.toDate(),
            createdAt: docData.createdAt?.toDate(),
            updatedAt: docData.updatedAt?.toDate(),
          } as FungiWithDynamicFields;

          setFungi(fungiData);
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
  }, [codigoFungario]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del hongo...</p>
          <p className="text-sm text-gray-500 mt-2">Código: {codigoFungario}</p>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Hongo no encontrado
          </h1>
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
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            ← Volver al Fungarium
          </Link>
        </div>

        <FungiDetail 
          fungi={fungi} 
          collectors={fungi.collectorIds?.map(id => getCollectorById(id)).filter(Boolean) || []} 
        />
      </div>
    </div>
  );
}
