'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Database, Cloud, Cpu, CheckCircle, BarChart3, HardDrive, Zap } from 'lucide-react'

const pipelineStages = [
  {
    id: 'sources',
    label: 'Raw Data Sources',
    icon: Database,
    color: '#38BDF8',
    desc: 'CSV, JSON, APIs, Databases',
    detail: 'Ingests from multiple heterogeneous sources',
  },
  {
    id: 's3',
    label: 'AWS S3',
    icon: HardDrive,
    color: '#60A5FA',
    desc: 'Data Lake Storage',
    detail: 'Scalable object storage with lifecycle policies',
  },
  {
    id: 'glue',
    label: 'AWS Glue',
    icon: Cloud,
    color: '#A855F7',
    desc: 'ETL Orchestration',
    detail: 'Serverless ETL with auto-scaling workers',
  },
  {
    id: 'spark',
    label: 'PySpark Transform',
    icon: Cpu,
    color: '#F59E0B',
    desc: 'Distributed Processing',
    detail: 'Processes 5M+ records with optimized DAGs',
  },
  {
    id: 'validation',
    label: 'Data Validation',
    icon: CheckCircle,
    color: '#34D399',
    desc: 'Quality Assurance',
    detail: 'Schema validation, null checks, deduplication',
  },
  {
    id: 'analytics',
    label: 'Analytics Layer',
    icon: Zap,
    color: '#FB923C',
    desc: 'BigQuery / Redshift',
    detail: 'Columnar storage for high-speed analytics',
  },
  {
    id: 'dashboard',
    label: 'Business Dashboard',
    icon: BarChart3,
    color: '#F472B6',
    desc: 'Tableau / Reports',
    detail: 'Real-time KPIs and executive dashboards',
  },
]

export default function DataPipeline() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-150px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const [activeStage, setActiveStage] = useState<number | null>(null)
  const [packetPos, setPacketPos] = useState(0)

  // Animate data packets
  useEffect(() => {
    if (!inView) return
    const interval = setInterval(() => {
      setPacketPos(p => (p + 1) % (pipelineStages.length * 100))
    }, 50)
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
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">Live Demo</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            ETL <span className="gradient-text">Pipeline</span> Visualization
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto">
            Watch data flow through a real-world AWS data pipeline architecture.
            Hover stages to see details.
          </p>
        </motion.div>

        {/* Pipeline visualization */}
        <div className="relative">
          {/* Pipeline stages - vertical on mobile, connected horizontally on desktop */}

          {/* Desktop: horizontal flow */}
          <div className="hidden lg:block">
            <div className="relative flex items-center justify-between gap-2">
              {pipelineStages.map((stage, i) => (
                <div key={stage.id} className="flex items-center flex-1">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: i * 0.1, type: 'spring', damping: 15 }}
                    onMouseEnter={() => setActiveStage(i)}
                    onMouseLeave={() => setActiveStage(null)}
                    className="relative flex-1 cursor-pointer group"
                  >
                    {/* Stage card */}
                    <div
                      className="relative glass rounded-2xl p-4 text-center transition-all duration-300"
                      style={{
                        border: `1px solid ${currentStageIndex === i || activeStage === i ? stage.color + '60' : 'rgba(255,255,255,0.07)'}`,
                        boxShadow: currentStageIndex === i ? `0 0 30px ${stage.color}30` : activeStage === i ? `0 0 20px ${stage.color}20` : 'none',
                        transform: activeStage === i ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      {/* Active indicator */}
                      {currentStageIndex === i && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          style={{ background: `${stage.color}08` }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}

                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110"
                        style={{ background: `${stage.color}20` }}
                      >
                        <stage.icon className="w-5 h-5" style={{ color: stage.color }} />
                      </div>

                      <div className="text-white font-bold text-xs mb-1 leading-tight">{stage.label}</div>
                      <div className="text-[#94A3B8] text-[10px]">{stage.desc}</div>

                      {/* Tooltip */}
                      {activeStage === i && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-48 glass rounded-xl px-3 py-2 z-20 pointer-events-none"
                          style={{ border: `1px solid ${stage.color}30` }}
                        >
                          <p className="text-xs text-[#94A3B8] text-center">{stage.detail}</p>
                        </motion.div>
                      )}

                      {/* Step number */}
                      <div
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold"
                        style={{ background: stage.color, color: '#050816' }}
                      >
                        {i + 1}
                      </div>
                    </div>
                  </motion.div>

                  {/* Connector */}
                  {i < pipelineStages.length - 1 && (
                    <div className="relative w-6 shrink-0 flex items-center">
                      <div className="w-full h-px bg-white/10" />
                      {/* Moving packet */}
                      {currentStageIndex === i && (
                        <motion.div
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            background: stage.color,
                            left: `${progressInStage * 100}%`,
                            boxShadow: `0 0 8px ${stage.color}`,
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
                  {/* Vertical connector */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${stage.color}20`,
                        border: `1px solid ${currentStageIndex === i ? stage.color + '60' : 'transparent'}`,
                        boxShadow: currentStageIndex === i ? `0 0 20px ${stage.color}30` : 'none',
                      }}
                    >
                      <stage.icon className="w-5 h-5" style={{ color: stage.color }} />
                    </div>
                    {i < pipelineStages.length - 1 && (
                      <div className="w-px flex-1 min-h-[40px] bg-gradient-to-b from-white/20 to-white/5 my-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="text-white font-bold text-sm">{stage.label}</h4>
                    <p className="text-[#94A3B8] text-xs">{stage.desc}</p>
                    <p className="text-[#94A3B8] text-xs mt-1 opacity-70">{stage.detail}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats below pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Daily Records', value: '5M+', color: '#38BDF8' },
            { label: 'Pipeline Uptime', value: '99.9%', color: '#A855F7' },
            { label: 'Avg Latency', value: '<2min', color: '#34D399' },
            { label: 'Cost Savings', value: '40%', color: '#FB923C' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="glass rounded-2xl p-5 text-center border border-white/5"
            >
              <div className="text-2xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
