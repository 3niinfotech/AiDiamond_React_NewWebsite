import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Button from './Button'

const links = ['Manufacturing', 'Diamonds', 'About', 'Contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-luxury ${
        scrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container-luxury flex items-center justify-between">
        <span className="font-display text-heading-md">Royal Rays</span>
        <div className="hidden md:flex items-center gap-10 font-mono text-caption uppercase tracking-wide text-graphite">
          {links.map((l) => (
            <a key={l} href="#" className="hover:text-ink">
              {l}
            </a>
          ))}
        </div>
        <Button variant="secondary" className="!px-5 !py-2.5">
          Enquire
        </Button>
      </div>
    </motion.nav>
  )
}
