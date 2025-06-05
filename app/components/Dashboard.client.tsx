import React from "react";
import { auth } from "~/firebase.client";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "@remix-run/react";
import { useUser } from "~/contexts/UserContext.client";
import Loader from "./Loader.client";
import Listings from "./Listings";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Fungarium Perú</h2>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800"
        >
          Salir
        </button>
      </div>
      <div className="flex-grow p-4">
        <h3 className="text-lg font-semibold mb-4">Welcome, {user?.email}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Link
              to="/fungarium"
              className="block p-4 bg-green-600 text-white text-center rounded-md shadow-md hover:bg-green-700 transition-colors"
            >
              Ver Fungarium
            </Link>
            <Link
              to="/listing"
              className="block p-4 bg-indigo-600 text-white text-center rounded-md shadow-md hover:bg-indigo-700 transition-colors"
            >
              Nuevo Registro
            </Link>
            <Link
              to="/collectors"
              className="block p-4 bg-orange-600 text-white text-center rounded-md shadow-md hover:bg-orange-700 transition-colors"
            >
              Gestionar Colectores
            </Link>
            <Link
              to="/admin"
              className="block p-4 bg-purple-600 text-white text-center rounded-md shadow-md hover:bg-purple-700 transition-colors"
            >
              Importar CSV
            </Link>
          </div>
          <Listings />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
