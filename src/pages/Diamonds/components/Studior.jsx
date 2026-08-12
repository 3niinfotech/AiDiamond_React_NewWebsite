// Studior.jsx
import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import * as ScrollMagic from 'scrollmagic';

const styles = `
:root {
  --primary: #212121;
  --secondary: #515151;
  --white: #ffffff;
}
.studio-r * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.studio-r {
  background-color: var(--primary);
  height: 100%;
  color: var(--white);
  overflow-x: hidden;
}
.studio-r.overflow-hidden {
  overflow: hidden !important;
  position: fixed;
  width: 100%;
}
.studio-r h1,
.studio-r h2,
.studio-r h3 {
  margin-bottom: 30px;
  font-size: 24px;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  color: var(--white);
  letter-spacing: 1.2px;
  text-transform: uppercase;
}
.studio-r p {
  font-size: 45px;
  line-height: 1.4;
  font-family: "Titillium Web", sans-serif;
  font-weight: 200;
}
.studio-r .pinWrapper {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 11;
}
.studio-r .scrollmagic-pin-spacer {
  position: absolute !important;
  clip: rect(auto, auto, auto, auto);
}
.studio-r .event {
  position: relative;
  overflow: hidden;
  height: 100svh;
  width: 100vw;
  z-index: 1;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.studio-r .event::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.studio-r #section1.event::before {
  background-color: rgb(21 22 28 / 15%);
}
.studio-r #section2.event::before {
  background-color: rgb(21 22 28 / 34%);
}
.studio-r #section3.event::before {
  background-color: rgb(86 82 76 / 57%);
}
.studio-r #section4.event::before {
  background-color: rgb(120 115 103 / 58%);
}
.studio-r #section1 {
  background-image: url("https://www.yudiz.com/codepen/studio-r/bg-living.jpg");
}
.studio-r #section2 {
  background-image: url("https://www.yudiz.com/codepen/studio-r/bg-kitchen.jpg");
}
.studio-r #section3 {
  background-image: url("https://www.yudiz.com/codepen/studio-r/bg-badroom.jpg");
}
.studio-r #section4 {
  background-image: url("https://www.yudiz.com/codepen/studio-r/bg-office.jpg");
}
.studio-r .image {
  height: 100%;
  width: 100%;
  top: 0%;
  left: 0%;
  position: absolute;
  background-size: cover;
  background-position: center center;
  transition: width 1s, height 1s;
  box-shadow: 2px 2px 10px 10px rgb(0 0 0 / 12%);
  transform-origin: center;
  z-index: 8888;
  overflow: hidden;
  border-radius: 0;
}
.studio-r .image:not(#loaderVideo) {
  top: -50%;
  width: 500px;
  height: 500px;
  left: auto;
  right: 100px;
  position: absolute;
  border-radius: 12px;
  transform: translate(0%, -50%);
}
.studio-r #section1 .image video {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center center;
  position: absolute;
  top: 0;
  left: 0;
}
.studio-r #section2 .image {
  background-image: url("https://www.yudiz.com/codepen/studio-r/bg-kitchen.jpg");
}
.studio-r #section3 .image {
  background-image: url("https://www.yudiz.com/codepen/studio-r/bg-badroom.jpg");
}
.studio-r #section4 .image {
  background-image: url("https://www.yudiz.com/codepen/studio-r/bg-office.jpg");
}
.studio-r .text {
  top: -50%;
  left: 0;
  position: absolute;
  transform: translate(100px, -50%);
  width: 43%;
}
.studio-r #section1 .text {
  top: 50%;
}
.studio-r .scrollBtn {
  position: absolute;
  bottom: 2.5%;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100px;
  height: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  z-index: 1;
  transition: all ease-in-out 0.35s;
}
.studio-r .scrollBtn.move {
  visibility: hidden;
  opacity: 0;
}
.studio-r .scrollBtn span {
  width: 12px;
  height: 12px;
  display: block;
  border-bottom: 2px solid var(--white);
  border-right: 2px solid var(--white);
  transform: rotate(45deg);
  animation: studio-r-animate 2s infinite;
  margin: auto;
}
.studio-r .scrollBtn h6 {
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  font-family: "Titillium Web", sans-serif;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
}
@keyframes studio-r-animate {
  0% {
    opacity: 0;
    transform: rotate(45deg) translate(-10px, -10px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translate(10px, 10px);
  }
}
.studio-r #preloader {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1s;
}
.studio-r #preloader img,
.studio-r #preloader video {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}
.studio-r #preloader::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";
  z-index: 1;
}
.studio-r .text-wrapper {
  text-align: center;
  height: 24px;
  overflow: hidden;
  transition: opacity 1s;
}
.studio-r #first-text {
  animation: studio-r-moveUp 1s 1s forwards;
}
.studio-r #second-text {
  opacity: 0;
  transform: translateY(-30px);
  animation: studio-r-scrollup 1s 1.2s forwards,
    studio-r-moveUpAgain 1s 2.2s forwards;
}
@keyframes studio-r-moveUp {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px);
    opacity: 0;
  }
}
@keyframes studio-r-scrollup {
  100% {
    transform: translateY(-54px);
  }
}
@keyframes studio-r-moveUpAgain {
  0% {
    transform: translateY(-54px);
    opacity: 1;
  }
  60% {
    transform: translateY(-54px);
    opacity: 1;
  }
  100% {
    transform: translateY(-60px);
    opacity: 0;
  }
}
@media screen and (max-width: 1399px) {
  .studio-r h2 {
    font-size: 22px;
  }
  .studio-r p {
    font-size: 38px;
  }
  .studio-r .text {
    transform: translate(60px, -50%);
  }
  .studio-r .image:not(#loaderVideo) {
    height: 450px;
    width: 450px;
    right: 80px;
    transform: translate(0%, -50%);
  }
}
@media screen and (max-width: 1199px) {
  .studio-r h2 {
    font-size: 20px;
  }
  .studio-r p {
    font-size: 34px;
  }
  .studio-r .text {
    transform: translate(40px, -50%);
    width: 44%;
  }
  .studio-r .image:not(#loaderVideo) {
    height: 400px;
    width: 400px;
    right: 60px;
    transform: translate(0%, -50%);
  }
}
@media screen and (max-width: 991px) {
  .studio-r h2 {
    font-size: 18px;
  }
  .studio-r p {
    font-size: 26px;
  }
  .studio-r .text {
    transform: translate(24px, -50%);
    width: 44%;
  }
  .studio-r .image:not(#loaderVideo) {
    height: 310px;
    width: 310px;
    right: 40px;
    transform: translate(0%, -50%);
  }
}
@media screen and (max-width: 767px) {
  .studio-r h2 {
    font-size: 16px;
  }
  .studio-r p {
    font-size: 22px;
  }
  .studio-r .image:not(#loaderVideo) {
    height: 220px;
    width: 220px;
  }
}
@media screen and (max-width: 576px) {
  .studio-r .text {
    top: -36%;
    width: calc(100% - 80px);
  }
  .studio-r #section1 .text {
    top: 64%;
  }
  .studio-r .image:not(#loaderVideo) {
    top: -75%;
    left: 24px;
    right: auto;
    transform: translate(0%, -25%);
  }
}
`;

