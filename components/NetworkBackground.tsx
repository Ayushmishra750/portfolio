'use client'

import { useRef, useEffect } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef<number>(0)

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
    const MOUSE_RADIUS = 200

    const nodes: Node[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
    }))

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const handleResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Update nodes
      nodes.forEach(node => {
        const dx = mouseRef.current.x - node.x
        const dy = mouseRef.current.y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.015
          node.vx -= dx * force
          node.vy -= dy * force
        }

        node.x += node.vx
        node.y += node.vy

        // Dampen
        node.vx *= 0.995
        node.vy *= 0.995

        // Boundaries
        if (node.x < 0 || node.x > W) node.vx *= -1
        if (node.y < 0 || node.y > H) node.vy *= -1
        node.x = Math.max(0, Math.min(W, node.x))
        node.y = Math.max(0, Math.min(H, node.y))
      })

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MAX_DIST) {
            const opacity = (1 - dist / MAX_DIST) * 0.4

            // Check mouse proximity for glow
            const mdx = (nodes[i].x + nodes[j].x) / 2 - mouseRef.current.x
            const mdy = (nodes[i].y + nodes[j].y) / 2 - mouseRef.current.y
            const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy)
            const glowFactor = mouseDist < 200 ? (1 - mouseDist / 200) * 2 : 0

            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)
            gradient.addColorStop(0, `rgba(56, 189, 248, ${opacity + glowFactor * 0.3})`)
            gradient.addColorStop(1, `rgba(168, 85, 247, ${opacity + glowFactor * 0.3})`)

            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = glowFactor > 0 ? 1.5 : 0.5
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      nodes.forEach(node => {
        const dx = mouseRef.current.x - node.x
        const dy = mouseRef.current.y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const isNearMouse = dist < 150
        const glowRadius = isNearMouse ? node.radius * 3 : node.radius

        if (isNearMouse) {
          const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius * 4)
          glow.addColorStop(0, 'rgba(56,189,248,0.4)')
          glow.addColorStop(1, 'rgba(56,189,248,0)')
          ctx.beginPath()
          ctx.arc(node.x, node.y, glowRadius * 4, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
        ctx.fillStyle = isNearMouse ? '#38BDF8' : 'rgba(56,189,248,0.6)'
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
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
