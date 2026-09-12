import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";
import {
  STORAGE_KEYS,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
  clearAuthStorage,
  onAuthLogout,
} from "../api/axiosInstance";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on first mount
  useEffect(() => {
    try {
      const storedAccessToken = getStoredAccessToken();
      const storedRefreshToken = getStoredRefreshToken();
      const storedUserData = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedAccessToken && storedUserData) {
        setToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error("Failed to restore auth session:", error);
      clearAuthStorage();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Subscribe to Axios Interceptor 401 auto-logout events
  useEffect(() => {
    const unsubscribe = onAuthLogout((detail) => {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      console.warn("Session ended automatically by interceptor:", detail?.reason);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Log in user with credentials
   * @param {Object} credentials - { username, password }
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const authData = await authService.login(credentials);

      if (!authData?.accessToken) {
        throw new Error("Login failed: Access token missing in server response.");
      }

      // Persist tokens
      setStoredTokens({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
      });

      // Persist user profile
      if (authData.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authData.user));
      }

      setToken(authData.accessToken);
      setRefreshToken(authData.refreshToken);
      setUser(authData.user);

      return { success: true, data: authData };
    } catch (error) {
      clearAuthStorage();
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log out user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout API call failed, clearing local session:", err);
    } finally {
      clearAuthStorage();
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    token,
    refreshToken,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
