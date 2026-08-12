import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- Import Images ---
import section1 from "../../../assets/images/6.webp";
import section2 from "../../../assets/images/7.webp";
import section3 from "../../../assets/images/8.webp";
import section4 from "../../../assets/images/Vintage Cushion-Cut.png";
import section5 from "../../../assets/images/10.webp";
import section6 from "../../../assets/images/11.webp";
import section7 from "../../../assets/images/12.webp";
import section8 from "../../../assets/images/13.webp";

const items = [
  {
    title: 'Round Brilliant',
    img: section1,
    caption: 'The world\'s most celebrated diamond cut, engineered with precision to deliver extraordinary fire, brilliance, and timeless elegance in every direction.',
    description: 'ENGINEERED FOR MAXIMUM LIGHT PERFORMANCE AND FIRE WITH 57 MATHEMATICALLY CALCULATED FACETS THAT REFLECT LIGHT WITH UNMATCHED SCINTILLATION AND CLARITY.',
    leftText: 'PRECISION CUT • 57 FACETS • MAXIMUM BRILLIANCE',
  },
  {
    title: 'Princess Cut',
    img: section2,
    caption: 'A contemporary square masterpiece featuring crisp corners and exceptional brilliance, admired for its bold geometry and modern sophistication.',
    description: 'A CONTEMPORARY SQUARE SILHOUETTE COMBINING THE ELEGANCE OF GEOMETRIC CORNERS WITH INTENSE BRILLIANCE AND MODERN ARCHITECTURAL FLAIR.',
    leftText: 'SQUARE PROFILE • 76 FACETS • MODERN GEOMETRY',
  },
  {
    title: 'Emerald Cut',
    img: section3,
    caption: 'Known for its elegant step-cut facets, this refined shape showcases exceptional clarity with a mesmerizing hall-of-mirrors effect.',
    description: 'REFINED SOPHISTICATION HIGHLIGHTING CLARITY THROUGH LONG RECTANGULAR STEP CUT FACETS THAT CREATE AN ICONIC HALL-OF-MIRRORS OPTICAL EFFECT.',
    leftText: 'STEP CUT • 50 FACETS • HALL OF MIRRORS',
  },
  {
    title: 'Cushion Cut',
    img: section4,
    caption: 'A timeless pillow-shaped diamond blending vintage romance with modern brilliance through softly rounded corners and luminous facets.',
    description: 'VINTAGE-INSPIRED PILLOW SILHOUETTE FEATURING SOFTLY ROUNDED CORNERS AND DEEP FACETS THAT CAST CAPTIVATING LUXURIOUS SPARKLE.',
    leftText: 'PILLOW SHAPE • 58 FACETS • VINTAGE HERITAGE',
  },
  {
    title: 'Radiant Cut',
    img: section5,
    caption: 'An energetic fusion of elegant lines and brilliant faceting, offering remarkable sparkle with a sophisticated rectangular profile.',
    description: 'HYBRID MASTERPIECE MERGING THE BOLD RECTANGULAR OUTLINE OF AN EMERALD CUT WITH THE VIBRANT HIGH-FACET BRILLIANCE OF A ROUND DIAMOND.',
    leftText: 'HYBRID CUT • 70 FACETS • HIGH SCINTILLATION',
  },
  {
    title: 'Oval Cut',
    img: section6,
    caption: 'A graceful elongated silhouette that enhances visual size while delivering exceptional brilliance and refined contemporary beauty.',
    description: 'AN ELONGATED ELLIPTICAL OUTLINE THAT CAPTURES SUPREME BRILLIANCE WHILE ACCENTUATING LENGTH AND DYNAMIC SLENDER ELEGANCE.',
    leftText: 'ELLIPTICAL FORM • 58 FACETS • ELONGATED PROFILE',
  },
  {
    title: 'Pear Cut',
    img: section7,
    caption: 'A distinctive teardrop design combining graceful curves with brilliant sparkle, symbolizing elegance, individuality, and timeless luxury.',
    description: 'GRACEFUL TEARDROP SILHOUETTE UNITING THE SCINTILLATION OF A ROUND BRILLIANT WITH THE DISTINCTIVE SYMMETRY OF A MARQUISE.',
    leftText: 'TEARDROP SHAPE • 58 FACETS • ROYAL ELEGANCE',
  },
  {
    title: 'Marquise Cut',
    img: section8,
    caption: 'An elongated royal silhouette with pointed ends, designed to maximize visual size while creating a dramatic and elegant appearance.',
    description: 'REGAL BOAT-SHAPED OUTLINE FEATURING DRAMATIC POINTED ENDS TO MAXIMIZE CARAT SURFACE AREA AND ILLUMINATE GRAND ELEGANCE.',
    leftText: 'NAVIETTE FORM • 56 FACETS • MAXIMUM SURFACE',
  },
];

