import React from "react";
import { motion } from "framer-motion";
import ShapeIcon from "./ShapeIcon";

/**
 * SectionHeader — common eyebrow + title + description block used across
 * section intros. Pass text only via props; layout, responsiveness, and
 * the reveal animation are handled here so every section stays consistent.
 *
 * Props:
 *  - eyebrow      small label above the title (e.g. "Our Craft")
 *  - title        heading text or node
 *  - description  supporting paragraph text
 *  - icon         optional icon component or element (e.g., RiShieldCheckLine)
 *  - iconColor    color for the inline icon
 *  - align        'left' | 'center' (default 'left')
 *  - maxWidth     max width of the description paragraph (default 520px)
 *  - className    extra classes on the outer wrapper
 *  - showLine     show decorative line under title (default false)
 */
const SectionHeader = ({
  eyebrow,
  title,
  description,
  icon: IconComponent,
  iconColor = "#111111",
  align = "left",
  maxWidth = "520px",
  className = "",
  showLine = false,
}) => {
  const isCenter = align === "center";

  return (
    <div
      className={`max-w-[1100px] mx-auto px-6 md:px-12 pt-24 sm:pt-28 md:pt-32 pb-10 md:pb-16 ${
        isCenter ? "text-center" : "text-left"
      } ${className}`}
    >
      {/* Eyebrow with badge style */}
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#111111]/15 bg-white mb-6 ${
            isCenter ? "" : ""
          }`}
        >
          {IconComponent && (
            <span className="text-[#111111] w-3.5 h-3.5 flex items-center justify-center">
              {IconComponent}
            </span>
          )}
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#4D4D4D] uppercase">
            {eyebrow}
          </span>
        </motion.div>
      )}

      {/* Title with underline decoration */}
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: "110%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className={`font-display text-[clamp(30px,4.5vw,52px)] font-light text-[#111111] leading-[1.06] ${
            isCenter ? "text-center" : ""
          }`}
        >
          {title}
        </motion.h2>
      </div>

      {/* Decorative underline */}
      {showLine && (
        <motion.svg
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`mt-2 w-16 md:w-20 h-[2px] ${isCenter ? "mx-auto" : ""}`}
          viewBox="0 0 200 8"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M2 5.5C40 1 100 1 198 5.5"
            stroke="#111111"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.svg>
      )}

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={`text-[#4D4D4D] mt-6 text-[15px] md:text-base leading-relaxed font-light ${
            isCenter ? "mx-auto text-center" : ""
          }`}
          style={{ maxWidth }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeader;
