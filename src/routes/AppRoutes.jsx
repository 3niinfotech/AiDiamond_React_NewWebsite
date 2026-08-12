import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Pages
import Home from "../pages/Home/Home";
import MainLayout from "../components/layout/MainLayout";
import Event from "../pages/Event/Event";
import OfficeDetails from "../pages/Contact/Contact";
import OurHistory from "../pages/OurHistory/OurHistory";
import Diamonds from "../pages/Diamonds/Diamonds";
import About from '../pages/About/About';
import Blog from '../pages/Blog/Blog';
import BlogDetail from '../pages/BlogDetail/BlogDetail';
import PrivacyPolicy from '../pages/Legal/PrivacyPolicy';
import TermsOfUse from '../pages/Legal/TermsOfUse';
import Sitemap from '../pages/Sitemap/Sitemap';

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/event" element={<Event />} />
          <Route path="/contact" element={<OfficeDetails />} />
          <Route path="/diamonds" element={<Diamonds />} />
          <Route path="/our-legacy" element={<OurHistory />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/sitemap" element={<Sitemap />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
