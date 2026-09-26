const DEFAULT_BOOK_TYPES = [
  { id: "1", typeId: 1, name: "Bank", shortCode: "BNK", description: "Bank Account Transfer / Wire", isActive: true },
  { id: "2", typeId: 2, name: "Cash", shortCode: "CSH", description: "Cash Payment or Receipt", isActive: true },
  { id: "3", typeId: 3, name: "Angadia", shortCode: "ANG", description: "Angadia Courier Courier Transfer", isActive: true },
  { id: "4", typeId: 4, name: "Dubai Wire", shortCode: "DXB", description: "Dubai International Wire Transfer", isActive: true },
  { id: "5", typeId: 5, name: "Cheque", shortCode: "CHQ", description: "Bank Cheque Clearing", isActive: true },
];

const STORAGE_KEY = "royal_rays_book_types_v1";

const getLocalBookTypes = () => {
  if (typeof window === "undefined") return DEFAULT_BOOK_TYPES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading local book types:", err);
  }
  return DEFAULT_BOOK_TYPES;
};

const saveLocalBookTypes = (types) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(types));
  } catch (err) {
    console.error("Error saving local book types:", err);
  }
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.royalraysbv.com";
const CLEAN_BASE = API_BASE_URL.replace(/\/+$/, "");

/**
 * Candidate URLs for RS_BookTypeMaster endpoints
 */
