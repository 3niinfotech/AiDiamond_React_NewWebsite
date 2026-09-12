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
} from "react-icons/fa";
import logoDark from "../../assets/images/logo.png";
import {
  getAllFirms,
  getFirmRecords,
  calculateFirmSummary,
  formatCurrency,
  getAuthUser,
} from "../../data/firmData";
import { useAuth } from "../../hooks/useAuth";

const FirmSelection = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [firms, setFirms] = useState([]);
  const [firmStats, setFirmStats] = useState({});

  useEffect(() => {
    const user = authUser || getAuthUser();
    if (!user) {
      setCurrentUser({ name: "RSDXB", username: "RSDXB" });
    } else {
      setCurrentUser(user);
    }

    const allFirms = getAllFirms();
    setFirms(allFirms);

    const statsObj = {};
    allFirms.forEach((firm) => {
      const records = getFirmRecords(firm.id);
      statsObj[firm.id] = calculateFirmSummary(records);
    });
    setFirmStats(statsObj);
  }, [authUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
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
        firm.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (firm.trn && firm.trn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (firm.contact &&
        firm.contact.toLowerCase().includes(searchQuery.toLowerCase()))
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
      {/* Top Navbar */}
      <div className="w-full bg-white border-b border-[#E8E8E4] px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <Link to="/">
            <img
              src={logoDark}
              alt="Royal Rays"
              className="h-7 w-auto object-contain"
            />
          </Link>
          <span className="h-4 w-px bg-[#E0E0DB]" /> */}
          <span className="text-xs font-semibold uppercase tracking-wider text-[#333333]">
            Firm Portals
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
        {/* Title & Search + Party Master Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E8E4] mb-5">
          <div>
            <h1 className="text-xl font-serif font-medium text-[#111111]">
              Select Firm Book
            </h1>
            <p className="text-xs text-[#777777] mt-0.5">
              Select one of the firm books to manage transactions and export records.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
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
              onClick={() => navigate("/party-master")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-2xs"
              title="Open Party Master"
            >
              <FaUsers size={11} />
              <span>Party Master</span>
            </button>
            <button
              onClick={() => navigate("/signature")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-2xs"
              title="Open signature"
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

            return (
              <div
                key={firm.id}
                className="bg-white border border-[#E5E5E0] hover:border-[#111111] rounded-sm p-4 flex flex-col justify-between transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h2 className="text-base font-serif font-semibold text-[#111111] truncate" title={firm.name}>
                      {firm.name}
                    </h2>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#F5F5F2] text-[#444444] border border-[#E8E8E4] shrink-0">
                      {firm.shortCode}
                    </span>
                  </div>

                  {/* Micro stats table */}
                  <div className="p-2.5 rounded-sm bg-[#FAFAF8] border border-[#EAEAE6] mb-3 text-[11px] space-y-1">
                    <div className="flex justify-between">
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
                        {formatCurrency(stats.netBalance)}
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
              Try adjusting your search or go to Party Master to add a new party.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default FirmSelection;
