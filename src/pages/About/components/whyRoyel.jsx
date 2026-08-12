// whyRoyel.jsx
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { gsap } from "gsap";
import img from "../../../assets/images/oh2.jpg";
import cert2 from "../../../assets/images/cert2.jpg";
import cert1 from "../../../assets/images/cert1.jpg";

// ============================================
// UTILITY FUNCTIONS
// ============================================
const lerp = (a, b, n) => (1 - n) * a + n * b;
const getMousePos = (e) => ({ x: e.clientX, y: e.clientY });

const renderSplitText = (text) => {
  return text.split("").map((char, i) => (
    <span className="char-wrap" key={i}>
      <span className="char">{char === " " ? "\u00A0" : char}</span>
    </span>
  ));
};

// ============================================
// ANIMATED COUNTER COMPONENT
// ============================================
const AnimatedCounter = ({ value, duration = 2.2, isVisible = true }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!isVisible) {
      if (ref.current) ref.current.textContent = value;
      return;
    }

    const numericMatch = value.match(/[\d.]+/);
    if (!numericMatch) {
      if (ref.current) ref.current.textContent = value;
      return;
    }

    const targetNum = parseFloat(numericMatch[0]);
    const prefix = value.substring(0, value.indexOf(numericMatch[0]));
    const suffix = value.substring(value.indexOf(numericMatch[0]) + numericMatch[0].length);
    const isDecimal = numericMatch[0].includes(".");

    let animationFrameId = null;
    let startTime = null;

    const el = ref.current;
    if (!el) return;

    el.textContent = `${prefix}${isDecimal ? "0.0" : "0"}${suffix}`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTime = null;

          const animateStep = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = easeOut * targetNum;

            if (el) {
              const formattedVal = isDecimal
                ? currentVal.toFixed(1)
                : Math.floor(currentVal).toString();
              el.textContent = `${prefix}${formattedVal}${suffix}`;
            }

            if (progress < 1) {
              animationFrameId = requestAnimationFrame(animateStep);
            } else if (el) {
              el.textContent = value;
            }
          };

          animationFrameId = requestAnimationFrame(animateStep);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration, isVisible]);

  return <span ref={ref}>{value}</span>;
};

// ============================================
// MAGNETIC EFFECT - Only inside section
// ============================================
const MagneticFx = (element, containerRef) => {
  let mouse = { x: 0, y: 0 };
  let transformed = { x: 0, y: 0 };
  let animationFrame = null;
  let isActive = true;

  const render = () => {
    if (!element || !isActive) return;

    // Check if mouse is inside container
    const containerBounds = containerRef?.current?.getBoundingClientRect();
    if (containerBounds) {
      const isInside =
        mouse.x >= containerBounds.left &&
        mouse.x <= containerBounds.right &&
        mouse.y >= containerBounds.top &&
        mouse.y <= containerBounds.bottom;

      if (!isInside) {
        // Reset transform when outside
        element.style.transform = `translate(0px, 0px)`;
        animationFrame = requestAnimationFrame(render);
        return;
      }
    }

    const bounds = element.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const distanceX = mouse.x - centerX;
    const distanceY = mouse.y - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < 300) {
      const maxDist = 300;
      const strength = Math.max(0, (maxDist - distance) / maxDist);
      transformed.x += (distanceX * strength * 0.15 - transformed.x) * 0.1;
      transformed.y += (distanceY * strength * 0.15 - transformed.y) * 0.1;
    } else {
      transformed.x += -transformed.x * 0.05;
      transformed.y += -transformed.y * 0.05;
    }

    element.style.transform = `translate(${transformed.x}px, ${transformed.y}px)`;
    animationFrame = requestAnimationFrame(render);
  };

  const onMouseMove = (e) => {
    mouse = getMousePos(e);
  };

  const start = () => {
    isActive = true;
    window.addEventListener("mousemove", onMouseMove);
    render();
  };

  const stop = () => {
    isActive = false;
    window.removeEventListener("mousemove", onMouseMove);
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  };

  return { start, stop };
};

