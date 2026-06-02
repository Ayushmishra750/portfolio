'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoaderProps {
  onComplete: () => void
}

const codeLines = [
  '> Initializing data systems...',
  '> Loading pipeline configs...',
  '> Connecting to AWS services...',
  '> Spinning up PySpark context...',
  '> Portfolio ready.',
]

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [currentLine, setCurrentLine] = useState(0)
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => setDone(true), 400)
          setTimeout(() => onComplete(), 800)
          return 100
        }
        return prev + 1.5
      })
    }, 28)

    const lineInterval = setInterval(() => {
      setCurrentLine(prev => {
        if (prev < codeLines.length) {
          setVisibleLines(l => [...l, codeLines[prev]])
          return prev + 1
        }
        clearInterval(lineInterval)
        return prev
      })
    }, 550)

    return () => {
      clearInterval(progressInterval)
      clearInterval(lineInterval)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050816]"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#38BDF8] opacity-[0.03] blur-[100px]" />
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[#A855F7] opacity-[0.03] blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-lg px-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex flex-col items-center gap-2"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#A855F7] opacity-20 blur-xl animate-pulse" />
                <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#A855F7] flex items-center justify-center text-2xl font-black text-white shadow-lg">
                  AM
                </div>
              </div>
              <span className="text-[#94A3B8] text-sm font-mono tracking-[0.3em] uppercase">Ayush Mishra</span>
            </motion.div>

            {/* Terminal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full bg-[#0B1120] border border-white/10 rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-[#94A3B8] text-xs font-mono">pipeline.init</span>
              </div>
              <div className="p-4 font-mono text-xs space-y-2 min-h-[140px]">
                {visibleLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={line.includes('ready') ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}
                  >
                    {line}
                    {i === visibleLines.length - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="ml-1 inline-block w-2 h-3 bg-[#38BDF8] align-middle"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Progress */}
            <div className="w-full space-y-3">
              <div className="flex justify-between text-xs font-mono text-[#94A3B8]">
                <span>Loading</span>
                <span className="text-[#38BDF8]">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#A855F7]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
              <div className="flex justify-between">
                {['S3', 'Glue', 'Spark', 'Lambda', 'Done'].map((item, i) => (
                  <motion.span
                    key={item}
                    className={`text-[10px] font-mono ${progress > i * 22 ? 'text-[#38BDF8]' : 'text-white/20'}`}
                    animate={{ opacity: progress > i * 22 ? 1 : 0.3 }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
