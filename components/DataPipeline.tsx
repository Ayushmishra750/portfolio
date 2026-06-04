'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Database, HardDrive, Workflow, Cpu, ShieldCheck, Warehouse, BarChart3,
} from 'lucide-react'

// ── Pipeline definition (production-grade AWS Data Engineering flow) ────────────

type Stage = {
  id: string
  label: string
  sub: string
  icon: typeof Database
  color: string
  features: string[]
}

const pipelineStages: Stage[] = [
  {
    id: 'sources',
    label: 'Raw Data Sources',
    sub: 'Ingestion Layer',
    icon: Database,
    color: '#38BDF8',
    features: ['Source Systems', 'CSV', 'JSON', 'Parquet', 'APIs & Databases'],
  },
  {
    id: 's3',
    label: 'AWS S3',
    sub: 'Data Lake Storage',
    icon: HardDrive,
    color: '#60A5FA',
    features: ['Data Lake Storage', 'CSV', 'JSON', 'Parquet', 'Source Systems'],
  },
  {
    id: 'stepfn',
    label: 'AWS Step Functions',
    sub: 'Workflow Orchestration',
    icon: Workflow,
    color: '#A855F7',
    features: ['Workflow Orchestration', 'Job Dependencies', 'Retry Logic', 'Monitoring'],
  },
  {
    id: 'glue',
    label: 'AWS Glue + PySpark',
    sub: 'Distributed ETL Processing',
    icon: Cpu,
    color: '#F59E0B',
    features: ['Distributed Processing', 'ETL Pipelines', 'Data Transformation', 'Large Scale Computation'],
  },
  {
    id: 'validation',
    label: 'Data Validation',
    sub: 'Quality Checks & Reconciliation',
    icon: ShieldCheck,
    color: '#34D399',
    features: ['Schema Validation', 'Reconciliation', 'Quality Checks', 'Business Rules'],
  },
  {
    id: 'warehouse',
    label: 'BigQuery / Redshift',
    sub: 'Data Warehouse',
    icon: Warehouse,
    color: '#FB923C',
    features: ['Data Warehouse', 'Analytical Queries', 'Aggregations', 'Reporting Layer'],
  },
  {
    id: 'dashboard',
    label: 'Tableau Dashboard',
    sub: 'Business Intelligence',
    icon: BarChart3,
    color: '#F472B6',
    features: ['KPI Monitoring', 'Executive Reporting', 'Business Insights'],
  },
]

// Rotating architecture insights (replaces duplicate achievement metrics)
const insights = [
  { title: 'AWS Step Functions Orchestration', desc: 'Coordinated, dependency-aware workflows with retries and monitoring.', color: '#A855F7' },
  { title: 'Distributed PySpark Processing',    desc: 'Parallel ETL across partitioned datasets on AWS Glue workers.',      color: '#F59E0B' },
  { title: 'Automated Data Validation',         desc: 'Schema, reconciliation and business-rule checks on every run.',       color: '#34D399' },
  { title: 'Scalable Data Lake Architecture',   desc: 'S3-backed storage for CSV, JSON and columnar Parquet at scale.',      color: '#60A5FA' },
  { title: 'Data Warehouse Analytics',          desc: 'High-speed aggregations on BigQuery / Redshift reporting layers.',    color: '#FB923C' },
  { title: 'Business Intelligence Reporting',   desc: 'Executive KPI dashboards and insights delivered via Tableau.',        color: '#F472B6' },
]

const PACKET_COUNT = 3

