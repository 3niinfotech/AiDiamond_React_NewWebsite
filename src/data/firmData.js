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

export const FIRMS_CONFIG = [
  {
    id: "ms-book",
    name: "MS BOOK",
    shortCode: "MSB",
    tagline: "Rough & Industrial Diamonds Ledger",
    description: "Primary book for rough stone procurement, DTC sight allocations, sorting lots, and industrial parcel accounts.",
    badge: "Rough Division",
    founded: "1994",
    accentColor: "#D4A853",
    bgGradient: "linear-gradient(135deg, rgba(212, 168, 83, 0.15) 0%, rgba(10, 10, 12, 0.95) 100%)",
    icon: "FaGem",
  },
  {
    id: "sharda-book",
    name: "SHARDA BOOK",
    shortCode: "SDB",
    tagline: "Polished Diamonds & Solitaires Ledger",
    description: "Specialized ledger for GIA & IGI certified triple-excellent solitaires, fancy shapes, and domestic wholesale accounts.",
    badge: "Solitaires & Polished",
    founded: "1998",
    accentColor: "#E2B866",
    bgGradient: "linear-gradient(135deg, rgba(226, 184, 102, 0.15) 0%, rgba(10, 10, 12, 0.95) 100%)",
    icon: "FaDiamond",
  },
  {
    id: "darsh-book",
    name: "DARSH BOOK",
    shortCode: "DRB",
    tagline: "Fine Jewelry & Bullion Book",
    description: "Exclusive book for diamond-studded fine jewelry, 18K/24K gold bullion consignments, and bespoke retailer orders.",
    badge: "Jewelry & Bullion",
    founded: "2006",
    accentColor: "#C99738",
    bgGradient: "linear-gradient(135deg, rgba(201, 151, 56, 0.15) 0%, rgba(10, 10, 12, 0.95) 100%)",
    icon: "FaRing",
  },
  {
    id: "bajrang-book",
    name: "BAJRANG BOOK",
    shortCode: "BJB",
    tagline: "Global Export & Wholesale Ledger",
    description: "International trading book for Antwerp, Dubai, Hong Kong, and New York export consignments and wire settlements.",
    badge: "Export Division",
    founded: "2011",
    accentColor: "#E8C574",
    bgGradient: "linear-gradient(135deg, rgba(232, 197, 116, 0.15) 0%, rgba(10, 10, 12, 0.95) 100%)",
    icon: "FaGlobe",
  },
  {
    id: "signature-book",
    name: "SIGNATURE BOOK",
    shortCode: "SGB",
    tagline: "Signature Multi-Currency & Bank Accounts Ledger",
    description: "Multi-currency bank & cash accounts ledger for NBF, IndusInd, and cash balances in USD & AED.",
    badge: "Signature Division",
    founded: "2024",
    accentColor: "#B45309",
    bgGradient: "linear-gradient(135deg, rgba(180, 83, 9, 0.15) 0%, rgba(10, 10, 12, 0.95) 100%)",
    icon: "FaBookOpen",
    isSignatureBook: true,
  },
];

