import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './StickySections.css';
import section1 from "../../../assets/images/footer2.png"
gsap.registerPlugin(ScrollTrigger);

// Content data for the sticky sections — edit freely, order/length drives the animation
const sections = [
  {
    bg: 'bg-1',
    img: section1,
    title: 'ROUND BRILLIANT CUT',
    text: 'The most iconic and popular diamond shape globally. With 57 precisely angled facets, it delivers unmatched fire, brilliance, and scintillation. The gold standard of diamond cuts, representing 75% of all diamond sales worldwide.',
  },
  {
    bg: 'bg-2',
    img: '/img/8.png',
    title: 'PRINCESS CUT',
    text: 'The second most popular fancy shape. A modern square cut with sharp, uncut corners and brilliant faceting. Its chevron-like patterns create exceptional sparkle, making it the preferred choice for contemporary engagement rings.',
  },
  {
    bg: 'bg-3',
    img: '/img/9.png',
    title: 'EMERALD CUT',
    text: 'A sophisticated step-cut rectangular shape with cropped corners. Its hall-of-mirrors effect creates subtle elegance rather than fiery brilliance. Favored by celebrities for its Art Deco glamour and timeless vintage appeal.',
  },
  {
    bg: 'bg-4',
    img: '/img/10.png',
    title: 'CUSHION CUT',
    text: 'A romantic square or rectangular cut with rounded corners and large facets. Combining the brilliance of round with a soft, pillowed silhouette. Also known as the "old mine cut," it exudes antique charm and vintage sophistication.',
  },
  {
    bg: 'bg-5',
    img: '/img/11.png',
    title: 'RADIANT CUT',
    text: 'A brilliant rectangular or square cut with cropped corners. It combines the elegance of emerald shape with the brilliance of round cut. Features 70 carefully placed facets that maximize light return and color intensity.',
  },
  {
    bg: 'bg-6',
    img: '/img/12.png',
    title: 'OVAL CUT',
    text: 'An elongated brilliant-cut diamond with a symmetrical elliptical outline. It creates the illusion of greater size and slenderizes the finger. Rising in popularity for its ability to showcase both brilliance and elegant sophistication.',
  },
];

// Preloads a list of image URLs and resolves once every image has loaded (or errored)
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

export default function StickySections() {
  const [loading, setLoading] = useState(true);
  const contentRefs = useRef([]);
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  contentRefs.current = [];
  const addContentRef = (el) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const initSmoothScrolling = () => {
      lenisRef.current = new Lenis({
        lerp: 0.2, // Lower values create a smoother scroll effect
        smoothWheel: true, // Enables smooth scrolling for mouse wheel events
      });

      lenisRef.current.on('scroll', () => ScrollTrigger.update());

      const scrollFn = (time) => {
        lenisRef.current.raf(time);
        rafIdRef.current = requestAnimationFrame(scrollFn);
      };
      rafIdRef.current = requestAnimationFrame(scrollFn);
    };

    const scrollAnimations = [];

    const scroll = () => {
      const els = contentRefs.current;
      const total = els.length;

      els.forEach((el, position) => {
        const isLast = position === total - 1;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: isLast ? 'top top' : 'bottom top',
            end: '+=100%',
            scrub: true,
          },
        }).to(el, { ease: 'none', yPercent: -100 }, 0);

        scrollAnimations.push(tl);
      });
    };

    const init = () => {
      initSmoothScrolling();
      scroll();
    };

    const allImages = ['/img/11.png', ...sections.map((s) => s.img), '/img/8.png'];

    preloadImages(allImages).then(() => {
      if (cancelled) return;
      setLoading(false);
      init();
    });

    return () => {
      cancelled = true;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (lenisRef.current) lenisRef.current.destroy();
      scrollAnimations.forEach((tl) => tl.scrollTrigger && tl.scrollTrigger.kill());
      scrollAnimations.forEach((tl) => tl.kill());
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className={`demo-10${loading ? ' loading' : ''}`}>
      <main>
        <div className="wrap">
          {sections.map((s, i) => (
            <div key={s.title} ref={addContentRef} className={`content content--sticky content--half ${s.bg}`}>
              <img className="content__img content__img--small" src={s.img} alt="" />
              <h2 className="content__title">{s.title}</h2>
              <p className="content__text content__text--narrow text-meta">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="content content--highlight content--outro">
          <p className="text-large">
            Lost in perpetual dependency, inhabitants of the Synthetic Era found solace in
            cryptic simulations, where pain ebbed and cognitive loads momentarily lightened.
          </p>
          <img className="content__img spacer" src="/img/8.png" alt="" />
        </div>
      </main>
    </div>
  );
}