// ============================================
// CURSOR COMPONENT - ONLY INSIDE SECTION
// ============================================
const Cursor = React.forwardRef(({ isVisible, containerRef }, ref) => {
  const cursorRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const renderedStyles = useRef({
    tx: { previous: 0, current: 0, amt: 0.2 },
    ty: { previous: 0, current: 0, amt: 0.2 },
    scale: { previous: 1, current: 1, amt: 0.15 },
  });
  const animationFrameRef = useRef(null);
  const isInitialized = useRef(false);
  const isInsideRef = useRef(false);

  const render = useCallback(() => {
    const bounds = cursorRef.current?.getBoundingClientRect();
    if (!bounds) return;

    // Check if cursor is inside the container
    const containerBounds = containerRef?.current?.getBoundingClientRect();
    if (containerBounds) {
      const isInside =
        mouse.current.x >= containerBounds.left &&
        mouse.current.x <= containerBounds.right &&
        mouse.current.y >= containerBounds.top &&
        mouse.current.y <= containerBounds.bottom;

      isInsideRef.current = isInside;

      if (!isInside) {
        if (cursorRef.current) {
          cursorRef.current.style.opacity = 0;
          cursorRef.current.style.transform = `translateX(0px) translateY(0px) scale(1)`;
        }
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      } else {
        if (cursorRef.current) {
          cursorRef.current.style.opacity = 1;
        }
      }
    } else {
      // If no container, hide cursor
      if (cursorRef.current) {
        cursorRef.current.style.opacity = 0;
      }
      animationFrameRef.current = requestAnimationFrame(render);
      return;
    }

    renderedStyles.current.tx.current = mouse.current.x - bounds.width / 2;
    renderedStyles.current.ty.current = mouse.current.y - bounds.height / 2;

    for (const key in renderedStyles.current) {
      renderedStyles.current[key].previous = lerp(
        renderedStyles.current[key].previous,
        renderedStyles.current[key].current,
        renderedStyles.current[key].amt,
      );
    }

    if (cursorRef.current) {
      cursorRef.current.style.transform = `translateX(${renderedStyles.current.tx.previous}px) translateY(${renderedStyles.current.ty.previous}px) scale(${renderedStyles.current.scale.previous})`;
    }

    animationFrameRef.current = requestAnimationFrame(render);
  }, [containerRef]);

  useEffect(() => {
    if (!isVisible) return;

    const handleMouseMove = (ev) => {
      mouse.current = getMousePos(ev);
      if (!isInitialized.current) {
        const bounds = cursorRef.current?.getBoundingClientRect();
        if (bounds) {
          renderedStyles.current.tx.previous =
            mouse.current.x - bounds.width / 2;
          renderedStyles.current.ty.previous =
            mouse.current.y - bounds.height / 2;
          renderedStyles.current.tx.current =
            renderedStyles.current.tx.previous;
          renderedStyles.current.ty.current =
            renderedStyles.current.ty.previous;
          if (cursorRef.current) {
            cursorRef.current.style.opacity = 0;
          }
          isInitialized.current = true;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render, isVisible]);

  return (
    <svg
      ref={cursorRef}
      className="wr-cursor"
      width="80"
      height="80"
      viewBox="0 0 80 80"
      style={{ opacity: 0, pointerEvents: 'none' }}
    >
      <circle className="wr-cursor__inner" cx="40" cy="40" r="20" />
    </svg>
  );
});

// ============================================
// ITEM COMPONENT
// ============================================
const Item = ({ item, index, onOpen, isOpen, containerRef }) => {
  const itemRef = useRef(null);
  const imgWrapRef = useRef(null);
  const imgRef = useRef(null);
  const enterActionRef = useRef(null);
  const circleRef = useRef(null);
  const headingRef = useRef(null);
  const excerptRef = useRef(null);
  const metaRef = useRef(null);
  const itemHeadingChars = useRef([]);
  const magneticFx = useRef(null);

  useEffect(() => {
    if (enterActionRef.current) {
      magneticFx.current = MagneticFx(enterActionRef.current, containerRef);
      magneticFx.current.start();
      gsap.set(circleRef.current, { transformOrigin: "50% 50%" });
    }

    if (headingRef.current) {
      const chars = headingRef.current.querySelectorAll(".char");
      itemHeadingChars.current = [...chars];
    }

    return () => {
      if (magneticFx.current) {
        magneticFx.current.stop();
      }
    };
  }, [containerRef]);

  const handleMouseEnter = () => {
    if (isOpen) return;

    const invert = item.invert;
    const tl = gsap
      .timeline()
      .to(
        circleRef.current,
        {
          duration: 0.8,
          ease: "power3",
          scale: 1.12,
          stroke: "#555555",
        },
        0,
      )
      .to(
        imgWrapRef.current,
        {
          duration: 0.8,
          ease: "power3",
          scale: 0.97,
        },
        0,
      )
      .to(
        imgRef.current,
        {
          duration: 0.8,
          ease: "power3",
          scale: 1.05,
        },
        0,
      )
      .to(
        itemHeadingChars.current,
        {
          duration: 0.25,
          ease: "power2.in",
          x: invert ? "103%" : "-103%",
        },
        0,
      )
      .set(
        headingRef.current,
        {
          x: invert ? "10%" : "-10%",
        },
        0.25,
      )
      .to(
        itemHeadingChars.current,
        {
          duration: 0.7,
          ease: "power3.out",
          startAt: { x: invert ? "-103%" : "103%" },
          x: "0%",
        },
        0.25,
      );

    return () => tl.kill();
  };

  const handleMouseLeave = () => {
    if (isOpen) return;

    const invert = item.invert;
    const tl = gsap
      .timeline()
      .to(
        enterActionRef.current,
        {
          duration: 0.8,
          ease: "power3",
          x: 0,
          y: 0,
        },
        0,
      )
      .to(
        circleRef.current,
        {
          duration: 0.8,
          ease: "power3",
          scale: 1,
          stroke: "#2A2A2A",
        },
        0,
      )
      .to(
        [imgWrapRef.current, imgRef.current],
        {
          duration: 0.8,
          ease: "power3",
          scale: 1,
        },
        0,
      )
      .to(
        itemHeadingChars.current,
        {
          duration: 0.25,
          ease: "power2.in",
          x: invert ? "-103%" : "103%",
        },
        0,
      )
      .set(
        headingRef.current,
        {
          x: "0%",
        },
        0.25,
      )
      .to(
        itemHeadingChars.current,
        {
          duration: 0.7,
          ease: "power3.out",
          startAt: { x: invert ? "103%" : "-103%" },
          x: "0%",
        },
        0.25,
      );

    return () => tl.kill();
  };

  const handleOpen = (e) => {
    if (e) e.preventDefault();
    if (magneticFx.current) {
      magneticFx.current.stop();
    }
    onOpen(index);
  };

  return (
    <article
      ref={itemRef}
      className={`wr-item ${item.invert ? "wr-item--invert" : ""}`}
    >
      <div className="wr-item__imgwrap" ref={imgWrapRef}>
        <div
          className="wr-item__img"
          ref={imgRef}
          style={{ backgroundImage: `url(${item.image})` }}
        />
      </div>

      <button
        className="wr-item__enter unbutton"
        ref={enterActionRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleOpen}
        aria-label="Open article"
      >
        <svg
          className="wr-item__enter-circle"
          vectorEffect="non-scaling-stroke"
          width="500"
          height="500"
          viewBox="0 0 800 800"
          ref={circleRef}
        >
          <circle vectorEffect="non-scaling-stroke" cx="400" cy="400" r="200" />
        </svg>
      </button>

      <h2 className="wr-heading wr-heading--item" ref={headingRef}>
        <span className="block">{renderSplitText(item.title1)}</span>
        <span className="block">{renderSplitText(item.title2)}</span>
      </h2>

      <div className="wr-item__meta" ref={metaRef}>
        <span className="wr-item__meta-row">
          <span>{item.author}</span>
        </span>
        <span className="wr-item__meta-row">
          <span>{item.date}</span>
        </span>
      </div>

      <div className="wr-item__excerpt" ref={excerptRef}>
        <p>{item.excerpt}</p>
        <button className="wr-item__excerpt-link unbutton" onClick={handleOpen}>
          <span>READ FULL ARTICLE →</span>
        </button>
      </div>
    </article>
  );
};

// ============================================
// CONTENT COMPONENT
// ============================================
const Content = ({ item, isOpen, onClose }) => {
  const containerRef = useRef(null);
  const articleRef = useRef(null);
  const headingRef = useRef(null);
  const heroImgRef = useRef(null);
  const backRef = useRef(null);
  const contentTextRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !item) return;

    if (isOpen) {
      container.style.display = "block";
      container.style.visibility = "visible";

      const headingChars = headingRef.current
        ? [...headingRef.current.querySelectorAll(".char")]
        : [];
      const contentElems = contentTextRef.current
        ? [...contentTextRef.current.children]
        : [];
      const heroImg = heroImgRef.current;
      const backBtn = backRef.current;
      const invert = item?.invert || false;

      gsap.set(container, { opacity: 0 });
      gsap.set(heroImg, { scale: 1.12, opacity: 0, y: 25 });
      gsap.set(headingChars, { x: invert ? "-103%" : "103%" });
      gsap.set(contentElems, { opacity: 0, y: 30 });
      gsap.set(backBtn, { scale: 0.85, opacity: 0 });

      // Scroll with the page — bring this block into view (not a fixed overlay)
      requestAnimationFrame(() => {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(container, { opacity: 1, duration: 0.5 })
        .to(
          heroImg,
          { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.35",
        )
        .to(
          headingChars,
          { duration: 0.9, x: "0%", stagger: invert ? -0.02 : 0.02 },
          "-=0.65",
        )
        .to(
          contentElems,
          { duration: 0.8, y: 0, opacity: 1, stagger: 0.04 },
          "-=0.55",
        )
        .to(backBtn, { duration: 0.6, scale: 1, opacity: 1 }, "-=0.5");
    } else {
      gsap.to(container, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => {
          container.style.visibility = "hidden";
          container.style.display = "none";
        },
      });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, item]);

  const handleClose = () => {
    const container = containerRef.current;
    if (!container) return;

    const headingChars = headingRef.current
      ? [...headingRef.current.querySelectorAll(".char")]
      : [];
    const contentElems = contentTextRef.current
      ? [...contentTextRef.current.children]
      : [];
    const heroImg = heroImgRef.current;
    const backBtn = backRef.current;
    const invert = item?.invert || false;

    gsap
      .timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          // Collapse overlay height before list returns — prevents jump to Leadership
          container.style.visibility = "hidden";
          container.style.display = "none";
          onClose();
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              const section = document.querySelector(".why-royal-container");
              if (section) {
                section.scrollIntoView({ behavior: "auto", block: "start" });
              }
            });
          });
        },
      })
      .to(backBtn, { duration: 0.25, scale: 0.9, opacity: 0 }, 0)
      .to(contentElems, { duration: 0.35, opacity: 0, y: 20, stagger: 0.02 }, 0)
      .to(headingChars, { duration: 0.35, x: invert ? "-103%" : "103%" }, 0)
      .to(heroImg, { duration: 0.4, scale: 0.95, opacity: 0 }, 0)
      .to(container, { duration: 0.4, opacity: 0 }, "-=0.2");
  };

  if (!item) return null;

  return (
    <section
      className={`wr-content${isOpen ? " wr-content--open" : ""}`}
      ref={containerRef}
    >
      <article ref={articleRef} className="wr-content__article">
        <p className="wr-content__eyebrow">Antwerp · Manufacturing house</p>
        <h2 className="wr-heading wr-heading--content" ref={headingRef}>
          <span className="block">{renderSplitText("WHY CHOOSE")}</span>
          <span className="block">{renderSplitText("ROYAL RAYS")}</span>
        </h2>

        <div className="wr-content__hero-img-box" ref={heroImgRef}>
          <img
            src={item.image}
            alt="Royal Rays diamond craftsmanship"
            className="wr-content__hero-img"
          />
        </div>

        <div className="wr-content__text" ref={contentTextRef}>
          <div className="wr-content__summary">
            <p className="wr-content__summary-text">
              Family-led diamond manufacturing in Antwerp — natural fancy cuts,
              ethical origin, and export-ready precision for partners who expect
              clarity in every stone and every conversation.
            </p>
          </div>

          <div className="wr-content__topics">
            <h3 className="wr-content__topics-title">What sets us apart</h3>

            <div className="wr-content__topic">
              <span className="wr-content__topic-icon">◆</span>
              <div>
                <h4>Precision cutting</h4>
                <p>
                  Proportion-led fancy cuts shaped for light return, symmetry,
                  and consistent export grading.
                </p>
              </div>
            </div>

            <div className="wr-content__topic">
              <span className="wr-content__topic-icon">◆</span>
              <div>
                <h4>Antwerp craft</h4>
                <p>
                  Bench discipline from the diamond district — heritage skill
                  meeting modern mapping and polish control.
                </p>
              </div>
            </div>

            <div className="wr-content__topic">
              <span className="wr-content__topic-icon">◆</span>
              <div>
                <h4>Ethical origin</h4>
                <p>
                  Conflict-free sourcing with clear chain of custody from rough
                  selection through finished stone.
                </p>
              </div>
            </div>

            <div className="wr-content__topic">
              <span className="wr-content__topic-icon">◆</span>
              <div>
                <h4>Partner-first delivery</h4>
                <p>
                  Reliable communication, documentation, and stones chosen to
                  perform in finished jewellery.
                </p>
              </div>
            </div>
          </div>

          <div className="wr-content__assurance">
            <h3 className="wr-content__assurance-title">Certified standards</h3>
            <p className="wr-content__assurance-lead">
              Independent verification and responsible practices — so every
              delivery arrives with confidence.
            </p>

            <div className="wr-content__certs">
              <figure className="wr-content__cert">
                <img src={cert2} alt="RJC certification" loading="lazy" />
                <figcaption>Responsible Jewellery Council</figcaption>
              </figure>
              <figure className="wr-content__cert">
                <img src={cert1} alt="GIA certification" loading="lazy" />
                <figcaption>GIA grading standards</figcaption>
              </figure>
            </div>

            <div className="wr-content__assurance-item">
              <span className="wr-content__assurance-icon">✓</span>
              <div>
                <h4>Independent grading</h4>
                <p>Stones aligned with recognised gemological reporting.</p>
              </div>
            </div>

            <div className="wr-content__assurance-item">
              <span className="wr-content__assurance-icon">✓</span>
              <div>
                <h4>Traceable supply</h4>
                <p>Provenance documented from rough to polished finish.</p>
              </div>
            </div>

            <div className="wr-content__assurance-item">
              <span className="wr-content__assurance-icon">✓</span>
              <div>
                <h4>Export-ready finish</h4>
                <p>Consistent quality for jewellers and houses worldwide.</p>
              </div>
            </div>
          </div>

          <div className="wr-content__stats">
            <div className="wr-content__stat">
              <span className="wr-content__stat-number">35+</span>
              <span className="wr-content__stat-label">Years</span>
            </div>
            <div className="wr-content__stat">
              <span className="wr-content__stat-number">50+</span>
              <span className="wr-content__stat-label">Markets</span>
            </div>
            <div className="wr-content__stat">
              <span className="wr-content__stat-number">100%</span>
              <span className="wr-content__stat-label">Conflict-free</span>
            </div>
            <div className="wr-content__stat">
              <span className="wr-content__stat-number">1</span>
              <span className="wr-content__stat-label">Focus: Fancy cuts</span>
            </div>
          </div>
        </div>
      </article>

      <button
        className="wr-content__back unbutton"
        ref={backRef}
        onClick={handleClose}
        aria-label="Back to Why Choose"
      >
        <svg width="60" height="20" viewBox="0 0 108 23">
          <path
            stroke="#2A2A2A"
            strokeWidth="2"
            fill="none"
            d="M107.5 11.5H1.5M1.5 11.5c8.975-.536 15.087-1.364 18.336-2.484C23.086 7.896 26.64 5.39 30.5 1.5M1.5 11.5c8.975.536 15.087 1.364 18.336 2.484 3.25 1.12 6.804 3.626 10.664 7.516"
          />
        </svg>
        <span>BACK</span>
      </button>
    </section>
  );
};

