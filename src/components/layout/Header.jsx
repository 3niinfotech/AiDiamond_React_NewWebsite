import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RiDiamondLine, RiDiamondFill } from "react-icons/ri";
import {
  FaUser,
  FaHome,
  FaCalendar,
  FaGem,
  FaInfoCircle,
  FaEnvelope,
  FaBlog,
  FaTimes,
  FaHistory,
} from "react-icons/fa";
import logoLight from "../../assets/images/whitelogo.png";
import logoDark from "../../assets/images/logo.png";
import { resetScrollPosition } from "../../utils/scroll";

const SCROLL_HIDE_START = 100;
const SCROLL_DELTA_MIN = 5;
const HERO_END_BUFFER_DOWN = 20;
const HERO_END_BUFFER_UP = 40;

const getScrollY = () =>
  window.pageYOffset ||
  document.documentElement.scrollTop ||
  document.body.scrollTop ||
  0;

const getHeaderHeight = () => {
  if (typeof window === "undefined") return 72;
  if (window.innerWidth >= 1024) return 88;
  if (window.innerWidth >= 768) return 80;
  return 64;
};

const isHeroStillVisible = (scrollingUp = false) => {
  const headerHeight = getHeaderHeight();

  // Force transparent header for full dark cinematic blocks (e.g. About scroll hero)
  const darkZone = document.querySelector('[data-header-dark-zone="true"]');
  if (darkZone) {
    const zoneRect = darkZone.getBoundingClientRect();
    if (scrollingUp) {
      return zoneRect.bottom > headerHeight - HERO_END_BUFFER_UP;
    }
    return zoneRect.bottom > headerHeight + HERO_END_BUFFER_DOWN;
  }

  const hero =
    document.querySelector('[data-header-hero="true"]') ||
    document.querySelector('[data-header-transparent="true"]');
  const heroEnd = document.querySelector('[data-header-hero-end="true"]');

  const getHeroRect = (el) => {
    const target = el.querySelector(".pinWrapper") || el;
    return target.getBoundingClientRect();
  };

  if (hero) {
    const pinWrapper = hero.querySelector(".pinWrapper");
    const rect = getHeroRect(hero);
    const isSticky = hero.classList.contains("sticky");

    if (pinWrapper) {
      if (scrollingUp) {
        return rect.bottom > 0 && rect.top < window.innerHeight;
      }
      return rect.bottom > headerHeight;
    }

    if (isSticky && heroEnd) {
      const endRect = heroEnd.getBoundingClientRect();
      if (scrollingUp) {
        return endRect.top > headerHeight - HERO_END_BUFFER_UP;
      }
      return endRect.top > headerHeight + HERO_END_BUFFER_DOWN;
    }

    if (scrollingUp) {
      return rect.bottom > 0 && rect.top < window.innerHeight;
    }

    return rect.bottom > headerHeight;
  }

  if (heroEnd) {
    const endRect = heroEnd.getBoundingClientRect();
    if (scrollingUp) {
      return endRect.top > headerHeight - HERO_END_BUFFER_UP;
    }
    return endRect.top > headerHeight + HERO_END_BUFFER_DOWN;
  }

  return false;
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSolidTheme, setIsSolidTheme] = useState(() => {
    if (typeof document === "undefined") return true;
    // Avoid white-header flash on dark hero pages (About, etc.)
    return !(
      document.querySelector('[data-header-dark-zone="true"]') ||
      document.querySelector('[data-header-hero="true"]') ||
      document.querySelector('[data-header-transparent="true"]')
    );
  });
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef("down");
  const pageHasTransparentHero = useRef(false);
  const scrollTicking = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  const detectTransparentHeroPage = useCallback(() => {
    pageHasTransparentHero.current = !!(
      document.querySelector('[data-header-dark-zone="true"]') ||
      document.querySelector('[data-header-hero="true"]') ||
      document.querySelector('[data-header-transparent="true"]')
    );
    return pageHasTransparentHero.current;
  }, []);

  const updateHeaderOnScroll = useCallback(() => {
    const currentY = Math.max(0, getScrollY());
    const delta = currentY - lastScrollY.current;

    if (currentY <= 0) {
      scrollDirection.current = "up";
    } else if (Math.abs(delta) >= SCROLL_DELTA_MIN) {
      scrollDirection.current = delta > 0 ? "down" : "up";
    }

    const scrollingUp = scrollDirection.current === "up";
    const onAbout = location.pathname === "/about";

    // Re-detect each tick so About dark zone is caught after mount
    if (onAbout) detectTransparentHeroPage();

    let solid = true;
    if (mobileMenuOpen) {
      solid = true;
    } else if (pageHasTransparentHero.current || onAbout) {
      // Force transparent while About dark cinematic zone is on screen
      solid = !isHeroStillVisible(scrollingUp);
      if (onAbout && currentY < 80) solid = false;
    }

    setIsSolidTheme(solid);

    if (mobileMenuOpen || currentY <= SCROLL_HIDE_START) {
      setIsHidden(false);
    } else if (Math.abs(delta) >= SCROLL_DELTA_MIN) {
      setIsHidden(delta > 0);
    }

    lastScrollY.current = currentY;
  }, [mobileMenuOpen, location.pathname, detectTransparentHeroPage]);

  const syncHeaderState = useCallback(() => {
    detectTransparentHeroPage();
    lastScrollY.current = getScrollY();
    scrollDirection.current = "down";
    updateHeaderOnScroll();
  }, [detectTransparentHeroPage, updateHeaderOnScroll]);

  useLayoutEffect(() => {
    syncHeaderState();
    const raf = requestAnimationFrame(() => {
      syncHeaderState();
      requestAnimationFrame(syncHeaderState);
    });
    const t1 = setTimeout(syncHeaderState, 60);
    const t2 = setTimeout(syncHeaderState, 250);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [location.pathname, syncHeaderState]);

  useEffect(() => {
    const runScrollUpdate = () => {
      if (scrollTicking.current) return;
      scrollTicking.current = true;
      requestAnimationFrame(() => {
        updateHeaderOnScroll();
        scrollTicking.current = false;
      });
    };

    window.addEventListener("scroll", runScrollUpdate, { passive: true });
    window.addEventListener("resize", runScrollUpdate, { passive: true });
    ScrollTrigger.addEventListener("scrollEnd", runScrollUpdate);
    ScrollTrigger.addEventListener("refresh", runScrollUpdate);

    runScrollUpdate();

    return () => {
      window.removeEventListener("scroll", runScrollUpdate);
      window.removeEventListener("resize", runScrollUpdate);
      ScrollTrigger.removeEventListener("scrollEnd", runScrollUpdate);
      ScrollTrigger.removeEventListener("refresh", runScrollUpdate);
    };
  }, [updateHeaderOnScroll]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    updateHeaderOnScroll();
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, updateHeaderOnScroll]);

  const handleNavClick = (e, path) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(path);
  };

  const navLinks = [
    { path: "/", label: "Home", icon: <FaHome size={17} /> },
    { path: "/event", label: "Event", icon: <FaCalendar size={17} /> },
    { path: "/diamonds", label: "Diamonds", icon: <FaGem size={17} /> },
    { path: "/our-legacy", label: "Our Legacy", icon: <FaHistory size={17} /> },
    { path: "/about", label: "About", icon: <FaInfoCircle size={17} /> },
    { path: "/contact", label: "Contact", icon: <FaEnvelope size={17} /> },
    { path: "/blog", label: "Blog", icon: <FaBlog size={17} /> },
  ];

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const drawerVariants = {
    closed: {
      x: "100%",
      transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] },
    },
    open: {
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: 30 },
    open: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 400, damping: 30 },
    },
  };

  return (
    <>
      <style>{`
        .royal-header-fixed {
          all: initial;
          display: flex !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 99999 !important;
          height: 72px !important;
          min-height: 72px !important;
          align-items: center !important;
          padding: 0 20px !important;
          background: transparent !important;
          border-bottom: 1px solid transparent !important;
          transition: background 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                      backdrop-filter 0.45s cubic-bezier(0.22, 1, 0.36, 1) !important;
          will-change: transform, background !important;
          font-family: 'Inter', sans-serif !important;
          box-sizing: border-box !important;
        }
        @media (min-width: 768px) {
          .royal-header-fixed {
            height: 80px !important;
            min-height: 80px !important;
            padding: 0 32px !important;
          }
        }
        @media (min-width: 1024px) {
          .royal-header-fixed {
            height: 88px !important;
            min-height: 88px !important;
            padding: 0 48px !important;
          }
        }
        .royal-header-fixed.header-hidden {
          transform: translateY(-100%) !important;
        }
        .royal-header-fixed.scrolled {
          background: rgba(255, 255, 255, 0.97) !important;
          backdrop-filter: blur(14px) !important;
          -webkit-backdrop-filter: blur(14px) !important;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08) !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
        }
        .royal-header-container {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          width: 100% !important;
          max-width: 1500px !important;
          margin: 0 auto !important;
          height: 100% !important;
        }
        .royal-logo-link {
          display: flex !important;
          align-items: center !important;
          text-decoration: none !important;
          flex-shrink: 0 !important;
          height: 100% !important;
          transition: opacity 0.3s ease, transform 0.3s ease !important;
        }
        .royal-logo-link.hidden-logo {
          display: none !important;
        }
        .royal-menu-title {
          display: none !important;
        }

        @media (max-width: 1023px) {
          .royal-menu-title {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            flex: 1 1 auto !important;
            width: auto !important;
            height: 64px !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: 'Inter', sans-serif !important;
            font-size: 18px !important;
            font-weight: 500 !important;
            line-height: 1 !important;
            letter-spacing: 0.22em !important;
            text-transform: uppercase !important;
            color: #1a1a1a !important;
            text-align: left !important;
          }
          .royal-header-fixed:not(.menu-open) .royal-menu-title {
            display: none !important;
          }
        }
        
        .royal-logo-image {
          width: auto !important;
          object-fit: contain !important;
          display: block !important;
          transition: opacity 0.3s ease !important;
        }
        
        /* LIGHT LOGO (White background) - Desktop */
        .royal-logo-image.light-logo {
          height: 166px !important;
          max-height: 165px !important;
          min-height: 165px !important;
          width: auto !important;
          max-width: 220px !important;
        }
        
        /* DARK LOGO - Desktop */
        .royal-logo-image.dark-logo {
          height: 40px !important;
          max-height: 40px !important;
          min-height: 40px !important;
          width: auto !important;
          max-width: 180px !important;
        }
        
        @media (min-width: 768px) {
          .royal-logo-image.dark-logo {
            height: 45px !important;
            max-height: 45px !important;
            min-height: 45px !important;
            max-width: 200px !important;
          }
          .royal-logo-image.light-logo {
            max-width: 260px !important;
          }
        }
        
        @media (min-width: 1024px) {
          .royal-logo-image.dark-logo {
            height: 50px !important;
            max-height: 50px !important;
            min-height: 50px !important;
            max-width: 220px !important;
          }
          .royal-logo-image.light-logo {
            max-width: 240px !important;
          }
        }

        /* MOBILE LOGO SIZES */
        @media (max-width: 1023px) {
          .royal-header-fixed {
            height: 64px !important;
            min-height: 64px !important;
            padding: 0 16px !important;
            background: transparent !important;
          }
          .royal-header-fixed.scrolled {
            background: rgba(255, 255, 255, 0.97) !important;
            backdrop-filter: blur(14px) !important;
            -webkit-backdrop-filter: blur(14px) !important;
          }
          .royal-header-fixed.menu-open {
            background: #ffffff !important;
          }
          .royal-logo-link {
            height: 64px !important;
          }
          
          /* Light Logo Mobile */
          .royal-logo-image.light-logo {
            height: 40px !important;
            max-height: 40px !important;
            min-height: 40px !important;
            max-width: 165px !important;
            width: auto !important;
          }
          
          /* Dark Logo Mobile */
          .royal-logo-image.dark-logo {
            height: 30px !important;
            max-height: 30px !important;
            min-height: 30px !important;
            max-width: 165px !important;
            width: auto !important;
          }
          
          .royal-menu-btn {
            width: 40px !important;
            height: 40px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          .royal-header-fixed.scrolled .royal-menu-btn {
            background: rgba(0, 0, 0, 0.05) !important;
            border-color: rgba(0, 0, 0, 0.08) !important;
          }
          .royal-menu-btn.open {
            background: rgba(0, 0, 0, 0.08) !important;
            border-color: rgba(0, 0, 0, 0.12) !important;
          }
          .royal-menu-line {
            background: #ffffff !important;
          }
          .royal-header-fixed.scrolled .royal-menu-line:not(.open) {
            background: #1a1a1a !important;
          }
          .royal-menu-line.open {
            background: #1a1a1a !important;
          }
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .royal-header-fixed {
            padding: 0 24px !important;
          }
          .royal-logo-image.light-logo {
            height: 50px !important;
            max-height: 50px !important;
            min-height: 50px !important;
            max-width: 160px !important;
          }
          .royal-logo-image.dark-logo {
            height: 35px !important;
            max-height: 35px !important;
            min-height: 35px !important;
            max-width: 160px !important;
          }
        }

        .royal-nav-desktop {
          display: none !important;
          align-items: center !important;
          gap: 2px !important;
          padding: 4px !important;
          border-radius: 9999px !important;
          background: rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(4px) !important;
          transition: background 0.3s ease !important;
        }
        @media (min-width: 1024px) {
          .royal-nav-desktop {
            display: flex !important;
          }
        }
        .royal-header-fixed.scrolled .royal-nav-desktop {
          background: rgba(0, 0, 0, 0.04) !important;
        }
        .royal-nav-link {
          position: relative !important;
          z-index: 10 !important;
          display: block !important;
          padding: 8px 18px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          border-radius: 9999px !important;
          color: rgba(255, 255, 255, 0.7) !important;
          text-decoration: none !important;
          background: transparent !important;
          border: none !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
          font-family: 'Inter', sans-serif !important;
        }
        .royal-nav-link:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }
        .royal-header-fixed.scrolled .royal-nav-link {
          color: rgba(0, 0, 0, 0.6) !important;
        }
        .royal-header-fixed.scrolled .royal-nav-link:hover {
          color: #1a1a1a !important;
          background: rgba(0, 0, 0, 0.05) !important;
        }
        .royal-nav-link.active {
          color: #ffffff !important;
        }
        .royal-header-fixed.scrolled .royal-nav-link.active {
          color: #1a1a1a !important;
        }
        .royal-active-pill {
          position: absolute !important;
          inset: 0 !important;
          border-radius: 9999px !important;
          background: rgba(255, 255, 255, 0.15) !important;
          backdrop-filter: blur(4px) !important;
          z-index: 0 !important;
        }
        .royal-header-fixed.scrolled .royal-active-pill {
          background: rgba(0, 0, 0, 0.06) !important;
        }
        .royal-nav-link-inner {
          position: relative !important;
          z-index: 1 !important;
        }
        
        /* FIXED: Login button with fixed width and smooth arrow on hover */
        .royal-login-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          padding: 10px 20px !important;
          border-radius: 9999px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          background: rgba(255, 255, 255, 0.15) !important;
          backdrop-filter: blur(8px) !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1) !important;
          font-family: 'Inter', sans-serif !important;
          width: 130px !important;
          min-width: 130px !important;
          max-width: 130px !important;
          flex-shrink: 0 !important;
          transform: none !important;
          white-space: nowrap !important;
          position: relative !important;
          overflow: hidden !important;
        }
        .royal-login-btn:hover {
          background: rgba(255, 255, 255, 0.25) !important;
          box-shadow: 0 8px 30px rgba(255, 255, 255, 0.15) !important;
          transform: none !important;
        }
        .royal-header-fixed.scrolled .royal-login-btn {
          background: #1a1a1a !important;
          color: #faf8f4 !important;
          border: none !important;
          transform: none !important;
        }
        .royal-header-fixed.scrolled .royal-login-btn:hover {
          background: #2a2a2a !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
          transform: none !important;
        }
        
        .royal-login-btn .login-text {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }
        
        .royal-login-arrow {
          display: inline-block !important;
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1) !important;
          opacity: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
          margin-left: 0 !important;
          transform: translateX(-10px) scale(0.8) !important;
          flex-shrink: 0 !important;
        }
        .royal-login-btn:hover .royal-login-arrow {
          opacity: 1 !important;
          width: 18px !important;
          margin-left: 4px !important;
          transform: translateX(0) scale(1) !important;
        }
        .royal-header-fixed.scrolled .royal-login-btn:hover .royal-login-arrow {
          opacity: 1 !important;
          width: 18px !important;
          margin-left: 4px !important;
          transform: translateX(0) scale(1) !important;
        }
        
        .royal-menu-btn {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 44px !important;
          height: 44px !important;
          border-radius: 9999px !important;
          background: rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(4px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          cursor: pointer !important;
          position: relative !important;
          z-index: 70 !important;
          color: #ffffff !important;
          transition: all 0.3s ease !important;
        }
        @media (min-width: 1024px) {
          .royal-menu-btn {
            display: none !important;
          }
        }
        .royal-menu-btn:hover {
          background: rgba(255, 255, 255, 0.15) !important;
        }
        .royal-menu-btn.open {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
        .royal-header-fixed.scrolled .royal-menu-btn {
          background: rgba(0, 0, 0, 0.04) !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
        }
        .royal-header-fixed.scrolled .royal-menu-btn:hover {
          background: rgba(0, 0, 0, 0.08) !important;
        }
        .royal-header-fixed.scrolled .royal-menu-btn.open {
          background: rgba(0, 0, 0, 0.08) !important;
          border-color: rgba(0, 0, 0, 0.15) !important;
        }
        .royal-menu-line {
          display: block !important;
          width: 100% !important;
          height: 1.5px !important;
          border-radius: 9999px !important;
          background: #ffffff !important;
          transition: all 0.45s cubic-bezier(0.65, 0, 0.35, 1) !important;
        }
        .royal-header-fixed.scrolled .royal-menu-line:not(.open) {
          background: #1a1a1a !important;
        }
        .royal-menu-line.open {
          background: #1a1a1a !important;
        }
        .royal-mobile-drawer {
          position: fixed !important;
          top: 0 !important;
          right: 0 !important;
          z-index: 99998 !important;
          height: 100vh !important;
          width: 100% !important;
          max-width: 400px !important;
          background: #faf8f4 !important;
          box-shadow: -20px 0 60px rgba(0, 0, 0, 0.15) !important;
          display: flex !important;
          flex-direction: column !important;
          padding: 24px 24px !important;
          overflow-y: auto !important;
        }
        @media (min-width: 640px) {
          .royal-mobile-drawer {
            padding: 32px 32px !important;
          }
        }
        @media (min-width: 1024px) {
          .royal-mobile-drawer {
            display: none !important;
          }
        }
        .royal-drawer-overlay {
          position: fixed !important;
          inset: 0 !important;
          z-index: 99997 !important;
          background: rgba(0, 0, 0, 0.5) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
        }
        @media (min-width: 1024px) {
          .royal-drawer-overlay {
            display: none !important;
          }
        }
        .royal-drawer-close-btn {
          width: 40px !important;
          height: 40px !important;
          border-radius: 9999px !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          background: #ffffff !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          color: #1a1a1a !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
        }
        .royal-drawer-close-btn:hover {
          background: #1a1a1a !important;
          color: #ffffff !important;
          border-color: #1a1a1a !important;
        }
        .royal-drawer-link {
          display: flex !important;
          align-items: center !important;
          gap: 16px !important;
          padding: 14px 20px !important;
          border-radius: 12px !important;
          color: #1a1a1a !important;
          text-decoration: none !important;
          transition: all 0.3s ease !important;
          font-size: 16px !important;
          font-weight: 400 !important;
        }
        .royal-drawer-link:hover {
          background: rgba(0, 0, 0, 0.04) !important;
        }
        .royal-drawer-link.active {
          background: #1a1a1a !important;
          color: #ffffff !important;
        }
        .royal-drawer-link .icon {
          font-size: 18px !important;
          opacity: 0.5 !important;
          transition: opacity 0.3s ease !important;
        }
        .royal-drawer-link.active .icon {
          opacity: 1 !important;
        }
        .royal-drawer-link .arrow {
          margin-left: auto !important;
          opacity: 0 !important;
          transform: translateX(-8px) !important;
          transition: all 0.3s ease !important;
        }
        .royal-drawer-link:hover .arrow {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
        .royal-drawer-link.active .arrow {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
        .royal-drawer-login-btn {
          width: 100% !important;
          padding: 16px !important;
          background: #1a1a1a !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 12px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
        }
        .royal-drawer-login-btn:hover {
          background: #2a2a2a !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
        }
        .royal-drawer-footer {
          margin-top: auto !important;
          padding-top: 24px !important;
          border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
          text-align: center !important;
        }
        .royal-drawer-footer-text {
          font-size: 10px !important;
          letter-spacing: 0.2em !important;
          text-transform: uppercase !important;
          color: rgba(0, 0, 0, 0.3) !important;
        }
        .royal-drawer-divider {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 12px !important;
          margin-bottom: 12px !important;
        }
        .royal-drawer-divider-line {
          width: 40px !important;
          height: 1px !important;
          background: rgba(0, 0, 0, 0.08) !important;
        }

        .royal-menu-title {
          display: none !important;
        }

        @media (max-width: 1023px) {
          .royal-menu-title {
            display: flex !important;
            align-items: center !important;
            margin-right: auto !important;
            margin-left: 0 !important;
            font-family: 'Inter', sans-serif !important;
            font-size: 11px !important;
            font-weight: 500 !important;
            letter-spacing: 0.22em !important;
            text-transform: uppercase !important;
            color: #1a1a1a !important;
            height: 64px !important;
          }
          .royal-header-fixed:not(.menu-open) .royal-menu-title {
            display: none !important;
          }
        }
        .royal-drawer-menu-title {
          font-family: 'Inter', sans-serif !important;
          font-size: 11px !important;
          font-weight: 500 !important;
          letter-spacing: 0.22em !important;
          text-transform: uppercase !important;
          color: #1a1a1a !important;
        }
        .royal-drawer-header {
          width: 100% !important;
          min-height: 40px !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between !important;
          margin: 0 0 24px 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }
        .royal-drawer-menu-title {
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          letter-spacing: 0.22em !important;
          line-height: 1 !important;
          text-transform: uppercase !important;
          color: #1a1a1a !important;
          text-align: left !important;
          flex: 0 0 auto !important;
          order: 1 !important;
        }
        .royal-drawer-close-btn {
          order: 2 !important;
          flex: 0 0 40px !important;
          margin: 0 !important;
        }
      `}</style>

      <nav className={`royal-header-fixed ${isSolidTheme ? "scrolled" : ""} ${isHidden && !mobileMenuOpen ? "header-hidden" : ""} ${mobileMenuOpen ? "menu-open" : ""}`}>
        <div className="royal-header-container">
          <Link
            to="/"
            className={`royal-logo-link ${mobileMenuOpen ? "hidden-logo" : ""}`}
            onClick={(e) => handleNavClick(e, "/")}
          >
            {!isSolidTheme ? (
              <img
                src={logoLight}
                alt="Royal Rays"
                className="royal-logo-image light-logo"
              />
            ) : (
              <img
                src={logoDark}
                alt="Royal Rays"
                className="royal-logo-image dark-logo"
              />
            )}
          </Link>

          {mobileMenuOpen && (
            <motion.div
              className="royal-menu-title"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              MENU
            </motion.div>
          )}

          <div className="royal-nav-desktop">
            {navLinks.map((link, i) => {
              const isActive = location.pathname === link.path;
              return (
                <motion.div
                  key={link.path}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                  className="relative"
                >
                  <Link
                    to={link.path}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className={`royal-nav-link ${isActive ? "active" : ""}`}
                  >
                    <span className="royal-nav-link-inner">{link.label}</span>
                  </Link>
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="royal-active-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-5 xl:gap-6">
            <span className="hidden xl:block w-px h-6 bg-white/20" />
            <button className="royal-login-btn">
              <span className="login-text">
                <FaUser size={12} className="xl:text-[14px]" />
                <span>Login</span>
              </span>
              <span className="royal-login-arrow">→</span>
            </button>
          </div>

          <button
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className={`royal-menu-btn outline-0 ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-5 h-4 relative flex flex-col justify-between items-center">
              <motion.span
                className={`royal-menu-line ${mobileMenuOpen ? "open" : ""}`}
                animate={{
                  rotate: mobileMenuOpen ? 45 : 0,
                  y: mobileMenuOpen ? 7.5 : 0,
                }}
                transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.span
                className={`royal-menu-line ${mobileMenuOpen ? "open" : ""}`}
                animate={{
                  opacity: mobileMenuOpen ? 0 : 1,
                  width: mobileMenuOpen ? "0%" : "70%",
                }}
                style={{ alignSelf: "center" }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className={`royal-menu-line ${mobileMenuOpen ? "open" : ""}`}
                animate={{
                  rotate: mobileMenuOpen ? -45 : 0,
                  y: mobileMenuOpen ? -7.5 : 0,
                }}
                transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="royal-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="royal-mobile-drawer"
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col h-full">
                <div className="royal-drawer-header">
                  <span className="royal-drawer-menu-title">
                    MENU
                  </span>

                  <button
                    className="royal-drawer-close-btn"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
                <div className="flex-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <motion.div key={link.path} variants={menuItemVariants}>
                        <Link
                          to={link.path}
                          onClick={(e) => handleNavClick(e, link.path)}
                          className={`royal-drawer-link ${isActive ? "active" : ""}`}
                        >
                          <span className="icon">{link.icon}</span>
                          <span>{link.label}</span>
                          {isActive ? (
                            <RiDiamondFill size={12} className="arrow" />
                          ) : (
                            <span className="arrow">→</span>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                <motion.div variants={menuItemVariants}>
                  <button className="royal-drawer-login-btn">
                    <FaUser size={14} /> Login
                  </button>
                </motion.div>
                <motion.div variants={menuItemVariants} className="royal-drawer-footer">
                  <div className="royal-drawer-divider">
                    <span className="royal-drawer-divider-line" />
                    <RiDiamondLine size={12} className="text-gray-300" />
                    <span className="royal-drawer-divider-line" />
                  </div>
                  <p className="royal-drawer-footer-text">Royal Rays BV — Since 1984</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;