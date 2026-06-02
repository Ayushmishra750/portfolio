'use client'

import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowDown, Download, Mail, ExternalLink } from 'lucide-react'
import dynamic from 'next/dynamic'

const NetworkBackground = dynamic(() => import('./NetworkBackground'), { ssr: false })

const headline = "Building Scalable Data Systems That Transform Raw Data Into Business Intelligence"
const roles = ['Data Engineer', 'PySpark Expert', 'AWS Architect', 'ETL Developer', 'SQL Developer']

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        mouseX.set((e.clientX - rect.left - rect.width / 2) / 30)
        mouseY.set((e.clientY - rect.top - rect.height / 2) / 30)
      }
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [mouseX, mouseY])

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Network Background */}
      <div className="absolute inset-0">
        <NetworkBackground />
      </div>

      {/* Aurora overlay */}
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      {/* Radial gradient center glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
          x: springX,
          y: springY,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#38BDF8]/20 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span className="text-sm text-[#94A3B8] font-mono">Available for opportunities</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6"
        >
          <span className="text-white">Building </span>
          <span className="gradient-text">Scalable</span>
          <span className="text-white"> Data Systems</span>
          <br />
          <span className="text-white">That Transform </span>
          <span className="gradient-text">Raw Data</span>
          <br />
          <span className="text-white">Into </span>
          <span className="text-white">Business </span>
          <span className="gradient-text">Intelligence</span>
        </motion.h1>

        {/* Animated roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {['Data Engineer', 'PySpark', 'AWS', 'SQL', 'Python'].map((role, i) => (
            <motion.span
              key={role}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="px-3 py-1.5 text-sm font-mono text-[#38BDF8] border border-[#38BDF8]/30 rounded-full bg-[#38BDF8]/5 hover:bg-[#38BDF8]/10 hover:border-[#38BDF8]/60 transition-all"
            >
              {role}
            </motion.span>
          ))}
        </motion.div>

        {/* Sub info */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-[#94A3B8] text-lg max-w-2xl mx-auto mb-12"
        >
          3.5+ years building enterprise-grade data pipelines, ETL systems, and cloud-native architectures
          at <span className="text-white font-medium">Cognizant Technology Solutions</span> · Noida, India
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton onClick={scrollToProjects} primary>
            <ExternalLink className="w-4 h-4" />
            View Projects
          </MagneticButton>

          <MagneticButton href="/resume.pdf" download>
            <Download className="w-4 h-4" />
            Download Resume
          </MagneticButton>

          <MagneticButton onClick={scrollToContact} ghost>
            <Mail className="w-4 h-4" />
            Contact Me
          </MagneticButton>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: '3.5+', label: 'Years Experience' },
            { value: '5M+', label: 'Records Processed' },
            { value: '30%', label: 'Efficiency Gain' },
            { value: '10+', label: 'Projects Delivered' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-xs text-[#94A3B8] mt-1 font-mono uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#94A3B8] text-xs font-mono tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4 text-[#38BDF8]" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function MagneticButton({
  children,
  onClick,
  href,
  download,
  primary,
  ghost,
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  download?: boolean
  primary?: boolean
  ghost?: boolean
}) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    if (ref.current) {
      ref.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
    }
  }

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)'
  }

  const className = `
    magnetic inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm
    transition-all duration-200 cursor-pointer
    ${primary ? 'bg-gradient-to-r from-[#38BDF8] to-[#A855F7] text-[#050816] hover:shadow-lg hover:shadow-[#38BDF8]/25' : ''}
    ${ghost ? 'border border-white/20 text-white hover:bg-white/5 hover:border-white/40' : ''}
    ${!primary && !ghost ? 'border border-[#38BDF8]/40 text-[#38BDF8] hover:bg-[#38BDF8]/10 hover:border-[#38BDF8]/80' : ''}
  `

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        download={download}
        className={className}
        onMouseMove={handleMouseMove as any}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}
