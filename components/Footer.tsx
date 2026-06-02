'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative border-t border-white/5 bg-[#050816]">
      {/* Aurora */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#A855F7] flex items-center justify-center text-sm font-black text-white">
              AM
            </div>
            <div>
              <div className="text-white font-bold">Ayush Mishra</div>
              <div className="text-[#94A3B8] text-xs font-mono">Data Engineer · Noida, India</div>
            </div>
          </div>

          {/* Center */}
          <div className="text-center">
            <p className="text-[#94A3B8]/50 text-xs">© {new Date().getFullYear()} Ayush Mishra. All rights reserved.</p>
          </div>

          {/* Socials + scroll top */}
          <div className="flex items-center gap-3">
            {[
              { icon: Github, href: 'https://github.com/Ayushmishra750', label: 'GitHub' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/ayushm790/', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:ayushmishra750980@gmail.com', label: 'Email' },
            ].map(s => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-white/20 border border-white/5 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={s.label}
              >
                <s.icon className="w-4 h-4" />
              </motion.a>
            ))}

            <motion.button
              onClick={scrollTop}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[#050816] bg-gradient-to-br from-[#38BDF8] to-[#A855F7] hover:opacity-90 transition-opacity ml-2"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
