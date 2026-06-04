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
    { text: '  whoami       →  About Ayush Mishra',        type: 'success' },
    { text: '  skills       →  Technical skill set',       type: 'success' },
    { text: '  experience   →  Work history',              type: 'success' },
    { text: '  projects     →  Featured projects',         type: 'success' },
    { text: '  certifications → Credentials & badges',     type: 'success' },
    { text: '  contact      →  Get in touch',              type: 'success' },
    { text: '  stack        →  Full tech stack',           type: 'success' },
    { text: '  clear        →  Clear terminal',            type: 'success' },
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
    { text: '  ── Programming ─────────────────────────', type: 'header' },
    { text: '  Python      ████████████████████  92%',   type: 'success' },
    { text: '  SQL         █████████████████████ 95%',   type: 'success' },
    { text: '  PySpark     ████████████████████  88%',   type: 'success' },
    { text: '  Java        █████████████         65%',   type: 'success' },
    { text: '', type: 'blank' },
    { text: '  ── Cloud & AWS ─────────────────────────', type: 'header' },
    { text: '  AWS S3       ████████████████████ 90%',   type: 'info' },
    { text: '  AWS Glue     ████████████████████ 88%',   type: 'info' },
    { text: '  Step Funcs   ████████████████     80%',   type: 'info' },
    { text: '  AWS Lambda   ███████████████      78%',   type: 'info' },
    { text: '  BigQuery     ████████████████     82%',   type: 'info' },
    { text: '', type: 'blank' },
    { text: '  ── Analytics ───────────────────────────', type: 'header' },
    { text: '  Pandas       ████████████████████ 90%',   type: 'accent' },
    { text: '  NumPy        █████████████████    85%',   type: 'accent' },
    { text: '  EDA          ████████████████████ 88%',   type: 'accent' },
    { text: '  Tableau      ████████████████     82%',   type: 'accent' },
    { text: '', type: 'blank' },
    { text: '  ── Tools ───────────────────────────────', type: 'header' },
    { text: '  Git, Jira, Linux, Jupyter, DBeaver',       type: 'muted' },
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
    { text: '  [1] Revenue Optimisation & Experimentation', type: 'success' },
    { text: '      Analysis System',                         type: 'success' },
    { text: '', type: 'blank' },
    { text: '      Stack   : SQL · Python · A/B Testing · Tableau', type: 'default' },
    { text: '      Impact  : +15% revenue increase identified',     type: 'info' },
    { text: '      Scale   : 10M+ transactions analyzed',           type: 'muted' },
    { text: '', type: 'blank' },
    { text: '  [2] Operations & Supply Chain Performance', type: 'success' },
    { text: '      Analytics Platform',                     type: 'success' },
    { text: '', type: 'blank' },
    { text: '      Stack   : PySpark · Python · SQL · AWS · ETL',   type: 'default' },
    { text: '      Impact  : 70% reduction in manual reporting',     type: 'info' },
    { text: '      Scale   : 200+ logistics partners integrated',    type: 'muted' },
    { text: '', type: 'blank' },
    { text: '  └────────────────────────────────────────┘', type: 'accent' },
    { text: '', type: 'blank' },
    { text: '  Type "experience" for role details.',         type: 'muted' },
    { text: '', type: 'blank' },
  ],

  certifications: () => [
    { text: '', type: 'blank' },
    { text: '  ┌─ CERTIFICATIONS ───────────────────────┐', type: 'accent' },
    { text: '', type: 'blank' },
    { text: '  🏆 AWS Certified Cloud Practitioner',       type: 'success' },
    { text: '     Issuer : Amazon Web Services',           type: 'muted' },
    { text: '     Year   : 2023',                         type: 'muted' },
    { text: '', type: 'blank' },
    { text: '  🏆 HackerRank Problem Solving',             type: 'success' },
    { text: '     Issuer : HackerRank',                   type: 'muted' },
    { text: '     Year   : 2023',                         type: 'muted' },
    { text: '', type: 'blank' },
    { text: '  🏆 Data Science & Machine Learning',        type: 'success' },
    { text: '     Issuer : Certification Program',         type: 'muted' },
    { text: '     Year   : 2022',                         type: 'muted' },
    { text: '', type: 'blank' },
    { text: '  🏆 PySpark & Python for Big Data',          type: 'success' },
    { text: '     Issuer : Big Data Institute',            type: 'muted' },
    { text: '     Year   : 2022',                         type: 'muted' },
    { text: '', type: 'blank' },
    { text: '  └────────────────────────────────────────┘', type: 'accent' },
    { text: '', type: 'blank' },
  ],

  stack: () => [
    { text: '', type: 'blank' },
    { text: '  ── Full Tech Stack ──────────────────────', type: 'header' },
    { text: '', type: 'blank' },
    { text: '  Languages   Python · SQL · Java',           type: 'default' },
    { text: '  Big Data    PySpark · ETL · Distributed',   type: 'default' },
    { text: '  Cloud       AWS S3 · Glue · Lambda',        type: 'info' },
    { text: '              Step Functions · BigQuery',      type: 'info' },
    { text: '  Analytics   Pandas · NumPy · EDA · Excel',  type: 'accent' },
    { text: '  Viz         Tableau',                       type: 'accent' },
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

const typeColour: Record<OutputLine['type'], string> = {
  default: '#CBD5E1',
  success: '#34D399',
  error:   '#F87171',
  info:    '#38BDF8',
  accent:  '#A855F7',
  muted:   '#64748B',
  blank:   'transparent',
  header:  '#F59E0B',
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

  const quickCommands = ['help', 'whoami', 'skills', 'experience', 'projects', 'contact']

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
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1117] border-b border-white/5 select-none">
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
            className="bg-[#0d1117] p-4 font-mono text-xs leading-5 min-h-[380px] max-h-[500px] overflow-y-auto cursor-text"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#38BDF8 transparent' }}
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
                  <span className="absolute left-0 top-0 text-white/20 pointer-events-none select-none">
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
          <div className="flex items-center justify-between px-4 py-1.5 bg-[#0a0f17] border-t border-white/5 text-[9px] font-mono">
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
