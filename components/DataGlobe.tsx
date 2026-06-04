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

// ── World geography ───────────────────────────────────────────────────────────
// One GeoJSON of every country is fetched once and used two ways: its polygon
// edges become glowing coastlines, and a fine grid sampled inside the polygons
// fills each continent. Falls back silently (sphere + graticule still render).
const BORDERS_URL =
  'https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json'

// Warm palette for the hologram-style globe (matches the reference image).
const LAND_GOLD  = '#F5C24A' // continent fill grid
const COAST_GOLD = '#FFDC8A' // crisp coastlines
const GRID_GOLD  = '#B8923F' // faint graticule

// Ray-casting point-in-ring test in lng/lat space.
function pointInRing(lng: number, lat: number, ring: number[][]): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1]
    const xj = ring[j][0], yj = ring[j][1]
    if (((yi > lat) !== (yj > lat)) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

type LandPoly = { minLng: number; minLat: number; maxLng: number; maxLat: number; rings: number[][][] }

// The whole world: coastlines (polygon edges) + a fine grid of points sampled
// inside every landmass — the glowing "grid mesh" continents from the reference.
function World() {
  const [geo, setGeo] = useState<{ land: Float32Array; coast: Float32Array } | null>(null)

  useEffect(() => {
    let cancelled = false
    const Rc = RADIUS * 1.004 // coastlines sit just above the surface
    const Rl = RADIUS * 1.001 // land dots hug the surface

    fetch(BORDERS_URL)
      .then(r => r.json())
      .then((data: { features?: Array<{ geometry?: { type: string; coordinates: number[][][] | number[][][][] } }> }) => {
        if (cancelled || !data?.features) return

        const coast: number[] = []
        const polys: LandPoly[] = []

        const addCoast = (ring: number[][]) => {
          for (let i = 0; i < ring.length - 1; i++) {
            const a = latLngToVec3(ring[i][1], ring[i][0], Rc)
            const b = latLngToVec3(ring[i + 1][1], ring[i + 1][0], Rc)
            coast.push(a.x, a.y, a.z, b.x, b.y, b.z)
          }
        }
        const addPoly = (rings: number[][][]) => {
          rings.forEach(addCoast)
          const outer = rings[0]
          let minLng = 180, minLat = 90, maxLng = -180, maxLat = -90
          for (const p of outer) {
            if (p[0] < minLng) minLng = p[0]
            if (p[0] > maxLng) maxLng = p[0]
            if (p[1] < minLat) minLat = p[1]
            if (p[1] > maxLat) maxLat = p[1]
          }
          polys.push({ minLng, minLat, maxLng, maxLat, rings })
        }

        for (const f of data.features) {
          const g = f?.geometry
          if (!g) continue
          if (g.type === 'Polygon') addPoly(g.coordinates as number[][][])
          else if (g.type === 'MultiPolygon') (g.coordinates as number[][][][]).forEach(addPoly)
        }

        // Sample a fine lat/lng grid; keep points inside land (outer ring, not a hole).
        const land: number[] = []
        const STEP = 1.4
        for (let lat = -84; lat <= 84; lat += STEP) {
          for (let lng = -180; lng < 180; lng += STEP) {
            for (const p of polys) {
              if (lng < p.minLng || lng > p.maxLng || lat < p.minLat || lat > p.maxLat) continue
              if (!pointInRing(lng, lat, p.rings[0])) continue
              let hole = false
              for (let k = 1; k < p.rings.length; k++) {
                if (pointInRing(lng, lat, p.rings[k])) { hole = true; break }
              }
              if (!hole) {
                const v = latLngToVec3(lat, lng, Rl)
                land.push(v.x, v.y, v.z)
                break
              }
            }
          }
        }

        if (!cancelled) setGeo({ land: new Float32Array(land), coast: new Float32Array(coast) })
      })
      .catch(() => {/* offline → sphere + graticule still render */})

    return () => { cancelled = true }
  }, [])

  if (!geo) return null

  return (
    <group>
      {/* Continent fill — a glowing grid of points inside every landmass */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geo.land, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={LAND_GOLD}
          size={0.021}
          sizeAttenuation
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Crisp glowing coastlines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geo.coast, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={COAST_GOLD}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}

// Full lat/long graticule — clean meridians + parallels, faint gold.
function Graticule() {
  const positions = useMemo(() => {
    const seg: number[] = []
    const R = RADIUS * 1.0015
    const push = (a: THREE.Vector3, b: THREE.Vector3) => seg.push(a.x, a.y, a.z, b.x, b.y, b.z)
    for (let lat = -75; lat <= 75; lat += 15) {
      let prev: THREE.Vector3 | null = null
      for (let lng = -180; lng <= 180; lng += 4) {
        const v = latLngToVec3(lat, lng, R)
        if (prev) push(prev, v)
        prev = v
      }
    }
    for (let lng = -180; lng < 180; lng += 15) {
      let prev: THREE.Vector3 | null = null
      for (let lat = -90; lat <= 90; lat += 4) {
        const v = latLngToVec3(lat, lng, R)
        if (prev) push(prev, v)
        prev = v
      }
    }
    return new Float32Array(seg)
  }, [])

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={GRID_GOLD} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
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

function Atmosphere() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor:     { value: new THREE.Color('#F5C24A') }, // warm amber rim
          uPower:     { value: 2.6 },
          uIntensity: { value: 1.0 },
        },
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  return (
    <mesh scale={1.16}>
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
      {/* Dark glossy sphere — the unlit "ocean" the gold land glows against */}
      <mesh>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshPhongMaterial color="#070708" emissive="#0C0A06" specular="#5A4A22" shininess={32} />
      </mesh>

      {/* Faint gold graticule */}
      <Graticule />

      {/* Glowing grid continents + crisp coastlines */}
      <World />

      {/* Amber fresnel rim glow */}
      <Atmosphere />

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
            {/* Dark "space" backdrop so the gold hologram globe reads as
                intentional in both light and dark themes */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 0,
                background:
                  'radial-gradient(circle at 50% 46%, rgba(6,7,15,0.97) 0%, rgba(6,7,15,0.9) 38%, rgba(6,7,15,0) 72%)',
              }}
            />
            <Canvas
              camera={{ position: [0, 0, 4.8], fov: 42 }}
              style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.32} />
              <pointLight position={[6, 8, 8]}    intensity={1.1}  color="#FFE7BE" />
              <pointLight position={[-8, -4, -6]} intensity={0.35} color="#FFB870" />

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

            {/* Soft edge feather into the page */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 2,
                background:
                  'radial-gradient(ellipse at 50% 50%, transparent 68%, var(--page-bg) 92%)',
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
