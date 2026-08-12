import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HistoryPage from "./components/TimeLine";
import TypographyMotion from "./components/Typographymotion";

gsap.registerPlugin(ScrollTrigger);

function OurHistory() {
  const mainRef = useRef(null);

  useEffect(() => {
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef}>
      <Helmet>
        <title>Our Legacy — Royal Rays BV</title>
        <meta
          name="description"
          content="Discover the rich legacy of Royal Rays BV — over 40 years of excellence in diamond craftsmanship, innovation, and heritage in Antwerp"
        />
      </Helmet>
      <TypographyMotion />
      <HistoryPage />
    </div>
  );
}

export default OurHistory;