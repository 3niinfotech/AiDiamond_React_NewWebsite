import React from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

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

  const handleFirst = () => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  // Generate intelligent page numbers array
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

  return (
    <div className="bg-[#FAF9F5] border-t border-[#E0E0DB] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none">
      {/* Left: Entries Counter & Rows Per Page Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-[#555555]">
          <span>Showing</span>
          <span className="font-mono font-bold text-[#111111] bg-white px-2 py-0.5 rounded-sm border border-[#E0E0DB] shadow-2xs">
            {totalItems > 0 ? `${startItem} - ${endItem}` : "0"}
          </span>
          <span>of</span>
          <span className="font-mono font-bold text-[#111111] bg-white px-2 py-0.5 rounded-sm border border-[#E0E0DB] shadow-2xs">
            {totalItems}
          </span>
          <span>entries</span>
        </div>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-2 border-l border-[#DCDCD6] pl-3">
            <span className="text-[11px] font-medium text-[#777777]">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-white border border-[#D1D1CB] hover:border-black rounded-sm px-2 py-1 text-xs font-semibold text-[#111111] cursor-pointer shadow-2xs focus:outline-hidden transition-colors"
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

      {/* Right: Modern Numbered Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={handleFirst}
          disabled={currentPage === 1}
          className={`inline-flex items-center justify-center w-7 h-7 rounded-sm border transition-all ${
            currentPage === 1
              ? "bg-[#F0F0EB] text-[#AAAAAA] border-[#E0E0DB] cursor-not-allowed opacity-50"
              : "bg-white text-[#444444] border-[#D1D1CB] hover:bg-[#111111] hover:text-white hover:border-black cursor-pointer shadow-2xs"
          }`}
          title="First Page"
        >
          <FaAngleDoubleLeft size={10} />
        </button>

        {/* Previous Page */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`inline-flex items-center justify-center w-7 h-7 rounded-sm border transition-all ${
            currentPage === 1
              ? "bg-[#F0F0EB] text-[#AAAAAA] border-[#E0E0DB] cursor-not-allowed opacity-50"
              : "bg-white text-[#444444] border-[#D1D1CB] hover:bg-[#111111] hover:text-white hover:border-black cursor-pointer shadow-2xs"
          }`}
          title="Previous Page"
        >
          <FaChevronLeft size={9} />
        </button>

        {/* Page Number Pills */}
        {getPageNumbers().map((pg) => {
          const isActive = pg === currentPage;
          return (
            <button
              key={pg}
              onClick={() => onPageChange(pg)}
              className={`min-w-[28px] h-7 px-2 text-xs font-mono font-bold rounded-sm border transition-all cursor-pointer ${
                isActive
                  ? "bg-[#111111] text-white border-black shadow-xs ring-1 ring-black/10"
                  : "bg-white text-[#555555] border-[#D1D1CB] hover:bg-[#EBEBE6] hover:text-black hover:border-black"
              }`}
            >
              {pg}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center justify-center w-7 h-7 rounded-sm border transition-all ${
            currentPage === totalPages
              ? "bg-[#F0F0EB] text-[#AAAAAA] border-[#E0E0DB] cursor-not-allowed opacity-50"
              : "bg-white text-[#444444] border-[#D1D1CB] hover:bg-[#111111] hover:text-white hover:border-black cursor-pointer shadow-2xs"
          }`}
          title="Next Page"
        >
          <FaChevronRight size={9} />
        </button>

        {/* Last Page */}
        <button
          onClick={handleLast}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center justify-center w-7 h-7 rounded-sm border transition-all ${
            currentPage === totalPages
              ? "bg-[#F0F0EB] text-[#AAAAAA] border-[#E0E0DB] cursor-not-allowed opacity-50"
              : "bg-white text-[#444444] border-[#D1D1CB] hover:bg-[#111111] hover:text-white hover:border-black cursor-pointer shadow-2xs"
          }`}
          title="Last Page"
        >
          <FaAngleDoubleRight size={10} />
        </button>
      </div>
    </div>
  );
};
