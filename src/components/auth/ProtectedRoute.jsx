import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * ProtectedRoute Guard
 * Restricts access to authenticated users only.
 * Redirects unauthenticated users to /login.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Show neutral loader while checking initial auth session
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAF8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase font-medium tracking-wider text-[#777777]">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