function preloadImages(urls) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        })
    )
  );
}

export default function DiamondCollection() {
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  const rootRef = useRef(null);
  const overlayInnerRef = useRef(null);
  const backCtrlRef = useRef(null);
  const gridRef = useRef(null);

  const contentImgWrapRefs = useRef([]);
  const contentImgRefs = useRef([]);
  const contentTitleInnerRefs = useRef([]);

  const previewElRefs = useRef([]);
  const previewImgRefs = useRef([]);
  const previewImgWrapRefs = useRef([]);
  const previewTitleRefs = useRef([]);
  const previewDescRefs = useRef([]);
  const previewLeftTextRefs = useRef([]);

  const isAnimatingRef = useRef(false);
  const currentRef = useRef(-1);

  // Load images and init animations
  useEffect(() => {
    gsap.set(overlayInnerRef.current, { xPercent: -100 });
    const allImages = items.map((it) => it.img);
    preloadImages(allImages).then(() => {
      setLoading(false);
      initScrollAnimations();
    });
  }, []);

  // Scroll animations for grid items ensuring all text content stays visible
  const initScrollAnimations = () => {
    const items = gridRef.current?.querySelectorAll('.diamond-item');
    if (!items) return;

    items.forEach((item) => {
      const img = item.querySelector('.diamond-item-img');

      // Card entrance animation
      gsap.fromTo(
        item,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Parallax image scrolling effect
      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        );
      }
    });
  };

  // Open preview with full diagonal unreveal curtain animation
  const openPreview = (pos) => {
    // Disable detail preview on mobile view (<= 767px)
    if (window.innerWidth <= 767) return;

    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    currentRef.current = pos;

    const img = previewImgRefs.current[pos];
    const imgWrap = previewImgWrapRefs.current[pos];
    const previewEl = previewElRefs.current[pos];
    const backCtrl = backCtrlRef.current;
    const overlayInner = overlayInnerRef.current;
    const title = previewTitleRefs.current[pos];
    const desc = previewDescRefs.current[pos];
    const leftText = previewLeftTextRefs.current[pos];

    if (!previewEl || !overlayInner) {
      isAnimatingRef.current = false;
      return;
    }

    setPreviewOpen(true);

    gsap.timeline({
      defaults: { duration: 1.1, ease: 'expo' },
      onStart: () => {
        gsap.set(imgWrap, { scale: 0.85, opacity: 0 });
        gsap.set(img, { scale: 1.2 });
        gsap.set(title, { y: -40, opacity: 0 });
        gsap.set(desc, { y: 30, opacity: 0 });
        gsap.set(leftText, { y: -20, opacity: 0 });
        gsap.set(backCtrl, { opacity: 0, x: -20 });
        previewEl.classList.add('preview__item--current');
      },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    })
      .addLabel('start', 0)
      .addLabel('preview', 'start+=0.3')
      .to(overlayInner, { ease: 'power2.inOut', startAt: { xPercent: -100 }, xPercent: 0 }, 'start')
      .to(title, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 'preview')
      .to(leftText, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 'preview+=0.1')
      .to(imgWrap, { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' }, 'preview+=0.1')
      .to(img, { scale: 1, duration: 1.1, ease: 'power3.out' }, 'preview+=0.1')
      .to(desc, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 'preview+=0.2')
      .to(backCtrl, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, 'preview+=0.2');
  };

  // Close preview with diagonal curtain wipe out
  const closePreview = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const pos = currentRef.current;
    const img = previewImgRefs.current[pos];
    const imgWrap = previewImgWrapRefs.current[pos];
    const previewEl = previewElRefs.current[pos];
    const backCtrl = backCtrlRef.current;
    const overlayInner = overlayInnerRef.current;
    const title = previewTitleRefs.current[pos];
    const desc = previewDescRefs.current[pos];
    const leftText = previewLeftTextRefs.current[pos];

    gsap.timeline({
      defaults: { duration: 0.9, ease: 'power4' },
      onComplete: () => {
        if (previewEl) previewEl.classList.remove('preview__item--current');
        setPreviewOpen(false);
        isAnimatingRef.current = false;
      },
    })
      .addLabel('start', 0)
      .to(backCtrl, { opacity: 0, x: -10 }, 'start')
      .to(title, { y: -30, opacity: 0 }, 'start')
      .to(leftText, { y: -20, opacity: 0 }, 'start')
      .to(desc, { y: 20, opacity: 0 }, 'start')
      .to(imgWrap, { scale: 0.9, opacity: 0 }, 'start')
      .to(overlayInner, { ease: 'power2.inOut', xPercent: 100 }, 'start+=0.2');
  };

  // Hover logic requested by user
  const handleMouseEnter = (pos) => {
    const titleInner = contentTitleInnerRefs.current[pos];
    const imgWrap = contentImgWrapRefs.current[pos];
    const img = contentImgRefs.current[pos];

    if (!titleInner || !imgWrap || !img) return;

    gsap.timeline({ defaults: { duration: 0.6, ease: 'expo' } })
      .addLabel('start', 0)
      .set(titleInner, { transformOrigin: '0% 50%' }, 'start')
      .to(titleInner, {
        startAt: { filter: 'blur(0px)' },
        duration: 0.2,
        ease: 'power1.in',
        yPercent: -100,
        rotation: -4,
        filter: 'blur(6px)',
      }, 'start')
      .to(titleInner, {
        startAt: { yPercent: 100, rotation: 4, filter: 'blur(6px)' },
        yPercent: 0,
        rotation: 0,
        filter: 'blur(0px)',
      }, 'start+=0.2')
      .to(imgWrap, { scale: 0.95 }, 'start')
      .to(img, { scale: 1.2 }, 'start');
  };

  const handleMouseLeave = (pos) => {
    const imgWrap = contentImgWrapRefs.current[pos];
    const img = contentImgRefs.current[pos];

    if (!imgWrap || !img) return;

    gsap.timeline({ defaults: { duration: 0.8, ease: 'power4' } })
      .addLabel('start', 0)
      .to([imgWrap, img], { scale: 1 }, 'start');
  };

  return (
    <div
      ref={rootRef}
      className={`diamond-collection${loading ? ' is-loading' : ''}${previewOpen ? ' is-preview-open' : ''}`}
    >
      <style>{css}</style>

      <main className="dc-main">
        <div className="dc-grid" ref={gridRef}>
          {items.map((it, i) => (
            <figure className={`diamond-item ${i % 2 === 0 ? 'dc-item--up' : 'dc-item--down'}`} key={it.title + i}>
              <h2 className="diamond-item-title rr-oh">
                <span 
                  className="rr-oh-inner" 
                  ref={(el) => (contentTitleInnerRefs.current[i] = el)}
                >
                  {it.title}
                </span>
              </h2>
              <div
                className="diamond-item-img-wrap"
                ref={(el) => (contentImgWrapRefs.current[i] = el)}
                onClick={() => openPreview(i)}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)}
              >
                <img
                  className="diamond-item-img"
                  ref={(el) => (contentImgRefs.current[i] = el)}
                  src={it.img}
                  alt={it.title}
                />
              </div>
              <figcaption className="diamond-item-caption">{it.caption}</figcaption>
            </figure>
          ))}
        </div>

        {/* Overlay */}
        <div className="dc-overlay">
          <div className="dc-overlay-inner" ref={overlayInnerRef}></div>
        </div>

        {/* Preview */}
        <div className="dc-preview">
          {items.map((it, i) => (
            <div className="dc-preview-item" key={it.title + i} ref={(el) => (previewElRefs.current[i] = el)}>
              {/* Title Top Center */}
              <h2 
                className="dc-preview-title-top" 
                ref={(el) => (previewTitleRefs.current[i] = el)}
              >
                {it.title}
              </h2>

              {/* Main Container: Left Text & Arrow + Center Image + Right-Bottom Desc */}
              <div className="dc-preview-main-layout">
                {/* Left Column: Top Text + Left Arrow */}
                <div className="dc-preview-left-col">
                  <div 
                    className="dc-preview-left-top-text" 
                    ref={(el) => (previewLeftTextRefs.current[i] = el)}
                  >
                    {it.leftText}
                  </div>
                  <button 
                    className="dc-preview-back-btn" 
                    ref={backCtrlRef} 
                    onClick={closePreview} 
                    aria-label="Back to content"
                  >
                    <svg width="50" height="14" viewBox="0 0 50 14" fill="none">
                      <path d="M50 7H3M3 7L10 1M3 7L10 13" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* Center Image */}
                <div className="dc-preview-center-col">
                  <div className="dc-preview-img-wrap" ref={(el) => (previewImgWrapRefs.current[i] = el)}>
                    <img
                      className="dc-preview-img"
                      ref={(el) => (previewImgRefs.current[i] = el)}
                      src={it.img}
                      alt={it.title}
                    />
                  </div>
                </div>

                {/* Right-Bottom Description */}
                <div className="dc-preview-right-col" ref={(el) => (previewDescRefs.current[i] = el)}>
                  <div className="dc-preview-desc-box">
                    <p className="dc-preview-desc-text">
                      {it.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,600&family=Inter:wght@400;500;600&display=swap');

.diamond-collection {
  --dc-black: #1a1a1a;
  --dc-offwhite: #faf8f5;

  position: relative;
  font-size: 18px;
  font-weight: 300;
  color: var(--dc-black);
  background-color: var(--dc-offwhite);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  min-height: 100vh;
  padding: 4rem 0 6rem 0;
  box-sizing: border-box;
  overflow: hidden;
}

.diamond-collection.is-loading::before,
.diamond-collection.is-loading::after {
  content: '';
  position: fixed;
  z-index: 1000;
}
.diamond-collection.is-loading::before {
  top: 0; left: 0; width: 100%; height: 100%;
  background: var(--dc-offwhite);
}
.diamond-collection.is-loading::after {
  top: 50%; left: 50%; width: 60px; height: 60px;
  margin: -30px 0 0 -30px;
  border-radius: 50%;
  opacity: 0.4;
  background: var(--dc-black);
  animation: dcLoader 0.7s linear infinite alternate forwards;
}
@keyframes dcLoader {
  to { opacity: 1; transform: scale3d(0.5,0.5,1); }
}

.rr-oh { position: relative; overflow: hidden; display: inline-block !important; }
.rr-oh-inner { will-change: transform, filter; display: inline-block !important; }

.dc-main {
  display: block;
  width: 100%;
  position: relative;
}

/* ============================================================
   GRID (Normal Section Flow)
   ============================================================ */
.dc-grid {
  display: grid;
  gap: 3rem 2rem;
  padding: 0 2rem;
  max-width: 1500px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
  grid-template-columns: repeat(4, 1fr);
  align-items: start;
  box-sizing: border-box;
}

.diamond-collection.is-preview-open .dc-grid { pointer-events: none; }

.diamond-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  opacity: 1;
}

.dc-item--up { margin-top: 0; }
.dc-item--down { margin-top: 50px; }

.diamond-item-title {
  font-size: clamp(1.1rem, 1.5vw, 1.6rem);
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 500;
  margin: 0 0 0.6rem 0;
  letter-spacing: 0.02em;
  color: var(--dc-black);
  text-transform: none;
}

.diamond-item-img-wrap {
  overflow: hidden;
  position: relative;
  width: 100%;
  aspect-ratio: 0.78;
  cursor: pointer;
  will-change: transform;
}

.diamond-item-img {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.diamond-item-caption {
  margin: 0.7rem 0 0;
  max-width: 100%;
  text-align: left;
  line-height: 1.55;
  font-size: 0.78rem;
  opacity: 0.75;
  text-transform: none;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: var(--dc-black);
  font-family: 'Inter', sans-serif;
}

/* ============================================================
   ROTATED REVEAL OVERLAY (Original Unreveal 45° Diagonal Curtain)
   ============================================================ */
.dc-overlay {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  width: 160vmax !important;
  height: 160vmax !important;
  pointer-events: none !important;
  will-change: transform !important;
  z-index: 5 !important;
  transform: translate(-50%, -50%) rotate(45deg) !important;
  overflow: hidden !important;
}

.dc-overlay-inner {
  background: #faf8f5 !important;
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  will-change: transform !important;
}

/* ============================================================
   PREVIEW OVERLAY (Full Detail Content Overlay)
   ============================================================ */
.dc-preview {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  display: grid !important;
  grid-template-columns: 100% !important;
  grid-template-rows: 100% !important;
  pointer-events: none !important;
  z-index: 10 !important;
  color: var(--dc-black);
  background: transparent !important;
  overflow: hidden !important;
}

.dc-preview-item {
  grid-area: 1 / 1 / -1 / -1 !important;
  opacity: 0;
  pointer-events: none;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 3rem 2rem !important;
  width: 100% !important;
  height: 100% !important;
  box-sizing: border-box !important;
  will-change: opacity, transform !important;
}

.dc-preview-item.preview__item--current {
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* Title Top Center */
.dc-preview-title-top {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: clamp(2.2rem, 4.5vw, 4.2rem);
  font-weight: 400;
  text-align: center;
  color: #1a1a1a;
  letter-spacing: -0.01em;
  text-transform: none;
  width: 100%;
}

/* Main Box Layout: Left Column (Text+Arrow) + Center Image + Right-Bottom Desc */
.dc-preview-main-layout {
  display: grid !important;
  grid-template-columns: 150px minmax(260px, 420px) 250px !important;
  gap: 0.5rem !important;
  align-items: end !important;
  justify-content: center !important;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Left Column: Top Text + Bottom Arrow */
.dc-preview-left-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: stretch;
  padding: 0.5rem 0;
  text-align: right;
}

.dc-preview-left-top-text {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 0.68rem;
  line-height: 1.5;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1a1a1a;
  opacity: 0.8;
}

.dc-preview-back-btn {
  background: transparent !important;
  border: none !important;
  padding: 10px 0 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  transition: transform 0.3s ease !important;
}

.dc-preview-back-btn:hover {
  transform: translateX(-6px) !important;
}

/* Center Column: Big Image with Rounded Corners */
.dc-preview-center-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dc-preview-img-wrap {
  overflow: hidden;
  position: relative;
}

.dc-preview-img {
  height: 67vh;
  object-fit: cover;
  display: block;
}

/* Right Column: Description at Right Bottom */
.dc-preview-right-col {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-self: flex-end;
  padding-bottom: 0.5rem;
}

.dc-preview-desc-box {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dc-preview-desc-text {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 0.72rem;
  line-height: 1.45;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #1a1a1a;
  margin: 0;
  opacity: 0.85;
}

/* ============================================================
   RESPONSIVE MEDIA QUERIES (TABLET & MOBILE)
   ============================================================ */

/* Tablet View (768px - 1024px) */
@media (max-width: 1024px) and (min-width: 768px) {
  .dc-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem 1.5rem;
    padding: 0 1.5rem;
  }
  .dc-item--down { margin-top: 0; }

  .dc-preview-item {
    padding: 2.5rem 1.5rem !important;
  }

  .dc-preview-title-top {
    font-size: 2.8rem !important;
    margin-bottom: 1.2rem !important;
  }

  .dc-preview-main-layout {
    grid-template-columns: 120px minmax(220px, 340px) 180px !important;
    gap: 1.2rem !important;
    align-items: end !important;
  }

  .dc-preview-left-top-text {
    font-size: 0.62rem !important;
  }

  .dc-preview-img {
    height: min(52vh, 420px) !important;
    border-radius: 12px !important;
  }

  .dc-preview-desc-text {
    font-size: 0.68rem !important;
  }
}

/* Mobile View (max-width: 767px) */
@media (max-width: 767px) {
  .dc-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 0 1.2rem;
  }
  .diamond-collection {
    padding: 3rem 0 4rem 0;
  }
  .diamond-item-img-wrap {
    cursor: default !important;
  }
}
`;