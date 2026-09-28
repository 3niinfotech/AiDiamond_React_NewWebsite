import { formatDateDDMMYYYY } from "../../utils/formatUtils";
import { Pagination } from "../../components/Pagination";
import { rsPartyMasterService } from "../../services/rsPartyMasterService";
import { rsSignatureVoucherService } from "../../services/rsSignatureVoucherService";
import { SearchablePartySelect } from "../../components/SearchablePartySelect";
import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaSignOutAlt,
  FaFileExcel,
  FaFileCsv,
  FaTrash,
  FaEye,
  FaGem,
  FaEdit,
} from "react-icons/fa";
import {
  getAllFirms,
  formatCurrency,
  getAuthUser,
} from "../../data/firmData";
import { useAuth } from "../../hooks/useAuth";
import { exportToCSV, exportToExcel } from "../../utils/excelExport";
import { VOUCHER_CONFIGS, STORAGE_KEY } from "./voucherConstants";

const config = VOUCHER_CONFIGS["rough-purchase"];

const RoughPurchase = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const currentUser = authUser || getAuthUser();
  const [allAvailableParties, setAllAvailableParties] = useState([]);

  // Master vouchers state
  const [allVouchers, setAllVouchers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadParties = async () => {
    try {
      const res = await rsPartyMasterService.getAllParties();
      if (res && res.success && res.data) {
        setAllAvailableParties(res.data);
      }
    } catch (err) {
      console.error("Failed to load parties", err);
    }
  };

  const loadVouchers = async () => {
    loadParties();
    setIsLoading(true);
    try {
      const typeName = config?.name || "Rough Purchase";
      const res = await rsSignatureVoucherService.getVouchersByType(typeName);
      if (res && res.success) {
        setAllVouchers(res.data);
        setIsApiConnected(res.isApi);
      }
    } catch (err) {
      console.error("Failed to load vouchers", err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadVouchers();
  }, []);

  // Filter vouchers for Rough Purchase
  const typeVouchers = useMemo(() => {
    return allVouchers.filter((v) => v.entryType === config.name);
  }, [allVouchers]);

  const getInitialFormData = () => ({
    date: new Date().toISOString().split("T")[0],
    invoiceNo: "",
    terms: "",
    dueDate: "",
    dueDays: "",
    partyName: "",
    customParty: "",
    broker: "",
    brokerPercent: "",
    carats: "",
    rate: "",
    amount: "",
    aed: "",
    kpcNo: "",
    dtDecDate: "",
    dtDecDueDate: "",
    dtDecNo: "",
    dubaiFileDate: "",
    remark: "",
    note: "",
    currency: "USD",
    paymentMode: "Bank Transfer",
    itemDescription: "",
  });

  // Form State
  const [formData, setFormData] = useState(getInitialFormData());
  const [formErrors, setFormErrors] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [deleteVoucherTarget, setDeleteVoucherTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const filteredEntries = useMemo(() => {
    let list = typeVouchers;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (v) =>
          (v.invoiceNo && v.invoiceNo.toLowerCase().includes(term)) ||
          (v.partyName && v.partyName.toLowerCase().includes(term)) ||
          (v.purchaseParty && v.purchaseParty.toLowerCase().includes(term)) ||
          (v.broker && v.broker.toLowerCase().includes(term)) ||
          (v.kpcNo && v.kpcNo.toLowerCase().includes(term)) ||
          (v.remark && v.remark.toLowerCase().includes(term))
      );
    }
    return list;
  }, [typeVouchers, searchTerm]);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return (filteredEntries || []).slice(start, start + itemsPerPage);
  }, [filteredEntries, currentPage, itemsPerPage]);

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedList.length && paginatedList.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedList.map((v, i) => v.id || v.voucherId || i));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = paginatedList.length > 0 && selectedIds.length === paginatedList.length;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleOpenEdit = (v) => {
    setEditingVoucher(v);
    const partyVal = v.partyName || v.purchaseParty || "";
    const isStandardParty = allAvailableParties.some((p) => p.name === partyVal);

    const rawAmt = v.amount !== undefined && v.amount !== null && v.amount !== "" ? String(v.amount) : (v.totalAmountDollar ? String(v.totalAmountDollar) : "");
    const amtNum = parseFloat(rawAmt);
    const rawCarats = v.carat || (v.carats ? String(v.carats) : "");
    const caratsNum = parseFloat(rawCarats);
    const rawRate = v.perCarat || (v.rate ? String(v.rate) : "");

    let effectiveRate = rawRate;
    if ((!effectiveRate || parseFloat(effectiveRate) === 0) && amtNum > 0 && caratsNum > 0) {
      effectiveRate = (Math.round((amtNum / caratsNum) * 100) / 100).toFixed(2);
    }

    let effectiveAed = v.aed !== undefined && v.aed !== null ? String(v.aed) : "";
    if ((!effectiveAed || parseFloat(effectiveAed) === 0) && amtNum > 0) {
      effectiveAed = (Math.round(amtNum * 3.6725 * 100) / 100).toFixed(2);
    }

    setFormData({
      date: v.date || v.pDate || new Date().toISOString().split("T")[0],
      invoiceNo: v.invoiceNo || "",
      terms: v.terms || "",
      dueDate: v.dueDate || "",
      dueDays: v.dueDays || "",
      partyName: isStandardParty ? partyVal : "__custom__",
      customParty: isStandardParty ? "" : partyVal,
      broker: v.broker || "",
      brokerPercent: v.brokerPercent || v.brokeragePercent || v.brokerPercentage || "",
      carats: rawCarats,
      rate: effectiveRate,
      amount: rawAmt,
      aed: effectiveAed,
      kpcNo: v.kpcNo || v.kpNumber || "",
      dtDecDate: v.dtDecDate || "",
      dtDecDueDate: v.dtDecDueDate || "",
      dtDecNo: v.dtDecNo || "",
      dubaiFileDate: v.dubaiFileDate || "",
      remark: v.remark || "",
      note: v.note || "",
      currency: v.currency || "USD",
      paymentMode: v.paymentMode || "Bank Transfer",
      itemDescription: v.itemDescription || "",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteVoucherTarget) return;
    try {
      const targetId = deleteVoucherTarget.voucherId || deleteVoucherTarget.id;
      const res = await rsSignatureVoucherService.deleteVoucher(targetId);
      if (res && res.success) {
        showToast("✓ Voucher entry deleted successfully");
      } else {
        showToast(`⚠️ ${res?.message || "Failed to delete voucher"}`);
      }
      await loadVouchers();
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      setDeleteVoucherTarget(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Auto calculate amounts & dates across fields
  const handleInputChange = (field, val) => {
    const updated = { ...formData, [field]: val };

    // Auto calculation:
    // Per carat = Total amount / carat 
    // AED = Total Amount * 3.6725
    if (field === "amount") {
      const amt = parseFloat(val);
      const c = parseFloat(formData.carats);
      if (!isNaN(amt) && amt > 0) {
        updated.aed = (Math.round(amt * 3.6725 * 100) / 100).toFixed(2);
        if (!isNaN(c) && c > 0) {
          updated.rate = (Math.round((amt / c) * 100) / 100).toFixed(2);
        }
      } else if (val === "") {
        updated.aed = "";
      }
    } else if (field === "carats") {
      const c = parseFloat(val);
      const amt = parseFloat(formData.amount);
      const r = parseFloat(formData.rate);
      if (!isNaN(c) && c > 0) {
        if (!isNaN(amt) && amt > 0) {
          updated.rate = (Math.round((amt / c) * 100) / 100).toFixed(2);
          updated.aed = (Math.round(amt * 3.6725 * 100) / 100).toFixed(2);
        } else if (!isNaN(r) && r > 0) {
          const calcAmt = Math.round(c * r * 100) / 100;
          updated.amount = calcAmt.toFixed(2);
          updated.aed = (Math.round(calcAmt * 3.6725 * 100) / 100).toFixed(2);
        }
      }
    } else if (field === "rate") {
      const r = parseFloat(val);
      const c = parseFloat(formData.carats);
      if (!isNaN(r) && r > 0 && !isNaN(c) && c > 0) {
        const calcAmt = Math.round(c * r * 100) / 100;
        updated.amount = calcAmt.toFixed(2);
        updated.aed = (Math.round(calcAmt * 3.6725 * 100) / 100).toFixed(2);
      }
    }

    // Auto calculate dueDate when date or terms change
    if (field === "terms" || field === "date") {
      const effectiveDate = field === "date" ? val : formData.date;
      const effectiveTerms = field === "terms" ? val : formData.terms;

      if (effectiveTerms && effectiveDate) {
        const termsStr = effectiveTerms.toString().toLowerCase();
        const daysMatch = termsStr.match(/(\d+)\s*(days|day)?/);

        if (daysMatch) {
          const days = parseInt(daysMatch[1], 10);
          if (!isNaN(days)) {
            const d = new Date(effectiveDate);
            d.setDate(d.getDate() + days);
            updated.dueDate = d.toISOString().split("T")[0];
            updated.dueDays = days.toString();
          }
        }
      } else if (!effectiveTerms) {
        updated.dueDate = "";
        updated.dueDays = "";
      }
    }

    // Auto calculate dueDate if dueDays changes and date exists
    if (field === "dueDays") {
      const days = parseInt(val, 10);
      if (!isNaN(days) && updated.date) {
        const d = new Date(updated.date);
        d.setDate(d.getDate() + days);
        updated.dueDate = d.toISOString().split("T")[0];
      }
    }

    setFormData(updated);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    const effectiveParty =
      formData.partyName === "__custom__"
        ? formData.customParty.trim()
        : formData.partyName.trim();

    if (!effectiveParty) {
      errors.partyName = "Party Name is required";
    }

    if (!formData.date) {
      errors.date = "Date is required";
    }

    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      errors.amount = "Valid amount is required";
    }

    const c = parseFloat(formData.carats);
    if (isNaN(c) || c <= 0) {
      errors.carats = "Valid Carats is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingVoucher) {
      const updatedItem = {
        ...editingVoucher,
        voucherId: editingVoucher.voucherId || editingVoucher.id,
        date: formData.date,
        pDate: formData.date,
        partyName: effectiveParty,
        purchaseParty: effectiveParty,
        broker: formData.broker,
        brokerPercent: formData.brokerPercent,
        invoiceNo: formData.invoiceNo,
        terms: formData.terms,
        dueDate: formData.dueDate,
        dueDays: formData.dueDays,
        carat: formData.carats,
        carats: parseFloat(formData.carats) || 0,
        rate: parseFloat(formData.rate) || 0,
        perCarat: formData.rate,
        amount: amt,
        totalAmountDollar: formData.amount,
        aed: formData.aed,
        kpcNo: formData.kpcNo,
        dtDecDate: formData.dtDecDate,
        dtDecDueDate: formData.dtDecDueDate,
        dtDecNo: formData.dtDecNo,
        dubaiFileDate: formData.dubaiFileDate,
        remark: formData.remark,
        note: formData.note,
        itemDescription: formData.itemDescription || `${config.category} Lot`,
      };
      await rsSignatureVoucherService.updateVoucher(updatedItem);
      await loadVouchers();
      setEditingVoucher(null);
      setIsAddModalOpen(false);
      setFormData(getInitialFormData());
      setFormErrors({});
      showToast(`✓ ${config.name} entry updated successfully`);
      return;
    }

    const newVoucher = {
      id: "sig-" + Date.now(),
      date: formData.date,
      pDate: formData.date,
      entryType: config.name,
      partyName: effectiveParty,
      purchaseParty: effectiveParty,
      broker: formData.broker,
      brokerPercent: formData.brokerPercent,
      invoiceNo: formData.invoiceNo,
      terms: formData.terms,
      dueDate: formData.dueDate,
      dueDays: formData.dueDays,
      carat: formData.carats,
      carats: parseFloat(formData.carats) || 0,
      rate: parseFloat(formData.rate) || 0,
      perCarat: formData.rate,
      amount: amt,
      totalAmountDollar: formData.amount,
      aed: formData.aed,
      kpcNo: formData.kpcNo,
      dtDecDate: formData.dtDecDate,
      dtDecDueDate: formData.dtDecDueDate,
      dtDecNo: formData.dtDecNo,
      dubaiFileDate: formData.dubaiFileDate,
      remark: formData.remark,
      note: formData.note,
      crDr: config.crDr,
      paymentMode: formData.paymentMode,
      currency: formData.currency,
      itemDescription: formData.itemDescription || `${config.category} Lot`,
    };

    const res = await rsSignatureVoucherService.createVoucher(newVoucher);
    if (res && res.success) {
      showToast(`✓ ${config.name} entry added successfully!`);
    } else {
      showToast(`⚠️ ${res?.message || "Failed to save entry"}`);
    }
    await loadVouchers();

    // Reset Form
    setFormData(getInitialFormData());
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  // Specific Stats for this page
  const stats = useMemo(() => {
    const count = typeVouchers.length;
    const totalAmount = typeVouchers.reduce((acc, v) => acc + (Number(v.amount) || 0), 0);
    const totalCarats = typeVouchers.reduce((acc, v) => acc + (Number(v.carats) || 0), 0);
    const avgRate = totalCarats > 0 ? Math.round(totalAmount / totalCarats) : 0;

    return { count, totalAmount, totalCarats, avgRate };
  }, [typeVouchers]);

  const handleExportCSV = () => {
    exportToCSV(filteredEntries, `${config.name.replace(/\s+/g, "_")}_Ledger`);
    showToast("Exported to CSV");
  };

  const handleExportExcel = () => {
    exportToExcel(
      filteredEntries,
      `${config.name} Entries`,
      `${config.name.replace(/\s+/g, "_")}_Ledger`
    );
    showToast("Exported to Excel");
  };

  const IconComponent = config.icon || FaGem;

  return (
    <div className="min-h-screen w-full bg-[#FAFAF8] text-[#111111] font-sans flex flex-col pb-12 selection:bg-black selection:text-white">
      {/* Top Navbar */}
      <div className="w-full bg-white border-b border-[#E8E8E4] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/signature"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white hover:bg-[#111111] text-[#111111] hover:text-white border border-[#D1D1CB] hover:border-[#111111] text-xs font-semibold transition-all duration-150 cursor-pointer shadow-2xs"
          >
            <FaArrowLeft size={10} />
            <span>Back to Signature Account</span>
          </Link>
          <span className="h-4 w-px bg-[#E0E0DB]" />
          <div className="flex items-center gap-2">
            <IconComponent style={{ color: config.color }} size={14} />
            <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              {config.name}
            </span>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
              style={{
                backgroundColor: config.bg,
                color: config.color,
                borderColor: config.border,
              }}
            >
              {config.crDr === "DR" ? "DEBIT (DR)" : "CREDIT (CR)"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-[#555555] bg-[#F5F5F2] border border-[#E8E8E4] px-2.5 py-1 rounded-sm">
            {currentUser?.username || "RSDXB"}
          </span>
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded border ${isApiConnected ? "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]" : "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isApiConnected ? "bg-[#22C55E] animate-pulse" : "bg-[#F59E0B]"}`} />
            {isApiConnected ? "API LIVE" : "OFFLINE"}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white hover:bg-[#FEF2F2] border border-[#E0E0DB] hover:border-[#FCA5A5] text-xs text-[#555555] hover:text-[#991B1B] transition-colors cursor-pointer"
          >
            <FaSignOutAlt size={10} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 9 Voucher Types Quick Switcher Strip */}
      <div className="w-full bg-[#F5F5F2] border-b border-[#E0E0DB] px-4 sm:px-8 py-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-[10px] uppercase font-bold text-[#777777] mr-1">
            Voucher Types:
          </span>
          {Object.values(VOUCHER_CONFIGS).map((v) => {
            const isActive = v.slug === config.slug;
            return (
              <button
                key={v.id}
                onClick={() => navigate(`/signature/${v.slug}`)}
                className={`px-2.5 py-1 rounded-sm text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#111111] text-white shadow-2xs"
                    : "bg-white text-[#444444] hover:bg-[#EBEBE6] border border-[#D1D1CB]"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: v.color }}
                />
                <span>{v.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full px-4 sm:px-8 py-5">
        {/* KPI Strip */}
        <div className="bg-white border border-[#D1D1CB] rounded-sm p-3 mb-5 shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E0E0DB]">
            <div className="px-3 py-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#777777]">
                Total {config.name} Amount
              </div>
              <div
                className="text-lg font-bold font-mono leading-tight mt-0.5"
                style={{ color: config.color }}
              >
                {formatCurrency(stats.totalAmount)}
              </div>
              <div className="text-[10px] text-[#888888]">{config.tagline}</div>
            </div>

            <div className="px-3 py-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#111111]">
                Total Volume (Carats)
              </div>
              <div className="text-lg font-bold text-[#111111] font-mono leading-tight mt-0.5">
                {stats.totalCarats.toFixed(2)} Cts
              </div>
              <div className="text-[10px] text-[#888888]">
                Recorded {config.category} stone weight
              </div>
            </div>

            <div className="px-3 py-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#444444]">
                Weighted Avg Rate / Ct
              </div>
              <div className="text-lg font-bold text-[#333333] font-mono leading-tight mt-0.5">
                {formatCurrency(stats.avgRate)}
              </div>
              <div className="text-[10px] text-[#888888]">Average rate across vouchers</div>
            </div>

            <div className="px-3 py-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#777777]">
                Total Voucher Entries
              </div>
              <div className="text-lg font-bold text-[#111111] font-mono leading-tight mt-0.5">
                {stats.count} Entries
              </div>
              <div className="text-[10px] text-[#888888]">Active stored records</div>
            </div>
          </div>
        </div>

        {/* Entries Table Container (Full Width) */}
        <div className="w-full space-y-3">
          {/* Filter & Export Bar */}
          <div className="bg-white border border-[#D1D1CB] rounded-sm p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <FaSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]"
                size={11}
              />
              <input
                type="text"
                placeholder={`Search ${config.name} by party, lot, ref...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FAFAF8] border border-[#D1D1CB] rounded-sm pl-8 pr-3 py-1.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-hidden focus:border-[#111111]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-mono text-[#555555] mr-1">
                {filteredEntries.length} of {typeVouchers.length} Entries
              </span>
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white hover:bg-[#F0FDF4] border border-[#D1D1CB] hover:border-[#86EFAC] text-xs text-[#166534] font-semibold transition-colors cursor-pointer"
                title="Export Excel"
              >
                <FaFileExcel className="text-[#16A34A]" size={12} />
                <span>Excel</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-xs text-[#444444] font-semibold transition-colors cursor-pointer"
                title="Export CSV"
              >
                <FaFileCsv size={12} />
                <span>CSV</span>
              </button>
              <button
                onClick={() => {
                  setFormData(getInitialFormData());
                  setFormErrors({});
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-2xs"
                title={`Add ${config.name}`}
              >
                <FaPlus size={10} />
                <span>Add {config.name}</span>
              </button>
            </div>
          </div>

          {/* Entries Table */}
          <div className="bg-white border border-[#D1D1CB] rounded-sm shadow-2xs overflow-hidden">
            <div className="overflow-x-auto firm-table-scrollbar">
              <table className="w-full text-left text-xs border-collapse border border-[#E0E0DB]">
                <thead>
                  <tr className="border-b border-[#D1D1CB] bg-[#F5F5F2] text-[#555555] font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                    <th className="py-2.5 px-2.5 text-center border-r border-[#E0E0DB] w-9 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="w-3.5 h-3.5 rounded-xs border-[#D1D1CB] text-black focus:ring-black cursor-pointer align-middle"
                        title="Select all rows"
                      />
                    </th>
                    <th className="py-2.5 px-3 text-center border-r border-[#E0E0DB] whitespace-nowrap font-semibold">
                      SR NO
                    </th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">Date</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">Invoice No</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">Terms</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">Due Date</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">Party Name</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">Broker</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB] text-right">Broker %</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB] text-right">Carat</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB] text-right">Per Carat</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB] text-right">Total Amount *</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB] text-right">AED</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">KP Number</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">DT Dec Date</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">DT Dec Due Date</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">DT Dec No</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">Dubai File Date</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">Remark</th>
                    <th className="py-2.5 px-3 border-r border-[#E0E0DB]">Note</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {paginatedList.length === 0 ? (
                    <tr>
                      <td colSpan={21} className="py-12 text-center text-[#777777]">
                        <IconComponent
                          className="mx-auto mb-2 text-[#CCCCCC]"
                          size={28}
                        />
                        <p className="font-semibold text-sm text-[#333333]">
                          No {config.name} entries found
                        </p>
                        <p className="text-xs text-[#888888] mt-0.5">
                          Click "Add {config.name}" to record your first entry.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedList.map((v, idx) => {
                      const rowId = v.id || v.voucherId || idx;
                      const isSelected = selectedIds.includes(rowId);
                      return (
                        <tr
                          key={rowId}
                          className={`transition-colors ${
                            isSelected
                              ? "bg-[#F3F4EE] hover:bg-[#ECEEE6]"
                              : idx % 2 === 0
                              ? "bg-white hover:bg-[#F9F9F7]"
                              : "bg-[#FCFCFA] hover:bg-[#F9F9F7]"
                          }`}
                        >
                          <td className="py-2 px-2.5 text-center border-r border-[#EAEAEA]">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRow(rowId)}
                              className="w-3.5 h-3.5 rounded-xs border-[#D1D1CB] text-black focus:ring-black cursor-pointer align-middle"
                            />
                          </td>
                          <td className="py-2 px-2.5 text-center border-r border-[#EAEAEA] font-mono text-xs text-[#777777] whitespace-nowrap">
                            {(currentPage - 1) * itemsPerPage + idx + 1}
                          </td>
                          <td className="py-2 px-3 border-r border-[#EAEAEA] font-mono text-[11px] whitespace-nowrap text-[#555555]">
                            {v.date || v.pDate || "-"}
                          </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.invoiceNo || "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] text-[11px] whitespace-nowrap text-[#555555]">
                          {v.terms || "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.dueDate || "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] font-semibold text-[#111111] whitespace-nowrap">
                          {v.partyName || v.purchaseParty || "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] text-[#555555] whitespace-nowrap">
                          {v.broker || "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.brokerPercent ? `${v.brokerPercent}%` : "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] text-right font-mono font-semibold text-[#111111] whitespace-nowrap">
                          {v.carat || (v.carats ? Number(v.carats).toFixed(2) : "-")}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.perCarat || (v.rate ? formatCurrency(v.rate) : "-")}
                        </td>
                        <td
                          className="py-2 px-3 border-r border-[#EAEAEA] text-right font-mono font-bold whitespace-nowrap"
                          style={{ color: config.color }}
                        >
                          {v.totalAmountDollar || (v.amount ? formatCurrency(v.amount) : "-")}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.aed || "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.kpcNo || v.kpNumber || "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.dtDecDate || "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.dtDecDueDate || "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.dtDecNo || "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.dubaiFileDate || "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] text-[#555555] whitespace-nowrap max-w-[150px] truncate">
                          {v.remark || "-"}
                        </td>
                        <td className="py-2 px-3 border-r border-[#EAEAEA] text-[#555555] whitespace-nowrap max-w-[150px] truncate">
                          {v.note || "-"}
                        </td>
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedVoucher(v)}
                              className="p-1 rounded text-[#555555] hover:text-[#111111] hover:bg-[#EBEBE6] transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <FaEye size={12} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(v)}
                              className="p-1 rounded text-[#2563EB] hover:text-blue-700 hover:bg-[#DBEAFE] transition-colors cursor-pointer"
                              title="Update / Edit Entry"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => setDeleteVoucherTarget(v)}
                              className="p-1 rounded text-[#991B1B] hover:text-red-700 hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                              title="Delete Voucher"
                            >
                              <FaTrash size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredEntries.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onItemsPerPageChange={(limit) => {
                setItemsPerPage(limit);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </main>

      {/* Modal: Add / Edit Entry (Image 3 layout for Rough Purchase) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#D1D1CB] rounded-sm max-w-3xl w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-150 my-8">
            <div className="flex items-center justify-between border-b border-[#E0E0DB] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  <IconComponent size={14} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                    {editingVoucher ? `Edit ${config.name} Voucher` : `New ${config.name} Voucher`}
                  </h3>
                  <p className="text-[11px] text-[#777777]">
                    Fill in the transaction, parcel, and Dubai trade details
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingVoucher(null);
                }}
                className="text-[#777777] hover:text-[#111111] cursor-pointer"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {/* 1. Basic Details */}
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                  {/* Row 1: 4 columns for Date, Invoice No, Terms, Due Date */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        DATE *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                        required
                      />
                      {formErrors.date && (
                        <p className="text-[10px] text-red-600 mt-0.5">{formErrors.date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        INVOICE NO
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. INV-1048"
                        value={formData.invoiceNo}
                        onChange={(e) => handleInputChange("invoiceNo", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        TERMS (DAYS)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 30 / 60 Days"
                        value={formData.terms}
                        onChange={(e) => handleInputChange("terms", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        DUE DATE (AUTO)
                      </label>
                      <input
                        type="text"
                        value={formData.dueDate || "dd-----yyyy"}
                        disabled
                        className="w-full bg-[#F5F5F2] text-[#555555] border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs font-mono font-semibold cursor-not-allowed focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Row 2: Party Name, Broker, Broker % */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        PARTY NAME *
                      </label>
                      <SearchablePartySelect
                        value={formData.partyName}
                        onChange={(val) => handleInputChange("partyName", val)}
                        parties={allAvailableParties}
                        placeholder="-- Select Party --"
                        required
                        error={formErrors.partyName}
                      />
                      {formErrors.partyName && (
                        <p className="text-[10px] text-red-600 mt-0.5">{formErrors.partyName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        BROKER
                      </label>
                      <input
                        type="text"
                        placeholder="Broker name / firm"
                        value={formData.broker}
                        onChange={(e) => handleInputChange("broker", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        BROKER %
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 1.00%"
                        value={formData.brokerPercent}
                        onChange={(e) => handleInputChange("brokerPercent", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] font-mono focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. WEIGHT & FINANCIAL FIGURES */}
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                  <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                    2. WEIGHT & FINANCIAL FIGURES
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        CARAT *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.carats}
                        onChange={(e) => handleInputChange("carats", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] font-mono font-bold focus:outline-hidden focus:border-[#111111]"
                        required
                      />
                      {formErrors.carats && (
                        <p className="text-[10px] text-red-600 mt-0.5">{formErrors.carats}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        PER CARAT
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.rate}
                        onChange={(e) => handleInputChange("rate", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] font-mono focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        TOTAL AMOUNT *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => handleInputChange("amount", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] font-mono font-bold focus:outline-hidden focus:border-[#111111]"
                        required
                      />
                      {formErrors.amount && (
                        <p className="text-[10px] text-red-600 mt-0.5">{formErrors.amount}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        AED
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.aed}
                        onChange={(e) => handleInputChange("aed", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] font-mono focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. KPC NUMBER */}
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                  <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                    3. KPC NUMBER
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                      KPC NUMBER
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Enter KPC Certificate Number / Details..."
                      value={formData.kpcNo}
                      onChange={(e) => handleInputChange("kpcNo", e.target.value)}
                      className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111] resize-y"
                    />
                  </div>
                </div>

                {/* 4. DUBAI TRADE TRACKING */}
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                  <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                    4. DUBAI TRADE TRACKING
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        DT DEC DATE
                      </label>
                      <input
                        type="date"
                        value={formData.dtDecDate}
                        onChange={(e) => handleInputChange("dtDecDate", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        DT DEC DUE DATE
                      </label>
                      <input
                        type="date"
                        value={formData.dtDecDueDate}
                        onChange={(e) => handleInputChange("dtDecDueDate", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        DT DEC NO
                      </label>
                      <input
                        type="text"
                        placeholder="Declaration #"
                        value={formData.dtDecNo}
                        onChange={(e) => handleInputChange("dtDecNo", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        DUBAI FILE DATE
                      </label>
                      <input
                        type="date"
                        value={formData.dubaiFileDate}
                        onChange={(e) => handleInputChange("dubaiFileDate", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. REMARKS & NOTES */}
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                  <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                    5. REMARKS & NOTES
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        REMARK
                      </label>
                      <input
                        type="text"
                        placeholder="Primary remark..."
                        value={formData.remark}
                        onChange={(e) => handleInputChange("remark", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        NOTE
                      </label>
                      <input
                        type="text"
                        placeholder="Internal note..."
                        value={formData.note}
                        onChange={(e) => handleInputChange("note", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E0E0DB]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingVoucher(null);
                  }}
                  className="px-3.5 py-1.5 rounded-sm border border-[#D1D1CB] text-[#555555] hover:bg-[#F5F5F2] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-sm text-white text-xs font-bold uppercase tracking-wider shadow-2xs hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
                  style={{ backgroundColor: "#111111" }}
                >
                  <FaPlus size={9} />
                  <span>{editingVoucher ? `Update ${config.name}` : `Save ${config.name}`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteVoucherTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D1D1CB] rounded-sm max-w-md w-full p-5 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#E0E0DB] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <FaTrash size={11} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                  Confirm Delete Voucher
                </h3>
              </div>
              <button
                onClick={() => setDeleteVoucherTarget(null)}
                className="text-[#777777] hover:text-[#111111] cursor-pointer"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#444444]">
              <p>
                Are you sure you want to delete this <strong className="text-[#111111]">{deleteVoucherTarget.entryType}</strong> voucher entry?
              </p>

              <div className="bg-[#FAFAF8] border border-[#E8E8E4] p-3 rounded space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#777777]">Date:</span>
                  <span className="font-semibold text-[#111111]">{deleteVoucherTarget.date || deleteVoucherTarget.pDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Party:</span>
                  <span className="font-semibold text-[#111111]">{deleteVoucherTarget.partyName || deleteVoucherTarget.purchaseParty}</span>
                </div>
                {deleteVoucherTarget.carats > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Carats:</span>
                    <span className="font-semibold text-[#111111]">
                      {Number(deleteVoucherTarget.carats).toFixed(2)} Cts
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#777777]">Amount:</span>
                  <span className="font-bold text-[#111111]">
                    {formatCurrency(deleteVoucherTarget.amount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-[#E0E0DB]">
              <button
                type="button"
                onClick={() => setDeleteVoucherTarget(null)}
                className="px-3.5 py-1.5 rounded-sm border border-[#D1D1CB] text-[#555555] hover:bg-[#F5F5F2] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-sm bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-2xs transition-colors cursor-pointer"
              >
                Delete Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Details */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D1D1CB] rounded-sm max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E0E0DB] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  <IconComponent size={14} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                  {config.name} Voucher Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="text-[#777777] hover:text-[#111111] cursor-pointer"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4]">
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">DATE</span>
                  <span className="font-mono font-semibold text-[#111111]">{selectedVoucher.date || selectedVoucher.pDate || "-"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">INVOICE NO</span>
                  <span className="font-mono font-semibold text-[#111111]">{selectedVoucher.invoiceNo || "-"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">TERMS</span>
                  <span className="text-[#111111]">{selectedVoucher.terms || "-"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">DUE DATE</span>
                  <span className="font-mono text-[#111111]">{selectedVoucher.dueDate || "-"}</span>
                </div>
              </div>

              <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">PARTY NAME</span>
                  <span className="font-bold text-sm text-[#111111]">{selectedVoucher.partyName || selectedVoucher.purchaseParty || "-"}</span>
                </div>
                {(selectedVoucher.broker || selectedVoucher.brokerPercent) && (
                  <div className="flex items-center gap-3 text-xs">
                    {selectedVoucher.broker && (
                      <div>
                        <span className="text-[10px] font-bold text-[#777777] uppercase block">BROKER</span>
                        <span className="font-semibold text-[#111111]">{selectedVoucher.broker}</span>
                      </div>
                    )}
                    {selectedVoucher.brokerPercent && (
                      <div>
                        <span className="text-[10px] font-bold text-[#777777] uppercase block">BROKER %</span>
                        <span className="font-mono font-semibold text-[#111111]">{selectedVoucher.brokerPercent}%</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4]">
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">CARAT</span>
                  <span className="font-mono font-bold text-[#111111]">{selectedVoucher.carat || selectedVoucher.carats || "-"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">PER CARAT</span>
                  <span className="font-mono text-[#111111]">{selectedVoucher.perCarat || formatCurrency(selectedVoucher.rate)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">TOTAL AMOUNT *</span>
                  <span className="font-mono font-bold" style={{ color: config.color }}>{selectedVoucher.totalAmountDollar || formatCurrency(selectedVoucher.amount)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">AED</span>
                  <span className="font-mono text-[#111111]">{selectedVoucher.aed || "-"}</span>
                </div>
              </div>

              {(selectedVoucher.kpcNo || selectedVoucher.kpNumber) && (
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4]">
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">KP NUMBER</span>
                  <span className="font-mono text-[#111111]">{selectedVoucher.kpcNo || selectedVoucher.kpNumber}</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4]">
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">DT DEC DATE</span>
                  <span className="font-mono text-[#111111]">{selectedVoucher.dtDecDate || "-"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">DT DEC DUE DATE</span>
                  <span className="font-mono text-[#111111]">{selectedVoucher.dtDecDueDate || "-"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">DT DEC NO</span>
                  <span className="font-mono text-[#111111]">{selectedVoucher.dtDecNo || "-"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">DUBAI FILE DATE</span>
                  <span className="font-mono text-[#111111]">{selectedVoucher.dubaiFileDate || "-"}</span>
                </div>
              </div>

              {(selectedVoucher.remark || selectedVoucher.note) && (
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-1">
                  {selectedVoucher.remark && (
                    <div>
                      <span className="text-[10px] font-bold text-[#777777] uppercase block">REMARK:</span>
                      <span className="text-[#111111]">{selectedVoucher.remark}</span>
                    </div>
                  )}
                  {selectedVoucher.note && (
                    <div>
                      <span className="text-[10px] font-bold text-[#777777] uppercase block">NOTE:</span>
                      <span className="text-[#111111]">{selectedVoucher.note}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4 pt-3 border-t border-[#E0E0DB]">
              <button
                onClick={() => setSelectedVoucher(null)}
                className="px-4 py-1.5 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoughPurchase;