export const INITIAL_LEDGER_RECORDS = {
  "ms-book": [
    {
      id: "rec-ms-001",
      date: "2026-09-08",
      description: "Kiran Gems Pvt Ltd - Rough Sawable Lot #RS-8821 (128.50 Cts)",
      type: "Bank Transfer",
      aed: 236800,
      crDr: "CR",
      amount: 5397000,
      credit: 5397000,
      debit: 0,
      remark: "Inv #RR-9912 Surat Delivery against Bourse Memo",
    },
    {
      id: "rec-ms-002",
      date: "2026-09-07",
      description: "Alrosa Trading Co - Run-of-Mine Rough 2-4ct Parcels",
      type: "Dubai Wire",
      aed: 574000,
      crDr: "DR",
      amount: 13090000,
      credit: 0,
      debit: 13090000,
      remark: "Direct Sight Allocation Russian Goods Customs Cleared",
    },
    {
      id: "rec-ms-003",
      date: "2026-09-05",
      description: "Dharmanandan Diamonds - Makeable Cleavage 1.5ct+ Lots",
      type: "Angadia",
      aed: 159500,
      crDr: "CR",
      amount: 3635800,
      credit: 3635800,
      debit: 0,
      remark: "Lot #MK-441 Delivered with Assay Certificate",
    },
    {
      id: "rec-ms-004",
      date: "2026-09-04",
      description: "Venus Jewel - Account Settlement Part-1",
      type: "Bank Transfer",
      aed: 109600,
      crDr: "CR",
      amount: 2500000,
      credit: 2500000,
      debit: 0,
      remark: "Chq #994812 Cleared HDFC Bank Fort Branch",
    },
    {
      id: "rec-ms-005",
      date: "2026-09-03",
      description: "Hari Krishna Exports - Industrial Flats & Macles (215 Cts)",
      type: "Cash",
      aed: 0,
      crDr: "DR",
      amount: 3547500,
      credit: 0,
      debit: 3547500,
      remark: "Bourse delivery receipt #HK-201",
    },
    {
      id: "rec-ms-006",
      date: "2026-09-01",
      description: "De Beers Global Sightholder - Boxes 3ct-10ct Fancy Rough",
      type: "Dubai Wire",
      aed: 380000,
      crDr: "DR",
      amount: 8659200,
      credit: 0,
      debit: 8659200,
      remark: "Kimberly Process Certificate #KP-88291 Verified",
    },
    {
      id: "rec-ms-007",
      date: "2026-08-28",
      description: "SRK Diamonds - Rough Octahedron Pure White (62.80 Cts)",
      type: "Bank Transfer",
      aed: 170700,
      crDr: "CR",
      amount: 3893600,
      credit: 3893600,
      debit: 0,
      remark: "Invoice RR/MSB/2026/049 • GIA pre-scanned",
    },
  ],

  "sharda-book": [
    {
      id: "rec-sd-001",
      date: "2026-09-08",
      description: "Rosy Blue NV - Solitaire 3.02ct D-IF 3EX None GIA",
      type: "Dubai Wire",
      aed: 245000,
      crDr: "CR",
      amount: 5587000,
      credit: 5587000,
      debit: 0,
      remark: "GIA Cert #2219488190 Inscribed Sealed Packet",
    },
    {
      id: "rec-sd-002",
      date: "2026-09-06",
      description: "Blue Star Diamonds - Parcel Polished 1.00-1.50ct VVS2 F",
      type: "Bank Transfer",
      aed: 582000,
      crDr: "CR",
      amount: 13268000,
      credit: 13268000,
      debit: 0,
      remark: "Lot #BS-559 with Laser Inscription Verified",
    },
    {
      id: "rec-sd-003",
      date: "2026-09-05",
      description: "KP Sanghvi & Sons - Fancy Vivid Yellow 2.15ct Radiant",
      type: "Angadia",
      aed: 86700,
      crDr: "DR",
      amount: 1978000,
      credit: 0,
      debit: 1978000,
      remark: "IGI Report #44910283 Natural Color Origin",
    },
    {
      id: "rec-sd-004",
      date: "2026-09-02",
      description: "Ankit Gems - Quarterly Settlement Advance",
      type: "Bank Transfer",
      aed: 184000,
      crDr: "CR",
      amount: 4200000,
      credit: 4200000,
      debit: 0,
      remark: "UTR #SBIN002918481 Ref. Sharda Solitaires Book",
    },
    {
      id: "rec-sd-005",
      date: "2026-08-30",
      description: "Tanishq Titan Co - Stars & Melees VVS-EF Calibrated",
      type: "Bank Transfer",
      aed: 302000,
      crDr: "CR",
      amount: 6903000,
      credit: 6903000,
      debit: 0,
      remark: "Calibrated 1.2mm - 2.4mm precision lot for bridal suite",
    },
    {
      id: "rec-sd-006",
      date: "2026-08-25",
      description: "GIA India Laboratory - Grading & Certification Charges",
      type: "Bank Transfer",
      aed: 0,
      crDr: "DR",
      amount: 345000,
      credit: 0,
      debit: 345000,
      remark: "Certification of 48 Solitaire Stones Batch #GIA-SUR-98",
    },
  ],

  "darsh-book": [
    {
      id: "rec-dr-001",
      date: "2026-09-08",
      description: "Malabar Gold & Diamonds - Royal Heritage Solitaire Necklace 18K",
      type: "Bank Transfer",
      aed: 219000,
      crDr: "CR",
      amount: 5002500,
      credit: 5002500,
      debit: 0,
      remark: "Item #DR-JW-901 Hallmarked 750 with Diamond Certs",
    },
    {
      id: "rec-dr-002",
      date: "2026-09-06",
      description: "MMTC-PAMP India Ltd - Fine Gold Bullion 999.9 Bars (2x1000g)",
      type: "Bank Transfer",
      aed: 653000,
      crDr: "DR",
      amount: 14900000,
      credit: 0,
      debit: 14900000,
      remark: "LBMA Certified 2x1000g Cast Gold Bars Serial #A8812, A8813",
    },
    {
      id: "rec-dr-003",
      date: "2026-09-04",
      description: "Kalyan Jewellers - Diamond Tennis Bracelets 5ctw EF-VVS (12 pcs)",
      type: "Angadia",
      aed: 302000,
      crDr: "CR",
      amount: 6900000,
      credit: 6900000,
      debit: 0,
      remark: "Manufactured at Royal Rays Atelier Studio #B12",
    },
    {
      id: "rec-dr-004",
      date: "2026-08-31",
      description: "Joyalukkas International - Emerald Cut Cocktail Rings Set",
      type: "Dubai Wire",
      aed: 129000,
      crDr: "CR",
      amount: 2948400,
      credit: 2948400,
      debit: 0,
      remark: "Custom designer collection for Dubai Expo preview",
    },
    {
      id: "rec-dr-005",
      date: "2026-08-27",
      description: "Emerald Casting Works - Precision CAD/CAM & Casting Jobwork",
      type: "Bank Transfer",
      aed: 0,
      crDr: "DR",
      amount: 480000,
      credit: 0,
      debit: 480000,
      remark: "Job work invoice #ECW-2026-441 for bridal suites",
    },
  ],

  "bajrang-book": [
    {
      id: "rec-bj-001",
      date: "2026-09-08",
      description: "Antwerp Diamond Bourse Consignment - Triple-Ex Cut 2ct-5ct",
      type: "Dubai Wire",
      aed: 1592000,
      crDr: "CR",
      amount: 36309000,
      credit: 36309000,
      debit: 0,
      remark: "Airway Bill #EK-992182 Customs Cleared Mumbai Cargo Bourse",
    },
    {
      id: "rec-bj-002",
      date: "2026-09-05",
      description: "DMCC Dubai Trading LLC - Princess & Oval Cut Parcel 1-2.5ct",
      type: "Dubai Wire",
      aed: 750000,
      crDr: "CR",
      amount: 17107200,
      credit: 17107200,
      debit: 0,
      remark: "Swift Ref #DXB-RR-88741 Delivered to Almas Tower",
    },
    {
      id: "rec-bj-003",
      date: "2026-09-03",
      description: "Hong Kong Jewellery & Gem Guild - Fancy Color Rough Parcels",
      type: "Dubai Wire",
      aed: 708000,
      crDr: "DR",
      amount: 16151000,
      credit: 0,
      debit: 16151000,
      remark: "Import Entry B/E #884121 Special Exhibition Consignment",
    },
    {
      id: "rec-bj-004",
      date: "2026-08-29",
      description: "New York Diamond Dealers Club - Consignment Clearance Tranche 2",
      type: "Bank Transfer",
      aed: 548000,
      crDr: "CR",
      amount: 12500000,
      credit: 12500000,
      debit: 0,
      remark: "Wire through JP Morgan Chase NY for Summer Exhibition sales",
    },
    {
      id: "rec-bj-005",
      date: "2026-08-22",
      description: "Brink's Global Services - Armored International Vault Transit",
      type: "Bank Transfer",
      aed: 27400,
      crDr: "DR",
      amount: 625000,
      credit: 0,
      debit: 625000,
      remark: "Armored door-to-door vault transit Antwerp to Surat Bourse",
    },
  ],
  "signature-book": [
    {
      id: "rec-sig-001",
      date: "2026-09-08",
      description: "Direct Wire Inward - Dubai Client Settlement",
      bankType: "NBF - USD",
      type: "NBF - USD",
      cashUsd: 0,
      cashAed: 0,
      aedBank: 0,
      usdBank: 125000,
      amount: 125000,
      credit: 125000,
      debit: 0,
      crDr: "CR",
      remark: "Ref #NBF-9921 Received from Dubai Diamond Exchange",
    },
    {
      id: "rec-sig-002",
      date: "2026-09-07",
      description: "Local Office Expense & Vault Charges",
      bankType: "CASH - AED",
      type: "CASH - AED",
      cashUsd: 0,
      cashAed: 15400,
      aedBank: 0,
      usdBank: 0,
      amount: 15400,
      credit: 0,
      debit: 15400,
      crDr: "DR",
      remark: "DMCC Almas Tower Vault Settlement",
    },
    {
      id: "rec-sig-003",
      date: "2026-09-05",
      description: "IndusInd Bank TT Outward - Rough Procurement",
      bankType: "IndusInd",
      type: "IndusInd",
      cashUsd: 0,
      cashAed: 0,
      aedBank: 0,
      usdBank: 84500,
      amount: 84500,
      credit: 0,
      debit: 84500,
      crDr: "DR",
      remark: "Sight Allocation TT Transfer Ref #IN-4428",
    },
    {
      id: "rec-sig-004",
      date: "2026-09-04",
      description: "Cash Receipt - Local Parcel Sale",
      bankType: "CASH - USD",
      type: "CASH - USD",
      cashUsd: 45000,
      cashAed: 0,
      aedBank: 0,
      usdBank: 0,
      amount: 45000,
      credit: 45000,
      debit: 0,
      crDr: "CR",
      remark: "Cash payment received against voucher #V-102",
    },
    {
      id: "rec-sig-005",
      date: "2026-09-02",
      description: "NBF Corporate Account AED Credit",
      bankType: "NBF - AED",
      type: "NBF - AED",
      cashUsd: 0,
      cashAed: 0,
      aedBank: 367250,
      usdBank: 0,
      amount: 367250,
      credit: 367250,
      debit: 0,
      crDr: "CR",
      remark: "AED inward wire from Emirates NBD",
    },
  ],
};

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
  const all = getAllFirms();
  return all.find((f) => f.id === firmId) || all[0];
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
    const data = localStorage.getItem(AUTH_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (parsed && parsed.username === "RSDXB" && parsed.token) {
      return parsed;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = () => {
  return getAuthUser() !== null;
};

export const setAuthUser = (userObj) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(userObj));
};

export const clearAuthUser = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
};
