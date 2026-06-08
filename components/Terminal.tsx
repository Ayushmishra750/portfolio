'use client'

import { useRef, useState, useEffect, useCallback, KeyboardEvent } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Terminal as TerminalIcon, Minus, Square, X } from 'lucide-react'

// ── Command definitions ────────────────────────────────────────────────────────

type OutputLine = { text: string; type: 'default' | 'success' | 'error' | 'info' | 'accent' | 'muted' | 'blank' | 'header' }

const COMMANDS: Record<string, () => OutputLine[]> = {
  help: () => [
    { text: '╔══════════════════════════════════════════╗', type: 'accent' },
    { text: '║         Available Commands               ║', type: 'accent' },
    { text: '╚══════════════════════════════════════════╝', type: 'accent' },
    { text: '', type: 'blank' },
    { text: '  whoami         →  About Ayush Mishra',          type: 'success' },
    { text: '  skills         →  Technical skill set',         type: 'success' },
    { text: '  experience     →  Work history',                type: 'success' },
    { text: '  projects       →  Featured projects',           type: 'success' },
    { text: '  architecture   →  Data architecture overview',  type: 'success' },
    { text: '  certifications →  Credentials & learning path', type: 'success' },
    { text: '  resume         →  Download my resume',          type: 'success' },
    { text: '  contact        →  Get in touch',                type: 'success' },
    { text: '  stack          →  Full tech stack',             type: 'success' },
    { text: '  clear          →  Clear terminal',              type: 'success' },
    { text: '', type: 'blank' },
    { text: '  Tip: Use ↑ ↓ to navigate history, Tab to autocomplete', type: 'muted' },
    { text: '', type: 'blank' },
  ],

  whoami: () => [
    { text: '', type: 'blank' },
    { text: '  ██████╗  █████╗ ████████╗ █████╗ ', type: 'accent' },
    { text: '  ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗', type: 'accent' },
    { text: '  ██║  ██║███████║   ██║   ███████║', type: 'accent' },
    { text: '  ██║  ██║██╔══██║   ██║   ██╔══██║', type: 'accent' },
    { text: '  ██████╔╝██║  ██║   ██║   ██║  ██║', type: 'accent' },
    { text: '  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝', type: 'accent' },
    { text: '', type: 'blank' },
    { text: '  Name      :  Ayush Mishra',             type: 'default' },
    { text: '  Role      :  Data Engineer',            type: 'default' },
    { text: '  Company   :  Cognizant Technology Solutions', type: 'default' },
    { text: '  Location  :  Noida, India 📍',          type: 'default' },
    { text: '  Experience:  3.5+ Years',               type: 'default' },
    { text: '  Email     :  ayushmishra750980@gmail.com', type: 'info' },
    { text: '', type: 'blank' },
    { text: '  Building scalable data systems that transform', type: 'muted' },
    { text: '  raw data into business intelligence. 🚀',        type: 'muted' },
    { text: '', type: 'blank' },
  ],

  skills: () => [
    { text: '', type: 'blank' },
    { text: '  ── Core Skills ─────────────────────────', type: 'header' },
    { text: '  SQL          █████████████████████ 95%',   type: 'success' },
    { text: '  Python       ████████████████████  92%',   type: 'success' },
    { text: '  PySpark      ████████████████████  88%',   type: 'success' },
    { text: '  AWS Glue     ████████████████████  88%',   type: 'success' },
    { text: '  AWS S3       ████████████████████  90%',   type: 'success' },
    { text: '  Step Funcs   ████████████████      82%',   type: 'success' },
    { text: '', type: 'blank' },
    { text: '  ── Cloud & Big Data ────────────────────', type: 'header' },
    { text: '  Athena · EMR · Redshift',                   type: 'info' },
    { text: '', type: 'blank' },
    { text: '  ── Data Warehousing ────────────────────', type: 'header' },
    { text: '  Snowflake · BigQuery · DWH Design',         type: 'info' },
    { text: '', type: 'blank' },
    { text: '  ── Data Modeling ───────────────────────', type: 'header' },
    { text: '  Star / Snowflake Schema · Fact & Dim',      type: 'accent' },
    { text: '  Dimensional Modeling',                       type: 'accent' },
    { text: '', type: 'blank' },
    { text: '  ── Modern Data Stack (learning) ────────', type: 'header' },
    { text: '  Airflow · dbt · Docker · Databricks',       type: 'muted' },
    { text: '', type: 'blank' },
    { text: '  ── Tools ───────────────────────────────', type: 'header' },
    { text: '  Git · Jira · Linux · Jupyter · DBeaver',    type: 'muted' },
    { text: '', type: 'blank' },
  ],

  experience: () => [
    { text: '', type: 'blank' },
    { text: '  ┌─ WORK EXPERIENCE ──────────────────────┐', type: 'accent' },
    { text: '', type: 'blank' },
    { text: '  🏢 Cognizant Technology Solutions',         type: 'success' },
    { text: '     Role     :  Data Engineer',              type: 'default' },
    { text: '     Period   :  Dec 2022 – Present',         type: 'default' },
    { text: '     Location :  Noida, India',               type: 'default' },
    { text: '     Duration :  3.5+ Years (Current)',       type: 'info' },
    { text: '', type: 'blank' },
    { text: '  ── Key Achievements ─────────────────────', type: 'header' },
    { text: '', type: 'blank' },
    { text: '  ✓  Processed 5M+ records daily via ETL pipelines', type: 'success' },
    { text: '  ✓  Improved processing efficiency by 30%',          type: 'success' },
    { text: '  ✓  Built scalable AWS Glue ETL solutions',          type: 'success' },
    { text: '  ✓  Executed large-scale data migration projects',    type: 'success' },
    { text: '  ✓  Orchestrated workflows via AWS Step Functions',   type: 'success' },
    { text: '  ✓  Developed Python/SQL data validation scripts',    type: 'success' },
    { text: '', type: 'blank' },
    { text: '  ── Tech Used ────────────────────────────', type: 'header' },
    { text: '  Python · PySpark · AWS S3 · Glue · Lambda', type: 'muted' },
    { text: '  Step Functions · SQL · Pandas · Git · Jira', type: 'muted' },
    { text: '', type: 'blank' },
    { text: '  └────────────────────────────────────────┘', type: 'accent' },
    { text: '', type: 'blank' },
  ],

  projects: () => [
    { text: '', type: 'blank' },
    { text: '  ┌─ FEATURED PROJECTS ────────────────────┐', type: 'accent' },
    { text: '', type: 'blank' },
    { text: '  [1] Data Validation & Reconciliation Framework', type: 'success' },
    { text: '      Stack  : PySpark · AWS Glue · Python · SQL',   type: 'default' },
    { text: '      Impact : ~80% less manual reconciliation',     type: 'info' },
    { text: '', type: 'blank' },
    { text: '  [2] Enterprise Data Migration Platform',           type: 'success' },
    { text: '      Stack  : Glue · PySpark · S3 · Step Functions', type: 'default' },
    { text: '      Impact : Zero data loss, full source parity',  type: 'info' },
    { text: '', type: 'blank' },
    { text: '  [3] Supply Chain Analytics Pipeline',              type: 'success' },
    { text: '      Stack  : PySpark · Glue · SQL · Tableau',      type: 'default' },
    { text: '      Impact : Reporting from days to hours',        type: 'info' },
    { text: '', type: 'blank' },
    { text: '  └────────────────────────────────────────┘', type: 'accent' },
    { text: '', type: 'blank' },
    { text: '  Type "architecture" for the platform overview.',  type: 'muted' },
    { text: '', type: 'blank' },
  ],

  architecture: () => [
    { text: '', type: 'blank' },
    { text: '  ┌─ DATA ARCHITECTURE ────────────────────┐', type: 'accent' },
    { text: '', type: 'blank' },
    { text: '  Sources → S3 (Data Lake) → Step Functions', type: 'default' },
    { text: '    → AWS Glue + PySpark (ETL)',                type: 'default' },
    { text: '    → Data Validation & Reconciliation',        type: 'default' },
    { text: '    → Snowflake / Redshift (Warehouse)',        type: 'default' },
    { text: '    → Tableau (BI & Reporting)',                type: 'default' },
    { text: '', type: 'blank' },
    { text: '  ── Patterns ─────────────────────────────', type: 'header' },
    { text: '  • Batch ETL with orchestrated retries',      type: 'info' },
    { text: '  • Automated data validation on every run',   type: 'info' },
    { text: '  • Idempotent, restartable migration loads',  type: 'info' },
    { text: '  • Star-schema analytics warehouse',          type: 'info' },
    { text: '', type: 'blank' },
    { text: '  └────────────────────────────────────────┘', type: 'accent' },
    { text: '', type: 'blank' },
  ],

  resume: () => [
    { text: '', type: 'blank' },
    { text: '  📄 Opening resume in a new tab…',           type: 'success' },
    { text: '  If it does not open, visit: /resume.pdf',   type: 'info' },
    { text: '', type: 'blank' },
  ],

  certifications: () => [
    { text: '', type: 'blank' },
    { text: '  ┌─ CERTIFICATIONS ───────────────────────┐', type: 'accent' },
    { text: '', type: 'blank' },
    { text: '  ✓ Completed',                               type: 'header' },
    { text: '  🏆 AWS Certified Cloud Practitioner  (2023)', type: 'success' },
    { text: '  🏆 SQL (Advanced) — HackerRank        (2023)', type: 'success' },
    { text: '  🏆 Python — HackerRank                (2023)', type: 'success' },
    { text: '', type: 'blank' },
    { text: '  ⟳ Learning Path (in progress)',             type: 'header' },
    { text: '  • SnowPro Associate — Snowflake',           type: 'info' },
    { text: '  • AWS Data Engineer — Associate',           type: 'info' },
    { text: '  • Databricks Data Engineer Associate',      type: 'info' },
    { text: '  • dbt Fundamentals',                        type: 'info' },
    { text: '', type: 'blank' },
    { text: '  └────────────────────────────────────────┘', type: 'accent' },
    { text: '', type: 'blank' },
  ],

  stack: () => [
    { text: '', type: 'blank' },
    { text: '  ── Full Tech Stack ──────────────────────', type: 'header' },
    { text: '', type: 'blank' },
    { text: '  Languages   Python · SQL',                  type: 'default' },
    { text: '  Big Data    PySpark · ETL · Distributed',   type: 'default' },
    { text: '  Cloud       AWS S3 · Glue · Lambda',        type: 'info' },
    { text: '              Step Functions · Athena · EMR',  type: 'info' },
    { text: '  Warehouse   Snowflake · BigQuery · Redshift', type: 'accent' },
    { text: '  Modeling    Star/Snowflake Schema · Fact/Dim', type: 'accent' },
    { text: '  Learning    Airflow · dbt · Docker · Databricks', type: 'muted' },
    { text: '  Tools       Git · Jira · Linux · Jupyter',  type: 'muted' },
    { text: '', type: 'blank' },
  ],

  contact: () => [
    { text: '', type: 'blank' },
    { text: '  ── Contact Ayush ────────────────────────', type: 'header' },
    { text: '', type: 'blank' },
    { text: '  📧 Email    ayushmishra750980@gmail.com',   type: 'success' },
    { text: '  💼 LinkedIn linkedin.com/in/ayushm790',     type: 'info' },
    { text: '  🐙 GitHub   github.com/Ayushmishra750',     type: 'accent' },
    { text: '  📍 Location Noida, Uttar Pradesh, India',   type: 'muted' },
    { text: '', type: 'blank' },
    { text: '  Status: 🟢 Available for opportunities',    type: 'success' },
    { text: '', type: 'blank' },
  ],
}

