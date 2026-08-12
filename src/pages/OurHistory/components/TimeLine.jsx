import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { FaGem, FaHistory, FaGlobe, FaAward, FaStar } from "react-icons/fa";
import { RiDiamondLine } from "react-icons/ri";
import { TbSparkles } from "react-icons/tb";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaDiamond } from "react-icons/fa6";
import diamondImg from "../../../assets/images/oh1.jpeg";
import historyImg from "../../../assets/images/oh2.jpg";
import legacyImg from "../../../assets/images/oh3.jpg";
import futureImg from "../../../assets/images/oh4.jpg";
import futureImg1 from "../../../assets/images/oh6.jpg";

gsap.registerPlugin(ScrollTrigger);

const HistoryPage = () => {
  const mainRef = useRef(null);
  const timelineRef = useRef(null);
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const bgRef = useRef(null);
  const galleryRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".bg-diamond").forEach((diamond, i) => {
        gsap.to(diamond, {
          y: -30 - Math.random() * 50,
          x: 15 - Math.random() * 30,
          rotation: 360,
          opacity: 0.18,
          duration: 7 + Math.random() * 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 1.2,
        });
      });

      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 0.6,
          },
        });
      }

      gsap.utils.toArray(".tl-row").forEach((row, i) => {
        const textCol = row.querySelector(".tl-text");
        const imgWrap = row.querySelector(".tl-img-wrap");
        const img = row.querySelector(".tl-img");
        const node = row.querySelector(".tl-node");
        const yearEl = row.querySelector(".tl-year");

        if (yearEl) {
          gsap.from(yearEl, {
            opacity: 0,
            scale: 0.5,
            rotation: i % 2 === 0 ? -25 : 25,
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: row,
              start: "top 82%",
              end: "top 40%",
              toggleActions: "play none none reverse",
            },
          });
        }

        if (textCol) {
          gsap.from(textCol, {
            opacity: 0,
            y: 80,
            x: i % 2 === 0 ? -40 : 40,
            skewY: i % 2 === 0 ? 4 : -4,
            duration: 1,
            ease: "power3.out",
            delay: 0.1,
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              end: "top 35%",
              toggleActions: "play none none reverse",
            },
          });
        }

        if (imgWrap) {
          gsap.from(imgWrap, {
            opacity: 0,
            scale: 0.6,
            rotation: i % 2 === 0 ? 12 : -12,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              end: "top 30%",
              toggleActions: "play none none reverse",
            },
          });
        }

        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.3, rotation: i % 2 === 0 ? -6 : 6, y: 40 },
            {
              scale: 1.05,
              rotation: 0,
              y: -40,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.4,
              },
            }
          );
        }

        if (node) {
          gsap.from(node, {
            scale: 0,
            rotation: 270,
            duration: 0.7,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: row,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });

      gsap.from(".timeline-line", {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1.5,
          id: "line-grow",
        },
        scaleY: 0,
        transformOrigin: "top center",
      });

      if (galleryRef.current) {
        gsap.utils.toArray(".gallery-piece").forEach((piece, i) => {
          gsap.from(piece, {
            opacity: 0,
            scale: 0.75,
            rotation: i % 2 === 0 ? -8 : 8,
            y: 100,
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: piece,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });

          gsap.to(piece, {
            y: i % 2 === 0 ? -35 : -60,
            ease: "none",
            scrollTrigger: {
              trigger: piece,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.6,
            },
          });
        });
      }
    }, mainRef);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      ctx.revert();
    };
  }, []);

  const timelineData = [
    {
      year: "1986",
      title: "The Beginning",
      description: "Royal Rays was founded in Antwerp's diamond district, starting as a family workshop with a passion for precision and excellence.",
      detail: "A single cutting bench, a small circle of trusted stone dealers, and a founder's promise: every diamond leaving the workshop would carry proof of honest craft.",
      tags: ["Antwerp Workshop", "Family Owned", "Est. 1986"],
      icon: <FaHistory className="w-5 h-5" />,
      image: historyImg,
    },
    {
      year: "1995",
      title: "Expansion & Growth",
      description: "Expanded operations across Europe, establishing ourselves as a trusted name in the diamond industry worldwide.",
      detail: "New ateliers opened in Amsterdam and Milan, and our sourcing network grew to cover three continents — all while keeping every stone traceable to its origin.",
      tags: ["European Network", "3 Ateliers", "Trusted Sourcing"],
      icon: <FaGlobe className="w-5 h-5" />,
      image: diamondImg,
    },
    {
      year: "2008",
      title: "Global Recognition",
      description: "Became a certified industry leader, gaining recognition for ethical sourcing and premium quality craftsmanship.",
      detail: "Independent certification bodies recognized our commitment to conflict-free sourcing, and our name began appearing alongside the industry's most respected houses.",
      tags: ["Certified Ethical", "Industry Awards", "Global Standard"],
      icon: <FaAward className="w-5 h-5" />,
      image: legacyImg,
    },
    {
      year: "2015",
      title: "Innovation in Cutting",
      description: "Introduced advanced technology, setting new standards for precision, brilliance, and diamond cutting excellence.",
      detail: "Laser-guided cutting and computer-mapped facets joined our master cutters' hands, pushing brilliance and symmetry beyond what tradition alone could achieve.",
      tags: ["Laser Precision", "Master Cutters", "Next-Gen Brilliance"],
      icon: <FaGem className="w-5 h-5" />,
      image: futureImg1,
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Embracing digital innovation to serve clients across five continents with seamless experiences.",
      detail: "From virtual stone consultations to real-time certification lookup, we rebuilt the client journey for a world that expects transparency at every click.",
      tags: ["5 Continents", "Virtual Consults", "Digital First"],
      icon: <FaDiamond className="w-5 h-5" />,
      image: futureImg,
    },
    {
      year: "2024",
      title: "The Future of Diamonds",
      description: "Pioneering new frontiers in diamond craftsmanship and personal expression in fine jewellery.",
      detail: "Today we blend heritage technique with bold, personal design — building pieces meant to be worn as a statement, not just a possession.",
      tags: ["Bespoke Design", "Heritage Craft", "What's Next"],
      icon: <RiDiamondLine className="w-5 h-5" />,
      image: historyImg,
    },
  ];

  const galleryImages = [diamondImg, historyImg, legacyImg, futureImg1, futureImg];

  return (
    <>
      <Helmet>
        <title>Our Legacy — Royal Rays BV</title>
        <meta
          name="description"
          content="Discover the rich legacy of Royal Rays BV — over 40 years of excellence in diamond craftsmanship, innovation, and heritage in Antwerp."
        />
        <meta
          name="keywords"
          content="Royal Rays history, diamond heritage, Antwerp diamonds, diamond craftsmanship, legacy of excellence"
        />
        <meta property="og:title" content="Our Legacy — Royal Rays BV" />
        <meta
          property="og:description"
          content="Explore the journey of Royal Rays BV — from humble beginnings to becoming a global leader in the diamond industry."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://royalraysbv.com/our-history" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Legacy — Royal Rays BV" />
        <meta
          name="twitter:description"
          content="Discover the rich legacy of Royal Rays BV — over 40 years of excellence in diamond craftsmanship."
        />
        <link rel="canonical" href="https://royalraysbv.com/our-history" />
      </Helmet>

      <div ref={mainRef} className="bg-white text-black overflow-x-hidden relative" data-header-transparent="false" data-header-hero-end="true">
        <div ref={bgRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="bg-diamond absolute text-black/5"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${20 + Math.random() * 50}px`,
                opacity: 0.08,
              }}
            >
              <RiDiamondLine />
            </div>
          ))}
          {[...Array(10)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="bg-diamond absolute text-black/5"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${10 + Math.random() * 25}px`,
                opacity: 0.1,
              }}
            >
              <FaStar />
            </div>
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="bg-diamond absolute text-black/5"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${8 + Math.random() * 18}px`,
                opacity: 0.08,
              }}
            >
              <TbSparkles />
            </div>
          ))}
        </div>

        <section ref={pinRef} className="relative bg-white z-10">
          <div ref={containerRef} className="relative">
            <div ref={timelineRef} className="max-w-[1500px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
              <div className="relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-black/5 hidden md:block" />
                <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-black/40 via-black/20 to-black/40 origin-top hidden md:block" />
                <div
                  ref={progressRef}
                  className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 bg-black origin-top scale-y-0 hidden md:block rounded-full"
                />

                {timelineData.map((item, index) => (
                  <div key={index} className="tl-row relative mb-24 md:mb-40 last:mb-0">
                    <div className="tl-node hidden md:flex absolute top-10 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-4 border-white shadow-md items-center justify-center z-20" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                      <div
                        className={`tl-text ${
                          index % 2 === 0 ? "md:order-1" : "md:order-2"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-black/10 text-black/50">
                            {item.icon}
                          </span>
                          <span className="text-xs tracking-[0.2em] uppercase text-black/30 font-light">
                            {item.title}
                          </span>
                        </div>
                        <div className="tl-year text-6xl sm:text-7xl md:text-8xl font-extralight text-black/10 leading-none select-none mb-2">
                          {item.year}
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-light text-black/85 mb-4 -mt-6 md:-mt-8 relative z-10">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-black/45 font-light leading-relaxed max-w-md mb-4">
                          {item.description}
                        </p>
                        <p className="text-sm text-black/30 font-light leading-relaxed max-w-md mb-5">
                          {item.detail}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, ti) => (
                            <span
                              key={ti}
                              className="text-[11px] tracking-wide uppercase font-light px-3 py-1.5 rounded-full border border-black/10 text-black/40 bg-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div
                        className={`tl-img-wrap relative overflow-hidden rounded-[2rem] ${
                          index % 2 === 0 ? "md:order-2" : "md:order-1"
                        }`}
                      >
                        <div className="relative h-64 sm:h-80 md:h-[28rem] overflow-hidden rounded-[2rem]">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="tl-img absolute inset-0 w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section ref={galleryRef} className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-black/5 bg-white z-10 overflow-hidden">
          <div className="max-w-6xl mx-auto text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full border border-black/10 bg-white/80 text-black/40 text-[10px] tracking-[0.15em] uppercase mb-4 font-light">
              In Craftsmanship
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-black/90">
              Every Facet Tells a Story
            </h2>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className={`gallery-piece relative overflow-hidden rounded-[1.5rem] ${
                  i % 2 === 0 ? "md:mt-10" : "md:-mt-10"
                } ${i === 2 ? "col-span-2 md:col-span-1" : ""}`}
              >
                <img
                  src={img}
                  alt={`Royal Rays craftsmanship ${i + 1}`}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover grayscale-[10%] hover:grayscale-0 hover:scale-110 transition-all duration-700"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default HistoryPage;