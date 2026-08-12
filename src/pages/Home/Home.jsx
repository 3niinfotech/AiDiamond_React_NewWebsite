import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import StackCards from "./components/StackCards";
import HorizontalScroll from "./components/HorizontalScroll";
import Testimonials from "./components/Testimonials";
import Compliance from "./components/Compliance";
import AppSection from "./components/AppSection";
import CtaSection from "../About/components/CtaSection";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
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
        <title>Royal Rays BV — The Art of Diamond Manufacturing</title>
        <meta
          name="description"
          content="Discover the exquisite craftsmanship and precision involved in creating the world's most stunning diamonds."
        />
      </Helmet>
      <Hero />
      <Marquee />
      <StackCards />
      <HorizontalScroll />
      <Testimonials />
      <AppSection />
      <Compliance />
      <CtaSection />
    </div>
  );
};

export default Home;