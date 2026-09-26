const DEFAULT_PARTIES = [];

import { getAllFirms, addCustomFirm, updateFirm, deleteFirm } from "../data/firmData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.royalraysbv.com";
const CLEAN_BASE = API_BASE_URL.replace(/\/+$/, "");

/**
 * Candidate URLs for RS_PartyMaster endpoints
 */
const getCandidateUrls = (action) => {
  const baseWithoutApi = CLEAN_BASE.replace(/\/api$/, "");
  return [
    `${baseWithoutApi}/RS_PartyMaster/${action}`,
    `${baseWithoutApi}/api/RS_PartyMaster/${action}`,
    `${CLEAN_BASE}/RS_PartyMaster/${action}`,
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
 * Normalizes Party object from API or Local format
 */
const normalizePartyItem = (item) => {
  const partyId = item.PartyId ?? item.partyId ?? item.id;
  const partyName = item.PartyName ?? item.partyName ?? item.name ?? "";
  const shortCode = item.ShortCode ?? item.shortCode ?? "PRT";
  const address = item.Address ?? item.address ?? "";
  const trn = item.TRN ?? item.trn ?? "";
  const email = item.Email ?? item.email ?? "";
  const contact = item.Contact ?? item.contact ?? "";

  return {
    id: partyId ? String(partyId) : `party-${Date.now()}`,
    partyId: partyId,
    name: partyName,
    shortCode,
    address,
    trn,
    email,
    contact,
    tagline: trn ? `TRN: ${trn}` : contact ? `Contact: ${contact}` : "Party Ledger Account",
    description: address || email || "Registered party ledger account.",
    badge: "Party Book",
    accentColor: "#D4A853",
    bgGradient: "linear-gradient(135deg, rgba(212, 168, 83, 0.15) 0%, rgba(10, 10, 12, 0.95) 100%)",
    icon: "FaBuilding",
  };
};

/**
 * Service for Party Master CRUD operations via RS_PartyMaster API
 */
export const rsPartyMasterService = {
  /**
   * Fetch all party master records from API (RS_PartyMaster/GetAll)
   */
  async getAllParties() {
    try {
      const response = await fetchApi("GetAll", { method: "GET" });
      if (response && response.ok) {
        const result = await response.json();
        const status = result.Status ?? result.status ?? true;
        const rawData = result.Data ?? result.data ?? (Array.isArray(result) ? result : null);

        if (status && Array.isArray(rawData)) {
          const mappedParties = rawData.map(normalizePartyItem);
          return { success: true, data: mappedParties, isApi: true };
        }
      }
    } catch (error) {
      console.warn("RS_PartyMaster API unavailable on http://localhost:44386, using default party master fallback:", error);
    }

    // Fallback to default party master list
    return { success: true, data: DEFAULT_PARTIES.map(normalizePartyItem), isApi: false };
  },

  /**
   * Get single party record by ID (RS_PartyMaster/GetById/{id})
   */
  async getPartyById(partyId) {
    try {
      const response = await fetchApi(`GetById/${partyId}`, { method: "GET" });
      if (response && response.ok) {
        const result = await response.json();
        const rawData = result.Data ?? result.data ?? result;
        if (rawData) {
          return {
            success: true,
            data: normalizePartyItem(rawData),
          };
        }
      }
    } catch (error) {
      console.warn("Error fetching party by ID from API:", error);
    }
    return { success: false, data: null };
  },

  /**
   * Create a new party master record (RS_PartyMaster/Create)
   */
  async createParty(formData) {
    const payload = {
      PartyName: formData.partyName.trim(),
      ShortCode: formData.shortCode || "",
      Address: formData.address ? formData.address.trim() : "",
      TRN: formData.trn ? formData.trn.trim() : "",
      Email: formData.email ? formData.email.trim() : "",
      Contact: formData.contact ? formData.contact.trim() : "",
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
            data: rawData ? normalizePartyItem(rawData) : null,
            message: result.Message || result.message || "Party created successfully",
            isApi: true,
          };
        }
      }
    } catch (error) {
      console.warn("API save error, persisting to local storage:", error);
    }

    // Fallback to local storage creation
    const cleanName = formData.partyName.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `party-${Date.now()}`;
    const id = `${slug}-${Date.now().toString(36).substring(2, 6)}`;
    const words = cleanName.split(/\s+/).filter(Boolean);
    const shortCode = words.length >= 2 ? words.map((w) => w[0]).join("").toUpperCase().slice(0, 4) : cleanName.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4) || "PRT";

    const newParty = {
      id,
      name: cleanName,
      shortCode,
      tagline: formData.trn?.trim() ? `TRN: ${formData.trn.trim()}` : formData.contact?.trim() ? `Contact: ${formData.contact.trim()}` : "Party Ledger Account",
      description: formData.address?.trim() || formData.email?.trim() || "Registered party ledger account.",
      badge: "Party Book",
      address: formData.address?.trim() || "",
      trn: formData.trn?.trim() || "",
      email: formData.email?.trim() || "",
      contact: formData.contact?.trim() || "",
      accentColor: "#D4A853",
      bgGradient: "linear-gradient(135deg, rgba(212, 168, 83, 0.15) 0%, rgba(10, 10, 12, 0.95) 100%)",
      icon: "FaBuilding",
    };

    addCustomFirm(newParty);
    return { success: true, data: newParty, isFallback: true };
  },

  /**
   * Update an existing party master record (RS_PartyMaster/Update)
   */
  async updateParty(partyId, formData) {
    const isNumericId = !isNaN(Number(partyId));

    if (isNumericId) {
      const payload = {
        PartyId: Number(partyId),
        PartyName: formData.partyName.trim(),
        ShortCode: formData.shortCode || "",
        Address: formData.address ? formData.address.trim() : "",
        TRN: formData.trn ? formData.trn.trim() : "",
        Email: formData.email ? formData.email.trim() : "",
        Contact: formData.contact ? formData.contact.trim() : "",
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
              data: rawData ? normalizePartyItem(rawData) : null,
              message: result.Message || result.message || "Party updated successfully",
              isApi: true,
            };
          }
        }
      } catch (error) {
        console.warn("API update error, updating local storage:", error);
      }
    }

    // Fallback to local storage update
    const cleanName = formData.partyName.trim();
    const words = cleanName.split(/\s+/).filter(Boolean);
    const shortCode = words.length >= 2 ? words.map((w) => w[0]).join("").toUpperCase().slice(0, 4) : cleanName.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4) || "PRT";

    const updatedFields = {
      name: cleanName,
      shortCode,
      tagline: formData.trn?.trim() ? `TRN: ${formData.trn.trim()}` : formData.contact?.trim() ? `Contact: ${formData.contact.trim()}` : "Party Ledger Account",
      description: formData.address?.trim() || formData.email?.trim() || "Registered party ledger account.",
      address: formData.address?.trim() || "",
      trn: formData.trn?.trim() || "",
      email: formData.email?.trim() || "",
      contact: formData.contact?.trim() || "",
    };

    updateFirm(partyId, updatedFields);
    return { success: true, isFallback: true };
  },

  /**
   * Delete a party master record (RS_PartyMaster/Delete/{id})
   */
  async deleteParty(partyId) {
    const isNumericId = !isNaN(Number(partyId));

    if (isNumericId) {
      try {
        const response = await fetchApi(`Delete/${partyId}`, { method: "POST" });
        if (response && response.ok) {
          const result = await response.json();
          const status = result.Status ?? result.status ?? true;
          if (status) {
            return {
              success: true,
              message: result.Message || result.message || "Party deleted successfully",
              isApi: true,
            };
          }
        }
      } catch (error) {
        console.warn("API delete error, deleting local storage:", error);
      }
    }

    // Fallback to local storage delete
    deleteFirm(partyId);
    return { success: true, isFallback: true };
  },
};
