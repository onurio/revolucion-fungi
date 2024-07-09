// src/routes/dashboard.tsx
import React from "react";
import ProtectedRoute from "~/components/ProtectedRoute.client";
import Dashboard from "~/components/Dashboard.client";

const DashboardRoute: React.FC = () => {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

export default DashboardRoute;
