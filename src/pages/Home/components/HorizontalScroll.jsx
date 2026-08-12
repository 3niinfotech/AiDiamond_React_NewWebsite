import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import stap1 from "../../../assets/images/footer.png";
import stap2 from "../../../assets/images/heart-d.png";
import stap3 from "../../../assets/images/ovel-d.png";
import stap4 from "../../../assets/images/pear-d.png";
import stap5 from "../../../assets/images/TRIANGULAR_STEP_CUT.png";
import stap6 from "../../../assets/images/FLOWER-d.png";
import ShapeIcon from "../../../components/ui/ShapeIcon";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Royal Rays export diamond collection — fancy cut showcase
const panels = [
  {
    series: "01",
    label: "Round Brilliant",
    title: "Round Brilliant",
    subtitle: "Signature Export Brilliance",
    desc: "Royal Rays round brilliants are cut for maximum light return and consistent export quality. Trusted by jewellers across 18+ international markets for uniform symmetry, exceptional fire, and Antwerp-standard finishing.",
    image: stap1,
    bgColor: "#FAFAF8",
    textColor: "#111111",
    icon: "R",
    tag: "Export Favourite",
  },
  {
    series: "02",
    label: "Heart Cut",
    title: "Heart Cut",
    subtitle: "Romantic Fancy Excellence",
    desc: "Our heart-cut diamonds combine a distinctive silhouette with masterful Antwerp craftsmanship. Each stone is shaped for balanced wings, a clean cleft, and export-ready proportions that meet global buyer expectations.",
    image: stap2,
    bgColor: "#111111",
    textColor: "#FFFFFF",
    icon: "PR",
    tag: "Fancy Shape",
  },
  {
    series: "03",
    label: "Oval Cut",
    title: "Oval Cut",
    subtitle: "Elongated Export Elegance",
    desc: "Royal Rays oval exports deliver the look of greater size with refined brilliance. Ideal for solitaires, pendants, and bridal collections that demand premium fancy shapes sourced directly from Belgium.",
    image: stap3,
    bgColor: "#FAFAF8",
    textColor: "#111111",
    icon: "OVAL",
    tag: "Bridal Ready",
  },
  {
    series: "04",
    label: "Pear Cut",
    title: "Pear Cut",
    subtitle: "Teardrop Radiance",
    desc: "Pear-cut diamonds from Royal Rays offer graceful curves and strong light performance. Perfectly suited for earrings, pendants, and high-jewellery designs exported to discerning clients worldwide.",
    image: stap4,
    bgColor: "#111111",
    textColor: "#FFFFFF",
    icon: "PEAR",
    tag: "High Jewellery",
  },
  {
    series: "05",
    label: "Triangular Cut",
    title: "Triangular Cut",
    subtitle: "Modern Geometric Fire",
    desc: "A bold choice for contemporary collections, our triangular cuts are polished for sharp symmetry and striking scintillation. Royal Rays delivers these rare fancy shapes with the same export precision as our classic lines.",
    image: stap5,
    bgColor: "#FAFAF8",
    textColor: "#111111",
    icon: "CU",
    tag: "Contemporary Cut",
  },
  {
    series: "06",
    label: "Flower Cut",
    title: "Flower Cut",
    subtitle: "Signature Royal Rays Style",
    desc: "The flower cut reflects our heritage in fancy-shape manufacturing — petals of light, exceptional symmetry, and a distinctive profile buyers recognise instantly. Exported globally from Antwerp with full traceability.",
    image: stap6,
    bgColor: "#111111",
    textColor: "#FFFFFF",
    icon: "EMERALD",
    tag: "House Specialty",
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile-only refs/state — completely separate from the desktop ones above
  const mobileContainerRef = useRef(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // =====================================================================
  // DESKTOP HORIZONTAL PIN-SCROLL ANIMATION — ORIGINAL
  // =====================================================================
  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;

    if (!section || !container || isMobile) {
      if (container) {
        gsap.set(container, { x: 0 });
      }
      return;
    }

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Calculate scroll amount
    const getScrollAmount = () => {
      const scrollWidth = container.scrollWidth;
      const windowWidth = window.innerWidth;
      return -(scrollWidth - windowWidth);
    };

    // Main horizontal scroll animation
    const tl = gsap.to(container, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: "top top",
        end: () => `+=${-getScrollAmount()}`,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const percent = Math.round(self.progress * 100);
          setProgress(percent);

          const index = Math.min(
            panels.length - 1,
            Math.floor(self.progress * panels.length),
          );
          setActiveIndex(index);
        },
      },
    });

    // Panel animations
    const items = container.querySelectorAll(".panel-item");
    items.forEach((item, index) => {
      const content = item.querySelector(".panel-content");
      const number = item.querySelector(".panel-number");
      const image = item.querySelector(".panel-image");
      const title = item.querySelector(".panel-title");
      const subtitle = item.querySelector(".panel-subtitle");
      const desc = item.querySelector(".panel-desc");
      const decorative = item.querySelector(".panel-decorative");
      const step = item.querySelector(".panel-step");
      const floatingElements = item.querySelectorAll(".floating-element");
      const imageWrapper = item.querySelector(".image-wrapper");
      const diamondIcon = item.querySelector(".diamond-icon");
      const circleRing = item.querySelector(".circle-ring");
      const circleRing2 = item.querySelector(".circle-ring-2");
      const circleRing3 = item.querySelector(".circle-ring-3");
      const pulseRing = item.querySelector(".pulse-ring");
      const tag = item.querySelector(".panel-tag");

      const startProgress = index / panels.length;
      const endProgress = (index + 1) / panels.length;

      // Content animation
      if (content) {
        gsap.fromTo(
          content,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              containerAnimation: tl,
              start: `left ${(startProgress + 0.05) * 100}%`,
              end: `left ${(endProgress - 0.05) * 100}%`,
              scrub: 1,
            },
          },
        );
      }

      // Number animation
      if (number) {
        gsap.fromTo(
          number,
          {
            opacity: 0,
            scale: 0.5,
            x: 80,
            rotation: 20,
          },
          {
            opacity: 0.04,
            scale: 1,
            x: 0,
            rotation: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              containerAnimation: tl,
              start: `left ${(startProgress + 0.1) * 100}%`,
              end: `left ${(endProgress - 0.1) * 100}%`,
              scrub: 1,
            },
          },
        );
      }

      // Image wrapper animation
      if (imageWrapper) {
        gsap.fromTo(
          imageWrapper,
          {
            scale: 0.8,
            opacity: 0,
            rotation: -5,
          },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              containerAnimation: tl,
              start: `left ${(startProgress + 0.05) * 100}%`,
              end: `left ${(endProgress - 0.05) * 100}%`,
              scrub: 1,
            },
          },
        );
      }

      // Image animation - SIMPLIFIED
      if (image) {
        gsap.fromTo(
          image,
          {
            scale: 1.1,
            opacity: 0.8,
          },
          {
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              containerAnimation: tl,
              start: `left ${(startProgress + 0.1) * 100}%`,
              end: `left ${(endProgress - 0.05) * 100}%`,
              scrub: 1,
            },
          },
        );
      }

      // Diamond icon animation
      if (diamondIcon) {
        gsap.fromTo(
          diamondIcon,
          {
            scale: 0,
            opacity: 0,
            rotation: -180,
          },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: item,
              containerAnimation: tl,
              start: `left ${(startProgress + 0.15) * 100}%`,
              end: `left ${(endProgress - 0.05) * 100}%`,
              scrub: 1,
            },
          },
        );
      }

      // Tag animation
      if (tag) {
        gsap.fromTo(
          tag,
          {
            opacity: 0,
            x: -20,
          },
          {
            opacity: 1,
            x: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              containerAnimation: tl,
              start: `left ${(startProgress + 0.2) * 100}%`,
              end: `left ${(endProgress - 0.05) * 100}%`,
              scrub: 1,
            },
          },
        );
      }

      // Subtitle animation
      if (subtitle) {
        gsap.fromTo(
          subtitle,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              containerAnimation: tl,
              start: `left ${(startProgress + 0.25) * 100}%`,
              end: `left ${(endProgress - 0.05) * 100}%`,
              scrub: 1,
            },
          },
        );
      }

      // Title animation
      if (title) {
        gsap.fromTo(
          title,
          {
            clipPath: "inset(0 100% 0 0)",
            opacity: 0,
          },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              containerAnimation: tl,
              start: `left ${(startProgress + 0.3) * 100}%`,
              end: `left ${(endProgress - 0.05) * 100}%`,
              scrub: 1,
            },
          },
        );
      }

      // Description animation
      if (desc) {
        gsap.fromTo(
          desc,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              containerAnimation: tl,
              start: `left ${(startProgress + 0.35) * 100}%`,
              end: `left ${(endProgress - 0.05) * 100}%`,
              scrub: 1,
            },
          },
        );
      }

      // Decorative line
      if (decorative) {
        gsap.fromTo(
          decorative,
          {
            scaleX: 0,
            opacity: 0,
          },
          {
            scaleX: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              containerAnimation: tl,
              start: `left ${(startProgress + 0.4) * 100}%`,
              end: `left ${(endProgress - 0.05) * 100}%`,
              scrub: 1,
            },
          },
        );
      }

      // SIMPLIFIED CIRCLE RING ANIMATIONS - Gentle Rotation Only
      if (circleRing) {
        gsap.to(circleRing, {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: "none",
        });
      }

      if (circleRing2) {
        gsap.to(circleRing2, {
          rotation: -360,
          duration: 25,
          repeat: -1,
          ease: "none",
        });
      }

      if (circleRing3) {
        gsap.to(circleRing3, {
          rotation: 360,
          duration: 30,
          repeat: -1,
          ease: "none",
        });
      }

      // SIMPLIFIED PULSE RING ANIMATION
      if (pulseRing) {
        gsap.to(pulseRing, {
          scale: 1.2,
          opacity: 0,
          duration: 2,
          repeat: -1,
          ease: "power1.out",
        });
      }

      // Floating elements animation - Only for decorative elements, not images
      floatingElements.forEach((el, i) => {
        gsap.to(el, {
          y: gsap.utils.random(-30, 30),
          x: gsap.utils.random(-20, 20),
          rotation: gsap.utils.random(-15, 15),
          duration: gsap.utils.random(4, 8),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.5,
        });
      });
    });

    ScrollTrigger.refresh();

    return () => {
      tl.kill();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
      gsap.ticker.remove(() => {});
    };
  }, [isMobile]);

  // Navigation functions (desktop only — unchanged)
  const goToPanel = (index) => {
    const container = containerRef.current;
    if (container && !isMobile) {
      const scrollAmount =
        -(index / panels.length) * (container.scrollWidth - window.innerWidth);
      gsap.to(container, {
        x: scrollAmount,
        duration: 1,
        ease: "power2.inOut",
      });
      setActiveIndex(index);
    }
  };

  const nextPanel = () => {
    if (activeIndex < panels.length - 1) {
      goToPanel(activeIndex + 1);
    }
  };

  const prevPanel = () => {
    if (activeIndex > 0) {
      goToPanel(activeIndex - 1);
    }
  };

  // Keyboard navigation (desktop only — unchanged)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextPanel();
      if (e.key === "ArrowLeft") prevPanel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  // =====================================================================
  // MOBILE — BRAND NEW UI, FULLY INDEPENDENT FROM DESKTOP
  // Vertical timeline: number nodes on the left connected by a line,
  // content + image card on the right of each node. Native scroll,
  // GSAP ScrollTrigger scrub reveal per card, plus a progress rail
  // that fills as you move through the steps.
  // =====================================================================
  useEffect(() => {
    if (!isMobile) return;

    const container = mobileContainerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(".mobile-panel-item");
    const createdTriggers = [];
    const loopingTweens = [];

    items.forEach((item, index) => {
      const card = item.querySelector(".mobile-card");
      const node = item.querySelector(".mobile-node");
      const line = item.querySelector(".mobile-line-fill");
      const imageWrap = item.querySelector(".mobile-image-wrap");
      const tag = item.querySelector(".mobile-tag");
      const stepLabel = item.querySelector(".mobile-step-label");
      const title = item.querySelector(".mobile-title");
      const subtitle = item.querySelector(".mobile-subtitle");
      const desc = item.querySelector(".mobile-desc");
      const glow = item.querySelector(".mobile-glow");

      // Clean initial states
      gsap.set(card, { opacity: 0, y: 50, scale: 0.96 });
      gsap.set(node, { scale: 0.5, opacity: 0.4 });
      if (imageWrap) gsap.set(imageWrap, { opacity: 0, scale: 1.06 });
      if (tag) gsap.set(tag, { opacity: 0, x: -12 });
      if (stepLabel) gsap.set(stepLabel, { opacity: 0 });
      if (title) gsap.set(title, { opacity: 0, y: 16 });
      if (subtitle) gsap.set(subtitle, { opacity: 0, y: 10 });
      if (desc) gsap.set(desc, { opacity: 0, y: 14 });

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          end: "top 45%",
          scrub: 0.7,
        },
      });

      revealTl
        .to(card, { opacity: 1, y: 0, scale: 1, ease: "power3.out", duration: 0.6 }, 0)
        .to(node, { scale: 1, opacity: 1, ease: "back.out(2)", duration: 0.4 }, 0.05)
        .to(imageWrap, { opacity: 1, scale: 1, ease: "power2.out", duration: 0.6 }, 0.08)
        .to(tag, { opacity: 1, x: 0, ease: "power2.out", duration: 0.35 }, 0.15)
        .to(stepLabel, { opacity: 1, duration: 0.3 }, 0.18)
        .to(title, { opacity: 1, y: 0, ease: "power3.out", duration: 0.4 }, 0.2)
        .to(subtitle, { opacity: 1, y: 0, ease: "power2.out", duration: 0.35 }, 0.24)
        .to(desc, { opacity: 1, y: 0, ease: "power2.out", duration: 0.4 }, 0.3);

      if (revealTl.scrollTrigger) createdTriggers.push(revealTl.scrollTrigger);

      // Fill the connecting line as this node becomes active
      if (line) {
        const lineTl = gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.5,
            },
          },
        );
        if (lineTl.scrollTrigger) createdTriggers.push(lineTl.scrollTrigger);
      }

      // Track which step is active (drives node highlight + progress rail)
      const activeTrigger = ScrollTrigger.create({
        trigger: item,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => setMobileActiveIndex(index),
        onEnterBack: () => setMobileActiveIndex(index),
      });
      createdTriggers.push(activeTrigger);

      // Subtle continuous glow pulse — lightweight for mobile perf
      if (glow) {
        loopingTweens.push(
          gsap.to(glow, {
            opacity: 0.5,
            scale: 1.08,
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
        );
      }
    });

    ScrollTrigger.refresh();

    return () => {
      createdTriggers.forEach((st) => st && st.kill());
      loopingTweens.forEach((tw) => tw && tw.kill());
    };
  }, [isMobile]);

  return (
    <>
      {/* =================================================================
          DESKTOP — Web view, hamesha dikhega (hidden hata diya)
      ================================================================== */}
      <section
        ref={sectionRef}
        className="hidden md:block relative w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        <div className="overflow-hidden absolute inset-0">
          <div
            ref={containerRef}
            className="flex items-center h-full"
            style={{ willChange: "transform" }}
          >
            {panels.map((panel, index) => {
              const isActive = index === activeIndex;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className="panel-item flex-shrink-0 w-[100vw] md:w-[100vw] lg:w-[100vw] h-screen relative"
                  style={{
                    willChange: "transform, opacity",
                    backgroundColor: panel.bgColor || "#FAFAF8",
                    color: panel.textColor,
                    boxShadow: isActive
                      ? "0 30px 100px -20px rgba(0,0,0,0.2)"
                      : "0 10px 40px -20px rgba(0,0,0,0.05)",
                    transform: isActive ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {/* Animated Background Pattern - Non-Stop */}
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
                    <div className="bg-animation absolute -top-32 -right-32 w-96 h-96 rounded-full border-2 border-current animate-spin-slow" />
                    <div className="bg-animation absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full border-2 border-current animate-spin-reverse" />
                    <div className="bg-animation absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] border-2 border-current opacity-30 rotate-45" />
                    <div className="bg-animation absolute top-1/4 right-1/4 w-64 h-64 rounded-full border border-current animate-pulse" />
                    <div
                      className="bg-animation absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full border border-current animate-pulse"
                      style={{ animationDelay: "1s" }}
                    />
                  </div>

                  {/* Floating Elements - Non-Stop */}
                  <div className="floating-element absolute top-20 left-20 text-4xl opacity-10 pointer-events-none">
                    ✦
                  </div>
                  <div className="floating-element absolute bottom-20 right-20 text-3xl opacity-10 pointer-events-none">
                    ✧
                  </div>
                  <div className="floating-element absolute top-1/3 right-1/4 text-5xl opacity-5 pointer-events-none">
                    ♦
                  </div>
                  <div className="floating-element absolute bottom-1/3 left-1/4 text-4xl opacity-10 pointer-events-none">
                    ◇
                  </div>
                  <div className="floating-element absolute top-1/4 left-1/3 text-2xl opacity-8 pointer-events-none">
                    ✦
                  </div>
                  <div className="floating-element absolute bottom-1/4 right-1/3 text-2xl opacity-8 pointer-events-none">
                    ✧
                  </div>

                  {/* Large Number Background */}
                  <div className="panel-number absolute -right-8 md:right-12 top-1/2 -translate-y-1/2 text-[25vw] md:text-[18vw] font-bold leading-none opacity-[0.03] pointer-events-none select-none">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Shape Icon Decorative */}
                  <div className="absolute top-8 right-8 md:right-12 lg:right-16 opacity-10 pointer-events-none">
                    <ShapeIcon name={panel.icon} size={80} color={panel.textColor} />
                  </div>

                  {/* Main Layout Grid */}
                  <div className="panel-content relative z-10 h-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 md:p-12 lg:p-16 xl:p-20">
                    {/* Image Section with Circle Rings - OPTIMIZED */}
                    <div
                      className={`image-wrapper order-2 ${isEven ? "lg:order-1" : "lg:order-2"} relative flex items-center justify-center`}
                    >
                      <div className="relative w-full max-w-lg mx-auto">
                        {/* Simple Circle Rings - Clean Animation */}
                        <div className="circle-ring absolute inset-0 w-full h-full pointer-events-none">
                          <svg className="w-full h-full" viewBox="0 0 400 400">
                            <circle
                              cx="200"
                              cy="200"
                              r="180"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                              opacity="0.12"
                            />
                            <circle
                              cx="200"
                              cy="200"
                              r="170"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                              opacity="0.06"
                              strokeDasharray="8 12"
                            />
                          </svg>
                        </div>

                        <div className="circle-ring-2 absolute inset-0 w-full h-full pointer-events-none">
                          <svg className="w-full h-full" viewBox="0 0 400 400">
                            <circle
                              cx="200"
                              cy="200"
                              r="130"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                              opacity="0.10"
                            />
                            <circle
                              cx="200"
                              cy="200"
                              r="120"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                              opacity="0.05"
                              strokeDasharray="6 10"
                            />
                          </svg>
                        </div>

                        <div className="circle-ring-3 absolute inset-0 w-full h-full pointer-events-none">
                          <svg className="w-full h-full" viewBox="0 0 400 400">
                            <circle
                              cx="200"
                              cy="200"
                              r="80"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                              opacity="0.08"
                            />
                            <circle
                              cx="200"
                              cy="200"
                              r="70"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                              opacity="0.04"
                              strokeDasharray="4 8"
                            />
                          </svg>
                        </div>

                        {/* Simple Pulse Ring */}
                        <div className="pulse-ring absolute inset-0 w-full h-full pointer-events-none">
                          <svg className="w-full h-full" viewBox="0 0 400 400">
                            <circle
                              cx="200"
                              cy="200"
                              r="150"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.3"
                              opacity="0.15"
                            />
                          </svg>
                        </div>

                        {/* Image Container - Clean & Centered */}
                        <div className="relative overflow-hidden">
                          <img
                            src={panel.image}
                            alt={panel.title}
                            className="panel-image w-full h-auto "
                            style={{
                              willChange: "transform",
                              aspectRatio: "4/3",
                              maxHeight: "500px",
                            }}
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div
                      className={`order-1 ${isEven ? "lg:order-2" : "lg:order-1"} space-y-4 md:space-y-6`}
                    >
                      {/* Tag */}
                      <div className="panel-tag inline-block px-4 py-1.5 rounded-full text-xs tracking-[0.15em] uppercase border border-current/20 opacity-60">
                        {panel.tag}
                      </div>

                      {/* Cut label */}
                      <div className="panel-step text-xs md:text-sm tracking-[0.3em] uppercase opacity-40 flex items-center gap-3">
                        <span>{panel.label}</span>
                        <span className="flex-1 h-px bg-current opacity-20 max-w-16" />
                      </div>

                      {/* Subtitle */}
                      <p className="panel-subtitle text-sm md:text-base tracking-[0.1em] uppercase opacity-50">
                        {panel.subtitle}
                      </p>

                      {/* Title */}
                      <h2 className="panel-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05]">
                        {panel.title}
                      </h2>

                      {/* Decorative Line */}
                      <div className="panel-decorative w-16 md:w-24 h-[2px] bg-current opacity-30 origin-left" />

                      {/* Description */}
                      <p className="panel-desc text-base md:text-lg lg:text-xl leading-relaxed opacity-70 max-w-lg">
                        {panel.desc}
                      </p>

                      {/* Progress indicator for current panel */}
                      <div className="pt-6 flex items-center gap-4">
                        <div className="flex gap-2">
                          {panels.map((_, i) => (
                            <div
                              key={i}
                              className={`h-[2px] transition-all duration-500 ${
                                i === index
                                  ? "w-10 bg-current"
                                  : i < index
                                    ? "w-4 bg-current/30"
                                    : "w-4 bg-current/10"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs opacity-30 font-mono tracking-wider">
                          {String(index + 1).padStart(2, "0")}/
                          {String(panels.length).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute top-8 right-8 flex items-center gap-2 text-xs tracking-widest uppercase opacity-30">
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      Active
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          MOBILE — PERFECT MOBILE VIEW (Improved version)
          Visible only below 768px
      ================================================================== */}
      <section className="md:hidden relative w-full overflow-hidden bg-[#FAFAF8] py-10 px-4">
        {/* Section intro */}
        <div className="mb-8 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase opacity-40 mb-2">
            Export Collection
          </p>
          <h2 className="text-2xl font-light leading-tight text-[#111111]">
            Premium Fancy Cut
            <br />
            Diamonds from Antwerp
          </h2>
        </div>

        <div ref={mobileContainerRef} className="relative">
          {/* Base timeline track */}
          <div className="absolute left-[18px] top-2 bottom-2 w-[2px] bg-[#111111]/10 rounded-full" />

          {panels.map((panel, index) => {
            const isDark = panel.bgColor === "#111111";
            const isActive = index === mobileActiveIndex;

            return (
              <div
                key={index}
                className="mobile-panel-item relative pl-12 pb-10 last:pb-0"
              >
                {/* Filled progress segment for this step */}
                {index < panels.length - 1 && (
                  <div
                    className="mobile-line-fill absolute left-[18px] top-2 w-[2px] bg-[#111111]/60 rounded-full origin-top"
                    style={{ height: "calc(100% - 8px)" }}
                  />
                )}

                {/* Node */}
                <div
                  className={`mobile-node absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-semibold tracking-wide border-2 transition-all duration-300 z-10 ${
                    isActive
                      ? "bg-[#111111] text-white border-[#111111] shadow-lg shadow-[#111111]/20"
                      : "bg-[#FAFAF8] text-[#111111]/50 border-[#111111]/20"
                  }`}
                >
                  {panel.series}
                </div>

                {/* Card */}
                <div
                  className="mobile-card relative rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: panel.bgColor || "#FFFFFF",
                    color: panel.textColor,
                    boxShadow: "0 15px 40px -20px rgba(0,0,0,0.2)",
                    border: isDark ? "none" : "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Soft glow accent */}
                  <div
                    className="mobile-glow absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, currentColor 0%, transparent 70%)",
                      opacity: 0.12,
                    }}
                  />

                  {/* Image */}
                  <div className="mobile-image-wrap relative w-full overflow-hidden bg-black/5">
                    <img
                      src={panel.image}
                      alt={panel.title}
                      className="mobile-image w-full h-full object-cover"
                      style={{ aspectRatio: "4/3", maxHeight: "200px" }}
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 opacity-60">
                      <ShapeIcon name={panel.icon} size={28} color={panel.textColor} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-5 space-y-2.5">
                    <div className="mobile-tag inline-block px-2.5 py-0.5 rounded-full text-[9px] tracking-[0.15em] uppercase border border-current/20 opacity-70">
                      {panel.tag}
                    </div>

                    <p className="mobile-step-label text-[9px] tracking-[0.25em] uppercase opacity-40">
                      {panel.label}
                    </p>

                    <h3 className="mobile-title text-xl font-light leading-tight">
                      {panel.title}
                    </h3>

                    <p className="mobile-subtitle text-[10px] tracking-[0.08em] uppercase opacity-50">
                      {panel.subtitle}
                    </p>

                    <p className="mobile-desc text-sm leading-relaxed opacity-75">
                      {panel.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall progress footer */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {panels.map((_, i) => (
            <div
              key={i}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                i === mobileActiveIndex
                  ? "w-6 bg-[#111111]"
                  : i < mobileActiveIndex
                    ? "w-2 bg-[#111111]/30"
                    : "w-2 bg-[#111111]/10"
              }`}
            />
          ))}
        </div>
      </section>
    </>
  );
}