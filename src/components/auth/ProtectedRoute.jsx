import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../data/firmData";

/**
 * ProtectedRoute Guard
 * Restricts access to authenticated users only (RSDXB).
 * Redirects unauthenticated users to /login.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
