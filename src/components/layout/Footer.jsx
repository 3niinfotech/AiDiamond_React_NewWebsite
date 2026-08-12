import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaLink,
  FaShieldAlt,
  FaChevronRight,
} from "react-icons/fa";

import diamondImg from "../../assets/images/footer.png";
import appStoreBadge from "../../assets/svg/app-store.svg";
import googlePlayBadge from "../../assets/svg/google-play-badge-logo.svg";
import { LEGAL_LINKS } from "../../constants/legalLinks";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const FacetMark = ({ className = "" }) => (
  <svg
    viewBox="0 0 32 32"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
  >
    <path d="M6 11 L16 3 L26 11 L16 29 Z" strokeLinejoin="round" />
    <path d="M6 11 L26 11" />
    <path d="M11 11 L16 3 L21 11" />
    <path d="M11 11 L16 29 M21 11 L16 29" />
  </svg>
);

const socialLinks = [
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://www.linkedin.com/company/royal-rays" },
  { icon: FaTwitter, label: "Twitter", href: "https://twitter.com/royalraysbv" },
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/royalraysbv" },
];

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/event" },
  { name: "Diamonds", path: "/diamonds" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Blog", path: "/blog" },
];

const companyLinks = [
  { name: "Our History & Legacy", path: "/our-legacy" },
  { name: "Ethical Sourcing", path: "/about" },
  { name: "Certifications", path: "/diamonds" },
  { name: "Press & Insights", path: "/blog" },
  { name: "Global Offices", path: "/contact" },
];

const FooterLink = ({ name, path }) => (
  <Link
    to={path}
    className="group flex items-center justify-between py-1.5 text-[15px] text-[#4D4D4D] hover:text-[#111111] transition-colors duration-300"
  >
    <span className="relative">
      {name}
      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#111111] transition-all duration-300 group-hover:w-full" />
    </span>
    <FaChevronRight
      size={10}
      className="text-[#C9C9C4] group-hover:text-[#111111] translate-x-0 group-hover:translate-x-1 transition-all duration-300"
    />
  </Link>
);

