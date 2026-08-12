import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EventsUpdates from "./components/EventsUpdates";
import GridAnimation from "./components/GridAnimation";

gsap.registerPlugin(ScrollTrigger);

function Event() {
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
        <title>Events — Royal Rays BV</title>
        <meta
          name="description"
          content="Explore Royal Rays' global events and exhibitions showcasing the finest diamond craftsmanship."
        />
      </Helmet>
      <GridAnimation />
      <EventsUpdates />
    </div>
  );
}

export default Event;