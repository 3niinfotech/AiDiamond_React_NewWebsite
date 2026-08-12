import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronUp, FaWhatsapp } from "react-icons/fa";
import { getScrollY, scrollToTopSmooth } from "../../utils/scroll";

const ScrollIndicator = () => {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showNumber, setShowNumber] = useState(false);
  const isHoveringWhatsApp = useRef(false);

  // Auto-show tooltip periodically (natural timing, not rigid loop).
  useEffect(() => {
    const SHOW_MIN_MS = 3800;
    const SHOW_MAX_MS = 5200;
    const GAP_MIN_MS = 9000;
    const GAP_MAX_MS = 16000;
    const INITIAL_DELAY_MS = 4000;

    let hideTimer = null;
    let scheduleTimer = null;

    const randomBetween = (min, max) =>
      Math.floor(min + Math.random() * (max - min + 1));

    const scheduleNextShow = () => {
      const gap = randomBetween(GAP_MIN_MS, GAP_MAX_MS);
      scheduleTimer = setTimeout(showTooltipOnce, gap);
    };

    const showTooltipOnce = () => {
      if (!isHoveringWhatsApp.current) setShowNumber(true);

      const showDuration = randomBetween(SHOW_MIN_MS, SHOW_MAX_MS);

      hideTimer = setTimeout(() => {
        if (!isHoveringWhatsApp.current) setShowNumber(false);
        scheduleNextShow();
      }, showDuration);
    };

    scheduleTimer = setTimeout(showTooltipOnce, INITIAL_DELAY_MS);

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      if (scheduleTimer) clearTimeout(scheduleTimer);
    };
  }, [location.pathname]);

  useEffect(() => {
    const updateScrollState = () => {
      const y = getScrollY();
      const max =
        document.documentElement.scrollHeight - window.innerHeight;

      setShowScrollTop(max > 0 && y >= max * 0.5);
      setScrollProgress(max > 0 ? Math.min(y / max, 1) : 0);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    document.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      document.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [location.pathname]);

  const scrollToTop = () => {
    scrollToTopSmooth();
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/1234567890", "_blank");
  };

  const buttonBaseStyle = {
    outline: "none",
    WebkitTapHighlightColor: "transparent",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "flex-end",
        gap: "12px",
      }}
    >
      <AnimatePresence mode="popLayout">
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{
              ...buttonBaseStyle,
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "white",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <FaChevronUp size={20} color="#333" />

            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                transform: "rotate(-90deg)",
                pointerEvents: "none",
              }}
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="rgba(0,0,0,0.04)"
                strokeWidth="2"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#D4A853"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${scrollProgress * 125.66} 125.66`}
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          width: "56px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <motion.button
          type="button"
          onClick={openWhatsApp}
          aria-label="Chat on WhatsApp"
          onMouseEnter={() => {
            isHoveringWhatsApp.current = true;
            setShowNumber(true);
          }}
          onMouseLeave={() => {
            isHoveringWhatsApp.current = false;
            setShowNumber(false);
          }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 8px 30px rgba(37, 211, 102, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...buttonBaseStyle,
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "#25D366",
            border: "none",
            boxShadow: "0 4px 20px rgba(37, 211, 102, 0.35)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-3px",
              borderRadius: "50%",
              border: "2px solid #25D366",
              opacity: 0,
              animation: "pulseRing 2s ease-out infinite",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              background: "#ff4757",
              color: "white",
              fontSize: "8px",
              fontWeight: "700",
              padding: "2px 6px",
              borderRadius: "20px",
              border: "2px solid white",
              minWidth: "16px",
              textAlign: "center",
            }}
          >
            1
          </div>

          <FaWhatsapp size={28} color="white" />
        </motion.button>

        <AnimatePresence>
          {showNumber && (
            <motion.div
              key="whatsapp-tooltip"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "50%",
              right: "64px",
              background: "#1a1a1a",
              color: "white",
              padding: "8px 16px 8px 18px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "500",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: "-6px",
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "6px solid #1a1a1a",
              }}
            />

            <span
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#25D366",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FaWhatsapp size={12} color="white" />
            </span>

            <span
              style={{
                width: "1px",
                height: "20px",
                background: "rgba(255,255,255,0.1)",
              }}
            />

            <span
              style={{
                color: "white",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              +1 (234) 567-890
            </span>
          </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        @keyframes pulseRing {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollIndicator;
