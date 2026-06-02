'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'
import { Database, Cloud, Zap, BarChart3, Server, GitBranch } from 'lucide-react'

const stats = [
  { value: 3.5, suffix: '+', label: 'Years Experience', icon: Zap },
  { value: 5, suffix: 'M+', label: 'Records Processed Daily', icon: Database },
  { value: 30, suffix: '%', label: 'Efficiency Improvement', icon: BarChart3 },
  { value: 10, suffix: '+', label: 'Projects Delivered', icon: GitBranch },
]

const highlights = [
  {
    icon: Database,
    title: 'Data Pipeline Expert',
    desc: 'Designed and deployed end-to-end ETL pipelines processing millions of records with zero data loss.'
  },
  {
    icon: Cloud,
    title: 'Cloud Native',
    desc: 'Deep expertise in AWS ecosystem — S3, Glue, Step Functions, Lambda — architecting serverless data solutions.'
  },
  {
    icon: Server,
    title: 'Big Data Engineering',
    desc: 'PySpark distributed computing, optimizing jobs for petabyte-scale datasets with 30%+ efficiency gains.'
  },
]

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">About Me</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Passionate About <span className="gradient-text">Data</span>
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            Transforming complex data challenges into elegant, scalable solutions that drive real business impact.
          </p>
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-8 gradient-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38BDF8]/20 to-[#A855F7]/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <h3 className="text-white font-bold text-lg">Who I Am</h3>
              </div>
              <p className="text-[#94A3B8] leading-relaxed">
                I&apos;m <span className="text-white font-semibold">Ayush Mishra</span>, a Data Engineer at{' '}
                <span className="text-[#38BDF8]">Cognizant Technology Solutions</span> with 3.5+ years of experience
                building enterprise-grade data systems. Based in Noida, India, I specialize in creating
                high-performance ETL pipelines and cloud-native data architectures.
              </p>
              <p className="text-[#94A3B8] leading-relaxed mt-4">
                My expertise spans the full data lifecycle — from ingestion and transformation to analytics
                and visualization — using cutting-edge tools like PySpark, AWS Glue, and BigQuery to
                deliver measurable business outcomes.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {['Python', 'PySpark', 'SQL', 'AWS', 'BigQuery', 'Tableau'].map((tech, i) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="glass rounded-xl p-3 text-center text-sm font-mono text-[#38BDF8] border border-[#38BDF8]/20 hover:border-[#38BDF8]/50 hover:bg-[#38BDF8]/5 transition-all cursor-default"
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: highlight cards */}
          <div className="space-y-4">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, x: 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                className="glass rounded-2xl p-6 flex gap-4 group hover:bg-white/[0.07] transition-all duration-300 cursor-default"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#38BDF8]/20 to-[#A855F7]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <h.icon className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{h.title}</h4>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
              className="glass rounded-2xl p-6 text-center group hover:bg-white/[0.07] transition-all duration-300 cursor-default float-1"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38BDF8]/20 to-[#A855F7]/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5 text-[#38BDF8]" />
              </div>
              <div className="text-3xl font-black gradient-text mb-1">
                {inView && (
                  <>
                    <CountUp end={stat.value} duration={2} decimals={stat.value % 1 !== 0 ? 1 : 0} />
                    {stat.suffix}
                  </>
                )}
              </div>
              <div className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
