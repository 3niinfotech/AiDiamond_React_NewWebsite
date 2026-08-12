import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "royalrays_cookie_consent";
const REASK_AFTER_DAYS = 180;
const SHOW_DELAY_MS = 1100;

function getStoredConsent() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const ageDays = (Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24);
        if (ageDays > REASK_AFTER_DAYS) return null;
        return parsed;
    } catch {
        return null;
    }
}

function storeConsent(choice) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ choice, timestamp: Date.now() })
        );
    } catch {
        /* localStorage unavailable */
    }
}

const CookieIcon = () => (
    <svg viewBox="0 0 64 64" fill="none" className="w-6 h-6 md:w-7 md:h-7">
        <path
            d="M32 6C17.64 6 6 17.64 6 32C6 46.36 17.64 58 32 58C46.36 58 58 46.36 58 32C58 29.5 57.6 27.1 56.8 24.8C54.8 25.6 52.6 26 50.3 26C41.5 26 34.3 18.8 34.3 10C34.3 7.7 34.7 5.5 35.5 3.5C34.4 3.2 33.2 3 32 3Z"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="1.5"
        />
        <circle cx="23" cy="24" r="3.5" fill="#111111" />
        <circle cx="21" cy="40" r="3" fill="#111111" />
        <circle cx="36" cy="44" r="3.5" fill="#111111" />
        <circle cx="47" cy="34" r="2.8" fill="#111111" />
        <circle cx="33" cy="31" r="2.5" fill="#111111" />
        <path d="M48 10 L50 14 L54 16 L50 18 L48 22 L46 18 L42 16 L46 14 Z" fill="#FFFFFF" />
    </svg>
);

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const existing = getStoredConsent();
        if (existing) return;

        const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
        return () => clearTimeout(timer);
    }, []);

    const handleChoice = (choice) => {
        storeConsent(choice);
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, scale: 0.96, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto z-[99999] w-auto md:w-[90vw] md:max-w-[380px] lg:max-w-[400px]"
                    role="dialog"
                    aria-live="polite"
                    aria-label="Royal Rays BV Cookie Consent"
                >
                    <div className="relative rounded-2xl bg-white border border-black/10 p-5 pt-8 md:p-6 md:pt-9 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)] text-left">
                        
                        {/* Floating Top Badge */}
                        <motion.span 
                            className="absolute -top-6 left-5 md:-top-7 md:left-6 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#111111] shadow-lg flex items-center justify-center border-2 border-white"
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <CookieIcon />
                        </motion.span>

                        <div className="mb-2 mt-1">
                            <span className="text-[9px] md:text-[10px] uppercase font-mono tracking-[0.2em] text-[#777777] block mb-1">
                                Royal Rays BV • Antwerp
                            </span>
                            <h5 className="text-[#111111] text-sm md:text-base font-semibold leading-snug">
                                Your Privacy, <em className="not-italic text-[#555555] font-serif italic font-normal">Precisely</em> Protected
                            </h5>
                        </div>

                        <p className="text-[#555555] text-[11px] md:text-xs leading-relaxed mb-4 font-normal">
                            At Royal Rays BV, we value your privacy as much as our Antwerp diamond heritage. We use essential cookies to personalize your session and ensure seamless exploration of our natural diamond collections.
                        </p>

                        <AnimatePresence initial={false}>
                            {expanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="mb-4 space-y-2 text-[10px] md:text-[11px] text-[#666666] border-t border-black/8 pt-3">
                                        <p>
                                            <span className="text-[#111111] font-semibold">Essential Cookies</span> — Required for secure session navigation &amp; catalog viewing.
                                        </p>
                                        <p>
                                            <span className="text-[#111111] font-semibold">Performance</span> — Helps optimize high-resolution diamond image loading speed.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-black/5">
                            <button
                                type="button"
                                onClick={() => setExpanded((v) => !v)}
                                className="text-[10px] md:text-xs font-semibold text-[#666666] hover:text-[#111111] transition-colors underline underline-offset-2 text-left sm:text-center"
                            >
                                {expanded ? "Less Details" : "More Options"}
                            </button>

                            <div className="flex items-center gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => handleChoice("essential-only")}
                                    className="px-3 py-1.5 md:px-3.5 md:py-1.5 text-[10px] md:text-xs font-medium rounded-lg border border-black/15 text-[#333333] hover:bg-black hover:text-white transition-colors bg-[#FAFAF8]"
                                >
                                    Essential
                                </button>

                                <motion.button
                                    type="button"
                                    onClick={() => handleChoice("accepted")}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-3.5 py-1.5 md:px-4 md:py-1.5 text-[10px] md:text-xs font-semibold rounded-lg bg-[#111111] hover:bg-[#333333] text-white shadow-md transition-colors"
                                >
                                    Accept All
                                </motion.button>
                            </div>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}