import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSitemap,
  FaFileAlt,
  FaHome,
  FaGem,
  FaCalendar,
  FaHistory,
  FaInfoCircle,
  FaBlog,
  FaEnvelope,
  FaShieldAlt,
} from "react-icons/fa";
const DOMAIN = "https://www.royalraysbv.com";

const pages = [
  { label: "Home", path: "/", icon: FaHome },
  { label: "About", path: "/about", icon: FaInfoCircle },
  { label: "Diamonds", path: "/diamonds", icon: FaGem },
  { label: "Our Legacy", path: "/our-legacy", icon: FaHistory },
  { label: "Events", path: "/event", icon: FaCalendar },
  { label: "Blog / Journal", path: "/blog", icon: FaBlog },
  { label: "Contact", path: "/contact", icon: FaEnvelope },
  {
    label: "Privacy Policy",
    path: "/privacy-policy",
    icon: FaShieldAlt,
  },
  { label: "Terms of Use", path: "/terms-of-use", icon: FaFileAlt },
];

const Sitemap = () => {
  return (
    <>
      <Helmet>
        <title>Sitemap — Royal Rays BV</title>
        <meta
          name="description"
          content="Browse all pages of the Royal Rays BV website. Diamond manufacturing, events, blog, contact, and legal pages."
        />
        <link rel="canonical" href={`${DOMAIN}/sitemap`} />
      </Helmet>

      <div className="bg-[#FAF8F4] text-[#111111]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0A0A0A] pb-14 pt-28 md:pb-20 md:pt-36">
          {/* off-white to black/grey gradient */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(250,248,244,0.92) 0%, rgba(250,248,244,0.70) 14%, rgba(10,10,10,0.98) 55%, rgba(42,42,42,1) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, rgba(212,168,83,0.12), transparent 55%), radial-gradient(circle at 75% 20%, rgba(255,255,255,0.05), transparent 40%)",
            }}
          />

          <div className="relative mx-auto max-w-[1500px] px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-center">
                <h1 className="text-[clamp(2.4rem,6vw,4.8rem)] font-light leading-[0.95] tracking-[-0.02em] text-white">
                  Sitemap
                </h1>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                {/* hidden on purpose: sitemap.xml / robots.txt */}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content (show all public pages) */}
        <section className="mx-auto max-w-[1500px] px-6 py-14 md:px-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[#E8E8E4] bg-white p-6 md:p-8"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#111111]/5">
                <FaSitemap size={15} className="text-[#111111]" />
              </span>
              <div>
                <h3 className="mb-1 text-[15px] font-medium text-[#111111]">
                  Explore All Pages
                </h3>
                <p className="text-[13px] leading-relaxed text-[#666]">
                  This is a complete list of all public pages on the Royal Rays
                  BV website.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((p) => {
                const Icon = p.icon;
                return (
                  <Link
                    key={p.path}
                    to={p.path}
                    className="group flex items-center gap-3 rounded-xl border border-[#E3E3DD] bg-[#FAF8F4] px-4 py-3 transition-all duration-300 hover:border-[#111111]/25 hover:bg-white hover:shadow-md"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111111]/5 transition-colors group-hover:bg-[#111111]/10">
                      <Icon size={16} className="text-[#111111]" />
                    </span>
                    <span className="min-w-0 flex-1 text-[13px] font-medium text-[#111111] group-hover:underline underline-offset-2">
                      {p.label}
                    </span>
                    <span className="text-[#C9C9C4] transition-colors group-hover:text-[#111111]">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default Sitemap;
