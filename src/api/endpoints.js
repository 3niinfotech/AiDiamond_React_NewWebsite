/**
 * Centralized API Endpoints Configuration
 * Single source of truth for all API endpoint URLs in the application.
 */

export const ENDPOINTS = Object.freeze({
  // Authentication & Session
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Firms & Ledgers (Bourse Books)
  FIRMS: {
    LIST: "/firms",
    DETAILS: (firmId) => `/firms/${firmId}`,
    LEDGER: (firmId) => `/firms/${firmId}/ledger`,
    VOUCHERS: (firmId) => `/firms/${firmId}/vouchers`,
  },

  // Parties & Contacts
  PARTIES: {
    LIST: "/parties",
    DETAILS: (id) => `/parties/${id}`,
    CREATE: "/parties",
    UPDATE: (id) => `/parties/${id}`,
    DELETE: (id) => `/parties/${id}`,
  },

  // Public Website / Blogs
  BLOGS: {
    LIST: "/blogs",
    DETAILS: (slug) => `/blogs/${slug}`,
  },
});

export default ENDPOINTS;
