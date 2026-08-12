import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import ShapeIcon from '../../../components/ui/ShapeIcon';

const Trust = () => {
  const trustRef = useRef(null);
  const isInView = useInView(trustRef, { amount: 0.2 });
  const [counters, setCounters] = useState({ years: 0, markets: 0, grade: 0 });

  useEffect(() => {
    if (isInView) {
      const duration = 1600;
      const startTime = Date.now();
      const targetYears = 40;
      const targetMarkets = 18;
      const targetGrade = 99;

      const animateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 2);

        setCounters({
          years: Math.floor(ease * targetYears),
          markets: Math.floor(ease * targetMarkets),
          grade: Math.floor(ease * targetGrade),
        });

        if (progress < 1) {
          requestAnimationFrame(animateCounter);
        }
      };
      animateCounter();
    }
  }, [isInView]);

  return (
    <section ref={trustRef} className="py-20 px-6 md:px-12 bg-[#F5F5F2]">
      <div className="max-w-[1100px] mx-auto">
        <div className="font-mono text-[11px] tracking-[0.18em] text-[#999999] uppercase flex items-center gap-3 mb-5">
          <span className="w-6 h-px bg-[#D4D4D4]" />
          <span>Trust Strip — Years of Excellence</span>
        </div>
        <div className="flex flex-wrap gap-12 md:gap-20 justify-center">
          <div className="text-center">
            <ShapeIcon name="R" size={28} color="#999999" className="mb-2 mx-auto" />
            <div className="font-display text-[44px] font-light text-[#111111]">{counters.years}</div>
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#999999] mt-1">Years</div>
          </div>
          <div className="text-center">
            <ShapeIcon name="O" size={28} color="#999999" className="mb-2 mx-auto" />
            <div className="font-display text-[44px] font-light text-[#111111]">{counters.markets}</div>
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#999999] mt-1">Export Markets</div>
          </div>
          <div className="text-center">
            <ShapeIcon name="RA" size={28} color="#999999" className="mb-2 mx-auto" />
            <div className="font-display text-[44px] font-light text-[#111111]">{counters.grade}%</div>
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#999999] mt-1">GIA Certified</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;