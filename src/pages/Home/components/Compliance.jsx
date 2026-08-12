import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import {
  RiShieldCheckLine,
  RiFilePdfLine,
  RiExternalLinkLine,
  RiVerifiedBadgeFill,
  RiShieldCheckFill,
} from "react-icons/ri";
import { FiCheckCircle, FiGlobe } from "react-icons/fi";
import { BsFillDiamondFill } from "react-icons/bs";

import RJCCert from "../../../assets/images/cert2.jpg";
import GIACert from "../../../assets/images/cert1.jpg";
import ethicalPolicyPdf from "../../../assets/pdf/royal-rays-bv-ethical-business-policies.pdf";

gsap.registerPlugin(ScrollTrigger);

const pdfUrl = ethicalPolicyPdf;

/* ------------------------------------------------------------------ */
/* Motion variants                                                     */
/* ------------------------------------------------------------------ */
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ------------------------------------------------------------------ */
/* Scattered diamond-shape icons                                      */
/* ------------------------------------------------------------------ */
const SHAPE_NAMES = [
  "ROUND",
  "PRINCESS",
  "CUSHION",
  "EMERALD",
  "MARQUISE",
  "OVAL",
  "HEART",
  "RADIANT",
  "SQUARE_EMERALD",
  "TAPERED_BAGUETTE",
  "BAGUETTE",
  "MOVAL",
  "PEAR",
  "PEAR_STEP_CUT",
  "TRIANGULAR",
  "TRIANGULAR_STEP_CUT",
  "TRAPEZOID",
  "CADILLAC",
  "HALF_MOON",
  "RECTANGULAR_BRILLIANT",
  "KITE",
  "LOZENGE",
  "LOZENGE_MODIFIED",
  "SHIELD",
  "BULLETS",
  "HEXAGON",
  "HEXAGON_LONG",
  "OVAL_STEP_CUT",
  "FLOWER",
  "P_FLOWER",
  "PORTRAIT_CUT",
  "OLD_EUROPEAN_CUT",
  "OLD_MINER",
  "FANCY_OLD_MINER",
  "TULIP",
  "ANIMAL",
  "BRIOLETTE",
  "FANCY_ROSE",
  "ROUND_RC",
  "PEAR_RC",
];

const SHAPE_COLORS = ["#111111", "#4D4D4D", "#8A6D2F", "#D4A853", "#666666"];

const useFloatingShapes = (backCount = 80, frontCount = 30) =>
  useMemo(() => {
    const makeShape = (i, layer) => ({
      id: `${layer}-${i}`,
      layer,
      name: SHAPE_NAMES[Math.floor(Math.random() * SHAPE_NAMES.length)],
      top: Math.random() * 98,
      left: Math.random() * 98,
      size:
        layer === "front" ? 28 + Math.random() * 45 : 12 + Math.random() * 22,
      opacity:
        layer === "front"
          ? 0.06 + Math.random() * 0.12
          : 0.03 + Math.random() * 0.06,
      color: SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)],
      rotate: Math.random() * 360,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 4,
    });

    return [
      ...Array.from({ length: backCount }).map((_, i) => makeShape(i, "back")),
      ...Array.from({ length: frontCount }).map((_, i) =>
        makeShape(i, "front"),
      ),
    ];
  }, [backCount, frontCount]);

/* ------------------------------------------------------------------ */
/* Animated counter                                                    */
/* ------------------------------------------------------------------ */
const Counter = ({ to, suffix = "", duration = 1.6 }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, duration]);

  return <span ref={ref}>0{suffix}</span>;
};

