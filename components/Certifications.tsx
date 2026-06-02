'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, Shield, Code2, Database, ExternalLink } from 'lucide-react'

const certs = [
  {
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    icon: Shield,
    color: '#FF9900',
    year: '2023',
    desc: 'Foundational cloud concepts, AWS services, security, and architecture.',
    badge: 'AWS',
  },
  {
    title: 'HackerRank Problem Solving',
    issuer: 'HackerRank',
    icon: Code2,
    color: '#00EA64',
    year: '2023',
    desc: 'Advanced algorithmic problem solving and data structures.',
    badge: 'HR',
  },
  {
    title: 'Data Science & Machine Learning',
    issuer: 'Certification Program',
    icon: Database,
    color: '#38BDF8',
    year: '2022',
    desc: 'Statistical modeling, ML algorithms, and data analysis methodologies.',
    badge: 'DS',
  },
  {
    title: 'PySpark & Python for Big Data',
    issuer: 'Big Data Institute',
    icon: Award,
    color: '#A855F7',
    year: '2022',
    desc: 'Distributed computing, PySpark RDDs, DataFrames, and Spark SQL.',
    badge: 'PY',
  },
]

export default function Certifications() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="certifications" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">Certifications</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Professional <span className="gradient-text">Credentials</span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Industry-recognized certifications validating expertise across cloud, data, and programming.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 40, rotateX: 20 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative glass rounded-2xl p-6 cursor-default overflow-hidden transition-all duration-300 hover:-translate-y-2"
              style={{
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.border = `1px solid ${cert.color}40`
                ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${cert.color}15`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.07)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              {/* Shine effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${cert.color}08 0%, transparent 50%, ${cert.color}05 100%)`,
                }}
              />

              {/* Badge */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-transform group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: `${cert.color}20`, color: cert.color }}
                  >
                    <cert.icon className="w-7 h-7" />
                  </div>
                  <span
                    className="text-xs font-mono px-2 py-1 rounded-full"
                    style={{ color: cert.color, background: `${cert.color}15`, border: `1px solid ${cert.color}30` }}
                  >
                    {cert.year}
                  </span>
                </div>

                <h3 className="text-white font-bold text-sm leading-snug mb-2 group-hover:text-[#38BDF8] transition-colors">
                  {cert.title}
                </h3>
                <p className="text-[#94A3B8] text-xs mb-4 leading-relaxed">{cert.desc}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#94A3B8] font-mono">{cert.issuer}</span>
                  <ExternalLink className="w-3 h-3 text-[#94A3B8] group-hover:text-white transition-colors" />
                </div>
              </div>

              {/* Bottom glow line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${cert.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
