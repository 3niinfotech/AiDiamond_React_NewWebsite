import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash, FaCheck, FaTag } from "react-icons/fa";
import { rsBookTypeMasterService } from "../../services/rsBookTypeMasterService";

export const BookTypeQuickModal = ({ isOpen, onClose, onTypeAdded }) => {
  const [types, setTypes] = useState([]);
  const [newTypeName, setNewTypeName] = useState("");
  const [newShortCode, setNewShortCode] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadTypes();
    }
  }, [isOpen]);

  const loadTypes = async () => {
    const res = await rsBookTypeMasterService.getAllBookTypes();
    if (res.success && res.data) {
      setTypes(res.data);
    }
  };

  const handleAddType = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) {
      setErrorMsg("Please enter type name.");
      return;
    }
    setErrorMsg("");
    setIsAdding(true);

    const res = await rsBookTypeMasterService.createBookType({
      name: newTypeName.trim(),
      shortCode: newShortCode.trim().toUpperCase() || newTypeName.trim().slice(0, 3).toUpperCase(),
      description: "Added via Data Entry Form",
      isActive: true,
    });

    setIsAdding(false);
    if (res.success) {
      const addedName = newTypeName.trim();
      setNewTypeName("");
      setNewShortCode("");
      await loadTypes();
      if (onTypeAdded) {
        onTypeAdded(addedName);
      }
    } else {
      setErrorMsg("Failed to save book type.");
    }
  };

  const handleDeleteType = async (typeItem) => {
    const targetId = typeItem.typeId || typeItem.id;
    await rsBookTypeMasterService.deleteBookType(targetId);
    loadTypes();
    if (onTypeAdded) {
      onTypeAdded();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#D1D1CB] rounded-sm w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#FAF9F5] border-b border-[#D1D1CB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaTag className="text-[#D4A853]" size={13} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Manage Entry Book Types
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-black cursor-pointer"
          >
            <FaTimes size={12} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Quick Add Form */}
          <form onSubmit={handleAddType} className="bg-[#FAF9F5] border border-[#E0E0DB] p-3 rounded-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#444444] mb-2">
              Add New Type
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. UPI, Online Transfer"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-[#111111] outline-none"
              />
              <input
                type="text"
                placeholder="Code"
                value={newShortCode}
                onChange={(e) => setNewShortCode(e.target.value.toUpperCase())}
                className="w-20 px-2 py-1.5 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs uppercase text-[#111111] outline-none"
              />
              <button
                type="submit"
                disabled={isAdding}
                className="px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-semibold rounded-sm cursor-pointer shrink-0 flex items-center gap-1"
              >
                <FaPlus size={10} />
                <span>Add</span>
              </button>
            </div>
            {errorMsg && <span className="text-[10px] text-red-600 font-medium block">{errorMsg}</span>}
          </form>

          {/* Existing Types List */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#444444] mb-2 flex items-center justify-between">
              <span>Existing Types ({types.length})</span>
            </div>

            <div className="max-h-48 overflow-y-auto border border-[#E0E0DB] rounded-sm divide-y divide-[#E0E0DB]">
              {types.length === 0 ? (
                <div className="p-3 text-center text-xs text-[#888888]">No types defined</div>
              ) : (
                types.map((item) => (
                  <div key={item.id || item.typeId} className="flex items-center justify-between p-2.5 hover:bg-[#F9F9F7] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111111]">{item.name}</span>
                      <span className="text-[10px] font-mono text-[#666666] bg-[#EDEDE8] px-1.5 py-0.5 rounded-sm">
                        {item.shortCode || "TYP"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteType(item)}
                      className="text-[#999999] hover:text-red-600 p-1 cursor-pointer transition-colors"
                      title="Delete type"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#FAF9F5] border-t border-[#D1D1CB] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#111111] text-white text-xs font-semibold rounded-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
