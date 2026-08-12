// ============================================================
// ROYAL RAYS BV — MOTION VOCABULARY
// Every animation on the site should reuse one of these variants.
// Easing: luxury cubic-bezier — slow, confident, decelerating.
// ============================================================

export const luxuryEase = [0.22, 1, 0.36, 1]

// Fade + rise — the site's repeatable micro-signature (safe to reuse everywhere)
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: luxuryEase },
  },
}

// Stagger container — wrap a list of children (cards, nav links, etc.)
export const staggerContainer = (stagger = 0.12, delay = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
})

// Mask reveal — for headline lines; pair with a parent that has overflow-hidden
export const maskLine = {
  hidden: { y: '100%' },
  show: {
    y: 0,
    transition: { duration: 0.9, ease: luxuryEase },
  },
}

// Scale reveal — product/hero imagery
export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: luxuryEase },
  },
}

// Clip-path reveal — image "unroll" from bottom edge
export const clipReveal = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  show: {
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: 0.9, ease: luxuryEase },
  },
}

// Viewport defaults — use with whileInView so animations fire once, calmly
export const viewportOnce = { once: true, amount: 0.3 }

// Magnetic button physics — spring config for cursor-follow pull
export const magneticSpring = { type: 'spring', stiffness: 150, damping: 15, mass: 0.4 }
