import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FaGem,
  FaCut,
  FaStar,
  FaPalette,
  FaFont,
  FaHistory,
} from "react-icons/fa";
import { TbSparkles } from "react-icons/tb";
import { RiDiamondLine } from "react-icons/ri";

import diamondsBg from "../../../assets/images/diamond.png";
import Breadcrumb from "../../../components/ui/Breadcrumb";

const Hero = () => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 4,
    rotation: Math.random() * 360,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section
      ref={containerRef}
      data-header-transparent="true"
      className="relative min-h-[70vh] w-full overflow-hidden bg-[#0A0A0A]"
      style={{
        backgroundImage: `url(${diamondsBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-[#0A0A0A]/40 to-[#0A0A0A]/60" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[length:60px_60px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[length:120px_120px]" />

      {/* Diamond-shaped pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="diamondPattern"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0 L80 40 L40 80 L0 40 Z"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
            <path
              d="M40 10 L70 40 L40 70 L10 40 Z"
              fill="none"
              stroke="white"
              strokeWidth="0.3"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#diamondPattern)" />
        </svg>
      </div>

      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/10 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <RiDiamondLine
              className="text-white/20"
              size={p.size * 4}
              style={{
                transform: `rotate(${p.rotation}deg)`,
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[100vh] flex items-center pb-8 lg:pb-12">
        <motion.div
          className="w-full"
          style={{ scale, opacity }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6 pt-8 lg:pt-12">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <TbSparkles className="text-white/70" size={12} />
                </motion.div>
                <span className="text-[8px] tracking-[0.25em] uppercase text-white/60 font-light">
                  The World of Diamonds
                </span>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-3">
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1]">
                  <span className="relative inline-block">
                    Diamonds
                    <motion.span
                      className="absolute -bottom-2 left-0 h-[1px] bg-gradient-to-r from-white/40 to-transparent"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </span>
                  <br />
                  <span className="text-white/60 italic font-light text-3xl sm:text-4xl md:text-5xl lg:text-5xl block mt-3">
                    We Deal In
                    <motion.span
                      className="inline-block ml-2 text-white/70"
                      animate={{
                        opacity: [0.5, 0.9, 0.5],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      Excellence
                    </motion.span>
                  </span>
                </h1>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-white/50 text-sm md:text-base lg:text-lg font-light max-w-xl leading-relaxed tracking-wide"
              >
                From classic brilliant cuts to rare fancy colors and our
                signature alphabet diamonds, we offer the world's most exquisite
                diamonds. Each stone is meticulously crafted to showcase
                timeless elegance and unparalleled brilliance.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4 pt-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center">
                    <FaCut className="text-white/40 text-xs" />
                  </div>
                  <span className="text-white/40 text-xs font-light tracking-wider">
                    CLASSIC CUTS
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center">
                    <FaPalette className="text-white/40 text-xs" />
                  </div>
                  <span className="text-white/40 text-xs font-light tracking-wider">
                    FANCY COLORS
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center">
                    <FaFont className="text-white/40 text-xs" />
                  </div>
                  <span className="text-white/40 text-xs font-light tracking-wider">
                    ALPHABET
                  </span>
                </div>
              </motion.div>

              <Breadcrumb />
            </div>

            {/* Right Column - Empty (shows background image) */}
            <div className="hidden lg:block" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent"
        />
        <span className="text-[6px] tracking-[0.3em] uppercase text-white/20 font-light">
          Explore
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;
