import { getAllFirms, addCustomFirm, updateFirm, deleteFirm } from "../data/firmData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.royalraysbv.com";
const CLEAN_BASE = API_BASE_URL.replace(/\/+$/, "");

/**
 * Candidate URLs for RS_FirmBookMaster endpoints
 */
const getCandidateUrls = (action) => {
  const baseWithoutApi = CLEAN_BASE.replace(/\/api$/, "");
  return [
    `${baseWithoutApi}/RS_FirmBookMaster/${action}`,
    `${baseWithoutApi}/api/RS_FirmBookMaster/${action}`,
    `${CLEAN_BASE}/RS_FirmBookMaster/${action}`,
  ];
};

/**
 * Helper to fetch with candidate URL fallback
 */
async function fetchApi(action, options = {}) {
  const urls = getCandidateUrls(action);
  let lastError = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (response.ok) {
        return response;
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error(`Failed to reach ${action} endpoint`);
}

/**
 * Normalizes Firm Book object from API or Local format
 */
const normalizeFirmItem = (item) => {
  const firmId = item.FirmId ?? item.firmId ?? item.id;
  const firmName = item.FirmName ?? item.firmName ?? item.name ?? "";
  const shortCode = item.ShortCode ?? item.shortCode ?? "FRM";
  const tagline = item.Tagline ?? item.tagline ?? "Firm Book Ledger";
  const description = item.Description ?? item.description ?? "Registered firm book portal.";
  const badge = item.Badge ?? item.badge ?? "Firm Book";
  const founded = item.Founded ?? item.founded ?? "2024";
  const accentColor = item.AccentColor ?? item.accentColor ?? "#D4A853";
  const openingBalance = Number(item.OpeningBalance ?? item.openingBalance ?? 0);
  const openingBalType = item.OpeningBalType ?? item.openingBalType ?? "CR";

  return {
    id: firmId ? String(firmId) : `firm-${Date.now()}`,
    firmId: firmId,
    name: firmName,
    shortCode,
    tagline,
    description,
    badge,
    founded,
    accentColor,
    openingBalance,
    openingBalType,
    bgGradient: "linear-gradient(135deg, rgba(212, 168, 83, 0.15) 0%, rgba(10, 10, 12, 0.95) 100%)",
    icon: "FaBuilding",
  };
};

/**
 * Service for Firm Book Master CRUD operations via RS_FirmBookMaster API
 */
export const rsFirmBookMasterService = {
  /**
   * Fetch all firm book records from API (RS_FirmBookMaster/GetAll)
   */
  async getAllFirms() {
    try {
      const response = await fetchApi("GetAll", { method: "GET" });
      if (response && response.ok) {
        const result = await response.json();
        const status = result.Status ?? result.status ?? true;
        const rawData = result.Data ?? result.data ?? (Array.isArray(result) ? result : null);

        if (status && Array.isArray(rawData)) {
          const mappedFirms = rawData.map(normalizeFirmItem);
          return { success: true, data: mappedFirms, isApi: true };
        }
      }
    } catch (error) {
      console.warn("RS_FirmBookMaster API unavailable on http://localhost:44386, using local firm data fallback:", error);
    }

    // Fallback to local firm data
    return { success: true, data: getAllFirms().map(normalizeFirmItem), isApi: false };
  },

  /**
   * Get single firm book record by ID (RS_FirmBookMaster/GetById/{id})
   */
  async getFirmById(firmId) {
    try {
      const response = await fetchApi(`GetById/${firmId}`, { method: "GET" });
      if (response && response.ok) {
        const result = await response.json();
        const rawData = result.Data ?? result.data ?? result;
        if (rawData) {
          return {
            success: true,
            data: normalizeFirmItem(rawData),
          };
        }
      }
    } catch (error) {
      console.warn("Error fetching firm book by ID from API:", error);
    }
    return { success: false, data: null };
  },

  /**
   * Create a new firm book record (RS_FirmBookMaster/Create)
   */
  async createFirm(formData) {
    const payload = {
      FirmName: formData.firmName.trim(),
      ShortCode: formData.shortCode || "",
      Tagline: formData.tagline ? formData.tagline.trim() : "",
      Description: formData.description ? formData.description.trim() : "",
      Badge: formData.badge ? formData.badge.trim() : "",
      Founded: formData.founded ? formData.founded.trim() : new Date().getFullYear().toString(),
      AccentColor: formData.accentColor || "#D4A853",
      OpeningBalance: Number(formData.openingBalance || 0),
      OpeningBalType: formData.openingBalType || "CR",
    };

    try {
      const response = await fetchApi("Create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response && response.ok) {
        const result = await response.json();
        const status = result.Status ?? result.status ?? true;
        const rawData = result.Data ?? result.data;
        if (status) {
          return {
            success: true,
            data: rawData ? normalizeFirmItem(rawData) : null,
            message: result.Message || result.message || "Firm book created successfully",
            isApi: true,
          };
        }
      }
    } catch (error) {
      console.warn("API save error, persisting to local storage:", error);
    }

    // Fallback to local storage creation
    const cleanName = formData.firmName.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `firm-${Date.now()}`;
    const id = `${slug}-${Date.now().toString(36).substring(2, 6)}`;
    const words = cleanName.split(/\s+/).filter(Boolean);
    const shortCode = words.length >= 2 ? words.map((w) => w[0]).join("").toUpperCase().slice(0, 4) : cleanName.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4) || "FRM";

    const newFirm = {
      id,
      name: cleanName,
      shortCode,
      tagline: formData.tagline?.trim() || "Firm Book Ledger",
      description: formData.description?.trim() || "Registered firm book portal.",
      badge: formData.badge?.trim() || "Firm Book",
      founded: formData.founded?.trim() || new Date().getFullYear().toString(),
      accentColor: formData.accentColor || "#D4A853",
      openingBalance: Number(formData.openingBalance || 0),
      openingBalType: formData.openingBalType || "CR",
      bgGradient: "linear-gradient(135deg, rgba(212, 168, 83, 0.15) 0%, rgba(10, 10, 12, 0.95) 100%)",
      icon: "FaBuilding",
    };

    addCustomFirm(newFirm);
    return { success: true, data: newFirm, isFallback: true };
  },

  /**
   * Update an existing firm book record (RS_FirmBookMaster/Update)
   */
  async updateFirm(firmId, formData) {
    const isNumericId = !isNaN(Number(firmId));

    if (isNumericId) {
      const payload = {
        FirmId: Number(firmId),
        FirmName: formData.firmName.trim(),
        ShortCode: formData.shortCode || "",
        Tagline: formData.tagline ? formData.tagline.trim() : "",
        Description: formData.description ? formData.description.trim() : "",
        Badge: formData.badge ? formData.badge.trim() : "",
        Founded: formData.founded ? formData.founded.trim() : "",
        AccentColor: formData.accentColor || "#D4A853",
        OpeningBalance: Number(formData.openingBalance || 0),
        OpeningBalType: formData.openingBalType || "CR",
      };

      try {
        const response = await fetchApi("Update", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response && response.ok) {
          const result = await response.json();
          const status = result.Status ?? result.status ?? true;
          const rawData = result.Data ?? result.data;
          if (status) {
            return {
              success: true,
              data: rawData ? normalizeFirmItem(rawData) : null,
              message: result.Message || result.message || "Firm book updated successfully",
              isApi: true,
            };
          }
        }
      } catch (error) {
        console.warn("API update error, updating local storage:", error);
      }
    }

    // Fallback to local storage update
    const cleanName = formData.firmName.trim();
    const words = cleanName.split(/\s+/).filter(Boolean);
    const shortCode = words.length >= 2 ? words.map((w) => w[0]).join("").toUpperCase().slice(0, 4) : cleanName.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4) || "FRM";

    const updatedFields = {
      name: cleanName,
      shortCode,
      tagline: formData.tagline?.trim() || "Firm Book Ledger",
      description: formData.description?.trim() || "Registered firm book portal.",
      badge: formData.badge?.trim() || "Firm Book",
      openingBalance: Number(formData.openingBalance || 0),
      openingBalType: formData.openingBalType || "CR",
    };

    updateFirm(firmId, updatedFields);
    return { success: true, isFallback: true };
  },

  /**
   * Delete a firm book record (RS_FirmBookMaster/Delete/{id})
   */
  async deleteFirm(firmId) {
    const isNumericId = !isNaN(Number(firmId));

    if (isNumericId) {
      try {
        const response = await fetchApi(`Delete/${firmId}`, { method: "POST" });
        if (response && response.ok) {
          const result = await response.json();
          const status = result.Status ?? result.status ?? true;
          if (status) {
            return {
              success: true,
              message: result.Message || result.message || "Firm book deleted successfully",
              isApi: true,
            };
          }
        }
      } catch (error) {
        console.warn("API delete error, deleting local storage:", error);
      }
    }

    // Fallback to local storage delete
    deleteFirm(firmId);
    return { success: true, isFallback: true };
  },
};
