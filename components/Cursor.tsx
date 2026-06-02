'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 15 })
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 15 })
  const isHovering = useRef(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor="pointer"], input, textarea')) {
        if (cursorRef.current) {
          cursorRef.current.style.width = '8px'
          cursorRef.current.style.height = '8px'
          cursorRef.current.style.opacity = '0.5'
        }
        if (ringRef.current) {
          ringRef.current.style.width = '60px'
          ringRef.current.style.height = '60px'
        }
        isHovering.current = true
      } else {
        if (cursorRef.current) {
          cursorRef.current.style.width = '20px'
          cursorRef.current.style.height = '20px'
          cursorRef.current.style.opacity = '1'
        }
        if (ringRef.current) {
          ringRef.current.style.width = '40px'
          ringRef.current.style.height = '40px'
        }
        isHovering.current = false
      }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', handleOver)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', handleOver)
    }
  }, [cursorX, cursorY])

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="custom-cursor hidden md:block"
        style={{ left: cursorX, top: cursorY }}
      />
      <motion.div
        ref={ringRef}
        className="custom-cursor-ring hidden md:block"
        style={{ left: ringX, top: ringY }}
      />
    </>
  )
}
