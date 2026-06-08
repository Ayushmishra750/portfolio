'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, TrendingUp, ArrowRight, ShieldCheck, Database, Package } from 'lucide-react'

type Project = {
  id: number
  title: string
  category: string
  icon: typeof Database
  color: string
  description: string
  problem: string
  architecture: string[]
  tags: string[]
  impactHeadline: string
  impactBullets: string[]
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Data Validation & Reconciliation Framework',
    category: 'Data Quality',
    icon: ShieldCheck,
    color: '#34D399',
    description:
      'A config-driven PySpark framework that validates and reconciles data between source systems and the warehouse, catching mismatches before they reach reporting.',
    problem:
      'Reconciliation between source systems and the warehouse was manual and query-by-query — slow, error-prone, and bad records were slipping into business reports.',
    architecture: [
      'Config-driven rules: schema, null, range, referential, row-count & checksum checks',
      'PySpark jobs on AWS Glue compare source vs. target datasets at scale',
      'Reconciliation summaries written to S3 and surfaced as a quality report',
      'Failures are flagged and routed for review before any downstream load',
    ],
    tags: ['PySpark', 'AWS Glue', 'Python', 'SQL', 'AWS S3', 'Data Quality'],
    impactHeadline: '~80% less manual reconciliation',
    impactBullets: [
      'Automated row-count, checksum and business-rule checks across pipelines',
      'Reduced manual reconciliation effort by roughly 80%',
      'Caught schema & data drift before it reached reporting layers',
    ],
  },
  {
    id: 2,
    title: 'Enterprise Data Migration Platform',
    category: 'Data Migration',
    icon: Database,
    color: '#38BDF8',
    description:
      'A repeatable, validated pipeline for migrating large datasets from legacy on-prem systems into an AWS data warehouse — with full source-to-target parity.',
    problem:
      'Legacy on-prem databases had to move to a cloud warehouse without disrupting downstream consumers or losing a single record across large historical datasets.',
    architecture: [
      'Batch extraction from legacy sources into an S3 landing zone',
      'PySpark on AWS Glue for cleansing, type-casting & transformation',
      'AWS Step Functions orchestrate staged loads with retries & checkpoints',
      'Post-load reconciliation confirms parity between source and target',
    ],
    tags: ['AWS Glue', 'PySpark', 'AWS S3', 'Step Functions', 'Redshift', 'Python', 'SQL'],
    impactHeadline: 'Zero data loss on migration',
    impactBullets: [
      'Migrated large historical datasets with full source-to-target parity',
      'Idempotent, restartable loads via Step Functions checkpoints',
      'Standardized schema & data types for downstream analytics',
    ],
  },
  {
    id: 3,
    title: 'Supply Chain Analytics Pipeline',
    category: 'Analytics Engineering',
    icon: Package,
    color: '#A855F7',
    description:
      'An automated ETL pipeline that turns raw logistics and shipment data into curated, analytics-ready star-schema tables and KPI dashboards.',
    problem:
      'Supply-chain KPIs were stitched together manually across spreadsheets, making reporting slow and inconsistent between teams.',
    architecture: [
      'Daily ingestion of shipment & order data into an S3 data lake',
      'PySpark / Glue ETL builds curated fact & dimension tables (star schema)',
      'Aggregations loaded into the warehouse reporting layer',
      'Tableau dashboards expose KPIs & exceptions to stakeholders',
    ],
    tags: ['PySpark', 'AWS Glue', 'AWS S3', 'SQL', 'Star Schema', 'Tableau', 'ETL'],
    impactHeadline: 'Reporting: days → hours',
    impactBullets: [
      'Automated KPI tracking across dozens of supply-chain metrics',
      'Cut reporting turnaround from several days to hours',
      'Modeled curated star-schema tables for self-serve analytics',
    ],
  },
]

function Section({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color }}>{label}</h4>
      {children}
    </div>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
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
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${project.color}20` }}>
            <project.icon className="w-7 h-7" style={{ color: project.color }} />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider" style={{ color: project.color }}>{project.category}</span>
            <h3 className="text-white font-black text-xl leading-tight">{project.title}</h3>
          </div>
        </div>

        <Section label="Business Problem" color={project.color}>
          <p className="text-[#94A3B8] leading-relaxed text-sm">{project.problem}</p>
        </Section>

        <Section label="Architecture" color={project.color}>
          <div className="space-y-2">
            {project.architecture.map((step, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold mt-0.5"
                  style={{ background: `${project.color}20`, color: project.color }}
                >
                  {i + 1}
                </span>
                <span className="text-[#94A3B8] text-sm leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Impact" color={project.color}>
          <div className="space-y-2">
            {project.impactBullets.map((h, i) => (
              <div key={i} className="flex gap-3">
                <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" style={{ color: project.color }} />
                <span className="text-[#94A3B8] text-sm">{h}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Technologies" color={project.color}>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono" style={{ color: project.color, background: `${project.color}15`, border: `1px solid ${project.color}30` }}>
                {tag}
              </span>
            ))}
          </div>
        </Section>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [selected, setSelected] = useState<Project | null>(null)
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
            Production data engineering work. Click any project for the business problem,
            architecture, and impact.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(project)}
              className="glass rounded-2xl p-7 cursor-pointer group relative overflow-hidden transition-all duration-300"
              style={{
                border: `1px solid ${hovered === project.id ? project.color + '40' : 'var(--card-border-rest)'}`,
                boxShadow:
                  hovered === project.id
                    ? `0 24px 50px var(--elev-shadow), 0 0 40px ${project.color}22`
                    : 'var(--card-shadow-rest)',
                transform: hovered === project.id ? 'translateY(-8px)' : 'translateY(0)',
              }}
            >
              {/* Background gradient on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 0%, ${project.color}08 0%, transparent 70%)` }}
              />

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
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" style={{ color: project.color }} />
                  <span className="text-xs font-mono" style={{ color: project.color }}>{project.impactHeadline}</span>
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
