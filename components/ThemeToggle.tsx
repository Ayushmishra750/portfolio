'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const current = document.documentElement.classList.contains('light') ? 'light' : 'dark'
    setTheme(current)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const d = document.documentElement
    d.classList.toggle('light', next === 'light')
    d.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* ignore */
    }
    setTheme(next)
  }

  // Avoid hydration mismatch — render a stable placeholder until mounted
  if (!mounted) {
    return <div className={`w-9 h-9 rounded-lg ${className}`} aria-hidden />
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`relative w-9 h-9 rounded-lg flex items-center justify-center glass border border-white/10 hover:border-[#38BDF8]/50 transition-colors overflow-hidden ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="moon"
            initial={{ y: 18, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -18, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.25 }}
          >
            <Moon className="w-4 h-4 text-[#38BDF8]" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ y: 18, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -18, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.25 }}
          >
            <Sun className="w-4 h-4 text-[#F59E0B]" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
