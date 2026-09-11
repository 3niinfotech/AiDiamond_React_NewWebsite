import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaArrowLeft,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaBook,
  FaCheckCircle,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaPhoneAlt,
  FaEnvelope,
  FaIdCard,
} from "react-icons/fa";
import {
  getAllFirms,
  addCustomFirm,
  updateFirm,
  deleteFirm,
  getFirmRecords,
  calculateFirmSummary,
  getAuthUser,
  clearAuthUser,
} from "../../data/firmData";

const PartyMaster = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [firms, setFirms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    partyName: "",
    address: "",
    trn: "",
    email: "",
    contact: "",
  });
  const [createErrors, setCreateErrors] = useState({});

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [editFormData, setEditFormData] = useState({
    partyName: "",
    address: "",
    trn: "",
    email: "",
    contact: "",
  });
  const [editErrors, setEditErrors] = useState({});

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      setCurrentUser({ name: "RSDXB", username: "RSDXB" });
    } else {
      setCurrentUser(user);
    }
    loadFirms();
  }, []);

  const loadFirms = () => {
    const list = getAllFirms();
    setFirms(list);
  };

  const handleLogout = () => {
    clearAuthUser();
    navigate("/login");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setCreateFormData({
      partyName: "",
      address: "",
      trn: "",
      email: "",
      contact: "",
    });
    setCreateErrors({});
    setIsCreateModalOpen(true);
  };

  // Handle Create Submit
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const cleanName = createFormData.partyName.trim();
    if (!cleanName) {
      setCreateErrors({ partyName: "Party Name is required" });
      return;
    }

    const slug =
      cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || `party-${Date.now()}`;
    const id = `${slug}-${Date.now().toString(36).substring(2, 6)}`;

    const words = cleanName.split(/\s+/).filter(Boolean);
    let shortCode = "";
    if (words.length >= 2) {
      shortCode = words
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 4);
    } else {
      shortCode =
        cleanName.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4) ||
        "PRT";
    }

    const newParty = {
      id,
      name: cleanName,
      shortCode,
      tagline: createFormData.trn.trim()
        ? `TRN: ${createFormData.trn.trim()}`
        : createFormData.contact.trim()
        ? `Contact: ${createFormData.contact.trim()}`
        : "Party Ledger Account",
      description: createFormData.address.trim()
        ? createFormData.address.trim()
        : createFormData.email.trim()
        ? `Email: ${createFormData.email.trim()}`
        : "Registered party ledger account.",
      badge: "Party Book",
      address: createFormData.address.trim(),
      trn: createFormData.trn.trim(),
      email: createFormData.email.trim(),
      contact: createFormData.contact.trim(),
      founded: new Date().getFullYear().toString(),
      accentColor: "#D4A853",
      bgGradient:
        "linear-gradient(135deg, rgba(212, 168, 83, 0.15) 0%, rgba(10, 10, 12, 0.95) 100%)",
      icon: "FaBuilding",
    };

    addCustomFirm(newParty);
    loadFirms();
    setIsCreateModalOpen(false);
    showToast(`Party "${cleanName}" created successfully!`);
  };

  // Open Edit Modal
  const handleOpenEditModal = (party) => {
    setSelectedParty(party);
    setEditFormData({
      partyName: party.name || "",
      address: party.address || "",
      trn: party.trn || "",
      email: party.email || "",
      contact: party.contact || "",
    });
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedParty) return;

    const cleanName = editFormData.partyName.trim();
    if (!cleanName) {
      setEditErrors({ partyName: "Party Name is required" });
      return;
    }

    const words = cleanName.split(/\s+/).filter(Boolean);
    let shortCode = "";
    if (words.length >= 2) {
      shortCode = words
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 4);
    } else {
      shortCode =
        cleanName.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4) ||
        selectedParty.shortCode ||
        "PRT";
    }

    const updatedFields = {
      name: cleanName,
      shortCode,
      tagline: editFormData.trn.trim()
        ? `TRN: ${editFormData.trn.trim()}`
        : editFormData.contact.trim()
        ? `Contact: ${editFormData.contact.trim()}`
        : selectedParty.tagline || "Party Ledger Account",
      description: editFormData.address.trim()
        ? editFormData.address.trim()
        : editFormData.email.trim()
        ? `Email: ${editFormData.email.trim()}`
        : selectedParty.description || "Registered party ledger account.",
      address: editFormData.address.trim(),
      trn: editFormData.trn.trim(),
      email: editFormData.email.trim(),
      contact: editFormData.contact.trim(),
    };

    updateFirm(selectedParty.id, updatedFields);
    loadFirms();
    setIsEditModalOpen(false);
    setSelectedParty(null);
    showToast(`Party "${cleanName}" updated successfully!`);
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (party) => {
    setSelectedParty(party);
    setIsDeleteModalOpen(true);
  };

  // Handle Confirm Delete
  const handleConfirmDelete = () => {
    if (!selectedParty) return;
    const name = selectedParty.name;
    deleteFirm(selectedParty.id);
    loadFirms();
    setIsDeleteModalOpen(false);
    setSelectedParty(null);
    showToast(`Party "${name}" deleted successfully!`);
  };

  // Filtered List
  const filteredFirms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return firms;
    return firms.filter(
      (f) =>
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.shortCode && f.shortCode.toLowerCase().includes(q)) ||
        (f.trn && f.trn.toLowerCase().includes(q)) ||
        (f.email && f.email.toLowerCase().includes(q)) ||
        (f.contact && f.contact.toLowerCase().includes(q)) ||
        (f.address && f.address.toLowerCase().includes(q))
    );
  }, [firms, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-[#FAFAF8] text-[#111111] font-sans flex flex-col selection:bg-black selection:text-white">
      {/* Top Navbar */}
      <div className="w-full bg-white border-b border-[#E8E8E4] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/firms"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#F5F5F2] hover:bg-[#EBEBE6] border border-[#E0E0DB] text-xs font-semibold text-[#333333] transition-colors"
          >
            <FaArrowLeft size={10} />
            <span>Firm Portals</span>
          </Link>
          <span className="h-4 w-px bg-[#E0E0DB]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
            Party Master
          </span>
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

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-8 py-5">
        {/* Page Title & Add Party Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E8E4] mb-5">
          <div>
            <h1 className="text-xl font-serif font-medium text-[#111111]">
              Party Master
            </h1>
            <p className="text-xs text-[#777777] mt-0.5">
              Manage registered parties, business profiles, and direct ledger access.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
            >
              <FaPlus size={10} />
              <span>Add Party</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Matching /firms/:firmId) */}
        <div className="bg-white p-3 rounded-sm border border-[#E0E0DB] mb-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-2xs">
          {/* Search Input Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] text-xs pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Party Name, Code, TRN, Contact..."
              className="w-full pl-9 pr-7 py-1.5 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-[#111111] placeholder-[#999999] outline-none transition-colors"
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

          {/* Right Summary Info */}
          <div className="flex items-center gap-2 text-xs text-[#666666]">
            <span>
              Total: <strong>{filteredFirms.length}</strong> Registered {filteredFirms.length === 1 ? "Party" : "Parties"}
            </span>
          </div>
        </div>

        {/* Party Master Table (Matching existing Table UI & Colors) */}
        <div className="bg-white border border-[#D1D1CB] rounded-sm shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#F5F5F2] border-b border-[#D1D1CB] text-[11px] font-bold uppercase tracking-wider text-[#444444]">
                  <th className="py-2.5 px-3 text-center w-12 border-r border-[#D1D1CB]">#</th>
                  <th className="py-2.5 px-4 border-r border-[#D1D1CB]">Party Name</th>
                  <th className="py-2.5 px-3 text-center border-r border-[#D1D1CB] w-20">Code</th>
                  <th className="py-2.5 px-4 border-r border-[#D1D1CB]">Address</th>
                  <th className="py-2.5 px-3 text-center border-r border-[#D1D1CB]">TRN</th>
                  <th className="py-2.5 px-4 border-r border-[#D1D1CB]">Email</th>
                  <th className="py-2.5 px-3 text-center border-r border-[#D1D1CB]">Contact</th>
                  <th className="py-2.5 px-3 text-center w-32">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAE6] text-xs">
                {filteredFirms.length > 0 ? (
                  filteredFirms.map((party, index) => (
                    <tr
                      key={party.id}
                      className="hover:bg-[#FAFAF8] transition-colors"
                    >
                      {/* 1. # */}
                      <td className="py-2 px-3 text-center border-r border-[#D1D1CB] font-mono text-[#777777]">
                        {index + 1}
                      </td>

                      {/* 2. Party Name */}
                      <td className="py-2 px-4 border-r border-[#D1D1CB] font-semibold text-[#111111]">
                        <Link
                          to={`/firms/${party.id}`}
                          className="hover:underline text-[#111111]"
                          title="Open Ledger Book"
                        >
                          {party.name}
                        </Link>
                      </td>

                      {/* 3. Code */}
                      <td className="py-2 px-3 text-center border-r border-[#D1D1CB]">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#F5F5F2] text-[#444444] border border-[#E8E8E4]">
                          {party.shortCode}
                        </span>
                      </td>

                      {/* 4. Address */}
                      <td className="py-2 px-4 border-r border-[#D1D1CB] text-[#555555] max-w-xs truncate" title={party.address}>
                        {party.address || "-"}
                      </td>

                      {/* 5. TRN */}
                      <td className="py-2 px-3 text-center border-r border-[#D1D1CB] font-mono text-[#444444]">
                        {party.trn || "-"}
                      </td>

                      {/* 6. Email */}
                      <td className="py-2 px-4 border-r border-[#D1D1CB] text-[#555555]">
                        {party.email ? (
                          <a
                            href={`mailto:${party.email}`}
                            className="hover:underline text-[#111111]"
                          >
                            {party.email}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* 7. Contact */}
                      <td className="py-2 px-3 text-center border-r border-[#D1D1CB] font-mono text-[#444444]">
                        {party.contact || "-"}
                      </td>

                      {/* 8. Action Buttons */}
                      <td className="py-2 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Open Ledger */}
                          <Link
                            to={`/firms/${party.id}`}
                            className="w-7 h-7 rounded-sm bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-[#111111] flex items-center justify-center transition-all shadow-2xs"
                            title="Open Ledger Book"
                          >
                            <FaBook size={11} />
                          </Link>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(party)}
                            className="w-7 h-7 rounded-sm bg-white hover:bg-[#F0FDF4] border border-[#D1D1CB] hover:border-[#86EFAC] text-[#166534] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                            title="Edit Party Details"
                          >
                            <FaEdit size={11} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleOpenDeleteModal(party)}
                            className="w-7 h-7 rounded-sm bg-white hover:bg-[#FEF2F2] border border-[#D1D1CB] hover:border-[#FCA5A5] text-[#DC2626] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                            title="Delete Party"
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-10 text-center text-[#777777]">
                      <FaBuilding className="mx-auto text-[#CCCCCC] text-2xl mb-2" />
                      <p className="text-sm text-[#333333] font-semibold">
                        No parties found matching "{searchQuery}"
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="py-2.5 px-4 bg-[#FAFAF8] border-t border-[#D1D1CB] flex items-center justify-between text-xs text-[#555555] font-medium">
            <span>
              Showing <strong>{filteredFirms.length}</strong> of {firms.length} Parties
            </span>
            <span>Royal Rays Bourse Directory</span>
          </div>
        </div>
      </main>

      {/* =========================================================================
          MODAL 1: CREATE PARTY MASTER MODAL
      ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-[#D1D1CB] rounded-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3 bg-[#FAFAF8] border-b border-[#E8E8E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaBuilding className="text-[#111111]" size={13} />
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  New Party Master
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
              {/* Party Name* */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Party Name *
                </label>
                <input
                  type="text"
                  value={createFormData.partyName}
                  onChange={(e) => {
                    setCreateFormData({
                      ...createFormData,
                      partyName: e.target.value,
                    });
                    if (createErrors.partyName) {
                      setCreateErrors({ ...createErrors, partyName: null });
                    }
                  }}
                  placeholder="Enter party / company name"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                  autoFocus
                />
                {createErrors.partyName && (
                  <span className="text-[11px] text-[#DC2626] block mt-1">
                    {createErrors.partyName}
                  </span>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Address
                </label>
                <textarea
                  rows={2}
                  value={createFormData.address}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      address: e.target.value,
                    })
                  }
                  placeholder="Enter office / company address"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none resize-none"
                />
              </div>

              {/* TRN */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  TRN
                </label>
                <input
                  type="text"
                  value={createFormData.trn}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      trn: e.target.value,
                    })
                  }
                  placeholder="Enter Tax Registration Number (TRN)"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                />
              </div>

              {/* Email & Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={createFormData.email}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    value={createFormData.contact}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        contact: e.target.value,
                      })
                    }
                    placeholder="Enter phone or mobile number"
                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                  />
                </div>
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
                  Save Party
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: EDIT PARTY MASTER MODAL
      ========================================================================= */}
      {isEditModalOpen && selectedParty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-[#D1D1CB] rounded-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3 bg-[#FAFAF8] border-b border-[#E8E8E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaEdit className="text-[#111111]" size={13} />
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Update Party Master — {selectedParty.name}
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
              {/* Party Name* */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Party Name *
                </label>
                <input
                  type="text"
                  value={editFormData.partyName}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      partyName: e.target.value,
                    });
                    if (editErrors.partyName) {
                      setEditErrors({ ...editErrors, partyName: null });
                    }
                  }}
                  placeholder="Enter party / company name"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                  autoFocus
                />
                {editErrors.partyName && (
                  <span className="text-[11px] text-[#DC2626] block mt-1">
                    {editErrors.partyName}
                  </span>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Address
                </label>
                <textarea
                  rows={2}
                  value={editFormData.address}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      address: e.target.value,
                    })
                  }
                  placeholder="Enter office / company address"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none resize-none"
                />
              </div>

              {/* TRN */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  TRN
                </label>
                <input
                  type="text"
                  value={editFormData.trn}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      trn: e.target.value,
                    })
                  }
                  placeholder="Enter Tax Registration Number (TRN)"
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                />
              </div>

              {/* Email & Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    value={editFormData.contact}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        contact: e.target.value,
                      })
                    }
                    placeholder="Enter phone or mobile number"
                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-left text-[#111111] placeholder-[#999999] outline-none"
                  />
                </div>
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
      {isDeleteModalOpen && selectedParty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-[#D1D1CB] rounded-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-[#FEF2F2] border-b border-[#FEE2E2] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#991B1B]">
                <FaExclamationTriangle size={15} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Confirm Delete Party
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 text-[#991B1B] hover:text-black cursor-pointer rounded-sm hover:bg-[#FEE2E2] transition-colors"
              >
                <FaTimes size={13} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-[#333333] leading-relaxed">
                Are you sure you want to delete{" "}
                <strong className="text-[#111111]">{selectedParty.name}</strong>{" "}
                ({selectedParty.shortCode})?
              </p>
              <p className="text-[11px] text-[#777777]">
                This will permanently remove this party directory and its ledger book records. This action cannot be undone.
              </p>

              <div className="pt-3 border-t border-[#E8E8E4] flex items-center justify-end gap-2.5">
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
                  Delete Party
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-[#111111] text-white text-xs rounded-sm shadow-xl border border-[#333333]">
          <FaCheckCircle className="text-[#22C55E]" size={13} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default PartyMaster;
