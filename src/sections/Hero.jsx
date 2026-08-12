import { motion } from 'framer-motion'
import Button from '../components/Button'
import { Eyebrow } from '../components/Primitives'
import { luxuryEase } from '../lib/motion'

const headline = 'Precision cut from rough to radiant.'

export default function Hero() {
  const words = headline.split(' ')

  return (
    <section className="relative min-h-screen flex items-center bg-off-white overflow-hidden">
      {/* Ambient background — no color, just soft tonal depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-light-stone via-off-white to-white" />
      <div className="absolute -right-40 top-1/4 w-[600px] h-[600px] rounded-full bg-metallic-sheen opacity-[0.07] blur-3xl" />

      <div className="container-luxury relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Eyebrow>Since 1984 — Antwerp · Surat</Eyebrow>
        </motion.div>

        <h1 className="text-display-2xl mt-8 max-w-4xl">
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.28em]">
              <motion.span
                className="inline-block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: luxuryEase, delay: 0.4 + i * 0.07 }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: luxuryEase, delay: 1.1 }}
          className="prose-lede mt-8"
        >
          One collection. One standard. From Surat&apos;s cutting floor to the
          world&apos;s finest counters.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: luxuryEase, delay: 1.3 }}
          className="mt-10"
        >
          <Button variant="primary" magnetic>
            Explore the process →
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-10 left-6 md:left-12 flex items-center gap-3 font-mono text-caption uppercase tracking-widest text-soft-gray"
      >
        <span className="relative w-px h-9 bg-silver-gray overflow-hidden">
          <motion.span
            className="absolute inset-x-0 h-1/2 bg-ink"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
        Scroll
      </motion.div>
    </section>
  )
}