const Footer = () => {
  return (
    <footer className="relative bg-[#F5F5F2] overflow-hidden">
      {/* ambient corner glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-white/60 blur-3xl" />

      <div className="relative max-w-[1500px] mx-auto px-6 md:px-12 pt-16">

        {/* ===== Columns ===== */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerParent}
        >
          {/* About */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2.5 mb-5">
              <FacetMark className="w-4 h-4 text-[#111111]" />
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#111111] uppercase font-semibold">
                About Royal Rays
              </span>
            </div>
            <p className="text-[14.5px] text-[#4D4D4D] leading-relaxed">
              Royal Rays BV is a premier diamond manufacturing house based in
              Antwerp, with over 35 years of excellence in sourcing, cutting,
              and exporting natural fancy cut diamonds worldwide.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="group w-9 h-9 rounded-full border border-[#D4D4D4] flex items-center justify-center bg-white hover:bg-[#111111] hover:border-[#111111] transition-colors duration-300"
                >
                  <Icon
                    size={13}
                    className="text-[#111111] group-hover:text-white transition-colors duration-300"
                  />
                </motion.a>
              ))}
            </div>

            {/* App Store / Google Play — SVG assets, 2-col row */}
            <div className="mt-7 grid w-full max-w-[320px] grid-cols-2 gap-1 sm:gap-1.5">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="block min-w-0"
              >
                <img
                  src={appStoreBadge}
                  alt="Download on the App Store"
                  className="h-9 w-full object-contain object-left sm:h-10"
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
                className="block min-w-0"
              >
                <img
                  src={googlePlayBadge}
                  alt="Get it on Google Play"
                  className="h-9 w-full object-contain object-left sm:h-10"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>
          </motion.div>

          {/* Belgium Office */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2.5 mb-5">
              <FaMapMarkerAlt className="w-3.5 h-3.5 text-[#111111]" />
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#111111] uppercase font-semibold">
                Belgium Office
              </span>
            </div>
            <div className="space-y-4">
              <a
                href="https://maps.google.com/?q=Hoveniersstraat+2,+2018+Antwerpen,+Belgium"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <FaMapMarkerAlt className="w-3.5 h-3.5 text-[#B5B5B0] group-hover:text-[#111111] mt-1 shrink-0 transition-colors" />
                <p className="text-[14.5px] text-[#4D4D4D] group-hover:text-[#111111] leading-relaxed transition-colors">
                  341, Hoveniersstraat 2,
                  <br />
                  2018 Antwerpen, Belgium.
                </p>
              </a>
              <a
                href="tel:+32472784366"
                className="flex items-center gap-3 text-[14.5px] text-[#4D4D4D] hover:text-[#111111] transition-colors duration-300"
              >
                <FaPhoneAlt className="w-3.5 h-3.5 text-[#B5B5B0] shrink-0" />
                +32 472 78 43 66
              </a>
              <a
                href="mailto:belgium@royalraysbv.com"
                className="flex items-center gap-3 text-[14.5px] text-[#4D4D4D] hover:text-[#111111] transition-colors duration-300"
              >
                <FaEnvelope className="w-3.5 h-3.5 text-[#B5B5B0] shrink-0" />
                belgium@royalraysbv.com
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2.5 mb-5">
              <FaLink className="w-3.5 h-3.5 text-[#111111]" />
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#111111] uppercase font-semibold">
                Quick Links
              </span>
            </div>
            <div className="flex flex-col">
              {quickLinks.map((item) => (
                <FooterLink key={item.name} name={item.name} path={item.path} />
              ))}
            </div>
          </motion.div>

          {/* Company */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2.5 mb-5">
              <FaShieldAlt className="w-3.5 h-3.5 text-[#111111]" />
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#111111] uppercase font-semibold">
                Company
              </span>
            </div>
            <div className="flex flex-col">
              {companyLinks.map((item) => (
                <FooterLink key={item.name} name={item.name} path={item.path} />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ===== Bottom bar ===== */}
        <div className="relative mt-20 pt-8 border-t border-[#E3E3DD]">
          {/* radiating diamond graphic, centered, straddling the divider */}
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-[30px] w-[420px] h-[170px] flex items-end justify-center overflow-hidden">
            <svg
              viewBox="0 0 420 170"
              className="absolute bottom-0 w-full h-full text-[#111111]/[0.06]"
              fill="none"
            >
              {[...Array(9)].map((_, i) => {
                const angle = -70 + i * 17.5;
                const rad = (angle * Math.PI) / 180;
                const x2 = 210 + 260 * Math.sin(rad);
                const y2 = 170 - 260 * Math.cos(rad);
                return (
                  <line
                    key={i}
                    x1="210"
                    y1="170"
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
            <motion.img
              src={diamondImg}
              alt=""
              aria-hidden="true"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-24 h-24 object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.12)]"
            />
          </div>

          {/* Bottom bar - Web: Left + Right justify, Mobile: Center */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            {/* Left: Copyright */}
            <div className="text-[12px] md:text-[13px] text-[#888888] font-mono text-center md:text-left">
              © {new Date().getFullYear()} Royal Rays BV. All Rights Reserved.
            </div>

            {/* Right: Legal + nav links */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-4 text-[11px] md:text-[13px] text-[#777777]">
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#111111] transition-colors duration-300 whitespace-nowrap"
              >
                Privacy Policy
              </a>
              <span className="text-[#D4D4D4]">|</span>
              <a
                href="/terms-of-use"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#111111] transition-colors duration-300 whitespace-nowrap"
              >
                Terms of Use
              </a>
              <span className="text-[#D4D4D4]">|</span>
              <a
                href={LEGAL_LINKS[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#111111] transition-colors duration-300 whitespace-nowrap"
              >
                Ethical Business Policies
              </a>
              <span className="text-[#D4D4D4]">|</span>
              <Link
                to="/sitemap"
                className="hover:text-[#111111] transition-colors duration-300 whitespace-nowrap"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </footer>
  );
};

export default Footer;