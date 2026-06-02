'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, Star, GitFork, Activity, Code } from 'lucide-react'

const stats = [
  { label: 'Repositories', value: '20+', icon: Code, color: '#38BDF8' },
  { label: 'Contributions', value: '500+', icon: Activity, color: '#A855F7' },
  { label: 'Stars Earned', value: '15+', icon: Star, color: '#F59E0B' },
  { label: 'Forks', value: '8+', icon: GitFork, color: '#34D399' },
]

const languages = [
  { name: 'Python', percent: 52, color: '#3B82F6' },
  { name: 'SQL', percent: 28, color: '#A855F7' },
  { name: 'Java', percent: 12, color: '#F59E0B' },
  { name: 'Shell', percent: 8, color: '#34D399' },
]

export default function GitHubStats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="github" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">Open Source</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            GitHub <span className="gradient-text">Activity</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass rounded-2xl p-5 group hover:bg-white/[0.07] transition-all cursor-default"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    <span className="text-xs text-[#94A3B8] font-mono">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                </motion.div>
              ))}
            </div>

            {/* GitHub link */}
            <motion.a
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              href="https://github.com/ayushmishra"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full glass rounded-2xl p-4 group hover:bg-white/[0.07] transition-all border border-white/5 hover:border-white/15"
            >
              <Github className="w-5 h-5 text-white group-hover:text-[#38BDF8] transition-colors" />
              <span className="text-white font-medium group-hover:text-[#38BDF8] transition-colors">View GitHub Profile</span>
              <div className="ml-auto w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            </motion.a>
          </motion.div>

          {/* Language distribution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Code className="w-4 h-4 text-[#38BDF8]" />
              Language Distribution
            </h3>

            {/* Stacked bar */}
            <div className="flex h-4 rounded-full overflow-hidden mb-6">
              {languages.map((lang, i) => (
                <motion.div
                  key={lang.name}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${lang.percent}%` } : { width: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                  style={{ background: lang.color }}
                />
              ))}
            </div>

            <div className="space-y-4">
              {languages.map((lang, i) => (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: lang.color }} />
                  <span className="text-[#94A3B8] text-sm flex-1 font-mono">{lang.name}</span>
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: lang.color }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${lang.percent}%` } : { width: 0 }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-white font-mono text-sm w-10 text-right">{lang.percent}%</span>
                </motion.div>
              ))}
            </div>

            {/* Contribution heatmap placeholder */}
            <div className="mt-8">
              <h4 className="text-[#94A3B8] text-xs font-mono uppercase tracking-wider mb-3">Contribution Activity</h4>
              <div className="grid grid-cols-[repeat(52,1fr)] gap-0.5">
                {Array.from({ length: 364 }).map((_, i) => {
                  const intensity = Math.random()
                  const color = intensity > 0.8 ? '#38BDF8' : intensity > 0.6 ? '#38BDF840' : intensity > 0.3 ? '#38BDF820' : 'rgba(255,255,255,0.04)'
                  return (
                    <motion.div
                      key={i}
                      className="w-full aspect-square rounded-[1px]"
                      style={{ background: color }}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: 0.6 + (i / 364) * 0.5 }}
                    />
                  )
                })}
              </div>
              <div className="flex justify-end items-center gap-1.5 mt-2">
                <span className="text-[10px] text-[#94A3B8] font-mono">Less</span>
                {['rgba(255,255,255,0.04)', '#38BDF820', '#38BDF840', '#38BDF8'].map(c => (
                  <div key={c} className="w-2.5 h-2.5 rounded-[1px]" style={{ background: c }} />
                ))}
                <span className="text-[10px] text-[#94A3B8] font-mono">More</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