const getCandidateUrls = (action) => {
  const baseWithoutApi = CLEAN_BASE.replace(/\/api$/, "");
  return [
    `${baseWithoutApi}/RS_BookTypeMaster/${action}`,
    `${baseWithoutApi}/api/RS_BookTypeMaster/${action}`,
    `${CLEAN_BASE}/RS_BookTypeMaster/${action}`,
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
 * Normalizes Book Type object from API or Local format
 */
const normalizeBookTypeItem = (item) => {
  const typeId = item.TypeId ?? item.typeId ?? item.id;
  const name = item.TypeName ?? item.typeName ?? item.name ?? "";
  const fallbackCode = name ? name.slice(0, 3).toUpperCase() : "TYP";
  const shortCode = item.ShortCode ?? item.shortCode ?? fallbackCode;
  const description = item.Description ?? item.description ?? "";
  const isActive = item.IsActive ?? item.isActive ?? true;

  return {
    id: typeId ? String(typeId) : `type-${Date.now()}`,
    typeId: typeId,
    name: name,
    shortCode: shortCode,
    description: description,
    isActive: Boolean(isActive),
  };
};

/**
 * Service for Book Type Master CRUD operations via RS_BookTypeMaster API
 */
export const rsBookTypeMasterService = {
  /**
   * Fetch all book type master records from API (RS_BookTypeMaster/GetAll)
   */
  async getAllBookTypes() {
    try {
      const response = await fetchApi("GetAll", { method: "GET" });
      if (response && response.ok) {
        const result = await response.json();
        const status = result.Status ?? result.status ?? true;
        const rawData = result.Data ?? result.data ?? (Array.isArray(result) ? result : null);

        if (status && Array.isArray(rawData)) {
          const mappedTypes = rawData.map(normalizeBookTypeItem);
          return { success: true, data: mappedTypes, isApi: true };
        }
      }
    } catch (error) {
      console.warn("RS_BookTypeMaster API unavailable, using local storage fallback:", error);
    }

    // Fallback to local storage
    return { success: true, data: getLocalBookTypes().map(normalizeBookTypeItem), isApi: false };
  },

  /**
   * Get single book type by ID
   */
  async getBookTypeById(typeId) {
    try {
      const response = await fetchApi(`GetById/${typeId}`, { method: "GET" });
      if (response && response.ok) {
        const result = await response.json();
        const rawData = result.Data ?? result.data ?? result;
        if (rawData) {
          return {
            success: true,
            data: normalizeBookTypeItem(rawData),
          };
        }
      }
    } catch (error) {
      console.warn("Error fetching book type by ID from API:", error);
    }

    const localList = getLocalBookTypes();
    const found = localList.find((t) => String(t.id) === String(typeId) || String(t.typeId) === String(typeId));
    return { success: Boolean(found), data: found ? normalizeBookTypeItem(found) : null };
  },

  /**
   * Create a new book type master record (RS_BookTypeMaster/Create)
   */
  async createBookType(formData) {
    const cleanName = formData.name.trim();
    const shortCode = (formData.shortCode || cleanName.slice(0, 3)).toUpperCase();

    const payload = {
      TypeName: cleanName,
      ShortCode: shortCode,
      Description: formData.description ? formData.description.trim() : "",
      IsActive: formData.isActive !== undefined ? Boolean(formData.isActive) : true,
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
            data: rawData ? normalizeBookTypeItem(rawData) : null,
            message: result.Message || result.message || "Book type created successfully",
            isApi: true,
          };
        }
      }
    } catch (error) {
      console.warn("API save error for BookType, persisting to local storage:", error);
    }

    // Fallback to local storage creation
    const currentList = getLocalBookTypes();
    const newId = `bt-${Date.now()}`;
    const newType = {
      id: newId,
      typeId: newId,
      name: cleanName,
      shortCode: shortCode,
      description: formData.description?.trim() || "",
      isActive: formData.isActive !== undefined ? Boolean(formData.isActive) : true,
    };

    const updatedList = [...currentList, newType];
    saveLocalBookTypes(updatedList);
    return { success: true, data: newType, isFallback: true, message: "Book type created successfully (Local)" };
  },

  /**
   * Update an existing book type master record (RS_BookTypeMaster/Update)
   */
  async updateBookType(typeId, formData) {
    const isNumericId = !isNaN(Number(typeId));
    const cleanName = formData.name.trim();
    const shortCode = (formData.shortCode || cleanName.slice(0, 3)).toUpperCase();

    if (isNumericId) {
      const payload = {
        TypeId: Number(typeId),
        TypeName: cleanName,
        ShortCode: shortCode,
        Description: formData.description ? formData.description.trim() : "",
        IsActive: formData.isActive !== undefined ? Boolean(formData.isActive) : true,
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
              data: rawData ? normalizeBookTypeItem(rawData) : null,
              message: result.Message || result.message || "Book type updated successfully",
              isApi: true,
            };
          }
        }
      } catch (error) {
        console.warn("API update error for BookType, updating local storage:", error);
      }
    }

    // Fallback to local storage update
    const currentList = getLocalBookTypes();
    const updatedList = currentList.map((item) => {
      if (String(item.id) === String(typeId) || String(item.typeId) === String(typeId)) {
        return {
          ...item,
          name: cleanName,
          shortCode: shortCode,
          description: formData.description?.trim() || "",
          isActive: formData.isActive !== undefined ? Boolean(formData.isActive) : true,
        };
      }
      return item;
    });

    saveLocalBookTypes(updatedList);
    return { success: true, isFallback: true, message: "Book type updated successfully (Local)" };
  },

  /**
   * Delete a book type master record (RS_BookTypeMaster/Delete/{id})
   */
  async deleteBookType(typeId) {
    const isNumericId = !isNaN(Number(typeId));

    if (isNumericId) {
      try {
        const response = await fetchApi(`Delete/${typeId}`, { method: "POST" });
        if (response && response.ok) {
          const result = await response.json();
          const status = result.Status ?? result.status ?? true;
          if (status) {
            return {
              success: true,
              message: result.Message || result.message || "Book type deleted successfully",
              isApi: true,
            };
          }
        }
      } catch (error) {
        console.warn("API delete error for BookType, updating local storage:", error);
      }
    }

    // Fallback to local storage delete
    const currentList = getLocalBookTypes();
    const filteredList = currentList.filter(
      (item) => String(item.id) !== String(typeId) && String(item.typeId) !== String(typeId)
    );
    saveLocalBookTypes(filteredList);
    return { success: true, isFallback: true, message: "Book type deleted successfully (Local)" };
  },
};
