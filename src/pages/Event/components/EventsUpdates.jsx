import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { FaArrowUpRightDots } from "react-icons/fa6";
import { RiRouteLine } from "react-icons/ri";

import vicenzaoroImg from "../../../assets/images/event4.jpg";
import jckImg from "../../../assets/images/event1.jpg";
import hongKongImg from "../../../assets/images/event3.jpg";
import gemGeneveImg from "../../../assets/images/event2.jpg";

import vicenzaoroLogo from "../../../assets/images/logoVO-1024x372-1.jpeg";
import jckLogo from "../../../assets/images/jck.png";
import hongKongLogo from "../../../assets/images/Jewellery_and_Gem_World_logo_RGB_S_v4.png";
import gemGeneveLogo from "../../../assets/images/Gem-Geneve-logo.webp";

gsap.registerPlugin(ScrollTrigger);

const FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500&family=Inter:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');
  .sig-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
  .sig-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
  .sig-mono { font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace; }

  .orbit-layer {
    position: absolute;
    inset: -25%;
    pointer-events: none;
    z-index: 0;
    border-radius: 9999px;
  }

  .orbit-ring--outer {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    border: 1px solid currentColor;
    animation: orbit-spin 45s linear infinite;
    opacity: 0.12;
  }

  .orbit-ring--inner {
    position: absolute;
    inset: 10%;
    border-radius: 9999px;
    border: 2px solid currentColor;
    animation: orbit-spin 30s linear infinite reverse;
    opacity: 0.15;
  }

  .orbit-dash {
    position: absolute;
    inset: 20%;
    border-radius: 9999px;
    border: 1px dashed currentColor;
    opacity: 0.12;
    animation: orbit-spin 55s linear infinite;
  }

  .orbit-dots {
    position: absolute;
    inset: 15%;
    border-radius: 9999px;
    animation: orbit-spin 40s linear infinite;
  }

  .orbit-dot {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.2;
  }

  .orbit-dot:nth-child(1) { top: 0; left: 50%; transform: translate(-50%, -50%); }
  .orbit-dot:nth-child(2) { top: 50%; right: 0; transform: translate(50%, -50%); }
  .orbit-dot:nth-child(3) { bottom: 0; left: 50%; transform: translate(-50%, 50%); }
  .orbit-dot:nth-child(4) { top: 50%; left: 0; transform: translate(-50%, -50%); }
  .orbit-dot:nth-child(5) { top: 15%; right: 15%; transform: translate(50%, -50%); }
  .orbit-dot:nth-child(6) { bottom: 15%; left: 15%; transform: translate(-50%, 50%); }
  .orbit-dot:nth-child(7) { top: 15%; left: 15%; transform: translate(-50%, -50%); }
  .orbit-dot:nth-child(8) { bottom: 15%; right: 15%; transform: translate(50%, 50%); }

  .orbit-blob {
    position: absolute;
    border-radius: 9999px;
    background: currentColor;
    filter: blur(60px);
    opacity: 0.08;
    will-change: transform;
  }

  .orbit-blob--a {
    width: 60%;
    height: 60%;
    top: 2%;
    left: 0%;
    animation: blob-drift-a 18s ease-in-out infinite;
  }

  .orbit-blob--b {
    width: 50%;
    height: 50%;
    bottom: 2%;
    right: 0%;
    animation: blob-drift-b 22s ease-in-out infinite;
  }

  .orbit-blob--c {
    width: 40%;
    height: 40%;
    top: 30%;
    right: 10%;
    animation: blob-drift-c 14s ease-in-out infinite;
  }

  .orbit-sparkles {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
  }

  .sparkle {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0;
    animation: sparkle-twinkle 3s ease-in-out infinite;
  }

  .sparkle:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
  .sparkle:nth-child(2) { top: 25%; right: 30%; animation-delay: 0.8s; }
  .sparkle:nth-child(3) { bottom: 30%; left: 15%; animation-delay: 1.6s; }
  .sparkle:nth-child(4) { bottom: 15%; right: 25%; animation-delay: 2.4s; }
  .sparkle:nth-child(5) { top: 45%; left: 5%; animation-delay: 1.2s; }
  .sparkle:nth-child(6) { top: 5%; right: 15%; animation-delay: 0.4s; }
  .sparkle:nth-child(7) { bottom: 45%; right: 8%; animation-delay: 2s; }
  .sparkle:nth-child(8) { top: 35%; left: 35%; animation-delay: 1.8s; }

  @keyframes orbit-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes blob-drift-a {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(8%, 10%) scale(1.2); }
  }

  @keyframes blob-drift-b {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-10%, -8%) scale(1.15); }
  }

  @keyframes blob-drift-c {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-5%, 12%) scale(1.25); }
  }

  @keyframes sparkle-twinkle {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 0.6; transform: scale(1.2); }
  }

  @media (prefers-reduced-motion: reduce) {
    .orbit-ring--outer, .orbit-ring--inner, .orbit-dash, 
    .orbit-dots, .orbit-blob, .sparkle { animation: none !important; }
    .sparkle { opacity: 0.15; }
  }
