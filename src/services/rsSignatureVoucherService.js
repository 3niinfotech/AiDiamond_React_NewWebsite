import { getAuthUser } from "../data/firmData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.royalraysbv.com";
const CLEAN_BASE = API_BASE_URL.replace(/\/+$/, "");
const STORAGE_KEY = "royal_rays_signature_vouchers_v1";

const INITIAL_SIGNATURE_DATA = [];

/**
 * Candidate URLs for RS_SignatureVoucher endpoints
 */
const getCandidateUrls = (action) => {
  const baseWithoutApi = CLEAN_BASE.replace(/\/api$/, "");
  return [
    `${baseWithoutApi}/RS_SignatureVoucher/${action}`,
    `${baseWithoutApi}/api/RS_SignatureVoucher/${action}`,
    `${CLEAN_BASE}/RS_SignatureVoucher/${action}`,
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
 * Normalizes item from API or Local Format
 */
export const normalizeVoucherItem = (item) => {
  const voucherId = item.VoucherId ?? item.voucherId ?? item.id;
  const voucherType = item.VoucherType ?? item.voucherType ?? item.entryType ?? "Rough Purchase";
  const pDate = item.PDate ?? item.pDate ?? item.date ?? new Date().toISOString().split("T")[0];
  const invoiceNo = item.InvoiceNo ?? item.invoiceNo ?? "";
  const terms = item.Terms ?? item.terms ?? "";
  const dueDate = item.DueDate ?? item.dueDate ?? "";
  const dueDays = item.DueDays ?? item.dueDays ?? "";
  const partyName = item.PartyName ?? item.partyName ?? "";
  const itemDescription = item.ItemDescription ?? item.itemDescription ?? "";
  const pcs = Number(item.Pcs ?? item.pcs ?? 0);
  const carat = Number(item.Carat ?? item.carat ?? item.carats ?? 0);
  const rate = Number(item.Rate ?? item.rate ?? 0);
  const totalAmount = Number(item.TotalAmount ?? item.totalAmount ?? item.amount ?? 0);
  const aed = Number(item.AED ?? item.aed ?? 0);
  const crDr = item.CrDr ?? item.crDr ?? "DR";
  const paymentMode = item.PaymentMode ?? item.paymentMode ?? "Bank Transfer";
  const remark = item.Remark ?? item.remark ?? "";
  const note = item.Note ?? item.note ?? "";
  const saleInvoiceNo = item.SaleInvoiceNo ?? item.saleInvoiceNo ?? "";
  const saleCarat = Number(item.SaleCarat ?? item.saleCarat ?? 0);
  const balanceCt = Number(item.BalanceCt ?? item.balanceCt ?? 0);
  const broker = item.Broker ?? item.broker ?? "";
  const kpcNo = item.KpcNo ?? item.kpcNo ?? "";

  return {
    id: voucherId ? String(voucherId) : `sig-${Date.now()}`,
    voucherId: voucherId ? Number(voucherId) : null,
    voucherType,
    entryType: voucherType,
    date: pDate,
    pDate,
    invoiceNo,
    terms,
    dueDate,
    dueDays,
    partyName,
    itemDescription,
    pcs,
    carat,
    carats: carat,
    rate,
    totalAmount,
    amount: totalAmount,
    aed,
    crDr,
    paymentMode,
    remark,
    note,
    saleInvoiceNo,
    saleCarat,
    balanceCt,
    broker,
    kpcNo,
  };
};

/**
 * Transforms local state item to API request model
 */
const toApiRequestModel = (item) => {
  return {
    VoucherId: item.voucherId ? Number(item.voucherId) : 0,
    VoucherType: item.voucherType || item.entryType || "Rough Purchase",
    PDate: item.pDate || item.date || new Date().toISOString().split("T")[0],
    InvoiceNo: item.invoiceNo || null,
    Terms: item.terms || null,
    DueDate: item.dueDate || null,
    DueDays: item.dueDays ? String(item.dueDays) : null,
    PartyName: item.partyName || "",
    ItemDescription: item.itemDescription || null,
    Pcs: Number(item.pcs || 0),
    Carat: Number(item.carat || item.carats || 0),
    Rate: Number(item.rate || 0),
    TotalAmount: Number(item.totalAmount || item.amount || 0),
    AED: Number(item.aed || 0),
    CrDr: item.crDr || "DR",
    PaymentMode: item.paymentMode || null,
    Remark: item.remark || null,
    Note: item.note || null,
    SaleInvoiceNo: item.saleInvoiceNo || null,
    SaleCarat: Number(item.saleCarat || 0),
    BalanceCt: Number(item.balanceCt || 0),
    Broker: item.broker || null,
    KpcNo: item.kpcNo || null,
  };
};

/**
 * Service for Signature Vouchers CRUD operations via RS_SignatureVoucher API
 */
export const rsSignatureVoucherService = {
  /**
   * Fetch all vouchers from API
   */
  async getAllVouchers() {
    try {
      const response = await fetchApi("GetAll", { method: "GET" });
      if (response && response.ok) {
        const result = await response.json();
        const status = result.Status ?? result.status ?? true;
        const rawData = result.Data ?? result.data ?? (Array.isArray(result) ? result : null);

        if (status && Array.isArray(rawData)) {
          const mapped = rawData.map(normalizeVoucherItem);
          return { success: true, data: mapped, isApi: true };
        }
      }
    } catch (error) {
      console.warn("RS_SignatureVoucher API unavailable, using local storage fallback:", error);
    }

    // Local Storage Fallback
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const local = JSON.parse(saved);
        return { success: true, data: local.map(normalizeVoucherItem), isApi: false };
      }
    } catch (e) {
      // ignore
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SIGNATURE_DATA));
    return { success: true, data: INITIAL_SIGNATURE_DATA.map(normalizeVoucherItem), isApi: false };
  },

  /**
   * Fetch vouchers filtered by voucherType (e.g., 'Rough Purchase', 'Polish Sale', etc.)
   */
  async getVouchersByType(voucherType) {
    if (!voucherType || voucherType === "All") {
      return this.getAllVouchers();
    }

    try {
      const action = `GetByType?voucherType=${encodeURIComponent(voucherType)}`;
      const response = await fetchApi(action, { method: "GET" });
      if (response && response.ok) {
        const result = await response.json();
        const status = result.Status ?? result.status ?? true;
        const rawData = result.Data ?? result.data ?? (Array.isArray(result) ? result : null);

        if (status && Array.isArray(rawData)) {
          const mapped = rawData.map(normalizeVoucherItem);
          return { success: true, data: mapped, isApi: true };
        }
      }
    } catch (error) {
      console.warn(`RS_SignatureVoucher API GetByType(${voucherType}) unavailable, falling back to local:`, error);
    }

    const all = await this.getAllVouchers();
    const filtered = (all.data || []).filter(
      (v) => (v.voucherType || v.entryType || "").toLowerCase() === voucherType.toLowerCase()
    );
    return { success: true, data: filtered, isApi: all.isApi };
  },

  /**
   * Create new signature voucher record
   */
  async createVoucher(item) {
    const payload = toApiRequestModel(item);
    try {
      const response = await fetchApi("Create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response && response.ok) {
        const result = await response.json();
        const status = result.Status ?? result.status ?? false;
        const message = result.Message ?? result.message ?? "Voucher saved successfully";
        const rawData = result.Data ?? result.data;

        if (status) {
          const created = rawData ? normalizeVoucherItem(rawData) : normalizeVoucherItem({ ...payload, VoucherId: Date.now() });
          
          // Also sync to local storage fallback
          try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const current = saved ? JSON.parse(saved) : INITIAL_SIGNATURE_DATA;
            current.unshift(created);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
          } catch (e) {
            // ignore
          }

          return { success: true, data: created, message, isApi: true };
        } else {
          throw new Error(message);
        }
      }
    } catch (error) {
      console.warn("RS_SignatureVoucher API Create failed, saving locally:", error);
    }

    // Local Storage Fallback Save
    try {
      const newItem = normalizeVoucherItem({ ...item, voucherId: Date.now(), id: `sig-${Date.now()}` });
      const saved = localStorage.getItem(STORAGE_KEY);
      const current = saved ? JSON.parse(saved) : INITIAL_SIGNATURE_DATA;
      current.unshift(newItem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return { success: true, data: newItem, message: "Saved to local storage (Offline)", isApi: false };
    } catch (err) {
      return { success: false, message: err.message || "Failed to create voucher" };
    }
  },

  /**
   * Update signature voucher record
   */
  async updateVoucher(item) {
    const payload = toApiRequestModel(item);
    try {
      const response = await fetchApi("Update", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response && response.ok) {
        const result = await response.json();
        const status = result.Status ?? result.status ?? false;
        const message = result.Message ?? result.message ?? "Voucher updated successfully";
        const rawData = result.Data ?? result.data;

        if (status) {
          const updated = rawData ? normalizeVoucherItem(rawData) : normalizeVoucherItem(payload);
          return { success: true, data: updated, message, isApi: true };
        } else {
          throw new Error(message);
        }
      }
    } catch (error) {
      console.warn("RS_SignatureVoucher API Update failed, updating locally:", error);
    }

    // Local Storage Fallback Update
    try {
      const updatedItem = normalizeVoucherItem(item);
      const saved = localStorage.getItem(STORAGE_KEY);
      let current = saved ? JSON.parse(saved) : INITIAL_SIGNATURE_DATA;
      current = current.map((x) => (String(x.id) === String(updatedItem.id) || String(x.voucherId) === String(updatedItem.voucherId) ? updatedItem : x));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return { success: true, data: updatedItem, message: "Updated in local storage (Offline)", isApi: false };
    } catch (err) {
      return { success: false, message: err.message || "Failed to update voucher" };
    }
  },

  /**
   * Delete voucher record by ID
   */
  async deleteVoucher(id) {
    const numericId = Number(id);
    if (!numericId || isNaN(numericId)) {
      // Local fallback delete only
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        let current = saved ? JSON.parse(saved) : INITIAL_SIGNATURE_DATA;
        current = current.filter((x) => String(x.id) !== String(id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        return { success: true, message: "Deleted from local storage (Offline)", isApi: false };
      } catch (err) {
        return { success: false, message: err.message || "Failed to delete" };
      }
    }

    try {
      const action = `Delete/${numericId}`;
      const response = await fetchApi(action, { method: "POST" });
      if (response && response.ok) {
        const result = await response.json();
        const status = result.Status ?? result.status ?? false;
        const message = result.Message ?? result.message ?? "Voucher deleted successfully";

        if (status) {
          // Also remove from local storage
          try {
            const saved = localStorage.getItem(STORAGE_KEY);
            let current = saved ? JSON.parse(saved) : INITIAL_SIGNATURE_DATA;
            current = current.filter((x) => String(x.id) !== String(id) && Number(x.voucherId) !== numericId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
          } catch (e) {
            // ignore
          }
          return { success: true, message, isApi: true };
        }
      }
    } catch (error) {
      console.warn(`RS_SignatureVoucher API Delete(${id}) failed, deleting locally:`, error);
    }

    // Local Storage Delete Fallback
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      let current = saved ? JSON.parse(saved) : INITIAL_SIGNATURE_DATA;
      current = current.filter((x) => String(x.id) !== String(id) && Number(x.voucherId) !== numericId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return { success: true, message: "Deleted from local storage (Offline)", isApi: false };
    } catch (err) {
      return { success: false, message: err.message || "Failed to delete" };
    }
  },
};