const SUGGESTIONS = Object.keys(COMMANDS)

// ── Types ─────────────────────────────────────────────────────────────────────

type HistoryEntry = { command: string; output: OutputLine[] }

// ── Colour map ────────────────────────────────────────────────────────────────

// Values are theme-aware CSS variables (defined in globals.css) so the
// terminal flips to a light panel with readable syntax colours on toggle.
const typeColour: Record<OutputLine['type'], string> = {
  default: 'var(--term-default)',
  success: 'var(--term-success)',
  error:   'var(--term-error)',
  info:    'var(--term-info)',
  accent:  'var(--term-accent)',
  muted:   'var(--term-muted)',
  blank:   'transparent',
  header:  'var(--term-header)',
}

// ── Terminal component ────────────────────────────────────────────────────────

export default function TerminalSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-100px' })
  const inputRef   = useRef<HTMLInputElement>(null)
  const outputRef  = useRef<HTMLDivElement>(null)
  const bottomRef  = useRef<HTMLDivElement>(null)

  const [input,       setInput]       = useState('')
  const [history,     setHistory]     = useState<HistoryEntry[]>([])
  const [cmdHistory,  setCmdHistory]  = useState<string[]>([])
  const [historyIdx,  setHistoryIdx]  = useState(-1)
  const [suggestion,  setSuggestion]  = useState('')
  const [booted,      setBooted]      = useState(false)

  // Boot sequence
  useEffect(() => {
    if (!inView || booted) return
    const bootLines: OutputLine[] = [
      { text: '  Ayush Mishra Terminal  v1.0.0', type: 'accent' },
      { text: '  ─────────────────────────────', type: 'muted' },
      { text: '  Type "help" to see available commands.', type: 'muted' },
      { text: '', type: 'blank' },
    ]
    setHistory([{ command: '__boot__', output: bootLines }])
    setBooted(true)
  }, [inView, booted])

  // Auto-scroll — scroll only inside the terminal output box, not the page
  useEffect(() => {
    const el = outputRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history])

  // Tab suggestion
  useEffect(() => {
    if (!input) { setSuggestion(''); return }
    const match = SUGGESTIONS.find(s => s.startsWith(input) && s !== input)
    setSuggestion(match ?? '')
  }, [input])

  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return

    let output: OutputLine[]
    if (cmd === 'clear') {
      setHistory([])
      setCmdHistory(h => [cmd, ...h])
      setHistoryIdx(-1)
      setInput('')
      return
    } else if (cmd === 'resume') {
      if (typeof window !== 'undefined') window.open('/resume.pdf', '_blank', 'noopener,noreferrer')
      output = COMMANDS.resume()
    } else if (COMMANDS[cmd]) {
      output = COMMANDS[cmd]()
    } else {
      output = [
        { text: '', type: 'blank' },
        { text: `  command not found: ${cmd}`, type: 'error' },
        { text: '  Type "help" for available commands.', type: 'muted' },
        { text: '', type: 'blank' },
      ]
    }

    setHistory(h => [...h, { command: cmd, output }])
    setCmdHistory(h => [cmd, ...h])
    setHistoryIdx(-1)
    setInput('')
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestion) setInput(suggestion)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(next)
      setInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIdx - 1, -1)
      setHistoryIdx(next)
      setInput(next === -1 ? '' : cmdHistory[next] ?? '')
    }
  }

  const quickCommands = ['help', 'whoami', 'skills', 'projects', 'architecture', 'certifications', 'resume', 'contact']

  return (
    <section id="terminal" ref={sectionRef} className="force-dark section-padding relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">
            Interactive
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Try the <span className="gradient-text">Terminal</span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Explore my profile the developer way. Type commands to learn more.
          </p>
        </motion.div>

        {/* Quick command pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          {quickCommands.map((cmd, i) => (
            <motion.button
              key={cmd}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.25 + i * 0.05 }}
              onClick={() => runCommand(cmd)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#38BDF8] border border-[#38BDF8]/30 bg-[#38BDF8]/5 hover:bg-[#38BDF8]/15 hover:border-[#38BDF8]/60 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cmd}
            </motion.button>
          ))}
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          className="rounded-2xl overflow-hidden border border-white/10"
          style={{ boxShadow: 'var(--term-window-shadow)' }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b border-white/5 select-none"
            style={{ background: 'var(--term-bar)' }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/5">
                <TerminalIcon className="w-3 h-3 text-[#38BDF8]" />
                <span className="text-[#94A3B8] text-xs font-mono">ayush@portfolio ~ zsh</span>
              </div>
            </div>
            <div className="flex gap-2 opacity-40">
              <Minus className="w-3 h-3 text-white" />
              <Square className="w-3 h-3 text-white" />
              <X className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Output area */}
          <div
            ref={outputRef}
            className="p-4 font-mono text-xs leading-5 min-h-[380px] max-h-[500px] overflow-y-auto cursor-text"
            style={{ background: 'var(--term-bg)', scrollbarWidth: 'thin', scrollbarColor: '#38BDF8 transparent' }}
          >
            <AnimatePresence>
              {history.map((entry, ei) => (
                <motion.div
                  key={ei}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Command echo */}
                  {entry.command !== '__boot__' && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[#34D399]">ayush</span>
                      <span className="text-[#64748B]">@</span>
                      <span className="text-[#38BDF8]">portfolio</span>
                      <span className="text-[#64748B]">:~$</span>
                      <span className="text-white ml-1">{entry.command}</span>
                    </div>
                  )}
                  {/* Output lines */}
                  {entry.output.map((line, li) => (
                    <motion.div
                      key={li}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: li * 0.018 }}
                      className="leading-5 whitespace-pre"
                      style={{ color: typeColour[line.type] }}
                    >
                      {line.text || ' '}
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Input row */}
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[#34D399] shrink-0">ayush</span>
              <span className="text-[#64748B] shrink-0">@</span>
              <span className="text-[#38BDF8] shrink-0">portfolio</span>
              <span className="text-[#64748B] shrink-0">:~$</span>
              <div className="relative flex-1 ml-1">
                {/* Ghost suggestion */}
                {suggestion && (
                  <span
                    className="absolute left-0 top-0 pointer-events-none select-none"
                    style={{ color: 'var(--term-ghost)' }}
                  >
                    {input}
                    <span>{suggestion.slice(input.length)}</span>
                  </span>
                )}
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-white outline-none caret-[#38BDF8] relative z-10"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  autoFocus={false}
                  placeholder=""
                />
              </div>
              {/* Blinking cursor when no input */}
              {!input && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-[7px] h-[13px] bg-[#38BDF8] ml-0.5"
                />
              )}
            </div>

            <div ref={bottomRef} />
          </div>

          {/* Status bar */}
          <div
            className="flex items-center justify-between px-4 py-1.5 border-t border-white/5 text-[9px] font-mono"
            style={{ background: 'var(--term-status)' }}
          >
            <div className="flex items-center gap-3 text-white/30">
              <span className="text-[#38BDF8]/60">zsh</span>
              <span>UTF-8</span>
              <span>ANSI</span>
            </div>
            <div className="flex items-center gap-3 text-white/30">
              <span>{history.filter(h => h.command !== '__boot__').length} commands run</span>
              <span className="text-[#34D399]/60">● connected</span>
            </div>
          </div>
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center text-[#64748B] text-xs font-mono mt-4"
        >
          Press Tab to autocomplete · ↑ ↓ to navigate history · Click anywhere in terminal to focus
        </motion.p>
      </div>
    </section>
  )
}
