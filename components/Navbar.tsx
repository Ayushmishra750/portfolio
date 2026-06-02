'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className={`mx-auto max-w-6xl px-6 flex items-center justify-between rounded-2xl transition-all duration-500 ${
          scrolled ? 'glass shadow-lg shadow-black/20 mx-4' : ''
        }`} style={{ padding: scrolled ? '12px 24px' : '0 24px' }}>
          {/* Logo */}
          <motion.button
            onClick={() => scrollTo('#hero')}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38BDF8] to-[#A855F7] flex items-center justify-center text-sm font-black text-white">
              AM
            </div>
            <span className="text-white font-semibold hidden sm:block">Ayush Mishra</span>
          </motion.button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <motion.button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="relative px-4 py-2 text-sm text-[#94A3B8] hover:text-white transition-colors rounded-lg group"
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative z-10">{link.label}</span>
                <motion.div
                  className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <motion.a
              href="mailto:ayushmishra750980@gmail.com"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#050816] bg-gradient-to-r from-[#38BDF8] to-[#A855F7] rounded-lg hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Hire Me
            </motion.a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="block w-5 h-0.5 bg-white origin-center transition-all"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-5 h-0.5 bg-white"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="block w-5 h-0.5 bg-white origin-center transition-all"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 glass rounded-2xl p-6 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {links.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-4 py-3 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  {link.label}
                </motion.button>
              ))}
              <a
                href="mailto:ayushmishra750980@gmail.com"
                className="mt-2 px-4 py-3 text-center text-sm font-medium text-[#050816] bg-gradient-to-r from-[#38BDF8] to-[#A855F7] rounded-xl"
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
