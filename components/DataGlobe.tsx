'use client'

import { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useInView } from 'framer-motion'

// ── Theme detection ───────────────────────────────────────────────────────────
// three.js materials can't read CSS variables, so we mirror the active theme
// into React state by observing the <html> class the theme toggle flips.
function useIsLight() {
  const [light, setLight] = useState(false)
  useEffect(() => {
    const el = document.documentElement
    const sync = () => setLight(el.classList.contains('light'))
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return light
}

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
  const ref = useRef<THREE.Group>(null)
  const t   = useRef(offset)

  useFrame((_, delta) => {
    t.current = (t.current + delta * speed * 0.18) % 1
    if (ref.current) ref.current.position.copy(curve.getPoint(t.current))
  })

  return (
    <group ref={ref}>
      {/* Bright comet core */}
      <mesh>
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Additive glow around it */}
      <mesh>
        <sphereGeometry args={[0.065, 10, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Arc({
  from, to, color, speed, light,
}: {
  from: THREE.Vector3
  to: THREE.Vector3
  color: string
  speed: number
  light: boolean
}) {
  const curve = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5)
    mid.normalize().multiplyScalar(RADIUS * 1.5)
    return new THREE.QuadraticBezierCurve3(from, mid, to)
  }, [from, to])

  const points = useMemo(() => curve.getPoints(80), [curve])
  const blend  = light ? THREE.NormalBlending : THREE.AdditiveBlending

  return (
    <group>
      {/* Soft wide glow beneath the flow line */}
      <Line
        points={points}
        color={color}
        transparent
        opacity={light ? 0.22 : 0.3}
        lineWidth={light ? 5 : 6}
        depthWrite={false}
        blending={blend}
      />
      {/* Bright, thicker core — the highlighted data flow */}
      <Line
        points={points}
        color={color}
        transparent
        opacity={light ? 0.95 : 0.85}
        lineWidth={light ? 2.2 : 2.6}
        depthWrite={false}
        blending={blend}
      />
      <ArcParticle curve={curve} color={color} speed={speed} offset={Math.random()} />
      <ArcParticle curve={curve} color={color} speed={speed} offset={(Math.random() + 0.5) % 1} />
    </group>
  )
}

// ── Country borders ─────────────────────────────────────────────────────────
// Real national borders for every country, fetched at runtime and projected
// onto the sphere as glowing line segments. Falls back silently (the base
// globe + grid still render) if the dataset can't be reached.
const BORDERS_URL =
  'https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json'

// Borders are tinted with the same accent palette the data sections use,
// cycling per-country for a vibrant multi-colour map (no flat white outline).
const BORDER_PALETTE = ['#38BDF8', '#A855F7', '#34D399', '#FB923C', '#F472B6']

function CountryBorders({ light }: { light: boolean }) {
  const [data, setData] = useState<{
    pts: [number, number, number][]
    colors: [number, number, number][]
  } | null>(null)

  useEffect(() => {
    let cancelled = false
    const R = RADIUS * 1.004 // lift borders just above the surface (no z-fight)
    const palette = BORDER_PALETTE.map(h => new THREE.Color(h))

    fetch(BORDERS_URL)
      .then(r => r.json())
      .then((geo: { features?: Array<{ geometry?: { type: string; coordinates: number[][][] | number[][][][] } }> }) => {
        if (cancelled || !geo?.features) return
        const pts: [number, number, number][] = []
        const colors: [number, number, number][] = []

        // Each ring is a closed loop of [lng, lat]; emit it as point pairs with a
        // matching per-vertex colour so one LineSegments draws every edge.
        const addRing = (ring: number[][], c: THREE.Color) => {
          for (let i = 0; i < ring.length - 1; i++) {
            const a = latLngToVec3(ring[i][1], ring[i][0], R)
            const b = latLngToVec3(ring[i + 1][1], ring[i + 1][0], R)
            pts.push([a.x, a.y, a.z], [b.x, b.y, b.z])
            colors.push([c.r, c.g, c.b], [c.r, c.g, c.b])
          }
        }

        let ci = 0
        for (const f of geo.features) {
          const g = f?.geometry
          if (!g) continue
          const c = palette[ci++ % palette.length] // a different accent per country
          if (g.type === 'Polygon') {
            ;(g.coordinates as number[][][]).forEach(r => addRing(r, c))
          } else if (g.type === 'MultiPolygon') {
            ;(g.coordinates as number[][][][]).forEach(poly => poly.forEach(r => addRing(r, c)))
          }
        }
        if (!cancelled) setData({ pts, colors })
      })
      .catch(() => {/* offline → keep the base globe */})

    return () => { cancelled = true }
  }, [])

  if (!data) return null

  // Thin, minimal outline + a soft same-colour glow. Additive in dark for a
  // neon bloom; normal blend in light so the colours stay crisp on the pale globe.
  const blend = light ? THREE.NormalBlending : THREE.AdditiveBlending

  return (
    <group>
      {/* Soft colour glow — kept subtle so the outline stays minimal */}
      <Line
        points={data.pts}
        segments
        color="#ffffff"
        vertexColors={data.colors}
        lineWidth={light ? 1.8 : 2.2}
        transparent
        opacity={light ? 0.14 : 0.18}
        depthWrite={false}
        blending={blend}
      />
      {/* Very thin crisp core */}
      <Line
        points={data.pts}
        segments
        color="#ffffff"
        vertexColors={data.colors}
        lineWidth={1}
        transparent
        opacity={light ? 0.95 : 0.9}
        depthWrite={false}
        blending={blend}
      />
    </group>
  )
}

// ── Fresnel atmosphere ────────────────────────────────────────────────────────
// A back-faced shell whose rim glows brightest at the silhouette edge — the
// classic "glowing planet" halo. Additive in dark for drama; gentle in light.
const ATMO_VERT = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView   = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const ATMO_FRAG = `
  varying vec3 vNormal;
  varying vec3 vView;
  uniform vec3  uColor;
  uniform float uPower;
  uniform float uIntensity;
  void main() {
    float fres = pow(1.0 - abs(dot(vNormal, vView)), uPower);
    gl_FragColor = vec4(uColor, fres * uIntensity);
  }
`

function Atmosphere({ light }: { light: boolean }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor:     { value: new THREE.Color(light ? '#1D6FE0' : '#38BDF8') },
          uPower:     { value: light ? 3.2 : 2.4 },
          uIntensity: { value: light ? 0.55 : 1.05 },
        },
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: light ? THREE.NormalBlending : THREE.AdditiveBlending,
      }),
    [light]
  )

  return (
    <mesh scale={1.18}>
      <sphereGeometry args={[RADIUS, 64, 64]} />
      <primitive object={mat} attach="material" />
    </mesh>
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

function GlobeScene({ light }: { light: boolean }) {
  const vectors = useMemo(() => LOCATIONS.map(l => latLngToVec3(l.lat, l.lng)), [])

  return (
    <group>
      {/* Core globe — deep navy in dark, soft pearly blue in light */}
      <mesh>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshPhongMaterial
          color={light ? '#DCE9F6' : '#02101F'}
          emissive={light ? '#C2D7EC' : '#06182C'}
          specular={light ? '#FFFFFF' : '#1E4D7B'}
          shininess={light ? 26 : 16}
        />
      </mesh>

      {/* Latitude / longitude graticule — kept subtle so borders lead */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.002, 48, 24]} />
        <meshBasicMaterial
          color={light ? '#2563EB' : '#38BDF8'}
          wireframe
          transparent
          opacity={light ? 0.08 : 0.04}
        />
      </mesh>

      {/* Every country's borders */}
      <CountryBorders light={light} />

      {/* Fresnel rim glow */}
      <Atmosphere light={light} />

      {/* Outer atmosphere glow */}
      <mesh scale={1.12}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial
          color={light ? '#0EA5E9' : '#38BDF8'}
          transparent
          opacity={light ? 0.10 : 0.028}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner rim glow */}
      <mesh scale={1.04}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial color="#0EA5E9" transparent opacity={light ? 0.05 : 0.015} side={THREE.BackSide} />
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
          light={light}
        />
      ))}
    </group>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function DataGlobe() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const light  = useIsLight()

  return (
    <section id="globe" ref={ref} className="section-padding relative overflow-hidden">
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
            Every country mapped, with real-time pipelines connecting AWS
            regions across the globe. Drag to explore.
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
              <ambientLight intensity={light ? 0.7 : 0.35} />
              <pointLight position={[10, 10, 10]}  intensity={light ? 0.55 : 0.9} color={light ? '#0284C7' : '#38BDF8'} />
              <pointLight position={[-10,-10,-10]} intensity={light ? 0.4 : 0.5} color={light ? '#9333EA' : '#A855F7'} />
              <pointLight position={[0, 10, -5]}   intensity={light ? 0.3 : 0.3} color={light ? '#059669' : '#34D399'} />

              <Suspense fallback={null}>
                <GlobeScene light={light} />
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

            {/* Vignette edges — fades the globe into the page in either theme */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 50%, transparent 52%, var(--page-bg) 80%)',
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
                { label: 'Countries mapped',    value: '195',                    color: '#38BDF8' },
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
