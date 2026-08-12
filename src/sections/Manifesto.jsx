import { motion } from 'framer-motion'
import { maskLine, staggerContainer, viewportOnce } from '../lib/motion'

const lines = [
  'We do not chase every stone.',
  'We chase the right ones — and cut them with a',
  'discipline most factories gave up on decades ago.',
]

export default function Manifesto() {
  return (
    <section className="section-padding bg-white">
      <div className="container-luxury max-w-3xl">
        <motion.h2
          className="text-display-md text-graphite leading-snug"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span className="block" variants={maskLine}>
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h2>
      </div>
    </section>
  )
}
