import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Card, SectionHeading, Divider } from '../components/Primitives'
import { fadeUp, clipReveal, staggerContainer, viewportOnce } from '../lib/motion'

const steps = ['Sort', 'Plan', 'Cut', 'Polish', 'Grade']

export function ProcessTeaser() {
  return (
    <section className="section-padding bg-off-white">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Craftsmanship"
          title="Five decisions. One stone."
          lede="Every rough diamond passes through the same five disciplined stages before it earns the Royal Rays mark."
        />
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-14"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {steps.map((step, i) => (
            <motion.div key={step} variants={fadeUp}>
              <Card variant="flat" className="!p-6">
                <span className="font-mono text-caption text-soft-gray">
                  0{i + 1}
                </span>
                <motion.div
                  variants={clipReveal}
                  className="h-32 my-5 rounded-sm bg-gradient-to-br from-light-stone to-silver-gray/40"
                />
                <h4 className="font-display text-heading-md">{step}</h4>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Counter({ target, suffix = '' }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const unsub = rounded.on('change', (v) => setDisplay(v))
    return unsub
  }, [rounded])

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true)
          animate(count, target, { duration: 1.6, ease: [0.16, 1, 0.3, 1] })
        }
      },
      { threshold: 0.6 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [inView, count, target])

  return (
    <span ref={ref} className="text-display-lg font-display text-ink">
      {display}
      {suffix}
    </span>
  )
}

export function TrustStrip() {
  const stats = [
    { value: 40, suffix: '', label: 'Years of craft' },
    { value: 18, suffix: '', label: 'Export markets' },
    { value: 99, suffix: '%', label: 'GIA graded' },
  ]
  return (
    <section className="section-padding bg-white">
      <div className="container-luxury">
        <Divider className="mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((s) => (
            <div key={s.label}>
              <Counter target={s.value} suffix={s.suffix} />
              <p className="font-mono text-caption uppercase tracking-wide text-soft-gray mt-3">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