export default function DataPipeline() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-150px' })

  const [tick, setTick] = useState(0)            // 0..1 global flow position
  const [hovered, setHovered] = useState<number | null>(null) // for focus-mode dimming
  const [selected, setSelected] = useState(0)    // persists for info panel
  const [insightIdx, setInsightIdx] = useState(0)

  const N = pipelineStages.length

  // Continuous fast data flow (~2.5x faster, multiple packets)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setTick(t => (t + dt * 0.22) % 1) // full pipeline traversal ~4.5s
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  // Auto-rotate architecture insights
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setInsightIdx(i => (i + 1) % insights.length), 3000)
    return () => clearInterval(t)
  }, [inView])

  // Compute packets: each has a global position across (N-1) connectors
  const packets = Array.from({ length: PACKET_COUNT }, (_, p) => {
    const pos = ((tick + p / PACKET_COUNT) % 1) * (N - 1)
    return { connector: Math.floor(pos), progress: pos - Math.floor(pos) }
  })

  const active = hovered ?? selected
  const sel = pipelineStages[selected]

  return (
    <section id="pipeline" ref={ref} className="force-dark section-padding relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">Architecture</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            ETL <span className="gradient-text">Pipeline</span> Visualization
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto">
            A production-grade AWS data engineering architecture. Watch data stream
            from source to insight — hover or tap any stage to inspect it.
          </p>
        </motion.div>

        {/* Pipeline flow (horizontal-scrollable on small screens) */}
        <div className="overflow-x-auto pb-2 -mx-6 px-6 scrollbar-thin">
          <div className="flex items-stretch min-w-[820px] lg:min-w-0">
            {pipelineStages.map((stage, i) => {
              const isActive = active === i
              const isAdjacent = active === i - 1 || active === i + 1
              const dim = hovered !== null && !isActive && !isAdjacent
              return (
                <div key={stage.id} className="flex items-center flex-1">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={inView ? { opacity: dim ? 0.4 : 1, scale: 1 } : {}}
                    transition={{ delay: inView ? i * 0.08 : 0, type: 'spring', damping: 16 }}
                    onMouseEnter={() => { setHovered(i); setSelected(i) }}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(i)}
                    className="relative flex-1 min-w-[110px] cursor-pointer group text-center pt-6"
                  >
                    <div
                      className="relative glass rounded-2xl p-4 transition-all duration-300"
                      style={{
                        border: `1px solid ${isActive ? stage.color + '70' : 'rgba(255,255,255,0.07)'}`,
                        boxShadow: isActive ? `0 0 28px ${stage.color}35` : 'none',
                        transform: isActive ? 'scale(1.06)' : 'scale(1)',
                      }}
                    >
                      {/* Icon + special effects */}
                      <div className="relative w-11 h-11 mx-auto mb-3">
                        {stage.id === 'stepfn' && (
                          <>
                            <motion.span
                              className="absolute inset-0 rounded-xl border" style={{ borderColor: stage.color }}
                              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                              transition={{ duration: 1.6, repeat: Infinity }}
                            />
                            <motion.span
                              className="absolute inset-0 rounded-xl border" style={{ borderColor: stage.color }}
                              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                              transition={{ duration: 1.6, repeat: Infinity, delay: 0.8 }}
                            />
                          </>
                        )}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 relative"
                          style={{ background: `${stage.color}20` }}
                        >
                          <stage.icon className="w-5 h-5" style={{ color: stage.color }} />
                        </div>
                      </div>

                      <div className="text-white font-bold text-xs mb-1 leading-tight">{stage.label}</div>
                      <div className="text-[#94A3B8] text-[10px] leading-tight">{stage.sub}</div>

                      {/* Validation: animated quality-check pulse */}
                      {stage.id === 'validation' && (
                        <div className="mt-2 flex items-center justify-center gap-1">
                          {Array.from({ length: 5 }).map((_, ci) => (
                            <motion.span
                              key={ci}
                              className="w-1.5 h-1.5 rounded-full" style={{ background: stage.color }}
                              animate={inView ? { opacity: [0.2, 1, 0.2] } : {}}
                              transition={{ duration: 1.4, repeat: Infinity, delay: ci * 0.2 }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Step number */}
                      <div
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold"
                        style={{ background: stage.color, color: '#050816' }}
                      >
                        {i + 1}
                      </div>
                    </div>
                  </motion.button>

                  {/* Connector with flowing packets + glow trail */}
                  {i < N - 1 && (
                    <div className="relative w-6 shrink-0 self-center mt-6 flex items-center" style={{ height: '2px' }}>
                      <div
                        className="w-full h-px transition-colors duration-300"
                        style={{ background: (active === i || active === i + 1) ? `${stage.color}80` : 'rgba(255,255,255,0.1)' }}
                      />
                      {packets.filter(pk => pk.connector === i).map((pk, pi) => (
                        <div key={pi} className="absolute top-1/2" style={{ left: `${pk.progress * 100}%`, transform: 'translate(-50%, -50%)' }}>
                          {/* glow trail */}
                          <div
                            className="absolute top-1/2 right-0 -translate-y-1/2 h-[2px] rounded-full"
                            style={{ width: 18, background: `linear-gradient(90deg, transparent, ${stage.color})`, opacity: 0.6 }}
                          />
                          {/* packet */}
                          <div
                            className="w-2 h-2 rounded-full relative"
                            style={{ background: stage.color, boxShadow: `0 0 8px ${stage.color}, 0 0 16px ${stage.color}` }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Architecture caption — stronger hierarchy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-[#CBD5E1] text-base md:text-lg font-medium mt-12 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Production-grade AWS Data Engineering Architecture used for large-scale ETL,
          data migration, validation, and analytics workloads.
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Stage information panel (replaces floating tooltips) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="glass-strong rounded-2xl p-6 border border-white/5 min-h-[200px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={sel.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${sel.color}20` }}>
                    <sel.icon className="w-5 h-5" style={{ color: sel.color }} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{sel.label}</h3>
                    <p className="text-sm font-medium" style={{ color: sel.color }}>{sel.sub}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sel.features.map(f => (
                    <span
                      key={f}
                      className="text-xs font-mono px-3 py-1.5 rounded-full text-[#CBD5E1]"
                      style={{ background: `${sel.color}12`, border: `1px solid ${sel.color}30` }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Architecture insights — auto-rotating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            className="glass-strong rounded-2xl p-6 border border-white/5 min-h-[200px] flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-[#94A3B8] tracking-[0.25em] uppercase">Architecture Insights</span>
              <div className="flex gap-1.5">
                {insights.map((ins, i) => (
                  <button
                    key={i}
                    onClick={() => setInsightIdx(i)}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === insightIdx ? 18 : 6,
                      background: i === insightIdx ? ins.color : 'rgba(255,255,255,0.2)',
                    }}
                    aria-label={ins.title}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={insightIdx}
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col justify-center"
              >
                <div
                  className="w-12 h-1 rounded-full mb-4"
                  style={{ background: insights[insightIdx].color, boxShadow: `0 0 16px ${insights[insightIdx].color}` }}
                />
                <h3
                  className="text-2xl font-black mb-2 leading-tight"
                  style={{ color: insights[insightIdx].color }}
                >
                  {insights[insightIdx].title}
                </h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  {insights[insightIdx].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
