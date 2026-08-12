import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { magneticSpring } from '../lib/motion'

const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  glass: 'btn-glass',
}

/**
 * Button — sitewide CTA component.
 * `magnetic` prop enables cursor-follow pull — reserve this for primary,
 * high-intent CTAs only (final CTA, hero, form submit). Never on nav links.
 */
export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  magnetic = false,
  children,
  className = '',
  ...props
}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, magneticSpring)
  const springY = useSpring(y, magneticSpring)

  if (!magnetic) {
    return (
      <Tag className={`${variantClass[variant]} ${className}`} {...props}>
        {children}
      </Tag>
    )
  }

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35)
  }
  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  const MotionTag = motion(Tag)

  return (
    <MotionTag
      ref={ref}
      className={`${variantClass[variant]} ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
