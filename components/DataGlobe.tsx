'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useInView } from 'framer-motion'

// ── Constants ─────────────────────────────────────────────────────────────────

const RADIUS = 1.5

const LOCATIONS = [
  { lat: 28.6, lng:  77.2, label: 'Noida, India',   color: '#38BDF8', size: 0.048, primary: true  },
  { lat: 39.0, lng: -77.5, label: 'AWS US-East',    color: '#A855F7', size: 0.030, primary: false },
  { lat: 37.7, lng:-122.4, label: 'AWS US-West',    color: '#A855F7', size: 0.030, primary: false },
  { lat: 51.5, lng:  -0.1, label: 'AWS Europe',     color: '#34D399', size: 0.030, primary: false },
  { lat:  1.3, lng: 103.8, label: 'AWS Singapore',  color: '#FB923C', size: 0.030, primary: false },
  { lat: 35.7, lng: 139.7, label: 'AWS Tokyo',      color: '#F472B6', size: 0.026, primary: false },
]

const CONNECTIONS = [
  { from: 0, to: 1, color: '#38BDF8', speed: 0.50 },
  { from: 0, to: 2, color: '#38BDF8', speed: 0.65 },
  { from: 0, to: 3, color: '#34D399', speed: 0.42 },
  { from: 0, to: 4, color: '#FB923C', speed: 0.78 },
  { from: 1, to: 3, color: '#A855F7', speed: 0.38 },
  { from: 2, to: 5, color: '#F472B6', speed: 0.58 },
  { from: 4, to: 5, color: '#FB923C', speed: 0.52 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function latLngToVec3(lat: number, lng: number, r = RADIUS): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ArcParticle({
  curve, color, speed, offset,
}: {
  curve: THREE.QuadraticBezierCurve3
  color: string
  speed: number
  offset: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const t   = useRef(offset)

  useFrame((_, delta) => {
    t.current = (t.current + delta * speed * 0.18) % 1
    if (ref.current) ref.current.position.copy(curve.getPoint(t.current))
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.022, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function Arc({
  from, to, color, speed,
}: {
  from: THREE.Vector3
  to: THREE.Vector3
  color: string
  speed: number
}) {
  const curve = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5)
    mid.normalize().multiplyScalar(RADIUS * 1.5)
    return new THREE.QuadraticBezierCurve3(from, mid, to)
  }, [from, to])

  const points = useMemo(() => curve.getPoints(80), [curve])

  return (
    <group>
      <Line points={points} color={color} transparent opacity={0.22} lineWidth={0.9} />
      <ArcParticle curve={curve} color={color} speed={speed} offset={Math.random()} />
      <ArcParticle curve={curve} color={color} speed={speed} offset={(Math.random() + 0.5) % 1} />
    </group>
  )
}

function LocationMarker({
  lat, lng, color, size, primary,
}: {
  lat: number; lng: number; color: string; size: number; primary: boolean
}) {
  const ringRef = useRef<THREE.Mesh>(null)
  const pos = useMemo(() => latLngToVec3(lat, lng), [lat, lng])

  useFrame(() => {
    if (ringRef.current && primary) {
      const s = 1 + Math.sin(Date.now() * 0.002) * 0.35
      ringRef.current.scale.setScalar(s)
      const mat = ringRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = Math.max(0, 0.55 - (s - 1) * 0.9)
    }
  })

  return (
    <group position={pos}>
      {/* Core dot */}
      <mesh>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Glow halo */}
      <mesh scale={2.2}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
      {/* Pulse ring (primary only) */}
      {primary && (
        <mesh ref={ringRef}>
          <ringGeometry args={[size * 2.0, size * 3.2, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

function GlobeScene() {
  const vectors = useMemo(() => LOCATIONS.map(l => latLngToVec3(l.lat, l.lng)), [])

  return (
    <group>
      {/* Core globe */}
      <mesh>
        <sphereGeometry args={[RADIUS, 72, 72]} />
        <meshPhongMaterial
          color="#030D1A"
          emissive="#071527"
          specular="#1E4D7B"
          shininess={18}
        />
      </mesh>

      {/* Latitude / longitude grid */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.002, 36, 18]} />
        <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.055} />
      </mesh>

      {/* Outer atmosphere glow */}
      <mesh scale={1.12}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.028} side={THREE.BackSide} />
      </mesh>

      {/* Inner rim glow */}
      <mesh scale={1.04}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial color="#0EA5E9" transparent opacity={0.015} side={THREE.BackSide} />
      </mesh>

      {/* Location markers */}
      {LOCATIONS.map((loc, i) => (
        <LocationMarker key={i} {...loc} />
      ))}

      {/* Data arcs */}
      {CONNECTIONS.map((conn, i) => (
        <Arc
          key={i}
          from={vectors[conn.from]}
          to={vectors[conn.to]}
          color={conn.color}
          speed={conn.speed}
        />
      ))}
    </group>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function DataGlobe() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="globe" ref={ref} className="force-dark section-padding relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-mono text-[#38BDF8] tracking-[0.3em] uppercase mb-3 block">
            Global Reach
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Data Flows <span className="gradient-text">Worldwide</span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Real-time pipelines connecting AWS regions across the globe.
            Drag to explore.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* ── Globe canvas ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative h-[420px] md:h-[520px]"
          >
            <Canvas
              camera={{ position: [0, 0, 4.8], fov: 42 }}
              style={{ background: 'transparent' }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.35} />
              <pointLight position={[10, 10, 10]}  intensity={0.9} color="#38BDF8" />
              <pointLight position={[-10,-10,-10]} intensity={0.5} color="#A855F7" />
              <pointLight position={[0, 10, -5]}   intensity={0.3} color="#34D399" />

              <Suspense fallback={null}>
                <GlobeScene />
              </Suspense>

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.55}
                rotateSpeed={0.45}
                minPolarAngle={Math.PI * 0.15}
                maxPolarAngle={Math.PI * 0.85}
              />
            </Canvas>

            {/* Vignette edges */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 50%, transparent 52%, #050816 80%)',
              }}
            />
          </motion.div>

          {/* ── Info panel ── */}
          <div className="space-y-3">
            <motion.h3
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-white font-bold text-lg mb-5"
            >
              Active Pipeline Regions
            </motion.h3>

            {LOCATIONS.map((loc, i) => (
              <motion.div
                key={loc.label}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="flex items-center gap-3 glass rounded-xl px-4 py-3 group hover:bg-white/[0.07] transition-all cursor-default"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                  style={{ background: loc.color, boxShadow: `0 0 8px ${loc.color}` }}
                />
                <span className="text-white text-sm font-medium flex-1">{loc.label}</span>
                {loc.primary && (
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                    style={{
                      color: loc.color,
                      background: `${loc.color}20`,
                      border: `1px solid ${loc.color}40`,
                    }}
                  >
                    Primary
                  </span>
                )}
              </motion.div>
            ))}

            {/* Live stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.85 }}
              className="glass rounded-2xl p-5 mt-4 border border-white/5 space-y-3"
            >
              {[
                { label: 'Active connections',  value: `${CONNECTIONS.length}`,  color: '#38BDF8' },
                { label: 'Data packets / sec',  value: '12.4K',                  color: '#34D399' },
                { label: 'Regions covered',     value: `${LOCATIONS.length}`,    color: '#A855F7' },
                { label: 'Avg latency',         value: '< 2 ms',                 color: '#FB923C' },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-sm">
                  <span className="text-[#94A3B8] font-mono">{s.label}</span>
                  <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
