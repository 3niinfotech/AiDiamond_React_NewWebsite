// components/common/Breadcrumb.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronRight, FaHome } from 'react-icons/fa';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  const getLabel = (path) => {
    const labels = {
      'event': 'Events',
      'diamonds': 'Diamonds',
      'about': 'About',
      'contact': 'Contact',
      'blog': 'Blog',
      'diamond-details': 'Diamond Details',
      'blog-detail': 'Blog Detail',
      'Our-legacy': 'Our Legacy',
    };
    return labels[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <div
      variants={breadcrumbVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-2 text-sm font-light px-0"
      aria-label="Breadcrumb"
    >
      <motion.div variants={itemVariants}>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors duration-300"
        >
          <FaHome size={14} />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </motion.div>

      {pathnames.map((path, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = getLabel(path);

        return (
          <motion.div
            key={routeTo}
            variants={itemVariants}
            className="flex items-center gap-2"
          >
            <FaChevronRight size={10} className="text-white/20" />
            {isLast ? (
              <span className="text-white/60 font-medium capitalize">
                {label}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="text-white/40 hover:text-white/70 transition-colors duration-300 capitalize"
              >
                {label}
              </Link>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;