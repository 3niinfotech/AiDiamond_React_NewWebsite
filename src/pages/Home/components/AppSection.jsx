import React from "react";
import { motion } from "framer-motion";
import { BsSearch, BsShuffle, BsRulers, BsPalette } from "react-icons/bs";
import phoneImg from "../../../assets/images/phone-app.png";

const features = [
  {
    icon: BsSearch,
    tag: "01",
    title: "Easy to Search",
    desc: "Filter live stock by shape, size, color and clarity.",
  },
  {
    icon: BsShuffle,
    tag: "02",
    title: "Matching Pair",
    desc: "Auto-match stones to find true pairs instantly.",
  },
  {
    icon: BsRulers,
    tag: "03",
    title: "Calibrated Diamonds",
    desc: "Filter stones sized for exact settings.",
  },
  {
    icon: BsPalette,
    tag: "04",
    title: "Fancy Color & Round",
    desc: "View fancy color and round brilliants side by side.",
  },
];

// ---- scroll-reveal variants ----
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.2, 0.7, 0.15, 1] },
  },
};

const imageIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.2, 0.7, 0.15, 1] },
  },
};

// ---- real brand icons (inline svg, full color) ----
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 flex-none" fill="#fff">
    <path d="M16.365 1.43c0 1.14-.42 2.16-1.24 3.06-.99 1.06-2.19 1.67-3.49 1.56-.04-1.1.42-2.24 1.22-3.11.83-.9 2.25-1.58 3.51-1.51zM20.6 17.24c-.34.79-.74 1.51-1.2 2.19-.63.93-1.15 1.57-1.55 1.93-.63.6-1.3.9-2.02.92-.52.02-1.14-.14-1.86-.44-.72-.3-1.38-.44-1.99-.44-.63 0-1.31.14-2.03.44-.72.3-1.31.46-1.76.47-.7.03-1.38-.28-2.05-.93-.44-.4-.98-1.06-1.63-2.02-.7-1.03-1.28-2.22-1.73-3.6-.48-1.48-.72-2.92-.72-4.31 0-1.6.35-2.98 1.04-4.13.55-.93 1.28-1.66 2.19-2.2.91-.54 1.9-.82 2.96-.84.55 0 1.27.17 2.17.5.9.34 1.48.5 1.74.5.19 0 .84-.2 1.94-.59 1.04-.36 1.92-.51 2.64-.46 1.95.16 3.42.93 4.39 2.31-1.75 1.06-2.61 2.54-2.6 4.45.02 1.49.56 2.72 1.63 3.71.48.46 1.02.81 1.62 1.06-.13.38-.27.75-.42 1.11z" />
  </svg>
);

const GooglePlayIcon = () => (
  <svg viewBox="0 0 512 512" className="w-6 h-6 flex-none">
    <path
      d="M47 22c-6 6-9 15-9 27v414c0 12 3 21 9 27l4 3 232-232v-5L51 19l-4 3z"
      fill="#00D2FF"
    />
    <path
      d="M355 337l-77-77v-5l77-77 5 3 92 52c26 15 26 39 0 54l-92 52-5-2z"
      fill="#FFD500"
    />
    <path d="M360 339l-79-79-234 234c9 9 23 10 39 1l274-156" fill="#FF3A44" />
    <path d="M360 181L86 25C70 16 56 17 47 26l234 234 79-79z" fill="#00E177" />
  </svg>
);

const AppSection = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center py-12 md:py-16 lg:py-24">
          {/* Left Column — copy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={container}
            className="order-2 lg:order-1"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-black/45 font-mono mb-3"
            >
              <span className="w-5 h-px bg-black/30" />
              Royal Rays Software & App
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-medium text-black leading-[1.08] tracking-[-0.01em]"
            >
              Every{" "}
              <span className="italic bg-gradient-to-r from-black/60 via-black to-black/60 bg-[length:220%_100%] text-transparent bg-clip-text animate-[shimmer_7s_linear_infinite]">
                facet
              </span>{" "}
              of sourcing,
              <br />
              one app.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-[14px] sm:text-[15px] md:text-[16.5px] text-black/50 leading-relaxed max-w-[420px] mt-3 sm:mt-4"
            >
              Search, shortlist and confirm diamonds from your phone — synced
              live with your Royal Rays account.
            </motion.p>

            {/* Feature list — Mobile me stacked, Tablet+ me row */}
            <motion.div
              variants={fadeUp}
              className="mt-6 sm:mt-8 border-t border-black/10"
            >
              {features.map((f) => (
                <motion.div
                  key={f.tag}
                  variants={fadeUp}
                  className="group flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-3 sm:py-3.5 border-b border-black/10 hover:pl-0 sm:hover:pl-1.5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] sm:text-[10.5px] tracking-[0.06em] text-black/30 w-5 flex-none">
                      {f.tag}
                    </span>
                    <f.icon className="w-3.5 h-3.5 text-black/35 flex-none group-hover:text-black/70 transition-colors duration-300" />
                    <h3 className="text-[13px] sm:text-[14.5px] font-semibold text-black flex-none">
                      {f.title}
                    </h3>
                  </div>
                  <span className="text-[12px] sm:text-[13px] text-black/40 leading-snug sm:ml-0">
                    — {f.desc}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA buttons — Mobile me full width, Tablet+ me inline */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 sm:gap-3.5 mt-6 sm:mt-8"
            >
              <motion.a
                href="#"
                aria-label="Download on the App Store"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="relative inline-flex items-center justify-center sm:justify-start gap-3 px-5 py-3 rounded-md bg-black text-white overflow-hidden group transition-shadow duration-300 hover:shadow-[0_14px_28px_-14px_rgba(0,0,0,0.35)] w-full sm:w-auto"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <AppleIcon />
                <span className="flex flex-col leading-tight">
                  <small className="text-[9px] tracking-[0.04em] text-white/60 uppercase">
                    Download on the
                  </small>
                  <strong className="text-[14px] font-bold">App Store</strong>
                </span>
              </motion.a>

              <motion.a
                href="#"
                aria-label="Get it on Google Play"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="relative inline-flex items-center justify-center sm:justify-start gap-3 px-5 py-3 rounded-md bg-black text-white overflow-hidden group transition-shadow duration-300 hover:shadow-[0_14px_28px_-14px_rgba(0,0,0,0.35)] w-full sm:w-auto"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <GooglePlayIcon />
                <span className="flex flex-col leading-tight">
                  <small className="text-[9px] tracking-[0.04em] text-white/60 uppercase">
                    Get it on
                  </small>
                  <strong className="text-[14px] font-bold">Google Play</strong>
                </span>
              </motion.a>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-[11px] sm:text-[12px] text-black/30 font-mono tracking-[0.02em] mt-3 sm:mt-4 text-center sm:text-left"
            >
              Trusted by dealers in{" "}
              <b className="text-black/50 font-semibold">40+</b> countries
            </motion.p>
          </motion.div>

          {/* Right Column — phone image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={imageIn}
            className="order-1 lg:order-2 relative w-full flex justify-center"
          >
            <img
              src={phoneImg}
              alt="Royal Rays diamond search app"
              className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[668px] h-auto"
            />
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 0;
          }
          100% {
            background-position: -220% 0;
          }
        }
      `}</style>
    </section>
  );
};

export default AppSection;