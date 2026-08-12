import React, { useEffect, useState, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { resetScrollPosition } from "../../utils/scroll";
import ScrollIndicator from "../ui/ScrollIndicator";
import CookieConsent from "../ui/CookieConsent";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "./Loader";

const pageVariants = {
  initial: {
    opacity: 0,
  },

  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  exit: {
    opacity: 0,
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const MainLayout = () => {
  const [loaderVisible, setLoaderVisible] =
    useState(true);

  const location = useLocation();

  /*
   * Initial website loader
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaderVisible(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    resetScrollPosition();
  }, [location.pathname]);

  return (
    <div className="app">
      <div className="grain" />


      <ScrollIndicator />

      <Header />

      <AnimatePresence
        mode="sync"
        initial={false}
      >
        <motion.main
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="min-h-screen"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />

      <CookieConsent />

      {loaderVisible && <Loader />}
    </div>
  );
};

export default MainLayout;