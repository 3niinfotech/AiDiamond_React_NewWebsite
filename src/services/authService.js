// Static Authentication Service - API calling disabled
const STATIC_USERS = [
  {
    username: "admin",
    password: "admin123",
    profile: {
      id: "usr_admin_01",
      username: "admin",
      name: "System Administrator",
      email: "admin@royalraysbv.com",
      role: "Chief Comptroller / Managing Director",
    },
  },
  {
    username: "RSDXB",
    password: "Royal@1504",
    profile: {
      id: "usr_rsdxb_01",
      username: "RSDXB",
      name: "RSDXB Admin",
      email: "rsdxb@royalrays.com",
      role: "Bourse Administrator",
    },
  },
];

/**
 * Backend Response Adapter
 * Normalizes auth data structure
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

  const user = data.user || {
    id: data.id || data.userId || data._id || "usr_default",
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
 * Auth Service Methods (Static Authentication)
 */
export const authService = {
  /**
   * Log in user with static credentials
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} normalized auth payload
   */
  async login(credentials) {
    const inputUsername = String(credentials?.username || "").trim();
    const inputPassword = String(credentials?.password || "").trim();

    // Check against predefined static users
    const matchedUser = STATIC_USERS.find(
      (u) =>
        u.username.toLowerCase() === inputUsername.toLowerCase() &&
        u.password === inputPassword
    );

    if (matchedUser) {
      return normalizeAuthResponse({
        token: `static_access_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        refreshToken: `static_refresh_token_${Date.now()}`,
        user: matchedUser.profile,
      });
    }

    // Fallback: If both username and password are provided, allow login with custom user profile
    if (inputUsername && inputPassword) {
      return normalizeAuthResponse({
        token: `static_access_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        refreshToken: `static_refresh_token_${Date.now()}`,
        user: {
          id: `usr_${inputUsername.toLowerCase()}`,
          username: inputUsername,
          name: `${inputUsername.toUpperCase()} User`,
          email: `${inputUsername.toLowerCase()}@royalrays.com`,
          role: "Bourse Administrator",
        },
      });
    }

    const error = new Error("Invalid username or password. Please provide valid credentials.");
    error.status = 401;
    throw error;
  },

  /**
   * Log out user statically
   */
  async logout() {
    return { success: true };
  },

  /**
   * Refresh static access token
   */
  async refreshToken(refreshToken) {
    return normalizeAuthResponse({
      token: `static_refreshed_access_token_${Date.now()}`,
      refreshToken: refreshToken || `static_refresh_token_${Date.now()}`,
    });
  },

  /**
   * Fetch currently authenticated user profile statically
   */
  async getCurrentUser() {
    return {
      username: "admin",
      name: "System Administrator",
      role: "Chief Comptroller / Managing Director",
    };
  },
};

export default authService;

