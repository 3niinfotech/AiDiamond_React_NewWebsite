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
  FaMoneyBillWave,
  FaEdit,
} from "react-icons/fa";
import {
  getAllFirms,
  formatCurrency,
  getAuthUser,
  clearAuthUser,
} from "../../data/firmData";
import { exportToCSV, exportToExcel } from "../../utils/excelExport";
import { VOUCHER_CONFIGS, STORAGE_KEY } from "./voucherConstants";

const config = VOUCHER_CONFIGS["expense"];

const ExpenseEntry = () => {
  const navigate = useNavigate();
  const currentUser = getAuthUser();
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

  // Filter vouchers for Expense
  const typeVouchers = useMemo(() => {
    return allVouchers.filter((v) => v.entryType === config.name);
  }, [allVouchers]);

  const getInitialFormData = () => ({
    date: new Date().toISOString().split("T")[0],
    partyName: "",
    customParty: "",
    invoiceNo: "",
    refDocumentNo: "",
    description: "",
    expenseType: "Office Expense",
    serviceType: "Office Expense",
    amount: "",
    aed: "",
    remark: "",
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
    const partyVal = v.companyName || v.partyName || v.purchaseParty || "";
    const isStandardParty = allAvailableParties.some((p) => p.name === partyVal);
    setFormData({
      date: v.date || v.pDate || new Date().toISOString().split("T")[0],
      partyName: isStandardParty ? partyVal : "__custom__",
      customParty: isStandardParty ? "" : partyVal,
      invoiceNo: v.invoiceNo || "",
      refDocumentNo: v.refDocumentNo || "",
      description: v.description || v.itemDescription || "",
      expenseType: v.expenseType || v.expenseHead || "Office Expense",
      serviceType: v.expenseType || v.expenseHead || "Office Expense",
      amount: v.amount ? String(v.amount) : (v.totalAmountDollar ? String(v.totalAmountDollar) : ""),
      aed: v.aed ? String(v.aed) : "",
      remark: v.remark || "",
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

  const handleLogout = () => {
    clearAuthUser();
    navigate("/login", { replace: true });
  };

  const handleInputChange = (field, val) => {
    const updated = { ...formData, [field]: val };
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
              purchaseParty: effectiveParty,
              companyName: effectiveParty,
              invoiceNo: formData.invoiceNo,
              refDocumentNo: formData.refDocumentNo || formData.invoiceNo || "",
              description: formData.description || "",
              itemDescription: formData.description || "",
              expenseType: formData.expenseType,
              serviceType: formData.expenseType,
              expenseHead: formData.expenseType,
              amount: amt,
              totalAmountDollar: formData.amount,
              aed: formData.aed,
              remark: formData.remark,
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
      companyName: effectiveParty,
      invoiceNo: formData.invoiceNo,
      refDocumentNo: formData.refDocumentNo || formData.invoiceNo || "",
      description: formData.description || "",
      expenseType: formData.expenseType || "Office Expense",
      serviceType: formData.expenseType || "Office Expense",
      officeExpense: (formData.expenseType === "Office Expense" || !formData.expenseType) ? amt : "",
      shippingLogistics: formData.expenseType === "Shipping & Logistics" ? amt : "",
      professionalFees: formData.expenseType === "Professional Fees" ? amt : "",
      shippingFreight: formData.expenseType === "Shipping / Freight" ? amt : "",
      governmentFees: formData.expenseType === "Government & Authority Fees" ? amt : "",
      softwareIt: formData.expenseType === "Software & IT" ? amt : "",
      bankFinance: formData.expenseType === "Bank & Finance" ? amt : "",
      employeeStaff: formData.expenseType === "Employee / Staff" ? amt : "",
      insurance: formData.expenseType === "Insurance" ? amt : "",
      otherExpense: formData.expenseType === "Other" ? amt : "",
      amount: amt,
      totalAmountDollar: formData.amount,
      aed: formData.aed,
      remark: formData.remark,
      crDr: config.crDr,
      paymentMode: "Bank Transfer",
      currency: "USD",
      itemDescription: formData.description || "Expense Entry",
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
        v.companyName?.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.itemDescription?.toLowerCase().includes(q) ||
        v.remark?.toLowerCase().includes(q) ||
        v.invoiceNo?.toLowerCase().includes(q) ||
        v.refDocumentNo?.toLowerCase().includes(q) ||
        v.date?.includes(q)
      );
    });
  }, [typeVouchers, searchTerm]);

  // Specific Stats for this page
  const stats = useMemo(() => {
    const count = typeVouchers.length;
    const totalAmount = typeVouchers.reduce((acc, v) => acc + (Number(v.amount) || 0), 0);
    return { count, totalAmount, totalCarats: 0, avgRate: 0 };
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

  const IconComponent = config.icon || FaMoneyBillWave;

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
                Voucher Nature
              </div>
              <div className="text-lg font-bold text-[#111111] leading-tight mt-0.5">
                Cash Outflow (DR)
              </div>
              <div className="text-[10px] text-[#888888]">Financial ledger movement</div>
            </div>

            <div className="px-3 py-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#444444]">
                Default Impact
              </div>
              <div className="text-lg font-bold text-[#333333] font-mono leading-tight mt-0.5">
                Expense
              </div>
              <div className="text-[10px] text-[#888888]">Bank / Party Settlement</div>
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
                    <th className="py-2.5 px-3">Company Name</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Ref Document No</th>
                    <th className="py-2.5 px-3 text-right">Office Expense</th>
                    <th className="py-2.5 px-3 text-right">Shipping & Logistics</th>
                    <th className="py-2.5 px-3 text-right">Professional Fees</th>
                    <th className="py-2.5 px-3 text-right">Shipping / Freight</th>
                    <th className="py-2.5 px-3 text-right">Government & Authority Fees</th>
                    <th className="py-2.5 px-3 text-right">Software & IT</th>
                    <th className="py-2.5 px-3 text-right">Bank & Finance</th>
                    <th className="py-2.5 px-3 text-right">Employee / Staff</th>
                    <th className="py-2.5 px-3 text-right">Insurance</th>
                    <th className="py-2.5 px-3 text-right">Other</th>
                    <th className="py-2.5 px-3 text-right">AED</th>
                    <th className="py-2.5 px-3 text-right">Amount $</th>
                    <th className="py-2.5 px-3">Remark</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={19} className="py-12 text-center text-[#777777]">
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
                        <td className="py-2 px-3 font-semibold text-[#111111] whitespace-nowrap">
                          {v.companyName || v.partyName || v.purchaseParty || "-"}
                        </td>
                        <td className="py-2 px-3 text-[#555555] whitespace-nowrap max-w-[180px] truncate">
                          {v.description || v.itemDescription || "-"}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap text-[#555555]">
                          {v.refDocumentNo || v.jobNo || v.saleInvoiceNo || "-"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.officeExpense ? (Number(v.officeExpense) ? formatCurrency(v.officeExpense) : v.officeExpense) : (v.expenseType === "Office Expense" && v.amount ? formatCurrency(v.amount) : "-")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.shippingLogistics ? (Number(v.shippingLogistics) ? formatCurrency(v.shippingLogistics) : v.shippingLogistics) : (v.expenseType === "Shipping & Logistics" && v.amount ? formatCurrency(v.amount) : "-")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.professionalFees ? (Number(v.professionalFees) ? formatCurrency(v.professionalFees) : v.professionalFees) : (v.expenseType === "Professional Fees" && v.amount ? formatCurrency(v.amount) : "-")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.shippingFreight ? (Number(v.shippingFreight) ? formatCurrency(v.shippingFreight) : v.shippingFreight) : (v.expenseType === "Shipping / Freight" && v.amount ? formatCurrency(v.amount) : "-")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.governmentFees ? (Number(v.governmentFees) ? formatCurrency(v.governmentFees) : v.governmentFees) : (v.expenseType === "Government & Authority Fees" && v.amount ? formatCurrency(v.amount) : "-")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.softwareIt ? (Number(v.softwareIt) ? formatCurrency(v.softwareIt) : v.softwareIt) : (v.expenseType === "Software & IT" && v.amount ? formatCurrency(v.amount) : "-")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.bankFinance ? (Number(v.bankFinance) ? formatCurrency(v.bankFinance) : v.bankFinance) : (v.expenseType === "Bank & Finance" && v.amount ? formatCurrency(v.amount) : "-")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.employeeStaff ? (Number(v.employeeStaff) ? formatCurrency(v.employeeStaff) : v.employeeStaff) : (v.expenseType === "Employee / Staff" && v.amount ? formatCurrency(v.amount) : "-")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.insurance ? (Number(v.insurance) ? formatCurrency(v.insurance) : v.insurance) : (v.expenseType === "Insurance" && v.amount ? formatCurrency(v.amount) : "-")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.otherExpense ? (Number(v.otherExpense) ? formatCurrency(v.otherExpense) : v.otherExpense) : (v.expenseType === "Other" && v.amount ? formatCurrency(v.amount) : "-")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[#555555] whitespace-nowrap">
                          {v.aed || "-"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold whitespace-nowrap text-[#DC2626]">
                          {v.amount ? formatCurrency(v.amount) : (v.totalAmountDollar ? formatCurrency(v.totalAmountDollar) : "-")}
                        </td>
                        <td className="py-2 px-3 text-[#555555] whitespace-nowrap max-w-[150px] truncate">
                          {v.remark || "-"}
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
                {/* Section 1: Expense & Vendor Details */}
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                  <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                    1. Expense & Vendor Details
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
                        placeholder="e.g. EXP-1048"
                        value={formData.invoiceNo}
                        onChange={(e) => handleInputChange("invoiceNo", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        Ref Document No
                      </label>
                      <input
                        type="text"
                        placeholder="Ref / Doc / Job #"
                        value={formData.refDocumentNo}
                        onChange={(e) => handleInputChange("refDocumentNo", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        Company Name *
                      </label>
                      <select
                        value={formData.partyName}
                        onChange={(e) => handleInputChange("partyName", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                        required
                      >
                        <option value="">-- Select Company / Vendor --</option>
                        {allAvailableParties.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                        <option value="__custom__">+ Enter Custom Company Name</option>
                      </select>
                      {formErrors.partyName && (
                        <p className="text-[10px] text-red-600 mt-0.5">{formErrors.partyName}</p>
                      )}

                      {formData.partyName === "__custom__" && (
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Type Custom Company Name..."
                            value={formData.customParty}
                            onChange={(e) => handleInputChange("customParty", e.target.value)}
                            className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                            autoFocus
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        Expense Type *
                      </label>
                      <select
                        value={formData.expenseType || formData.serviceType || "Office Expense"}
                        onChange={(e) => {
                          handleInputChange("expenseType", e.target.value);
                          handleInputChange("serviceType", e.target.value);
                        }}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                        required
                      >
                        <option value="Office Expense">Office Expense</option>
                        <option value="Shipping & Logistics">Shipping & Logistics</option>
                        <option value="Professional Fees">Professional Fees</option>
                        <option value="Shipping / Freight">Shipping / Freight</option>
                        <option value="Government & Authority Fees">Government & Authority Fees</option>
                        <option value="Software & IT">Software & IT</option>
                        <option value="Bank & Finance">Bank & Finance</option>
                        <option value="Employee / Staff">Employee / Staff</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="Expense or service description..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Financials & Remarks */}
                <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                  <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                    2. Financials & Remarks
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        Amount $ *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => handleInputChange("amount", e.target.value)}
                        className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] font-mono font-bold text-[#DC2626] focus:outline-hidden focus:border-[#111111]"
                        required
                      />
                      {formErrors.amount && (
                        <p className="text-[10px] text-red-600 mt-0.5">{formErrors.amount}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                        Remark
                      </label>
                      <input
                        type="text"
                        placeholder="Remark..."
                        value={formData.remark}
                        onChange={(e) => handleInputChange("remark", e.target.value)}
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
                  <span className="font-semibold text-[#111111]">{deleteVoucherTarget.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Company:</span>
                  <span className="font-semibold text-[#111111]">{deleteVoucherTarget.companyName || deleteVoucherTarget.partyName}</span>
                </div>
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
                <span className="text-[10px] uppercase font-bold text-[#777777]">Company Name</span>
                <p className="font-bold text-sm text-[#111111]">{selectedVoucher.companyName || selectedVoucher.partyName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#FAFAF8] p-2.5 rounded border border-[#E8E8E4]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Expense Type</span>
                  <p className="font-semibold text-[#111111]">{selectedVoucher.expenseType || selectedVoucher.serviceType || "-"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Total Amount</span>
                  <p className="font-mono font-bold text-red-600">{formatCurrency(selectedVoucher.amount || selectedVoucher.totalAmountDollar)}</p>
                </div>
              </div>

              {selectedVoucher.description && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Description</span>
                  <p className="text-[#333333] bg-[#FAFAF8] p-2 rounded border border-[#E8E8E4]">{selectedVoucher.description}</p>
                </div>
              )}

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

export default ExpenseEntry;
