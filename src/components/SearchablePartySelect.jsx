import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaSearch, FaChevronDown, FaTimes, FaCheck, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";

/**
 * SearchablePartySelect Component
 * Provides a searchable/filterable dropdown for selecting parties from Party Master
 * or entering custom party names on the fly.
 */
export const SearchablePartySelect = ({
  value = "",
  onChange,
  parties = [],
  placeholder = "-- Search or Select Party --",
  required = false,
  disabled = false,
  className = "",
  error = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Sync searchTerm when external value changes
  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter parties based on search input
  const filteredParties = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();
    if (!term) return parties;

    return parties.filter((p) => {
      const nameMatch = (p.name || p.partyName || "").toLowerCase().includes(term);
      const codeMatch = (p.shortCode || "").toLowerCase().includes(term);
      const locMatch = (p.location || "").toLowerCase().includes(term);
      const trnMatch = (p.trn || "").toLowerCase().includes(term);
      return nameMatch || codeMatch || locMatch || trnMatch;
    });
  }, [parties, searchTerm]);

  const exactMatch = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();
    if (!term) return null;
    return parties.find(
      (p) => (p.name || p.partyName || "").trim().toLowerCase() === term
    );
  }, [parties, searchTerm]);

  const handleSelect = (partyName) => {
    setSearchTerm(partyName);
    onChange(partyName);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setSearchTerm(text);
    onChange(text);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchTerm("");
    onChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          required={required && !searchTerm}
          disabled={disabled}
          autoComplete="off"
          className={`w-full bg-white border ${
            error ? "border-red-500" : "border-[#D1D1CB]"
          } rounded-sm pl-2.5 pr-14 py-1.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111] transition-colors disabled:bg-[#F5F5F2] disabled:cursor-not-allowed`}
        />

        <div className="absolute right-2 flex items-center gap-1.5 text-[#888888]">
          {searchTerm && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-black cursor-pointer rounded-xs transition-colors"
              title="Clear selection"
            >
              <FaTimes size={10} />
            </button>
          )}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
            className="p-1 hover:text-black cursor-pointer rounded-xs transition-colors"
            tabIndex={-1}
          >
            <FaChevronDown
              size={10}
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-180 text-black" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#D1D1CB] rounded-sm shadow-lg max-h-60 overflow-y-auto z-50 animate-in fade-in duration-100">
          {/* Header count info */}
          <div className="px-3 py-1.5 bg-[#FAFAF8] border-b border-[#EAEAE6] text-[10px] font-semibold uppercase tracking-wider text-[#777777] flex items-center justify-between">
            <span>Parties from Party Master</span>
            <span>{filteredParties.length} available</span>
          </div>

          {/* List of Matching Parties */}
          {filteredParties.length > 0 ? (
            <ul className="py-1 divide-y divide-[#F5F5F2]">
              {filteredParties.map((p) => {
                const pName = p.name || p.partyName;
                const isSelected =
                  value && value.trim().toLowerCase() === pName.trim().toLowerCase();

                return (
                  <li
                    key={p.id || pName}
                    onClick={() => handleSelect(pName)}
                    className={`px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#F3F4EE] text-black font-semibold"
                        : "hover:bg-[#FAFAF8] text-[#222222]"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <FaBuilding className="text-[#888888] shrink-0 text-xs" />
                      <span className="truncate">{pName}</span>
                      {p.shortCode && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#F5F5F2] text-[#555555] border border-[#E0E0DB] shrink-0">
                          {p.shortCode}
                        </span>
                      )}
                      {p.location && (
                        <span className="text-[10px] text-[#777777] flex items-center gap-1 shrink-0">
                          <FaMapMarkerAlt size={9} />
                          <span>{p.location}</span>
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <FaCheck size={11} className="text-[#16A34A] shrink-0" />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-3 text-center text-xs text-[#777777]">
              No existing party matches "<strong>{searchTerm}</strong>"
            </div>
          )}

          {/* Option to use custom typed text if not an exact match */}
          {searchTerm && !exactMatch && (
            <div
              onClick={() => handleSelect(searchTerm.trim())}
              className="px-3 py-2 border-t border-[#E8E8E4] bg-[#F9F9F6] hover:bg-[#F3F4EE] text-xs font-semibold text-[#111111] cursor-pointer flex items-center gap-2 transition-colors"
            >
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-[#111111] text-white font-mono">
                + Custom
              </span>
              <span className="truncate">Use "<strong>{searchTerm.trim()}</strong>"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchablePartySelect;
