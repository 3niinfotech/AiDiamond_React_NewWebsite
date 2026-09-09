import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaBook,
  FaPlus,
  FaSearch,
  FaFileExcel,
  FaFileCsv,
  FaTrash,
  FaEdit,
  FaEye,
  FaArrowLeft,
  FaTimes,
  FaCheckCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import {
  FIRMS_CONFIG,
  getFirmById,
  getFirmRecords,
  saveFirmRecords,
  calculateFirmSummary,
  formatCurrency,
} from "../../data/firmData";
import { exportToCSV, exportToExcel } from "../../utils/excelExport";

const FirmBookLedger = () => {
  const { firmId } = useParams();
  const navigate = useNavigate();

  const currentFirm = useMemo(() => getFirmById(firmId), [firmId]);
  const [records, setRecords] = useState([]);

  // Multi-select Checkbox State
  const [selectedIds, setSelectedIds] = useState([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCrDr, setSelectedCrDr] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  // Sorting
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  // Form Fields
  const initialFormState = {
    date: new Date().toISOString().split("T")[0],
    description: "",
    type: "Bank",
    aed: "",
    crDr: "CR",
    amount: "",
    remark: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const loaded = getFirmRecords(currentFirm.id);
    setRecords(loaded);
    setSelectedIds([]);
  }, [currentFirm.id]);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const summary = useMemo(() => calculateFirmSummary(records), [records]);

  // Recalculate dynamic running balance
  const recordsWithBalance = useMemo(() => {
    let running = 0;
    return records.map((item) => {
      const isCr = item.crDr === "CR" || Number(item.credit) > 0;
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
  }, [records]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return recordsWithBalance.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.type && item.type.toLowerCase().includes(q)) ||
        (item.remark && item.remark.toLowerCase().includes(q)) ||
        (item.date && item.date.toLowerCase().includes(q));

      const matchesType = selectedType === "All" || item.type === selectedType;
      const matchesCrDr = selectedCrDr === "All" || item.crDr === selectedCrDr;

      let matchesDate = true;
      if (dateFilter !== "All") {
        const itemDate = new Date(item.date);
        const now = new Date();
        if (dateFilter === "7days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          matchesDate = itemDate >= sevenDaysAgo;
        } else if (dateFilter === "30days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          matchesDate = itemDate >= thirtyDaysAgo;
        } else if (dateFilter === "thisMonth") {
          matchesDate =
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear();
        }
      }

      return matchesSearch && matchesType && matchesCrDr && matchesDate;
    });
  }, [recordsWithBalance, searchQuery, selectedType, selectedCrDr, dateFilter]);

  // Sorted Records
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "amount" || sortField === "aed" || sortField === "bal" || sortField === "runningBal") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortField === "date") {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      } else {
        aVal = (aVal || "").toString().toLowerCase();
        bVal = (bVal || "").toString().toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortField, sortDirection]);

  // Checkbox Multi-selection handlers
  const isAllSelected = useMemo(() => {
    return sortedRecords.length > 0 && selectedIds.length === sortedRecords.length;
  }, [sortedRecords, selectedIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedRecords.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setSelectedRecord(null);
    setFormData({
      ...initialFormState,
      date: new Date().toISOString().split("T")[0],
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setIsEditMode(true);
    setSelectedRecord(record);
    setFormData({
      date: record.date || new Date().toISOString().split("T")[0],
      description: record.description || record.partyName || "",
      type: record.type || "Bank",
      aed: record.aed ? String(record.aed) : "",
      crDr: record.crDr || (record.credit > 0 ? "CR" : "DR"),
      amount: record.amount || record.credit || record.debit || "",
      remark: record.remark || record.remarks || "",
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleOpenDeleteModal = (record) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.date) errors.date = "Date is required";
    if (!formData.description?.trim()) errors.description = "Description is required";
    if (!formData.amount || Number(formData.amount) <= 0) errors.amount = "Valid amount is required";
    if (!formData.type) errors.type = "Type is required";
    if (!formData.crDr) errors.crDr = "Select CR or DR";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const amt = Number(formData.amount) || 0;
    const isCr = formData.crDr === "CR";
    const aedVal = formData.aed ? Number(formData.aed) : 0;

    let updatedList = [];
    if (isEditMode && selectedRecord) {
      updatedList = records.map((r) =>
        r.id === selectedRecord.id
          ? {
              ...r,
              date: formData.date,
              description: formData.description.trim(),
              type: formData.type,
              aed: aedVal,
              crDr: formData.crDr,
              amount: amt,
              credit: isCr ? amt : 0,
              debit: !isCr ? amt : 0,
              remark: formData.remark.trim(),
            }
          : r
      );
      showToast("Entry updated successfully");
    } else {
      const newEntry = {
        id: `rec-${currentFirm.id}-${Date.now()}`,
        date: formData.date,
        description: formData.description.trim(),
        type: formData.type,
        aed: aedVal,
        crDr: formData.crDr,
        amount: amt,
        credit: isCr ? amt : 0,
        debit: !isCr ? amt : 0,
        remark: formData.remark.trim(),
      };
      updatedList = [newEntry, ...records];
      showToast("New Data Entry added");
    }

    setRecords(updatedList);
    saveFirmRecords(currentFirm.id, updatedList);
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!selectedRecord) return;
    const updatedList = records.filter((r) => r.id !== selectedRecord.id);
    setRecords(updatedList);
    saveFirmRecords(currentFirm.id, updatedList);
    setIsDeleteModalOpen(false);
    showToast("Entry deleted", "warning");
    setSelectedRecord(null);
  };

  const handleExportCSV = () => {
    exportToCSV(sortedRecords, `${currentFirm.shortCode}_Ledger`);
    showToast("Exported to CSV");
  };

  const handleExportExcel = () => {
    exportToExcel(sortedRecords, currentFirm.name, `${currentFirm.shortCode}_Ledger`);
    showToast("Exported to Excel (.xls)");
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAF8] text-[#111111] font-sans flex flex-col pb-12 selection:bg-black selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-sm shadow-md border text-xs font-semibold flex items-center gap-2 ${
            toastMessage.type === "warning"
              ? "bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]"
              : "bg-[#F0FDF4] border-[#86EFAC] text-[#166534]"
          }`}
        >
          <FaCheckCircle className={toastMessage.type === "warning" ? "text-[#DC2626]" : "text-[#16A34A]"} size={14} />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Unified Top Navigation Bar (Zero Overlap & Proportional Logo) */}
      <div className="w-full bg-white border-b border-[#E8E8E4] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
        {/* Left: Back Link + Active Firm Title + Badge */}
        <div className="flex items-center gap-3">
          <Link
            to="/firms"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#F5F5F2] hover:bg-[#EBEBE6] border border-[#E0E0DB] text-xs font-semibold text-[#333333] transition-colors"
          >
            <FaArrowLeft size={10} />
            <span>All Books</span>
          </Link>
          <h1 className="text-base font-serif font-bold text-[#111111]">
            {currentFirm.name}
          </h1>
          <span className="text-[11px] uppercase font-mono font-medium px-2 py-0.5 rounded-xs bg-[#F5F5F2] text-[#444444] border border-[#E0E0DB]">
            {currentFirm.badge}
          </span>
        </div>

        {/* Right: Switcher + Export Buttons + Add Entry (No Print Button) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={currentFirm.id}
            onChange={(e) => navigate(`/firms/${e.target.value}`)}
            className="px-3 py-1.5 bg-white border border-[#D1D1CB] rounded-sm text-xs font-semibold text-[#111111] focus:border-black outline-none cursor-pointer"
          >
            {FIRMS_CONFIG.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.shortCode})
              </option>
            ))}
          </select>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white hover:bg-[#F0FDF4] border border-[#D1D1CB] hover:border-[#86EFAC] text-xs text-[#166534] font-semibold transition-colors cursor-pointer"
            title="Export Excel"
          >
            <FaFileExcel className="text-[#16A34A]" size={13} />
            <span>Excel</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-xs text-[#333333] font-semibold transition-colors cursor-pointer"
            title="Export CSV"
          >
            <FaFileCsv size={13} />
            <span>CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <FaPlus size={10} />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <main className="flex-1 w-full px-4 sm:px-8 pt-4">
        {/* KPI Compact Metric Summary Strip */}
        <div className="bg-white border border-[#D1D1CB] rounded-sm p-2 sm:p-3 mb-3.5 shadow-2xs">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E0E0DB]">
            {/* 1. Total Records */}
            <div className="px-3 py-1.5 sm:py-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#777777]">
                Total Records
              </div>
              <div className="text-lg font-bold text-[#111111] leading-tight">
                {summary.totalCount} Rows
              </div>
              <div className="text-[10px] text-[#777777]">
                <span>{summary.crCount} CR</span> • <span>{summary.drCount} DR</span>
              </div>
            </div>

            {/* 2. Total Inflow (CR) */}
            <div className="px-3 py-1.5 sm:py-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#166534]">
                Total Inflow (CR)
              </div>
              <div className="text-lg font-bold text-[#16A34A] leading-tight font-mono">
                {formatCurrency(summary.totalCredit)}
              </div>
              <div className="text-[10px] text-[#777777]">
                Receipts & Sales
              </div>
            </div>

            {/* 3. Total Outflow (DR) */}
            <div className="px-3 py-1.5 sm:py-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#991B1B]">
                Total Outflow (DR)
              </div>
              <div className="text-lg font-bold text-[#DC2626] leading-tight font-mono">
                {formatCurrency(summary.totalDebit)}
              </div>
              <div className="text-[10px] text-[#777777]">
                Payments & Purchases
              </div>
            </div>

            {/* 4. Net Balance (Bal) */}
            <div className="px-3 py-1.5 sm:py-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#111111]">
                Net Balance (Bal)
              </div>
              <div
                className={`text-lg font-bold font-mono leading-tight ${
                  summary.netBalance >= 0 ? "text-[#111111]" : "text-[#DC2626]"
                }`}
              >
                {formatCurrency(summary.netBalance)}
              </div>
              <div className="text-[10px] text-[#777777]">
                {summary.totalAed > 0 ? formatCurrency(summary.totalAed, "AED") : "Active Ledger Balance"}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar - Balanced Proportions & Fixed Responsive Inputs */}
        <div className="bg-white p-3 rounded-sm border border-[#E0E0DB] mb-3.5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-2xs">
          {/* Search Input Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] text-xs pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Date, Description, Type, Remark..."
              className="w-full pl-9 pr-7 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-[#111111] placeholder-[#999999] outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999999] hover:text-black cursor-pointer"
              >
                <FaTimes size={11} />
              </button>
            )}
          </div>

          {/* Clean Dropdowns and Reset Button */}
          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full sm:w-36 px-3 py-2 bg-white border border-[#D1D1CB] rounded-sm text-xs font-medium text-[#111111] outline-none focus:border-black cursor-pointer transition-colors"
            >
              <option value="All">All Types</option>
              <option value="Bank">Bank</option>
              <option value="Cash">Cash</option>
              <option value="Angadia">Angadia</option>
              <option value="Dubai Wire">Dubai Wire</option>
              <option value="Cheque">Cheque</option>
            </select>

            <select
              value={selectedCrDr}
              onChange={(e) => setSelectedCrDr(e.target.value)}
              className="w-full sm:w-36 px-3 py-2 bg-white border border-[#D1D1CB] rounded-sm text-xs font-medium text-[#111111] outline-none focus:border-black cursor-pointer transition-colors"
            >
              <option value="All">All CR & DR</option>
              <option value="CR">CR (Credit)</option>
              <option value="DR">DR (Debit)</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-36 px-3 py-2 bg-white border border-[#D1D1CB] rounded-sm text-xs font-medium text-[#111111] outline-none focus:border-black cursor-pointer transition-colors"
            >
              <option value="All">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
            </select>

            {(searchQuery || selectedType !== "All" || selectedCrDr !== "All" || dateFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("All");
                  setSelectedCrDr("All");
                  setDateFilter("All");
                }}
                className="px-3.5 py-2 rounded-sm bg-[#F5F5F2] hover:bg-[#EBEBE6] border border-[#E0E0DB] text-xs font-medium text-[#333333] hover:text-black cursor-pointer transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            GRID TABLE WITH ROW & COLUMN BORDERS AND EXACT FIELD ALIGNMENTS
            - [Checkbox] (Center)
            - Date (Center)
            - Description (Left)
            - Type (Center)
            - AED (Right)
            - CR / DR (Center)
            - Amount (Right) -> STRICT RIGHT
            - Bal (Right)    -> STRICT RIGHT
            - Remark (Left)
            - Action (Center) -> BIGGER BUTTONS
        ========================================================================= */}
        <div className="w-full bg-white border border-[#D1D1CB] rounded-sm overflow-hidden shadow-2xs">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] border-collapse text-xs">
              {/* Table Head with Column Borders & Aligned Titles */}
              <thead>
                <tr className="bg-[#F5F5F2] border-b border-[#D1D1CB] text-[#333333] uppercase tracking-wider text-[11px]">
                  {/* 0. Checkbox Master Select */}
                  <th className="py-1.5 px-2.5 text-center border-r border-[#D1D1CB] w-9">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="w-3.5 h-3.5 rounded-xs border-[#D1D1CB] text-black focus:ring-black cursor-pointer align-middle"
                      title="Select all rows"
                    />
                  </th>

                  {/* 1. Date - Center */}
                  <th
                    onClick={() => handleSort("date")}
                    className="py-1.5 px-3 font-semibold text-center border-r border-[#D1D1CB] cursor-pointer hover:bg-[#EBEBE6] whitespace-nowrap select-none"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Date</span>
                      {sortField === "date" ? (
                        sortDirection === "asc" ? <FaSortUp className="text-black" /> : <FaSortDown className="text-black" />
                      ) : (
                        <FaSort className="text-[#BBBBBB]" />
                      )}
                    </div>
                  </th>

                  {/* 2. Description - Left */}
                  <th
                    onClick={() => handleSort("description")}
                    className="py-1.5 px-3.5 font-semibold text-left border-r border-[#D1D1CB] cursor-pointer hover:bg-[#EBEBE6] select-none"
                  >
                    <div className="flex items-center justify-start gap-1">
                      <span>Description</span>
                      {sortField === "description" ? (
                        sortDirection === "asc" ? <FaSortUp className="text-black" /> : <FaSortDown className="text-black" />
                      ) : (
                        <FaSort className="text-[#BBBBBB]" />
                      )}
                    </div>
                  </th>

                  {/* 3. Type - Center */}
                  <th className="py-1.5 px-3 font-semibold text-center border-r border-[#D1D1CB] whitespace-nowrap">
                    Type
                  </th>

                  {/* 4. AED (Optional) - Right */}
                  <th
                    onClick={() => handleSort("aed")}
                    className="py-1.5 px-3 font-semibold text-right border-r border-[#D1D1CB] cursor-pointer hover:bg-[#EBEBE6] whitespace-nowrap select-none"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>AED</span>
                      {sortField === "aed" ? (
                        sortDirection === "asc" ? <FaSortUp className="text-black" /> : <FaSortDown className="text-black" />
                      ) : (
                        <FaSort className="text-[#BBBBBB]" />
                      )}
                    </div>
                  </th>

                  {/* 5. CR / DR - Center */}
                  <th className="py-1.5 px-3 font-semibold text-center border-r border-[#D1D1CB] whitespace-nowrap">
                    CR / DR
                  </th>

                  {/* 6. Amount - Strictly Right Aligned */}
                  <th
                    onClick={() => handleSort("amount")}
                    className="py-1.5 px-3.5 font-semibold text-right border-r border-[#D1D1CB] cursor-pointer hover:bg-[#EBEBE6] whitespace-nowrap select-none"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Amount</span>
                      {sortField === "amount" ? (
                        sortDirection === "asc" ? <FaSortUp className="text-black" /> : <FaSortDown className="text-black" />
                      ) : (
                        <FaSort className="text-[#BBBBBB]" />
                      )}
                    </div>
                  </th>

                  {/* 7. Bal (Running Balance) - Strictly Right Aligned */}
                  <th
                    onClick={() => handleSort("bal")}
                    className="py-1.5 px-3.5 font-semibold text-right border-r border-[#D1D1CB] cursor-pointer hover:bg-[#EBEBE6] whitespace-nowrap select-none"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Bal</span>
                      {sortField === "bal" ? (
                        sortDirection === "asc" ? <FaSortUp className="text-black" /> : <FaSortDown className="text-black" />
                      ) : (
                        <FaSort className="text-[#BBBBBB]" />
                      )}
                    </div>
                  </th>

                  {/* 8. Remark - Left */}
                  <th className="py-1.5 px-3 font-semibold text-left border-r border-[#D1D1CB]">
                    Remark
                  </th>

                  {/* 9. Action - Center */}
                  <th className="py-1.5 px-3 font-semibold text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Table Body with Row & Column Grid Borders and Compact Height */}
              <tbody>
                {sortedRecords.length > 0 ? (
                  sortedRecords.map((row) => {
                    const isCr = row.crDr === "CR" || row.credit > 0;
                    const amountVal = row.amount || (isCr ? row.credit : row.debit) || 0;
                    const isSelected = selectedIds.includes(row.id);

                    return (
                      <tr
                        key={row.id}
                        className={`border-b border-[#D1D1CB] transition-colors ${
                          isSelected ? "bg-[#F3F4EE] hover:bg-[#ECEEE6]" : "hover:bg-[#F9F9F6]"
                        }`}
                      >
                        {/* 0. Row Checkbox */}
                        <td className="py-1.5 px-2.5 text-center border-r border-[#D1D1CB]">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(row.id)}
                            className="w-3.5 h-3.5 rounded-xs border-[#D1D1CB] text-black focus:ring-black cursor-pointer align-middle"
                          />
                        </td>

                        {/* 1. Date - Center */}
                        <td className="py-1.5 px-3 text-center border-r border-[#D1D1CB] font-mono whitespace-nowrap text-xs text-[#333333]">
                          {row.date}
                        </td>

                        {/* 2. Description - Left */}
                        <td className="py-1.5 px-3.5 text-left border-r border-[#D1D1CB] text-xs font-semibold text-[#111111]">
                          {row.description || row.partyName}
                        </td>

                        {/* 3. Type - Center */}
                        <td className="py-1.5 px-3 text-center border-r border-[#D1D1CB] whitespace-nowrap text-xs text-[#333333] font-medium">
                          {row.type}
                        </td>

                        {/* 4. AED - Right */}
                        <td className="py-1.5 px-3 text-right border-r border-[#D1D1CB] font-mono text-xs whitespace-nowrap">
                          {row.aed && Number(row.aed) > 0 ? (
                            <span className="text-[#996600] font-semibold">
                              {Number(row.aed).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-[#CCCCCC]">-</span>
                          )}
                        </td>

                        {/* 5. CR / DR - Center */}
                        <td className="py-1.5 px-3 text-center border-r border-[#D1D1CB] whitespace-nowrap text-xs">
                          <span
                            className={`inline-block min-w-[40px] px-1.5 py-0.2 rounded-full text-[10px] font-bold tracking-wider text-center ${
                              isCr
                                ? "bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]"
                                : "bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]"
                            }`}
                          >
                            {isCr ? "CR" : "DR"}
                          </span>
                        </td>

                        {/* 6. Amount - Strictly Right Aligned */}
                        <td className="py-1.5 px-3.5 text-right border-r border-[#D1D1CB] font-semibold whitespace-nowrap text-xs">
                          <span className={isCr ? "text-[#166534]" : "text-[#991B1B]"}>
                            {formatCurrency(amountVal)}
                          </span>
                        </td>

                        {/* 7. Bal (Running Balance) - Strictly Right Aligned */}
                        <td className="py-1.5 px-3.5 text-right border-r border-[#D1D1CB] font-mono font-bold whitespace-nowrap text-xs">
                          <span
                            className={
                              (row.runningBal || row.bal || 0) >= 0 ? "text-[#111111]" : "text-[#DC2626]"
                            }
                          >
                            {formatCurrency(row.runningBal || row.bal || 0)}
                          </span>
                        </td>

                        {/* 8. Remark - Left */}
                        <td className="py-1.5 px-3 text-left border-r border-[#D1D1CB] text-xs text-[#555555]">
                          {row.remark || row.remarks || "-"}
                        </td>

                        {/* 9. Action - Balanced, crisp buttons */}
                        <td className="py-1.5 px-2.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenViewModal(row)}
                              className="w-7 h-7 rounded-sm bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-[#444444] hover:text-black flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                              title="View Details"
                            >
                              <FaEye size={12} />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(row)}
                              className="w-7 h-7 rounded-sm bg-white hover:bg-[#F0FDF4] border border-[#D1D1CB] hover:border-[#86EFAC] text-[#166534] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                              title="Edit Entry"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(row)}
                              className="w-7 h-7 rounded-sm bg-white hover:bg-[#FEF2F2] border border-[#D1D1CB] hover:border-[#FCA5A5] text-[#DC2626] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                              title="Delete Entry"
                            >
                              <FaTrash size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="py-10 text-center text-[#777777]">
                      <FaBook className="mx-auto text-[#CCCCCC] text-2xl mb-2" />
                      <p className="text-sm text-[#333333] font-semibold">No ledger records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="py-2.5 px-4 bg-[#FAFAF8] border-t border-[#D1D1CB] flex items-center justify-between text-xs text-[#555555] font-medium">
            <span>
              Showing <strong>{sortedRecords.length}</strong> records (Full List • No Pagination)
            </span>
            <span>{currentFirm.name} Bourse Ledger</span>
          </div>
        </div>
      </main>

      {/* =========================================================================
          MODAL 1: ADD / UPDATE DATA ENTRY FORM (Clean, Compact max-w-lg, Left-Aligned Fields)
      ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-[#D1D1CB] rounded-sm shadow-xl overflow-hidden">
            <div className="px-5 py-3 bg-[#FAFAF8] border-b border-[#E8E8E4] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                {isEditMode ? "Update Data Entry Form" : "New Data Entry Form"} — {currentFirm.name}
              </span>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-[#777777] hover:text-black cursor-pointer rounded-sm hover:bg-[#EBEBE6] transition-colors"
              >
                <FaTimes size={13} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] outline-none"
                  />
                  {formErrors.date && (
                    <span className="text-[11px] text-[#DC2626] block mt-1">{formErrors.date}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] outline-none cursor-pointer"
                  >
                    <option value="Bank">Bank</option>
                    <option value="Cash">Cash</option>
                    <option value="Angadia">Angadia</option>
                    <option value="Dubai Wire">Dubai Wire</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Description / Party Name *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter party name or description"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                />
                {formErrors.description && (
                  <span className="text-[11px] text-[#DC2626] block mt-1">{formErrors.description}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                    CR / DR *
                  </label>
                  <select
                    value={formData.crDr}
                    onChange={(e) => setFormData({ ...formData, crDr: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] outline-none cursor-pointer"
                  >
                    <option value="CR">CR (Credit / Inflow)</option>
                    <option value="DR">DR (Debit / Outflow)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Enter transaction amount"
                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                  />
                  {formErrors.amount && (
                    <span className="text-[11px] text-[#DC2626] block mt-1">{formErrors.amount}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  AED Amount (Optional)
                </label>
                <input
                  type="number"
                  value={formData.aed}
                  onChange={(e) => setFormData({ ...formData, aed: e.target.value })}
                  placeholder="Enter AED amount (if applicable)"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Remark / Note
                </label>
                <input
                  type="text"
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  placeholder="Enter reference note or voucher details"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E8E8E4] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-sm bg-[#F5F5F2] hover:bg-[#EBEBE6] text-xs font-semibold text-[#444444] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-2xs hover:shadow-xs transition-colors"
                >
                  {isEditMode ? "Save Changes" : "Add Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: VIEW DETAILS MODAL (Clean, Compact max-w-lg)
      ========================================================================= */}
      {isViewModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-[#D1D1CB] rounded-sm shadow-xl overflow-hidden">
            <div className="px-5 py-3 bg-[#FAFAF8] border-b border-[#E8E8E4] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Voucher Details — {currentFirm.name}
              </span>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 text-[#777777] hover:text-black cursor-pointer rounded-sm hover:bg-[#EBEBE6] transition-colors"
              >
                <FaTimes size={13} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-1">Date</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedRecord.date || ""}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#D1D1CB] rounded-sm text-xs text-left text-[#111111] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-1">Type</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedRecord.type || ""}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#D1D1CB] rounded-sm text-xs text-left text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-1">Description / Party</label>
                <input
                  type="text"
                  readOnly
                  value={selectedRecord.description || selectedRecord.partyName || ""}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#D1D1CB] rounded-sm text-xs text-left text-[#111111] font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-1">CR / DR</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedRecord.crDr === "CR" ? "CR (Credit / Inflow)" : "DR (Debit / Outflow)"}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#D1D1CB] rounded-sm text-xs text-left font-semibold text-[#111111] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-1">Amount</label>
                  <input
                    type="text"
                    readOnly
                    value={formatCurrency(selectedRecord.amount || selectedRecord.credit || selectedRecord.debit)}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#D1D1CB] rounded-sm text-xs text-left font-semibold text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-1">AED</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedRecord.aed && Number(selectedRecord.aed) > 0 ? `${Number(selectedRecord.aed).toLocaleString()} AED` : "-"}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#D1D1CB] rounded-sm text-xs text-left text-[#111111] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-1">Running Balance</label>
                  <input
                    type="text"
                    readOnly
                    value={formatCurrency(selectedRecord.runningBal || selectedRecord.bal || 0)}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#D1D1CB] rounded-sm text-xs text-left font-semibold text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-1">Remark</label>
                <input
                  type="text"
                  readOnly
                  value={selectedRecord.remark || selectedRecord.remarks || "-"}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#D1D1CB] rounded-sm text-xs text-left text-[#555555] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E8E8E4] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 rounded-sm bg-[#F5F5F2] hover:bg-[#EBEBE6] text-xs font-semibold text-[#444444] cursor-pointer transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleOpenEditModal(selectedRecord);
                  }}
                  className="px-5 py-2 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Edit Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: DELETE SINGLE CONFIRMATION
      ========================================================================= */}
      {isDeleteModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white border border-[#D1D1CB] rounded-sm shadow-xl p-5 text-center">
            <h3 className="text-sm font-bold text-[#111111] mb-1.5">Delete Entry?</h3>
            <p className="text-xs text-[#666666] mb-4">
              Are you sure you want to delete entry for <strong>{selectedRecord.description || selectedRecord.date}</strong>?
            </p>

            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-1.5 rounded-sm bg-[#F5F5F2] hover:bg-[#EBEBE6] text-xs font-semibold text-[#444444] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-sm bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirmBookLedger;
