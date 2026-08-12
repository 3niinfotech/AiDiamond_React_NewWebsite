import React from "react";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineChat,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineClock,
  HiOutlineOfficeBuilding,
  HiOutlineArrowRight,
  HiOutlineGlobe,
} from "react-icons/hi";
import { FaRegPaperPlane, FaRegBuilding, FaRegEnvelope } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import imgRkdMap from "../../../assets/images/img-rkd-map.svg";

const OfficeDetails = () => {
  return (
    <section className="w-full min-h-screen py-12 px-4 flex items-center justify-center font-['Inter',sans-serif]  relative overflow-hidden">
      {/* Watermark SVG Background - Fixed */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-50">
        <img
          src={imgRkdMap}
          alt="Royal Rays Watermark"
          className="w-[100%] h-[80%] "
        />
      </div>

      <div className="max-w-[1300px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative z-10">
        {/* ========== SECTION 2: OFFICE DETAILS + MAP ========== */}
        <div className="flex flex-col space-y-10">
          {/* Office Info */}
          <div>
            <h2 className="text-2xl font-semibold uppercase tracking-widest text-black pb-4 mb-8 flex items-center gap-3">
              Office Details
            </h2>
            <div className="space-y-8">
              <div className="group cursor-pointer relative">
                <div className="absolute -left-4 top-0 w-0.5 h-full bg-black/0 group-hover:bg-black/30 transition-all duration-500"></div>
                <p className="text-xs font-medium text-black uppercase tracking-wider mb-1 group-hover:text-black transition-colors duration-300 flex items-center gap-2">
                  <FiMapPin className="text-sm" />
                  Address
                </p>
                <p className="text-lg font-normal leading-relaxed text-black group-hover:translate-x-2 transition-transform duration-300">
                  341, Hoveniersstraat 2<br />
                  2018 Antwerpen, Belgium
                </p>
              </div>

              <div className="group cursor-pointer relative">
                <div className="absolute -left-4 top-0 w-0.5 h-full bg-black/0 group-hover:bg-black/30 transition-all duration-500"></div>
                <p className="text-xs font-medium text-black uppercase tracking-wider mb-1 group-hover:text-black transition-colors duration-300 flex items-center gap-2">
                  <HiOutlinePhone className="text-sm" />
                  Phone
                </p>
                <p className="text-lg font-normal text-black group-hover:translate-x-2 transition-transform duration-300">
                  +32 472 78 43 66
                </p>
              </div>

              <div className="group cursor-pointer relative">
                <div className="absolute -left-4 top-0 w-0.5 h-full bg-black/0 group-hover:bg-black/30 transition-all duration-500"></div>
                <p className="text-xs font-medium text-black uppercase tracking-wider mb-1 group-hover:text-black transition-colors duration-300 flex items-center gap-2">
                  <FaRegEnvelope className="text-sm" />
                  Email
                </p>
                <p className="text-lg font-normal text-black group-hover:translate-x-2 transition-transform duration-300">
                  belgium@royalraysbv.com
                </p>
              </div>

              <div className="group cursor-pointer relative">
                <div className="absolute -left-4 top-0 w-0.5 h-full bg-black/0 group-hover:bg-black/30 transition-all duration-500"></div>
                <p className="text-xs font-medium text-black uppercase tracking-wider mb-1 group-hover:text-black transition-colors duration-300 flex items-center gap-2">
                  <HiOutlineClock className="text-sm" />
                  Business Hours
                </p>
                <p className="text-lg font-normal text-black group-hover:translate-x-2 transition-transform duration-300">
                  Monday – Friday, 9:00 – 18:00 CET
                </p>
              </div>
            </div>
          </div>

          {/* Google Maps - Premium styling */}
          <div className="relative overflow-hidden rounded-sm group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-0 border-2 border-white/20 rounded-2xl z-10 pointer-events-none"></div>
            <iframe
              title="Royal Rays BV — Antwerp"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1495.279747437006!2d4.4184527000000005!3d51.2156941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f7023afb1e89%3A0xea9cee84c822a75!2sHoveniersstraat%202%2C%202018%20Antwerpen%2C%20Belgium!5e1!3m2!1sen!2sin!4v1774590504928!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-56 md:h-64 lg:h-72 grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
            ></iframe>
            <div className="absolute bottom-4 left-4 z-20 bg-black/70 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full font-medium tracking-wider flex items-center gap-2">
              <FiMapPin className="text-sm" />
              Hoveniersstraat 2
            </div>
            <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-wider flex items-center gap-1">
              <HiOutlineGlobe className="text-sm" />
              Antwerp
            </div>
          </div>
        </div>
        {/* ========== SECTION 1: CONTACT FORM ========== */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold uppercase tracking-widest text-black pb-4 flex items-center gap-3">
              Send a Message
            </h2>
            <p className="text-black/60 text-sm leading-relaxed">
              Complete the form below and our team will get back to you
              promptly.
            </p>
          </div>

          <form className="flex-1 flex flex-col space-y-6">
            {/* Full Name */}
            <div className="group">
              <label className="block text-lg font-medium uppercase tracking-wider text-black mb-1 flex items-center gap-2">
                <HiOutlineUser className="text-lg" />
                Full Name <span className="text-black">*</span>
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-0 py-2 bg-transparent border-b border-black/10 text-black placeholder-black/20 outline-none focus:border-black focus:border-b-2 transition-all duration-300 [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:ring-offset-0"
              />
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-lg font-medium uppercase tracking-wider text-black mb-1 flex items-center gap-2">
                <HiOutlineMail className="text-lg" />
                Email Address <span className="text-black">*</span>
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full px-0 py-2 bg-transparent border-b border-black/10 text-black placeholder-black/20 outline-none focus:border-black focus:border-b-2 transition-all duration-300 [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:ring-offset-0"
              />
            </div>

            {/* Subject */}
            <div className="group">
              <label className="block text-lg font-medium uppercase tracking-wider text-black mb-1 flex items-center gap-2">
                <HiOutlineBriefcase className="text-lg" />
                Subject <span className="text-black">*</span>
              </label>
              <input
                type="text"
                placeholder="Trade inquiry, custom order…"
                className="w-full px-0 py-2 bg-transparent border-b border-black/10 text-black placeholder-black/20 outline-none focus:border-black focus:border-b-2 transition-all duration-300 [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:ring-offset-0"
              />
            </div>

            {/* Message */}
            <div className="group">
              <label className="block text-lg font-medium uppercase tracking-wider text-black mb-1 flex items-center gap-2">
                <HiOutlineChat className="text-lg" />
                Message
              </label>
              <textarea
                rows="3"
                placeholder="Tell us about your requirements…"
                className="w-full px-0 py-2 bg-transparent border-b border-black/10 text-black placeholder-black/20 outline-none focus:border-black focus:border-b-2 transition-all duration-300 resize-none [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:ring-offset-0"
              ></textarea>
            </div>

            {/* Send Button */}
            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="group relative mt-3 self-start inline-flex w-fit items-center gap-2 overflow-hidden bg-black px-8 py-3.5 text-sm font-medium uppercase tracking-wide text-white shadow-lg transition-shadow duration-300 hover:bg-[#1a1a1a] hover:shadow-xl"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <span className="relative z-10">Send Message</span>
              <HiOutlineArrowRight className="relative z-10 text-lg transition-transform duration-300 group-hover:translate-x-1.5" />
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OfficeDetails;
