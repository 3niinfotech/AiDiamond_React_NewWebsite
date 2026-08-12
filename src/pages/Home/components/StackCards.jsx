// StackCards.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import GalleryScroll from "./GalleryScroll";
import imgexport from "../../../assets/images/export.png"

gsap.registerPlugin(ScrollTrigger);

export default function StackCards() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const swiperRef = useRef(null);
  const progressFillRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    "GIA Certified Diamonds",
    "Conflict-Free Sourcing",
    "Lifetime Warranty",
    "Complimentary Insurance",
    "Free Resizing",
    "Personalized Engraving",
  ];

  const stats = [
    {
      value: "35+",
      label: "Years Craft",
      description: "Antwerp manufacturing legacy",
    },
    {
      value: "50+",
      label: "Countries",
      description: "Export partners worldwide",
    },
    {
      value: "99.9%",
      label: "Pure Brilliance",
      description: "Flawless clarity guaranteed",
    },
    { value: "100+", label: "Years Legacy", description: "Since 1924" },
  ];

  const backgroundImages = [
    "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1920&auto=format&fit=crop",
  ];

  const groupData = [
    {
      id: 0,
      eyebrow: "Haute Joaillerie · Master Craftsmanship",
      title: "Where Art",
      italic: "Meets Precision",
      desc: "Each diamond undergoes a meticulous journey — from rough stone to polished brilliance. Our master artisans combine centuries-old techniques with modern innovation, ensuring every facet reflects light with unparalleled radiance.",
      stats: [
        {
          value: "120+",
          label: "Master Artisans",
          desc: "Generations of expertise",
        },
        {
          value: "95%",
          label: "Precision Rate",
          desc: "Meticulous quality control",
        },
      ],
      tags: ["GIA Certified", "IGI Certified", "Ethically Sourced"],
    },
    {
      id: 1,
      eyebrow: "Exceptional Quality · Unmatched Brilliance",
      title: "Every Diamond",
      italic: "Tells a Story",
      desc: "From the earth's depths to the world's most prestigious collections, each Royal Rays diamond carries a unique narrative. Our commitment to excellence ensures every stone becomes a timeless heirloom.",
      stats: [
        { value: "10K+", label: "Happy Clients", desc: "Worldwide trust" },
        { value: "50+", label: "Countries", desc: "Global presence" },
      ],
      tags: ["Conflict-Free", "Traceable", "Lifetime Warranty"],
    },
    {
      id: 2,
      eyebrow: "Perfection in Every Facet",
      title: "Timeless",
      italic: "Elegance",
      desc: "Royal Rays diamonds are crafted to transcend generations. Each piece is meticulously designed to capture the essence of luxury, combining traditional artistry with contemporary sophistication.",
      stats: [
        { value: "40+", label: "Design Awards", desc: "Industry recognition" },
        { value: "100%", label: "Satisfaction", desc: "Client commitment" },
      ],
      tags: ["Custom Designs", "Heirloom Quality", "Investment Grade"],
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progressFillRef.current) {
          progressFillRef.current.style.height = `${progress * 100}%`;
        }

        let newIndex = 0;
        if (progress > 0.66) newIndex = 2;
        else if (progress > 0.33) newIndex = 1;

        const swiper = swiperRef.current;
        if (swiper && newIndex !== swiper.activeIndex) {
          swiper.slideTo(newIndex, 600);
        }
      },
    });

    return () => trigger.kill();
  }, []);


  useEffect(() => {
    const ctx = gsap.context(() => {
      const images = gsap.utils.toArray(".stack-image");
      const contents = gsap.utils.toArray(".stack-content");
      const bgImages = gsap.utils.toArray(".bg-image-animate");

      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        /*
         * MOBILE ONLY
         * Do not hide images initially.
         * Each image reveals naturally when it enters viewport.
         */

        images.forEach((img) => {
          gsap.fromTo(
            img,
            {
              opacity: 0.01,
              y: 50,
              scale: 0.97,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: img,
                start: "top 92%",
                end: "top 65%",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        contents.forEach((content) => {
          gsap.fromTo(
            content,
            {
              opacity: 0.01,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: content,
                start: "top 92%",
                end: "top 70%",
                scrub: 0.4,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        ScrollTrigger.refresh();

        return;
      }

      /*
       * DESKTOP
       * Original animation — unchanged.
       */

      bgImages.forEach((bg) => {
        gsap.fromTo(
          bg,
          { scale: 1.1, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            duration: 2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bg,
              start: "top bottom",
              end: "top center",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      images.forEach((img, i) => {
        gsap.fromTo(
          img,
          {
            opacity: 0,
            scale: 0.7,
            y: 80,
            rotation: i % 2 === 0 ? -5 : 5,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotation: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: img,
              start: "top bottom-=10%",
              end: "top center",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      contents.forEach((content) => {
        gsap.fromTo(
          content,
          {
            opacity: 0,
            y: 40,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: content,
              start: "top bottom-=5%",
              end: "top center",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);


  return (
    <div className="overflow-visible w-full" ref={containerRef}>
      <main className="bg-[#FAF9F6] overflow-visible w-full">
        <section className="w-full bg-[#FAF9F6] py-5 md:py-10 overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-2 max-w-[1400px] mx-auto px-4 md:px-6 gap-8 lg:gap-12 overflow-visible">
            <div className="lg:sticky lg:top-0 lg:h-screen flex items-center justify-center py-10 lg:py-0">
              <div className="text-center lg:text-left max-w-md md:max-w-lg mx-auto lg:mx-0 px-1">
                <span className="inline-block text-[10px] md:text-[11px] tracking-[0.35em] md:tracking-[0.4em] uppercase text-[#2D2D2D]/45 font-light border-b border-[#E6E6E6] pb-2 mb-5 md:mb-6 stack-content">
                  Antwerp · Natural Fancy Cuts
                </span>
                <h2 className="font-serif text-[2.35rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-[3.75rem] text-[#111111]">
                  Cut for light.
                  <br />
                  <span className="italic font-light text-[#2D2D2D]/65">
                    Built for legacy.
                  </span>
                </h2>
                <p className="text-[#2D2D2D]/55 text-[14px] sm:text-[15px] md:text-base font-light mt-4 md:mt-5 leading-relaxed stack-content max-w-md mx-auto lg:mx-0">
                  Royal Rays selects, cuts, and polishes natural fancy diamonds
                  in Antwerp — certified, conflict-free stones shaped for
                  jewellers who expect precision in every facet.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 mt-5 md:mt-6 stack-content">
                  <span className="w-10 md:w-12 h-px bg-[#111111]" />
                  <span className="text-[10px] tracking-[0.28em] uppercase text-[#2D2D2D]/35 font-light">
                    From rough to export
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-10 max-w-sm mx-auto lg:mx-0">
                  {stats.slice(0, 2).map((stat, i) => (
                    <div key={i} className="text-center lg:text-left">
                      <div className="font-serif text-2xl md:text-3xl text-[#111111] tabular-nums">
                        {stat.value}
                      </div>
                      <div className="text-[9px] md:text-[10px] tracking-[0.18em] uppercase text-[#2D2D2D]/45 font-light mt-1">
                        {stat.label}
                      </div>
                      <div className="text-[11px] text-[#2D2D2D]/35 font-light mt-1 leading-snug">
                        {stat.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 overflow-visible">
              {[
                "https://t4.ftcdn.net/jpg/19/99/48/19/360_F_1999481935_izxhWiypdIbpbnRN3TOPAhFg5IFlXkAF.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT97t6OjYZfVg9_aCOAnYwwS50kcoddK1WZkBFvJ3wMLQ&s=10",
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop&crop=center",
                "https://t4.ftcdn.net/jpg/19/99/48/19/360_F_1999481935_izxhWiypdIbpbnRN3TOPAhFg5IFlXkAF.jpg",
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop&crop=center",
                "https://t4.ftcdn.net/jpg/19/99/48/19/360_F_1999481935_izxhWiypdIbpbnRN3TOPAhFg5IFlXkAF.jpg",
                "https://t4.ftcdn.net/jpg/19/99/48/19/360_F_1999481935_izxhWiypdIbpbnRN3TOPAhFg5IFlXkAF.jpg",
                "https://t4.ftcdn.net/jpg/19/99/48/19/360_F_1999481935_izxhWiypdIbpbnRN3TOPAhFg5IFlXkAF.jpg",
              ].map((src, i) => (
                <figure key={i} className="overflow-visible relative group">
                  <img
                    src={src}
                    alt={`Diamond ${i + 1}`}
                    className="stack-image w-full h-[200px] md:h-[250px] lg:h-[300px] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <div className="wrapper bg-[#FAF9F6] overflow-visible">
          <section className="hidden md:grid relative h-[100vh] w-full place-content-center sticky top-0 overflow-hidden">
            <img
              src={imgexport}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[length:50px_50px]" />

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
          </section>

          <section className="sticky top-0 overflow-visible">
            <GalleryScroll />
          </section>
        </div>
      </main>
    </div>
  );
}
