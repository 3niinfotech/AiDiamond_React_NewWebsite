import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const GridAnimation = () => {
  const [state, setState] = useState('home');
  const [isAnimating, setIsAnimating] = useState(false);
  const worksGridRef = useRef(null);
  const gridWrapRef = useRef(null);
  const worksSectionRef = useRef(null);
  const worksTitlesRef = useRef([]);
  const contentItemsRef = useRef([]);
  const totalItems = 14;
  const hasAutoPlayed = useRef(false);

  const duration = 1;
  const ease = 'power4.inOut';
  const stagger = { each: 0.04, from: 'end', grid: 'auto' };

  const openWorks = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const items = contentItemsRef.current.filter(Boolean);
    const flipState = Flip.getState(items);

    const tl = gsap.timeline({
      defaults: { duration, ease },
      onStart: () => {
        setState('works');
        if (worksGridRef.current && gridWrapRef.current) {
          const grid = gridWrapRef.current.querySelector('.grid');
          if (grid) {
            worksGridRef.current.appendChild(grid);
          }
        }
        worksSectionRef.current?.classList.add('works--open');
        document.body.classList.add('preview-open');

        gsap.set(items, {
          transformOrigin: (pos) =>
            pos >= totalItems / 2 ? '50% 0%' : '50% 100%',
        });

        gsap.set(worksTitlesRef.current.filter(Boolean), {
          yPercent: (pos) => (pos ? -101 : 101),
          opacity: 0,
        });
      },
      onComplete: () => setIsAnimating(false),
    });

    tl.addLabel('start', 0)
      .add(() => {
        Flip.from(flipState, {
          duration,
          ease,
          stagger,
          absolute: true,
        });
      }, 'start')
      .to(worksTitlesRef.current.filter(Boolean), {
        duration: duration * 1.2,
        stagger: -0.1,
        yPercent: 0,
        opacity: 1,
      }, 'start')
      .to(items, {
        duration: duration / 2,
        ease: 'power1.in',
        stagger,
        scaleY: 1.3,
      }, 'start')
      .to(items, {
        duration: duration / 2,
        ease: 'power4',
        stagger,
        scaleY: 1,
      }, `start+=${duration / 2}`);
  };

  useEffect(() => {
    if (!hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      setTimeout(() => {
        openWorks();
      }, 300);
    }
  }, []);

  useEffect(() => {
    const items = contentItemsRef.current.filter(Boolean);
    items.forEach((item, pos) => {
      const img = item.querySelector('.grid__item-img');

      const onEnter = () => {
        if (isAnimating) return;
        gsap.killTweensOf([item, img]);
        gsap.timeline({ defaults: { duration, ease: 'expo' } })
          .set(item, {
            transformOrigin: pos >= totalItems / 2 ? '50% 100%' : '50% 0%',
          })
          .to(item, { scaleY: 1.08 }, 0)
          .to(img, { scale: 1.15 }, 0);
      };

      const onLeave = () => {
        if (isAnimating) return;
        gsap.killTweensOf([item, img]);
        gsap.timeline({ defaults: { duration, ease: 'expo' } })
          .to(item, { scaleY: 1 }, 0)
          .to(img, { scale: 1 }, 0);
      };

      item.addEventListener('mouseenter', onEnter);
      item.addEventListener('mouseleave', onLeave);

      return () => {
        item.removeEventListener('mouseenter', onEnter);
        item.removeEventListener('mouseleave', onLeave);
      };
    });
  }, [isAnimating]);

  const imageData = [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&h=600&fit=crop',
  ];

  const titles = [
    'Antwerp Diamond Fair', 'Hong Kong Gem Show', 'JCK Las Vegas Expo',
    'Dubai Diamond Conf.', 'Surat Diamond Expo', 'Tokyo Luxury Fair',
    'Vicenzaoro Italy', 'Singapore Gem Fair', 'Doha Jewellery Expo',
    'Bahrain Jewellery Arabia', 'Baselworld Showcase', 'Shanghai Gem Fair',
    'Munich Jewellery Show', 'London Diamond Expo',
  ];

  return (
    <section
      data-header-transparent="true"
      data-header-hero="true"
      className="relative w-full bg-[#0a0a0a] text-white overflow-hidden min-h-screen"
    >
      <style>{`
        .oh {
          position: relative;
          overflow: hidden;
        }
        .oh__inner {
          will-change: transform;
          display: inline-block;
        }
        .grid-animation-main {
          width: 100%;
          display: grid;
          grid-template-columns: 100%;
          grid-template-rows: 100vh;
          min-height: 100vh;
          position: relative;
          background: #0a0a0a;
        }
        .content {
          display: grid;
          grid-template-columns: 100%;
          grid-template-rows: 1fr;
          width: 100vw;
          height: 100vh;
          position: relative;
          align-items: center;
          z-index: 20;
          grid-area: 1 / 1 / -1 / -1;
        }
        .preview-open .content {
          pointer-events: none;
        }
        .grid-wrap {
          display: flex;
          justify-content: center;
        }
        .grid {
          display: grid;
          position: relative;
          z-index: 1;
        }
        .content .grid {
          width: 420px;
          height: 105px;
          margin: 0 auto;
          grid-gap: 12px;
          grid-template-columns: repeat(7, 1fr);
        }
        .grid__item,
        .grid__item-img {
          display: block;
          width: 100%;
          will-change: transform;
        }
        .grid__item {
          overflow: hidden;
          cursor: pointer;
          position: relative;
          background-color: #1a1a1a;
        }
        .grid__item-img {
          opacity: 0.9;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: 50% 50%;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .works {
          z-index: 10;
          display: grid;
          grid-template-columns: 100%;
          grid-template-rows: 100vh;
          place-items: center;
          opacity: 0;
          pointer-events: none;
          padding: 0 4rem;
          position: relative;
          grid-area: 1 / 1 / -1 / -1;
        }
        .works--open {
          opacity: 1;
          pointer-events: auto;
        }
        .works .grid {
          grid-gap: 1rem;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: 1fr 20vh 1fr;
          grid-column-gap: 4vh;
          grid-area: 1 / 1 / -1 / -1;
          width: 100%;
          height: 100%;
        }
        .works .grid__item {
          height: 100%;
        }
        .works .grid__item::after {
          content: attr(data-title);
          position: absolute;
          left: 0;
          width: 100%;
          bottom: 0;
          top: auto;
          color: #ffffff;
          font-size: 0.75rem;
          padding: 0.85rem 0.75rem;
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.35s ease;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
          box-sizing: border-box;
          pointer-events: none;
        }
        .works .grid__item:hover::after {
          opacity: 1;
          transform: translateY(0);
        }
        .works__title {
          grid-area: 1 / 1 / -1 / -1;
          height: 20vh;
          position: relative;
          pointer-events: none;
          z-index: 100;
          width: 100%;
          text-transform: uppercase;
          font-family: 'Playfair Display', serif;
          font-weight: 300;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 0;
          color: #ffffff;
          letter-spacing: 0.08em;
        }
        .works__title .oh {
          padding-bottom: 0.15em;
          margin-bottom: -0.15em;
        }
        .works__title .line-left {
          text-align: left;
          font-size: clamp(2.8rem, 8vw, 7vw);
          line-height: 1.05;
        }
        .works__title .line-right {
          text-align: right;
          font-size: clamp(2.8rem, 8vw, 7vw);
          line-height: 1.05;
          color: rgba(255,255,255,0.45);
        }
        .works .grid__item:nth-child(1) { height: 55%; }
        .works .grid__item:nth-child(2) { height: 95%; }
        .works .grid__item:nth-child(3) { height: 65%; }
        .works .grid__item:nth-child(4) { height: 70%; }
        .works .grid__item:nth-child(5) { height: 100%; }
        .works .grid__item:nth-child(6) { height: 35%; }
        .works .grid__item:nth-child(7) { height: 65%; }
        .works .grid__item:nth-child(8) { height: 55%; }
        .works .grid__item:nth-child(9) { height: 65%; }
        .works .grid__item:nth-child(10) { height: 95%; }
        .works .grid__item:nth-child(11) { height: 55%; }
        .works .grid__item:nth-child(12) { height: 75%; }
        .works .grid__item:nth-child(13) { height: 55%; }
        .works .grid__item:nth-child(14) { height: 75%; }
        .works .grid__item:nth-last-child(-n+7) {
          grid-row: 3;
          align-self: end;
        }
        @media screen and (max-width: 52.99em) {
          .works {
            padding: 0 1.5rem;
          }
          .works .grid {
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: auto;
            grid-gap: 0.75rem;
          }
          .works .grid__item {
            height: 180px !important;
          }
          .works__title .line-left,
          .works__title .line-right {
            font-size: 8.5vw;
          }
            .works__title {
    height: 9vh !important;
  }
        }
      `}</style>

      <main className="grid-animation-main">
        <section className="content">
          <div className="grid-wrap" ref={gridWrapRef}>
            <div className="grid">
              {imageData.map((src, idx) => (
                <a
                  key={idx}
                  className="grid__item"
                  data-title={titles[idx]}
                  ref={(el) => {
                    if (el) contentItemsRef.current[idx] = el;
                  }}
                >
                  <span
                    className="grid__item-img"
                    style={{ backgroundImage: `url(${src})` }}
                  ></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="works" ref={worksSectionRef}>
          <h2 className="works__title">
            <span className="oh line-left">
              <span
                className="oh__inner"
                ref={(el) => {
                  if (el) worksTitlesRef.current[0] = el;
                }}
              >
                GLOBAL EXPOS
              </span>
            </span>
            <span className="oh line-right">
              <span
                className="oh__inner"
                ref={(el) => {
                  if (el) worksTitlesRef.current[1] = el;
                }}
              >
                SHOWCASES
              </span>
            </span>
          </h2>
          <div className="grid" ref={worksGridRef}></div>
        </section>
      </main>
    </section>
  );
};

export default GridAnimation;