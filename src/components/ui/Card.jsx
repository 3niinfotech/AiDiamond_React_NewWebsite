import React from 'react';

const Card = ({ children, variant = 'elevated', className = '' }) => {
  const variants = {
    elevated: 'bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
    flat: 'bg-[#F0EDE7] rounded-2xl p-8 hover:bg-[#ECE7DE] transition-all duration-300',
    glass: 'bg-white/60 backdrop-blur-[18px] rounded-2xl p-8 shadow-glass border border-white/40'
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;