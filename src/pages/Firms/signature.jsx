import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaPlus,
    FaSearch,
    FaTimes,
    FaCheckCircle,
    FaSignOutAlt,
    FaFileSignature,
    FaGem,
    FaBoxes,
    FaBalanceScale,
    FaChartLine,
    FaMoneyBillWave,
    FaArrowDown,
    FaArrowUp,
    FaFileExcel,
    FaFileCsv,
    FaTrash,
    FaEye,
    FaFilter,
    FaExchangeAlt,
    FaArrowRight,
} from "react-icons/fa";
import {
    getAllFirms,
    formatCurrency,
    getAuthUser,
    clearAuthUser,
} from "../../data/firmData";
import { exportToCSV, exportToExcel } from "../../utils/excelExport";

const ENTRY_TYPES = [
    {
        id: "rough-purchase",
        name: "Rough Purchase",
        group: "trade",
        type: "Purchase",
        category: "Rough",
        crDr: "DR",
        color: "#B45309",
        bg: "#FEF3C7",
        border: "#FDE68A",
        icon: FaGem,
        tagline: "Procurement & Consignment Inward",
    },
    {
        id: "rough-sale",
        name: "Rough Sale",
        group: "trade",
        type: "Sale",
        category: "Rough",
        crDr: "CR",
        color: "#15803D",
        bg: "#DCFCE7",
        border: "#BBF7D0",
        icon: FaGem,
        tagline: "Outward Consignment & Bourse Sale",
    },
    {
        id: "polish-purchase",
        name: "Polish Purchase",
        group: "trade",
        type: "Purchase",
        category: "Polish",
        crDr: "DR",
        color: "#B45309",
        bg: "#FEF3C7",
        border: "#FDE68A",
        icon: FaBoxes,
        tagline: "GIA / Certified Solitaires Inward",
    },
    {
        id: "polish-sale",
        name: "Polish Sale",
        group: "trade",
        type: "Sale",
        category: "Polish",
        crDr: "CR",
        color: "#15803D",
        bg: "#DCFCE7",
        border: "#BBF7D0",
        icon: FaBoxes,
        tagline: "Domestic & Export Solitaire Sale",
    },
    {
        id: "lgd-purchase",
        name: "LGD Purchase",
        group: "trade",
        type: "Purchase",
        category: "LGD",
        crDr: "DR",
        color: "#7C3AED",
        bg: "#F3E8FF",
        border: "#E9D5FF",
        icon: FaGem,
        tagline: "Lab Grown (CVD/HPHT) Inward Lots",
    },
    {
        id: "lgd-sale",
        name: "LGD Sale",
        group: "trade",
        type: "Sale",
        category: "LGD",
        crDr: "CR",
        color: "#0D9488",
        bg: "#CCFBF1",
        border: "#99F6E4",
        icon: FaGem,
        tagline: "Lab Grown Diamond Outward Sales",
    },
    {
        id: "expense",
        name: "Expense",
        group: "finance",
        type: "Expense",
        category: "Expense",
        crDr: "DR",
        color: "#DC2626",
        bg: "#FEE2E2",
        border: "#FECACA",
        icon: FaMoneyBillWave,
        tagline: "Brokerage, Labor, Certifications & Rent",
    },
    {
        id: "payment-entry",
        name: "Payment Entry",
        group: "finance",
        type: "Payment",
        category: "Payment",
        crDr: "DR",
        color: "#C026D3",
        bg: "#FAE8FF",
        border: "#F5D0FE",
        icon: FaArrowDown,
        tagline: "Vendor & Supplier Settlements Outflow",
    },
    {
        id: "payment-receive",
        name: "Payment Receive",
        group: "finance",
        type: "Receive",
        category: "Receive",
        crDr: "CR",
        color: "#2563EB",
        bg: "#DBEAFE",
        border: "#BFDBFE",
        icon: FaArrowUp,
        tagline: "Customer & Buyer Payments Inflow",
    },
];

const INITIAL_SIGNATURE_DATA = [
    {
        id: "sig-001",
        date: "2026-09-10",
        entryType: "Rough Purchase",
        partyName: "Kiran Gems Pvt Ltd",
        itemDescription: "Run-of-Mine Rough Parcels #RP-402",
        carats: 250.50,
        rate: 18500,
        amount: 4634250,
        crDr: "DR",
        paymentMode: "Bank Transfer",
        remark: "Direct Bourse Consignment Invoice #KP-8891",
    },
    {
        id: "sig-002",
        date: "2026-09-09",
        entryType: "Polish Sale",
        partyName: "Venus Jewel",
        itemDescription: "Triple Excellent 1.00ct - 2.50ct Solitaires GIA",
        carats: 48.20,
        rate: 185000,
        amount: 8917000,
        crDr: "CR",
        paymentMode: "Dubai Wire",
        remark: "Export shipment Dubai DMCC clearance",
    },
    {
        id: "sig-003",
        date: "2026-09-08",
        entryType: "LGD Purchase",
        partyName: "Darsh Jewellers",
        itemDescription: "CVD Oval & Pear Lab Grown Lots",
        carats: 110.00,
        rate: 12500,
        amount: 1375000,
        crDr: "DR",
        paymentMode: "Bank Transfer",
        remark: "Surat Labgrown Delivery Memo #LG-112",
    },
    {
        id: "sig-004",
        date: "2026-09-07",
        entryType: "Payment Receive",
        partyName: "Venus Jewel",
        itemDescription: "Part payment settlement against Polish invoice",
        carats: 0,
        rate: 0,
        amount: 5000000,
        crDr: "CR",
        paymentMode: "Bank Transfer",
        remark: "HDFC Fort RTGS Ref #9812401",
    },
    {
        id: "sig-005",
        date: "2026-09-06",
        entryType: "Expense",
        partyName: "IGI Lab Mumbai",
        itemDescription: "Grading & Laser Inscription Charges",
        carats: 0,
        rate: 0,
        amount: 185000,
        crDr: "DR",
        paymentMode: "Bank Transfer",
        remark: "Assaying batch #IGI-994",
    },
    {
        id: "sig-006",
        date: "2026-09-05",
        entryType: "Rough Sale",
        partyName: "Shree Ram Gems",
        itemDescription: "Industrial Sawable Rough Selection (150 Cts)",
        carats: 150.00,
        rate: 22000,
        amount: 3300000,
        crDr: "CR",
        paymentMode: "Angadia",
        remark: "Cash parcel settlement",
    },
];

