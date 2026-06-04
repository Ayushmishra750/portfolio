'use client'

import { useRef, useEffect } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  phase: number
}

interface Ripple {
  x: number
  y: number
  r: number
  max: number
  life: number
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef<number>(0)
  const isLightRef = useRef(false)
  const ripplesRef = useRef<Ripple[]>([])

  // Mirror the active theme into a ref the draw loop can read each frame.
  useEffect(() => {
    const el = document.documentElement
    const sync = () => { isLightRef.current = el.classList.contains('light') }
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const COUNT = Math.min(80, Math.floor((W * H) / 12000))
    const MAX_DIST = 180
    const MOUSE_RADIUS = 220
    const LINK_RADIUS = 260 // cursor "constellation" reach

    const nodes: Node[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2,
    }))

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }
    // A click sends a shockwave that ripples through the network
    const handleClick = (e: MouseEvent) => {
      ripplesRef.current.push({ x: e.clientX, y: e.clientY, r: 0, max: 340, life: 1 })
      if (ripplesRef.current.length > 6) ripplesRef.current.shift()
    }
    const handleResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)

    const draw = () => {
      const now = performance.now()
      ctx.clearRect(0, 0, W, H)

      // Theme-aware palette — deeper, higher-contrast colours on the light Hero
      const isLight = isLightRef.current
      const cyan   = isLight ? '2, 132, 199'  : '56, 189, 248'
      const purple = isLight ? '124, 58, 237' : '168, 85, 247'
      const lineFactor = isLight ? 0.6 : 0.4
      const nodeAlpha  = isLight ? 0.8 : 0.6
      const nodeColor  = isLight ? '#0284C7' : '#38BDF8'
      const baseLine   = isLight ? 0.7 : 0.5

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mx > -1000

      // ── Advance ripples (expanding shockwaves) ──────────────────────────
      const ripples = ripplesRef.current
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rp = ripples[r]
        rp.r += 6
        rp.life = Math.max(0, 1 - rp.r / rp.max)
        if (rp.life <= 0) ripples.splice(r, 1)
      }

      // ── Update nodes ────────────────────────────────────────────────────
      nodes.forEach(node => {
        // Cursor repulsion — the network parts around the pointer
        if (mouseActive) {
          const dx = mx - node.x
          const dy = my - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS) {
            const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.015
            node.vx -= dx * force
            node.vy -= dy * force
          }
        }

        // Ripple shove — nodes the wavefront passes get pushed outward
        for (const rp of ripples) {
          const dx = node.x - rp.x
          const dy = node.y - rp.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          if (Math.abs(dist - rp.r) < 46) {
            const strength = rp.life * 1.4
            node.vx += (dx / dist) * strength
            node.vy += (dy / dist) * strength
          }
        }

        node.x += node.vx
        node.y += node.vy

        // Clamp runaway speed so bursts settle back down
        const sp = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
        if (sp > 6) { node.vx *= 6 / sp; node.vy *= 6 / sp }

        // Dampen
        node.vx *= 0.992
        node.vy *= 0.992

        // Boundaries
        if (node.x < 0 || node.x > W) node.vx *= -1
        if (node.y < 0 || node.y > H) node.vy *= -1
        node.x = Math.max(0, Math.min(W, node.x))
        node.y = Math.max(0, Math.min(H, node.y))
      })

      // ── Node-to-node connections ────────────────────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MAX_DIST) {
            const opacity = (1 - dist / MAX_DIST) * lineFactor

            // Brighten links near the cursor
            const mdx = (nodes[i].x + nodes[j].x) / 2 - mx
            const mdy = (nodes[i].y + nodes[j].y) / 2 - my
            const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy)
            const glowFactor = mouseActive && mouseDist < 200 ? (1 - mouseDist / 200) * 2 : 0

            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)
            gradient.addColorStop(0, `rgba(${cyan}, ${opacity + glowFactor * 0.3})`)
            gradient.addColorStop(1, `rgba(${purple}, ${opacity + glowFactor * 0.3})`)

            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = glowFactor > 0 ? 1.5 : baseLine
            ctx.stroke()
          }
        }
      }

      // ── Cursor constellation: live links from the pointer to nearby nodes ─
      if (mouseActive) {
        nodes.forEach(node => {
          const dx = mx - node.x
          const dy = my - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINK_RADIUS) {
            const o = (1 - dist / LINK_RADIUS) * (isLight ? 0.8 : 0.6)
            ctx.beginPath()
            ctx.moveTo(mx, my)
            ctx.lineTo(node.x, node.y)
            ctx.strokeStyle = `rgba(${cyan}, ${o})`
            ctx.lineWidth = isLight ? 1 : 0.8
            ctx.stroke()
          }
        })
        // Cursor glow + node
        const halo = ctx.createRadialGradient(mx, my, 0, mx, my, 28)
        halo.addColorStop(0, `rgba(${purple}, ${isLight ? 0.45 : 0.5})`)
        halo.addColorStop(1, `rgba(${purple}, 0)`)
        ctx.beginPath()
        ctx.arc(mx, my, 28, 0, Math.PI * 2)
        ctx.fillStyle = halo
        ctx.fill()
        ctx.beginPath()
        ctx.arc(mx, my, 3, 0, Math.PI * 2)
        ctx.fillStyle = nodeColor
        ctx.fill()
      }

      // ── Ripple rings ────────────────────────────────────────────────────
      for (const rp of ripples) {
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${cyan}, ${rp.life * 0.5})`
        ctx.lineWidth = isLight ? 2 : 1.5
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r * 0.6, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${purple}, ${rp.life * 0.28})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // ── Nodes (with gentle ambient pulsing) ─────────────────────────────
      nodes.forEach(node => {
        const pulse = 1 + Math.sin(now * 0.0018 + node.phase) * 0.28
        const dx = mx - node.x
        const dy = my - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const isNearMouse = mouseActive && dist < 150
        const glowRadius = (isNearMouse ? node.radius * 3 : node.radius) * pulse

        if (isNearMouse) {
          const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius * 4)
          glow.addColorStop(0, `rgba(${cyan}, ${isLight ? 0.45 : 0.4})`)
          glow.addColorStop(1, `rgba(${cyan}, 0)`)
          ctx.beginPath()
          ctx.arc(node.x, node.y, glowRadius * 4, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
        ctx.fillStyle = isNearMouse ? nodeColor : `rgba(${cyan}, ${nodeAlpha})`
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  )
}
