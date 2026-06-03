'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'
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

const VALIDATION_CHECKS = ['Schema', 'Nulls', 'Dedup', 'Reconciliation', 'Business Rules']

// ── Metrics (from real resume) ──────────────────────────────────────────────────

const metrics = [
  { label: 'Records Processed',     value: 5,  suffix: 'M+', color: '#38BDF8' },
  { label: 'Efficiency Improvement', value: 30, suffix: '%',  color: '#A855F7' },
  { label: 'Manual Effort Reduced',  value: 40, suffix: '%',  color: '#34D399' },
  { label: 'Data Migration Projects', value: 2, suffix: '+', color: '#FB923C' },
]

export default function DataPipeline() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-150px' })
  const [activeStage, setActiveStage] = useState<number | null>(null)
  const [packetPos, setPacketPos] = useState(0)

  // Continuous packet travel through the pipeline
  useEffect(() => {
    if (!inView) return
    const interval = setInterval(() => {
      setPacketPos(p => (p + 1) % (pipelineStages.length * 100))
    }, 45)
    return () => clearInterval(interval)
  }, [inView])

  const currentStageIndex = Math.floor(packetPos / 100) % pipelineStages.length
  const progressInStage = (packetPos % 100) / 100

  return (
    <section id="pipeline" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">Architecture</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            ETL <span className="gradient-text">Pipeline</span> Visualization
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto">
            A production-grade AWS data engineering architecture. Watch data flow
            from source to insight — hover any stage for details.
          </p>
        </motion.div>

        {/* Pipeline visualization */}
        <div className="relative">
          {/* Desktop: horizontal flow */}
          <div className="hidden lg:block">
            <div className="relative flex items-start justify-between gap-1">
              {pipelineStages.map((stage, i) => (
                <div key={stage.id} className="flex items-start flex-1">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: i * 0.1, type: 'spring', damping: 15 }}
                    onMouseEnter={() => setActiveStage(i)}
                    onMouseLeave={() => setActiveStage(null)}
                    className="relative flex-1 cursor-pointer group pt-6"
                  >
                    {/* Stage card */}
                    <div
                      className="relative glass rounded-2xl p-4 text-center transition-all duration-300"
                      style={{
                        border: `1px solid ${currentStageIndex === i || activeStage === i ? stage.color + '60' : 'rgba(255,255,255,0.07)'}`,
                        boxShadow: currentStageIndex === i ? `0 0 30px ${stage.color}30` : activeStage === i ? `0 0 20px ${stage.color}20` : 'none',
                        transform: activeStage === i ? 'scale(1.05)' : 'scale(1)',
                        zIndex: activeStage === i ? 30 : 1,
                      }}
                    >
                      {/* Active glow pulse */}
                      {currentStageIndex === i && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          style={{ background: `${stage.color}08` }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}

                      {/* Icon + special effects */}
                      <div className="relative w-11 h-11 mx-auto mb-3">
                        {/* Step Functions: orchestration pulse rings */}
                        {stage.id === 'stepfn' && (
                          <>
                            <motion.span
                              className="absolute inset-0 rounded-xl border"
                              style={{ borderColor: stage.color }}
                              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                              transition={{ duration: 1.6, repeat: Infinity }}
                            />
                            <motion.span
                              className="absolute inset-0 rounded-xl border"
                              style={{ borderColor: stage.color }}
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

                      {/* Validation: animated success checks + quality score */}
                      {stage.id === 'validation' && (
                        <div className="mt-2 flex items-center justify-center gap-1">
                          {VALIDATION_CHECKS.map((_, ci) => (
                            <motion.span
                              key={ci}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: stage.color }}
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

                      {/* Hover detail card */}
                      {activeStage === i && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-52 glass-strong rounded-xl px-4 py-3 z-40 pointer-events-none text-left"
                          style={{ border: `1px solid ${stage.color}40`, boxShadow: `0 10px 40px ${stage.color}20` }}
                        >
                          <div className="text-white font-bold text-xs mb-2" style={{ color: stage.color }}>
                            {stage.label}
                          </div>
                          <ul className="space-y-1">
                            {stage.features.map(f => (
                              <li key={f} className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: stage.color }} />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Connector */}
                  {i < pipelineStages.length - 1 && (
                    <div className="relative w-5 shrink-0 flex items-center self-center mt-6" style={{ minHeight: '88px' }}>
                      <div className="w-full h-px bg-white/10" />
                      {currentStageIndex === i && (
                        <motion.div
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            background: stage.color,
                            left: `${progressInStage * 100}%`,
                            boxShadow: `0 0 10px ${stage.color}, 0 0 20px ${stage.color}`,
                            transform: 'translate(-50%, -50%)',
                            top: '50%',
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical flow */}
          <div className="lg:hidden max-w-sm mx-auto">
            {pipelineStages.map((stage, i) => (
              <div key={stage.id} className="relative">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                      style={{
                        background: `${stage.color}20`,
                        border: `1px solid ${currentStageIndex === i ? stage.color + '60' : 'transparent'}`,
                        boxShadow: currentStageIndex === i ? `0 0 20px ${stage.color}30` : 'none',
                      }}
                    >
                      {stage.id === 'stepfn' && (
                        <motion.span
                          className="absolute inset-0 rounded-xl border"
                          style={{ borderColor: stage.color }}
                          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                        />
                      )}
                      <stage.icon className="w-5 h-5" style={{ color: stage.color }} />
                    </div>
                    {i < pipelineStages.length - 1 && (
                      <div className="w-px flex-1 min-h-[44px] bg-gradient-to-b from-white/20 to-white/5 my-2 relative overflow-hidden">
                        {currentStageIndex === i && (
                          <motion.div
                            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                            style={{ background: stage.color, boxShadow: `0 0 8px ${stage.color}` }}
                            animate={{ top: ['0%', '100%'] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="text-white font-bold text-sm">{stage.label}</h4>
                    <p className="text-xs" style={{ color: stage.color }}>{stage.sub}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {stage.features.map(f => (
                        <span
                          key={f}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full text-[#94A3B8]"
                          style={{ background: `${stage.color}12`, border: `1px solid ${stage.color}25` }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center text-[#64748B] text-xs md:text-sm font-mono mt-12 max-w-3xl mx-auto leading-relaxed"
        >
          Production-grade AWS Data Engineering Architecture used for large-scale ETL,
          data migration, validation, and analytics workloads.
        </motion.p>

        {/* Metrics — animate on viewport entry */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {metrics.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="glass rounded-2xl p-5 text-center border border-white/5"
            >
              <div className="text-2xl md:text-3xl font-black mb-1" style={{ color: stat.color }}>
                {inView ? (
                  <CountUp end={stat.value} duration={2} suffix={stat.suffix} />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>
              <div className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
