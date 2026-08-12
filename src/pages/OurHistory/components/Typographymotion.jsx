import React, { useEffect, useRef } from "react";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import { gsap } from "gsap";
import ringImg from "../../../assets/images/our-lagency.png";

const lerp = (a, b, n) => (1 - n) * a + n * b;
const getMousePos = (e) => ({ x: e.clientX, y: e.clientY });

let mouse = { x: 0, y: 0 };

class Cursor {
    constructor(el) {
        this.DOM = { el };
        this.DOM.el.style.opacity = 0;
        this.bounds = this.DOM.el.getBoundingClientRect();
        this.renderedStyles = {
            tx: { previous: 0, current: 0, amt: 0.18 },
            ty: { previous: 0, current: 0, amt: 0.18 },
        };
        this.onMouseMoveEv = () => {
            this.renderedStyles.tx.previous = this.renderedStyles.tx.current =
                mouse.x - this.bounds.width / 2;
            this.renderedStyles.ty.previous = this.renderedStyles.ty.previous =
                mouse.y - this.bounds.height / 2;
            gsap.to(this.DOM.el, { duration: 0.9, ease: "Power3.easeOut", opacity: 1 });
            requestAnimationFrame(() => this.render());
            window.removeEventListener("mousemove", this.onMouseMoveEv);
        };
        window.addEventListener("mousemove", this.onMouseMoveEv);
    }
    render() {
        this.renderedStyles["tx"].current = mouse.x - this.bounds.width / 2;
        this.renderedStyles["ty"].current = mouse.y - this.bounds.height / 2;
        for (const key in this.renderedStyles) {
            this.renderedStyles[key].previous = lerp(
                this.renderedStyles[key].previous,
                this.renderedStyles[key].current,
                this.renderedStyles[key].amt
            );
        }
        this.DOM.el.style.transform = `translateX(${this.renderedStyles["tx"].previous}px) translateY(${this.renderedStyles["ty"].previous}px)`;
        requestAnimationFrame(() => this.render());
    }
}

