import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { RiDiamondLine } from "react-icons/ri";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const InfinityAnimation = () => (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
    <motion.svg
      viewBox="0 0 540 240"
      className="absolute h-[min(58vw,360px)] w-[min(92vw,680px)]"
      fill="none"
      aria-hidden="true"
    >
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "270px 120px" }}
      >
        <motion.path
          d="M120 120 C120 70 170 50 210 80 C250 110 250 130 210 160 C170 190 120 170 120 120 C120 70 70 50 30 80 C-10 110 -10 130 30 160 C70 190 120 170 120 120"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
          transform="translate(270 120)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M120 120 C120 70 170 50 210 80 C250 110 250 130 210 160 C170 190 120 170 120 120 C120 70 70 50 30 80 C-10 110 -10 130 30 160 C70 190 120 170 120 120"
          stroke="#D4A853"
          strokeWidth="1.2"
          strokeOpacity="0.55"
          transform="translate(270 120) scale(0.72)"
          animate={{ pathLength: [0.15, 1, 0.15], opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>

      <motion.circle
        r="4"
        fill="#D4A853"
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        style={{
          offsetPath:
            'path("M120 120 C120 70 170 50 210 80 C250 110 250 130 210 160 C170 190 120 170 120 120 C120 70 70 50 30 80 C-10 110 -10 130 30 160 C70 190 120 170 120 120")',
          transform: "translate(270px, 120px)",
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
    </motion.svg>

    <motion.div
      className="absolute h-[min(70vw,420px)] w-[min(70vw,420px)] rounded-full border border-white/[0.04]"
      animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.45, 0.25] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute h-[min(50vw,300px)] w-[min(50vw,300px)] rounded-full border border-[#D4A853]/10"
      animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
    />
  </div>
);

const LegalPageLayout = ({
  metaTitle,
  metaDescription,
  badge,
  title,
  subtitle,
  lastUpdated,
  children,
}) => {
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <div className="legal-page-root bg-[#FAF8F4] text-[#111111]">
        <section
          data-header-transparent="true"
          data-header-hero="true"
          className="relative flex min-h-[48vh] items-end overflow-hidden bg-[#0A0A0A] md:min-h-[56vh]"
        >
          {/* Off-white to black/grey gradient base */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(18,18,18,0.98) 0%, rgba(24,24,24,0.92) 16%, rgba(10,10,10,1) 54%, rgba(42,42,42,1) 100%)",
            }}
          />

          {/* Gold + subtle highlight glows (kept, but base made darker so hero doesn't look white) */}
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(212, 168, 83, 0.16), transparent 52%), radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.05), transparent 45%)",
            }}
          />

          <InfinityAnimation />

          <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-12 pt-28 md:px-12 md:pb-16 md:pt-32">
            <motion.div
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              <motion.div
                custom={0}
                variants={fadeUp}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 backdrop-blur-sm"
              >
                <RiDiamondLine size={14} className="text-[#D4A853]" />
                {badge}
              </motion.div>

              <motion.h1
                custom={1}
                variants={fadeUp}
                className="font-display text-[clamp(2.2rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-white"
              >
                {title}
              </motion.h1>

              <motion.p
                custom={2}
                variants={fadeUp}
                className="mt-5 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base"
              >
                {subtitle}
              </motion.p>

              {lastUpdated && (
                <motion.p
                  custom={3}
                  variants={fadeUp}
                  className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45"
                >
                  Last updated: {lastUpdated}
                </motion.p>
              )}
            </motion.div>
          </div>
        </section>

        <section
          data-header-hero-end="true"
          className="relative mx-auto max-w-[900px] px-6 py-14 md:px-12 md:py-20"
        >
          <div
            className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#D4A853]/10 blur-3xl"
            aria-hidden="true"
          />
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="legal-content relative space-y-10 rounded-3xl border border-[#E8E8E4] bg-white p-7 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.15)] md:p-12"
          >
            {children}
          </motion.article>
        </section>
      </div>
    </>
  );
};

export default LegalPageLayout;
