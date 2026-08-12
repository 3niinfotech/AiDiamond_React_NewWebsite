import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StudioR from "./components/Studior";
import StickySections from "./components/Stickysections";
import UnrevealEffects from "./components/Unrevealeffects";
import Diamondcutshowcase from "./components/Diamondcutshowcase";

gsap.registerPlugin(ScrollTrigger);

const Diamonds = () => {
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
        <title>Diamonds — Royal Rays BV</title>
        <meta
          name="description"
          content="Discover the exquisite craftsmanship and precision involved in creating the world's most stunning diamonds."
        />
      </Helmet>
      <StudioR />
      <Diamondcutshowcase />
    </div>
  );
};

export default Diamonds;