export default function TypographyMotion() {
    const mainRef = useRef(null);
    const cursorRef = useRef(null);
    const tmRootRef = useRef(null);
    const aboutPictureRef = useRef(null);

    useEffect(() => {
        const onWindowMouseMove = (ev) => (mouse = getMousePos(ev));
        window.addEventListener("mousemove", onWindowMouseMove);
        document.documentElement.classList.add("js");

        try {
            Splitting();
        } catch (err) {
            console.error("Splitting error:", err);
        }

        const cursorInstance = cursorRef.current ? new Cursor(cursorRef.current) : null;

        const ctx = gsap.context(() => {
            if (tmRootRef.current) {
                tmRootRef.current.classList.add("is-ready");
            }

            const prefersReducedMotion =
                typeof window !== "undefined" &&
                window.matchMedia &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            const paragraphs = mainRef.current
                ? Array.from(mainRef.current.querySelectorAll(".content__paragraph"))
                : [];
            const picture = aboutPictureRef.current;

            if (prefersReducedMotion) {
                gsap.set(mainRef.current ? mainRef.current.querySelectorAll(".char") : [], {
                    clearProps: "all",
                });
                if (picture) gsap.set(picture, { clearProps: "all" });
                return;
            }

            if (paragraphs.length > 0) {
                const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
                paragraphs.forEach((p, i) => {
                    const chars = p.querySelectorAll(".char");
                    if (!chars.length) return;
                    const isRightAligned = p.classList.contains("content__paragraph--right");
                    const xFrom = isRightAligned ? 70 : -70;
                    tl.fromTo(
                        chars,
                        {
                            opacity: 0,
                            xPercent: xFrom,
                            rotateZ: isRightAligned ? 4 : -4,
                            filter: "blur(10px)",
                        },
                        {
                            opacity: 1,
                            xPercent: 0,
                            rotateZ: 0,
                            filter: "blur(0px)",
                            duration: 0.55,
                            stagger: 0.011,
                            clearProps: "transform,opacity,filter",
                        },
                        i === 0 ? 0 : "-=0.32"
                    );
                });
                if (picture) {
                    tl.fromTo(
                        picture,
                        { opacity: 0, y: 30, scale: 0.96 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.6,
                            ease: "power3.out",
                            clearProps: "transform,opacity,scale",
                        },
                        "-=0.3"
                    );
                }
            } else if (picture) {
                gsap.fromTo(
                    picture,
                    { opacity: 0, y: 30, scale: 0.96 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.85,
                        ease: "power3.out",
                        delay: 0.4,
                        clearProps: "transform,opacity,scale",
                    }
                );
            }
        }, mainRef);

        return () => {
            window.removeEventListener("mousemove", onWindowMouseMove);
            ctx.revert();
        };
    }, []);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        *, *::after, *::before { box-sizing: border-box; }
        .tm-root {
          margin: 0;
          width: 100%;
          --color-text: #F5F5F2;
          --color-bg: #0F0E0C;
          color: var(--color-text);
          background-color: var(--color-bg);
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow: hidden;
          position: relative;
          min-height: 100vh;
          padding: 7rem 0 6rem;
        }
        .tm-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .tm-bg::before,
        .tm-bg::after {
          content: '';
          position: absolute;
          width: 60vw;
          height: 60vw;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.28;
          will-change: transform;
        }
        .tm-bg::before {
          top: -15%;
          left: -10%;
          background: radial-gradient(circle at 30% 30%, #C5A880, transparent 70%);
          animation: tm-drift-a 22s ease-in-out infinite;
        }
        .tm-bg::after {
          bottom: -20%;
          right: -10%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle at 70% 70%, #6E5A3E, transparent 70%);
          animation: tm-drift-b 26s ease-in-out infinite;
        }
        @keyframes tm-drift-a {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(8vw, 6vh) scale(1.12); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes tm-drift-b {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-7vw, -5vh) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tm-bg::before, .tm-bg::after { animation: none; }
        }
        .tm-root main { position: relative; z-index: 1; }
        .tm-root em {
          font-family: 'Playfair Display', 'Cormorant Garamond', serif;
          font-weight: 400;
          font-style: italic;
          letter-spacing: 0.02em;
          color: #C5A880;
        }
        .tm-root .ampersand {
          font-family: 'Playfair Display', 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          color: #C5A880;
          opacity: 0.9;
          margin: 0 0.25em;
          text-transform: none;
        }
        .content {
          width: 100%;
          padding: 0 5vw;
          margin: 0;
          max-width: none !important;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          gap: 1.25rem;
          position: relative;
          cursor: default;
          visibility: hidden;
          opacity: 0;
        }
        .tm-root.is-ready .content {
          visibility: visible;
          opacity: 1;
        }
        .content__paragraph {
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          font-size: clamp(2.2rem, 5.5vw, 6.2rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          word-spacing: 0.15vw;
          text-transform: uppercase;
          margin: 0;
          line-height: 0.98;
          position: relative;
          overflow: visible;
          color: #F5F5F2;
          opacity: 1;
          text-align: left;
          align-self: flex-start;
          white-space: nowrap;
        }
        .content__paragraph--right {
          align-self: flex-end !important;
          text-align: right !important;
        }
        .content__bottom-group {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 0.5rem;
          width: 100%;
          position: relative;
        }
        .content__figure {
          margin: 0 0 0 auto;
          width: 800px;
          max-width: 48vw;
          position: relative;
          opacity: 1;
          transform: none;
        }
        .content__figure-img {
          width: 100%;
          max-width: 800px;
          height: 406px;
          object-fit: cover;
        }
        .content__figure-caption {
          position: absolute;
          right: 100%;
          bottom: 0;
          margin-right: 1.5rem;
          width: 340px;
          max-width: 32vw;
          font-size: 0.85rem;
          line-height: 1.65;
          color: #A0A0A0;
          text-align: right;
        }
        .char {
          will-change: transform, opacity, filter;
          display: inline-block;
          opacity: 1;
          transform: none;
        }
        .cursor { display: none; }
        @media screen and (max-width: 64em) {
         @media screen and (max-width: 64em) {
  .content__paragraph { font-size: clamp(1rem, 4.5vw, 1.8rem); white-space: normal; }
          .content__bottom-group { flex-direction: column; gap: 2rem; }
          .content__figure { width: 100%; max-width: 100%; }
          .content__figure-img { width: 100%; height: 380px; }
          .content__figure-caption {
            position: relative;
            right: auto;
            bottom: auto;
            margin-right: 0;
            margin-top: 1.5rem;
            width: 100%;
            max-width: 100%;
            text-align: left;
          }
        }
        @media (any-pointer: fine) {
          .cursor { position: fixed; top: 0; left: 0; display: block; pointer-events: none; z-index: 9999; }
          .cursor__inner { fill: #F5F5F2; opacity: 0.5; }
        }
      `}</style>

            <div className="tm-root" ref={tmRootRef} data-header-transparent="true" data-header-hero="true">
                <div className="tm-bg" aria-hidden="true" />
                <main ref={mainRef}>
                    <div className="content">
                        <p className="content__paragraph" data-splitting>ROYAL RAYS BV IS AN</p>
                        <p className="content__paragraph content__paragraph--right" data-splitting>
                            ANTWERP BASED LUXURY HOUSE
                        </p>
                        <p className="content__paragraph" data-splitting>
                            BASED <em>CRAFT</em> &amp; <em>BRILLIANCE</em>
                        </p>
                        <div className="content__bottom-group">
                            <p className="content__paragraph" data-splitting>EXCELLENCE</p>
                            <figure className="content__figure" ref={aboutPictureRef}>
                                <img
                                    className="content__figure-img"
                                    src={ringImg}
                                    alt="Royal Rays diamond craftsmanship"
                                />
                                <figcaption className="content__figure-caption">
                                    Crafting timeless diamond pieces that embody precision, excellence, and unparalleled beauty since 1988. Our master artisans in Antwerp combine centuries of heritage with cutting-edge diamond innovation, creating rare gems that illuminate every milestone of your legacy.
                                </figcaption>
                            </figure>
                        </div>
                    </div>
                </main>
                <svg className="cursor" ref={cursorRef} width="80" height="80" viewBox="0 0 80 80">
                    <circle className="cursor__inner" cx="40" cy="40" r="20" />
                </svg>
            </div>
        </>
    );
}