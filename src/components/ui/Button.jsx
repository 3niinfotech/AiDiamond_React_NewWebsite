import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  iconPosition = "left",
  ...props
}) => {
  const variants = {
    primary:
      "bg-[#0A0A0A] text-white hover:bg-[#1C1C1E] hover:shadow-md hover:-translate-y-0.5",
    secondary:
      "bg-transparent text-[#0A0A0A] border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white hover:shadow-md hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-[#3A3A3C] border border-[#C7C7CC] hover:border-[#0A0A0A] hover:text-[#0A0A0A] hover:-translate-y-0.5",
    glass:
      "bg-white/60 backdrop-blur-[18px] text-[#0A0A0A] shadow-glass border border-white/40 hover:bg-white/80 hover:shadow-lg hover:-translate-y-0.5",
  };

  return (
    <motion.button
      className={`relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-mono text-xs tracking-[0.08em] uppercase font-medium transition-all duration-300 overflow-hidden ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon size={16} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={16} />}
    </motion.button>
  );
};

export default Button;
