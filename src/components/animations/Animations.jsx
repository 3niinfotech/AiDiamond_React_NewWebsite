import { useAnimation } from 'framer-motion';

// Animation Variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

export const blurReveal = {
  hidden: { filter: 'blur(12px)', opacity: 0, y: 20 },
  visible: (i) => ({
    filter: 'blur(0px)',
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.06, 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] 
    }
  })
};

export const maskReveal = {
  hidden: { y: '100%' },
  visible: (i) => ({
    y: 0,
    transition: { 
      delay: i * 0.08, 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] 
    }
  })
};

export const useAnimationControls = () => {
  const controls = useAnimation();
  return controls;
};