import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollWorkSection from "./components/Scrollworksection";
import WhyRoyalRays from "./components/WhyRoyalRays";
import WhyRoyal from "./components/whyRoyel";
import LeadershipSection from "./components/LeadershipSection";
import CtaSection from "./components/CtaSection";

function About() {
  const mainRef = useRef(null);

  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(id);
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div ref={mainRef}>
      <Helmet>
        <title>About — Royal Rays BV</title>
        <meta
          name="description"
          content="Discover Royal Rays BV — the Antwerp house behind natural fancy-cut diamonds. Family craft, ethical sourcing, and partnerships built on precision."
        />
      </Helmet>
      <ScrollWorkSection />
      <WhyRoyalRays />
      <WhyRoyal />
      <LeadershipSection />
      <CtaSection />
    </div>
  );
}

export default About;