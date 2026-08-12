import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '../lib/motion'

/** Card — default elevated surface. variant: 'default' | 'flat' | 'glass' */
export function Card({ children, variant = 'default', className = '', ...props }) {
  const base =
    variant === 'flat' ? 'card-flat' : variant === 'glass' ? 'card-glass' : 'card'
  return (
    <motion.div
      className={`${base} ${className}`}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/** Badge — static label. variant: 'default' | 'dark' | 'accent' */
export function Badge({ children, variant = 'default', className = '' }) {
  const base =
    variant === 'dark' ? 'badge-dark' : variant === 'accent' ? 'badge-accent' : 'badge'
  return <span className={`${base} ${className}`}>{children}</span>
}

/** Chip — interactive filter/selector pill */
export function Chip({ children, active = false, className = '', ...props }) {
  return (
    <button className={`${active ? 'chip-active' : 'chip'} ${className}`} {...props}>
      {children}
    </button>
  )
}

/** Eyebrow — small mono label with leading rule, used above every section heading */
export function Eyebrow({ children, className = '' }) {
  return <div className={`eyebrow ${className}`}>{children}</div>
}

/** Divider — hairline rule for separating sections/content blocks */
export function Divider({ className = '' }) {
  return <div className={`divider ${className}`} />
}

/** SectionHeading — eyebrow + display heading + optional lede, fade-up on view */
export function SectionHeading({ eyebrow, title, lede, align = 'left' }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={align === 'center' ? 'text-center mx-auto max-w-prose' : ''}
    >
      {eyebrow && <Eyebrow className={align === 'center' ? 'justify-center' : ''}>{eyebrow}</Eyebrow>}
      <h2 className="text-display-md mt-5">{title}</h2>
      {lede && <p className="prose-lede mt-4">{lede}</p>}
    </motion.div>
  )
}
