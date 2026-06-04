'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const categories = [
  {
    id: 'programming',
    label: 'Programming',
    color: '#38BDF8',
    skills: [
      { name: 'Python', level: 92, desc: 'Data pipelines, automation, scripting' },
      { name: 'SQL', level: 95, desc: 'Complex queries, optimization, analytics' },
      { name: 'Java', level: 65, desc: 'Backend services, enterprise apps' },
      { name: 'PySpark', level: 88, desc: 'Distributed data processing' },
    ]
  },
  {
    id: 'cloud',
    label: 'Cloud & AWS',
    color: '#A855F7',
    skills: [
      { name: 'AWS S3', level: 90, desc: 'Object storage, data lakes' },
      { name: 'AWS Glue', level: 88, desc: 'ETL jobs, data catalog' },
      { name: 'Step Functions', level: 80, desc: 'Workflow orchestration' },
      { name: 'AWS Lambda', level: 78, desc: 'Serverless functions' },
      { name: 'BigQuery', level: 82, desc: 'Google cloud analytics' },
    ]
  },
  {
    id: 'bigdata',
    label: 'Big Data',
    color: '#34D399',
    skills: [
      { name: 'PySpark', level: 88, desc: 'Distributed processing at scale' },
      { name: 'ETL Design', level: 92, desc: 'Pipeline architecture' },
      { name: 'Data Modeling', level: 85, desc: 'Schema design, warehousing' },
      { name: 'Distributed Systems', level: 80, desc: 'Fault-tolerant processing' },
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    color: '#FB923C',
    skills: [
      { name: 'Pandas', level: 90, desc: 'Data manipulation and analysis' },
      { name: 'NumPy', level: 85, desc: 'Numerical computing' },
      { name: 'EDA', level: 88, desc: 'Exploratory data analysis' },
      { name: 'Excel', level: 80, desc: 'Advanced spreadsheet analytics' },
    ]
  },
  {
    id: 'viz',
    label: 'Visualization',
    color: '#F472B6',
    skills: [
      { name: 'Tableau', level: 82, desc: 'Interactive dashboards' },
      { name: 'Data Storytelling', level: 80, desc: 'Business reporting' },
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
            </motion.button>
          ))}
        </motion.div>

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
                  <motion.span
                    className="text-2xl font-black"
                    style={{ color: current.color }}
                    animate={{ scale: hoveredSkill === skill.name ? 1.2 : 1 }}
                  >
                    {skill.level}%
                  </motion.span>
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
            {['Git', 'Jira', 'Linux', 'Jupyter', 'VS Code', 'DBeaver', 'Apache Airflow'].map((tool, i) => (
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
