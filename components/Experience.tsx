'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Building2, Calendar, MapPin, CheckCircle2, TrendingUp, Database, Cloud, Layers } from 'lucide-react'

const achievements = [
  {
    icon: Database,
    text: 'Processed 5M+ records daily through automated ETL pipelines with 99.9% uptime',
    metric: '5M+ records/day',
    color: '#38BDF8',
  },
  {
    icon: TrendingUp,
    text: 'Improved data processing efficiency by 30% through PySpark optimization and partitioning strategies',
    metric: '30% efficiency gain',
    color: '#A855F7',
  },
  {
    icon: Cloud,
    text: 'Built scalable AWS Glue ETL solutions integrating S3, Redshift, and RDS data sources',
    metric: 'AWS cloud-native',
    color: '#34D399',
  },
  {
    icon: Layers,
    text: 'Executed large-scale data migration projects from legacy systems to cloud-based warehouses',
    metric: 'Zero data loss',
    color: '#FB923C',
  },
  {
    icon: CheckCircle2,
    text: 'Orchestrated complex workflows using AWS Step Functions for multi-stage data pipelines',
    metric: 'Fully automated',
    color: '#F472B6',
  },
  {
    icon: Database,
    text: 'Developed Python and SQL scripts for data validation, cleansing, and quality assurance',
    metric: '100% data quality',
    color: '#38BDF8',
  },
]

const techStack = ['Python', 'PySpark', 'AWS S3', 'AWS Glue', 'Step Functions', 'Lambda', 'SQL', 'Pandas', 'Git', 'Jira']

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="experience" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">Experience</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Professional <span className="gradient-text">Journey</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#38BDF8] via-[#A855F7] to-transparent" />

          {/* Experience card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative ml-16 md:ml-0 md:w-full"
          >
            {/* Timeline dot with glowing pulse */}
            <div className="absolute left-[-2.75rem] md:left-1/2 md:-translate-x-1/2 top-8 z-10 w-5 h-5">
              <motion.span
                className="absolute -inset-1.5 rounded-full bg-[#38BDF8]/40 blur-[5px]"
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.15, 0.6] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#A855F7] border-2 border-[#050816] shadow-lg shadow-[#38BDF8]/40" />
            </div>

            {/* Card */}
            <div className="glass rounded-2xl p-8 gradient-border md:w-[calc(50%-2rem)] md:ml-auto group hover:bg-white/[0.07] transition-all duration-300">
              {/* Company header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#38BDF8]/20 to-[#A855F7]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7 text-[#38BDF8]" />
                </div>
                <div>
                  <h3 className="text-white font-black text-xl">Data Engineer</h3>
                  <p className="text-[#38BDF8] font-semibold">Cognizant Technology Solutions</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#94A3B8] font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Dec 2022 – Present
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Noida, India
                    </span>
                  </div>
                </div>
              </div>

              {/* Duration badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                <span className="text-xs font-mono text-[#38BDF8]">3.5+ Years · Current</span>
              </div>

              {/* Achievements */}
              <div className="space-y-4">
                {achievements.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex gap-3 group/item"
                  >
                    <div
                      className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                      style={{ background: `${a.color}15` }}
                    >
                      <a.icon className="w-4 h-4" style={{ color: a.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[#94A3B8] text-sm leading-relaxed group-hover/item:text-white transition-colors">
                        {a.text}
                      </p>
                      <span
                        className="text-xs font-mono mt-1 inline-block"
                        style={{ color: a.color }}
                      >
                        → {a.metric}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Tech stack */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-[#94A3B8] mb-3 font-mono uppercase tracking-wider">Technologies used</p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map(t => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education/Background below */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="relative ml-16 md:ml-0 md:w-full mt-8"
          >
            <div className="absolute left-[-2.75rem] md:left-1/2 md:-translate-x-1/2 top-8 w-5 h-5 rounded-full border-2 border-[#A855F7]/50 bg-[#050816] z-10" />
            <div className="glass rounded-2xl p-6 md:w-[calc(50%-2rem)] border border-white/5 hover:bg-white/[0.07] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#A855F7]/15 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#A855F7]" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Engineering Graduate</h4>
                  <p className="text-[#94A3B8] text-sm">Computer Science & Engineering</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
