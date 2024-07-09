// src/components/ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { auth } from "~/firebase";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return children;
};

export default ProtectedRoute;
