import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaSignOutAlt,
  FaArrowDown,
  FaFileExcel,
  FaFileCsv,
  FaTrash,
  FaEye,
  FaEdit,
  FaPrint,
} from "react-icons/fa";
import {
  getAllFirms,
  formatCurrency,
  getAuthUser,
} from "../../data/firmData";
import { useAuth } from "../../hooks/useAuth";
import { exportToCSV, exportToExcel } from "../../utils/excelExport";
import { VOUCHER_CONFIGS, STORAGE_KEY } from "./voucherConstants";

const PaymentEntryPage = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const voucherConfig = VOUCHER_CONFIGS["payment-entry"];
  const currentUser = authUser || getAuthUser();
  const allAvailableParties = getAllFirms();

  const [allVouchers, setAllVouchers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const typeVouchers = useMemo(() => {
    return allVouchers.filter((v) => v.entryType === voucherConfig.name);
  }, [allVouchers, voucherConfig.name]);

  const getInitialFormData = () => ({
    pDate: new Date().toISOString().split("T")[0],
    partyName: "",
    customParty: "",
    amount: "",
    paymentMode: "Bank Transfer",
    againstInvoice: "",
    aed: "",
    dpmsrNo: "",
    reportDate: "",
    dpmsrDueDate: "",
    daysLeft: "",
    remark: "",
  });

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

  const saveVouchersToStorage = (updated) => {
    setAllVouchers(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save vouchers", e);
    }
  };

  const getDaysLeft = (v) => {
    if (v.daysLeft !== undefined && v.daysLeft !== "" && v.daysLeft !== null) {
      return v.daysLeft;
    }
    if (!v.dpmsrDueDate) return "-";
    const due = new Date(v.dpmsrDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) ? "-" : diffDays;
  };

  const handleOpenEdit = (v) => {
    setEditingVoucher(v);
    const isStandardParty = allAvailableParties.some((p) => p.name === v.partyName);
    setFormData({
      pDate: v.pDate || v.date || new Date().toISOString().split("T")[0],
      partyName: isStandardParty ? v.partyName : "__custom__",
      customParty: isStandardParty ? "" : (v.partyName || ""),
      amount: v.amount ? String(v.amount) : "",
      paymentMode: v.paymentMode || "Bank Transfer",
      againstInvoice: v.againstInvoice || v.invoiceNo || "",
      aed: v.aed ? String(v.aed) : "",
      dpmsrNo: v.dpmsrNo || "",
      reportDate: v.reportDate || "",
      dpmsrDueDate: v.dpmsrDueDate || "",
      daysLeft: v.daysLeft !== undefined && v.daysLeft !== null ? String(v.daysLeft) : "",
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

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleInputChange = (field, val) => {
    const updated = { ...formData, [field]: val };
    if (field === "dpmsrDueDate") {
      if (val) {
        const due = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        updated.daysLeft = isNaN(diffDays) ? "" : String(diffDays);
      } else {
        updated.daysLeft = "";
      }
    }
    setFormData(updated);
  };

  const handlePrintDpmsr = (v) => {
    const printWindow = window.open("", "_blank");
    const content = `
      <html>
        <head>
          <title>DPMSR Print - ${v.dpmsrNo || v.partyName || "Voucher"}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #111; }
            .header { border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
            .badge { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 9px 12px; text-align: left; font-size: 12px; }
            th { background: #f8f8f8; font-weight: 600; width: 35%; }
            .footer { margin-top: 40px; display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px dashed #ccc; font-size: 11px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">ROYAL RAYS — PAYMENT ENTRY</div>
              <div style="font-size: 12px; color: #555; margin-top: 4px;">DPMSR Official Transaction Record</div>
            </div>
            <div class="badge">${v.dpmsrNo ? "DPMSR #" + v.dpmsrNo : "OFFICIAL VOUCHER"}</div>
          </div>
          <table>
            <tr><th>P.Date</th><td>${v.pDate || v.date || "-"}</td></tr>
            <tr><th>Party Name</th><td><strong>${v.partyName || "-"}</strong></td></tr>
            <tr><th>Paid Amount</th><td><strong>$${Number(v.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td></tr>
            <tr><th>Payment Mode</th><td>${v.paymentMode || "Bank Transfer"}</td></tr>
            <tr><th>Against Invoice</th><td>${v.againstInvoice || v.invoiceNo || "-"}</td></tr>
            <tr><th>AED</th><td>${v.aed ? "AED " + Number(v.aed).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}</td></tr>
            <tr><th>DPMSR No</th><td>${v.dpmsrNo || "-"}</td></tr>
            <tr><th>Report Date</th><td>${v.reportDate || "-"}</td></tr>
            <tr><th>DPMSR Due Date</th><td>${v.dpmsrDueDate || "-"}</td></tr>
            <tr><th>Days Left</th><td>${getDaysLeft(v)}</td></tr>
            <tr><th>Remarks / Reference</th><td>${v.remark || "-"}</td></tr>
          </table>
          <div class="footer">
            <div>Generated on: ${new Date().toLocaleString()}</div>
            <div>Authorized Signatory: ____________________</div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
    } else {
      window.print();
    }
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

    if (!formData.pDate) {
      errors.pDate = "P.Date is required";
    }

    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      errors.amount = "Valid Paid Amount is required";
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
              date: formData.pDate,
              pDate: formData.pDate,
              partyName: effectiveParty,
              purchaseParty: effectiveParty,
              invoiceNo: formData.againstInvoice,
              againstInvoice: formData.againstInvoice,
              amount: amt,
              totalAmountDollar: formData.amount,
              paymentMode: formData.paymentMode,
              aed: formData.aed ? parseFloat(formData.aed) : null,
              dpmsrNo: formData.dpmsrNo,
              reportDate: formData.reportDate,
              dpmsrDueDate: formData.dpmsrDueDate,
              daysLeft: formData.daysLeft,
              remark: formData.remark,
            }
          : item
      );
      saveVouchersToStorage(updated);
      setEditingVoucher(null);
      setIsAddModalOpen(false);
      setFormData(getInitialFormData());
      setFormErrors({});
      showToast(`✓ ${voucherConfig.name} entry updated successfully`);
      return;
    }

    const newVoucher = {
      id: "sig-" + Date.now(),
      date: formData.pDate,
      pDate: formData.pDate,
      entryType: voucherConfig.name,
      partyName: effectiveParty,
      purchaseParty: effectiveParty,
      invoiceNo: formData.againstInvoice,
      againstInvoice: formData.againstInvoice,
      amount: amt,
      totalAmountDollar: formData.amount,
      paymentMode: formData.paymentMode,
      aed: formData.aed ? parseFloat(formData.aed) : null,
      dpmsrNo: formData.dpmsrNo,
      reportDate: formData.reportDate,
      dpmsrDueDate: formData.dpmsrDueDate,
      daysLeft: formData.daysLeft,
      remark: formData.remark,
      crDr: voucherConfig.crDr,
      createdAt: new Date().toISOString(),
    };

    const updated = [newVoucher, ...allVouchers];
    saveVouchersToStorage(updated);
    setIsAddModalOpen(false);
    setFormData(getInitialFormData());
    setFormErrors({});
    showToast(`✓ New ${voucherConfig.name} entry recorded successfully`);
  };

  const filteredVouchers = useMemo(() => {
    if (!searchTerm.trim()) return typeVouchers;
    const term = searchTerm.toLowerCase();
    return typeVouchers.filter(
      (v) =>
        (v.partyName && v.partyName.toLowerCase().includes(term)) ||
        (v.againstInvoice && v.againstInvoice.toLowerCase().includes(term)) ||
        (v.invoiceNo && v.invoiceNo.toLowerCase().includes(term)) ||
        (v.dpmsrNo && v.dpmsrNo.toLowerCase().includes(term)) ||
        (v.reportDate && v.reportDate.toLowerCase().includes(term)) ||
        (v.dpmsrDueDate && v.dpmsrDueDate.toLowerCase().includes(term)) ||
        (v.paymentMode && v.paymentMode.toLowerCase().includes(term)) ||
        (v.remark && v.remark.toLowerCase().includes(term)) ||
        (v.pDate && v.pDate.includes(term)) ||
        (v.date && v.date.includes(term))
    );
  }, [typeVouchers, searchTerm]);

  const stats = useMemo(() => {
    const totalAmount = typeVouchers.reduce((acc, v) => acc + (Number(v.amount) || 0), 0);
    const count = typeVouchers.length;
    return { totalAmount, count };
  }, [typeVouchers]);

  const handleExportCSV = () => {
    const dataToExport = filteredVouchers.map((v) => ({
      "P.Date": v.pDate || v.date || "-",
      "Party Name": v.partyName || "-",
      "Paid Amount ($)": v.amount || 0,
      "Payment Mode": v.paymentMode || "Bank Transfer",
      "Against Invoice": v.againstInvoice || v.invoiceNo || "-",
      "AED": v.aed || 0,
      "DPMSR No": v.dpmsrNo || "-",
      "Report Date": v.reportDate || "-",
      "DPMSR Due Date": v.dpmsrDueDate || "-",
      "Days Left": getDaysLeft(v),
      "Remarks": v.remark || "-",
    }));
    exportToCSV(dataToExport, `${voucherConfig.slug}_entries_${new Date().toISOString().split("T")[0]}`);
  };

  const handleExportExcel = () => {
    const dataToExport = filteredVouchers.map((v) => ({
      "P.Date": v.pDate || v.date || "-",
      "Party Name": v.partyName || "-",
      "Paid Amount ($)": v.amount || 0,
      "Payment Mode": v.paymentMode || "Bank Transfer",
      "Against Invoice": v.againstInvoice || v.invoiceNo || "-",
      "AED": v.aed || 0,
      "DPMSR No": v.dpmsrNo || "-",
      "Report Date": v.reportDate || "-",
      "DPMSR Due Date": v.dpmsrDueDate || "-",
      "Days Left": getDaysLeft(v),
      "Remarks": v.remark || "-",
    }));
    exportToExcel(dataToExport, `${voucherConfig.slug}_entries_${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] flex flex-col font-sans">
      {/* Top Header Bar */}
      <div className="w-full bg-white border-b border-[#E0E0DB] px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
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
            <FaArrowDown style={{ color: voucherConfig.color }} size={14} />
            <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              {voucherConfig.name}
            </span>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
              style={{
                backgroundColor: voucherConfig.bg,
                color: voucherConfig.color,
                borderColor: voucherConfig.border,
              }}
            >
              DEBIT (DR)
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
            const isActive = v.slug === "payment-entry";
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
                Total Paid Amount
              </div>
              <div
                className="text-lg font-bold font-mono leading-tight mt-0.5"
                style={{ color: voucherConfig.color }}
              >
                {formatCurrency(stats.totalAmount)}
              </div>
              <div className="text-[10px] text-[#888888]">{voucherConfig.tagline}</div>
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
                Payment
              </div>
              <div className="text-[10px] text-[#888888]">Bank / Party Settlement</div>
            </div>

            <div className="px-3 py-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#777777]">
                Total Vouchers Count
              </div>
              <div className="text-lg font-bold font-mono leading-tight mt-0.5 text-[#111111]">
                {stats.count}
              </div>
              <div className="text-[10px] text-[#888888]">Recorded vouchers</div>
            </div>
          </div>
        </div>

        {/* Action Controls & Filters Bar */}
        <div className="bg-white border border-[#D1D1CB] rounded-sm p-3 mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <FaSearch
                size={11}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888888]"
              />
              <input
                type="text"
                placeholder="Search by party, against invoice, DPMSR no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#FAFAF8] border border-[#D1D1CB] rounded-sm text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111]"
                >
                  <FaTimes size={10} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-xs font-semibold text-[#15803D] transition-colors cursor-pointer"
              title="Export to Excel"
            >
              <FaFileExcel size={12} />
              <span className="hidden sm:inline">Excel</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-xs font-semibold text-[#1E40AF] transition-colors cursor-pointer"
              title="Export to CSV"
            >
              <FaFileCsv size={12} />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={() => {
                setFormData(getInitialFormData());
                setFormErrors({});
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow-2xs transition-all cursor-pointer"
            >
              <FaPlus size={10} />
              <span>Add Payment Entry</span>
            </button>
          </div>
        </div>

        {/* Standalone Payment Entry Table */}
        <div className="bg-white border border-[#D1D1CB] rounded-sm shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D1D1CB] bg-[#F5F5F2] text-[#555555] font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                  <th className="py-2.5 px-3">P.Date</th>
                  <th className="py-2.5 px-3">Party Name</th>
                  <th className="py-2.5 px-3 text-right">Paid Amount</th>
                  <th className="py-2.5 px-3 text-center">Payment Mode</th>
                  <th className="py-2.5 px-3">Against Invoice</th>
                  <th className="py-2.5 px-3 text-right">AED</th>
                  <th className="py-2.5 px-3">DPMSR No</th>
                  <th className="py-2.5 px-3">Report Date</th>
                  <th className="py-2.5 px-3">DPMSR Due Date</th>
                  <th className="py-2.5 px-3 text-center">Days Left</th>
                  <th className="py-2.5 px-3 text-center">DPMSR Print</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center py-10 text-xs text-[#888888]">
                      No {voucherConfig.name} vouchers found. Click "Add Payment Entry" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((v, idx) => (
                    <tr key={v.id || idx} className="hover:bg-[#F9F9F7] transition-colors">
                      <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap text-[#444444]">
                        {v.pDate || v.date || "-"}
                      </td>
                      <td className="py-2 px-3 font-semibold text-[#111111] whitespace-nowrap">
                        {v.partyName || "-"}
                      </td>
                      <td
                        className="py-2 px-3 text-right font-mono font-bold whitespace-nowrap"
                        style={{ color: voucherConfig.color }}
                      >
                        {formatCurrency(v.amount)}
                      </td>
                      <td className="py-2 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#F0F0EC] text-[#555555] border border-[#E0E0DB]">
                          {v.paymentMode || "Bank Transfer"}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-[#444444] whitespace-nowrap">
                        {v.againstInvoice || v.invoiceNo || "-"}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-[#111111] whitespace-nowrap">
                        {v.aed ? `AED ${Number(v.aed).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-[#444444] whitespace-nowrap">
                        {v.dpmsrNo || "-"}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-[#555555] whitespace-nowrap">
                        {v.reportDate || "-"}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-[#555555] whitespace-nowrap">
                        {v.dpmsrDueDate || "-"}
                      </td>
                      <td className="py-2 px-3 text-center whitespace-nowrap">
                        {(() => {
                          const dl = getDaysLeft(v);
                          if (dl === "-") return <span className="text-[#888888]">-</span>;
                          const n = Number(dl);
                          if (n < 0) {
                            return (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5]">
                                {Math.abs(n)}d overdue
                              </span>
                            );
                          }
                          return (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                              {n} Days
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-2 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handlePrintDpmsr(v)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-[#F5F5F2] hover:bg-[#111111] hover:text-white border border-[#D1D1CB] text-[11px] font-semibold text-[#333333] transition-colors cursor-pointer"
                          title="Print DPMSR Report"
                        >
                          <FaPrint size={10} />
                          <span>Print</span>
                        </button>
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
      </main>

      {/* Standalone Add/Edit Payment Entry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D1D1CB] rounded-sm max-w-2xl w-full p-5 shadow-2xl animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E0E0DB] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FaArrowDown style={{ color: voucherConfig.color }} size={16} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                  {editingVoucher ? `Edit ${voucherConfig.name}` : `New ${voucherConfig.name}`}
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

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              {/* Section 1: Basic Voucher Details */}
              <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                  1. Basic Voucher Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                      P.Date *
                    </label>
                    <input
                      type="date"
                      value={formData.pDate}
                      onChange={(e) => handleInputChange("pDate", e.target.value)}
                      className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                      required
                    />
                    {formErrors.pDate && (
                      <p className="text-[10px] text-red-600 mt-0.5">{formErrors.pDate}</p>
                    )}
                  </div>

                  <div>
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

              {/* Section 2: Financial & Payment Figures */}
              <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                  2. Financial & Payment Figures
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                      Paid Amount ($) *
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
                      Payment Mode
                    </label>
                    <select
                      value={formData.paymentMode}
                      onChange={(e) => handleInputChange("paymentMode", e.target.value)}
                      className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Cash">Cash</option>
                      <option value="Dubai Wire">Dubai Wire</option>
                      <option value="Angadia">Angadia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                      Against Invoice
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. INV-1048 / LOT-A"
                      value={formData.againstInvoice}
                      onChange={(e) => handleInputChange("againstInvoice", e.target.value)}
                      className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                    />
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
                      className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] font-mono font-bold focus:outline-hidden focus:border-[#111111]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: DPMSR & Compliance Tracking */}
              <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                  3. DPMSR & Compliance Tracking
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                      DPMSR No
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DP-88912"
                      value={formData.dpmsrNo}
                      onChange={(e) => handleInputChange("dpmsrNo", e.target.value)}
                      className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                      Report Date
                    </label>
                    <input
                      type="date"
                      value={formData.reportDate}
                      onChange={(e) => handleInputChange("reportDate", e.target.value)}
                      className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                      DPMSR Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dpmsrDueDate}
                      onChange={(e) => handleInputChange("dpmsrDueDate", e.target.value)}
                      className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
                      Days Left (Auto)
                    </label>
                    <input
                      type="number"
                      placeholder="Auto / enter days"
                      value={formData.daysLeft}
                      onChange={(e) => handleInputChange("daysLeft", e.target.value)}
                      className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] font-mono focus:outline-hidden focus:border-[#111111]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Remarks & Reference */}
              <div className="bg-[#FAFAF8] p-3 rounded border border-[#E8E8E4] space-y-2.5">
                <div className="text-[10px] uppercase font-bold text-[#111111] tracking-wider border-b border-[#E0E0DB] pb-1">
                  4. Remarks & Reference
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter transaction notes, payment reference..."
                    value={formData.remark}
                    onChange={(e) => handleInputChange("remark", e.target.value)}
                    className="w-full bg-white border border-[#D1D1CB] rounded-sm px-2.5 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  />
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
                  <span>{editingVoucher ? "Update Payment Entry" : "Save Payment Entry"}</span>
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
                  <span className="font-semibold text-[#111111]">{deleteVoucherTarget.partyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Amount:</span>
                  <span className="font-bold text-red-600">
                    {formatCurrency(deleteVoucherTarget.amount)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#888888] italic">
                This action cannot be undone and will update ledger and balances immediately.
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
                <FaArrowDown style={{ color: voucherConfig.color }} size={16} />
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
                  <span className="text-[10px] uppercase font-bold text-[#777777]">P.Date</span>
                  <p className="font-mono font-semibold">{selectedVoucher.pDate || selectedVoucher.date}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Payment Mode</span>
                  <p className="font-semibold text-[#333333]">{selectedVoucher.paymentMode || "Bank Transfer"}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#777777]">Party Name</span>
                <p className="font-bold text-sm text-[#111111]">{selectedVoucher.partyName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#FAFAF8] p-2.5 rounded border border-[#E8E8E4]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Paid Amount</span>
                  <p
                    className="font-mono font-bold text-base"
                    style={{ color: voucherConfig.color }}
                  >
                    {formatCurrency(selectedVoucher.amount)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">AED</span>
                  <p className="font-mono font-bold text-sm text-[#111111]">
                    {selectedVoucher.aed ? `AED ${Number(selectedVoucher.aed).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#FAFAF8] p-2.5 rounded border border-[#E8E8E4]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Against Invoice</span>
                  <p className="font-mono font-semibold text-[#111111]">
                    {selectedVoucher.againstInvoice || selectedVoucher.invoiceNo || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">DPMSR No</span>
                  <p className="font-mono font-semibold text-[#111111]">
                    {selectedVoucher.dpmsrNo || "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#FAFAF8] p-2.5 rounded border border-[#E8E8E4]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Report Date</span>
                  <p className="font-mono font-semibold">{selectedVoucher.reportDate || "-"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">DPMSR Due Date</span>
                  <p className="font-mono font-semibold">{selectedVoucher.dpmsrDueDate || "-"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Days Left</span>
                  <p className="font-mono font-semibold">{getDaysLeft(selectedVoucher)}</p>
                </div>
              </div>

              {selectedVoucher.remark && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777777]">Remarks</span>
                  <p className="text-[#555555] italic bg-[#F9F9F7] p-2 rounded border border-[#EAEAEA]">
                    "{selectedVoucher.remark}"
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#E0E0DB] pt-3">
              <button
                type="button"
                onClick={() => handlePrintDpmsr(selectedVoucher)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#F5F5F2] hover:bg-[#111111] hover:text-white border border-[#D1D1CB] text-xs font-semibold transition-colors cursor-pointer"
              >
                <FaPrint size={11} />
                <span>Print DPMSR</span>
              </button>

              <button
                onClick={() => setSelectedVoucher(null)}
                className="px-4 py-1.5 rounded-sm bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111111] text-white px-4 py-2.5 rounded-sm shadow-xl flex items-center gap-2 text-xs font-medium border border-gold-500/30">
          <FaCheckCircle className="text-emerald-400" size={13} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default PaymentEntryPage;
