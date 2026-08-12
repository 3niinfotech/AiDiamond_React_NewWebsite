import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'border-[#C7C7CC] bg-white text-[#3A3A3C]',
    dark: 'bg-[#0A0A0A] text-white border-[#0A0A0A]',
    gold: 'bg-[#E8DCC8] text-[#8C6530] border-[#8C6530]',
    ice: 'bg-[#DFE6EA] text-[#5C6066] border-[#5C6066]'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full font-mono text-[10px] tracking-[0.06em] uppercase border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;