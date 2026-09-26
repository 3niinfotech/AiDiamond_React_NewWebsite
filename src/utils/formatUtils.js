/**
 * Utility functions for date formatting, numbers, currency, and validation
 */

/**
 * Formats any date string (YYYY-MM-DD, ISO string, etc.) into DD-MM-YYYY format.
 * Example: '2026-09-22' -> '22-09-2026'
 */
export const formatDateDDMMYYYY = (dateVal) => {
  if (!dateVal) return "-";
  try {
    const str = String(dateVal).trim();
    if (!str) return "-";

    // Handle YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
    const match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (match) {
      const year = match[1];
      const month = match[2].padStart(2, "0");
      const day = match[3].padStart(2, "0");
      return `${day}-${month}-${year}`;
    }

    // Handle DD-MM-YYYY or DD/MM/YYYY
    const matchDD = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (matchDD) {
      const day = matchDD[1].padStart(2, "0");
      const month = matchDD[2].padStart(2, "0");
      const year = matchDD[3];
      return `${day}-${month}-${year}`;
    }

    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
  } catch (e) {
    // fallback
  }
  return String(dateVal);
};

/**
 * Returns current date in YYYY-MM-DD format for HTML date inputs
 */
export const getTodayYYYYMMDD = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Formats currency values cleanly
 */
export const formatNumberWithCommas = (val) => {
  const num = Number(val);
  if (isNaN(num)) return "0";
  return num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};
