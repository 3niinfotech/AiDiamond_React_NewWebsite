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
import Login from '../pages/Auth/Login';
import FirmSelection from '../pages/Firms/FirmSelection';
import FirmBookLedger from '../pages/Firms/FirmBookLedger';
import PartyMaster from '../pages/Firms/PartyMaster';
import Signature from '../pages/Firms/signature';
import VoucherEntryPage from '../pages/Firms/VoucherEntryPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth & Firm Management Routes */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/firms"
          element={
            <ProtectedRoute>
              <FirmSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/party-master"
          element={
            <ProtectedRoute>
              <PartyMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signature"
          element={
            <ProtectedRoute>
              <Signature />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signature/:voucherType"
          element={
            <ProtectedRoute>
              <VoucherEntryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/firms/:firmId"
          element={
            <ProtectedRoute>
              <FirmBookLedger />
            </ProtectedRoute>
          }
        />

        {/* Website Public Pages */}
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