export default function StudioR({ headerTransparent = true }) {
  const scrollBtnRef = useRef(null);
  const preloaderRef = useRef(null);
  const firstTextRef = useRef(null);
  const secondTextRef = useRef(null);
  const loaderVideoRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('studior-active');
    return () => {
      document.body.classList.remove('studior-active');
    };
  }, []);

  useEffect(() => {
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Titillium+Web:wght@200;400&family=Poppins:wght@500&display=swap";

    document.head.appendChild(preconnect1);
    document.head.appendChild(preconnect2);
    document.head.appendChild(fontLink);

    return () => {
      document.head.removeChild(preconnect1);
      document.head.removeChild(preconnect2);
      document.head.removeChild(fontLink);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", (e) => {
      console.log(e);
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const box = scrollBtnRef.current;
      if (!box) return;
      if (window.scrollY > 0) {
        box.classList.add("move");
      } else {
        box.classList.remove("move");
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const preloader = preloaderRef.current;
    const firstText = firstTextRef.current;
    const secondText = secondTextRef.current;

    if (firstText) firstText.style.opacity = "1";

    const t1 = setTimeout(() => {
      if (firstText) firstText.style.opacity = "0";
      if (secondText) secondText.style.opacity = "1";
    }, 1000);

    const t2 = setTimeout(() => {
      if (preloader) preloader.style.display = "none";
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    document.documentElement.classList.add("overflow-hidden");

    const t1 = setTimeout(() => {
      const loaderVideo = loaderVideoRef.current;
      if (!loaderVideo) return;
      loaderVideo.style.width = "90%";
      loaderVideo.style.height = "90%";
      loaderVideo.style.transform = "translate(-50%, -50%)";
      loaderVideo.style.top = "50%";
      loaderVideo.style.left = "50%";
      loaderVideo.style.position = "fixed";
      loaderVideo.style.borderRadius = "12px";
    }, 2000);

    const t2 = setTimeout(() => {
      const loaderVideo = loaderVideoRef.current;
      if (!loaderVideo) return;

      if (window.matchMedia("(max-width: 576px)").matches) {
        loaderVideo.style.width = "220px";
        loaderVideo.style.height = "220px";
        loaderVideo.style.top = "25%";
        loaderVideo.style.left = "24px";
        loaderVideo.style.right = "auto";
        loaderVideo.style.transform = "translate(0%, -25%)";
      } else if (window.matchMedia("(max-width: 767px)").matches) {
        loaderVideo.style.width = "220px";
        loaderVideo.style.height = "220px";
        loaderVideo.style.left = "auto";
        loaderVideo.style.right = "40px";
        loaderVideo.style.transform = "translate(0%, -50%)";
      } else if (window.matchMedia("(max-width: 991px)").matches) {
        loaderVideo.style.width = "310px";
        loaderVideo.style.height = "310px";
        loaderVideo.style.left = "auto";
        loaderVideo.style.right = "40px";
        loaderVideo.style.transform = "translate(0%, -50%)";
      } else if (window.matchMedia("(max-width: 1199px)").matches) {
        loaderVideo.style.width = "400px";
        loaderVideo.style.height = "400px";
        loaderVideo.style.left = "auto";
        loaderVideo.style.right = "60px";
        loaderVideo.style.transform = "translate(0%, -50%)";
      } else if (window.matchMedia("(max-width: 1399px)").matches) {
        loaderVideo.style.width = "450px";
        loaderVideo.style.height = "450px";
        loaderVideo.style.left = "auto";
        loaderVideo.style.right = "80px";
        loaderVideo.style.transform = "translate(0%, -50%)";
      } else {
        loaderVideo.style.width = "500px";
        loaderVideo.style.height = "500px";
        loaderVideo.style.top = "50%";
        loaderVideo.style.left = "auto";
        loaderVideo.style.right = "100px";
        loaderVideo.style.transform = "translate(0%, -50%)";
        loaderVideo.style.position = "absolute";
      }

      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const controller = new ScrollMagic.Controller({ loglevel: 3 });

    const scene1 = new ScrollMagic.Scene({
      triggerElement: "#section2",
      triggerHook: "onEnter",
      duration: "100%",
    })
      .setPin("#section1 .pinWrapper", { pushFollowers: false })
      .addTo(controller);

    const scene2 = new ScrollMagic.Scene({
      triggerElement: "#section2",
      triggerHook: "onEnter",
      duration: "200%",
    })
      .setPin("#section2 .pinWrapper", { pushFollowers: false })
      .addTo(controller);

    const scene3 = new ScrollMagic.Scene({
      triggerElement: "#section3",
      triggerHook: "onEnter",
      duration: "200%",
    })
      .setPin("#section3 .pinWrapper", { pushFollowers: false })
      .addTo(controller);

    const scene4 = new ScrollMagic.Scene({
      triggerElement: "#section4",
      triggerHook: "onEnter",
      duration: "100%",
    })
      .setPin("#section4 .pinWrapper", { pushFollowers: false })
      .addTo(controller);

    return () => {
      scene1.destroy(true);
      scene2.destroy(true);
      scene3.destroy(true);
      scene4.destroy(true);
      controller.destroy(true);
    };
  }, []);

  return (
    <div className="studio-r">
      <style>{styles}</style>

      <div
        id="section1"
        className="event"
        data-header-transparent="true"
        data-header-hero="true"
      >
        <div className="pinWrapper">
          <div className="text">
            <h2>Diamond Cuts & Shapes</h2>
            <p>
              Explore iconic diamond cuts, each crafted to maximize brilliance,
              fire, and timeless elegance through exceptional precision.
            </p>
          </div>
          <div className="image" id="loaderVideo" ref={loaderVideoRef}>
            <video autoPlay loop muted playsInline>
              <source
                src="https://www.yudiz.com/codepen/studio-r/bg-video.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>

        <div className="scrollBtn" ref={scrollBtnRef}>
          <h6>scroll</h6>
          <span></span>
        </div>
      </div>

      <div id="section2" className="event">
        <div className="pinWrapper">
          <div className="text">
            <h2>Precision in Every Facet</h2>
            <p>
              Every cut is designed to reveal extraordinary light performance,
              symmetry, and refined craftsmanship.
            </p>
          </div>
          <div className="image"></div>
        </div>
      </div>

      <div id="section3" className="event">
        <div className="pinWrapper">
          <div className="text">
            <h2>Beauty Through Light</h2>
            <p>
              Discover how every diamond shape creates its own unique brilliance,
              sparkle, and visual character.
            </p>
          </div>
          <div className="image"></div>
        </div>
      </div>

      <div id="section4" className="event">
        <div className="pinWrapper">
          <div className="text">
            <h2>Explore Every Shape</h2>
            <p>
              From Round Brilliant to Cushion and Emerald, experience the artistry
              behind the world's most celebrated diamond cuts.
            </p>
          </div>
          <div className="image"></div>
        </div>
      </div>


    </div>
  );
}