const STORAGE_KEY = "royal_rays_signature_vouchers_v1";

const Signature = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [vouchers, setVouchers] = useState([]);
    const [activeTab, setActiveTab] = useState("vouchers"); // "vouchers" | "reports"
    const [activeReport, setActiveReport] = useState("closing-stock"); // "closing-stock" | "payable-receivable" | "summary"
    const [selectedEntryFilter, setSelectedEntryFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [toastMessage, setToastMessage] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentModalType, setCurrentModalType] = useState("Rough Purchase");
    const [modalFormData, setModalFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        entryType: "Rough Purchase",
        partyName: "",
        itemDescription: "",
        carats: "",
        rate: "",
        amount: "",
        paymentMode: "Bank Transfer",
        remark: "",
    });
    const [modalErrors, setModalErrors] = useState({});

    // View Modal State
    const [viewRecord, setViewRecord] = useState(null);

    useEffect(() => {
        const user = getAuthUser();
        if (!user) {
            setCurrentUser({ name: "RSDXB", username: "RSDXB" });
        } else {
            setCurrentUser(user);
        }

        if (typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    setVouchers(JSON.parse(saved));
                } else {
                    setVouchers(INITIAL_SIGNATURE_DATA);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SIGNATURE_DATA));
                }
            } catch (e) {
                setVouchers(INITIAL_SIGNATURE_DATA);
            }
        }
    }, []);

    const saveVouchers = (updated) => {
        setVouchers(updated);
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
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

    // Open Add Modal for specific entry type
    const handleOpenAddModal = (entryType) => {
        setCurrentModalType(entryType);
        setModalFormData({
            date: new Date().toISOString().split("T")[0],
            entryType: entryType,
            partyName: "",
            itemDescription: "",
            carats: "",
            rate: "",
            amount: "",
            paymentMode: "Bank Transfer",
            remark: "",
        });
        setModalErrors({});
        setIsModalOpen(true);
    };

    // Auto calculate amount from carats and rate
    const handleCaratOrRateChange = (field, value) => {
        const updated = { ...modalFormData, [field]: value };
        const cts = field === "carats" ? Number(value) : Number(modalFormData.carats);
        const rt = field === "rate" ? Number(value) : Number(modalFormData.rate);

        if (cts > 0 && rt > 0 && !modalFormData.amount) {
            updated.amount = (cts * rt).toFixed(0);
        }
        setModalFormData(updated);
    };

    // Handle Form Submit
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const errors = {};
        if (!modalFormData.date) errors.date = "Date is required";
        if (!modalFormData.partyName.trim()) errors.partyName = "Party / Account is required";
        if (!modalFormData.amount || Number(modalFormData.amount) <= 0) {
            errors.amount = "Valid amount is required";
        }

        if (Object.keys(errors).length > 0) {
            setModalErrors(errors);
            return;
        }

        const isSaleOrReceive =
            modalFormData.entryType.includes("Sale") ||
            modalFormData.entryType.includes("Receive");

        const newVoucher = {
            id: `sig-${Date.now()}`,
            date: modalFormData.date,
            entryType: modalFormData.entryType,
            partyName: modalFormData.partyName.trim(),
            itemDescription: modalFormData.itemDescription.trim() || `${modalFormData.entryType} voucher`,
            carats: Number(modalFormData.carats) || 0,
            rate: Number(modalFormData.rate) || 0,
            amount: Number(modalFormData.amount) || 0,
            crDr: isSaleOrReceive ? "CR" : "DR",
            paymentMode: modalFormData.paymentMode,
            remark: modalFormData.remark.trim(),
        };

        const updated = [newVoucher, ...vouchers];
        saveVouchers(updated);
        setIsModalOpen(false);
        showToast(`${modalFormData.entryType} entry created successfully!`);
    };

    // Delete Voucher
    const handleDeleteVoucher = (id) => {
        const updated = vouchers.filter((v) => v.id !== id);
        saveVouchers(updated);
        showToast("Voucher deleted successfully");
    };

    // Filtered Vouchers
    const filteredVouchers = useMemo(() => {
        return vouchers.filter((v) => {
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                v.partyName.toLowerCase().includes(q) ||
                v.entryType.toLowerCase().includes(q) ||
                v.itemDescription.toLowerCase().includes(q) ||
                v.date.includes(q) ||
                (v.remark && v.remark.toLowerCase().includes(q));

            const matchesType =
                selectedEntryFilter === "All" || v.entryType === selectedEntryFilter;

            return matchesSearch && matchesType;
        });
    }, [vouchers, searchQuery, selectedEntryFilter]);

    // Overall Statistics
    const stats = useMemo(() => {
        let totalPurchases = 0;
        let totalSales = 0;
        let totalExpenses = 0;
        let totalReceived = 0;
        let totalPaid = 0;
        let roughStockCts = 0;
        let polishStockCts = 0;
        let lgdStockCts = 0;

        vouchers.forEach((v) => {
            const amt = Number(v.amount) || 0;
            const cts = Number(v.carats) || 0;

            if (v.entryType === "Rough Purchase") {
                totalPurchases += amt;
                roughStockCts += cts;
            } else if (v.entryType === "Rough Sale") {
                totalSales += amt;
                roughStockCts -= cts;
            } else if (v.entryType === "Polish Purchase") {
                totalPurchases += amt;
                polishStockCts += cts;
            } else if (v.entryType === "Polish Sale") {
                totalSales += amt;
                polishStockCts -= cts;
            } else if (v.entryType === "LGD Purchase") {
                totalPurchases += amt;
                lgdStockCts += cts;
            } else if (v.entryType === "LGD Sale") {
                totalSales += amt;
                lgdStockCts -= cts;
            } else if (v.entryType === "Expense") {
                totalExpenses += amt;
            } else if (v.entryType === "Payment Entry") {
                totalPaid += amt;
            } else if (v.entryType === "Payment Receive") {
                totalReceived += amt;
            }
        });

        return {
            totalPurchases,
            totalSales,
            totalExpenses,
            totalReceived,
            totalPaid,
            roughStockCts,
            polishStockCts,
            lgdStockCts,
            totalStockCts: roughStockCts + polishStockCts + lgdStockCts,
            netTradeBalance: totalSales - totalPurchases - totalExpenses,
        };
    }, [vouchers]);

    // Report 1: Closing Stock Calculations
    const closingStockData = useMemo(() => {
        const categories = ["Rough", "Polish", "LGD"];
        return categories.map((cat) => {
            const purEntries = vouchers.filter((v) => v.entryType === `${cat} Purchase`);
            const saleEntries = vouchers.filter((v) => v.entryType === `${cat} Sale`);

            const inCts = purEntries.reduce((s, r) => s + (Number(r.carats) || 0), 0);
            const inVal = purEntries.reduce((s, r) => s + (Number(r.amount) || 0), 0);

            const outCts = saleEntries.reduce((s, r) => s + (Number(r.carats) || 0), 0);
            const outVal = saleEntries.reduce((s, r) => s + (Number(r.amount) || 0), 0);

            const closingCts = inCts - outCts;
            const avgRate = inCts > 0 ? inVal / inCts : 0;
            const closingVal = closingCts > 0 ? closingCts * avgRate : 0;

            return {
                category: `${cat} Diamonds`,
                inCts,
                inVal,
                outCts,
                outVal,
                closingCts,
                avgRate,
                closingVal,
            };
        });
    }, [vouchers]);

    // Report 2: Payable / Receivable Party Calculations
    const partyLedgerBalances = useMemo(() => {
        const partiesMap = {};

        vouchers.forEach((v) => {
            const p = v.partyName || "General";
            if (!partiesMap[p]) {
                partiesMap[p] = { party: p, purchase: 0, sale: 0, paid: 0, received: 0 };
            }

            const amt = Number(v.amount) || 0;
            if (v.entryType.includes("Purchase")) partiesMap[p].purchase += amt;
            if (v.entryType.includes("Sale")) partiesMap[p].sale += amt;
            if (v.entryType === "Payment Entry") partiesMap[p].paid += amt;
            if (v.entryType === "Payment Receive") partiesMap[p].received += amt;
        });

        return Object.values(partiesMap).map((d) => {
            // Net Payable = Purchase - Paid (we owe them)
            const payable = Math.max(0, d.purchase - d.paid);
            // Net Receivable = Sale - Received (they owe us)
            const receivable = Math.max(0, d.sale - d.received);
            const net = receivable - payable;

            return {
                ...d,
                payable,
                receivable,
                net,
            };
        });
    }, [vouchers]);

    const handleExportCSV = () => {
        exportToCSV(filteredVouchers, "Signature_Trade_Ledger");
        showToast("Exported to CSV");
    };

    const handleExportExcel = () => {
        exportToExcel(filteredVouchers, "Signature Trade ERP", "Signature_Trade_Ledger");
        showToast("Exported to Excel (.xls)");
    };

    const allAvailableParties = getAllFirms();

    return (
        <div className="min-h-screen w-full bg-[#FAFAF8] text-[#111111] font-sans flex flex-col pb-12 selection:bg-black selection:text-white">
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
                    <div className="flex items-center gap-2">
                        <FaFileSignature className="text-[#111111]" size={13} />
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                            Signature Trade & Accounts
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

            {/* Main Container */}
            <main className="flex-1 w-full px-4 sm:px-8 py-5">
                {/* KPI Strip */}
                {/* <div className="bg-white border border-[#D1D1CB] rounded-sm p-2 sm:p-3 mb-5 shadow-2xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E0E0DB]">
                        1. Total Purchases
                        <div className="px-3 py-1.5">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-[#991B1B]">
                                Total Purchases
                            </div>
                            <div className="text-base font-bold text-[#DC2626] font-mono leading-tight">
                                {formatCurrency(stats.totalPurchases)}
                            </div>
                            <div className="text-[10px] text-[#777777]">Rough + Polish + LGD</div>
                        </div>

                        2. Total Sales
                        <div className="px-3 py-1.5">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-[#166534]">
                                Total Sales
                            </div>
                            <div className="text-base font-bold text-[#16A34A] font-mono leading-tight">
                                {formatCurrency(stats.totalSales)}
                            </div>
                            <div className="text-[10px] text-[#777777]">Direct & Bourse Sales</div>
                        </div>

                        3. Total Closing Stock
                        <div className="px-3 py-1.5">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-[#111111]">
                                Closing Stock (Cts)
                            </div>
                            <div className="text-base font-bold text-[#111111] font-mono leading-tight">
                                {stats.totalStockCts.toFixed(2)} Cts
                            </div>
                            <div className="text-[10px] text-[#777777]">Active Physical Vault</div>
                        </div>

                        4. Trade Net Position
                        <div className="px-3 py-1.5">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-[#2563EB]">
                                Net Trading Balance
                            </div>
                            <div className={`text-base font-bold font-mono leading-tight ${stats.netTradeBalance >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                                {formatCurrency(stats.netTradeBalance)}
                            </div>
                            <div className="text-[10px] text-[#777777]">Sales - Purchases - Exp</div>
                        </div>
                    </div>
                </div> */}

                {/* Section Navigation Tabs: [1. Vouchers & Forms] vs [2. Reports] */}
                <div className="flex items-center justify-between gap-3 border-b border-[#E0E0DB] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab("vouchers")}
                            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${activeTab === "vouchers"
                                ? "bg-[#111111] text-white shadow-2xs"
                                : "bg-white text-[#555555] hover:bg-[#F5F5F2] border border-[#E0E0DB]"
                                }`}
                        >
                            Vouchers & Trade Entries
                        </button>

                        <button
                            onClick={() => setActiveTab("reports")}
                            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${activeTab === "reports"
                                ? "bg-[#111111] text-white shadow-2xs"
                                : "bg-white text-[#555555] hover:bg-[#F5F5F2] border border-[#E0E0DB]"
                                }`}
                        >
                            Financial & Stock Reports
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportExcel}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white hover:bg-[#F0FDF4] border border-[#D1D1CB] hover:border-[#86EFAC] text-xs text-[#166534] font-semibold transition-colors cursor-pointer"
                            title="Export Excel"
                        >
                            <FaFileExcel className="text-[#16A34A]" size={12} />
                            <span>Excel</span>
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-xs text-[#444444] font-semibold transition-colors cursor-pointer"
                            title="Export CSV"
                        >
                            <FaFileCsv size={12} />
                            <span>CSV</span>
                        </button>
                    </div>
                </div>

                {/* =========================================================================
            TAB 1: 9 QUICK ACTION FORM BUTTONS + VOUCHER LEDGER TABLE
        ========================================================================= */}
                {activeTab === "vouchers" && (
                    <div className="space-y-4">
                        {/* The 9 Action Buttons Strip */}
                        <div className="bg-white p-3.5 rounded-sm border border-[#E0E0DB] shadow-2xs">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-[#444444] mb-2.5 flex items-center justify-between">
                                <span>Create New Entry / Voucher:</span>
                                <span className="text-[10px] text-[#777777] font-normal">Click any category to open form</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                {ENTRY_TYPES.map((et) => {
                                    const IconComp = et.icon || FaGem;
                                    const catEntries = vouchers.filter((v) => v.entryType === et.name);
                                    const totalAmt = catEntries.reduce((acc, v) => acc + (Number(v.amount) || 0), 0);
                                    const totalCts = catEntries.reduce((acc, v) => acc + (Number(v.carats) || 0), 0);

                                    return (
                                        <button
                                            key={et.id}
                                            onClick={() => navigate(`/signature/${et.id}`)}
                                            className="relative text-left p-4 rounded-sm bg-white border border-[#E0E0DB] hover:border-[#111111] hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between overflow-hidden"
                                            title={`Open ${et.name} Entry Page`}
                                        >
                                            {/* Top Accent Hover Line */}
                                            <div
                                                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                style={{ backgroundColor: et.color }}
                                            />

                                            {/* Top Row: Category Icon + Type Badge + CR/DR */}
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0 border"
                                                        style={{
                                                            backgroundColor: et.bg,
                                                            color: et.color,
                                                            borderColor: et.border,
                                                        }}
                                                    >
                                                        <IconComp size={12} />
                                                    </span>
                                                    <span
                                                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs"
                                                        style={{
                                                            backgroundColor: et.bg,
                                                            color: et.color,
                                                        }}
                                                    >
                                                        {et.type}
                                                    </span>
                                                </div>

                                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs bg-[#F5F5F2] text-[#555555] border border-[#E0E0DB]">
                                                    {et.crDr}
                                                </span>
                                            </div>

                                            {/* Middle Row: Title + Tagline + Navigation Arrow */}
                                            <div className="mb-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="text-sm font-bold text-[#111111] group-hover:text-black transition-colors leading-tight">
                                                        {et.name}
                                                    </h3>
                                                    <FaArrowRight
                                                        size={11}
                                                        className="text-[#AAAAAA] group-hover:text-black group-hover:translate-x-1 transition-all shrink-0"
                                                    />
                                                </div>
                                                <p className="text-[11px] text-[#777777] mt-1 line-clamp-1">
                                                    {et.tagline}
                                                </p>
                                            </div>

                                            {/* Bottom Row: Metrics & Volume summary */}
                                            <div className="pt-2.5 border-t border-[#F0F0EC] flex items-center justify-between text-[11px]">
                                                <span className="text-[#666666] font-medium">
                                                    {catEntries.length} {catEntries.length === 1 ? "entry" : "entries"}
                                                    {totalCts > 0 && ` • ${totalCts.toFixed(2)} Cts`}
                                                </span>
                                                <span className="font-mono font-bold" style={{ color: et.color }}>
                                                    {formatCurrency(totalAmt)}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Filter Toolbar */}
                        {/* <div className="bg-white p-3 rounded-sm border border-[#E0E0DB] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-2xs">
                            <div className="relative w-full md:w-80 shrink-0">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] text-xs pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search Party, Voucher, Item..."
                                    className="w-full pl-9 pr-7 py-1.5 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs text-[#111111] placeholder-[#999999] outline-none"
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

                            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                                <button
                                    onClick={() => setSelectedEntryFilter("All")}
                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-xs border transition-colors shrink-0 cursor-pointer ${selectedEntryFilter === "All"
                                        ? "bg-[#111111] text-white border-black"
                                        : "bg-[#F5F5F2] text-[#555555] border-[#E0E0DB] hover:bg-[#EBEBE6]"
                                        }`}
                                >
                                    All Entries ({vouchers.length})
                                </button>
                                {ENTRY_TYPES.map((et) => (
                                    <button
                                        key={et.id}
                                        onClick={() => setSelectedEntryFilter(et.name)}
                                        className={`px-2 py-1 text-[10px] font-semibold rounded-xs border transition-colors shrink-0 cursor-pointer ${selectedEntryFilter === et.name
                                            ? "bg-[#111111] text-white border-black"
                                            : "bg-[#FAFAF8] text-[#555555] border-[#E0E0DB] hover:bg-[#EBEBE6]"
                                            }`}
                                    >
                                        {et.name}
                                    </button>
                                ))}
                            </div>
                        </div> */}

                        {/* Vouchers Table */}
                        {/* <div className="bg-white border border-[#D1D1CB] rounded-sm shadow-2xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="bg-[#F5F5F2] border-b border-[#D1D1CB] text-[11px] font-bold uppercase tracking-wider text-[#444444]">
                                            <th className="py-2.5 px-3 text-center border-r border-[#D1D1CB] w-24">Date</th>
                                            <th className="py-2.5 px-3 text-center border-r border-[#D1D1CB] w-32">Entry Type</th>
                                            <th className="py-2.5 px-4 border-r border-[#D1D1CB]">Party / Account</th>
                                            <th className="py-2.5 px-4 border-r border-[#D1D1CB]">Item Description</th>
                                            <th className="py-2.5 px-3 text-right border-r border-[#D1D1CB] w-20">Carats</th>
                                            <th className="py-2.5 px-3 text-right border-r border-[#D1D1CB] w-24">Rate/Ct</th>
                                            <th className="py-2.5 px-4 text-right border-r border-[#D1D1CB] w-32">Amount</th>
                                            <th className="py-2.5 px-3 text-center border-r border-[#D1D1CB] w-16">CR/DR</th>
                                            <th className="py-2.5 px-3 text-center w-20">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#EAEAE6] text-xs">
                                        {filteredVouchers.length > 0 ? (
                                            filteredVouchers.map((row) => {
                                                const isCr = row.crDr === "CR";
                                                return (
                                                    <tr key={row.id} className="hover:bg-[#FAFAF8] transition-colors">
                                                        <td className="py-2 px-3 text-center border-r border-[#D1D1CB] font-mono text-[#444444] whitespace-nowrap">
                                                            {row.date}
                                                        </td>
                                                        <td className="py-2 px-3 text-center border-r border-[#D1D1CB] whitespace-nowrap">
                                                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#F5F5F2] text-[#333333] border border-[#E0E0DB]">
                                                                {row.entryType}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 px-4 border-r border-[#D1D1CB] font-semibold text-[#111111]">
                                                            {row.partyName}
                                                        </td>
                                                        <td className="py-2 px-4 border-r border-[#D1D1CB] text-[#555555] max-w-xs truncate" title={row.itemDescription}>
                                                            {row.itemDescription}
                                                        </td>
                                                        <td className="py-2 px-3 text-right border-r border-[#D1D1CB] font-mono text-[#333333]">
                                                            {row.carats > 0 ? Number(row.carats).toFixed(2) : "-"}
                                                        </td>
                                                        <td className="py-2 px-3 text-right border-r border-[#D1D1CB] font-mono text-[#333333]">
                                                            {row.rate > 0 ? formatCurrency(row.rate) : "-"}
                                                        </td>
                                                        <td className="py-2 px-4 text-right border-r border-[#D1D1CB] font-mono font-bold whitespace-nowrap">
                                                            <span className={isCr ? "text-[#166534]" : "text-[#DC2626]"}>
                                                                {formatCurrency(row.amount)}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 px-3 text-center border-r border-[#D1D1CB] whitespace-nowrap">
                                                            <span
                                                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isCr
                                                                    ? "bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]"
                                                                    : "bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]"
                                                                    }`}
                                                            >
                                                                {row.crDr}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 px-3 text-center whitespace-nowrap">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <button
                                                                    onClick={() => setViewRecord(row)}
                                                                    className="w-6 h-6 rounded-xs bg-white hover:bg-[#F5F5F2] border border-[#D1D1CB] text-[#444444] flex items-center justify-center cursor-pointer shadow-2xs"
                                                                    title="View"
                                                                >
                                                                    <FaEye size={10} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteVoucher(row.id)}
                                                                    className="w-6 h-6 rounded-xs bg-white hover:bg-[#FEF2F2] border border-[#D1D1CB] hover:border-[#FCA5A5] text-[#DC2626] flex items-center justify-center cursor-pointer shadow-2xs"
                                                                    title="Delete"
                                                                >
                                                                    <FaTrash size={9} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="py-10 text-center text-[#777777]">
                                                    <FaFileSignature className="mx-auto text-[#CCCCCC] text-2xl mb-2" />
                                                    <p className="text-sm text-[#333333] font-semibold">No trade vouchers found</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div> */}
                    </div>
                )}

                {/* =========================================================================
            TAB 2: 3 DETAILED REPORTS
        ========================================================================= */}
                {activeTab === "reports" && (
                    <div className="space-y-4">
                        {/* Report Selector Strip */}
                        <div className="flex items-center gap-2 border-b border-[#E0E0DB] pb-3">
                            <button
                                onClick={() => setActiveReport("closing-stock")}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer ${activeReport === "closing-stock"
                                    ? "bg-[#111111] text-white"
                                    : "bg-white text-[#555555] hover:bg-[#F5F5F2] border border-[#E0E0DB]"
                                    }`}
                            >
                                1. Closing Stock Report
                            </button>

                            <button
                                onClick={() => setActiveReport("payable-receivable")}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer ${activeReport === "payable-receivable"
                                    ? "bg-[#111111] text-white"
                                    : "bg-white text-[#555555] hover:bg-[#F5F5F2] border border-[#E0E0DB]"
                                    }`}
                            >
                                2. Payable / Receivable Report
                            </button>

                            <button
                                onClick={() => setActiveReport("summary")}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer ${activeReport === "summary"
                                    ? "bg-[#111111] text-white"
                                    : "bg-white text-[#555555] hover:bg-[#F5F5F2] border border-[#E0E0DB]"
                                    }`}
                            >
                                3. Purchase - Sale Summary
                            </button>
                        </div>

                        {/* REPORT 1: CLOSING STOCK REPORT */}
                        {activeReport === "closing-stock" && (
                            <div className="bg-white border border-[#D1D1CB] rounded-sm shadow-2xs overflow-hidden">
                                <div className="p-3.5 bg-[#FAFAF8] border-b border-[#E0E0DB] flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                                            Closing Stock & Vault Inventory Statement
                                        </h3>
                                        <p className="text-[11px] text-[#777777]">Physical inward, outward and valuation per diamond category</p>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-[#111111]">
                                        Total Weight: {stats.totalStockCts.toFixed(2)} Cts
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-left text-xs">
                                        <thead>
                                            <tr className="bg-[#F5F5F2] border-b border-[#D1D1CB] text-[11px] font-bold uppercase tracking-wider text-[#444444]">
                                                <th className="py-2.5 px-4 border-r border-[#D1D1CB]">Diamond Category</th>
                                                <th className="py-2.5 px-4 text-right border-r border-[#D1D1CB]">Inward (Purchase Cts)</th>
                                                <th className="py-2.5 px-4 text-right border-r border-[#D1D1CB]">Inward Value</th>
                                                <th className="py-2.5 px-4 text-right border-r border-[#D1D1CB]">Outward (Sale Cts)</th>
                                                <th className="py-2.5 px-4 text-right border-r border-[#D1D1CB]">Outward Value</th>
                                                <th className="py-2.5 px-4 text-right border-r border-[#D1D1CB]">Closing Stock (Cts)</th>
                                                <th className="py-2.5 px-4 text-right">Est. Valuation</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#EAEAE6]">
                                            {closingStockData.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-[#FAFAF8]">
                                                    <td className="py-2.5 px-4 font-semibold text-[#111111] border-r border-[#D1D1CB]">
                                                        {row.category}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right font-mono border-r border-[#D1D1CB]">
                                                        {row.inCts.toFixed(2)} Cts
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right font-mono border-r border-[#D1D1CB] text-[#991B1B]">
                                                        {formatCurrency(row.inVal)}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right font-mono border-r border-[#D1D1CB]">
                                                        {row.outCts.toFixed(2)} Cts
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right font-mono border-r border-[#D1D1CB] text-[#166534]">
                                                        {formatCurrency(row.outVal)}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right font-mono font-bold text-[#111111] border-r border-[#D1D1CB]">
                                                        {row.closingCts.toFixed(2)} Cts
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right font-mono font-bold text-[#111111]">
                                                        {formatCurrency(row.closingVal)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* REPORT 2: PAYABLE / RECEIVABLE REPORT */}
                        {activeReport === "payable-receivable" && (
                            <div className="bg-white border border-[#D1D1CB] rounded-sm shadow-2xs overflow-hidden">
                                <div className="p-3.5 bg-[#FAFAF8] border-b border-[#E0E0DB] flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                                            Party-wise Outstanding Payables & Receivables
                                        </h3>
                                        <p className="text-[11px] text-[#777777]">Consolidated supplier debts and buyer receivables</p>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-left text-xs">
                                        <thead>
                                            <tr className="bg-[#F5F5F2] border-b border-[#D1D1CB] text-[11px] font-bold uppercase tracking-wider text-[#444444]">
                                                <th className="py-2.5 px-4 border-r border-[#D1D1CB]">Party Name</th>
                                                <th className="py-2.5 px-4 text-right border-r border-[#D1D1CB]">Total Invoices (Purchase)</th>
                                                <th className="py-2.5 px-4 text-right border-r border-[#D1D1CB]">Paid Out</th>
                                                <th className="py-2.5 px-4 text-right border-r border-[#D1D1CB]">Net Payable (We Owe)</th>
                                                <th className="py-2.5 px-4 text-right border-r border-[#D1D1CB]">Total Sales Invoiced</th>
                                                <th className="py-2.5 px-4 text-right border-r border-[#D1D1CB]">Received</th>
                                                <th className="py-2.5 px-4 text-right">Net Receivable (Due to Us)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#EAEAE6]">
                                            {partyLedgerBalances.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-[#FAFAF8]">
                                                    <td className="py-2.5 px-4 font-semibold text-[#111111] border-r border-[#D1D1CB]">
                                                        {row.party}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right font-mono border-r border-[#D1D1CB]">
                                                        {formatCurrency(row.purchase)}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right font-mono border-r border-[#D1D1CB] text-[#166534]">
                                                        {formatCurrency(row.paid)}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right font-mono font-bold text-[#DC2626] border-r border-[#D1D1CB]">
                                                        {formatCurrency(row.payable)}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right font-mono border-r border-[#D1D1CB]">
                                                        {formatCurrency(row.sale)}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right font-mono border-r border-[#D1D1CB] text-[#166534]">
                                                        {formatCurrency(row.received)}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right font-mono font-bold text-[#166534]">
                                                        {formatCurrency(row.receivable)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* REPORT 3: PURCHASE - SALE SUMMARY */}
                        {activeReport === "summary" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Purchases Breakdown */}
                                <div className="bg-white border border-[#D1D1CB] rounded-sm p-4 shadow-2xs">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#991B1B] mb-3 pb-2 border-b border-[#EAEAE6]">
                                        Purchases & Expenditure Breakdown
                                    </h3>
                                    <div className="space-y-2.5 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-[#666666]">Rough Purchases:</span>
                                            <span className="font-mono font-bold text-[#111111]">
                                                {formatCurrency(vouchers.filter((v) => v.entryType === "Rough Purchase").reduce((s, r) => s + Number(r.amount || 0), 0))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#666666]">Polish Purchases:</span>
                                            <span className="font-mono font-bold text-[#111111]">
                                                {formatCurrency(vouchers.filter((v) => v.entryType === "Polish Purchase").reduce((s, r) => s + Number(r.amount || 0), 0))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#666666]">LGD Purchases:</span>
                                            <span className="font-mono font-bold text-[#111111]">
                                                {formatCurrency(vouchers.filter((v) => v.entryType === "LGD Purchase").reduce((s, r) => s + Number(r.amount || 0), 0))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#666666]">Direct Expenses & Assaying:</span>
                                            <span className="font-mono font-bold text-[#DC2626]">
                                                {formatCurrency(stats.totalExpenses)}
                                            </span>
                                        </div>
                                        <div className="pt-2 border-t border-[#EAEAE6] flex justify-between font-bold">
                                            <span>Total Outward Commitment:</span>
                                            <span className="font-mono text-[#DC2626]">{formatCurrency(stats.totalPurchases + stats.totalExpenses)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sales Breakdown */}
                                <div className="bg-white border border-[#D1D1CB] rounded-sm p-4 shadow-2xs">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#166534] mb-3 pb-2 border-b border-[#EAEAE6]">
                                        Sales & Revenue Breakdown
                                    </h3>
                                    <div className="space-y-2.5 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-[#666666]">Rough Sales:</span>
                                            <span className="font-mono font-bold text-[#111111]">
                                                {formatCurrency(vouchers.filter((v) => v.entryType === "Rough Sale").reduce((s, r) => s + Number(r.amount || 0), 0))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#666666]">Polish Sales:</span>
                                            <span className="font-mono font-bold text-[#111111]">
                                                {formatCurrency(vouchers.filter((v) => v.entryType === "Polish Sale").reduce((s, r) => s + Number(r.amount || 0), 0))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#666666]">LGD Sales:</span>
                                            <span className="font-mono font-bold text-[#111111]">
                                                {formatCurrency(vouchers.filter((v) => v.entryType === "LGD Sale").reduce((s, r) => s + Number(r.amount || 0), 0))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#666666]">Payments Inflow (Liquid):</span>
                                            <span className="font-mono font-bold text-[#16A34A]">
                                                {formatCurrency(stats.totalReceived)}
                                            </span>
                                        </div>
                                        <div className="pt-2 border-t border-[#EAEAE6] flex justify-between font-bold">
                                            <span>Total Inward Value:</span>
                                            <span className="font-mono text-[#16A34A]">{formatCurrency(stats.totalSales)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* =========================================================================
          MODAL: DYNAMIC ENTRY FORM FOR ALL 9 ENTRY TYPES
      ========================================================================= */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="relative w-full max-w-lg bg-white border border-[#D1D1CB] rounded-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="px-5 py-3 bg-[#FAFAF8] border-b border-[#E8E8E4] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaPlus className="text-[#111111]" size={12} />
                                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                                    New {modalFormData.entryType} Entry
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 text-[#777777] hover:text-black cursor-pointer rounded-sm hover:bg-[#EBEBE6] transition-colors"
                            >
                                <FaTimes size={13} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={modalFormData.date}
                                        onChange={(e) => setModalFormData({ ...modalFormData, date: e.target.value })}
                                        className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs outline-none"
                                    />
                                    {modalErrors.date && (
                                        <span className="text-[11px] text-[#DC2626] block mt-1">{modalErrors.date}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                                        Entry Category
                                    </label>
                                    <input
                                        type="text"
                                        value={modalFormData.entryType}
                                        disabled
                                        className="w-full px-3 py-2 bg-[#F5F5F2] border border-[#E0E0DB] rounded-sm text-xs font-semibold text-[#111111] cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Party Name */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                                    Party / Account Name *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        list="partyList"
                                        value={modalFormData.partyName}
                                        onChange={(e) => {
                                            setModalFormData({ ...modalFormData, partyName: e.target.value });
                                            if (modalErrors.partyName) setModalErrors({ ...modalErrors, partyName: null });
                                        }}
                                        placeholder="Select or enter party name"
                                        className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs outline-none"
                                        autoFocus
                                    />
                                    <datalist id="partyList">
                                        {allAvailableParties.map((p) => (
                                            <option key={p.id} value={p.name} />
                                        ))}
                                    </datalist>
                                </div>
                                {modalErrors.partyName && (
                                    <span className="text-[11px] text-[#DC2626] block mt-1">{modalErrors.partyName}</span>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                                    Item / Parcel / Voucher Details
                                </label>
                                <input
                                    type="text"
                                    value={modalFormData.itemDescription}
                                    onChange={(e) => setModalFormData({ ...modalFormData, itemDescription: e.target.value })}
                                    placeholder="e.g. Parcel Lot #402, GIA Solitaire, Office expense, etc."
                                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs outline-none"
                                />
                            </div>

                            {/* Carats, Rate, Amount (Hidden for expense or payment) */}
                            {!modalFormData.entryType.includes("Payment") && !modalFormData.entryType.includes("Expense") ? (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                                            Carats (Cts)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={modalFormData.carats}
                                            onChange={(e) => handleCaratOrRateChange("carats", e.target.value)}
                                            placeholder="0.00"
                                            className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                                            Rate / Ct
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={modalFormData.rate}
                                            onChange={(e) => handleCaratOrRateChange("rate", e.target.value)}
                                            placeholder="Rate"
                                            className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                                            Total Amount *
                                        </label>
                                        <input
                                            type="number"
                                            value={modalFormData.amount}
                                            onChange={(e) => setModalFormData({ ...modalFormData, amount: e.target.value })}
                                            placeholder="Amount"
                                            className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs font-bold outline-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                                            Total Amount *
                                        </label>
                                        <input
                                            type="number"
                                            value={modalFormData.amount}
                                            onChange={(e) => setModalFormData({ ...modalFormData, amount: e.target.value })}
                                            placeholder="Enter amount"
                                            className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs font-bold outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                                            Payment Mode
                                        </label>
                                        <select
                                            value={modalFormData.paymentMode}
                                            onChange={(e) => setModalFormData({ ...modalFormData, paymentMode: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs outline-none cursor-pointer"
                                        >
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Dubai Wire">Dubai Wire</option>
                                            <option value="Angadia">Angadia</option>
                                            <option value="Cheque">Cheque</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {modalErrors.amount && (
                                <span className="text-[11px] text-[#DC2626] block mt-1">{modalErrors.amount}</span>
                            )}

                            {/* Remark */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#444444] mb-1">
                                    Remark / Reference
                                </label>
                                <input
                                    type="text"
                                    value={modalFormData.remark}
                                    onChange={(e) => setModalFormData({ ...modalFormData, remark: e.target.value })}
                                    placeholder="Reference memo or invoice note"
                                    className="w-full px-3 py-2 bg-white border border-[#D1D1CB] focus:border-black rounded-sm text-xs outline-none"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-3 border-t border-[#E8E8E4] flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-sm bg-[#F5F5F2] hover:bg-[#EBEBE6] text-xs font-semibold text-[#444444] cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-sm bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-2xs transition-colors"
                                >
                                    Save Voucher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================================================
          VIEW VOUCHER MODAL
      ========================================================================= */}
            {viewRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="relative w-full max-w-md bg-white border border-[#D1D1CB] rounded-sm shadow-xl overflow-hidden p-5">
                        <div className="flex items-center justify-between pb-3 border-b border-[#EAEAE6] mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                                Voucher Details — {viewRecord.entryType}
                            </span>
                            <button
                                onClick={() => setViewRecord(null)}
                                className="p-1 text-[#777777] hover:text-black cursor-pointer rounded-sm hover:bg-[#EBEBE6]"
                            >
                                <FaTimes size={13} />
                            </button>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between py-1 border-b border-[#F5F5F2]">
                                <span className="text-[#666666]">Date:</span>
                                <span className="font-mono font-semibold">{viewRecord.date}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-[#F5F5F2]">
                                <span className="text-[#666666]">Party Name:</span>
                                <span className="font-semibold">{viewRecord.partyName}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-[#F5F5F2]">
                                <span className="text-[#666666]">Description:</span>
                                <span>{viewRecord.itemDescription}</span>
                            </div>
                            {viewRecord.carats > 0 && (
                                <div className="flex justify-between py-1 border-b border-[#F5F5F2]">
                                    <span className="text-[#666666]">Carats:</span>
                                    <span className="font-mono">{viewRecord.carats} Cts</span>
                                </div>
                            )}
                            {viewRecord.rate > 0 && (
                                <div className="flex justify-between py-1 border-b border-[#F5F5F2]">
                                    <span className="text-[#666666]">Rate / Ct:</span>
                                    <span className="font-mono">{formatCurrency(viewRecord.rate)}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-1 border-b border-[#F5F5F2]">
                                <span className="text-[#666666]">Total Amount:</span>
                                <span className="font-mono font-bold text-sm">{formatCurrency(viewRecord.amount)}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-[#F5F5F2]">
                                <span className="text-[#666666]">Payment Mode:</span>
                                <span>{viewRecord.paymentMode}</span>
                            </div>
                            {viewRecord.remark && (
                                <div className="flex justify-between py-1">
                                    <span className="text-[#666666]">Remark:</span>
                                    <span>{viewRecord.remark}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 mt-3 border-t border-[#EAEAE6] flex justify-end">
                            <button
                                onClick={() => setViewRecord(null)}
                                className="px-4 py-1.5 rounded-sm bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider"
                            >
                                Close
                            </button>
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

export default Signature;