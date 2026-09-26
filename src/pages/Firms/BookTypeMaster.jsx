import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
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
  FaTag,
  FaListUl,
} from "react-icons/fa";
import { Pagination } from "../../components/Pagination";
import { getAuthUser } from "../../data/firmData";
import { useAuth } from "../../hooks/useAuth";
import { rsBookTypeMasterService } from "../../services/rsBookTypeMasterService";

const BookTypeMaster = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [bookTypes, setBookTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [isApiConnected, setIsApiConnected] = useState(false);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    shortCode: "",
    description: "",
    isActive: true,
  });
  const [createErrors, setCreateErrors] = useState({});

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    shortCode: "",
    description: "",
    isActive: true,
  });
  const [editErrors, setEditErrors] = useState({});

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const user = authUser || getAuthUser();
    if (!user) {
      setCurrentUser({ name: "RSDXB", username: "RSDXB" });
    } else {
      setCurrentUser(user);
    }
    loadBookTypes();
  }, [authUser]);

  const loadBookTypes = async () => {
    const res = await rsBookTypeMasterService.getAllBookTypes();
    if (res.success && res.data) {
      setBookTypes(res.data);
      setIsApiConnected(Boolean(res.isApi));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Search Filtering
  const filteredBookTypes = useMemo(() => {
    if (!searchQuery.trim()) return bookTypes;
    const q = searchQuery.toLowerCase().trim();
    return bookTypes.filter((t) => {
      const nameMatch = (t.name || "").toLowerCase().includes(q);
      const codeMatch = (t.shortCode || "").toLowerCase().includes(q);
      const descMatch = (t.description || "").toLowerCase().includes(q);
      return nameMatch || codeMatch || descMatch;
    });
  }, [bookTypes, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookTypes.length / itemsPerPage) || 1;
  const paginatedBookTypes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookTypes.slice(start, start + itemsPerPage);
  }, [filteredBookTypes, currentPage, itemsPerPage]);

  // Handlers for Create
  const handleOpenCreateModal = () => {
    setCreateFormData({
      name: "",
      shortCode: "",
      description: "",
      isActive: true,
    });
    setCreateErrors({});
    setIsCreateModalOpen(true);
  };

  const validateCreateForm = () => {
    const errors = {};
    if (!createFormData.name.trim()) {
      errors.name = "Type name is required";
    }
    setCreateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateCreateForm()) return;

    const result = await rsBookTypeMasterService.createBookType(createFormData);
    if (result.success) {
      showToast(result.message || `Book type "${createFormData.name}" created successfully!`);
      setIsCreateModalOpen(false);
      loadBookTypes();
    } else {
      setCreateErrors({ submit: "Failed to create book type." });
    }
  };

  // Handlers for Edit
  const handleOpenEditModal = async (typeItem) => {
    setSelectedType(typeItem);
    const targetId = typeItem.typeId || typeItem.id;
    const res = await rsBookTypeMasterService.getBookTypeById(targetId);

    const typeData = res.success && res.data ? res.data : typeItem;
    setEditFormData({
      name: typeData.name || "",
      shortCode: typeData.shortCode || "",
      description: typeData.description || "",
      isActive: typeData.isActive !== undefined ? typeData.isActive : true,
    });
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  const validateEditForm = () => {
    const errors = {};
    if (!editFormData.name.trim()) {
      errors.name = "Type name is required";
    }
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateEditForm() || !selectedType) return;

    const targetId = selectedType.typeId || selectedType.id;
    const result = await rsBookTypeMasterService.updateBookType(targetId, editFormData);

    if (result.success) {
      showToast(`Book type "${editFormData.name}" updated successfully!`);
      setIsEditModalOpen(false);
      setSelectedType(null);
      loadBookTypes();
    } else {
      setEditErrors({ submit: "Failed to update book type." });
    }
  };

  // Handlers for Delete
  const handleOpenDeleteModal = (typeItem) => {
    setTypeToDelete(typeItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!typeToDelete) return;
    const targetId = typeToDelete.typeId || typeToDelete.id;
    await rsBookTypeMasterService.deleteBookType(targetId);

    showToast(`Book type "${typeToDelete.name}" deleted successfully!`);
    setIsDeleteModalOpen(false);
    setTypeToDelete(null);
    loadBookTypes();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F2] text-[#111111] font-sans flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111111] text-white text-xs font-semibold px-4 py-3 rounded-sm shadow-xl flex items-center gap-2 animate-bounce">
          <FaCheckCircle className="text-[#16A34A]" size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0A0A0C] border-b border-[#222225] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link
                to="/firms"
                className="inline-flex items-center gap-2 text-xs font-medium text-[#999999] hover:text-white transition-colors"
              >
                <FaArrowLeft size={10} />
                <span>Portals</span>
              </Link>
              <div className="h-4 w-px bg-[#222225]" />
              <div className="flex items-center gap-2">
                <FaTag className="text-[#D4A853]" size={14} />
                <h1 className="text-sm font-bold tracking-wider uppercase text-white">
                  Book Type Master
                </h1>
              </div>
            </div>

            {/* Right User & Actions */}
            <div className="flex items-center gap-3">
              {currentUser && (
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#16161A] border border-[#26262C] rounded-sm">
                  <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span className="text-[11px] font-semibold text-[#D1D1CB]">
                    {currentUser.name || currentUser.username}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-1.5 text-[#888888] hover:text-red-400 hover:bg-[#16161A] rounded-sm transition-colors cursor-pointer"
                title="Sign Out"
              >
                <FaSignOutAlt size={13} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Control Header Strip */}
      <div className="bg-white border-b border-[#D1D1CB] px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        {/* Left Title & Status */}
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-base font-bold text-[#111111]">
              Manage Entry Book Types
            </h2>
            <p className="text-[11px] text-[#666666]">
              Add, edit, or delete custom ledger transaction types displayed in entry forms.
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider ${
              isApiConnected
                ? "bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]"
                : "bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]"
            }`}
            title={isApiConnected ? "Connected to RS_BookTypeMaster API" : "Using Local Storage fallback"}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isApiConnected ? "bg-[#16A34A]" : "bg-[#D97706]"}`} />
            {isApiConnected ? "API LIVE" : "LOCAL MODE"}
          </span>
        </div>

        {/* Right Header Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => navigate("/party-master")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-xs font-semibold text-[#111111] transition-colors cursor-pointer"
          >
            <FaBook size={11} />
            <span>Party Master</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
          >
            <FaPlus size={10} />
            <span>Add Book Type</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full px-4 sm:px-8 py-5">
        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={11} />
            <input
              type="text"
              placeholder="Search book types..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-8 py-1.5 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-[#111111] placeholder-[#888888] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-black cursor-pointer"
              >
                <FaTimes size={10} />
              </button>
            )}
          </div>

          <div className="text-xs font-medium text-[#666666]">
            Total: <span className="font-bold text-[#111111]">{filteredBookTypes.length} Types</span>
          </div>
        </div>

        {/* Table List */}
        <div className="bg-white border border-[#D1D1CB] rounded-sm overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#D1D1CB] text-[10px] font-bold uppercase tracking-wider text-[#555555]">
                  <th className="py-2.5 px-4 w-12 text-center">#</th>
                  <th className="py-2.5 px-4">Book Type Name</th>
                  <th className="py-2.5 px-4">Short Code</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {paginatedBookTypes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-[#888888] text-xs">
                      No book types found. Click "Add Book Type" to create one.
                    </td>
                  </tr>
                ) : (
                  paginatedBookTypes.map((typeItem, index) => (
                    <tr key={typeItem.id || typeItem.typeId || index} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-[#777777]">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#111111]">
                        {typeItem.name}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[#555555]">
                        <span className="bg-[#F0F0EC] border border-[#E0E0DA] px-2 py-0.5 rounded-sm">
                          {typeItem.shortCode || "TYP"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#555555] max-w-xs truncate">
                        {typeItem.description || "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold ${
                            typeItem.isActive
                              ? "bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]"
                              : "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]"
                          }`}
                        >
                          {typeItem.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(typeItem)}
                            className="p-1.5 text-[#444444] hover:text-black hover:bg-[#F0F0EC] rounded-sm transition-colors cursor-pointer"
                            title="Edit Book Type"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(typeItem)}
                            className="p-1.5 text-[#DC2626] hover:bg-[#FEF2F2] rounded-sm transition-colors cursor-pointer"
                            title="Delete Book Type"
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

          {/* Footer Pagination */}
          <div className="p-3 bg-[#FAF9F5] border-t border-[#D1D1CB] flex items-center justify-between">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D1D1CB] rounded-sm w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-5 py-3.5 bg-[#FAF9F5] border-b border-[#D1D1CB] flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Add New Book Type
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#888888] hover:text-black cursor-pointer"
              >
                <FaTimes size={12} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Type Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI, Online Transfer, Crypto, Cash"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-[#111111] outline-none"
                />
                {createErrors.name && (
                  <span className="text-[11px] text-red-600 block mt-1">{createErrors.name}</span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Short Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI, ONL, CPT"
                  value={createFormData.shortCode}
                  onChange={(e) => setCreateFormData({ ...createFormData, shortCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-[#111111] uppercase outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Description / Remarks
                </label>
                <textarea
                  rows="2"
                  placeholder="Enter details about this entry type"
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-[#111111] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="createIsActive"
                  checked={createFormData.isActive}
                  onChange={(e) => setCreateFormData({ ...createFormData, isActive: e.target.checked })}
                  className="rounded-xs text-black cursor-pointer"
                />
                <label htmlFor="createIsActive" className="text-xs text-[#333333] cursor-pointer">
                  Active (Display in entry selection lists)
                </label>
              </div>

              {createErrors.submit && (
                <div className="p-2 bg-red-50 text-red-600 text-xs rounded-sm">
                  {createErrors.submit}
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EAEAEA]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-[#333333] text-xs font-semibold rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  Save Book Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D1D1CB] rounded-sm w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-5 py-3.5 bg-[#FAF9F5] border-b border-[#D1D1CB] flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Edit Book Type
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#888888] hover:text-black cursor-pointer"
              >
                <FaTimes size={12} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Type Name *
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-[#111111] outline-none"
                />
                {editErrors.name && (
                  <span className="text-[11px] text-red-600 block mt-1">{editErrors.name}</span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Short Code
                </label>
                <input
                  type="text"
                  value={editFormData.shortCode}
                  onChange={(e) => setEditFormData({ ...editFormData, shortCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-[#111111] uppercase outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                  Description / Remarks
                </label>
                <textarea
                  rows="2"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-[#111111] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editFormData.isActive}
                  onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                  className="rounded-xs text-black cursor-pointer"
                />
                <label htmlFor="editIsActive" className="text-xs text-[#333333] cursor-pointer">
                  Active (Display in entry selection lists)
                </label>
              </div>

              {editErrors.submit && (
                <div className="p-2 bg-red-50 text-red-600 text-xs rounded-sm">
                  {editErrors.submit}
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EAEAEA]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-[#333333] text-xs font-semibold rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  Update Book Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && typeToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D1D1CB] rounded-sm w-full max-w-sm shadow-2xl p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-3">
              <FaExclamationTriangle size={18} />
            </div>
            <h3 className="text-sm font-bold text-[#111111] mb-1">Delete Book Type?</h3>
            <p className="text-xs text-[#666666] mb-5">
              Are you sure you want to delete <span className="font-semibold text-[#111111]">"{typeToDelete.name}"</span>?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-white border border-[#D1D1CB] hover:bg-[#F5F5F2] text-xs font-semibold text-[#333333] rounded-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider rounded-sm cursor-pointer"
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

export default BookTypeMaster;
