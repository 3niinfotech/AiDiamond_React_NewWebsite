// pages/Event/components/EventsUpdates.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowRight,
  FaGem,
  FaBuilding,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { TbSparkles } from "react-icons/tb";
import { RiDiamondLine, RiShieldCheckLine } from "react-icons/ri";

import jckImg from "../../../assets/images/event1.jpg";
import gemGeneveImg from "../../../assets/images/event2.jpg";
import hongKongImg from "../../../assets/images/event3.jpg";
import vicenzaoroImg from "../../../assets/images/event4.jpg";

import jckLogo from "../../../assets/images/jck.png";
import gemGeneveLogo from "../../../assets/images/Gem-Geneve-logo.webp";
import hongKongLogo from "../../../assets/images/Jewellery_and_Gem_World_logo_RGB_S_v4.png";
import vicenzaoroLogo from "../../../assets/images/logoVO-1024x372-1.jpeg";

const EventsUpdates = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const events = [
    {
      id: 1,
      name: "JCK Las Vegas",
      location: "LAS VEGAS",
      date: "June 2026",
      image: jckImg,
      logo: jckLogo,
      description: "The premier jewelry trade show in North America",
      color: "from-blue-100/80 to-purple-100/80",
      venue: "Las Vegas Convention Center",
      website: "https://jckonline.com",
      highlights: ["500+ Exhibitors", "Networking Events", "Industry Leaders"],
    },
    {
      id: 2,
      name: "GemGenève",
      location: "GEMGENÈVE",
      date: "November 2026",
      image: gemGeneveImg,
      logo: gemGeneveLogo,
      description: "International gemstone and jewelry exhibition",
      color: "from-amber-100/80 to-orange-100/80",
      venue: "Palexpo, Geneva",
      website: "https://gemgeneve.com",
      highlights: ["Rare Gemstones", "Luxury Brands", "Global Buyers"],
    },
    {
      id: 3,
      name: "Jewellery & Gem Hong Kong",
      location: "JEWELLERY & GEM HONG KONG",
      date: "September 2026",
      image: hongKongImg,
      logo: hongKongLogo,
      description: "Asia's leading jewelry and gemstone expo",
      color: "from-rose-100/80 to-pink-100/80",
      venue: "Hong Kong Convention Centre",
      website: "https://jewellery.hktdc.com",
      highlights: ["3000+ Exhibitors", "Asian Market Access", "Innovation Hub"],
    },
    {
      id: 4,
      name: "Vicenzaoro",
      location: "VICENZAORO",
      date: "January 2026",
      image: vicenzaoroImg,
      logo: vicenzaoroLogo,
      description: "The heart of the gold and jewelry industry",
      color: "from-emerald-100/80 to-teal-100/80",
      venue: "Vicenza Expo Centre",
      website: "https://vicenzaoro.com",
      highlights: ["Gold & Jewelry", "Italian Excellence", "Heritage Brands"],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-gradient-to-b from-[#FAF8F4] to-[#F5F3EF] overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#E8E3DA]/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#D4CEC4]/20 blur-3xl rounded-full" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#E8E3DA]/20 blur-3xl rounded-full" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[length:60px_60px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#111111]/15 bg-white/80 backdrop-blur-sm mb-6"
          >
            <RiShieldCheckLine className="text-[#111111] w-3.5 h-3.5" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#4D4D4D] uppercase">
              Events Updates
            </span>
          </motion.div>

          <h2 className="font-display text-[clamp(30px,4.5vw,52px)] font-light text-[#111111] leading-[1.06]">
            We Exhibit In{" "}
            <span className="relative inline-block font-light text-[#111111]/70">
              The Following Shows
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
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
              </svg>
            </span>
          </h2>

          <p className="text-[#4D4D4D] max-w-2xl mx-auto mt-6 text-[15px] md:text-base leading-relaxed font-light">
            From global expos to exclusive showcases, Royal Rays participates in
            leading diamond events worldwide.
          </p>
        </motion.div>

        {/* Events List - Full Width Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="space-y-8 md:space-y-12"
        >
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              className={`group relative flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden border border-[#E8E3DA] shadow-sm hover:shadow-xl transition-all duration-700 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image Section - 50% width on desktop */}
              <div className="relative md:w-1/2  md:h-auto overflow-hidden bg-[#F5F3EF]">
                <motion.img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                />

                <div
                  className={`absolute inset-0 bg-gradient-to-t ${event.color} opacity-30`}
                />

                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-[#E8E3DA] px-4 py-2 rounded-full shadow-sm">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-[#6B5F50] font-medium flex items-center gap-2">
                    <FaCalendarAlt size={10} className="text-[#A89888]" />
                    {event.date}
                  </span>
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-[#E8E3DA] px-4 py-2 rounded-full shadow-sm">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B5F50] font-medium flex items-center gap-2">
                    <FaMapMarkerAlt size={10} className="text-[#A89888]" />
                    {event.location}
                  </span>
                </div>
              </div>

              {/* Content Section - 50% width on desktop */}
              <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-start">
                <div className="space-y-4">
                  {/* Logo - Moved Here */}
                  <div className="">
                    <div className="bg-white/95 w-1/2 border border-[#E8E3DA]  inline-block ">
                      <img
                        src={event.logo}
                        alt={`${event.name} logo`}
                        className="p-2"
                      />
                    </div>
                  </div>

                 

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-[#8B7F70] text-sm">
                      <FaBuilding size={14} className="text-[#A89888]" />
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  <p className="text-[#8B7F70] text-base leading-relaxed font-light">
                    {event.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {event.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="bg-[#F5F3EF] text-[#6B5F50] text-xs px-3 py-1.5 rounded-full border border-[#E8E3DA]"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-6 pt-4">
                    <motion.button
                      className="inline-flex items-center gap-2 text-[#8B7F70] hover:text-[#4A3F35] text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <span>Learn More</span>
                      <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.button>

                    <motion.a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#A89888] hover:text-[#6B5F50] text-xs font-light transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span>Visit Website</span>
                      <FaExternalLinkAlt size={10} />
                    </motion.a>
                  </div>
                </div>

               
                {/* Index Number */}
                <div className="absolute bottom-1 right-6 text-[200px] font-serif font-light text-[#E8E3DA]/50 group-hover:text-[#D4CEC4]/50 transition-colors duration-500">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4CEC4]/30 to-transparent" />
    </section>
  );
};

export default EventsUpdates;