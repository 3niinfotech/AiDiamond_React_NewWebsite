import { getFirmRecords, saveFirmRecords } from "../data/firmData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.royalraysbv.com";
const CLEAN_BASE = API_BASE_URL.replace(/\/+$/, "");

/**
 * Candidate URLs for RS_FirmLedgerEntry endpoints
 */
const getCandidateUrls = (action) => {
  const baseWithoutApi = CLEAN_BASE.replace(/\/api$/, "");
  return [
    `${baseWithoutApi}/RS_FirmLedgerEntry/${action}`,
    `${baseWithoutApi}/api/RS_FirmLedgerEntry/${action}`,
    `${CLEAN_BASE}/RS_FirmLedgerEntry/${action}`,
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
 * Auto-detect and resolve FirmId and FirmCode for standard and custom firm books
 */
export const resolveFirmInfo = (firmParam) => {
  let firmId = null;
  let firmCode = "";
  let firmName = "";

  if (typeof firmParam === "object" && firmParam !== null) {
    firmId = firmParam.firmId || firmParam.id;
    firmCode = firmParam.shortCode || firmParam.id || "";
    firmName = firmParam.name || firmParam.firmName || "";
  } else {
    firmId = firmParam;
    firmCode = String(firmParam || "");
  }

  const strId = String(firmId || "").toLowerCase();
  const strCode = String(firmCode || "").toLowerCase();
  const strName = String(firmName || "").toLowerCase();

  let numericFirmId = !isNaN(Number(firmId)) ? Number(firmId) : null;
  let codeStr = firmCode;

  if (!numericFirmId) {
    if (strId.includes("ms-book") || strCode === "msb" || strName.includes("ms")) {
      numericFirmId = 1;
      codeStr = "MSB";
    } else if (strId.includes("sharda-book") || strCode === "sdb" || strName.includes("sharda")) {
      numericFirmId = 2;
      codeStr = "SDB";
    } else if (strId.includes("darsh-book") || strCode === "drb" || strName.includes("darsh")) {
      numericFirmId = 3;
      codeStr = "DRB";
    } else if (strId.includes("bajrang-book") || strCode === "bjb" || strName.includes("bajrang")) {
      numericFirmId = 4;
      codeStr = "BJB";
    } else if (strId.includes("signature-book") || strCode === "sgb" || strName.includes("signature") || strId === "6" || strCode === "6") {
      numericFirmId = 6;
      codeStr = "SGB";
    }
  }

  return {
    firmId: numericFirmId,
    firmCode: codeStr || String(firmId || ""),
    rawId: typeof firmParam === "object" ? firmParam?.id : firmParam,
  };
};

/**
 * Normalizes Firm Ledger Entry item from API or Local format
 */
const normalizeEntryItem = (item) => {
  const entryId = item.EntryId ?? item.entryId ?? item.id;
  const firmId = item.FirmId ?? item.firmId;
  const firmCode = item.FirmCode ?? item.firmCode ?? "";
  const date = item.EntryDate ?? item.entryDate ?? item.date ?? new Date().toISOString().split("T")[0];
  const description = item.Description ?? item.description ?? "";
  const type = item.EntryType ?? item.entryType ?? item.type ?? "Bank Transfer";
  const aed = Number(item.AED ?? item.aed ?? 0);
  const crDr = item.CrDr ?? item.crDr ?? "CR";
  const amount = Number(item.Amount ?? item.amount ?? (crDr === "CR" ? item.credit : item.debit) ?? 0);
  const remark = item.Remark ?? item.remark ?? "";

  return {
    id: entryId ? String(entryId) : `rec-${Date.now()}`,
    entryId: entryId,
    firmId: firmId,
    firmCode: firmCode,
    date: date,
    description: description,
    type: type,
    aed: aed,
    crDr: crDr,
    amount: amount,
    credit: crDr === "CR" ? amount : 0,
    debit: crDr === "DR" ? amount : 0,
    remark: remark,
  };
};

/**
 * Service for Firm Ledger Entry CRUD operations via RS_FirmLedgerEntry API
 */
export const rsFirmLedgerEntryService = {
  /**
   * Fetch all ledger entries across all firm books (RS_FirmLedgerEntry/GetAll)
   */
  async getAllEntries() {
    try {
      const response = await fetchApi("GetAll", { method: "GET" });
      if (response && response.ok) {
        const result = await response.json();
        const status = result.Status ?? result.status ?? true;
        const rawData = result.Data ?? result.data ?? (Array.isArray(result) ? result : null);

        if (status && Array.isArray(rawData)) {
          return { success: true, data: rawData.map(normalizeEntryItem), isApi: true };
        }
      }
    } catch (error) {
      console.warn("Error fetching all ledger entries from API:", error);
    }
    return { success: false, data: [] };
  },

  /**
   * Fetch all ledger entries for a specific firm (RS_FirmLedgerEntry/GetByFirmId)
   */
  async getEntriesByFirm(firmParam) {
    const { firmId, firmCode, rawId } = resolveFirmInfo(firmParam);

    const queryParts = [];
    if (firmId) queryParts.push(`firmId=${firmId}`);
    if (firmCode) queryParts.push(`firmCode=${encodeURIComponent(firmCode)}`);
    const paramQuery = queryParts.join("&");

    try {
      const response = await fetchApi(`GetByFirmId?${paramQuery}`, { method: "GET" });
      if (response && response.ok) {
        const result = await response.json();
        const status = result.Status ?? result.status ?? true;
        const rawData = result.Data ?? result.data ?? (Array.isArray(result) ? result : null);

        if (status && Array.isArray(rawData)) {
          const mappedEntries = rawData
            .map(normalizeEntryItem)
            .filter((item) => {
              if (firmId && Number(item.firmId) === Number(firmId)) return true;
              if (firmCode && String(item.firmCode).toUpperCase() === String(firmCode).toUpperCase()) return true;
              if (rawId && String(item.firmCode).toLowerCase() === String(rawId).toLowerCase()) return true;
              return false;
            });

          return { success: true, data: mappedEntries, isApi: true };
        }
      }
    } catch (error) {
      console.warn("RS_FirmLedgerEntry API unavailable, using local ledger fallback:", error);
    }

    // Fallback to local firm ledger records
    const localRecords = getFirmRecords(rawId || firmCode || firmId);
    return { success: true, data: localRecords.map(normalizeEntryItem), isApi: false };
  },

  /**
   * Get single ledger entry by ID (RS_FirmLedgerEntry/GetById/{id})
   */
  async getEntryById(entryId) {
    try {
      const response = await fetchApi(`GetById/${entryId}`, { method: "GET" });
      if (response && response.ok) {
        const result = await response.json();
        const rawData = result.Data ?? result.data ?? result;
        if (rawData) {
          return {
            success: true,
            data: normalizeEntryItem(rawData),
          };
        }
      }
    } catch (error) {
      console.warn("Error fetching ledger entry by ID:", error);
    }
    return { success: false, data: null };
  },

  /**
   * Create a new ledger entry (RS_FirmLedgerEntry/Create)
   */
  async createEntry(firmParam, formData) {
    const { firmId, firmCode, rawId } = resolveFirmInfo(firmParam);

    const payload = {
      FirmId: firmId,
      FirmCode: firmCode || String(rawId || ""),
      EntryDate: formData.date || new Date().toISOString().split("T")[0],
      Description: formData.description ? formData.description.trim() : "",
      EntryType: formData.type || "Bank",
      AED: Number(formData.aed || 0),
      CrDr: formData.crDr || "CR",
      Amount: Number(formData.amount || 0),
      Remark: formData.remark ? formData.remark.trim() : "",
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
            data: rawData ? normalizeEntryItem(rawData) : null,
            message: result.Message || result.message || "Entry created successfully",
            isApi: true,
          };
        }
      }
    } catch (error) {
      console.warn("API save error, persisting to local ledger storage:", error);
    }

    // Fallback to local storage creation
    const currentLocal = getFirmRecords(rawId || firmCode || firmId);
    const newLocalItem = {
      id: `rec-${Date.now()}`,
      date: formData.date || new Date().toISOString().split("T")[0],
      description: formData.description.trim(),
      type: formData.type || "Bank",
      aed: Number(formData.aed || 0),
      crDr: formData.crDr || "CR",
      amount: Number(formData.amount || 0),
      credit: formData.crDr === "CR" ? Number(formData.amount || 0) : 0,
      debit: formData.crDr === "DR" ? Number(formData.amount || 0) : 0,
      remark: formData.remark ? formData.remark.trim() : "",
    };

    const updatedList = [newLocalItem, ...currentLocal];
    saveFirmRecords(rawId || firmCode || firmId, updatedList);
    return { success: true, data: newLocalItem, isFallback: true };
  },

  /**
   * Update an existing ledger entry (RS_FirmLedgerEntry/Update)
   */
  async updateEntry(entryId, firmParam, formData) {
    const { firmId, firmCode, rawId } = resolveFirmInfo(firmParam);
    const isNumericEntryId = !isNaN(Number(entryId));

    if (isNumericEntryId) {
      const payload = {
        EntryId: Number(entryId),
        FirmId: firmId,
        FirmCode: firmCode || String(rawId || ""),
        EntryDate: formData.date || new Date().toISOString().split("T")[0],
        Description: formData.description ? formData.description.trim() : "",
        EntryType: formData.type || "Bank",
        AED: Number(formData.aed || 0),
        CrDr: formData.crDr || "CR",
        Amount: Number(formData.amount || 0),
        Remark: formData.remark ? formData.remark.trim() : "",
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
              data: rawData ? normalizeEntryItem(rawData) : null,
              message: result.Message || result.message || "Entry updated successfully",
              isApi: true,
            };
          }
        }
      } catch (error) {
        console.warn("API update error, updating local ledger storage:", error);
      }
    }

    // Fallback to local storage update
    const targetKey = rawId || firmCode || firmId;
    const currentLocal = getFirmRecords(targetKey);
    const updatedList = currentLocal.map((item) => {
      if (item.id === entryId || String(item.entryId) === String(entryId)) {
        return {
          ...item,
          date: formData.date,
          description: formData.description.trim(),
          type: formData.type,
          aed: Number(formData.aed || 0),
          crDr: formData.crDr,
          amount: Number(formData.amount || 0),
          credit: formData.crDr === "CR" ? Number(formData.amount || 0) : 0,
          debit: formData.crDr === "DR" ? Number(formData.amount || 0) : 0,
          remark: formData.remark ? formData.remark.trim() : "",
        };
      }
      return item;
    });

    saveFirmRecords(targetKey, updatedList);
    return { success: true, isFallback: true };
  },

  /**
   * Delete a ledger entry (RS_FirmLedgerEntry/Delete/{id})
   */
  async deleteEntry(entryId, firmParam) {
    const { firmId, firmCode, rawId } = resolveFirmInfo(firmParam);
    const isNumericEntryId = !isNaN(Number(entryId));

    if (isNumericEntryId) {
      try {
        const response = await fetchApi(`Delete/${entryId}`, { method: "POST" });
        if (response && response.ok) {
          const result = await response.json();
          const status = result.Status ?? result.status ?? true;
          if (status) {
            return {
              success: true,
              message: result.Message || result.message || "Entry deleted successfully",
              isApi: true,
            };
          }
        }
      } catch (error) {
        console.warn("API delete error, deleting local ledger storage:", error);
      }
    }

    // Fallback to local storage delete
    const targetKey = rawId || firmCode || firmId;
    const currentLocal = getFirmRecords(targetKey);
    const filteredList = currentLocal.filter((item) => item.id !== entryId && String(item.entryId) !== String(entryId));
    saveFirmRecords(targetKey, filteredList);
    return { success: true, isFallback: true };
  },
};
