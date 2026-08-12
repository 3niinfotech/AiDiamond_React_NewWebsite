// Testimonials.jsx - Updated with Compliance-style header
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { motion } from "framer-motion";
import {
  RiDiamondLine,
  RiDiamondFill,
  RiGeminiLine,
  RiStarFill,
  RiShieldCheckLine,
} from "react-icons/ri";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { TbSparkles } from "react-icons/tb";
import "swiper/css";
import "swiper/css/effect-coverflow";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote:
        "Royal Rays consistently delivers stones that grade exactly as promised. In twelve years of buying, we've never had to second-guess a certificate from them.",
      name: "Isabelle Verhoeven",
      role: "BUYING DIRECTOR, VERHOEVEN & ZOONS",
      location: "ANTWERP, BELGIUM",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      company: "Verhoeven & Zoons",
      rating: 5,
    },
    {
      quote:
        "Their cutting floor is the reason we route our finest rough through Antwerp at all. The symmetry tolerances are tighter than anything we see elsewhere.",
      name: "Marcus Chen",
      role: "HEAD OF PROCUREMENT, MERIDIAN JEWELS",
      location: "HONG KONG",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      company: "Meridian Jewels",
      rating: 5,
    },
    {
      quote:
        "What sets Royal Rays apart isn't just the stones — it's the paperwork. Export compliance, chain of custody, GIA reports, all arrive complete, every time.",
      name: "Priya Nair",
      role: "FOUNDER, NAIR & DAUGHTERS FINE JEWELLERY",
      location: "MUMBAI, INDIA",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      company: "Nair & Daughters",
      rating: 5,
    },
    {
      quote:
        "We commissioned a bespoke emerald-cut parcel with a two-week turnaround. Royal Rays hit the deadline without a single stone falling outside spec.",
      name: "Julian Ferro",
      role: "CREATIVE DIRECTOR, CASA FERRO",
      location: "MILAN, ITALY",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      company: "Casa Ferro",
      rating: 5,
    },
    {
      quote:
        "The attention to detail and quality control at Royal Rays is second to none. Every stone we receive exceeds our expectations.",
      name: "Sarah Thompson",
      role: "CEO, THOMPSON JEWELLERS",
      location: "LONDON, UK",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      company: "Thompson Jewellers",
      rating: 5,
    },
    {
      quote:
        "Royal Rays has been our trusted partner for over a decade. Their consistency and reliability are unmatched in the industry.",
      name: "David Kim",
      role: "PRESIDENT, KIM & ASSOCIATES",
      location: "SEOUL, SOUTH KOREA",
      image: "https://randomuser.me/api/portraits/men/6.jpg",
      company: "Kim & Associates",
      rating: 5,
    },
  ];

  const total = testimonials.length;

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <RiStarFill
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? "text-[#D4A853]" : "text-[#E8E8E4]"
          }`}
        />
      ))}
    </div>
  );

  const TestimonialCard = ({ data, isActive }) => {
    return (
      <div
        className={`relative rounded-3xl p-8 h-full transition-all duration-700 ${
          isActive
            ? "bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-[#111111]"
            : "bg-transparent border border-[#E8E8E4]/50"
        }`}
      >
        {/* Background - Transparent for inactive slides */}
        <div
          className={`absolute inset-0 rounded-3xl transition-opacity duration-700 ${isActive ? "bg-gradient-to-br from-[#FAF8F4] via-white to-white opacity-100" : "opacity-0"}`}
        />

        {/* Decorative Pattern */}
        <div
          className={`absolute inset-0 rounded-3xl overflow-hidden pointer-events-none transition-opacity duration-700 ${isActive ? "opacity-[0.04]" : "opacity-0"}`}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMEw2MCAzMCAzMCA2MCAwIDMwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTExMTExIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] bg-repeat bg-[length:60px_60px]" />
        </div>

        {/* Floating Diamond Icon */}
        <div
          className={`absolute -top-3 -right-3 text-[#111111]/5 transition-all duration-700 ${isActive ? "opacity-100" : "opacity-0"}`}
        >
          <RiDiamondFill size={44} />
        </div>

        {/* Large Quote Mark */}
        <div
          className={`absolute -top-6 -left-3 text-[140px] text-[#111111]/[0.03] font-serif leading-none select-none pointer-events-none transition-all duration-700 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        >
          "
        </div>

        <div className="relative z-10">
          {/* Profile Section */}
          <div
            className={`flex items-start gap-5 mb-5 transition-all duration-500 ${isActive ? "opacity-100 translate-x-0" : "opacity-40"}`}
          >
            <div className="relative flex-shrink-0">
              <div
                className={`w-16 h-16 rounded-full overflow-hidden border-2 shadow-lg transition-all duration-500 ${isActive ? "border-[#E8E8E4]" : "border-[#E8E8E4]/30"}`}
              >
                <img
                  src={data.image}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isActive && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#D4A853] rounded-full border-2 border-white flex items-center justify-center">
                  <RiGeminiLine className="text-[9px] text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h4
                className={`font-medium text-lg transition-colors duration-500 ${isActive ? "text-[#111111]" : "text-[#999999]"}`}
              >
                {data.name}
              </h4>
              <p
                className={`text-[9px] uppercase tracking-[0.15em] transition-colors duration-500 ${isActive ? "text-[#999999]" : "text-[#BBBBBB]"}`}
              >
                {data.role}
              </p>
              <p
                className={`text-[8px] uppercase tracking-wider mt-0.5 transition-colors duration-500 ${isActive ? "text-[#B5B5B0]" : "text-[#D4D4D4]"}`}
              >
                {data.location}
              </p>
            </div>
          </div>

          {/* Stars */}
          <div
            className={`transition-all duration-500 ${isActive ? "opacity-100" : "opacity-20"}`}
          >
            {renderStars(data.rating)}
          </div>

          {/* Quote */}
          <div
            className={`relative mt-4 transition-all duration-500 ${isActive ? "opacity-100" : "opacity-20"}`}
          >
            <FaQuoteLeft
              className={`absolute -top-1 -left-2 text-xs transition-colors duration-500 ${isActive ? "text-[#D4D4D4]/50" : "text-[#E8E8E4]/20"}`}
            />
            <p
              className={`text-[15px] leading-relaxed font-light pl-5 pt-1 transition-colors duration-500 ${isActive ? "text-[#2D2D2D]/75" : "text-[#999999]/40"}`}
            >
              {data.quote}
            </p>
            <FaQuoteRight
              className={`absolute -bottom-1 -right-1 text-xs transition-colors duration-500 ${isActive ? "text-[#D4D4D4]/50" : "text-[#E8E8E4]/20"}`}
            />
          </div>

          {/* Footer */}
          <div
            className={`mt-6 pt-5 border-t border-[#F0F0F0] flex items-center justify-between transition-all duration-500 ${isActive ? "opacity-100" : "opacity-20"}`}
          >
            <div className="flex items-center gap-2">
              <RiDiamondLine
                className={`text-sm transition-colors duration-500 ${isActive ? "text-[#D4D4D4]" : "text-[#E8E8E4]/30"}`}
              />
              <span
                className={`text-[9px] uppercase tracking-[0.1em] font-medium transition-colors duration-500 ${isActive ? "text-[#B5B5B0]" : "text-[#D4D4D4]/40"}`}
              >
                {data.company}
              </span>
            </div>
            <TbSparkles
              className={`text-sm transition-colors duration-500 ${isActive ? "text-[#D4D4D4]" : "text-[#E8E8E4]/30"}`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-10 bg-[#FAF8F4] relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-[#F0EDE8] rounded-full opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-60 -left-60 w-[500px] h-[500px] bg-[#F0EDE8] rounded-full opacity-25"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header - Updated to match Compliance.jsx style */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-[clamp(30px,4.5vw,52px)] font-light text-[#111111] leading-[1.06]">
            Word of the{" "}
            <span className="relative inline-block font-light text-[#111111]/70">
              Trade
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
            A handful of the jewellers and buying houses we work with, in their
            own words.
          </p>
        </motion.div>

        {/* Custom Styles */}
        <style>{`
          .swiper {
            overflow: visible !important;
            padding: 30px 0 !important;
          }
          .swiper-wrapper {
            overflow: visible !important;
          }
          .swiper-slide {
            height: auto !important;
            padding: 0 12px !important;
            overflow: visible !important;
            width: 480px !important;
          }
          .swiper-slide-shadow {
            display: none !important;
          }
          .swiper-coverflow {
            overflow: visible !important;
          }

          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            width: 52px !important;
            height: 52px !important;
            border-radius: 50% !important;
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(16px) !important;
            border: 1px solid #e8e8e4 !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06) !important;
            transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1) !important;
            color: #111111 !important;
            position: relative !important;
            margin: 0 !important;
          }
          .swiper-button-prev-custom:hover,
          .swiper-button-next-custom:hover {
            background: #111111 !important;
            color: white !important;
            border-color: #111111 !important;
            transform: scale(1.08) !important;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
          }
          .swiper-button-prev-custom:active,
          .swiper-button-next-custom:active {
            transform: scale(0.93) !important;
          }
          .swiper-button-prev-custom::after,
          .swiper-button-next-custom::after {
            display: none !important;
          }

          @media (max-width: 1024px) {
            .swiper-slide {
              width: 420px !important;
            }
          }

          @media (max-width: 768px) {
            .swiper-slide {
              width: 100% !important;
              padding: 0 8px !important;
            }
          }
        `}</style>

        {/* Desktop: 3 Slides with Coverflow Effect */}
        <div className="hidden md:block">
          <Swiper
            modules={[Autoplay, EffectCoverflow]}
            slidesPerView={3}
            centeredSlides={true}
            loop={false}
            effect="coverflow"
            coverflowEffect={{
              rotate: 5,
              stretch: 10,
              depth: 80,
              modifier: 1,
              slideShadows: false,
            }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full"
          >
            {testimonials.map((data, index) => (
              <SwiperSlide key={index}>
                {({ isActive }) => (
                  <TestimonialCard
                    data={data}
                    isActive={isActive || index === activeIndex}
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Mobile: 1 Slide */}
        <div className="block md:hidden">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            centeredSlides={true}
            loop={false}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full"
          >
            {testimonials.map((data, index) => (
              <SwiperSlide key={index}>
                <div className="px-2">
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E8E4] shadow-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E8E8E4] flex-shrink-0">
                        <img
                          src={data.image}
                          alt={data.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#111111] text-base">
                          {data.name}
                        </h4>
                        <p className="text-[8px] text-[#999999] uppercase tracking-wider">
                          {data.role}
                        </p>
                        <p className="text-[7px] text-[#B5B5B0] uppercase tracking-wider mt-0.5">
                          {data.location}
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">{renderStars(5)}</div>
                    <div className="relative">
                      <FaQuoteLeft className="absolute -top-1 -left-1 text-[#D4D4D4]/40 text-[10px]" />
                      <p className="text-[#2D2D2D]/70 text-sm leading-relaxed font-light pl-5">
                        {data.quote}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F0F0F0] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RiDiamondLine className="text-[#D4D4D4] text-sm" />
                        <span className="text-[8px] text-[#B5B5B0] uppercase tracking-wider font-medium">
                          {data.company}
                        </span>
                      </div>
                      <TbSparkles className="text-[#D4D4D4] text-sm" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <motion.div
            className="flex justify-center gap-2 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const swiper = document.querySelector(".swiper")?.swiper;
                  if (swiper) swiper.slideTo(i);
                }}
                className={`transition-all duration-500 rounded-full ${
                  activeIndex === i
                    ? "w-8 h-1.5 bg-[#111111]"
                    : "w-4 h-1.5 bg-[#D4D4D4] hover:bg-[#B5B5B0]"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;