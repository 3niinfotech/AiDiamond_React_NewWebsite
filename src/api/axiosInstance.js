import axios from "axios";
import { ENDPOINTS } from "./endpoints";

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
  USER: "auth_user_data",
};

// Custom Event for Global Auth State Synchronization
export const AUTH_LOGOUT_EVENT = "auth:logout";

/**
 * Emit a global logout event that AuthContext / App can subscribe to.
 * @param {Object} detail - Reason or additional metadata
 */
export const emitAuthLogoutEvent = (detail = { reason: "unauthorized" }) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT, { detail }));
  }
};

/**
 * Subscribe to the global logout event
 * @param {Function} callback
 * @returns {Function} unsubscribe function
 */
export const onAuthLogout = (callback) => {
  if (typeof window === "undefined") return () => { };
  const handler = (event) => callback(event.detail);
  window.addEventListener(AUTH_LOGOUT_EVENT, handler);
  return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handler);
};

// Storage Helpers
export const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null;
};

export const getStoredRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null;
};

export const setStoredTokens = ({ accessToken, refreshToken }) => {
  if (typeof window === "undefined") return;
  if (accessToken) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

export const clearAuthStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Normalizes backend error responses into a consistent structured error object.
 */
export const normalizeApiError = (error) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || null;
    const responseData = error.response?.data;

    let message =
      responseData?.message ||
      responseData?.error ||
      responseData?.detail ||
      error.message ||
      "An unexpected server error occurred.";

    if (error.code === "ECONNABORTED") {
      message = "Request timeout. Please check your network connection.";
    } else if (!error.response && error.request) {
      message = "Network error: Unable to connect to server.";
    }

    const customError = new Error(message);
    customError.status = status;
    customError.data = responseData;
    customError.isNetworkError = !error.response;
    customError.originalError = error;

    return customError;
  }

  return error instanceof Error ? error : new Error(String(error));
};

// Centralized Axios Instance
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

export const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Refresh Token Queue Variables
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(normalizeApiError(error));
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================
axiosInstance.interceptors.response.use(
  (response) => {
    // Return full Axios response if caller explicitly asks for it (e.g. headers/status)
    if (response.config?.returnFullResponse) {
      return response;
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = getStoredRefreshToken();

      // EDGE CASE A: Backend does NOT use refresh tokens (single JWT token mode)
      if (!refreshToken) {
        clearAuthStorage();
        emitAuthLogoutEvent({ reason: "session_expired" });
        return Promise.reject(normalizeApiError(error));
      }

      // If the failing request was itself the refresh token call, don't loop
      if (originalRequest.url?.includes(ENDPOINTS.AUTH.REFRESH)) {
        clearAuthStorage();
        emitAuthLogoutEvent({ reason: "refresh_failed" });
        return Promise.reject(normalizeApiError(error));
      }

      // EDGE CASE B: Refresh token is available -> Use Silent Refresh Queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(normalizeApiError(err)));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Raw axios call bypassing interceptors for token refresh
        const refreshResponse = await axios.post(
          `${baseURL}${ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken =
          refreshResponse.data?.token ||
          refreshResponse.data?.accessToken ||
          refreshResponse.data?.data?.token;

        const newRefreshToken =
          refreshResponse.data?.refreshToken ||
          refreshResponse.data?.data?.refreshToken ||
          refreshToken;

        if (!newAccessToken) {
          throw new Error("Invalid token refresh response from server.");
        }

        // Save fresh tokens
        setStoredTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken });

        // Replay queued requests
        processQueue(null, newAccessToken);

        // Retry the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearAuthStorage();
        emitAuthLogoutEvent({ reason: "refresh_failed" });
        return Promise.reject(normalizeApiError(refreshErr));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeApiError(error));
  }
);

export default axiosInstance;
