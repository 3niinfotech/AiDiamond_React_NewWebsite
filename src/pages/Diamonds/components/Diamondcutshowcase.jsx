/**
 * Diamondcutshowcase.jsx
 * ---------------------------------------------------------------
 * Royal Rays Specialty Diamond Showcase — Premier Export Collection (12 Master Cuts)
 * 
 * FEATURES:
 * 1. 12 Master Specialty Diamond Cuts with complete Antwerp technical specs.
 * 2. Inverted Contrast Bold Typography (mix-blend-mode: difference).
 * 3. Forceful GSAP ScrollTrigger Pinned Horizontal Scroll across all 12 cards.
 * 4. Butter-Smooth GSAP Open & Close Animations (Zero jerkiness/jatka).
 * 5. Active Animated Background (Drifting luxury watermark & light aura).
 * ---------------------------------------------------------------
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaTimes } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    id: "old-mine-cut",
    titleTop: "OLD MINE",
    titleBottom: "CUT",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&fit=crop",
    quote: "“A quiet, romantic glow — faceted the way royal Antwerp jewelers did it centuries ago.”",
    specs: [
      { label: "Carat", value: "0.30–3.50ct" },
      { label: "Clarity", value: "VS1–VVS2" },
      { label: "Color", value: "E–H" },
      { label: "Cut", value: "Vintage Dome" },
    ],
    col1Title: "Historical Faceting",
    col1Text: "Hand-crafted 24 to 56 triangular crown facets with a flat base, evoking 16th-century royal Antwerp jewelry traditions.",
    col2Title: "Soft Scintillation",
    col2Text: "Produces a subtle, romantic luster rather than modern intense fire. Perfect for vintage and antique diamond lovers.",
  },
  {
    id: "royal-brilliant-cut",
    titleTop: "ROYAL",
    titleBottom: "BRILLIANT",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&fit=crop",
    quote: "“Maximum fire, precision-cut to return every ray of light straight back to the eye.”",
    specs: [
      { label: "Carat", value: "0.25–5.00ct" },
      { label: "Clarity", value: "VS2–FL" },
      { label: "Color", value: "D–G" },
      { label: "Cut", value: "58-Facet Round" },
    ],
    col1Title: "Modern Symmetry",
    col1Text: "Mathematically optimised 58-facet geometry, engineered in-house for maximum brightness and contrast.",
    col2Title: "Signature Fire",
    col2Text: "Our house-standard cut — the brightest, most brilliant scintillation in the Royal Rays collection.",
  },
  {
    id: "antwerp-emerald-cut",
    titleTop: "ANTWERP",
    titleBottom: "EMERALD",
    img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200&fit=crop",
    quote: "“Clean, architectural lines that let clarity speak for itself — a hall-of-mirrors effect.”",
    specs: [
      { label: "Carat", value: "0.50–4.20ct" },
      { label: "Clarity", value: "VVS1–FL" },
      { label: "Color", value: "D–F" },
      { label: "Cut", value: "Step-Cut Rectangle" },
    ],
    col1Title: "Step-Cut Precision",
    col1Text: "Long, open step facets demand near-flawless clarity, showcasing the stone's purity rather than hiding it.",
    col2Title: "Hall-of-Mirrors Effect",
    col2Text: "Alternating light and dark planes create a striking, elegant flash rather than scattered brilliance.",
  },
  {
    id: "kite-cut",
    titleTop: "KITE",
    titleBottom: "FACET",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&fit=crop",
    quote: "“A sharp geometric silhouette engineered with 57 light-refracting facets for statement jewelry.”",
    specs: [
      { label: "Carat", value: "0.50–5.00ct" },
      { label: "Clarity", value: "VVS1–IF" },
      { label: "Color", value: "D–F" },
      { label: "Cut", value: "57-Facet Kite" },
    ],
    col1Title: "Geometric Precision",
    col1Text: "Bold angular planes polished by Antwerp lapidaries to maximize fire along sharp architectural lines.",
    col2Title: "Bespoke Jewelry",
    col2Text: "Favored for high-end engagement solitaires and custom platinum halo mountings.",
  },
  {
    id: "rose-cut",
    titleTop: "ROSE",
    titleBottom: "DOME",
    img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200&fit=crop",
    quote: "“Faceted in 24 to 56 triangular planes over a flat base for romantic antique radiance.”",
    specs: [
      { label: "Carat", value: "0.30–3.80ct" },
      { label: "Clarity", value: "VS2–VVS1" },
      { label: "Color", value: "D–H" },
      { label: "Cut", value: "Rose Dome" },
    ],
    col1Title: "16th-Century Heritage",
    col1Text: "Honors royal European jewelry traditions with soft, romantic luster polished individually by Antwerp heritage cutters.",
    col2Title: "Custom Mountings",
    col2Text: "Engineered for antique engagement crowns and bespoke platinum high-jewelry heirlooms.",
  },
  {
    id: "portrait-cut",
    titleTop: "PORTRAIT",
    titleBottom: "CRYSTAL",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&fit=crop",
    quote: "“An ultra-flat glass table with step-cut perimeters that reveals 100% pure crystal transparency.”",
    specs: [
      { label: "Carat", value: "0.40–4.50ct" },
      { label: "Clarity", value: "IF–VVS2" },
      { label: "Color", value: "D–F" },
      { label: "Cut", value: "Flat Table Step" },
    ],
    col1Title: "Renaissance Artistry",
    col1Text: "Inspired by 16th-century portrait miniature glass crystals, leaving an open window into pure rough diamond clarity.",
    col2Title: "Internal Purity",
    col2Text: "Selected exclusively from top 1% IF to VVS2 clarity rough crystals for floating solitaire mountings.",
  },
  {
    id: "asscher-crown",
    titleTop: "ASSCHER",
    titleBottom: "CROWN",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&fit=crop",
    quote: "“A high crown and deep pavilion with 74 step-cut facets creating a hypnotic windmills optical effect.”",
    specs: [
      { label: "Carat", value: "0.50–6.00ct" },
      { label: "Clarity", value: "VVS1–FL" },
      { label: "Color", value: "D–F" },
      { label: "Cut", value: "74-Facet Asscher" },
    ],
    col1Title: "Hypnotic Windmills",
    col1Text: "Engineered with a narrow table and steep crown angles to maximize optical depth and step-cut reflections.",
    col2Title: "Export Grade",
    col2Text: "Certified D-F colorless rough, GIA laser inscribed and 3D proportion-verified for high jewelry.",
  },
  {
    id: "royal-pear",
    titleTop: "ROYAL",
    titleBottom: "PEAR",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&fit=crop",
    quote: "“Combining the round brilliant fire with an elongated teardrop outline for liquid-light brilliance.”",
    specs: [
      { label: "Carat", value: "0.40–7.50ct" },
      { label: "Clarity", value: "VVS2–FL" },
      { label: "Color", value: "D–G" },
      { label: "Cut", value: "58-Facet Pear" },
    ],
    col1Title: "Teardrop Symmetry",
    col1Text: "58 brilliance facets polished individually to eliminate bowtie darkness and amplify corner fire.",
    col2Title: "Solitaire Preference",
    col2Text: "Highly sought after for luxury engagement rings and drop earrings exported worldwide.",
  },
  {
    id: "cushion-royal",
    titleTop: "CUSHION",
    titleBottom: "ROYAL",
    img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200&fit=crop",
    quote: "“Pillow-soft rounded corners blended with modern 64-facet brilliance for warm romantic dispersion.”",
    specs: [
      { label: "Carat", value: "0.50–8.00ct" },
      { label: "Clarity", value: "VS1–FL" },
      { label: "Color", value: "D–H" },
      { label: "Cut", value: "64-Facet Cushion" },
    ],
    col1Title: "Modified Brilliant",
    col1Text: "Extra facet row added to the pavilion creating a crushed-ice scintillation favored in halo rings.",
    col2Title: "Export Distinction",
    col2Text: "Selected from premium octahedral rough crystals polished by Antwerp master cutters.",
  },
  {
    id: "radiant-step",
    titleTop: "RADIANT",
    titleBottom: "STEP",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&fit=crop",
    quote: "“Cut-cornered rectangular outline engineered with 70 brilliant facets for intense light return.”",
    specs: [
      { label: "Carat", value: "0.50–10.00ct" },
      { label: "Clarity", value: "VVS1–FL" },
      { label: "Color", value: "D–F" },
      { label: "Cut", value: "70-Facet Radiant" },
    ],
    col1Title: "Hybrid Brilliance",
    col1Text: "Combines the rectangular majesty of an emerald cut with the intense fire of a round brilliant.",
    col2Title: "High-Jewelry Mountings",
    col2Text: "Ideal for three-stone platinum settings and bold executive solitaire rings.",
  },
  {
    id: "marquise-regal",
    titleTop: "MARQUISE",
    titleBottom: "REGAL",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&fit=crop",
    quote: "“Commissioned by King Louis XV for the Marquise de Pompadour to resemble the outline of a smile.”",
    specs: [
      { label: "Carat", value: "0.40–6.50ct" },
      { label: "Clarity", value: "VS1–IF" },
      { label: "Color", value: "D–G" },
      { label: "Cut", value: "58-Facet Boat" },
    ],
    col1Title: "Slender Elongation",
    col1Text: "58 precision facets maximizing carat weight appearance and creating a dramatic finger-elongating profile.",
    col2Title: "Antwerp Craft",
    col2Text: "Polished with french-tip faceting at the points to prevent chipping and maximize point brilliance.",
  },
  {
    id: "shield-geometry",
    titleTop: "SHIELD",
    titleBottom: "GEOMETRY",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&fit=crop",
    quote: "“Bespoke 5-sided heraldic shield cut crafted for high-jewelry side stone pairs and solitaires.”",
    specs: [
      { label: "Carat", value: "0.30–5.00ct" },
      { label: "Clarity", value: "VVS1–FL" },
      { label: "Color", value: "D–F" },
      { label: "Cut", value: "Heraldic Shield" },
    ],
    col1Title: "Bespoke Geometry",
    col1Text: "Architectural 5-sided facet arrangement tailored specifically for side accent pairing with large center stones.",
    col2Title: "Royal Export",
    col2Text: "Cut to exact millimeter tolerances by Royal Rays master cutters for custom international commissions.",
  },
];

export default function Diamondcutshowcase() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const watermarkRef = useRef(null);
  const contentRefs = useRef([]);
  const cursorRef = useRef(null);

  const [openIndex, setOpenIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);

  /* ------------------------------------------------------------------ */
  /* GSAP ScrollTrigger Pinned Horizontal Scroll                        */
  /* ------------------------------------------------------------------ */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const watermark = watermarkRef.current;
    if (!section || !track) return;

    let ctx = gsap.context(() => {
      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollAmount()}`,
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        animation: gsap.timeline()
          .to(track, { x: () => -getScrollAmount(), ease: "none" })
          .to(watermark, { x: () => -800, ease: "none" }, 0),
      });
    }, section);

    return () => ctx.revert();
  }, []);

  /* ---------------- 360° Rotating Cross Cursor ---------------- */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let raf = null;

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e) => {
      const r = root.getBoundingClientRect();
      target.x = e.clientX - r.left - 12;
      target.y = e.clientY - r.top - 12;
    };

    root.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      root.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ---------------- Butter-Smooth Modal Open / Close ---------------- */
  const openItem = (index) => {
    if (isAnimating || openIndex !== null) return;
    setIsAnimating(true);
    setOpenIndex(index);
  };

  const closeItem = (e) => {
    if (e) e.stopPropagation();
    if (isAnimating || openIndex === null) return;
    setIsAnimating(true);

    const content = contentRefs.current[openIndex];
    if (!content) {
      setOpenIndex(null);
      setIsAnimating(false);
      return;
    }

    const imgBox = content.querySelector(".dcs-center-img-box");
    const infoElems = content.querySelectorAll(".dcs-anim-elem");

    gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        setOpenIndex(null);
        setIsAnimating(false);
      },
    })
      .to(infoElems, { opacity: 0, y: 15, duration: 0.35, stagger: 0.02 })
      .to(imgBox, { scale: 0.9, opacity: 0, duration: 0.4 }, "-=0.2")
      .to(content, { opacity: 0, duration: 0.35 }, "-=0.25");
  };

  useLayoutEffect(() => {
    if (openIndex === null) return;
    const content = contentRefs.current[openIndex];
    if (!content) return;

    const imgBox = content.querySelector(".dcs-center-img-box");
    const infoElems = content.querySelectorAll(".dcs-anim-elem");

    gsap.set(content, { opacity: 0 });
    gsap.set(imgBox, { scale: 0.88, opacity: 0, y: 25 });
    gsap.set(infoElems, { opacity: 0, y: 20 });

    gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => setIsAnimating(false),
    })
      .to(content, { opacity: 1, duration: 0.45 })
      .to(imgBox, { scale: 1, opacity: 1, y: 0, duration: 0.75, ease: "power3.out" }, "-=0.35")
      .to(infoElems, { opacity: 1, y: 0, duration: 0.55, stagger: 0.04 }, "-=0.45");

  }, [openIndex]);

  return (
    <>
      <style>{`
        .dcs-root {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background-color: #FAFAF8;
          color: #111111;
          font-family: 'Inter', sans-serif;
          cursor: none;
          isolation: isolate;
        }

        /* ACTIVE BACKGROUND WATERMARK & GLOW */
        .dcs-bg-watermark {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          white-space: nowrap;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(8rem, 16vw, 20rem);
          font-weight: 300;
          color: rgba(17, 17, 17, 0.035);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        .dcs-bg-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(240,240,235,0) 70%);
          top: 20%;
          left: 30%;
          pointer-events: none;
          z-index: 2;
        }

        .dcs-track {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          height: 100%;
          width: max-content;
          padding-left: 8vw;
          padding-right: 12vw;
          will-change: transform;
        }

        /* HIGH-FASHION GALLERY CARDS */
        .dcs-gallery-item {
          width: clamp(300px, 28vw, 440px);
          height: 62vh;
          margin-right: 5vw;
          position: relative;
          flex-shrink: 0;
          cursor: pointer;
          border-radius: 20px;
          overflow: hidden;
          background: #0F0E0C;
          box-shadow: 0 20px 45px rgba(0,0,0,0.12);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease;
        }
        .dcs-gallery-item:nth-child(odd) { transform: translateY(7%); }
        .dcs-gallery-item:nth-child(even) { transform: translateY(-7%); }
        .dcs-gallery-item:hover { 
          transform: translateY(0) scale(1.03); 
          box-shadow: 0 30px 60px rgba(0,0,0,0.22);
        }

        .dcs-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.85);
          transition: transform 0.9s ease;
        }
        .dcs-gallery-item:hover .dcs-thumb-img {
          transform: scale(1.08);
          filter: brightness(0.95);
        }

        .dcs-thumb-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(15,14,12,0.85) 100%);
          padding: 2.2rem 2rem;
          display: flex;
          align-items: flex-end;
          z-index: 10;
        }

        .dcs-thumb-title {
          color: #FFFFFF;
          font-family: 'Inter', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        /* CUSTOM ROTATING CROSS CURSOR */
        .dcs-cursor {
          position: absolute;
          top: 0; left: 0;
          width: 1.8rem; height: 1.8rem;
          z-index: 9999;
          pointer-events: none;
          transition: opacity 0.4s ease;
          opacity: 0;
        }
        .dcs-cursor.is-visible { opacity: 1; }
        .dcs-cursor.is-open .dcs-cross { transform: rotateZ(360deg); }
        .dcs-cross {
          transition: transform 0.5s cubic-bezier(.215,.61,.355,1);
          position: absolute;
          width: 100%; height: 100%;
          border-radius: 50%;
          border: 1.5px solid #111111;
          background-color: rgba(255,255,255,0.88);
          backdrop-filter: blur(6px);
          transform: rotateZ(45deg);
        }
        .dcs-cross::after, .dcs-cross::before {
          content: '';
          position: absolute;
          background-color: #111111;
          top: 50%; left: 50%;
          width: calc(100% - 0.75rem);
          height: 1.5px;
        }
        .dcs-cross::after { transform: translate(-50%,-50%) rotateZ(-45deg); }
        .dcs-cross::before { transform: translate(-50%,-50%) rotateZ(45deg); }

        /* FULL MODAL COVER VIEW */
        .dcs-content-section {
          position: absolute;
          inset: 0;
          z-index: 20;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        }
        .dcs-content {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          visibility: hidden;
          background: rgba(250, 250, 248, 0.96);
          backdrop-filter: blur(16px);
        }
        .dcs-content.is-open { visibility: visible; pointer-events: auto; }

        .dcs-content-wrapper {
          aspect-ratio: 16 / 9;
          cursor: pointer;
          width: 52vw;
          position: relative;
        }

        /* REFINED OVERLAPPING TYPOGRAPHY (ELEGANT SERIF WEIGHT - NOT THICK/HEAVY) */
        .dcs-title-top, .dcs-title-bottom {
          mix-blend-mode: difference;
          width: 110%;
          display: flex;
          position: absolute;
          z-index: 40;
          pointer-events: none;
        }
        .dcs-title-top { justify-content: flex-start; align-items: center; bottom: calc(100% - 1.8vw); left: -4vw; }
        .dcs-title-bottom { justify-content: flex-end; align-items: center; top: calc(100% - 2vw); right: -4vw; }

        .dcs-title-big {
          color: #FFFFFF; /* Inverted by mix-blend-mode: difference */
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          font-size: clamp(3rem, 7vw, 7.5rem);
          line-height: 0.85;
          font-weight: 300; /* Lighter elegant luxury weight */
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        /* SIDE COLUMNS */
        .content_text-left, .content_text-right {
          flex-flow: column;
          height: 100%;
          padding-top: 2rem;
          padding-bottom: 2rem;
          display: flex;
          position: absolute;
          z-index: 30;
        }
        .content_text-left {
          text-align: right;
          justify-content: flex-end;
          align-items: flex-end;
          width: 18vw;
          padding-right: 1.5em;
          right: 100%;
        }
        .content_text-right {
          width: 18vw;
          padding-left: 1.5em;
          left: 100%;
        }
        .title-small {
          text-transform: uppercase;
          font-family: 'Inter', sans-serif;
          font-size: clamp(.85rem, .95vw, 1.3rem);
          font-weight: 700;
          line-height: 1.1;
          color: #111111;
          margin-bottom: 0.4rem;
        }
        .paragraph {
          font-size: clamp(.8rem, .85vw, 1.1rem);
          line-height: 1.5;
          color: #444444;
        }

        .content_meta {
          position: absolute;
          top: -3.5rem;
          left: 0;
          right: 0;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          font-size: .75rem;
          letter-spacing: .12em;
          text-transform: uppercase;
          z-index: 30;
        }
        .content_meta .quote {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          text-transform: none;
          letter-spacing: 0;
          color: #333333;
          max-width: 42ch;
          text-align: right;
        }

        .content_specs {
          position: absolute;
          bottom: -4rem;
          left: 0;
          display: flex;
          gap: 1.8rem;
          z-index: 30;
        }
        .content_specs .spec { text-align: left; }
        .content_specs .spec-label {
          font-size: .62rem;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #777777;
        }
        .content_specs .spec-value { font-size: .85rem; color: #111111; font-weight: 700; margin-top: 0.15rem; }

        /* CENTER IMAGE CONTAINER */
        .dcs-center-img-box {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(0,0,0,0.35);
          background: #0F0E0C;
          will-change: transform, opacity;
        }
        .dcs-center-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.85);
        }

        @media (max-width: 900px) {
          .dcs-content-wrapper { width: 82vw; }
          .content_text-right, .content_text-left { display: none; }
          .dcs-title-top, .dcs-title-bottom { width: 100%; left: 0; right: 0; }
        }
      `}</style>

      <section
        className="dcs-root"
        ref={sectionRef}
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => setCursorVisible(false)}
      >
        {/* Active Animated Background Glow */}
        <div className="dcs-bg-glow" />

        {/* Active Drifting Watermark Text */}
        <div className="dcs-bg-watermark" ref={watermarkRef}>
          ROYAL RAYS • EXPORT DIAMOND COLLECTION • ANTWERP EST. 1988 • 12 MASTER CUTS •
        </div>

        {/* 360° Rotating Cross Cursor */}
        <div
          ref={cursorRef}
          className={`dcs-cursor ${cursorVisible ? "is-visible" : ""} ${
            openIndex !== null ? "is-open" : ""
          }`}
          aria-hidden="true"
        >
          <div className="dcs-cross" />
        </div>

        {/* Forceful GSAP ScrollTrigger Pinned Horizontal Track (12 Master Cuts) */}
        <div className="dcs-track" ref={trackRef}>
          {ITEMS.map((item, i) => (
            <div
              key={item.id}
              className="dcs-gallery-item"
              onClick={() => openItem(i)}
            >
              <img
                src={item.img}
                alt={item.titleTop + " " + item.titleBottom}
                className="dcs-thumb-img"
              />
              <div className="dcs-thumb-overlay">
                <div className="dcs-thumb-title">
                  {item.titleTop} {item.titleBottom}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal View */}
        <div className="dcs-content-section">
          {ITEMS.map((item, i) => (
            <div
              key={item.id}
              className={`dcs-content ${openIndex === i ? "is-open" : ""}`}
              ref={(el) => (contentRefs.current[i] = el)}
            >
              <div className="dcs-content-wrapper" onClick={closeItem}>

                {/* Overlapping Titles (Inverted Contrast Serif Typography) */}
                <div className="dcs-title-top dcs-anim-elem">
                  <div className="dcs-title-big">{item.titleTop}</div>
                </div>

                <div className="dcs-title-bottom dcs-anim-elem">
                  <div className="dcs-title-big">{item.titleBottom}</div>
                </div>

                {/* Left Text Column */}
                <div className="content_text-left dcs-anim-elem">
                  <div className="title-small">
                    <span>{item.col1Title}</span>
                  </div>
                  <div className="paragraph">
                    <span>{item.col1Text}</span>
                  </div>
                </div>

                {/* Right Text Column */}
                <div className="content_text-right dcs-anim-elem">
                  <div className="title-small">
                    <span>{item.col2Title}</span>
                  </div>
                  <div className="paragraph">
                    <span>{item.col2Text}</span>
                  </div>
                </div>

                {/* Top Quote */}
                <div className="content_meta dcs-anim-elem">
                  <span className="quote">{item.quote}</span>
                </div>

                {/* Bottom Specs */}
                <div className="content_specs dcs-anim-elem">
                  {item.specs.map((s) => (
                    <div className="spec" key={s.label}>
                      <div className="spec-label">{s.label}</div>
                      <div className="spec-value">{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Center Image Container */}
                <div className="dcs-center-img-box">
                  <img src={item.img} alt={item.titleTop} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>
    </>
  );
}