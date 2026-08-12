// components/common/PageHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Breadcrumb from './Breadcrumb';

const PageHeader = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  className = "" 
}) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className={`relative ${className}`}>
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <Breadcrumb />
        
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          className="mt-4 md:mt-6"
        >
          {title && (
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05]">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-3 text-white/50 text-base md:text-lg lg:text-xl font-light max-w-2xl">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PageHeader;