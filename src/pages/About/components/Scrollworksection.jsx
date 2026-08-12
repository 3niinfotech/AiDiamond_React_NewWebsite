import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const WORK_ITEMS = [
  {
    id: "antwerp",
    image:
      "https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9430460_11zon.jpg",
    imageSrcSet:
      "https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9430460_11zon-p-500.jpg 500w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9430460_11zon-p-800.jpg 800w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9430460_11zon-p-1080.jpg 1080w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9430460_11zon-p-1600.jpg 1600w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9430460_11zon.jpg 2000w",
    videos: [
      {
        mp4: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9430543-uhd_4096_2160_25fps-transcode.mp4",
        webm: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9430543-uhd_4096_2160_25fps-transcode.webm",
        poster:
          "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9430543-uhd_4096_2160_25fps-poster-00001.jpg",
      },
      {
        mp4: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9430549-uhd_4096_2160_25fps-transcode.mp4",
        webm: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9430549-uhd_4096_2160_25fps-transcode.webm",
        poster:
          "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9430549-uhd_4096_2160_25fps-poster-00001.jpg",
      },
      {
        mp4: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9430538-uhd_4096_2160_25fps-1-transcode.mp4",
        webm: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9430538-uhd_4096_2160_25fps-1-transcode.webm",
        poster:
          "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9430538-uhd_4096_2160_25fps-1-poster-00001.jpg",
      },
    ],
    titleLines: [
      { text: "Rooted in", accent: false },
      { text: "Antwerp", accent: true, rest: "." },
    ],
    subtitleLines: [
      "Diamond District Origin",
      "Family Stewardship",
      "European Cutting Bench",
      "Trade Floor Trust",
      "City of Facets",
    ],
    accentClass: "rr-color-1",
  },
  {
    id: "atelier",
    image:
      "https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9421335_11zon.jpg",
    imageSrcSet:
      "https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9421335_11zon-p-500.jpg 500w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9421335_11zon-p-800.jpg 800w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9421335_11zon-p-1080.jpg 1080w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9421335_11zon-p-1600.jpg 1600w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9421335_11zon.jpg 2000w",
    videos: [
      {
        mp4: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9421504-uhd_4096_2160_25fps-transcode.mp4",
        webm: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9421504-uhd_4096_2160_25fps-transcode.webm",
        poster:
          "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9421504-uhd_4096_2160_25fps-poster-00001.jpg",
      },
      {
        mp4: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9421502-uhd_4096_2160_25fps-transcode.mp4",
        webm: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9421502-uhd_4096_2160_25fps-transcode.webm",
        poster:
          "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9421502-uhd_4096_2160_25fps-poster-00001.jpg",
      },
      {
        mp4: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9421500-uhd_4096_2160_25fps-transcode.mp4",
        webm: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9421500-uhd_4096_2160_25fps-transcode.webm",
        poster:
          "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9421500-uhd_4096_2160_25fps-poster-00001.jpg",
      },
    ],
    titleLines: [
      { text: "Hands that", accent: false },
      { text: "Shape", accent: true, rest: " Light" },
    ],
    subtitleLines: [
      "Fancy Cut Specialists",
      "Proportion Discipline",
      "Polish with Patience",
      "Grade with Honesty",
      "Finish for Fire",
    ],
    accentClass: "rr-color-2",
  },
  {
    id: "promise",
    image:
      "https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9489270_11zon.jpg",
    imageSrcSet:
      "https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9489270_11zon-p-500.jpg 500w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9489270_11zon-p-800.jpg 800w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9489270_11zon-p-1080.jpg 1080w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9489270_11zon-p-1600.jpg 1600w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9489270_11zon.jpg 2000w",
    videos: [
      {
        mp4: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9489597-uhd_4096_2160_25fps-transcode.mp4",
        webm: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9489597-uhd_4096_2160_25fps-transcode.webm",
        poster:
          "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9489597-uhd_4096_2160_25fps-poster-00001.jpg",
      },
      {
        mp4: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9489600-uhd_4096_2160_25fps-transcode.mp4",
        webm: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9489600-uhd_4096_2160_25fps-transcode.webm",
        poster:
          "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9489600-uhd_4096_2160_25fps-poster-00001.jpg",
      },
      {
        mp4: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9489599-uhd_4096_2160_25fps-transcode.mp4",
        webm: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9489599-uhd_4096_2160_25fps-transcode.webm",
        poster:
          "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9489599-uhd_4096_2160_25fps-poster-00001.jpg",
      },
    ],
    titleLines: [
      { text: "Ethics in", accent: false },
      { text: "Every", accent: true, rest: " Facet" },
    ],
    subtitleLines: [
      "Conflict-Free Sourcing",
      "Traceable Supply",
      "Certified Standards",
      "Partner-First Deals",
      "Long-Term Trust",
    ],
    accentClass: "rr-color-3",
  },
];

