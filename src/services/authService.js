import apiRequest from "../api/apiRequest";
import { ENDPOINTS } from "../api/endpoints";

// Flag to toggle between mock mode and real backend API via environment variable
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === "true";

/**
 * Backend Response Adapter
 * Normalizes different backend auth payload shapes into a standard frontend format:
 * { accessToken, refreshToken, user: { username, name, role, email, ... } }
 *
 * @param {Object} rawResponse
 * @returns {Object} normalizedAuthData
 */
export const normalizeAuthResponse = (rawResponse) => {
  if (!rawResponse) return null;

  const data = rawResponse.data || rawResponse;

  const accessToken =
    data.token ||
    data.accessToken ||
    data.access_token ||
    data.jwt ||
    null;

  const refreshToken =
    data.refreshToken ||
    data.refresh_token ||
    null;

  // Extract user profile information
  const user = data.user || {
    id: data.id || data.userId || data._id || null,
    username: data.username || data.userName || data.user_name || "User",
    name: data.name || data.fullName || data.full_name || "Authorized User",
    email: data.email || null,
    role: data.role || data.designation || "Bourse Member",
    firmId: data.firmId || data.firm_id || null,
  };

  return {
    accessToken,
    refreshToken,
    user,
    raw: data,
  };
};

/**
 * Helper to simulate network latency for mock auth
 */
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Auth Service Methods
 */
export const authService = {
  /**
   * Log in user with credentials
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} normalized auth payload
   */
  async login(credentials) {
    // 1. MOCK MODE: Used for development/testing when backend is not ready
    if (USE_MOCK_AUTH) {
      await delay(900);

      const username = String(credentials?.username || "").trim();
      const password = String(credentials?.password || "").trim();

      // Accepted mock credentials: admin/admin123 or RSDXB/Royal@1504
      const isValidAdmin = username.toLowerCase() === "admin" && password === "admin123";
      const isValidRSDXB = username.toUpperCase() === "RSDXB" && password === "Royal@1504";

      if (isValidAdmin || isValidRSDXB) {
        const userProfile = isValidAdmin
          ? {
              id: "usr_admin_01",
              username: "admin",
              name: "System Administrator",
              email: "admin@royalraysbv.com",
              role: "Chief Comptroller / Managing Director",
            }
          : {
              id: "usr_rsdxb_01",
              username: "RSDXB",
              name: "RSDXB Admin",
              email: "rsdxb@royalrays.com",
              role: "Bourse Administrator",
            };

        return normalizeAuthResponse({
          token: `mock_jwt_access_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          refreshToken: `mock_jwt_refresh_token_${Date.now()}`,
          user: userProfile,
        });
      }

      const error = new Error("Invalid username or password. Access restricted.");
      error.status = 401;
      throw error;
    }

    // 2. REAL BACKEND API MODE
    const response = await apiRequest({
      method: "post",
      endpoint: ENDPOINTS.AUTH.LOGIN,
      payload: credentials,
    });

    return normalizeAuthResponse(response);
  },

  /**
   * Log out user from server
   * @returns {Promise<any>}
   */
  async logout() {
    if (USE_MOCK_AUTH) {
      await delay(200);
      return { success: true };
    }

    try {
      return await apiRequest({
        method: "post",
        endpoint: ENDPOINTS.AUTH.LOGOUT,
      });
    } catch (error) {
      console.warn("Server logout notification failed:", error.message);
      return null;
    }
  },

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise<Object>}
   */
  async refreshToken(refreshToken) {
    if (USE_MOCK_AUTH) {
      await delay(400);
      return normalizeAuthResponse({
        token: `mock_refreshed_access_token_${Date.now()}`,
        refreshToken,
      });
    }

    const response = await apiRequest({
      method: "post",
      endpoint: ENDPOINTS.AUTH.REFRESH,
      payload: { refreshToken },
    });

    return normalizeAuthResponse(response);
  },

  /**
   * Fetch currently authenticated user profile
   * @returns {Promise<Object>}
   */
  async getCurrentUser() {
    if (USE_MOCK_AUTH) {
      await delay(300);
      return {
        username: "admin",
        name: "System Administrator",
        role: "Chief Comptroller / Managing Director",
      };
    }

    const response = await apiRequest({
      method: "get",
      endpoint: ENDPOINTS.AUTH.ME,
    });

    return response?.data || response;
  },
};

export default authService;
