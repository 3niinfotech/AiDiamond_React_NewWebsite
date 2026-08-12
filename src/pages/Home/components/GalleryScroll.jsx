"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GalleryScroll() {
  const containerRef = useRef(null);
  const blockRefs = useRef([]);
  const imageRefs = useRef([]);
  const accentRefs = useRef([]);
  const accentRefs2 = useRef([]);
  const floatTweens = useRef([]);
  const floatTweens2 = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const tones = [
    {
      bg: "#FAF8F4",
      text: "#141311",
      sub: "rgba(20,19,17,0.55)",
      line: "rgba(20,19,17,0.25)",
    },
    {
      bg: "#F1EEE6",
      text: "#141311",
      sub: "rgba(20,19,17,0.55)",
      line: "rgba(20,19,17,0.25)",
    },
    {
      bg: "#DEDACF",
      text: "#141311",
      sub: "rgba(20,19,17,0.55)",
      line: "rgba(20,19,17,0.3)",
    },
    {
      bg: "#1B1A18",
      text: "#F7F5F0",
      sub: "rgba(247,245,240,0.55)",
      line: "rgba(247,245,240,0.25)",
    },
    {
      bg: "#0A0A0A",
      text: "#F7F5F0",
      sub: "rgba(247,245,240,0.55)",
      line: "rgba(247,245,240,0.25)",
    },
    {
      bg: "#F5F3EF",
      text: "#141311",
      sub: "rgba(20,19,17,0.55)",
      line: "rgba(20,19,17,0.25)",
    },
  ];

  // Extended accent layouts for all 6 items
  const accentLayout = [
    { top: "-9%", right: "-13%", bottom: "auto", left: "auto", rotate: -4 },
    { top: "auto", right: "auto", bottom: "-9%", left: "-13%", rotate: 5 },
    { top: "-7%", right: "auto", bottom: "auto", left: "-15%", rotate: -5 },
    { top: "auto", right: "-11%", bottom: "-11%", left: "auto", rotate: 4 },
    { top: "9%", right: "-17%", bottom: "auto", left: "auto", rotate: -3 },
    { top: "auto", right: "auto", bottom: "-12%", left: "-10%", rotate: 6 },
  ];

  const accentLayout2 = [
    { top: "auto", right: "auto", bottom: "-12%", left: "-8%", rotate: 6 },
    { top: "-12%", right: "-8%", bottom: "auto", left: "auto", rotate: -6 },
    { top: "auto", right: "-14%", bottom: "auto", left: "auto", rotate: 4 },
    { top: "auto", right: "auto", bottom: "auto", left: "-12%", rotate: -5 },
    { top: "-8%", right: "auto", bottom: "auto", left: "-14%", rotate: 5 },
    { top: "auto", right: "auto", bottom: "auto", left: "-15%", rotate: -4 },
  ];

  const contentData = [
    {
      id: 0,
      title: "Sourcing Excellence",
      subtitle: "Ethical & Responsible",
      description:
        "Our diamonds are sourced with utmost care and responsibility, ensuring ethical practices and exceptional quality from the mines to your hands.",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&auto=format&fit=crop",
      accent:
        "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&h=800&fit=crop&crop=center",
      accent2:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop&crop=center",
    },
    {
      id: 1,
      title: "Prime Selection",
      subtitle: "Handpicked Brilliance",
      description:
        "Handpicked for their brilliance and rarity, our prime selection of diamonds represents the epitome of elegance and beauty, curated to exceed your expectations.",
      image:
        "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=1600&auto=format&fit=crop",
      accent:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop&crop=center",
      accent2:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=800&fit=crop&crop=center",
    },
    {
      id: 2,
      title: "Precision Cutting",
      subtitle: "Mastery of Craft",
      description:
        "Guided by seasoned craftsmen, our diamonds undergo meticulous cutting techniques, revealing their inherent radiance and allure with precision and mastery.",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&auto=format&fit=crop",
      accent:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=800&fit=crop&crop=center",
      accent2:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&crop=center",
    },
    {
      id: 3,
      title: "Exquisite Polishing",
      subtitle: "Unveiling Brilliance",
      description:
        "With decades of expertise, our artisans meticulously polish each diamond to perfection, unveiling its flawless beauty and unmatched sparkle.",
      image:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&auto=format&fit=crop",
      accent:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&crop=center",
      accent2:
        "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&h=800&fit=crop&crop=center",
    },
    {
      id: 4,
      title: "Rigorous Quality",
      subtitle: "Unwavering Excellence",
      description:
        "Our commitment to quality is unwavering, as every diamond undergoes rigorous inspections and quality checks to ensure unparalleled purity and brilliance.",
      image:
        "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=1600&auto=format&fit=crop",
      accent:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop&crop=center",
      accent2:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=800&fit=crop&crop=center",
    },
    {
      id: 5,
      title: "Seamless Access",
      subtitle: "Your Journey Begins",
      description:
        "From selection to delivery, we prioritize your experience with seamless access and personalized service, making your journey with us effortless and enjoyable.",
      image:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&auto=format&fit=crop",
      accent:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&crop=center",
      accent2:
        "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&h=800&fit=crop&crop=center",
    },
  ];

  // Use all content directly
  const allContent = contentData;
  const allTones = tones;

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.defaults({ markers: false });
      setTimeout(() => ScrollTrigger.refresh(), 200);

      const startFloat = (i) => {
        const el = accentRefs.current[i];
        if (!el) return;
        floatTweens.current[i]?.kill();
        floatTweens.current[i] = gsap.to(el, {
          y: "+=10",
          duration: 2.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      };

      const startFloat2 = (i) => {
        const el = accentRefs2.current[i];
        if (!el) return;
        floatTweens2.current[i]?.kill();
        floatTweens2.current[i] = gsap.to(el, {
          y: "-=8",
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      };

      const stopFloat = (i) => {
        floatTweens.current[i]?.kill();
        floatTweens.current[i] = null;
      };

      const stopFloat2 = (i) => {
        floatTweens2.current[i]?.kill();
        floatTweens2.current[i] = null;
      };

      const crossfadeTo = (i) => {
        setActiveIndex(i);
        gsap.to(".gallery-bg", {
          backgroundColor: allTones[i].bg,
          duration: 0.9,
          ease: "power2.inOut",
        });

        imageRefs.current.forEach((img, j) => {
          if (!img) return;
          if (j === i) {
            gsap.to(img, {
              opacity: 1,
              scale: 1,
              filter: "blur(0px) grayscale(100%)",
              duration: 1.2,
              ease: "power4.out",
            });
          } else {
            gsap.to(img, {
              opacity: 0,
              scale: 1.08,
              filter: "blur(8px) grayscale(100%)",
              duration: 1.2,
              ease: "power4.out",
            });
          }
        });

        accentRefs.current.forEach((acc, j) => {
          if (!acc) return;
          const rot = accentLayout[j]?.rotate || 0;
          if (j === i) {
            stopFloat(j);
            gsap.fromTo(
              acc,
              {
                opacity: 0,
                y: 46,
                scale: 0.88,
                rotate: rot - 8,
                filter: "blur(6px) grayscale(100%)",
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: rot,
                filter: "blur(0px) grayscale(100%)",
                duration: 1.1,
                delay: 0.16,
                ease: "power4.out",
                onComplete: () => startFloat(j),
              },
            );
          } else {
            stopFloat(j);
            gsap.to(acc, {
              opacity: 0,
              y: 24,
              scale: 0.9,
              rotate: rot - 4,
              filter: "blur(6px) grayscale(100%)",
              duration: 0.7,
              ease: "power3.out",
            });
          }
        });

        accentRefs2.current.forEach((acc, j) => {
          if (!acc) return;
          const rot = accentLayout2[j]?.rotate || 0;
          if (j === i) {
            stopFloat2(j);
            gsap.fromTo(
              acc,
              {
                opacity: 0,
                y: -36,
                scale: 0.88,
                rotate: rot + 8,
                filter: "blur(6px) grayscale(100%)",
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: rot,
                filter: "blur(0px) grayscale(100%)",
                duration: 1.1,
                delay: 0.3,
                ease: "power4.out",
                onComplete: () => startFloat2(j),
              },
            );
          } else {
            stopFloat2(j);
            gsap.to(acc, {
              opacity: 0,
              y: -20,
              scale: 0.9,
              rotate: rot + 4,
              filter: "blur(6px) grayscale(100%)",
              duration: 0.7,
              ease: "power3.out",
            });
          }
        });
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        gsap.set(imageRefs.current, {
          opacity: 0,
          scale: 1.08,
          filter: "blur(8px) grayscale(100%)",
        });
        if (imageRefs.current[0]) {
          gsap.set(imageRefs.current[0], {
            opacity: 1,
            scale: 1,
            filter: "blur(0px) grayscale(100%)",
          });
        }

        gsap.set(accentRefs.current, { opacity: 0, scale: 0.9 });
        if (accentRefs.current[0]) {
          gsap.set(accentRefs.current[0], {
            opacity: 1,
            scale: 1,
            rotate: accentLayout[0]?.rotate || 0,
          });
          startFloat(0);
        }

        gsap.set(accentRefs2.current, { opacity: 0, scale: 0.9 });
        if (accentRefs2.current[0]) {
          gsap.set(accentRefs2.current[0], {
            opacity: 1,
            scale: 1,
            rotate: accentLayout2[0]?.rotate || 0,
          });
          startFloat2(0);
        }

        blockRefs.current.forEach((block, i) => {
          if (!block) return;
          ScrollTrigger.create({
            trigger: block,
            start: "top 55%",
            end: "bottom 45%",
            onEnter: () => crossfadeTo(i),
            onEnterBack: () => crossfadeTo(i),
          });

          const items = block.querySelectorAll(".reveal-item");
          gsap.fromTo(
            items,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.07,
              scrollTrigger: {
                trigger: block,
                start: "top 78%",
                end: "top 40%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        ScrollTrigger.refresh();

        return () => {
          floatTweens.current.forEach((t) => t?.kill());
          floatTweens2.current.forEach((t) => t?.kill());
        };
      });

      mm.add("(max-width: 1023px)", () => {
        blockRefs.current.forEach((block, i) => {
          if (!block) return;
          ScrollTrigger.create({
            trigger: block,
            start: "top 55%",
            end: "bottom 45%",
            onEnter: () => {
              setActiveIndex(i);
              gsap.to(".gallery-bg", {
                backgroundColor: allTones[i]?.bg || "#FAF8F4",
                duration: 0.8,
                ease: "power2.inOut",
              });
            },
            onEnterBack: () => {
              setActiveIndex(i);
              gsap.to(".gallery-bg", {
                backgroundColor: allTones[i]?.bg || "#FAF8F4",
                duration: 0.8,
                ease: "power2.inOut",
              });
            },
          });

          const photo = block.querySelector(".mobile-photo");
          const accent = block.querySelector(".mobile-accent");
          const accent2 = block.querySelector(".mobile-accent2");
          const items = block.querySelectorAll(".reveal-item");

          if (photo) {
            gsap.fromTo(
              photo,
              { opacity: 0, y: 26, scale: 0.97, filter: "blur(6px)" },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: block,
                  start: "top 85%",
                  end: "top 55%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }

          if (accent) {
            gsap.fromTo(
              accent,
              { opacity: 0, y: 20, scale: 0.85, rotate: -6 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: -3,
                duration: 0.9,
                delay: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: block,
                  start: "top 82%",
                  end: "top 50%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }

          if (accent2) {
            gsap.fromTo(
              accent2,
              { opacity: 0, y: 20, scale: 0.85, rotate: 6 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 3,
                duration: 0.9,
                delay: 0.25,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: block,
                  start: "top 82%",
                  end: "top 50%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }

          gsap.fromTo(
            items,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.06,
              ease: "power3.out",
              scrollTrigger: {
                trigger: block,
                start: "top 82%",
                end: "top 50%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        ScrollTrigger.refresh();
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      floatTweens.current.forEach((t) => t?.kill());
      floatTweens2.current.forEach((t) => t?.kill());
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const scrollToBlock = (i) => {
    blockRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="gallery-wrapper " ref={containerRef}>
      <div
        className="gallery-bg min-h-screen "
        style={{ backgroundColor: allTones[0]?.bg || "#FAF8F4" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-16">
            <div className="order-2 lg:order-1">
              {allContent.map((data, index) => (
                <div
                  key={data.id}
                  ref={(el) => (blockRefs.current[index] = el)}
                  className={`content-block flex flex-col justify-center ${index === 0 ? "heroBlock" : ""}`}
                >
                  <span
                    className="reveal-item inline-flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase font-light mb-4 transition-colors duration-700"
                    style={{ color: allTones[index]?.sub || "rgba(20,19,17,0.55)" }}
                  >
                    <span
                      className="w-6 h-px transition-colors duration-700"
                      style={{ background: allTones[index]?.line || "rgba(20,19,17,0.25)" }}
                    />
                    {index === 0
                      ? "The Art of Diamond Manufacturing"
                      : `Chapter ${String(index).padStart(2, "0")}`}
                  </span>

                  <h2
                    className="reveal-item font-light leading-[1.05] transition-colors duration-700"
                    style={{ color: allTones[index]?.text || "#141311" }}
                  >
                    <span
                      className={
                        index === 0
                          ? "text-3xl md:text-5xl lg:text-7xl"
                          : "text-3xl md:text-5xl lg:text-6xl"
                      }
                    >
                      {data.title}
                    </span>
                    <br />
                    <span
                      className={`italic font-light ${index === 0 ? "text-3xl md:text-5xl lg:text-7xl" : "text-3xl md:text-5xl lg:text-6xl"}`}
                      style={{ color: allTones[index]?.sub || "rgba(20,19,17,0.55)" }}
                    >
                      {data.subtitle}
                    </span>
                  </h2>

                  <p
                    className="reveal-item text-sm md:text-base font-light mt-4 max-w-lg leading-relaxed transition-colors duration-700"
                    style={{ color: allTones[index]?.sub || "rgba(20,19,17,0.55)" }}
                  >
                    {data.description}
                  </p>

                  <div className="mobile-photo-duo lg:hidden mt-8 relative">
                    <div className="mobile-photo rounded-2xl overflow-hidden shadow-2xl h-[220px] relative">
                      <img
                        src={data.image}
                        alt={data.title}
                        className="w-full h-full object-cover"
                        style={{ filter: "grayscale(100%) contrast(1.05)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                    <div className="mobile-accent absolute -bottom-6 -right-4 w-24 h-24 rounded-lg overflow-hidden shadow-xl">
                      <img
                        src={data.accent}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ filter: "grayscale(100%) contrast(1.05)" }}
                      />
                    </div>
                    <div className="mobile-accent2 absolute -top-6 -left-4 w-20 h-20 rounded-lg overflow-hidden shadow-xl">
                      <img
                        src={data.accent2}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ filter: "grayscale(100%) contrast(1.05)" }}
                      />
                    </div>
                  </div>

                  <div className="reveal-item flex items-center gap-4 mt-10">
                    <span
                      className="w-12 h-px transition-colors duration-700"
                      style={{ background: allTones[index]?.line || "rgba(20,19,17,0.25)" }}
                    />
                    <span
                      className="text-[10px] tracking-[0.3em] uppercase font-light transition-colors duration-700"
                      style={{ color: allTones[index]?.sub || "rgba(20,19,17,0.55)" }}
                    >
                      {index === 0
                        ? "Scroll to explore"
                        : `${String(index + 1).padStart(2, "0")} / ${String(allContent.length).padStart(2, "0")}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-1 lg:order-2 hidden lg:block">
              <div className="sticky-stage">
                <div className="sticky-frame">
                  {allContent.map((data, index) => (
                    <div key={data.id} className="photo-duo">
                      <div
                        ref={(el) => (imageRefs.current[index] = el)}
                        className="stack-photo"
                      >
                        <img src={data.image} alt={data.title} />
                        <div className="stack-photo-veil" />
                      </div>

                      <div
                        ref={(el) => (accentRefs.current[index] = el)}
                        className="accent-photo"
                        style={{
                          top: accentLayout[index % accentLayout.length]?.top || "auto",
                          right: accentLayout[index % accentLayout.length]?.right || "auto",
                          bottom: accentLayout[index % accentLayout.length]?.bottom || "auto",
                          left: accentLayout[index % accentLayout.length]?.left || "auto",
                        }}
                      >
                        <img src={data.accent} alt="" />
                      </div>

                      <div
                        ref={(el) => (accentRefs2.current[index] = el)}
                        className="accent-photo-2"
                        style={{
                          top: accentLayout2[index % accentLayout2.length]?.top || "auto",
                          right: accentLayout2[index % accentLayout2.length]?.right || "auto",
                          bottom: accentLayout2[index % accentLayout2.length]?.bottom || "auto",
                          left: accentLayout2[index % accentLayout2.length]?.left || "auto",
                        }}
                      >
                        <img src={data.accent2} alt="" />
                      </div>
                    </div>
                  ))}

                  <div className="stack-caption">
                    <span className="stack-caption-index">
                      {String(activeIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="stack-caption-line" />
                    <span className="stack-caption-label">
                      {allContent[activeIndex]?.subtitle || "Discover"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .gallery-wrapper {
          position: relative;
          width: 100%;
          overflow: visible;
        }

        .gallery-bg {
          transition: background-color 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          scroll-behavior: auto !important;
        }

        .content-block {
          min-height: 100vh;
          padding: 3rem 0;
        }

        .heroBlock {
          min-height: 100vh;
        }

        .sticky-stage {
          height: 100%;
        }
        .sticky-frame {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .photo-duo {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 100%;
          max-width: 500px;
          height: 62vh;
          max-height: 560px;
        }

        .stack-photo {
          position: absolute;
          inset: 0;
          border-radius: 4px;
          overflow: hidden;
          will-change: transform, opacity, filter;
        }

        .stack-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .stack-photo-veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 55%,
            rgba(0, 0, 0, 0.35) 100%
          );
          pointer-events: none;
        }

        .accent-photo {
          position: absolute;
          width: 40%;
          aspect-ratio: 1 / 1;
          border-radius: 6px;
          overflow: hidden;
          border: 7px solid #f7f5f0;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
          z-index: 6;
          will-change: transform, opacity, filter;
        }

        .accent-photo-2 {
          position: absolute;
          width: 35%;
          aspect-ratio: 1 / 1;
          border-radius: 6px;
          overflow: hidden;
          border: 6px solid #f7f5f0;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
          z-index: 5;
          will-change: transform, opacity, filter;
        }

        .accent-photo img,
        .accent-photo-2 img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .stack-caption {
          position: absolute;
          left: 50%;
          bottom: 2rem;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.9rem;
          color: #ffffff;
          z-index: 8;
        }

        .stack-caption-index {
          font-family: Georgia, "Times New Roman", serif;
          font-style: italic;
          font-size: 0.85rem;
          opacity: 0.85;
        }

        .stack-caption-line {
          width: 28px;
          height: 1px;
          background: rgba(255, 255, 255, 0.5);
        }

        .stack-caption-label {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 300;
          opacity: 0.85;
        }

        .dot-nav {
          mix-blend-mode: difference;
        }
        .dot-nav span {
          color: #ffffff;
        }

        .mobile-accent {
          border: 5px solid #f7f5f0;
        }

        .mobile-accent2 {
          border: 4px solid #f7f5f0;
        }

        @media (max-width: 1023px) {
          .content-block {
            min-height: auto;
            padding: 2.5rem 0;
          }
        }
      `}</style>
    </div>
  );
}