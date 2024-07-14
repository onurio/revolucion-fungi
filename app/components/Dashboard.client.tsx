import React from "react";
import { auth } from "~/firebase";
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
          <Link
            to="/listing"
            className="block p-4 bg-indigo-600 text-white text-center rounded-md shadow-md"
          >
            Nuevo Registro
          </Link>
          <Listings />
          {/* Add more menu items here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
