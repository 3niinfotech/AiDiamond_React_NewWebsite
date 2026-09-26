import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(totalItems, currentPage * itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalItems === 0) return null;

  return (
    <div className="bg-white border-t border-[#E0E0DB] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none">
      {/* Left: Info & Rows Per Page */}
      <div className="flex items-center gap-3 text-[#555555]">
        <span>
          Showing <strong className="font-semibold text-[#111111]">{startItem}</strong> to{" "}
          <strong className="font-semibold text-[#111111]">{endItem}</strong> of{" "}
          <strong className="font-semibold text-[#111111]">{totalItems}</strong> entries
        </span>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-[#E0E0DB] pl-3">
            <span className="text-[11px] text-[#777777]">Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-[#FAFAF8] border border-[#D1D1CB] rounded-xs px-2 py-0.5 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Pagination Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`inline-flex items-center justify-center w-7 h-7 rounded-xs border transition-all ${
            currentPage === 1
              ? "bg-[#F5F5F2] text-[#AAAAAA] border-[#E0E0DB] cursor-not-allowed"
              : "bg-white text-[#333333] border-[#D1D1CB] hover:bg-[#F5F5F2] hover:text-black cursor-pointer shadow-2xs"
          }`}
          title="Previous Page"
        >
          <FaChevronLeft size={9} />
        </button>

        {getPageNumbers().map((pg) => (
          <button
            key={pg}
            onClick={() => onPageChange(pg)}
            className={`w-7 h-7 text-xs font-semibold rounded-xs border transition-all cursor-pointer ${
              pg === currentPage
                ? "bg-[#111111] text-white border-[#111111] shadow-2xs"
                : "bg-white text-[#555555] border-[#D1D1CB] hover:bg-[#F5F5F2] hover:text-black"
            }`}
          >
            {pg}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center justify-center w-7 h-7 rounded-xs border transition-all ${
            currentPage === totalPages
              ? "bg-[#F5F5F2] text-[#AAAAAA] border-[#E0E0DB] cursor-not-allowed"
              : "bg-white text-[#333333] border-[#D1D1CB] hover:bg-[#F5F5F2] hover:text-black cursor-pointer shadow-2xs"
          }`}
          title="Next Page"
        >
          <FaChevronRight size={9} />
        </button>
      </div>
    </div>
  );
};
