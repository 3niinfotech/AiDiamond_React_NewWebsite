import React from 'react';
import ShapeIcon from '../../../components/ui/ShapeIcon';

const SteelNote = () => {
  return (
    <section className="py-20 px-6 md:px-12 bg-[#F5F5F2]">
      <div className="max-w-[1100px] mx-auto">
        <div className="font-mono text-[11px] tracking-[0.18em] text-[#999999] uppercase flex items-center gap-3 mb-4">
          <span className="w-6 h-px bg-[#D4D4D4]" />
          <ShapeIcon name="RADIANT" size={14} color="#999999" />
          <span>Lab Grown — Only Permitted Undertone Shift</span>
        </div>
        <h2 className="font-display text-[clamp(22px,2.6vw,32px)] font-light text-[#111111] max-w-[600px] leading-relaxed">
          Same lens, same contrast, same grain — shifted toward cool-steel to signal "different origin, same standard."
        </h2>
        <div className="flex gap-4 mt-6 items-center">
          <div className="w-16 h-16 rounded border border-[#E8E8E4] bg-[#6b6b6b] flex items-center justify-center">
            <ShapeIcon name="R" size={24} color="white" />
          </div>
          <div className="w-16 h-16 rounded border border-[#E8E8E4] bg-[#8a8a8a] flex items-center justify-center">
            <ShapeIcon name="PR" size={24} color="white" />
          </div>
          <div className="w-16 h-16 rounded border border-[#E8E8E4] bg-[#b0b0b0] flex items-center justify-center">
            <ShapeIcon name="CU" size={24} color="white" />
          </div>
          <div className="w-16 h-16 rounded border border-[#E8E8E4] bg-[#d0d0d0] flex items-center justify-center">
            <ShapeIcon name="RA" size={24} color="#111111" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SteelNote;