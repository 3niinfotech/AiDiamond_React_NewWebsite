import axiosInstance, { normalizeApiError } from "./axiosInstance";

/**
 * Converts a standard JavaScript object into a FormData instance.
 * @param {Object} obj
 * @returns {FormData}
 */
export const objectToFormData = (obj) => {
  const formData = new FormData();

  const appendToFormData = (data, parentKey = "") => {
    if (data === null || data === undefined) return;

    if (data instanceof File || data instanceof Blob) {
      formData.append(parentKey, data);
    } else if (Array.isArray(data)) {
      data.forEach((item, index) => {
        appendToFormData(item, `${parentKey}[${index}]`);
      });
    } else if (typeof data === "object" && !(data instanceof Date)) {
      Object.keys(data).forEach((key) => {
        appendToFormData(data[key], parentKey ? `${parentKey}.${key}` : key);
      });
    } else {
      formData.append(parentKey, String(data));
    }
  };

  appendToFormData(obj);
  return formData;
};

/**
 * Generic Reusable Dynamic API Request Helper
 *
 * @param {Object} options
 * @param {'get'|'post'|'put'|'patch'|'delete'} [options.method='get'] - HTTP Verb
 * @param {string} options.endpoint - API route URL (from ENDPOINTS)
 * @param {Object|FormData|null} [options.payload=null] - Request body for POST/PUT/PATCH
 * @param {Object} [options.params={}] - Query parameters for GET/DELETE
 * @param {Object} [options.headers={}] - Custom headers if needed
 * @param {Object} [options.config={}] - Extra axios config (e.g. returnFullResponse, isFormData, onUploadProgress)
 * @returns {Promise<any>}
 */
export const apiRequest = async ({
  method = "get",
  endpoint,
  payload = null,
  params = {},
  headers = {},
  config = {},
}) => {
  if (!endpoint) {
    throw new Error("apiRequest: 'endpoint' parameter is required.");
  }

  const normalizedMethod = String(method).toLowerCase();
  let requestData = payload;
  const requestHeaders = { ...headers };

  // Automatic Multipart / FormData Detection
  if (payload instanceof FormData) {
    requestData = payload;
    // Do NOT set explicit application/json header so axios/browser sets boundary automatically
    delete requestHeaders["Content-Type"];
  } else if (config.isFormData && payload && typeof payload === "object") {
    requestData = objectToFormData(payload);
    delete requestHeaders["Content-Type"];
  }

  try {
    const response = await axiosInstance({
      method: normalizedMethod,
      url: endpoint,
      data: ["get", "delete"].includes(normalizedMethod) ? undefined : requestData,
      params: params,
      headers: requestHeaders,
      ...config,
    });

    return response;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export default apiRequest;
