'use client'

import { useState, useEffect } from 'react'
import Loader from '@/components/Loader'
import Cursor from '@/components/Cursor'
import ScrollProgress from '@/components/ScrollProgress'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import DataGlobe from '@/components/DataGlobe'
import DataPipeline from '@/components/DataPipeline'
import Terminal from '@/components/Terminal'
import Certifications from '@/components/Certifications'
import GitHubStats from '@/components/GitHubStats'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3200)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader onComplete={() => setLoading(false)} />

  return (
    <main className="relative bg-[#050816] min-h-screen overflow-x-hidden">
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <DataGlobe />
      <DataPipeline />
      <Certifications />
      <GitHubStats />
      <Terminal />
      <Contact />
      <Footer />
    </main>
  )
}