`;

const EVENTS = [
  {
    id: "jck",
    name: "JCK Las Vegas",
    dateLabel: "June · 2026",
    coords: "36.17° N / 115.14° W",
    location: "Las Vegas, USA",
    venue: "Las Vegas Convention Center",
    image: jckImg,
    logo: jckLogo,
    description:
      "Midyear, the route crosses to North America's largest trade floor, where buyers from across the continent gather.",
    tags: ["500+ Exhibitors", "Networking", "Industry Leaders"],
    website: "https://jckonline.com",
    field: "#FFFFFF",
    ink: "dark",
  },
  {
    id: "vicenzaoro",
    name: "Vicenzaoro",
    dateLabel: "January · 2026",
    coords: "45.54° N / 11.54° E",
    location: "Vicenza, Italy",
    venue: "Vicenza Expo Centre",
    image: vicenzaoroImg,
    logo: vicenzaoroLogo,
    description:
      "The route opens in Vicenza, where Italian goldsmithing tradition sets the tone for the year ahead.",
    tags: ["Gold & Jewelry", "Italian Craft", "Heritage Brands"],
    website: "https://vicenzaoro.com",
    field: "#0A0A0A",
    ink: "light",
  },
  {
    id: "gemgeneve",
    name: "GemGenève",
    dateLabel: "November · 2026",
    coords: "46.20° N / 6.14° E",
    location: "Geneva, Switzerland",
    venue: "Palexpo, Geneva",
    image: gemGeneveImg,
    logo: gemGeneveLogo,
    description:
      "The year closes in Geneva, among rare stones and a smaller, more curated circle of international buyers.",
    tags: ["Rare Gemstones", "Luxury Brands", "Global Buyers"],
    website: "https://gemgeneve.com",
    field: "#FFFFFF",
    ink: "dark",
  },
  {
    id: "hongkong",
    name: "Jewellery & Gem World Hong Kong",
    dateLabel: "September · 2026",
    coords: "22.32° N / 114.17° E",
    location: "Hong Kong",
    venue: "Hong Kong Convention Centre",
    image: hongKongImg,
    logo: hongKongLogo,
    // Official mark is portrait; rotate for a clean horizontal lockup
    logoOrientation: "vertical",
    description:
      "Autumn brings the largest stop of the year — Asia's principal marketplace for gemstones and finished jewelry.",
    tags: ["3,000+ Exhibitors", "Asian Market", "Innovation Hub"],
    website: "https://jewellery.hktdc.com",
    field: "#0A0A0A",
    ink: "light",
  },
];

const SectionHeader = () => (
  <motion.div
    className="text-center mb-14"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  >
    <h2 className="sig-display text-[clamp(30px,4.5vw,52px)] font-light text-[#111111] leading-[1.06]">
      One Route,{" "}
      <span className="relative inline-block font-light text-[#111111]/70">
        Four Capitals
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

    <p className="sig-body text-[#4D4D4D] max-w-2xl mx-auto mt-6 text-[15px] md:text-base leading-relaxed font-light">
      The 2026 circuit runs from Vicenza in January to Geneva in November — four
      stops, one continuous journey. Scroll to travel the route.
    </p>
  </motion.div>
);

const MaskedHeading = forwardRef(({ text }, ref) => (
  <h3
    ref={ref}
    className="sig-display max-w-xl text-[clamp(28px,4.6vw,56px)] font-light leading-[1.02] tracking-tight"
  >
    {text.split(" ").map((word, wi) => (
      <span key={wi} className="mr-[0.28em] inline-block align-top">
        <span className="word-inner inline-block">
          {word.split("").map((ch, ci) => (
            <span key={ci} className="char inline-block will-change-transform">
              {ch}
            </span>
          ))}
        </span>
      </span>
    ))}
  </h3>
));
MaskedHeading.displayName = "MaskedHeading";

const EventPanel = forwardRef(
  ({ event, index, reducedMotion, onActivate }, panelRef) => {
    const cardRef = useRef(null);
    const imgRef = useRef(null);
    const logoRef = useRef(null);
    const eyebrowRef = useRef(null);
    const headlineRef = useRef(null);
    const metaRef = useRef(null);
    const descRef = useRef(null);
    const tagsRef = useRef(null);
    const ctaRef = useRef(null);

    const isLight = event.ink === "light";
    const imageOnRight = index % 2 === 0;
    const textColor = isLight ? "#F2F2F0" : "#0A0A0A";
    const mutedColor = isLight
      ? "rgba(242,242,240,0.6)"
      : "rgba(10,10,10,0.56)";
    const borderColor = isLight
      ? "rgba(242,242,240,0.2)"
      : "rgba(10,10,10,0.12)";

    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        const words = headlineRef.current?.querySelectorAll(".word-inner");
        const chars = headlineRef.current?.querySelectorAll(".char");
        const tags = tagsRef.current?.querySelectorAll(".tag");
        const slideFrom = imageOnRight ? 130 : -130;
        const rotateFrom = imageOnRight ? -18 : 18;

        if (reducedMotion) {
          if (cardRef.current) {
            gsap.set(cardRef.current, {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              rotationY: 0,
              filter: "blur(0px)",
            });
          }
          if (imgRef.current) gsap.set(imgRef.current, { scale: 1 });
          if (logoRef.current) gsap.set(logoRef.current, { opacity: 1, y: 0 });
          if (eyebrowRef.current)
            gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
          if (words) gsap.set(words, { yPercent: 0 });
          if (chars) gsap.set(chars, { opacity: 1 });
          if (metaRef.current) gsap.set(metaRef.current, { opacity: 1, y: 0 });
          if (descRef.current) gsap.set(descRef.current, { opacity: 1, y: 0 });
          if (tags) gsap.set(tags, { opacity: 1, y: 0, scale: 1 });
          if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1, y: 0 });
          return;
        }

        const mainTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: panelRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
            id: `main-${event.id}`,
          },
          defaults: { ease: "power3.out" },
        });

        if (cardRef.current) {
          mainTimeline
            .fromTo(
              cardRef.current,
              {
                x: slideFrom,
                scale: 0.8,
                opacity: 0,
                rotationY: rotateFrom,
                filter: "blur(10px)",
              },
              {
                x: 0,
                scale: 1,
                opacity: 1,
                rotationY: 0,
                filter: "blur(0px)",
                duration: 1.2,
                ease: "power4.out",
              },
              0,
            )
            .fromTo(
              imgRef.current,
              { scale: 1.2 },
              { scale: 1, duration: 1.2, ease: "power4.out" },
              0,
            )
            .fromTo(
              logoRef.current,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.5 },
              0.15,
            )
            .fromTo(
              eyebrowRef.current,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.45 },
              0.2,
            )
            .fromTo(
              words || [],
              { yPercent: 130 },
              {
                yPercent: 0,
                duration: 0.75,
                stagger: 0.06,
                ease: "power4.out",
              },
              0.25,
            )
            .fromTo(
              chars || [],
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.35,
                stagger: { each: 0.01, from: "random" },
              },
              0.32,
            )
            .fromTo(
              metaRef.current,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.5 },
              0.6,
            )
            .fromTo(
              descRef.current,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.5 },
              0.7,
            )
            .fromTo(
              tags || [],
              { opacity: 0, y: 10, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05 },
              0.8,
            )
            .fromTo(
              ctaRef.current,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.45 },
              0.9,
            );
        }

        let imageParallax;
        if (imgRef.current) {
          imageParallax = gsap.to(imgRef.current, {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: panelRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
              id: `parallax-${event.id}`,
            },
          });
        }

        let floatTween;
        if (cardRef.current) {
          floatTween = gsap.to(cardRef.current, {
            y: "+=6",
            duration: 3.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            paused: true,
            scrollTrigger: {
              trigger: panelRef.current,
              start: "top bottom",
              end: "bottom top",
              onEnter: () => floatTween?.play(),
              onEnterBack: () => floatTween?.play(),
              onLeave: () => floatTween?.pause(),
              onLeaveBack: () => floatTween?.pause(),
              id: `float-${event.id}`,
            },
          });
        }

        const bgTrigger = ScrollTrigger.create({
          trigger: panelRef.current,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => onActivate(index),
          onEnterBack: () => onActivate(index),
          onLeaveBack: () => onActivate(Math.max(index - 1, 0)),
          id: `bg-${event.id}`,
        });

        return () => {
          imageParallax?.kill();
          floatTween?.kill();
          ScrollTrigger.getById(`main-${event.id}`)?.kill();
          ScrollTrigger.getById(`parallax-${event.id}`)?.kill();
          ScrollTrigger.getById(`float-${event.id}`)?.kill();
          bgTrigger.kill();
        };
      }, panelRef);

      return () => ctx.revert();
    }, [reducedMotion, imageOnRight, index, panelRef, onActivate, event.id]);

    const ImageCard = (
      <div className={`relative ${imageOnRight ? "lg:order-2" : "lg:order-1"}`}>
        <div className="lg:sticky lg:top-24">
          <div
            ref={cardRef}
            className="relative w-full will-change-transform"
            style={{
              perspective: "1200px",
              color: textColor,
              backfaceVisibility: "hidden",
            }}
          >
            <div className="orbit-layer">
              <span className="orbit-blob orbit-blob--a" />
              <span className="orbit-blob orbit-blob--b" />
              <span className="orbit-blob orbit-blob--c" />
              <span className="orbit-ring--outer" />
              <span className="orbit-ring--inner" />
              <span className="orbit-dash" />
              <div className="orbit-dots">
                <span className="orbit-dot" />
                <span className="orbit-dot" />
                <span className="orbit-dot" />
                <span className="orbit-dot" />
                <span className="orbit-dot" />
                <span className="orbit-dot" />
                <span className="orbit-dot" />
                <span className="orbit-dot" />
              </div>
              <div className="orbit-sparkles">
                <span className="sparkle" />
                <span className="sparkle" />
                <span className="sparkle" />
                <span className="sparkle" />
                <span className="sparkle" />
                <span className="sparkle" />
                <span className="sparkle" />
                <span className="sparkle" />
              </div>
            </div>

            <div className="relative z-10 w-full md:w-[70%]">
              <img
                ref={imgRef}
                src={event.image}
                alt={event.name}
                className="h-full w-full will-change-transform"
                style={{ backfaceVisibility: "hidden" }}
              />
            </div>
          </div>
        </div>
      </div>
    );

    const TextCol = (
      <div
        className={`flex flex-col justify-center gap-4 py-4 ${imageOnRight ? "lg:order-1" : "lg:order-2"}`}
      >
        {/* Logo horizontal; stacks on small screens, row beside title from sm+ */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          {event.logoOrientation === "vertical" ? (
            <div
              ref={logoRef}
              className="event-logo-h relative shrink-0 overflow-hidden"
              style={{
                width: "clamp(160px, 52vw, 220px)",
                height: "clamp(54px, 16vw, 70px)",
                border: `1px solid ${borderColor}`,
              }}
            >
              <img
                src={event.logo}
                alt={`${event.name} logo`}
                className="absolute left-1/2 top-1/2 max-w-none object-contain"
                style={{
                  height: "clamp(160px, 52vw, 220px)",
                  width: "auto",
                  transform: "translate(-50%, -50%) rotate(-90deg)",
                }}
              />
            </div>
          ) : (
            <img
              ref={logoRef}
              src={event.logo}
              alt={`${event.name} logo`}
              className="h-auto w-auto max-h-[56px] max-w-[min(180px,70vw)] shrink-0 object-contain p-1 sm:max-h-[64px]"
              style={{
                border: `1px solid ${borderColor}`,
              }}
            />
          )}

          <div className="min-w-0 flex-1">
            <span
              ref={eyebrowRef}
              className="sig-mono mb-2 block text-[10px] uppercase tracking-[0.24em]"
              style={{ color: mutedColor }}
            >
              {event.dateLabel}
            </span>

            <div style={{ color: textColor, perspective: 500 }}>
              <MaskedHeading ref={headlineRef} text={event.name} />
            </div>
          </div>
        </div>

        <div
          ref={metaRef}
          className="sig-body flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
          style={{ color: mutedColor }}
        >
          <span>{event.venue}</span>
          <span
            className="h-1 w-1 rounded-full"
            style={{ backgroundColor: mutedColor }}
          />
          <span>{event.location}</span>
        </div>

        <p
          ref={descRef}
          className="sig-body max-w-md text-[15px] font-light leading-relaxed"
          style={{ color: mutedColor }}
        >
          {event.description}
        </p>

        <div ref={tagsRef} className="flex flex-wrap gap-2 pt-1">
          {event.tags.map((t) => (
            <span
              key={t}
              className="tag sig-mono rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.06em]"
              style={{
                borderColor: borderColor,
                color: mutedColor,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div ref={ctaRef} className="pt-2">
          <a
            href={event.website}
            target="_blank"
            rel="noopener noreferrer"
            className="group sig-body inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ color: textColor }}
          >
            <span className="relative">
              Visit event site
              <span
                className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                style={{ backgroundColor: textColor }}
              />
            </span>
            <FaArrowUpRightDots className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    );

    return (
      <section ref={panelRef} className="relative py-20">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-6 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
          {ImageCard}
          {TextCol}
        </div>
      </section>
    );
  },
);
EventPanel.displayName = "EventPanel";

const EventsUpdates = ({ headerTransparent = false }) => {
  const rootRef = useRef(null);
  const fieldRef = useRef(null);
  const panelRefs = useRef(EVENTS.map(() => React.createRef()));

  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeIndexRef = useRef(-1);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    const pending = imgs.filter((img) => !img.complete);

    if (pending.length === 0) {
      ScrollTrigger.refresh();
      return;
    }

    let remaining = pending.length;
    const onLoad = () => {
      remaining -= 1;
      if (remaining <= 0) ScrollTrigger.refresh();
    };

    pending.forEach((img) => {
      img.addEventListener("load", onLoad, { once: true });
      img.addEventListener("error", onLoad, { once: true });
    });

    return () => {
      pending.forEach((img) => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onLoad);
      });
    };
  }, []);

  const handleActivate = useCallback((index) => {
    if (activeIndexRef.current === index) return;
    activeIndexRef.current = index;

    if (fieldRef.current) {
      gsap.to(fieldRef.current, {
        backgroundColor: EVENTS[index].field,
        duration: 0.9,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    }
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const progressTrigger = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setProgress(self.progress),
        id: "progress-trigger",
      });

      return () => {
        progressTrigger.kill();
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} data-header-hero-end="true" data-header-transparent={headerTransparent ? "true" : "false"} className="relative pb-40">
      <style>{FONT_STYLES}</style>
      <div
        ref={fieldRef}
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: EVENTS[0].field }}
      />

      <div className="relative z-10 px-6 pb-12  sm:px-8 md:pb-16 md:pt-22">
        <SectionHeader />
      </div>

      <div className="relative z-10">
        {EVENTS.map((event, i) => (
          <div key={event.id} className="mb-24 last:mb-0">
            <EventPanel
              ref={panelRefs.current[i]}
              event={event}
              index={i}
              reducedMotion={reducedMotion}
              onActivate={handleActivate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsUpdates;