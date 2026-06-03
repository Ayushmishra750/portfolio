'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal as TerminalIcon, X } from 'lucide-react'

export default function TerminalFab() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  // Reveal after a short delay so it doesn't compete with the loader
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 4200)
    return () => clearTimeout(t)
  }, [])

  // Auto-open the hint once, briefly, to nudge the visitor
  useEffect(() => {
    if (!visible) return
    setOpen(true)
    const t = setTimeout(() => setOpen(false), 4500)
    return () => clearTimeout(t)
  }, [visible])

  const goToTerminal = () => {
    document.querySelector('#terminal')?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      {/* Pulsing FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        onClick={() => (open ? goToTerminal() : setOpen(true))}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-12 h-12 rounded-full flex items-center justify-center bg-[#0d1117] border border-[#38BDF8]/40 shadow-lg shadow-[#38BDF8]/20 group"
        aria-label="Open interactive terminal"
      >
        {/* Ping ring */}
        <span className="absolute inset-0 rounded-full border border-[#38BDF8]/40 animate-ping" />
        <TerminalIcon className="w-5 h-5 text-[#38BDF8] relative z-10" />
        {/* Green status dot */}
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#34D399] border-2 border-[#050816]" />
      </motion.button>

      {/* Collapsible hint card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
            className="glass rounded-xl border border-[#38BDF8]/20 px-4 py-3 max-w-[230px] relative"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-1.5 right-1.5 text-[#64748B] hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-white text-xs font-semibold mb-1 pr-3">
              Try the interactive terminal 💻
            </p>
            <p className="text-[#94A3B8] text-[11px] leading-relaxed mb-2">
              Type commands like{' '}
              <span className="font-mono text-[#38BDF8]">skills</span>,{' '}
              <span className="font-mono text-[#38BDF8]">projects</span> or{' '}
              <span className="font-mono text-[#38BDF8]">whoami</span> to explore my profile.
            </p>
            <button
              onClick={goToTerminal}
              className="w-full text-center text-[11px] font-mono font-medium text-[#050816] bg-gradient-to-r from-[#38BDF8] to-[#A855F7] rounded-lg py-1.5 hover:opacity-90 transition-opacity"
            >
              Launch Terminal →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
