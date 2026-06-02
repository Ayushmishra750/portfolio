'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, BarChart3, Database, TrendingUp, Package, ArrowRight } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'Revenue Optimisation & Experimentation Analysis System',
    shortTitle: 'Revenue Optimization',
    category: 'Analytics Platform',
    description: 'End-to-end analytics system for revenue optimization combining SQL analytics, Python-driven insights, and A/B testing frameworks to drive data-informed business decisions.',
    longDescription: 'Built a comprehensive revenue optimization platform that leverages advanced SQL analysis and Python analytics to identify growth opportunities. The system includes sophisticated A/B testing infrastructure, statistical significance testing, and Tableau dashboards for real-time revenue monitoring. Processes millions of transactions to surface actionable insights.',
    icon: TrendingUp,
    color: '#38BDF8',
    tags: ['SQL', 'Python', 'A/B Testing', 'Tableau', 'Statistical Analysis', 'Data Analytics'],
    highlights: [
      'Designed SQL queries analyzing 10M+ transaction records',
      'Built A/B testing framework with statistical significance validation',
      'Created Tableau dashboards reducing reporting time by 60%',
      'Automated revenue anomaly detection with Python alerts',
    ],
    impact: 'Revenue insights delivered 15% revenue increase',
  },
  {
    id: 2,
    title: 'Operations & Supply Chain Performance Analytics',
    shortTitle: 'Supply Chain Analytics',
    category: 'Data Engineering',
    description: 'Scalable analytics platform for supply chain operations, shipment tracking, and KPI monitoring with automated reporting pipelines.',
    longDescription: 'Engineered a production-grade supply chain analytics solution that tracks logistics operations in real time. Features include automated ETL pipelines for shipment data, KPI tracking across 50+ metrics, and self-service reporting automation. Built on AWS infrastructure with PySpark for large-scale data processing.',
    icon: Package,
    color: '#A855F7',
    tags: ['PySpark', 'Python', 'SQL', 'AWS S3', 'ETL', 'KPI Analytics', 'Reporting'],
    highlights: [
      'Processed daily shipment data from 200+ logistics partners',
      'Built automated KPI tracking across 50+ performance metrics',
      'Reduced reporting cycle from 3 days to 4 hours with automation',
      'Implemented real-time shipment anomaly detection system',
    ],
    impact: '70% reduction in manual reporting effort',
  },
]

function ProjectModal({ project, onClose }: { project: typeof projects[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative max-w-2xl w-full glass-strong rounded-2xl p-8 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        style={{ border: `1px solid ${project.color}30` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${project.color}20` }}>
            <project.icon className="w-7 h-7" style={{ color: project.color }} />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider" style={{ color: project.color }}>{project.category}</span>
            <h3 className="text-white font-black text-xl leading-tight">{project.title}</h3>
          </div>
        </div>

        <p className="text-[#94A3B8] leading-relaxed mb-6">{project.longDescription}</p>

        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Key Achievements</h4>
          <div className="space-y-2">
            {project.highlights.map((h, i) => (
              <div key={i} className="flex gap-3">
                <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" style={{ color: project.color }} />
                <span className="text-[#94A3B8] text-sm">{h}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 p-4 rounded-xl" style={{ background: `${project.color}10`, border: `1px solid ${project.color}20` }}>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: project.color }} />
            <span className="text-white font-medium text-sm">Impact: {project.impact}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono" style={{ color: project.color, background: `${project.color}15`, border: `1px solid ${project.color}30` }}>
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [selected, setSelected] = useState<typeof projects[0] | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="projects" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">Projects</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Featured <span className="gradient-text">Work</span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Click any project to see full details, impact metrics, and technology breakdown.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(project)}
              className="glass rounded-2xl p-7 cursor-pointer group relative overflow-hidden transition-all duration-300"
              style={{
                border: `1px solid ${hovered === project.id ? project.color + '40' : 'rgba(255,255,255,0.07)'}`,
                boxShadow: hovered === project.id ? `0 0 40px ${project.color}15` : 'none',
                transform: hovered === project.id ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              {/* Background gradient on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 0%, ${project.color}08 0%, transparent 70%)` }}
              />

              {/* 3D tilt effect via CSS */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: `${project.color}15` }}
                    >
                      <project.icon className="w-6 h-6" style={{ color: project.color }} />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider" style={{ color: project.color }}>
                        {project.category}
                      </span>
                      <div className="w-0 group-hover:w-full h-px transition-all duration-500" style={{ background: project.color }} />
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#94A3B8] group-hover:text-white transition-colors" />
                </div>

                <h3 className="text-white font-black text-lg mb-3 leading-tight group-hover:text-[#38BDF8] transition-colors">
                  {project.title}
                </h3>

                <p className="text-[#94A3B8] text-sm leading-relaxed mb-5">{project.description}</p>

                {/* Impact badge */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-5" style={{ background: `${project.color}10`, border: `1px solid ${project.color}20` }}>
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: project.color }} />
                  <span className="text-xs font-mono" style={{ color: project.color }}>{project.impact}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono text-[#94A3B8] bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono text-[#94A3B8] bg-white/5">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs font-mono" style={{ color: project.color }}>
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
