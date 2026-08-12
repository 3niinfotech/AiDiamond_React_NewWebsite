import React from "react";
import heroVideo from "../../../assets/video/web.mp4";

/* ─── Previous slider hero (commented out) ───────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  FaArrowRight,
  FaChevronDown,
  FaArrowLeft,
  FaArrowRight as FaArrowRightIcon,
} from "react-icons/fa";

const Hero = () => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 4,
      title: "Quality First",
      name: "CERTIFIED EXCELLENCE",
      description:
        "Every stone is independently GIA-graded and verified before it earns the Royal Rays mark.",
      icon: "E",
      image:
        "https://t4.ftcdn.net/jpg/19/99/48/19/360_F_1999481935_izxhWiypdIbpbnRN3TOPAhFg5IFlXkAF.jpg",
    },
    {
      id: 4,
      title: "Quality First",
      name: "CERTIFIED EXCELLENCE",
      description:
        "Every stone is independently GIA-graded and verified before it earns the Royal Rays mark.",
      icon: "E",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT97t6OjYZfVg9_aCOAnYwwS50kcoddK1WZkBFvJ3wMLQ&s=10",
    },
    {
      id: 5,
      title: "Craftsmanship",
      name: "ART OF DIAMONDS",
      description:
        "Decades of expertise in cutting, polishing, and grading the world's finest diamonds.",
      icon: "CU",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop&crop=center",
    },
  ];

  // ... slider logic, parallax, auto-play, content grid, buttons ...
};
────────────────────────────────────────────────────────────────────────────── */

const Hero = () => {
  return (
    <section
      data-header-transparent="true"
      data-header-hero="true"
      className="relative h-[50vh] w-full overflow-hidden bg-black md:h-[96.2vh]"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        aria-label="Royal Rays hero video"
      />
    </section>
  );
};

export default Hero;
