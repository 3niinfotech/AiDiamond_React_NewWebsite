import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../animations/Animations';

const SectionHead = ({ eyebrow, title, desc, icon: Icon, className = '' }) => {
  return (
    <motion.div 
      className={`max-w-[900px] px-6 md:px-12 pt-32 pb-16 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2 }}
      variants={fadeInUp}
    >
      <span className="flex items-center gap-3 mb-4 font-mono text-[11px] tracking-[0.18em] uppercase text-[#8C6530]">
        <span className="w-6 h-px bg-[#8C6530]" />
        {eyebrow}
      </span>
      <h2 className="flex items-center gap-3 font-display text-[clamp(32px,4vw,48px)] font-normal leading-[1.08] tracking-[-0.01em] text-[#0A0A0A]">
        {Icon && <Icon className="text-[#8C6530]" size={32} />}
        {title}
      </h2>
      {desc && <p className="mt-4 text-lg leading-[1.7] text-[#3A3A3C] max-w-[520px]">{desc}</p>}
    </motion.div>
  );
};

export default SectionHead;