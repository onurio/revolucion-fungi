import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "@remix-run/react";
import ProtectedRoute from "~/components/ProtectedRoute.client";
import AdminLayout from "~/components/AdminLayout.client";
import FungiForm from "~/components/FungiForm.client";
import { Fungi } from "~/types";
import { db } from "~/firebase.client";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import Loader from "~/components/Loader.client";

const EditFungi: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fungi, setFungi] = useState<Fungi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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
          const fungiData = {
            id: fungiSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            fecha: data.fecha?.toDate() || undefined,
          } as Fungi;
          setFungi(fungiData);
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
    navigate(`/fungi/${fungi?.codigoFungario}`);
  };

  const handleCancel = () => {
    navigate(`/fungi/${fungi?.codigoFungario}`);
  };

  const handleDelete = async () => {
    if (!id || !fungi) return;

    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el hongo "${fungi.codigoFungario}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      const fungiDoc = doc(db, "fungi", id);
      await deleteDoc(fungiDoc);

      // Navigate to dashboard after successful deletion
      navigate("/admin");
    } catch (error) {
      console.error("Error deleting fungi:", error);
      alert("Error al eliminar el hongo. Por favor, inténtalo de nuevo.");
    } finally {
      setDeleting(false);
    }
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
              onClick={() => navigate("/admin")}
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
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Editar Hongo: {fungi.codigoFungario}
              </h2>
              <p className="text-gray-600">
                Modifica la información del registro de hongo
              </p>
            </div>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Eliminando...
                </>
              ) : (
                <>
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Eliminar
                </>
              )}
            </button>
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
