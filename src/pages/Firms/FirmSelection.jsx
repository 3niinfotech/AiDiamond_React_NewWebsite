import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBook,
  FaArrowRight,
  FaSearch,
  FaSignOutAlt,
  FaBuilding,
  FaExchangeAlt,
  FaUsers,
  FaFileSignature,
  FaTag,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import {
  getAllFirms,
  getFirmRecords,
  calculateFirmSummary,
  formatCurrency,
  getAuthUser,
} from "../../data/firmData";
import { useAuth } from "../../hooks/useAuth";
import { rsFirmBookMasterService } from "../../services/rsFirmBookMasterService";
import { rsFirmLedgerEntryService } from "../../services/rsFirmLedgerEntryService";

const FirmSelection = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [firms, setFirms] = useState([]);
  const [firmStats, setFirmStats] = useState({});
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Create Firm Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    firmName: "",
    shortCode: "",
    tagline: "",
    description: "",
    openingBalance: "0",
    openingBalType: "CR",
  });
  const [createErrors, setCreateErrors] = useState({});

  // Edit Firm Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firmName: "",
    shortCode: "",
    tagline: "",
    description: "",
    openingBalance: "0",
    openingBalType: "CR",
  });
  const [editErrors, setEditErrors] = useState({});

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const user = authUser || getAuthUser();
    if (!user) {
      setCurrentUser({ name: "RSDXB", username: "RSDXB" });
    } else {
      setCurrentUser(user);
    }

    loadFirmBooks();
  }, [authUser]);

  const loadFirmBooks = async () => {
    const res = await rsFirmBookMasterService.getAllFirms();
    let loadedFirms = [];
    let isApi = false;
    if (res.success && res.data) {
      loadedFirms = res.data;
      isApi = Boolean(res.isApi);
    } else {
      loadedFirms = getAllFirms();
      isApi = false;
    }
    setFirms(loadedFirms);
    setIsApiConnected(isApi);

    // Fetch all entries from API database to compute live book-wise summaries
    const allEntriesRes = await rsFirmLedgerEntryService.getAllEntries();
    const allApiEntries = allEntriesRes.success ? allEntriesRes.data : [];

    const statsObj = {};
    loadedFirms.forEach((firm) => {
      const targetFirmId = firm.firmId || firm.id;
      const targetShortCode = (firm.shortCode || "").toUpperCase();
      const targetSlug = (firm.id || "").toLowerCase();

      let firmEntries = [];
      if (allApiEntries.length > 0) {
        firmEntries = allApiEntries.filter((item) => {
          if (targetFirmId && Number(item.firmId) === Number(targetFirmId)) return true;
          if (targetShortCode && String(item.firmCode).toUpperCase() === targetShortCode) return true;
          if (targetSlug && String(item.firmCode).toLowerCase() === targetSlug) return true;
          return false;
        });
      } else {
        firmEntries = getFirmRecords(firm.id);
      }

      const summary = calculateFirmSummary(firmEntries);
      const opBal = Number(firm.openingBalance || 0);
      const opType = firm.openingBalType || "CR";
      const opNet = opType === "DR" ? -opBal : opBal;
      const effectiveNet = opNet + summary.netBalance;

      statsObj[firm.id] = {
        ...summary,
        effectiveNetBalance: effectiveNet,
      };
    });

    setFirmStats(statsObj);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Open Create Firm Modal
  const handleOpenCreateModal = () => {
    setCreateFormData({
      firmName: "",
      shortCode: "",
      tagline: "",
      description: "",
      openingBalance: "0",
      openingBalType: "CR",
    });
    setCreateErrors({});
    setIsCreateModalOpen(true);
  };

  // Handle Create Firm Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const cleanName = createFormData.firmName.trim();
    if (!cleanName) {
      setCreateErrors({ firmName: "Firm Name is required" });
      return;
    }

    const words = cleanName.split(/\s+/).filter(Boolean);
    let shortCode = createFormData.shortCode.trim();
    if (!shortCode) {
      shortCode = words.length >= 2
        ? words.map((w) => w[0]).join("").toUpperCase().slice(0, 4)
        : cleanName.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4) || "FRM";
    }

    const res = await rsFirmBookMasterService.createFirm({
      firmName: cleanName,
      shortCode,
      tagline: createFormData.tagline,
      description: createFormData.description,
      openingBalance: Number(createFormData.openingBalance) || 0,
      openingBalType: createFormData.openingBalType || "CR",
    });

    if (res.success) {
      await loadFirmBooks();
      setIsCreateModalOpen(false);
      showToast(`Firm Book "${cleanName}" created successfully!`);
    } else {
      setCreateErrors({ firmName: res.message || "Failed to create firm book" });
    }
  };

  // Open Edit Firm Modal
  const handleOpenEditModal = async (firm, e) => {
    e.stopPropagation();
    setSelectedFirm(firm);
    setEditFormData({
      firmName: firm.name || "",
      shortCode: firm.shortCode || "",
      tagline: firm.tagline || "",
      description: firm.description || "",
      openingBalance: String(firm.openingBalance ?? 0),
      openingBalType: firm.openingBalType || "CR",
    });
    setEditErrors({});
    setIsEditModalOpen(true);

    const targetId = firm.firmId || firm.id;
    if (targetId && !isNaN(Number(targetId))) {
      const res = await rsFirmBookMasterService.getFirmById(targetId);
      if (res.success && res.data) {
        setEditFormData({
          firmName: res.data.name || "",
          shortCode: res.data.shortCode || "",
          tagline: res.data.tagline || "",
          description: res.data.description || "",
          openingBalance: String(res.data.openingBalance ?? 0),
          openingBalType: res.data.openingBalType || "CR",
        });
      }
    }
  };

  // Handle Edit Firm Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFirm) return;

    const cleanName = editFormData.firmName.trim();
    if (!cleanName) {
      setEditErrors({ firmName: "Firm Name is required" });
      return;
    }

    const targetId = selectedFirm.firmId || selectedFirm.id;
    const res = await rsFirmBookMasterService.updateFirm(targetId, {
      firmName: cleanName,
      shortCode: editFormData.shortCode,
      tagline: editFormData.tagline,
      description: editFormData.description,
      openingBalance: Number(editFormData.openingBalance) || 0,
      openingBalType: editFormData.openingBalType || "CR",
    });

    if (res.success) {
      await loadFirmBooks();
      setIsEditModalOpen(false);
      setSelectedFirm(null);
      showToast(`Firm Book "${cleanName}" updated successfully!`);
    } else {
      setEditErrors({ firmName: res.message || "Failed to update firm book" });
    }
  };

  // Open Delete Firm Modal
  const handleOpenDeleteModal = (firm, e) => {
    e.stopPropagation();
    setSelectedFirm(firm);
    setIsDeleteModalOpen(true);
  };

  // Handle Confirm Delete Firm
  const handleConfirmDelete = async () => {
    if (!selectedFirm) return;
    const name = selectedFirm.name;
    const targetId = selectedFirm.firmId || selectedFirm.id;
    await rsFirmBookMasterService.deleteFirm(targetId);
    await loadFirmBooks();
    setIsDeleteModalOpen(false);
    setSelectedFirm(null);
    showToast(`Firm Book "${name}" deleted successfully!`);
  };

  const filteredFirms = firms.filter(
    (firm) =>
      firm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (firm.shortCode &&
        firm.shortCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (firm.tagline &&
        firm.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (firm.badge &&
        firm.badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (firm.description &&
        firm.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const consolidatedStats = Object.values(firmStats).reduce(
    (acc, curr) => ({
      totalCredit: acc.totalCredit + (curr.totalCredit || 0),
      totalDebit: acc.totalDebit + (curr.totalDebit || 0),
      totalAed: acc.totalAed + (curr.totalAed || 0),
      totalCount: acc.totalCount + (curr.totalCount || 0),
    }),
    { totalCredit: 0, totalDebit: 0, totalAed: 0, totalCount: 0 }
  );

  return (
    <div className="min-h-screen w-full bg-[#FAFAF8] text-[#111111] font-sans flex flex-col selection:bg-black selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#111111] text-white px-4 py-2.5 rounded-sm shadow-xl text-xs font-medium flex items-center gap-2 border border-[#333333] animate-in fade-in slide-in-from-top-2">
          <FaCheckCircle className="text-[#22C55E]" size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <div className="w-full bg-white border-b border-[#E8E8E4] px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#333333]">
            Firm Portals
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {isApiConnected ? (
            <span className="text-[10px] font-mono text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 rounded-sm font-semibold flex items-center gap-1.5" title="Connected to http://localhost:44386/RS_FirmBookMaster">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span>API Connected</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-1 rounded-sm font-semibold flex items-center gap-1.5" title="Targeting http://localhost:44386/RS_FirmBookMaster">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span>Local Mode (API Offline)</span>
            </span>
          )}
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

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-8 py-5">
        {/* Title & Search + Add Firm Book / Party Master Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E8E4] mb-5">
          <div>
            <h1 className="text-xl font-serif font-medium text-[#111111]">
              Select Firm Book
            </h1>
            <p className="text-xs text-[#777777] mt-0.5">
              Select one of the firm books to manage transactions, opening balances, and export records.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#999999] text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search firm or party..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-[#111111] placeholder-[#999999] outline-none"
              />
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-2xs"
              title="Add New Firm Book with Opening Balance"
            >
              <FaPlus size={10} />
              <span>Add Firm Book</span>
            </button>

            <button
              onClick={() => navigate("/party-master")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-[#111111] text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-2xs"
              title="Open Party Master"
            >
              <FaUsers size={11} />
              <span>Party Master</span>
            </button>
            <button
              onClick={() => navigate("/book-type-master")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-[#111111] text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-2xs"
              title="Open Book Type Master"
            >
              <FaTag size={11} />
              <span>Book Type Master</span>
            </button>
            <button
              onClick={() => navigate("/signature")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-[#111111] text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-2xs"
              title="Open Signature"
            >
              <FaFileSignature size={11} />
              <span>Signature</span>
            </button>
          </div>
        </div>

        {/* Compact Balanced Metric Summary Strip */}
        <div className="bg-white border border-[#D1D1CB] rounded-sm p-2 sm:p-3 mb-5 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E0E0DB]">
            {/* 1. Active Portals */}
            <div className="flex items-center gap-3 px-3 py-2 sm:py-1">
              <div className="w-9 h-9 rounded-sm bg-[#F5F5F2] border border-[#E0E0DB] flex items-center justify-center text-[#111111] shrink-0">
                <FaBuilding size={14} />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#777777]">
                  Active Portals
                </div>
                <div className="text-base font-bold text-[#111111] leading-tight">
                  {firms.length} Firm {firms.length === 1 ? "Book" : "Books"}
                </div>
                <div className="text-[10px] text-[#888888] truncate max-w-xs sm:max-w-sm">
                  {firms.map((f) => f.shortCode || f.name).slice(0, 6).join(" • ")}
                  {firms.length > 6 ? "..." : ""}
                </div>
              </div>
            </div>

            {/* 2. Total Inflow */}
            <div className="flex items-center gap-3 px-3 py-2 sm:py-1">
              <div className="w-9 h-9 rounded-sm bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A] shrink-0">
                <FaExchangeAlt size={14} />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#166534]">
                  Total Inflow (CR)
                </div>
                <div className="text-base font-bold text-[#16A34A] leading-tight">
                  {formatCurrency(consolidatedStats.totalCredit)}
                </div>
                <div className="text-[10px] text-[#777777]">
                  All Recorded Sales & Receipts
                </div>
              </div>
            </div>

            {/* 3. Total Recorded Entries */}
            <div className="flex items-center gap-3 px-3 py-2 sm:py-1">
              <div className="w-9 h-9 rounded-sm bg-[#F5F5F2] border border-[#E0E0DB] flex items-center justify-center text-[#111111] shrink-0">
                <FaBook size={14} />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#777777]">
                  Total Recorded Entries
                </div>
                <div className="text-base font-bold text-[#111111] leading-tight">
                  {consolidatedStats.totalCount} Vouchers
                </div>
                <div className="text-[10px] text-[#888888]">
                  Consolidated Ledger History
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Firm Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {filteredFirms.map((firm) => {
            const stats = firmStats[firm.id] || {
              totalCount: 0,
              totalCredit: 0,
              totalDebit: 0,
              netBalance: 0,
            };

            const openingBal = Number(firm.openingBalance || 0);
            const openingType = firm.openingBalType || "CR";

            return (
              <div
                key={firm.id}
                className="bg-white border border-[#E5E5E0] hover:border-[#111111] rounded-sm p-4 flex flex-col justify-between transition-colors shadow-2xs relative group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h2 className="text-base font-serif font-semibold text-[#111111] truncate" title={firm.name}>
                      {firm.name}
                    </h2>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#F5F5F2] text-[#444444] border border-[#E8E8E4] shrink-0">
                        {firm.shortCode}
                      </span>
                      {firm.firmId && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleOpenEditModal(firm, e)}
                            className="p-1 rounded-xs bg-white hover:bg-[#F0FDF4] border border-[#D1D1CB] text-[#166534] transition-colors"
                            title="Edit Firm Book"
                          >
                            <FaEdit size={10} />
                          </button>
                          <button
                            onClick={(e) => handleOpenDeleteModal(firm, e)}
                            className="p-1 rounded-xs bg-white hover:bg-[#FEF2F2] border border-[#D1D1CB] text-[#DC2626] transition-colors"
                            title="Delete Firm Book"
                          >
                            <FaTrash size={9} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Micro stats table */}
                  <div className="p-2.5 rounded-sm bg-[#FAFAF8] border border-[#EAEAE6] mb-3 text-[11px] space-y-1">
                    {/* Opening Balance Row */}
                    <div className="flex justify-between pb-1 border-b border-[#E8E8E4] font-medium">
                      <span className="text-[#666666]">Opening Bal:</span>
                      <span className={`font-mono font-semibold ${openingType === "DR" ? "text-[#DC2626]" : "text-[#16A34A]"}`}>
                        {formatCurrency(openingBal)} <span className="text-[9px] uppercase px-1 py-0.1 bg-white border border-[#E0E0DB] rounded-xs">{openingType}</span>
                      </span>
                    </div>

                    <div className="flex justify-between pt-0.5">
                      <span className="text-[#777777]">Entries:</span>
                      <span className="font-medium text-[#111111]">
                        {stats.totalCount} Vouchers
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#777777]">Inflow (CR):</span>
                      <span className="font-semibold text-[#16A34A]">
                        {formatCurrency(stats.totalCredit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#777777]">Outflow (DR):</span>
                      <span className="font-semibold text-[#DC2626]">
                        {formatCurrency(stats.totalDebit)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#E8E8E4]">
                      <span className="text-[#777777]">Net Bal:</span>
                      <span className="font-semibold text-[#111111]">
                        {formatCurrency(Math.abs(stats.effectiveNetBalance !== undefined ? stats.effectiveNetBalance : stats.netBalance))}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/firms/${firm.id}`}
                  className="w-full py-1.5 px-3 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open {firm.name}</span>
                  <FaArrowRight size={9} />
                </Link>
              </div>
            );
          })}
        </div>

        {filteredFirms.length === 0 && (
          <div className="py-12 text-center bg-white border border-[#E5E5E0] rounded-sm p-6 mt-4">
            <FaBuilding className="mx-auto text-[#CCCCCC] text-3xl mb-2" />
            <p className="text-sm text-[#333333] font-semibold">
              No firm books found matching "{searchQuery}"
            </p>
            <p className="text-xs text-[#777777] mt-1">
              Click "+ Add Firm Book" above to create a new firm book portal with opening balance.
            </p>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL 1: CREATE FIRM BOOK MASTER MODAL (WITH OPENING BALANCE)
      ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-[#D1D1CB] rounded-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3 bg-[#FAFAF8] border-b border-[#E8E8E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaBuilding className="text-[#111111]" size={13} />
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  New Firm Book Master
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-[#777777] hover:text-black cursor-pointer rounded-sm hover:bg-[#EBEBE6] transition-colors"
              >
                <FaTimes size={13} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5">
              {/* Firm Name* */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Firm Name *
                </label>
                <input
                  type="text"
                  value={createFormData.firmName}
                  onChange={(e) => {
                    setCreateFormData({
                      ...createFormData,
                      firmName: e.target.value,
                    });
                    if (createErrors.firmName) {
                      setCreateErrors({ ...createErrors, firmName: null });
                    }
                  }}
                  placeholder="Enter firm book name (e.g. ROYAL RAYS BOOK)"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                  autoFocus
                />
                {createErrors.firmName && (
                  <span className="text-[11px] text-[#DC2626] block mt-1">
                    {createErrors.firmName}
                  </span>
                )}
              </div>

              {/* Short Code & Division Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                    Short Code (e.g. MSB)
                  </label>
                  <input
                    type="text"
                    value={createFormData.shortCode}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        shortCode: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="Auto-generated if empty"
                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                    Division / Tagline
                  </label>
                  <input
                    type="text"
                    value={createFormData.tagline}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        tagline: e.target.value,
                      })
                    }
                    placeholder="Enter division or ledger tagline"
                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                  />
                </div>
              </div>

              {/* OPENING BALANCE & CR/DR TYPE */}
              <div className="p-3 bg-[#FAFAF8] border border-[#E8E8E4] rounded-sm">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-2 flex items-center justify-between">
                  <span>Opening Balance Details</span>
                  <span className="text-[10px] text-[#777777] font-normal">Initial Ledger Balance</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-semibold uppercase text-[#555555] mb-1">
                      Opening Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={createFormData.openingBalance}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          openingBalance: e.target.value,
                        })
                      }
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs font-mono text-left text-[#111111] placeholder-[#999999] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-[#555555] mb-1">
                      Bal Type
                    </label>
                    <select
                      value={createFormData.openingBalType}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          openingBalType: e.target.value,
                        })
                      }
                      className="w-full px-2 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs font-mono text-[#111111] outline-none cursor-pointer"
                    >
                      <option value="CR">CR (Credit)</option>
                      <option value="DR">DR (Debit)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={createFormData.description}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter book description or purpose"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E8E8E4] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-sm bg-[#F5F5F2] hover:bg-[#EBEBE6] text-xs font-semibold text-[#444444] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-2xs hover:shadow-xs transition-colors"
                >
                  Save Firm Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: EDIT FIRM BOOK MASTER MODAL (WITH OPENING BALANCE)
      ========================================================================= */}
      {isEditModalOpen && selectedFirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-[#D1D1CB] rounded-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3 bg-[#FAFAF8] border-b border-[#E8E8E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaEdit className="text-[#111111]" size={13} />
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Update Firm Book — {selectedFirm.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-[#777777] hover:text-black cursor-pointer rounded-sm hover:bg-[#EBEBE6] transition-colors"
              >
                <FaTimes size={13} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-5 space-y-3.5">
              {/* Firm Name* */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Firm Name *
                </label>
                <input
                  type="text"
                  value={editFormData.firmName}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      firmName: e.target.value,
                    });
                    if (editErrors.firmName) {
                      setEditErrors({ ...editErrors, firmName: null });
                    }
                  }}
                  placeholder="Enter firm book name"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                  autoFocus
                />
                {editErrors.firmName && (
                  <span className="text-[11px] text-[#DC2626] block mt-1">
                    {editErrors.firmName}
                  </span>
                )}
              </div>

              {/* Short Code & Division */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                    Short Code
                  </label>
                  <input
                    type="text"
                    value={editFormData.shortCode}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        shortCode: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="Short Code"
                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                    Division / Tagline
                  </label>
                  <input
                    type="text"
                    value={editFormData.tagline}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        tagline: e.target.value,
                      })
                    }
                    placeholder="Enter tagline"
                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                  />
                </div>
              </div>

              {/* OPENING BALANCE & CR/DR TYPE */}
              <div className="p-3 bg-[#FAFAF8] border border-[#E8E8E4] rounded-sm">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-2 flex items-center justify-between">
                  <span>Opening Balance Details</span>
                  <span className="text-[10px] text-[#777777] font-normal">Initial Ledger Balance</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-semibold uppercase text-[#555555] mb-1">
                      Opening Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.openingBalance}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          openingBalance: e.target.value,
                        })
                      }
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs font-mono text-left text-[#111111] placeholder-[#999999] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-[#555555] mb-1">
                      Bal Type
                    </label>
                    <select
                      value={editFormData.openingBalType}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          openingBalType: e.target.value,
                        })
                      }
                      className="w-full px-2 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs font-mono text-[#111111] outline-none cursor-pointer"
                    >
                      <option value="CR">CR (Credit)</option>
                      <option value="DR">DR (Debit)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter book description"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E8E8E4] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-sm bg-[#F5F5F2] hover:bg-[#EBEBE6] text-xs font-semibold text-[#444444] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-2xs hover:shadow-xs transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: DELETE CONFIRMATION MODAL
      ========================================================================= */}
      {isDeleteModalOpen && selectedFirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-[#D1D1CB] rounded-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-[#FEF2F2] border-b border-[#FEE2E2] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#991B1B]">
                <FaExclamationTriangle size={15} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Confirm Delete Firm Book
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 text-[#777777] hover:text-black cursor-pointer rounded-sm hover:bg-[#FEE2E2] transition-colors"
              >
                <FaTimes size={13} />
              </button>
            </div>

            <div className="p-5">
              <p className="text-xs text-[#333333] leading-relaxed">
                Are you sure you want to delete the firm book{" "}
                <strong className="text-[#111111] font-semibold">{selectedFirm.name}</strong>?
                This action will mark the firm book record as inactive in the database.
              </p>

              <div className="mt-4 pt-3 border-t border-[#E8E8E4] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-sm bg-[#F5F5F2] hover:bg-[#EBEBE6] text-xs font-semibold text-[#444444] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-sm bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-2xs hover:shadow-xs transition-colors"
                >
                  Yes, Delete Firm Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirmSelection;
