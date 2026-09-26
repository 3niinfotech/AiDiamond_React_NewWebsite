/**
 * Firm configuration and sample ledger datasets for the 4 books:
 * 1. MS BOOK
 * 2. SHARDA BOOK
 * 3. DARSH BOOK
 * 4. BAJRANG BOOK
 *
 * Fields Schema:
 * Date | Description | Type | AED (Optional) | CR/DR | Amount | Bal | Remark
 */

export const FIRMS_CONFIG = [];

export const INITIAL_LEDGER_RECORDS = {};

const STORAGE_KEY_PREFIX = "royal_rays_firm_records_v2_";
const CUSTOM_FIRMS_STORAGE_KEY = "royal_rays_custom_firms_v1";
const AUTH_KEY = "royal_rays_auth_user";

export const getCustomFirms = () => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(CUSTOM_FIRMS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error("Error reading custom firms:", err);
  }
  return [];
};

export const addCustomFirm = (firmObj) => {
  if (typeof window === "undefined") return [];
  try {
    const existing = getCustomFirms();
    const updated = [...existing, firmObj];
    localStorage.setItem(CUSTOM_FIRMS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error saving custom firm:", err);
    return [];
  }
};

export const updateFirm = (firmId, updatedFields) => {
  if (typeof window === "undefined") return [];
  try {
    const existingCustom = getCustomFirms();
    const isCustom = existingCustom.some((f) => f.id === firmId);
    if (isCustom) {
      const updated = existingCustom.map((f) => (f.id === firmId ? { ...f, ...updatedFields } : f));
      localStorage.setItem(CUSTOM_FIRMS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } else {
      const found = FIRMS_CONFIG.find((f) => f.id === firmId);
      if (found) {
        const updated = [...existingCustom, { ...found, ...updatedFields }];
        localStorage.setItem(CUSTOM_FIRMS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
    }
  } catch (err) {
    console.error("Error updating firm:", err);
  }
  return [];
};

export const deleteFirm = (firmId) => {
  if (typeof window === "undefined") return;
  try {
    const existingCustom = getCustomFirms();
    const filtered = existingCustom.filter((f) => f.id !== firmId);
    localStorage.setItem(CUSTOM_FIRMS_STORAGE_KEY, JSON.stringify(filtered));
    resetFirmRecords(firmId);
  } catch (err) {
    console.error("Error deleting firm:", err);
  }
};

export const getAllFirms = () => {
  const custom = getCustomFirms();
  return [...FIRMS_CONFIG, ...custom];
};

export const getFirmById = (firmId) => {
  if (!firmId) return FIRMS_CONFIG[0];
  const all = getAllFirms();
  const searchStr = String(firmId).toLowerCase().trim();

  const found = all.find((f) => {
    if (String(f.id).toLowerCase() === searchStr) return true;
    if (f.firmId && String(f.firmId).toLowerCase() === searchStr) return true;
    if (f.shortCode && f.shortCode.toLowerCase() === searchStr) return true;
    if (f.name && f.name.toLowerCase() === searchStr) return true;
    if (f.name && f.name.toLowerCase().replace(/\s+/g, "-") === searchStr) return true;
    return false;
  });

  return found || all[0];
};

/**
 * Load records with dynamic running balance calculation
 */
export const getFirmRecords = (firmId) => {
  let list = INITIAL_LEDGER_RECORDS[firmId] || [];
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${firmId}`);
      if (saved) {
        list = JSON.parse(saved);
      }
    } catch (err) {
      console.error("Error reading localStorage:", err);
    }
  }

  // Calculate Running Balance in chronological order (oldest to newest)
  let running = 0;
  const chronological = [...list].reverse();
  const calculatedChronological = chronological.map((item) => {
    const isCr = item.crDr === "CR" || (Number(item.credit) > 0);
    const amt = Number(item.amount) || (isCr ? Number(item.credit) : Number(item.debit)) || 0;
    const credit = isCr ? amt : 0;
    const debit = !isCr ? amt : 0;

    running += (credit - debit);

    return {
      ...item,
      crDr: isCr ? "CR" : "DR",
      amount: amt,
      credit,
      debit,
      runningBal: running,
      bal: running,
    };
  });

  return calculatedChronological.reverse();
};

export const saveFirmRecords = (firmId, records) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${firmId}`, JSON.stringify(records));
  } catch (err) {
    console.error("Error saving records:", err);
  }
};

export const resetFirmRecords = (firmId) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${firmId}`);
  } catch (err) { }
};

export const calculateFirmSummary = (records = []) => {
  const totalCredit = records.reduce((sum, r) => sum + (Number(r.credit) || (r.crDr === "CR" ? Number(r.amount) : 0) || 0), 0);
  const totalDebit = records.reduce((sum, r) => sum + (Number(r.debit) || (r.crDr === "DR" ? Number(r.amount) : 0) || 0), 0);
  const totalAed = records.reduce((sum, r) => sum + (Number(r.aed) || 0), 0);
  const netBalance = totalCredit - totalDebit;
  const totalCount = records.length;
  const crCount = records.filter((r) => r.crDr === "CR" || Number(r.credit) > 0).length;
  const drCount = records.filter((r) => r.crDr === "DR" || Number(r.debit) > 0).length;

  return {
    totalCredit,
    totalDebit,
    totalAed,
    netBalance,
    totalCount,
    crCount,
    drCount,
  };
};

export const formatCurrency = (amount, currency = "INR") => {
  if (amount === undefined || amount === null || isNaN(amount)) return "0";
  const num = Number(amount);
  if (currency === "AED") {
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " AED";
  }
  if (currency === "USD") {
    return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return "" + num.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

export const MASTER_CREDENTIALS = {
  username: "RSDXB",
  password: "Royal@1504",
};

/**
 * Validate credentials strictly against RSDXB / Royal@1504
 */
export const validateCredentials = (inputUsername, inputPassword) => {
  if (!inputUsername || !inputPassword) {
    return {
      success: false,
      error: "Please provide both Username and Security Password.",
    };
  }

  const cleanUser = String(inputUsername).trim();
  const cleanPass = String(inputPassword).trim();

  // Strict match for RSDXB (case-insensitive username allowed, strict password)
  if (cleanUser.toUpperCase() === "RSDXB" && cleanPass === "Royal@1504") {
    return {
      success: true,
      user: {
        username: "RSDXB",
        name: "RSDXB Admin",
        designation: "Chief Comptroller / Managing Director",
        role: "Bourse Administrator",
        email: "rsdxb@royalrays.com",
        token: `auth_rsdxb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        loginTime: new Date().toISOString(),
      },
    };
  }

  return {
    success: false,
    error: "Invalid Username or Password! Access denied for unauthorized credentials.",
  };
};

export const getAuthUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem("auth_user_data") || localStorage.getItem(AUTH_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return parsed || null;
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("auth_access_token");
  const user = getAuthUser();
  return Boolean(token || (user && user.token));
};

export const setAuthUser = (userObj) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(userObj));
  localStorage.setItem("auth_user_data", JSON.stringify(userObj));
  if (userObj?.token) {
    localStorage.setItem("auth_access_token", userObj.token);
  }
};

export const clearAuthUser = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("auth_access_token");
  localStorage.removeItem("auth_refresh_token");
  localStorage.removeItem("auth_user_data");
  window.dispatchEvent(new CustomEvent("auth:logout", { detail: { reason: "user_logout" } }));
};



if (typeof window !== "undefined") {
  try {
    // Clear old demo sample keys once
    if (!localStorage.getItem("royal_rays_demo_cleared_v1")) {
      localStorage.removeItem("royal_rays_custom_firms_v1");
      localStorage.removeItem("royal_rays_firm_records_v1");
      localStorage.removeItem("royal_rays_signature_vouchers_v1");
      localStorage.removeItem("royal_rays_firm_entries_v1");
      localStorage.setItem("royal_rays_demo_cleared_v1", "true");
    }
  } catch (e) {}
}