/**
 * About hero — UI + scroll animation based on
 * https://moussamamadou.github.io/scroll-trigger-gsap-section/
 */
export default function ScrollWorkSection() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobileView = window.matchMedia("(max-width: 768px)").matches;

    const prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    document.documentElement.classList.add("lenis");

    let lenis = null;
    let onLenisScroll = null;
    let panelsHidden = false;

    const ctx = gsap.context(() => {
      const workSection = root.querySelector('[data-work="section"]');
      const workItems = Array.from(
        root.querySelectorAll('[data-work="item"]')
      );
      if (!workSection || !workItems.length) return;

      if (prefersReducedMotion) {
        gsap.set(workItems, {
          position: "relative",
          clipPath: "inset(0% 0 0 0)",
          clearProps: "filter",
        });
        return;
      }

      // Ghost spacers — slightly shorter than demo 300vh to keep handoff stable
      const ghostHeight = isMobileView ? "180vh" : "220vh";
      const ghostContainer = document.createElement("div");
      ghostContainer.className = "ghost_work-container";
      workSection.appendChild(ghostContainer);

      const ghostItems = workItems.map(() => {
        const ghostItem = document.createElement("div");
        ghostItem.className = "ghost_work-item";
        ghostItem.style.cssText = `width:100%;height:${ghostHeight};pointer-events:none;`;
        ghostContainer.appendChild(ghostItem);
        return ghostItem;
      });

      gsap.set(workItems, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        clipPath: "inset(100% 0 0% 0)",
        zIndex: 5,
        autoAlpha: 1,
        pointerEvents: "none",
      });

      workItems.forEach((element, index) => {
        const lines = element.querySelectorAll("[data-line]");
        const workImage = element.querySelector('[data-work="image"]');
        const videoContainer = element.querySelectorAll('[data-work="video"]');
        const overlay = element.querySelector('[data-work="item-overlay"]');

        gsap.set(workImage, { scale: 1.35, yPercent: 8 });
        if (overlay) gsap.set(overlay, { display: "none", opacity: 0 });

        const stStarting = {
          trigger: ghostItems[index],
          scrub: true,
          start: "top bottom",
          end: "+75vh top",
          invalidateOnRefresh: true,
        };

        gsap.to(element, {
          clipPath: "inset(0% 0 0 0)",
          scrollTrigger: { ...stStarting },
        });

        gsap.to(workImage, {
          yPercent: 8,
          scale: 1.18,
          scrollTrigger: { ...stStarting },
        });

        gsap.from(lines, {
          yPercent: 120,
          rotate: 2,
          ease: "power2.inOut",
          duration: 1.1,
          scrollTrigger: {
            trigger: ghostItems[index],
            start: "top 75%",
            toggleActions: "play reverse restart reverse",
          },
        });

        gsap.to(workImage, {
          filter: "blur(8px)",
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: ghostItems[index],
            scrub: true,
            start: "0 top",
            end: "35% top",
          },
        });

        const slideFrom = isMobileView
          ? index % 2 === 0
            ? "70%"
            : "-70%"
          : index % 2 === 0
            ? "100vw"
            : "-100vw";

        gsap.fromTo(
          videoContainer,
          { x: slideFrom },
          {
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ghostItems[index],
              scrub: true,
              start: isMobileView ? "top 85%" : "0 top",
              end: isMobileView ? "50% top" : "65% top",
              onLeave: () => {
                if (overlay) gsap.set(overlay, { display: "flex", opacity: 0 });
              },
            },
          }
        );

        const stFinal = {
          trigger: ghostItems[index],
          scrub: true,
          start: "90% bottom",
          invalidateOnRefresh: true,
        };

        if (overlay) {
          gsap.fromTo(
            overlay,
            { opacity: 0 },
            { opacity: 1, scrollTrigger: { ...stFinal } }
          );
        }

        gsap.to(videoContainer, {
          yPercent: 10,
          scrollTrigger: { ...stFinal },
        });
      });

      const pauseAllVideos = () => {
        workItems.forEach((el) => {
          el.querySelectorAll("video").forEach((v) => {
            try {
              v.pause();
            } catch (_) {}
          });
        });
      };

      // Soft handoff only — never destroy Lenis / never display:none (that crashes UI)
      const hideWorkPanels = () => {
        if (panelsHidden) return;
        panelsHidden = true;
        root.classList.add("rr-scroll-done");
        pauseAllVideos();
        gsap.set(workItems, {
          autoAlpha: 0,
          pointerEvents: "none",
          zIndex: -1,
        });
      };

      const showWorkPanels = () => {
        if (!panelsHidden) return;
        panelsHidden = false;
        root.classList.remove("rr-scroll-done");
        gsap.set(workItems, {
          autoAlpha: 1,
          pointerEvents: "auto",
          zIndex: 5,
        });
      };

      ScrollTrigger.create({
        trigger: ghostContainer,
        start: "bottom bottom",
        onLeave: hideWorkPanels,
        onEnterBack: showWorkPanels,
      });

      // Keep Lenis alive for the whole About visit (demo behavior) — destroy only on unmount
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.07,
        wheelMultiplier: 0.75,
        touchMultiplier: 1.15,
        syncTouch: false,
      });

      onLenisScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onLenisScroll);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, root);

    return () => {
      document.documentElement.style.scrollBehavior = prevScrollBehavior;
      document.documentElement.classList.remove("lenis");
      if (lenis) {
        try {
          if (onLenisScroll) lenis.off("scroll", onLenisScroll);
          lenis.destroy();
        } catch (_) {}
        lenis = null;
      }
      ctx.revert();
      const ghost = root.querySelector(".ghost_work-container");
      if (ghost) ghost.remove();
      root.classList.remove("rr-scroll-done");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="rr-scroll-work"
      data-header-dark-zone="true"
    >
      <style>{`
        .rr-scroll-work {
          background: #000;
          color: #fff;
          position: relative;
          z-index: 0;
        }
        .rr-scroll-work .rr-color-0 { color: #cde5df; }
        .rr-scroll-work .rr-color-1 { color: #ffd9b3; }
        .rr-scroll-work .rr-color-2 { color: #bdd9ff; }
        .rr-scroll-work .rr-color-3 { color: #e2ffe2; }

        .rr-scroll-work .hero_section.sticky {
          background-color: #000;
          top: 0;
          position: sticky;
          z-index: 0;
        }
        .rr-scroll-work.rr-scroll-done .work_item {
          visibility: hidden !important;
          pointer-events: none !important;
          z-index: -1 !important;
        }
        .rr-scroll-work .hero_container,
        .rr-scroll-work .footer_container {
          justify-content: space-between;
          align-items: flex-end;
          height: 100vh;
          display: flex;
          position: relative;
        }
        .rr-scroll-work .footer_image-wrapper,
        .rr-scroll-work .work_image-wrapper {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
        }
        .rr-scroll-work .hero_image,
        .rr-scroll-work .footer_image {
          opacity: 0.6;
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
        .rr-scroll-work .hero_text,
        .rr-scroll-work .footer_text {
          color: #fff;
          text-transform: uppercase;
          flex: 1;
          justify-content: flex-start;
          align-items: center;
          padding: 0 4vw 4vw;
          font-family: "Space Grotesk", "Spacegrotesk", system-ui, sans-serif;
          font-size: clamp(2.25rem, 8.5vw, 9.5vw);
          font-weight: 500;
          line-height: 0.9;
          letter-spacing: -0.03em;
          display: flex;
          position: relative;
          -webkit-font-smoothing: antialiased;
        }
        .rr-scroll-work .hero_aside {
          display: none;
          max-width: 22rem;
          padding: 0 4vw 4.5vw;
          position: relative;
          z-index: 1;
          font-family: "Sora", "IBM Plex Mono", sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          line-height: 1.55;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
        }
        @media (min-width: 640px) {
          .rr-scroll-work .hero_aside { display: block; }
        }

        .rr-scroll-work .work_section {
          position: relative;
          z-index: 1;
        }
        .rr-scroll-work .work_item {
          background-color: #000;
          align-items: stretch;
          width: 100%;
          height: 100vh;
          display: flex;
          position: relative;
          overflow: hidden;
        }
        .rr-scroll-work .work_item.is-released {
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -1 !important;
        }
        .rr-scroll-work .work_image {
          opacity: 0.75;
          object-fit: cover;
          width: 100%;
          height: 100%;
          position: relative;
        }
        .rr-scroll-work .work_item-wrapper {
          grid-column-gap: 16px;
          grid-row-gap: 16px;
          flex-flow: column;
          justify-content: space-around;
          align-items: stretch;
          width: 100%;
          padding: 2vw 4vw;
          display: flex;
          position: relative;
        }
        .rr-scroll-work .work_video-wrapper {
          z-index: 1;
          gap: 2.5vw;
          justify-content: center;
          align-items: center;
          display: flex;
          position: relative;
          width: 100%;
          overflow: visible;
        }
        .rr-scroll-work .work_video-container {
          aspect-ratio: 16 / 9;
          flex: 1 1 0;
          min-width: 0;
          overflow: hidden;
          border-radius: 2px;
        }
        .rr-scroll-work .work_video {
          object-fit: cover;
          width: 100%;
          height: 100%;
          display: block;
          position: relative;
          overflow: hidden;
          background: #111;
        }
        .rr-scroll-work .work_video > video {
          background-size: cover;
          background-position: 50% 50%;
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }
        .rr-scroll-work .work_text {
          justify-content: space-between;
          align-items: flex-end;
          width: 100%;
          padding-top: 4vw;
          display: flex;
          position: relative;
        }
        .rr-scroll-work .work_text-title {
          color: #fff;
          text-transform: uppercase;
          flex-flow: column;
          font-family: "Space Grotesk", "Spacegrotesk", system-ui, sans-serif;
          font-size: clamp(1.85rem, 6.2vw, 6.2vw);
          font-weight: 500;
          line-height: 1;
          letter-spacing: -0.03em;
          display: flex;
          position: relative;
          -webkit-font-smoothing: antialiased;
        }
        .rr-scroll-work .work-text-subtitle {
          gap: 0.5vw;
          color: #fff;
          text-transform: uppercase;
          flex-flow: column;
          padding-bottom: 0.5vw;
          padding-right: 1vw;
          font-family: "Sora", sans-serif;
          font-size: clamp(0.65rem, 1.1vw, 0.85rem);
          font-weight: 500;
          letter-spacing: 0.06em;
          display: none;
        }
        @media (min-width: 640px) {
          .rr-scroll-work .work-text-subtitle { display: flex; }
        }
        .rr-scroll-work .line-wrapper { overflow: hidden; }
        .rr-scroll-work .line {
          will-change: transform;
          line-height: 1;
        }
        .rr-scroll-work .work_item-overlay {
          z-index: 2;
          pointer-events: none;
          background-color: #000;
          display: none;
          position: absolute;
          inset: 0;
        }
        .rr-scroll-work .footer_section {
          z-index: 6;
          background-color: #000;
          position: relative;
        }
        .rr-scroll-work .ghost_work-container {
          position: relative;
          z-index: 0;
          pointer-events: none;
        }
        @media screen and (max-width: 768px) {
          .rr-scroll-work .work_item-wrapper {
            padding: 18vw 4vw 8vw;
            justify-content: flex-end;
            gap: 1.25rem;
          }
          .rr-scroll-work .work_video-wrapper {
            flex-direction: column;
            gap: 0.65rem;
            width: 100%;
          }
          .rr-scroll-work .work_video-container {
            width: 100%;
            flex: 0 0 auto;
            max-height: 28vh;
          }
          .rr-scroll-work .work_video-container:nth-child(n + 3) {
            display: none;
          }
          .rr-scroll-work .work_text {
            gap: 1rem;
            flex-flow: column;
            justify-content: flex-start;
            align-items: flex-start;
            padding-top: 0;
          }
          .rr-scroll-work .work_text-title { font-size: 9.5vw; }
          .rr-scroll-work .work-text-subtitle {
            display: flex;
            font-size: 0.65rem;
          }
        }
        @media screen and (max-width: 479px) {
          .rr-scroll-work .work_video-container:nth-child(n + 2) {
            display: none;
          }
          .rr-scroll-work .work_video-container {
            max-height: 34vh;
          }
        }
      `}</style>

      {/* Hero — demo sticky structure */}
      <section
        className="hero_section sticky"
        data-header-transparent="true"
        data-header-hero="true"
      >
        <div className="hero_container">
          <div className="footer_image-wrapper">
            <img
              src="https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718352-1_11zon_11zon_11zon.jpg"
              srcSet="https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718352-1_11zon_11zon_11zon-p-500.jpg 500w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718352-1_11zon_11zon_11zon-p-800.jpg 800w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718352-1_11zon_11zon_11zon-p-1080.jpg 1080w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718352-1_11zon_11zon_11zon.jpg 1600w"
              sizes="100vw"
              alt=""
              className="hero_image"
              decoding="async"
            />
          </div>
          <div className="hero_text">
            <div>
              The house
              <br />
              <span className="rr-color-0">behind </span>the cut.
            </div>
          </div>
          <p className="hero_aside">
            Meet Royal Rays BV — an Antwerp manufacturer of natural fancy-cut
            diamonds, built on family craft, certified quality, and lasting
            partnerships.
          </p>
        </div>
      </section>

      {/* Work — demo data-work structure */}
      <section
        className="work_section"
        data-work="section"
        aria-label="Our story"
      >
        <div className="work_container">
          {WORK_ITEMS.map((item) => (
            <div key={item.id} className="work_item" data-work="item">
              <div className="work_image-wrapper">
                <img
                  src={item.image}
                  srcSet={item.imageSrcSet}
                  sizes="100vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="work_image"
                  data-work="image"
                />
              </div>

              <div className="work_item-wrapper">
                <div className="work_video-wrapper">
                  {item.videos.map((video, i) => (
                    <div
                      key={i}
                      className="work_video-container"
                      data-work="video"
                    >
                      <div className="work_video">
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          style={{
                            backgroundImage: `url("${video.poster}")`,
                          }}
                        >
                          <source src={video.mp4} type="video/mp4" />
                          <source src={video.webm} type="video/webm" />
                        </video>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="work_text">
                  <div className="work_text-title">
                    {item.titleLines.map((line, i) => (
                      <div key={i} className="line-wrapper">
                        <div className="line" data-line>
                          {line.accent ? (
                            <span className={item.accentClass}>{line.text}</span>
                          ) : (
                            line.text
                          )}
                          {line.rest || ""}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="work-text-subtitle">
                    {item.subtitleLines.map((line, i) => (
                      <div key={i} className="line-wrapper">
                        <div className="line" data-line>
                          {line}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="work_item-overlay"
                data-work="item-overlay"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer panel — demo end */}
      <section
        className="footer_section"
        data-header-hero-end="true"
      >
        <div className="footer_container">
          <div className="footer_image-wrapper">
            <img
              src="https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718345_11zon_11zon_11zon.jpg"
              srcSet="https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718345_11zon_11zon_11zon-p-500.jpg 500w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718345_11zon_11zon_11zon-p-800.jpg 800w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718345_11zon_11zon_11zon-p-1080.jpg 1080w, https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718345_11zon_11zon_11zon.jpg 1600w"
              sizes="100vw"
              alt=""
              loading="lazy"
              decoding="async"
              className="footer_image"
            />
          </div>
          <div className="footer_text">
            <div>
              This is
              <br />
              <span className="rr-color-0">who </span>we are.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
