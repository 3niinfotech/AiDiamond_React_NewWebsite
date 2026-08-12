import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================
// Thin, full-width closing CTA strip.
// Editorial / quiet-luxury feel — no images, no cards, no gradients.
// ============================================
const RoyalRaysCtaStrip = ({
  headerTransparent = false,
  onContactClick,
  onConsultationClick,
}) => {
  const navigate = useNavigate();
  const stripRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleContactClick = (e) => {
    if (onContactClick) {
      onContactClick(e);
    } else {
      navigate("/contact");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleConsultationClick = (e) => {
    if (onConsultationClick) {
      onConsultationClick(e);
    } else {
      navigate("/contact");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={stripRef}
      data-header-transparent={headerTransparent ? "true" : "false"}
      className={`rr-cta ${inView ? "rr-cta--in" : ""}`}
      aria-label="Contact Royal Rays BV"
    >
      <div className="rr-cta__inner">
        <div className="rr-cta__col rr-cta__eyebrow-col">
          <span className="rr-cta__eyebrow">Ready to work with us?</span>
        </div>

        <div className="rr-cta__col rr-cta__main-col">
          <p className="rr-cta__main">
            Exceptional Diamonds. <span>Enduring Partnerships.</span>
          </p>
        </div>

        <div className="rr-cta__col rr-cta__actions-col">
          <button
            type="button"
            className="rr-cta__btn rr-cta__btn--primary"
            onClick={handleContactClick}
          >
            Contact Us
          </button>
        </div>
      </div>

      <style>{`
        .rr-cta {
          --rr-off-white: #F5F4EF;
          --rr-black: #111111;
          --rr-charcoal: #2A2A2A;
          --rr-grey: #777777;
          --rr-border: #D8D7D2;

          width: 100%;
          position: relative;
          z-index: 5;
          background-color: var(--rr-off-white);
          border-top: 1px solid var(--rr-border);
          border-bottom: 1px solid var(--rr-border);
          box-sizing: border-box;
        }

        .rr-cta * {
          box-sizing: border-box;
        }

        .rr-cta__inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 1.75rem 2rem;
          min-height: 110px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .rr-cta__col {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .rr-cta--in .rr-cta__col {
          opacity: 1;
          transform: translateY(0);
        }

        .rr-cta--in .rr-cta__main-col {
          transition-delay: 0.08s;
        }

        .rr-cta--in .rr-cta__actions-col {
          transition-delay: 0.16s;
        }

        .rr-cta__eyebrow-col {
          flex: 0 0 auto;
        }

        .rr-cta__eyebrow {
          display: block;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--rr-charcoal);
          white-space: nowrap;
        }

        .rr-cta__main-col {
          flex: 1 1 auto;
          text-align: center;
          min-width: 0;
        }

        .rr-cta__main {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
          font-weight: 400;
          font-size: clamp(1.1rem, 1.6vw, 1.5rem);
          line-height: 1.3;
          color: var(--rr-black);
          white-space: nowrap;
        }

        .rr-cta__main span {
          color: var(--rr-charcoal);
        }

        .rr-cta__actions-col {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .rr-cta__btn {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 0.65rem 1.35rem;
          border-radius: 2px;
          cursor: pointer;
          white-space: nowrap;
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, opacity 0.25s ease;
        }

        .rr-cta__btn--primary {
          background-color: var(--rr-black);
          color: var(--rr-off-white);
          border: 1px solid var(--rr-black);
        }

        .rr-cta__btn--primary:hover {
          opacity: 0.82;
        }

        .rr-cta__btn--secondary {
          background-color: transparent;
          color: var(--rr-black);
          border: 1px solid var(--rr-black);
        }

        .rr-cta__btn--secondary:hover {
          background-color: var(--rr-black);
          color: var(--rr-off-white);
        }

        /* ---------------- Tablet ---------------- */
        @media screen and (max-width: 900px) {
          .rr-cta__inner {
            padding: 1.5rem 1.5rem;
            gap: 1.25rem;
            min-height: 100px;
          }

          .rr-cta__main {
            white-space: normal;
          }

          .rr-cta__eyebrow {
            font-size: 0.66rem;
          }

          .rr-cta__btn {
            padding: 0.6rem 1.1rem;
            font-size: 0.74rem;
          }
        }

        /* ---------------- Mobile: 2 compact rows ---------------- */
        @media screen and (max-width: 640px) {
          .rr-cta__inner {
            flex-direction: column;
            align-items: stretch;
            gap: 0.9rem;
            padding: 1.25rem 1.25rem;
            min-height: 0;
          }

          .rr-cta__eyebrow-col,
          .rr-cta__main-col {
            text-align: center;
          }

          .rr-cta__eyebrow {
            white-space: normal;
          }

          .rr-cta__main {
            white-space: normal;
            font-size: 1.05rem;
          }

          .rr-cta__main span {
            display: block;
          }

          .rr-cta__actions-col {
            justify-content: center;
            flex-wrap: wrap;
          }

          .rr-cta__btn {
            flex: 1 1 auto;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};

export default RoyalRaysCtaStrip;