// ============================================
// MAIN WHYROYAL COMPONENT
// ============================================
const WhyRoyal = ({ headerTransparent = false }) => {
  const cursorRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    {
      id: 1,
      title1: "WHY CHOOSE",
      title2: "ROYAL RAYS",
      author: "ROYAL RAYS LAPIDARY · ANTWERP",
      date: "EST. 1988 — MASTER CRAFTSMEN",
      image: img,
      invert: false,
      excerpt:
        "Discover why Royal Rays has been the pinnacle of high-grade diamond manufacturing since 1988. Precision, heritage, and brilliance beyond compare.",
      content: [
        { type: "img", src: img },
      ],
    },
  ];

  const handleOpen = (index) => {
    setSelectedItem(items[index]);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Keep selectedItem briefly so layout doesn't collapse into the
    // next About section before we scroll back to this block.
    window.setTimeout(() => setSelectedItem(null), 120);
  };

  return (
    <div className="why-royal-container" data-header-transparent={headerTransparent ? "true" : "false"} ref={containerRef}>
      <Cursor ref={cursorRef} isVisible={true} containerRef={containerRef} />

      <main className="wr-main">
        <section
          className="wr-items"
          style={{ display: isOpen ? "none" : undefined }}
          aria-hidden={isOpen}
        >
          {items.map((item, index) => (
            <Item
              key={item.id}
              item={item}
              index={index}
              onOpen={handleOpen}
              isOpen={isOpen}
              containerRef={containerRef}
            />
          ))}
        </section>

        <Content item={selectedItem} isOpen={isOpen} onClose={handleClose} />
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

        .why-royal-container * {
          box-sizing: border-box;
        }

        .why-royal-container {
          position: relative;
          width: 100%;
          background: #F0EDE8;
          color: #1A1A1A;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow: hidden;
          padding: 4rem 2rem 8rem;
          isolation: isolate;
          container-type: inline-size;
          container-name: whyroyal;
        }

        .why-royal-container .unbutton {
          background: none;
          border: 0;
          padding: 0;
          margin: 0;
          font: inherit;
          cursor: pointer;
        }

        /* ============ CURSOR - ONLY INSIDE CONTAINER ============ */
        .why-royal-container .wr-cursor {
          position: fixed;
          top: 0;
          left: 0;
          display: block;
          pointer-events: none;
          z-index: 2147483000;
        }

        .why-royal-container .wr-cursor__inner {
          fill: none;
          stroke: #2A2A2A;
          stroke-width: 1.5px;
          opacity: 0.6;
        }

        .why-royal-container .wr-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          line-height: 0.95;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .why-royal-container .char-wrap {
          display: inline-block;
          position: relative;
          overflow: hidden;
          vertical-align: bottom;
        }

        .why-royal-container .char {
          display: inline-block;
          will-change: transform;
        }

        .why-royal-container .wr-heading .block {
          white-space: nowrap;
        }

        /* ============ ITEM HEADING ============ */
        .why-royal-container .wr-heading--item {
          text-align: right;
          margin-right: 0;
          margin-left: auto;
        }

        .why-royal-container .wr-heading--item > span:first-child {
          font-size: clamp(2.2rem, 9cqw, 6rem);
          color: #1A1A1A;
          letter-spacing: 0.04em;
          display: block;
        }

        .why-royal-container .wr-heading--item > span:nth-child(2) {
          font-size: clamp(1.6rem, 6.5cqw, 4.5rem);
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          text-transform: uppercase;
          margin-top: -0.3rem;
          color: #4A4A4A;
          letter-spacing: 0.15em;
          display: block;
        }

        /* ============ ITEM LAYOUT ============ */
        .why-royal-container .wr-item {
          margin: 8vh 0 16vh;
          position: relative;
        }

        .why-royal-container .wr-item__imgwrap {
          overflow: hidden;
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 340px;
          will-change: transform;
          border-radius: 4px;
        }

        .why-royal-container .wr-item__img {
          width: 100%;
          height: 100%;
          min-height: 340px;
          background-size: cover;
          background-position: center;
          will-change: transform;
          filter: brightness(0.92) contrast(1.02);
          transition: filter 0.5s ease;
        }

        .why-royal-container .wr-item__imgwrap:hover .wr-item__img {
          filter: brightness(1) contrast(1);
        }

        .why-royal-container .wr-item__meta {
          margin: 1.2rem 0 1.5rem;
          line-height: 1.4;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 500;
          color: #777777;
          text-align: right;
        }

        .why-royal-container .wr-item__meta-row {
          display: block;
        }

        /* ============ CIRCLE - 500px ============ */
        .why-royal-container .wr-item__enter {
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
          position: relative;
          z-index: 10;
          width: 500px;
          height: 500px;
        }

        .why-royal-container .wr-item__enter-circle {
          fill: none;
          stroke: #2A2A2A;
          stroke-width: 1.8px;
          will-change: transform, opacity, stroke;
          width: 100%;
          height: 100%;
          pointer-events: none;
          cursor: pointer;
          transition: stroke 0.3s ease;
        }

        /* ============ GRID - 1fr auto 280px 1fr ============ */
        @media screen and (min-width: 53em) {
          .why-royal-container .wr-item {
            display: grid;
            grid-template-areas:
              'image image image enter'
              'meta meta meta meta'
              '... ... excerpt ...';
            grid-template-columns: 1fr auto 280px 1fr;
            grid-template-rows: minmax(380px, 42vh) auto auto;
            align-items: center;
            gap: 0;
          }

          .why-royal-container .wr-item--invert {
            grid-template-areas:
              'enter image image image'
              'meta meta meta meta'
              '... ... excerpt ...';
            grid-template-columns: 1fr auto 280px 1fr;
          }

          .why-royal-container .wr-item__imgwrap {
            grid-area: image;
            height: 100%;
            width: 100%;
            border-radius: 0;
          }

          .why-royal-container .wr-item__enter {
            align-self: center;
            justify-self: start;
            grid-area: enter;
            width: 500px;
            height: 500px;
            margin-left: -250px;
          }

          .why-royal-container .wr-item--invert .wr-item__enter {
            justify-self: end;
            margin-left: 0;
            margin-right: -250px;
          }

          .why-royal-container .wr-item__meta {
            grid-area: meta;
            margin-top: 1.5rem;
          }

          .why-royal-container .wr-item--invert .wr-item__meta {
            justify-self: start;
            text-align: left;
          }

          .why-royal-container .wr-item__excerpt {
            grid-area: excerpt;
            margin-top: 1.5rem;
          }

          .why-royal-container .wr-heading--item {
            margin: 0;
            grid-area: 1 / 1 / 2 / 5;
            justify-self: end;
            align-self: center;
            text-align: right;
            pointer-events: none;
            z-index: 20;
          }

          .why-royal-container .wr-item--invert .wr-heading--item {
            justify-self: start;
            text-align: left;
            padding-right: 0;
            padding-left: 3rem;
          }
        }

        .why-royal-container .wr-item__excerpt {
          line-height: 1.7;
          color: #3A3A3A;
          font-size: 0.9rem;
          max-width: 40ch;
          margin-left: auto;
          text-align: right;
        }

        .why-royal-container .wr-item__excerpt p {
          margin-bottom: 0.75rem;
        }

        .why-royal-container .wr-item__excerpt-link {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 0.5rem;
          cursor: pointer;
          color: #1A1A1A;
          font-weight: 600;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border-bottom: 2px solid #1A1A1A;
          padding-bottom: 4px;
          transition: all 0.3s ease;
        }

        .why-royal-container .wr-item__excerpt-link:hover {
          gap: 1rem;
          opacity: 0.7;
        }

        /* ============ CONTENT — in-flow (NOT fixed/sticky) ============ */
        .why-royal-container .wr-content {
          position: relative;
          z-index: 1;
          width: 100%;
          background: #F0EDE8;
          display: none;
          visibility: hidden;
          opacity: 0;
          margin: 0;
          padding: 0 0 4rem;
          container-type: inline-size;
          container-name: whyroyal;
          transform: none;
        }

        .why-royal-container .wr-content__article {
          padding: 3rem 1.5rem 5rem;
          height: auto;
          width: 100%;
          max-width: 820px;
          overflow: visible;
          margin: 0 auto;
        }

        .why-royal-container .wr-content__article::-webkit-scrollbar {
          width: 4px;
        }

        .why-royal-container .wr-content__article::-webkit-scrollbar-track {
          background: transparent;
        }

        .why-royal-container .wr-content__article::-webkit-scrollbar-thumb {
          background: #2A2A2A;
          border-radius: 10px;
        }

        .why-royal-container .wr-heading--content {
          text-align: center;
          margin-bottom: 2rem;
        }

        .why-royal-container .wr-heading--content > span:first-child {
          font-size: clamp(2rem, 7cqw, 5rem);
          color: #1A1A1A;
        }

        .why-royal-container .wr-heading--content > span:nth-child(2) {
          font-size: clamp(2.5rem, 9cqw, 6.5rem);
          color: #2A2A2A;
          margin-top: -0.2rem;
        }

        /* ============ IMAGE ============ */
        .why-royal-container .wr-content__hero-img-box {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
        }

        .why-royal-container .wr-content__hero-img {
          width: 100%;
          height: auto;
          display: block;
          filter: brightness(0.92) contrast(1.02);
        }

        /* ============ CONTENT TEXT ============ */
        .why-royal-container .wr-content__text {
          color: #1A1A1A;
        }

        .why-royal-container .wr-content__eyebrow {
          margin: 0 0 0.75rem;
          text-align: center;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #777777;
        }

        .why-royal-container .wr-content__summary {
          margin-bottom: 2.5rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid #D0CDCA;
        }

        .why-royal-container .wr-content__summary-text {
          font-size: 1rem;
          line-height: 1.8;
          color: #1A1A1A;
          text-align: center;
          max-width: 55ch;
          margin: 0 auto;
        }

        .why-royal-container .wr-content__topics {
          margin-bottom: 2.5rem;
        }

        .why-royal-container .wr-content__topics-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 400;
          margin-bottom: 1.5rem;
          color: #1A1A1A;
          text-align: center;
          letter-spacing: 0.05em;
        }

        .why-royal-container .wr-content__topic {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.8rem 0;
          border-bottom: 1px solid #E5E2DE;
        }

        .why-royal-container .wr-content__topic:last-child {
          border-bottom: none;
        }

        .why-royal-container .wr-content__topic-icon {
          font-size: 1rem;
          color: #2A2A2A;
          min-width: 20px;
          padding-top: 2px;
        }

        .why-royal-container .wr-content__topic h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0 0 0.2rem 0;
          color: #1A1A1A;
        }

        .why-royal-container .wr-content__topic p {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #4A4A4A;
          margin: 0;
        }

        .why-royal-container .wr-content__assurance {
          margin: 2.5rem 0;
          padding: 2rem 0;
          border-top: 1px solid #D0CDCA;
          border-bottom: 1px solid #D0CDCA;
        }

        .why-royal-container .wr-content__assurance-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 400;
          margin-bottom: 0.75rem;
          color: #1A1A1A;
          text-align: center;
          letter-spacing: 0.05em;
        }

        .why-royal-container .wr-content__assurance-lead {
          margin: 0 auto 1.75rem;
          max-width: 48ch;
          text-align: center;
          font-size: 0.9rem;
          line-height: 1.7;
          color: #4A4A4A;
        }

        .why-royal-container .wr-content__certs {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem;
          margin: 0 0 1.75rem;
        }

        .why-royal-container .wr-content__cert {
          margin: 0;
          text-align: center;
        }

        .why-royal-container .wr-content__cert img {
          width: 100%;
          max-height: 220px;
          object-fit: contain;
          display: block;
          background: #fff;
          border: 1px solid #D0CDCA;
          border-radius: 4px;
          padding: 0.75rem;
        }

        .why-royal-container .wr-content__cert figcaption {
          margin-top: 0.55rem;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #777777;
        }

        .why-royal-container .wr-content__assurance-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.7rem 0;
          border-bottom: 1px solid #E5E2DE;
        }

        .why-royal-container .wr-content__assurance-item:last-child {
          border-bottom: none;
        }

        .why-royal-container .wr-content__assurance-icon {
          font-size: 1rem;
          color: #1A1A1A;
          min-width: 20px;
          padding-top: 2px;
          font-weight: 700;
        }

        .why-royal-container .wr-content__assurance-item h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0 0 0.2rem 0;
          color: #1A1A1A;
        }

        .why-royal-container .wr-content__assurance-item p {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #4A4A4A;
          margin: 0;
        }

        .why-royal-container .wr-content__stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin: 2rem 0;
          padding: 1.5rem 0;
          text-align: center;
        }

        .why-royal-container .wr-content__stat {
          display: flex;
          flex-direction: column;
        }

        .why-royal-container .wr-content__stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3cqw, 2.8rem);
          font-weight: 400;
          color: #1A1A1A;
          letter-spacing: -0.02em;
        }

        .why-royal-container .wr-content__stat-label {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #777777;
          margin-top: 0.2rem;
        }

        /* ============ BACK BUTTON ============ */
        .why-royal-container .wr-content__back {
          position: relative;
          left: auto;
          bottom: auto;
          transform: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          margin: 0 auto 1rem;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #1A1A1A;
          z-index: 2;
          padding: 0.8rem 1.8rem;
          background: rgba(255,255,255,0.7);
          border-radius: 50px;
          border: 1px solid #D0CDCA;
          transition: all 0.3s ease;
        }

        .why-royal-container .wr-content__back:hover {
          background: #1A1A1A;
          color: #F0EDE8;
          border-color: #1A1A1A;
          gap: 1.2rem;
        }

        .why-royal-container .wr-content__back:hover svg path {
          stroke: #F0EDE8;
        }

        .why-royal-container .wr-content__back svg path {
          transition: stroke 0.3s ease;
        }

        /* ============ RESPONSIVE ============ */
        @media screen and (max-width: 768px) {
          .why-royal-container {
            padding: 2rem 1.2rem 6rem;
          }

          .why-royal-container .wr-heading--item {
            text-align: center;
          }

          .why-royal-container .wr-heading--item > span:first-child {
            font-size: clamp(2rem, 8cqw, 4rem);
          }

          .why-royal-container .wr-heading--item > span:nth-child(2) {
            font-size: clamp(1.3rem, 5cqw, 2.5rem);
          }

          .why-royal-container .wr-item__enter {
            display: none !important;
          }

          .why-royal-container .wr-content__hero-img-box {
            width: 90%;
          }

          .why-royal-container .wr-content__certs {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .why-royal-container .wr-content__cert img {
            max-height: 200px;
          }

          .why-royal-container .wr-content__back {
            bottom: auto;
            padding: 0.6rem 1.2rem;
            font-size: 0.55rem;
            gap: 0.5rem;
            margin-top: 1rem;
          }

          .why-royal-container .wr-content__back span {
            display: none;
          }

          .why-royal-container .wr-content__article {
            padding: 4rem 1.2rem 8rem;
          }

          .why-royal-container .wr-item__meta {
            text-align: center;
          }

          .why-royal-container .wr-item__excerpt {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
          }

          .why-royal-container .wr-content__stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ============ TABLET RESPONSIVE ============ */
        @media screen and (min-width: 769px) and (max-width: 1024px) {
          .why-royal-container .wr-item__enter {
            width: 350px;
            height: 350px;
            margin-left: -175px;
          }

          .why-royal-container .wr-item--invert .wr-item__enter {
            margin-left: 0;
            margin-right: -175px;
          }

          .why-royal-container .wr-item {
            grid-template-columns: 1fr auto 200px 1fr;
          }

          .why-royal-container .wr-heading--item > span:first-child {
            font-size: clamp(2rem, 7cqw, 4.5rem);
          }

          .why-royal-container .wr-heading--item > span:nth-child(2) {
            font-size: clamp(1.4rem, 5cqw, 3.5rem);
          }
        }
      `}</style>
    </div>
  );
};

export default WhyRoyal;