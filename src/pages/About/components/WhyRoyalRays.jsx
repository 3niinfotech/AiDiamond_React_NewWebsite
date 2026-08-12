// WhyRoyalRays.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WhyRoyalRays = ({ headerTransparent = false }) => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the clip-path shape
      const path = pathRef.current;

      // Initial and final path shapes - elegant organic flow
      const startPath = "M 0 0 L 500 0 C 500 599.6 500 677.1 500 750 L 0 750 C 0 205 0 105 0 0 Z";
      const endPath = "M 0 0 L 500 0 C 331 608 485 551 500 750 L 0 750 C 120 281 7 296 0 0 Z";

      // Set initial path
      path.setAttribute('d', startPath);

      // Create scroll-driven path morphing animation
      gsap.to(path, {
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1,
        },
        attr: { d: endPath }
      });

      // Animate text reveal
      const textElements = textRef.current.querySelectorAll('.reveal-text');
      gsap.fromTo(
        textElements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Subtle float animation for image card
      gsap.to(imageRef.current, {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-header-transparent={headerTransparent ? "true" : "false"}
      className="why-royal-rays-section py-20 px-6 md:px-12 lg:px-20 overflow-hidden relative z-[5]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">



          {/* Right - Text Content */}
          <div
            ref={textRef}
            className="text-content space-y-6 lg:space-y-8"
          >
            <div className="space-y-3">
              <span className="reveal-text text-xs tracking-[0.3em] text-[#1a1a1a]/60 uppercase font-semibold">
                Our identity
              </span>
              <h2 className="reveal-text text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light leading-[1.1] text-[#1a1a1a]">
                A family atelier
                <br />
                <span className="font-bold text-[#1a1a1a]">in the diamond capital</span>
              </h2>
            </div>

            <p className="reveal-text text-base md:text-lg text-[#1a1a1a]/75 leading-relaxed max-w-lg">
              From rough selection to export-ready polish, Royal Rays BV works
              as a focused manufacturing house — not a marketplace brand — for
              jewellers who need consistent fancy cuts.
            </p>

            <div className="space-y-3 text-[#1a1a1a]/65">
              <p className="reveal-text text-sm md:text-base leading-relaxed">
                Every stone is guided by Antwerp discipline: ethical origin,
                certified grading, and proportions that protect brilliance for
                the long term.
              </p>
            </div>

            {/* Legacy highlight */}
            <div className="reveal-text pt-4 border-t border-[#1a1a1a]/10">
              <h3 className="text-lg md:text-xl font-serif font-medium text-[#1a1a1a] tracking-wide">
                Built for partners
              </h3>
              <p className="text-sm text-[#1a1a1a]/55 leading-relaxed mt-2 max-w-md">
                Clear communication, reliable delivery, and stones chosen to
                perform in finished jewellery — season after season.
              </p>
            </div>

          </div>
          {/* Left - Image with animated clip-path */}
          <div
            ref={imageRef}
            className="image-container relative w-full max-w-2xl mx-auto lg:mx-0"
          >
            <svg
              className="image-clip w-full h-auto"
              width="500"
              height="750"
              viewBox="0 0 500 750"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <clipPath id="shape-why-royal-rays">
                  <path
                    ref={pathRef}
                    className="path-anim"
                    d="M 0 0 L 500 0 C 500 599.6 500 677.1 500 750 L 0 750 C 0 205 0 105 0 0 Z"
                  />
                </clipPath>
              </defs>
              <image
                clipPath="url(#shape-why-royal-rays)"
                href="https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&h=1200&fit=crop&crop=center"
                x="0"
                y="0"
                width="500"
                height="750"
                className="object-cover"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
    .why-royal-rays-section {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #faf8f5;
    }
    .font-serif {
      font-family: 'Playfair Display', scotch-display, serif;
    }
    .image-clip {
      display: block;
      max-width: 100%;
      height: auto;
    }
    .image-clip image {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
    .reveal-text {
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
    }
    .path-anim {
      transition: none;
    }
    @media (max-width: 1024px) {
      .image-container {
        max-width: 400px;
      }
    }
    @media (max-width: 640px) {
      .image-container {
        max-width: 300px;
      }
      .text-content {
        text-align: center;
      }
      .text-content p {
        margin-left: auto;
        margin-right: auto;
      }
      .grid-cols-3 {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
      }
      .text-content .max-w-md {
        margin-left: auto;
        margin-right: auto;
      }
    }
  `}</style>
    </section>
  );
};

export default WhyRoyalRays;