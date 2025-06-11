// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { auth } from "~/firebase.client";
import Loader from "./Loader.client";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // List of authorized admin emails
  const AUTHORIZED_ADMINS = [
    "omrinuri@gmail.com",
    "micelio@revolucionfungi.com",
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // No user logged in
        navigate("/login");
        setIsLoading(false);
      } else if (AUTHORIZED_ADMINS.includes(user.email || "")) {
        // User is authorized
        setIsAuthorized(true);
        setIsLoading(false);
      } else {
        // User is not authorized - sign them out and redirect
        auth.signOut();
        navigate("/login");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthorized) {
    return null; // Will redirect to login
  }

  return children;
};

export default ProtectedRoute;
