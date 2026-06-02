'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Mail, Github, Linkedin, Send, CheckCircle, MapPin, Clock } from 'lucide-react'

const socials = [
  {
    label: 'Email',
    value: 'ayushmishra750980@gmail.com',
    icon: Mail,
    href: 'mailto:ayushmishra750980@gmail.com',
    color: '#38BDF8',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/ayushmishra',
    icon: Linkedin,
    href: 'https://linkedin.com/in/ayushmishra',
    color: '#0A66C2',
  },
  {
    label: 'GitHub',
    value: 'github.com/ayushmishra',
    icon: Github,
    href: 'https://github.com/ayushmishra',
    color: '#A855F7',
  },
]

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section id="contact" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      {/* Big background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[20vw] font-black text-white/[0.015] select-none uppercase tracking-tighter">
          Contact
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">Get In Touch</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Open to senior data engineering roles, consulting projects, and collaboration opportunities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-white font-medium">Location</span>
              </div>
              <p className="text-[#94A3B8] text-sm ml-7">Noida, Uttar Pradesh, India</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-4 h-4 text-[#A855F7]" />
                <span className="text-white font-medium">Availability</span>
              </div>
              <p className="text-[#94A3B8] text-sm ml-7">Available for new opportunities · IST (UTC+5:30)</p>
              <div className="flex items-center gap-2 ml-7 mt-2">
                <div className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                <span className="text-xs text-[#34D399] font-mono">Currently active</span>
              </div>
            </div>

            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 glass rounded-2xl p-5 group hover:bg-white/[0.07] transition-all border border-white/5 hover:-translate-y-1"
                style={{
                  borderColor: `transparent`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${s.color}40`
                  ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${s.color}10`
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ background: `${s.color}20` }}
                >
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider">{s.label}</div>
                  <div className="text-white text-sm font-medium group-hover:text-[#38BDF8] transition-colors">{s.value}</div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[#38BDF8]/20 to-[#A855F7]/20 flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-[#38BDF8]" />
                  </motion.div>
                  <h3 className="text-white font-black text-2xl mb-3">Message Sent!</h3>
                  <p className="text-[#94A3B8]">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  className="glass rounded-2xl p-8 space-y-5"
                >
                  <h3 className="text-white font-bold text-lg mb-6">Send a Message</h3>

                  {[
                    { name: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@company.com' },
                  ].map(field => (
                    <div key={field.name} className="relative">
                      <motion.label
                        className="absolute left-4 font-mono text-xs transition-all pointer-events-none"
                        animate={{
                          top: focused === field.name || form[field.name as keyof typeof form] ? '8px' : '50%',
                          translateY: focused === field.name || form[field.name as keyof typeof form] ? 0 : '-50%',
                          fontSize: focused === field.name || form[field.name as keyof typeof form] ? '10px' : '14px',
                          color: focused === field.name ? '#38BDF8' : '#94A3B8',
                        }}
                        transition={{ duration: 0.15 }}
                      >
                        {field.label}
                      </motion.label>
                      <input
                        type={field.type}
                        value={form[field.name as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field.name]: e.target.value }))}
                        onFocus={() => setFocused(field.name)}
                        onBlur={() => setFocused(null)}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-3 text-white text-sm outline-none transition-all focus:border-[#38BDF8]/50 focus:bg-white/[0.07]"
                      />
                    </div>
                  ))}

                  <div className="relative">
                    <motion.label
                      className="absolute left-4 font-mono text-xs pointer-events-none"
                      animate={{
                        top: focused === 'message' || form.message ? '8px' : '16px',
                        fontSize: focused === 'message' || form.message ? '10px' : '14px',
                        color: focused === 'message' ? '#38BDF8' : '#94A3B8',
                      }}
                      transition={{ duration: 0.15 }}
                    >
                      Message
                    </motion.label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      required
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-7 pb-3 text-white text-sm outline-none transition-all focus:border-[#38BDF8]/50 focus:bg-white/[0.07] resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-[#050816] bg-gradient-to-r from-[#38BDF8] to-[#A855F7] hover:opacity-90 transition-opacity disabled:opacity-70"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#050816]/30 border-t-[#050816] rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
