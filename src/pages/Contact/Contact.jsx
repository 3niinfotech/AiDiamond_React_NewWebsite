import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./components/Hero";
import OfficeDetails from "./components/OfficeDetails";

gsap.registerPlugin(ScrollTrigger);

function Contact() {
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
        <title>Contact — Royal Rays BV</title>
        <meta
          name="description"
          content="Get in touch with Royal Rays to learn more about our diamond products and services."
        />
      </Helmet>
      <Hero />
      <OfficeDetails />
    </div>
  );
}

export default Contact;