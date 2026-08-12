import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ShapeIcon from '../../../components/ui/ShapeIcon';

const ProcessCards = () => {
  const processRef = useRef(null);
  const isInView = useInView(processRef, { amount: 0.25 });

  const processCards = [
    { num: '01', title: 'Sort', icon: 'R' },
    { num: '02', title: 'Plan', icon: 'PR' },
    { num: '03', title: 'Cut', icon: 'CU' },
    { num: '04', title: 'Polish', icon: 'RA' },
    { num: '05', title: 'Grade', icon: 'E' },
  ];

  return (
    <section ref={processRef} className="py-20 px-6 md:px-12 bg-[#FAFAF8]">
      <div className="max-w-[1400px] mx-auto">
        <div className="font-mono text-[11px] tracking-[0.18em] text-[#999999] uppercase flex items-center gap-3 mb-5">
          <span className="w-6 h-px bg-[#D4D4D4]" />
          <span>Our Process — Five Steps to Perfection</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {processCards.map((card, i) => (
            <motion.div
              key={i}
              className="border border-[#E8E8E4] bg-white p-6 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, borderColor: '#D4D4D4' }}
            >
              <ShapeIcon name={card.icon} size={32} color="#999999" className="mb-3" />
              <div className="font-mono text-[11px] text-[#999999]">{card.num}</div>
              <div className="h-[60px] my-3 bg-[#F5F5F2] rounded" />
              <h4 className="font-display text-[16px] font-light text-[#111111]">{card.title}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessCards;