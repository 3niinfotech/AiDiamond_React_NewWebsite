// LeadershipSection.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dharmeshImg from '../../../assets/images/dharmeshbhai.jpeg';

gsap.registerPlugin(ScrollTrigger);

const LeadershipSection = ({ headerTransparent = false }) => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const imageWrapRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const directorRef = useRef(null);
  const quoteRef = useRef(null);
  const lineRef = useRef(null);
  const pillarsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Eyebrow animation
      if (eyebrowRef.current) {
        gsap.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: eyebrowRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Heading staggered character reveal
      const headingChars = headingRef.current?.querySelectorAll('.ls-char');
      if (headingChars && headingChars.length > 0) {
        gsap.fromTo(
          headingChars,
          { opacity: 0, y: 35, rotateX: -30 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.025,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. Paragraph description reveal
      if (descriptionRef.current) {
        gsap.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: descriptionRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 4. Director info card reveal
      if (directorRef.current) {
        gsap.fromTo(
          directorRef.current,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: directorRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 5. Divider line scale animation
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: lineRef.current,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 6. Quote badge reveal animation
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { opacity: 0, y: 20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 7. Image card smooth fade & scale reveal
      if (imageWrapRef.current) {
        gsap.fromTo(
          imageWrapRef.current,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageWrapRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 8. Pillars grid staggered animation
      const pillarCards = pillarsRef.current?.querySelectorAll('.ls-pillar-card');
      if (pillarCards && pillarCards.length > 0) {
        gsap.fromTo(
          pillarCards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split heading into characters for animation, while keeping word-level
  // wrapping so long lines don’t overflow on mobile.
  const splitHeading = (text) => {
    return text.split(/(\s+)/).map((segment, i) => {
      if (/^\s+$/.test(segment)) {
        return (
          <span key={i} className="ls-word-space">
            {' '}
          </span>
        );
      }

      return (
        <span key={i} className="ls-word">
          {segment.split('').map((char, j) => (
            <span key={j} className="ls-char-wrap">
              <span className="ls-char">{char}</span>
            </span>
          ))}
        </span>
      );
    });
  };

  return (
    <section
      ref={sectionRef}
      data-header-transparent={headerTransparent ? "true" : "false"}
      className="leadership-section-root"
    >
      <div className="ls-container" ref={containerRef}>
        <div className="ls-grid">
          
          {/* Left Side: Content Block */}
          <div className="ls-content-col">
            
            {/* Eyebrow Tag */}
            <div ref={eyebrowRef} className="ls-eyebrow-wrap">
              <span className="ls-dot" />
              <span className="ls-eyebrow-text">LEADERSHIP & VISION</span>
            </div>

            {/* Main Animated Heading */}
            <h2 ref={headingRef} className="ls-main-heading">
              <span className="ls-heading-line">
                {splitHeading('Guided by Experience.')}
              </span>
              <span className="ls-heading-line ls-heading-sub font-bold">
                {splitHeading('Driven by Excellence.')}
              </span>
            </h2>

            {/* Description Text */}
            <p ref={descriptionRef} className="ls-description">
              At Royal Rays BV, Dharmesh Moradia leads operations by integrating 
              state-of-the-art modern technology with generations of artisan diamond techniques, 
              ensuring sustainable practices and uncompromised top-quality production.
            </p>

            {/* Director Details & Badge */}
            <div ref={directorRef} className="ls-director-box">
              <div className="ls-director-info">
                <h3 className="ls-director-name">DHARMESH MORADIA</h3>
                <p className="ls-director-title">OPERATIONS DIRECTOR · ROYAL RAYS BV</p>
              </div>
              <span className="ls-badge">OPERATIONS LEAD</span>
            </div>

            {/* Animated Monochrome Accent Line */}
            <div ref={lineRef} className="ls-accent-line" />

          </div>

          {/* Right Side: Portrait Image + Ultra Luxury Floating Glass Badge at Bottom Right */}
          <div className="ls-image-col">
            <div ref={imageWrapRef} className="ls-img-frame">
              <img
                src={dharmeshImg}
                alt="Dharmesh Moradia - Operations Director"
                className="ls-portrait-img"
              />

              {/* Gradient overlay at bottom of image for depth */}
              <div className="ls-img-bottom-gradient" />

              {/* Ultra Luxury Floating Glass Quote Badge at Bottom Right of Image */}
              <div ref={quoteRef} className="ls-img-quote-badge">
                <p className="ls-badge-quote-text">
                  “Dharmesh integrates modern technology with artisan techniques, 
                  ensuring sustainable and top-quality production.”
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Strictly Scoped Styles - Pure White BG, Glassmorphism Badge Over Image Bottom Right */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

        .leadership-section-root * {
          box-sizing: border-box;
        }

        .leadership-section-root {
          width: 100%;
          max-width: 100%;
          position: relative;
          z-index: 5;
          background: #FFFFFF;
          color: #1A1A1A;
          font-family: 'Inter', sans-serif;
          padding: clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 1.5rem) clamp(3.5rem, 7vw, 6rem);
          overflow: hidden;
          isolation: isolate;
          transform: none;
        }

        .leadership-section-root .ls-container {
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
        }

        .leadership-section-root .ls-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 5vw, 3.5rem);
          align-items: flex-start;
        }

        @media (min-width: 1024px) {
          .leadership-section-root .ls-grid {
            grid-template-columns: 1.15fr 0.85fr;
            gap: 4.5rem;
          }
        }

        /* Eyebrow */
        .leadership-section-root .ls-eyebrow-wrap {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.2rem;
          max-width: 100%;
        }

        .leadership-section-root .ls-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #1A1A1A;
          display: inline-block;
          flex-shrink: 0;
        }

        .leadership-section-root .ls-eyebrow-text {
          font-size: clamp(0.62rem, 2.2vw, 0.75rem);
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #666666;
          text-transform: uppercase;
        }

        @media (min-width: 480px) {
          .leadership-section-root .ls-eyebrow-text {
            letter-spacing: 0.28em;
          }
        }

        /* Main Heading */
        .leadership-section-root .ls-main-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.85rem, 8.2vw, 4.2rem);
          font-weight: 300;
          line-height: 1.12;
          color: #1A1A1A;
          margin: 0 0 1.5rem;
          letter-spacing: -0.01em;
          max-width: 100%;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }

        .leadership-section-root .ls-heading-line {
          display: block;
          max-width: 100%;
        }

        .leadership-section-root .ls-heading-sub {
          color: #1A1A1A;
        }

        .leadership-section-root .ls-word {
          display: inline-block;
          white-space: nowrap;
        }

        .leadership-section-root .ls-word-space {
          display: inline;
        }

        .leadership-section-root .ls-char-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }

        .leadership-section-root .ls-char {
          display: inline-block;
          will-change: transform, opacity;
        }

        /* Description */
        .leadership-section-root .ls-description {
          font-size: clamp(0.92rem, 2.8vw, 1.1rem);
          line-height: 1.7;
          color: #4A4A4A;
          font-weight: 300;
          max-width: 580px;
          width: 100%;
          margin: 0 0 1.75rem;
        }

        /* Director Box */
        .leadership-section-root .ls-director-box {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.85rem;
          padding: 1rem 0;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          width: 100%;
        }

        @media (min-width: 640px) {
          .leadership-section-root .ls-director-box {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
          }
        }

        .leadership-section-root .ls-director-info {
          min-width: 0;
          flex: 1;
        }

        .leadership-section-root .ls-director-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.25rem, 4.5vw, 1.6rem);
          font-weight: 600;
          color: #1A1A1A;
          margin: 0;
          letter-spacing: 0.03em;
          word-break: break-word;
        }

        .leadership-section-root .ls-director-title {
          font-size: clamp(0.58rem, 2vw, 0.7rem);
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #777777;
          text-transform: uppercase;
          margin: 0.2rem 0 0;
          line-height: 1.45;
        }

        @media (min-width: 480px) {
          .leadership-section-root .ls-director-title {
            letter-spacing: 0.18em;
          }
        }

        .leadership-section-root .ls-badge {
          background: rgba(0, 0, 0, 0.05);
          color: #1A1A1A;
          border: 1px solid rgba(0, 0, 0, 0.15);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 0.4rem 0.75rem;
          border-radius: 20px;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Accent Line */
        .leadership-section-root .ls-accent-line {
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, #1A1A1A 0%, transparent 100%);
          margin: 1.2rem 0 0;
          transform-origin: left;
        }

        /* Right Side: Image Frame & Glassmorphism Quote Badge Overlay */
        .leadership-section-root .ls-image-col {
          width: 100%;
          max-width: min(400px, 100%);
          margin: 0 auto;
        }

        @media (min-width: 1024px) {
          .leadership-section-root .ls-image-col {
            margin-left: auto;
            margin-right: 0;
          }
        }

        .leadership-section-root .ls-img-frame {
          position: relative;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.09);
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .leadership-section-root .ls-portrait-img {
          width: 100%;
          height: clamp(320px, 72vw, 500px);
          display: block;
          object-fit: cover;
          object-position: center top;
        }

        /* Bottom Depth Gradient Overlay */
        .leadership-section-root .ls-img-bottom-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 45%, rgba(0, 0, 0, 0.45) 100%);
          pointer-events: none;
          z-index: 2;
        }

        /* Luxury Glassmorphism Floating Quote Badge Over Bottom Right of Image */
        .leadership-section-root .ls-img-quote-badge {
          position: absolute;
          bottom: clamp(0.7rem, 2.5vw, 1.2rem);
          right: clamp(0.7rem, 2.5vw, 1.2rem);
          left: clamp(0.7rem, 3vw, 1.8rem);
          z-index: 5;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          padding: clamp(0.65rem, 2vw, 0.9rem) clamp(0.75rem, 2.2vw, 1.1rem);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          max-width: calc(100% - 1.4rem);
        }

        .leadership-section-root .ls-quote-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          line-height: 0.7;
          color: #1A1A1A;
          opacity: 0.35;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .leadership-section-root .ls-badge-quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.8rem, 2.6vw, 0.94rem);
          font-style: italic;
          line-height: 1.45;
          color: #1A1A1A;
          font-weight: 500;
          margin: 0;
        }

        /* Pillars Grid */
        .leadership-section-root .ls-pillars-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-top: 5rem;
          padding-top: 4rem;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        @media (min-width: 768px) {
          .leadership-section-root .ls-pillars-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
        }

        .leadership-section-root .ls-pillar-card {
          background: #FAFAFA;
          padding: 2.2rem 1.8rem;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.02);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .leadership-section-root .ls-pillar-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
          border-color: rgba(0, 0, 0, 0.15);
        }

        .leadership-section-root .ls-pillar-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 0.6rem;
        }

        .leadership-section-root .ls-pillar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0 0 0.6rem;
        }

        .leadership-section-root .ls-pillar-desc {
          font-size: 0.88rem;
          line-height: 1.6;
          color: #666666;
          margin: 0;
          font-weight: 300;
        }

        @media (max-width: 480px) {
          .leadership-section-root .ls-main-heading {
            margin-bottom: 1.15rem;
          }

          .leadership-section-root .ls-description {
            margin-bottom: 1.35rem;
          }

          .leadership-section-root .ls-portrait-img {
            height: min(68vw, 380px);
            min-height: 280px;
          }
        }
      `}</style>
    </section>
  );
};

export default LeadershipSection;