import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setCursorPos({ x: clientX, y: clientY });
      
      setTrails(prev => {
        const newTrail = { x: clientX, y: clientY, id: Date.now() };
        const updated = [...prev, newTrail];
        if (updated.length > 8) updated.shift();
        return updated;
      });
    };

    const handleMouseOver = (e) => {
      const hoverElements = ['button', 'a', '.p-card', '.stack-card', '.compliance-row', '.hscroll-card', '.founder-card', '.slider-arrow', '.chip'];
      const isHoverElement = hoverElements.some(selector => e.target.closest(selector));
      setIsHover(isHoverElement);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div className="custom-cursor">
      <motion.div
        className={`cursor-ring ${isHover ? 'hover' : ''}`}
        animate={{ x: cursorPos.x, y: cursorPos.y }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
      />
      <motion.div
        className={`cursor-dot ${isHover ? 'hover' : ''}`}
        animate={{ x: cursorPos.x - 3, y: cursorPos.y - 3 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.3 }}
      />
      {trails.map((trail) => (
        <motion.div
          key={trail.id}
          className="fixed pointer-events-none z-[99997] w-1 h-1 bg-[#9A958C] rounded-full opacity-20 blur-[2px]"
          initial={{ opacity: 0.3, scale: 1 }}
          animate={{
            x: trail.x - 2,
            y: trail.y - 2,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </div>
  );
};

export default CustomCursor;