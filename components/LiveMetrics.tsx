'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Activity, Cpu, CheckCircle2, Layers, ArrowUpRight } from 'lucide-react'

const POINTS = 48

// Seeded-ish random walk for a realistic-looking live stream
function nextValue(prev: number, min: number, max: number, volatility: number) {
  const delta = (Math.random() - 0.5) * volatility
  return Math.min(max, Math.max(min, prev + delta))
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 100
  const h = 36
  const step = w / (data.length - 1)
  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
  const line = pts.join(' ')
  const area = `0,${h} ${line} ${w},${h}`
  const gid = `grad-${color.replace('#', '')}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-9">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

const jobFeed = [
  { name: 'glue_ingest_orders',     region: 'us-east-1', color: '#34D399' },
  { name: 'spark_txn_aggregations', region: 'us-east-1', color: '#34D399' },
  { name: 'validate_recon_daily',   region: 'eu-west-1', color: '#38BDF8' },
  { name: 'load_warehouse_kpis',    region: 'ap-south-1', color: '#A855F7' },
  { name: 'export_tableau_extract', region: 'us-west-2', color: '#FB923C' },
]

export default function LiveMetrics() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })

  const [throughput, setThroughput] = useState<number[]>(() =>
    Array.from({ length: POINTS }, () => 1800 + Math.random() * 600)
  )
  const [cpu, setCpu] = useState<number[]>(() =>
    Array.from({ length: POINTS }, () => 55 + Math.random() * 25)
  )
  const [latency, setLatency] = useState<number[]>(() =>
    Array.from({ length: POINTS }, () => 30 + Math.random() * 40)
  )

  // Live stream tick
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => {
      setThroughput(d => [...d.slice(1), nextValue(d[d.length - 1], 1200, 2800, 320)])
      setCpu(d => [...d.slice(1), nextValue(d[d.length - 1], 35, 95, 12)])
      setLatency(d => [...d.slice(1), nextValue(d[d.length - 1], 12, 90, 18)])
    }, 1100)
    return () => clearInterval(t)
  }, [inView])

  const lastThroughput = Math.round(throughput[throughput.length - 1])
  const lastCpu = Math.round(cpu[cpu.length - 1])
  const lastLatency = Math.round(latency[latency.length - 1])

  return (
    <section id="telemetry" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">Live Telemetry</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Pipeline <span className="gradient-text">In Motion</span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            A simulated real-time view of the kind of streaming telemetry I monitor
            across production ETL workloads.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Throughput — main chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 glass-strong rounded-2xl p-6 border border-white/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-[#38BDF8]" />
                  <span className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider">Throughput</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl md:text-4xl font-black text-white tabular-nums">{lastThroughput.toLocaleString()}</span>
                  <span className="text-[#94A3B8] text-sm font-mono mb-1.5">records / sec</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#34D399]/10 border border-[#34D399]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                <span className="text-[10px] font-mono text-[#34D399]">streaming</span>
              </div>
            </div>
            <Sparkline data={throughput} color="#38BDF8" />
          </motion.div>

          {/* Active jobs count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
            className="glass-strong rounded-2xl p-6 border border-white/5 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-[#A855F7]" />
              <span className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider">Active Glue Jobs</span>
            </div>
            <div>
              <span className="text-4xl font-black text-[#A855F7]">{jobFeed.length}</span>
              <p className="text-[#94A3B8] text-xs mt-1 font-mono">across 4 AWS regions</p>
            </div>
          </motion.div>

          {/* CPU utilization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="glass-strong rounded-2xl p-5 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#FB923C]" />
                <span className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider">Cluster CPU</span>
              </div>
              <span className="text-lg font-black text-[#FB923C] tabular-nums">{lastCpu}%</span>
            </div>
            <Sparkline data={cpu} color="#FB923C" />
          </motion.div>

          {/* Latency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 }}
            className="glass-strong rounded-2xl p-5 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-[#34D399]" />
                <span className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider">P95 Latency</span>
              </div>
              <span className="text-lg font-black text-[#34D399] tabular-nums">{lastLatency} ms</span>
            </div>
            <Sparkline data={latency} color="#34D399" />
          </motion.div>

          {/* Success rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="glass-strong rounded-2xl p-5 border border-white/5 flex flex-col justify-center items-center text-center"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider">Job Success</span>
            </div>
            <span className="text-3xl font-black gradient-text">99.7%</span>
            <span className="text-[10px] text-[#94A3B8] font-mono mt-1">last 24h</span>
          </motion.div>

          {/* Job feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45 }}
            className="lg:col-span-3 glass-strong rounded-2xl p-6 border border-white/5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider">Recent Job Executions</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {jobFeed.map((job, i) => (
                <motion.div
                  key={job.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <motion.span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: job.color, boxShadow: `0 0 6px ${job.color}` }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-xs font-mono truncate">{job.name}</div>
                    <div className="text-[#64748B] text-[10px] font-mono">{job.region}</div>
                  </div>
                  <span className="text-[10px] font-mono text-[#34D399]">✓ done</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <p className="text-center text-[#64748B] text-[11px] font-mono mt-6">
          * Visualization is illustrative — values are simulated to demonstrate real-time monitoring patterns.
        </p>
      </div>
    </section>
  )
}
