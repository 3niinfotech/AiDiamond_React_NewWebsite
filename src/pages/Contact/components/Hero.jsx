import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaGlobe, FaUsers, FaArrowRight, FaGem, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { TbSparkles } from "react-icons/tb";
import { RiDiamondLine, RiMailLine, RiMapPinLine, RiMapPin2Line, RiTimeLine } from "react-icons/ri";

import eventsBg from "../../../assets/images/contact.png";
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

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
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

  const locationVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section
      ref={containerRef}
      data-header-transparent="true"
      data-header-hero="true"
      className="relative min-h-[70vh] w-full overflow-hidden bg-[#0A0A0A]"
      style={{
        backgroundImage: `url(${eventsBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-[#0A0A0A]/40 to-[#0A0A0A]/60" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Background grid pattern with more visibility */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[length:60px_60px]" />

      {/* Additional grid pattern with different size for depth */}
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

      {/* Left side content + right side location marker */}
      <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh] flex items-center pb-8 lg:pb-12">
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
                  Get in Touch
                </span>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-3">
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1]">
                  <span className="relative inline-block">
                    Contact Us
                    <motion.span
                      className="absolute -bottom-2 left-0 h-[1px] bg-gradient-to-r from-white/40 to-transparent"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </span>
                  <br />
                  <span className="text-white/60 italic font-light text-3xl sm:text-4xl md:text-5xl lg:text-5xl block mt-3">
                    Let's Connect
                    <motion.span
                      className="inline-block ml-2 text-white/70"
                      animate={{
                        opacity: [0.5, 0.9, 0.5],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      & Collaborate
                    </motion.span>
                  </span>
                </h1>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-white/50 text-sm md:text-base lg:text-lg font-light max-w-xl leading-relaxed tracking-wide"
              >
                Reach out to our team for inquiries about our diamond collections, 
                events, or partnership opportunities. We're here to assist you 
                with excellence and precision.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4 pt-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center">
                    <FaEnvelope className="text-white/40 text-xs" />
                  </div>
                  <span className="text-white/40 text-xs font-light tracking-wider">
                    EMAIL US
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center">
                    <FaPhone className="text-white/40 text-xs" />
                  </div>
                  <span className="text-white/40 text-xs font-light tracking-wider">
                    CALL US
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-white/40 text-xs" />
                  </div>
                  <span className="text-white/40 text-xs font-light tracking-wider">
                    VISIT US
                  </span>
                </div>
              </motion.div>

              <Breadcrumb />
            </div>

            {/* Right Column - animated location marker (kept minimal so it never
                competes with the left copy or the background photography) */}
            <div className="hidden lg:flex items-center justify-center h-full">
              <motion.div
                variants={locationVariants}
                initial="hidden"
                animate="visible"
                className="relative flex flex-col items-center gap-5"
              >
                {/* Radar rings */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute inset-0 rounded-full border border-white/25"
                      animate={{ scale: [1, 1.9], opacity: [0.45, 0] }}
                      transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        delay: i * 1.05,
                        ease: "easeOut",
                      }}
                    />
                  ))}

                  {/* slow rotating dashed orbit */}
                  <motion.div
                    className="absolute inset-3 rounded-full border border-dashed border-white/15"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
                  />

                  {/* faint static outer ring for definition */}
                  <div className="absolute inset-0 rounded-full border border-white/10" />

                  {/* orbiting diamond mark */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  >
                    <RiDiamondLine
                      className="absolute text-white/50"
                      size={10}
                      style={{ top: "6%", left: "50%", transform: "translateX(-50%)" }}
                    />
                  </motion.div>

                  {/* center pin */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-12 h-12 rounded-full bg-white/10 border border-white/30 backdrop-blur-sm flex items-center justify-center"
                  >
                    <RiMapPin2Line className="text-white/80" size={20} />
                  </motion.div>
                </div>

                {/* Location label */}
                <div className="text-center space-y-1.5">
                  <span className="block text-white/70 text-xs tracking-[0.3em] uppercase font-light">
                    Antwerp, Belgium
                  </span>
                  <span className="block text-white/30 text-[10px] tracking-[0.2em] font-light">
                    50.9059&deg; N, 4.4024&deg; E
                  </span>
                </div>

                {/* Thin connecting line down to a small "worldwide" tag,
                    kept to a single extra element so the panel stays light */}
                <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm">
                  <FaGlobe className="text-white/40" size={10} />
                  <span className="text-white/40 text-[9px] tracking-[0.2em] uppercase font-light">
                    Shipping Worldwide
                  </span>
                </div>
              </motion.div>
            </div>
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
          Scroll
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;