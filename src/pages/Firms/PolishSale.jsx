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
  FaBoxes,
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

const config = VOUCHER_CONFIGS["polish-sale"];

const PolishSale = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const currentUser = authUser || getAuthUser();
  const allAvailableParties = getAllFirms();

  // Master vouchers state
  const [allVouchers, setAllVouchers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Filter vouchers for Polish Sale
  const typeVouchers = useMemo(() => {
    return allVouchers.filter((v) => v.entryType === config.name);
  }, [allVouchers]);

  const getInitialFormData = () => ({
    date: new Date().toISOString().split("T")[0],
    partyName: "",
    customParty: "",
    itemDescription: "",
    carats: "",
    rate: "",
    amount: "",
    currency: "USD",
    paymentMode: "Bank Transfer",
    invoiceNo: "",
    terms: "",
    dueDate: "",
    dueDays: "",
    aed: "",
    remark: "",
    dtDecDate: "",
    dtDecDueDate: "",
    dtDecNo: "",
    dubaiFileDate: "",
  });

  // Form State
  const [formData, setFormData] = useState(getInitialFormData());
  const [formErrors, setFormErrors] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [deleteVoucherTarget, setDeleteVoucherTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Sync to local storage
  const saveVouchersToStorage = (updated) => {
    setAllVouchers(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save vouchers", e);
    }
  };

  const handleOpenEdit = (v) => {
    setEditingVoucher(v);
    const partyVal = v.partyName || v.saleParty || v.customerParty || "";
    const isStandardParty = allAvailableParties.some((p) => p.name === partyVal);
    setFormData({
      date: v.pDate || v.date || new Date().toISOString().split("T")[0],
      partyName: isStandardParty ? partyVal : "__custom__",
      customParty: isStandardParty ? "" : partyVal,
      itemDescription: v.itemDescription || "",
      carats: v.carat || (v.carats ? String(v.carats) : ""),
      rate: v.perCarat || (v.rate ? String(v.rate) : ""),
      amount: v.amount ? String(v.amount) : (v.totalAmountDollar ? String(v.totalAmountDollar) : ""),
      currency: v.currency || "USD",
      paymentMode: v.paymentMode || "Bank Transfer",
      invoiceNo: v.invoiceNo || "",
      terms: v.terms || "",
      dueDate: v.dueDate || "",
      dueDays: v.dueDays || "",
      aed: v.aed || "",
      remark: v.remark || "",
      dtDecDate: v.dtDecDate || "",
      dtDecDueDate: v.dtDecDueDate || "",
      dtDecNo: v.dtDecNo || "",
      dubaiFileDate: v.dubaiFileDate || "",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteVoucherTarget) return;
    const updated = allVouchers.filter((v) => v.id !== deleteVoucherTarget.id);
    saveVouchersToStorage(updated);
    setDeleteVoucherTarget(null);
    showToast("✓ Voucher entry deleted successfully");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Auto calculate amounts & dates across fields
  const handleInputChange = (field, val) => {
    const updated = { ...formData, [field]: val };

    // Auto calculate amount when carats or rate change
    if (field === "carats" || field === "rate") {
      const c = parseFloat(field === "carats" ? val : formData.carats);
      const r = parseFloat(field === "rate" ? val : formData.rate);
      if (!isNaN(c) && !isNaN(r) && c > 0 && r > 0) {
        updated.amount = Math.round(c * r * 100) / 100;
      }
    }

    // Auto calculate dueDate when date or terms change
    if (field === "terms" || field === "date") {
      const effectiveDate = field === "date" ? val : formData.date;
      const effectiveTerms = field === "terms" ? val : formData.terms;
      const match = String(effectiveTerms || "").match(/\d+/);
      if (match && effectiveDate) {
        const days = parseInt(match[0], 10);
        if (!isNaN(days)) {
          const d = new Date(effectiveDate);
          if (!isNaN(d.getTime())) {
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

  const handleFormSubmit = (e) => {
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
      const updated = allVouchers.map((item) =>
        item.id === editingVoucher.id
          ? {
              ...item,
              date: formData.date,
              pDate: formData.date,
              partyName: effectiveParty,
              saleParty: effectiveParty,
              customerParty: effectiveParty,
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
              remark: formData.remark,
              dtDecDate: formData.dtDecDate,
              dtDecDueDate: formData.dtDecDueDate,
              dtDecNo: formData.dtDecNo,
              dubaiFileDate: formData.dubaiFileDate,
              itemDescription: formData.itemDescription,
            }
          : item
      );
      saveVouchersToStorage(updated);
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
      remark: formData.remark,
      dtDecDate: formData.dtDecDate,
      dtDecDueDate: formData.dtDecDueDate,
      dtDecNo: formData.dtDecNo,
      dubaiFileDate: formData.dubaiFileDate,
      crDr: config.crDr,
      paymentMode: formData.paymentMode,
      currency: formData.currency,
      itemDescription:
        formData.itemDescription || `${config.category} Lot`,
    };

    const updated = [newVoucher, ...allVouchers];
    saveVouchersToStorage(updated);

    // Reset Form
    setFormData(getInitialFormData());
    setFormErrors({});
    setIsAddModalOpen(false);
    showToast(`✓ ${config.name} entry added successfully!`);
  };

  // Filtered by Search
  const filteredEntries = useMemo(() => {
    return typeVouchers.filter((v) => {
      const q = searchTerm.toLowerCase();
      return (
        v.partyName?.toLowerCase().includes(q) ||
        v.itemDescription?.toLowerCase().includes(q) ||
        v.remark?.toLowerCase().includes(q) ||
        v.invoiceNo?.toLowerCase().includes(q) ||
        v.date?.includes(q)
      );
    });
  }, [typeVouchers, searchTerm]);

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

  const IconComponent = config.icon || FaBoxes;

  return (
    <div className="min-h-screen w-full bg-[#FAFAF8] text-[#111111] font-sans flex flex-col pb-12 selection:bg-black selection:text-white">
      {/* Top Navbar */}
      <div className="w-full bg-white border-b border-[#E8E8E4] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/signature"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#F5F5F2] hover:bg-[#EBEBE6] border border-[#E0E0DB] text-xs font-semibold text-[#333333] transition-colors cursor-pointer"
          >
            <FaArrowLeft size={10} />
            <span>Back to Signature</span>
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
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#D1D1CB] bg-[#F5F5F2] text-[#555555] font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Invoice No</th>
                    <th className="py-2.5 px-3">Terms</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Party Name</th>
                    <th className="py-2.5 px-3 text-right">Carat</th>
                    <th className="py-2.5 px-3 text-right">Per carat</th>
                    <th className="py-2.5 px-3 text-right">Total Amount</th>
                    <th className="py-2.5 px-3 text-right">AED</th>
                    <th className="py-2.5 px-3">DT Dec Date</th>
                    <th className="py-2.5 px-3">DT Dec Due Date</th>
                    <th className="py-2.5 px-3">DT Dec No</th>
                    <th className="py-2.5 px-3">Dubai File Date</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="py-12 text-center text-[#777777]">
                        <IconComponent
                          className="mx-auto mb-2 text-[#CCCCCC]"
                          size={28}
                        />
                        <p className="font-semibold text-sm text-[#333333]">
                          No {config.name} entries found
                        </p>
                        <p className="text-xs text-[#888888] mt-0.5">
                          Use the form on the left to record your first entry.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((v, idx) => (
                      <tr
                        key={v.id || idx}
                        className={`hover:bg-[#F9F9F7] transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#FCFCFA]"
                        }`}
                      >
                        <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.date || v.pDate || "-"}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.invoiceNo || "-"}
                        </td>
                        <td className="py-2 px-3 text-[11px] whitespace-nowrap text-[#555555]">
                          {v.terms || "-"}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.dueDate || "-"}
                        </td>
                        <td className="py-2 px-3 font-semibold text-[#111111] whitespace-nowrap">
                          {v.partyName || v.purchaseParty || "-"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-[#111111] whitespace-nowrap">
                          {v.carat || (v.carats ? Number(v.carats).toFixed(2) : "-")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.perCarat || (v.rate ? formatCurrency(v.rate) : "-")}
                        </td>
                        <td
                          className="py-2 px-3 text-right font-mono font-bold whitespace-nowrap"
                          style={{ color: config.color }}
                        >
                          {v.totalAmountDollar || (v.amount ? formatCurrency(v.amount) : "-")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.aed || "-"}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.dtDecDate || "-"}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.dtDecDueDate || "-"}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.dtDecNo || "-"}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.dubaiFileDate || "-"}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#111111] text-white px-4 py-2.5 rounded-sm shadow-xl flex items-center gap-2 text-xs border border-[#333333] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <FaCheckCircle className="text-emerald-400" size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add/Edit Voucher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D1D1CB] rounded-sm max-w-3xl w-full p-5 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#E0E0DB] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <IconComponent style={{ color: config.color }} size={16} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                  {editingVoucher ? `Edit ${config.name}` : `Record New ${config.name}`}
                </h3>
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
              <div className="space-y-3 max-h-[72vh] overflow-y-auto pr-1">
                {/* Section 1: Sale & Invoice Details */}
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                  <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                    1. Sale & Invoice Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        Date *
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
                        Invoice No
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. PS-1048"
                        value={formData.invoiceNo}
                        onChange={(e) => handleInputChange("invoiceNo", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        Terms (Days)
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
                        Due Date (Auto)
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        disabled
                        className="w-full bg-[#F5F5F2] text-[#555555] border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs font-mono font-semibold cursor-not-allowed focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        Party Name *
                      </label>
                      <select
                        value={formData.partyName}
                        onChange={(e) => handleInputChange("partyName", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                        required
                      >
                        <option value="">-- Select Party --</option>
                        {allAvailableParties.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                        <option value="__custom__">+ Enter Custom Party Name</option>
                      </select>
                      {formErrors.partyName && (
                        <p className="text-[10px] text-red-600 mt-0.5">{formErrors.partyName}</p>
                      )}

                      {formData.partyName === "__custom__" && (
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Type Custom Party Name..."
                            value={formData.customParty}
                            onChange={(e) => handleInputChange("customParty", e.target.value)}
                            className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Weight & Financial Figures */}
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                  <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                    2. Weight & Financial Figures
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        Carat *
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
                        Per Carat ($)
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
                        Total Amount $ *
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

                {/* Section 3: Dubai Trade Tracking */}
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                  <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                    3. Dubai Trade Tracking
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        DT Dec Date
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
                        DT Dec Due Date
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
                        DT Dec No
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
                        Dubai File Date
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

                {/* Section 4: Remarks */}
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                  <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                    4. Remarks & Narration
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                      Remark
                    </label>
                    <input
                      type="text"
                      placeholder="Remark / Terms narration..."
                      value={formData.remark}
                      onChange={(e) => handleInputChange("remark", e.target.value)}
                      className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                    />
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
                  <span className="font-semibold text-[#111111]">{deleteVoucherTarget.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Party:</span>
                  <span className="font-semibold text-[#111111]">{deleteVoucherTarget.partyName}</span>
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
                  <span className="font-bold text-red-600">
                    {formatCurrency(deleteVoucherTarget.amount)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#888888] italic">
                This action cannot be undone and will update stock, ledger, and balances immediately.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#E0E0DB] pt-3">
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
                className="px-4 py-1.5 rounded-sm bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FaTrash size={10} />
                <span>Delete Voucher</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Voucher Details Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D1D1CB] rounded-sm max-w-lg w-full p-5 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#E0E0DB] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <IconComponent style={{ color: config.color }} size={16} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                  {selectedVoucher.entryType} Voucher Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="text-[#777777] hover:text-[#111111] cursor-pointer"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-[#FAFAF8] p-2.5 rounded border border-[#E8E8E4]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Date</span>
                  <p className="font-mono font-semibold">{selectedVoucher.date || selectedVoucher.pDate}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Voucher ID</span>
                  <p className="font-mono text-[#555555]">{selectedVoucher.id}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#777777]">Party Name</span>
                <p className="font-bold text-sm text-[#111111]">{selectedVoucher.partyName || selectedVoucher.purchaseParty}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#FAFAF8] p-2.5 rounded border border-[#E8E8E4]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Carats</span>
                  <p className="font-mono font-bold">{selectedVoucher.carats || selectedVoucher.carat || "-"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Rate / Ct</span>
                  <p className="font-mono">{selectedVoucher.rate || selectedVoucher.perCarat ? formatCurrency(selectedVoucher.rate || selectedVoucher.perCarat) : "-"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Total Amount</span>
                  <p className="font-mono font-bold text-emerald-600">{formatCurrency(selectedVoucher.amount || selectedVoucher.totalAmountDollar)}</p>
                </div>
              </div>

              {selectedVoucher.remark && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Remarks</span>
                  <p className="text-[#333333] bg-[#FAFAF8] p-2 rounded border border-[#E8E8E4]">{selectedVoucher.remark}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedVoucher(null)}
                className="px-4 py-1.5 bg-[#111111] text-white text-xs font-semibold rounded-sm cursor-pointer"
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

export default PolishSale;
