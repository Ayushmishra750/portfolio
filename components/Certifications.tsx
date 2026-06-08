'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Code2, Database, Cloud, Layers, ExternalLink, CheckCircle2, Target } from 'lucide-react'

type Cert = {
  title: string
  issuer: string
  icon: typeof Shield
  color: string
  year?: string
  desc: string
}

const completed: Cert[] = [
  {
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    icon: Shield,
    color: '#FF9900',
    year: '2023',
    desc: 'Foundational AWS cloud concepts, core services, security and billing.',
  },
  {
    title: 'SQL (Advanced) — HackerRank',
    issuer: 'HackerRank',
    icon: Database,
    color: '#00EA64',
    year: '2023',
    desc: 'Advanced SQL: joins, aggregation, window functions and query design.',
  },
  {
    title: 'Python — HackerRank',
    issuer: 'HackerRank',
    icon: Code2,
    color: '#38BDF8',
    year: '2023',
    desc: 'Python problem solving, data structures and scripting fundamentals.',
  },
]

const learning: Cert[] = [
  {
    title: 'SnowPro Associate',
    issuer: 'Snowflake',
    icon: Cloud,
    color: '#29B5E8',
    desc: 'Cloud data warehousing, virtual warehouses and Snowflake architecture.',
  },
  {
    title: 'AWS Certified Data Engineer — Associate',
    issuer: 'Amazon Web Services',
    icon: Shield,
    color: '#FF9900',
    desc: 'Data ingestion, transformation, pipeline orchestration and governance on AWS.',
  },
  {
    title: 'Databricks Data Engineer Associate',
    issuer: 'Databricks',
    icon: Layers,
    color: '#FF3621',
    desc: 'Lakehouse architecture, Delta Lake and Spark on Databricks.',
  },
  {
    title: 'dbt Fundamentals',
    issuer: 'dbt Labs',
    icon: Code2,
    color: '#FF694B',
    desc: 'Modular SQL transformations, testing, lineage and documentation.',
  },
]

function CertCard({ cert, learning, index, inView }: { cert: Cert; learning: boolean; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 20 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group relative glass rounded-2xl p-6 cursor-default overflow-hidden transition-all duration-300 hover:-translate-y-2"
      style={{ border: '1px solid var(--card-border-rest)', boxShadow: 'var(--card-shadow-rest)' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.border = `1px solid ${cert.color}40`
        ;(e.currentTarget as HTMLElement).style.boxShadow = `0 18px 40px var(--elev-shadow), 0 0 40px ${cert.color}15`
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.border = '1px solid var(--card-border-rest)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--card-shadow-rest)'
      }}
    >
      {/* Shine */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${cert.color}08 0%, transparent 50%, ${cert.color}05 100%)` }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3"
            style={{ background: `${cert.color}20`, color: cert.color }}
          >
            <cert.icon className="w-7 h-7" />
          </div>
          {learning ? (
            <span
              className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full"
              style={{ color: cert.color, background: `${cert.color}15`, border: `1px solid ${cert.color}30` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cert.color }} />
              In Progress
            </span>
          ) : (
            <span
              className="text-xs font-mono px-2 py-1 rounded-full"
              style={{ color: cert.color, background: `${cert.color}15`, border: `1px solid ${cert.color}30` }}
            >
              {cert.year}
            </span>
          )}
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

      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${cert.color}, transparent)` }}
      />
    </motion.div>
  )
}

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
          className="text-center mb-14"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">Certifications</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Credentials & <span className="gradient-text">Learning Path</span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Certifications earned, plus the data-engineering credentials I&apos;m actively working toward.
          </p>
        </motion.div>

        {/* Completed */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <h3 className="text-white font-bold text-sm uppercase tracking-[0.2em] font-mono">Completed</h3>
            <span className="text-xs text-[#94A3B8] font-mono">({completed.length})</span>
            <div className="flex-1 h-px bg-white/5 ml-2" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {completed.map((cert, i) => (
              <CertCard key={cert.title} cert={cert} learning={false} index={i} inView={inView} />
            ))}
          </div>
        </div>

        {/* Learning Path */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-4 h-4 text-[#A855F7]" />
            <h3 className="text-white font-bold text-sm uppercase tracking-[0.2em] font-mono">Learning Path</h3>
            <span className="text-xs text-[#94A3B8] font-mono">({learning.length} in progress)</span>
            <div className="flex-1 h-px bg-white/5 ml-2" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {learning.map((cert, i) => (
              <CertCard key={cert.title} cert={cert} learning index={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
