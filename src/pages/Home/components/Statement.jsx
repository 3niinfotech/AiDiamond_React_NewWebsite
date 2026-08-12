import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ShapeIcon from '../../../components/ui/ShapeIcon';

const Statement = () => {
  const statementRef = useRef(null);
  const isInView = useInView(statementRef, { amount: 0.3 });

  const words = ['Every', 'stone', 'we', 'export', 'carries', 'the', 'weight', 'of', 'three', 'generations', 'of', 'trust.'];

  return (
    <section ref={statementRef} className="min-h-[60vh] flex items-center justify-center px-6 md:px-12 bg-[#F5F5F2] relative">
      <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-10">
        <ShapeIcon name="RADIANT" size={120} color="#111111" />
      </div>
      <div className="absolute right-8 bottom-1/2 translate-y-1/2 opacity-10">
        <ShapeIcon name="R" size={80} color="#111111" />
      </div>
      <h2 className="font-display text-[clamp(30px,5vw,64px)] font-light text-[#111111] leading-[1.15] max-w-[1000px] text-center relative z-10">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ filter: 'blur(8px)', opacity: 0, y: 12 }}
            animate={isInView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.04, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}{' '}
          </motion.span>
        ))}
      </h2>
    </section>
  );
};

export default Statement;