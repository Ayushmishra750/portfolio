'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

type Skill = { name: string; level: number; desc: string }
type Category = {
  id: string
  label: string
  color: string
  skills: Skill[]
  learning?: boolean
  note?: string
}

const categories: Category[] = [
  {
    id: 'core',
    label: 'Core Skills',
    color: '#38BDF8',
    skills: [
      { name: 'SQL', level: 95, desc: 'Complex queries, tuning, analytics' },
      { name: 'Python', level: 92, desc: 'Pipelines, automation, scripting' },
      { name: 'PySpark', level: 88, desc: 'Distributed data processing at scale' },
      { name: 'AWS Glue', level: 88, desc: 'Serverless ETL jobs & data catalog' },
      { name: 'AWS S3', level: 90, desc: 'Object storage & data lakes' },
      { name: 'AWS Step Functions', level: 82, desc: 'Pipeline workflow orchestration' },
    ]
  },
  {
    id: 'cloud',
    label: 'Cloud & Big Data',
    color: '#A855F7',
    skills: [
      { name: 'Amazon Athena', level: 80, desc: 'Serverless SQL over S3 data lakes' },
      { name: 'Amazon EMR', level: 72, desc: 'Managed Spark / Hadoop clusters' },
      { name: 'Amazon Redshift', level: 76, desc: 'Cloud MPP data warehouse' },
    ]
  },
  {
    id: 'warehouse',
    label: 'Data Warehousing',
    color: '#34D399',
    skills: [
      { name: 'Snowflake', level: 75, desc: 'Cloud warehouse, virtual warehouses' },
      { name: 'BigQuery', level: 78, desc: 'Serverless analytics warehouse' },
      { name: 'Data Warehouse Design', level: 82, desc: 'ELT layering & optimization' },
    ]
  },
  {
    id: 'modeling',
    label: 'Data Modeling',
    color: '#FB923C',
    skills: [
      { name: 'Dimensional Modeling', level: 84, desc: 'Kimball-style analytics design' },
      { name: 'Star Schema', level: 86, desc: 'Denormalized reporting schemas' },
      { name: 'Snowflake Schema', level: 80, desc: 'Normalized dimension hierarchies' },
      { name: 'Fact Tables', level: 85, desc: 'Additive & semi-additive measures' },
      { name: 'Dimension Tables', level: 85, desc: 'Conformed & slowly-changing dims' },
    ]
  },
  {
    id: 'learning',
    label: 'Modern Data Stack',
    color: '#F472B6',
    learning: true,
    note: 'Actively learning — hands-on through side projects, not yet production-depth.',
    skills: [
      { name: 'Apache Airflow', level: 45, desc: 'DAG-based workflow orchestration' },
      { name: 'dbt', level: 42, desc: 'SQL transformation, tests & lineage' },
      { name: 'Docker', level: 48, desc: 'Containerizing data workloads' },
      { name: 'Databricks', level: 38, desc: 'Lakehouse & managed Spark' },
    ]
  },
]

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const current = categories.find(c => c.id === activeCategory)!

  return (
    <section id="skills" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">Skills</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Technical <span className="gradient-text">Arsenal</span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Hover over skills to see proficiency and details
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'text-[#050816] shadow-lg'
                  : 'glass text-[#94A3B8] hover:text-white'
              }`}
              style={activeCategory === cat.id ? { background: cat.color } : {}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {cat.label}
              {cat.learning && (
                <span
                  className="ml-2 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full align-middle"
                  style={{
                    background: activeCategory === cat.id ? 'rgba(5,8,22,0.16)' : `${cat.color}22`,
                    color: activeCategory === cat.id ? '#050816' : cat.color,
                  }}
                >
                  Learning
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Learning-track honesty note */}
        {current.learning && current.note && (
          <motion.p
            key={current.id + '-note'}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-sm mb-10 -mt-4 font-mono"
            style={{ color: current.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: current.color }} />
            {current.note}
          </motion.p>
        )}

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-3xl mx-auto"
          >
            {current.skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="glass rounded-2xl p-6 group cursor-default transition-all duration-300 hover:bg-white/[0.08]"
                style={{
                  border: `1px solid ${hoveredSkill === skill.name ? current.color + '60' : 'var(--card-border-rest)'}`,
                  boxShadow:
                    hoveredSkill === skill.name
                      ? `0 18px 40px var(--elev-shadow), 0 0 30px ${current.color}22`
                      : 'var(--card-shadow-rest)',
                  transform: hoveredSkill === skill.name ? 'translateY(-4px)' : 'translateY(0)',
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-[#38BDF8] transition-colors"
                        style={{ color: hoveredSkill === skill.name ? current.color : undefined }}>
                      {skill.name}
                    </h3>
                    <p className="text-[#94A3B8] text-sm mt-0.5">{skill.desc}</p>
                  </div>
                  {current.learning ? (
                    <span
                      className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap"
                      style={{ color: current.color, background: `${current.color}18`, border: `1px solid ${current.color}40` }}
                    >
                      Learning
                    </span>
                  ) : (
                    <motion.span
                      className="text-2xl font-black"
                      style={{ color: current.color }}
                      animate={{ scale: hoveredSkill === skill.name ? 1.2 : 1 }}
                    >
                      {skill.level}%
                    </motion.span>
                  )}
                </div>

                {/* Skill bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${current.color}, ${current.color}88)` }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                  />
                </div>

                {/* Sphere visual */}
                <div className="mt-4 flex items-center gap-2">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <motion.div
                      key={j}
                      className="flex-1 h-1 rounded-full"
                      style={{
                        background: j < Math.round(skill.level / 10)
                          ? current.color
                          : 'rgba(255,255,255,0.05)',
                      }}
                      animate={hoveredSkill === skill.name ? { scaleY: j < Math.round(skill.level / 10) ? 2 : 1 } : { scaleY: 1 }}
                      transition={{ delay: j * 0.03 }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Tools row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-[#94A3B8] text-sm mb-6 font-mono uppercase tracking-wider">Also familiar with</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Git', 'Jira', 'Linux', 'Jupyter', 'VS Code', 'DBeaver', 'Pandas', 'NumPy', 'Tableau'].map((tool, i) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.06 }}
                className="px-4 py-2 glass rounded-full text-sm text-[#94A3B8] hover:text-white hover:border-white/20 border border-white/5 transition-all cursor-default"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
