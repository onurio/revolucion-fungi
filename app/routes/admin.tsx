import React from "react";
import { Outlet, useLocation } from "@remix-run/react";
import ProtectedRoute from "~/components/ProtectedRoute.client";
import AdminLayout from "~/components/AdminLayout.client";
import Dashboard from "~/components/Dashboard.client";

const AdminRoute: React.FC = () => {
  const location = useLocation();
  const isRootAdmin = location.pathname === "/admin";

  return (
    <ProtectedRoute>
      <AdminLayout>
        {isRootAdmin ? <Dashboard /> : <Outlet />}
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminRoute;