import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom Hook to consume AuthContext safely
 * @returns {Object} { user, token, refreshToken, isAuthenticated, isLoading, login, logout }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default useAuth;