/* ------------------------------------------------------------------ */
/* Tilt card wrapper for certification logos                           */
/* ------------------------------------------------------------------ */
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-50, 50], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
const Compliance = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const ctaRef = useRef(null);
  const logosRef = useRef(null);
  const shapesRef = useRef(null);

  const floatingShapes = useFloatingShapes(80, 30);

  const certifications = [
    {
      id: 1,
      name: "RJC Certified Member",
      image: RJCCert,
      alt: "RJC Certified Member",
      tag: "Responsible Jewellery Council",
      description:
        "Certified member upholding globally recognized standards for ethical, social, and environmental practices across the diamond and jewellery supply chain.",
      status: "Active",
      scope: "Global",
      memberNumber: "0000 4917",
    },
    {
      id: 2,
      name: "GIA Certification",
      image: GIACert,
      alt: "GIA Certification",
      tag: "Gemological Institute of America",
      description:
        "Every diamond is independently graded by the world's foremost authority on diamond quality, ensuring accuracy and trust in every 4Cs report.",
      status: "Active",
      scope: "Worldwide",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cta = ctaRef.current;
    const logos = logosRef.current;
    const shapesWrap = shapesRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        cta,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cta,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const logoItems = logos?.querySelectorAll(".logo-item") || [];
      logoItems.forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, scale: 0.85, y: 25 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            delay: index * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      const floatingElements = section.querySelectorAll(".floating-bg");
      floatingElements.forEach((el) => {
        gsap.to(el, {
          y: gsap.utils.random(-25, 25),
          x: gsap.utils.random(-18, 18),
          rotation: gsap.utils.random(-12, 12),
          duration: gsap.utils.random(6, 12),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 3),
        });
      });

      gsap.to(".glow-ring", {
        rotate: 360,
        duration: 18,
        repeat: -1,
        ease: "none",
      });

      // Scattered diamond-shape icons: animate all shapes beautifully
      const allShapes = shapesWrap?.querySelectorAll(".floating-shape") || [];

      allShapes.forEach((el, index) => {
        const delay = parseFloat(el.dataset.delay) || 0;
        const duration = parseFloat(el.dataset.duration) || 10;
        const isFront = el.dataset.layer === "front";

        // Fade in and scale up
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.2 },
          {
            opacity: parseFloat(el.dataset.opacity),
            scale: 1,
            duration: 1.2 + Math.random() * 0.8,
            delay: delay + index * 0.015,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );

        // Floating drift animation
        gsap.to(el, {
          y: gsap.utils.random(-40, 40),
          x: gsap.utils.random(-35, 35),
          duration: duration * 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: delay + Math.random() * 2,
        });

        // Rotation animation - different speeds for different layers
        const rotationSpeed = isFront
          ? gsap.utils.random(200, 400)
          : gsap.utils.random(80, 200);
        gsap.to(el, {
          rotation: `+=${rotationSpeed * (index % 2 === 0 ? 1 : -1)}`,
          duration: duration * 1.2,
          repeat: -1,
          ease: "none",
        });

        // Breathing/pulsing effect for front layer shapes
        if (isFront) {
          gsap.to(el, {
            scale: 1.15,
            duration: gsap.utils.random(3, 5),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: delay + Math.random() * 2,
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handlePdfOpen = () => {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FAF8F4] py-16 md:py-28"
    >
      {/* Large decorative rings / glyphs */}
      <div className="floating-bg absolute -top-40 -right-40 w-96 h-96 rounded-full border border-[#E8E8E4] opacity-20" />
      <div className="floating-bg absolute -bottom-40 -left-40 w-96 h-96 rounded-full border border-[#E8E8E4] opacity-20" />
      <div className="floating-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-[#E8E8E4] opacity-10" />
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #111111 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Scattered diamond-shape icons - Rendered with proper classes */}
      <div
        ref={shapesRef}
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        {floatingShapes.map((shape) => (
          <span
            key={shape.id}
            className={`floating-shape floating-shape-${shape.layer} absolute`}
            data-layer={shape.layer}
            data-opacity={shape.opacity}
            data-duration={shape.duration}
            data-delay={shape.delay}
            style={{
              top: `${shape.top}%`,
              left: `${shape.left}%`,
              opacity: 0,
              transform: `rotate(${shape.rotate}deg)`,
            }}
          >
            <span
              className={`diamond_icon icon-${shape.name}`}
              style={{
                fontSize: `${shape.size}px`,
                color: shape.color,
                display: "inline-block",
                lineHeight: 1,
              }}
            />
          </span>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* ---------------------------------------------------------- */}
        {/* Header                                                     */}
        {/* ---------------------------------------------------------- */}
        <div ref={headerRef} className="text-center mb-14 md:mb-20">

          <h2 className="font-display text-[clamp(30px,4.5vw,52px)] font-light text-[#111111] leading-[1.06]">
            Compliance &{" "}
            <span className="relative inline-block font-light text-[#111111]/70">
              Certifications
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
            We are committed to responsible business practices, transparent
            supply chains, and adherence to international diamond industry
            standards.
          </p>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* CTA block with glowing ring                                */}
        {/* ---------------------------------------------------------- */}
        <div ref={ctaRef} className="relative mb-16 md:mb-20">
          <div
            className="glow-ring absolute -inset-[1px] rounded-[26px] opacity-30 blur-[2px] pointer-events-none"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, #111111, transparent 40%)",
            }}
          />
          <div className="relative bg-white rounded-3xl p-8 md:p-14 border border-[#E8E8E4] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#111111]/[0.03] blur-2xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-[#111111]/[0.03] blur-2xl" />

            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Shield Icon - Perfect for Ethical Business Policies */}
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#111111] flex items-center justify-center rotate-3">
                <RiShieldCheckFill className="w-8 h-8 md:w-9 md:h-9 text-white" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-xl md:text-2xl font-light text-[#111111] mb-2">
                  Ethical Business Policies
                </h3>
                <p className="text-[14px] md:text-[15px] text-[#4D4D4D] leading-relaxed font-light">
                  Our full policy document covers conflict-free sourcing, OECD
                  due diligence, supplier accountability, and a formal grievance
                  mechanism.
                </p>
              </div>

              <motion.button
                type="button"
                className="relative flex-shrink-0 px-8 py-4 bg-[#111111] text-white rounded-full flex items-center gap-3 text-sm font-medium tracking-wide shadow-lg overflow-hidden group"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePdfOpen}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <RiFilePdfLine className="w-5 h-5 relative" />
                <span className="relative whitespace-nowrap">
                  View Full Policy
                </span>
                <RiExternalLinkLine className="w-4 h-4 opacity-70 relative" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Certification logos - tilt cards                           */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          ref={logosRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              variants={staggerItem}
              className="logo-item"
            >
              <TiltCard className="group relative bg-white rounded-[26px] border border-[#E8E8E4] overflow-hidden hover:border-[#111111]/20 hover:shadow-[0_35px_80px_-25px_rgba(17,17,17,0.18)] transition-[box-shadow,border-color] duration-500">
                {/* Corner ribbon */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] shadow-md">
                  <RiVerifiedBadgeFill className="w-3 h-3 text-white" />
                  <span className="text-[8px] uppercase tracking-[0.15em] text-white font-medium">
                    {cert.status}
                  </span>
                </div>

                {/* Image - fixed height so both certificates render at the same visual size */}
                <div className="relative p-1 pt-1">
                  <div className="relative overflow-hidden rounded-t-[22px] h-48 md:h-[268px] flex items-center justify-center bg-[#FAFAF8]">
                    <img
                      src={cert.image}
                      alt={cert.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="%23111111" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`;
                      }}
                    />
                    <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8]/40 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Seal badge overlapping image + content */}
                <div className="relative flex justify-center -mt-8 mb-1">
                  <div className="relative w-16 h-16 rounded-full bg-white border border-[#E8E8E4] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] flex items-center justify-center group-hover:rotate-[15deg] transition-transform duration-500">
                    <div className="w-12 h-12 rounded-full bg-[#111111] flex items-center justify-center">
                      <BsFillDiamondFill className="w-4 h-4 text-white" />
                    </div>
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 64 64"
                    >
                      <circle
                        cx="32"
                        cy="32"
                        r="30"
                        fill="none"
                        stroke="#111111"
                        strokeWidth="1"
                        strokeDasharray="2 4"
                        opacity="0.25"
                      />
                    </svg>
                  </div>
                </div>

                {/* Related text content */}
                <div className="relative px-7 pb-8 pt-2 text-center">
                  <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#4D4D4D] font-semibold mb-2">
                    <span className="w-4 h-px bg-[#111111]/30" />
                    {cert.tag}
                    <span className="w-4 h-px bg-[#111111]/30" />
                  </span>

                  <h4 className="font-display text-xl md:text-[22px] font-light text-[#111111] group-hover:text-[#111111]/80 transition-colors duration-300">
                    {cert.name}
                  </h4>

                  <p className="text-[13px] text-[#4D4D4D] font-light leading-relaxed mt-3 px-1">
                    {cert.description}
                  </p>

                  {/* Detail row */}
                  <div className="mt-5 flex items-center justify-center divide-x divide-[#E8E8E4]">
                    <div className="flex items-center gap-1.5 pr-4">
                      <FiCheckCircle className="w-3.5 h-3.5 text-[#111111]" />
                      <span className="text-[10px] uppercase tracking-wider text-[#4D4D4D] font-medium">
                        {cert.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 pl-4">
                      <FiGlobe className="w-3.5 h-3.5 text-[#111111]" />
                      <span className="text-[10px] uppercase tracking-wider text-[#4D4D4D] font-medium">
                        {cert.scope}
                      </span>
                    </div>
                  </div>

                  {/* Hover shine sweep */}
                  <span className="absolute inset-0 bg-gradient-to-tr from-[#111111]/0 via-[#111111]/[0.03] to-[#111111]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Compliance;