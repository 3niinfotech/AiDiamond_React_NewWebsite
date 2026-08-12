import { motion } from 'framer-motion'
import Button from '../components/Button'
import { fadeUp, viewportOnce } from '../lib/motion'

export function FinalCTA() {
  return (
    <section className="section-padding bg-light-stone text-center">
      <div className="container-luxury">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <h2 className="text-display-lg">Request the catalogue.</h2>
          <p className="prose-lede mx-auto mt-4">
            Speak with our export team about lot availability, certification, and shipping to your market.
          </p>
          <div className="mt-10">
            <Button variant="primary" magnetic>
              Get in touch →
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-ink text-off-white grain-overlay">
      <div className="container-luxury py-24 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <h2 className="font-display text-display-xl">Royal Rays</h2>
          <p className="font-mono text-caption uppercase tracking-widest text-silver-gray mt-6">
            Antwerp · Surat · Est. 1984
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
