import React from "react";
import {
  RiDiamondLine,
  RiShieldCheckLine,
  RiScissors2Line,
  RiEyeLine,
  RiTruckLine,
  RiHandCoinLine,
} from "react-icons/ri";
import { FaGem, FaHandSparkles } from "react-icons/fa";
import { GiDiamondRing, GiDiamondTrophy } from "react-icons/gi";
import { MdVerified } from "react-icons/md";

const Marquee = () => {
  const marqueeItems = [
    { text: "ROYAL RAYS BV", icon: <RiDiamondLine size={14} /> },
    { text: "ANTWERP DIAMOND DISTRICT", icon: <FaGem size={14} /> },
    { text: "ETHICALLY SOURCED", icon: <RiShieldCheckLine size={14} /> },
    { text: "GIA · IGI CERTIFIED", icon: <MdVerified size={14} /> },
    { text: "SOURCING", icon: <RiHandCoinLine size={12} /> },
    { text: "SELECTION", icon: <GiDiamondRing size={12} /> },
    { text: "CUTTING", icon: <RiScissors2Line size={12} /> },
    { text: "POLISHING", icon: <FaHandSparkles size={12} /> },
    { text: "GRADING", icon: <RiEyeLine size={12} /> },
    { text: "EXPORT", icon: <RiTruckLine size={12} /> },
  ];

  const marqueeItems2 = [];

  return (
    <>
      {/* Marquee - First Row - Slow Smooth */}
      <div className="relative overflow-hidden py-2 border-y border-[rgba(0,0,0,0.05)] bg-gradient-to-r from-[#f8f8f8] via-[#f0f0f0] to-[#f8f8f8] marquee-wrapper">
        <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-[#f8f8f8] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-[#f8f8f8] to-transparent z-10 pointer-events-none" />

        <div className="flex whitespace-nowrap w-max marquee-track marquee-slow-1">
          {[...Array(6)].map((_, index) => (
            <React.Fragment key={index}>
              {marqueeItems.map((item, i) => (
                <div key={`${index}-${i}`} className="flex  items-center">
                  <span className="font-mono text-[13px] tracking-[0.15em] uppercase text-[#555555] font-medium">
                    {item.text}
                  </span>
                  <span className="text-[#d0d0d0] text-[10px]">✦</span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        .marquee-slow-1 {
          animation: marquee-slow-1 60s linear infinite;
        }
        .marquee-slow-2 {
          animation: marquee-slow-2 55s linear infinite;
        }
        
        @keyframes marquee-slow-1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes marquee-slow-2 {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        /* Smooth hover pause */
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
          transition: animation-play-state 0.5s ease;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .marquee-slow-1,
          .marquee-slow-2 {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Marquee;
