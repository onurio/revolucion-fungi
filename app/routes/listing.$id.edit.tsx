import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "@remix-run/react";
import ProtectedRoute from "~/components/ProtectedRoute.client";
import AdminLayout from "~/components/AdminLayout.client";
import FungiForm from "~/components/FungiForm.client";
import { Fungi } from "~/types";
import { db } from "~/firebase.client";
import { doc, getDoc } from "firebase/firestore";
import Loader from "~/components/Loader.client";

const EditFungi: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fungi, setFungi] = useState<Fungi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFungi = async () => {
      if (!id) {
        setError("ID de hongo no encontrado");
        setLoading(false);
        return;
      }

      try {
        const fungiDoc = doc(db, "fungi", id);
        const fungiSnapshot = await getDoc(fungiDoc);
        
        if (fungiSnapshot.exists()) {
          const data = fungiSnapshot.data();
          setFungi({
            id: fungiSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            fecha: data.fecha?.toDate() || undefined,
          } as Fungi);
        } else {
          setError("Hongo no encontrado");
        }
      } catch (error) {
        console.error("Error fetching fungi:", error);
        setError("Error al cargar el hongo");
      } finally {
        setLoading(false);
      }
    };

    fetchFungi();
  }, [id]);

  const handleSave = () => {
    navigate(`/listing/${id}`);
  };

  const handleCancel = () => {
    navigate(`/listing/${id}`);
  };

  if (loading) return <Loader />;

  if (error || !fungi) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="text-center py-12">
            <div className="text-red-600 text-lg">
              {error || "Hongo no encontrado"}
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Volver al Dashboard
            </button>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Editar Hongo: {fungi.codigoFungario}
            </h2>
            <p className="text-gray-600">
              Modifica la información del registro de hongo
            </p>
          </div>
          
          <FungiForm 
            fungi={fungi}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default EditFungi;