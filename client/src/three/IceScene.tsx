import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { isMobile, prefersReducedMotion } from '../hooks/useCapabilities'

function Bubbles({ count, still }: { count: number; still: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([])
  const seeds = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 0.8, z: (Math.random() - 0.5) * 0.8, s: 0.03 + Math.random() * 0.04, v: 0.25 + Math.random() * 0.3, y: -0.9 + Math.random() * 1.8,
  })), [count])
  useFrame((_, dt) => {
    if (still) return
    seeds.forEach((b, i) => { const m = refs.current[i]; if (m) { m.position.y += b.v * dt; if (m.position.y > 0.95) m.position.y = -0.9 } })
  })
  return <>{seeds.map((b, i) => (
    <mesh key={i} ref={(el) => { refs.current[i] = el }} position={[b.x, b.y, b.z]} scale={b.s}>
      <sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
    </mesh>))}</>
}

function Drink({ color, still, mobile }: { color: string; still: boolean; mobile: boolean }) {
  const group = useRef<THREE.Group>(null!)
  const liquid = useRef<THREE.MeshStandardMaterial>(null!)
  const target = useMemo(() => new THREE.Color(), [])
  useFrame((s, dt) => {
    liquid.current.color.lerp(target.set(color), Math.min(1, dt * 4))
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, s.pointer.y * 0.2, 0.05)
    if (!still) group.current.rotation.y += dt * 0.35
  })
  return (
    <group ref={group}>
      <mesh><cylinderGeometry args={[0.95, 0.7, 2.2, 40, 1, true]} /><meshStandardMaterial color="#d9f6ff" transparent opacity={0.22} roughness={0.05} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -1.1, 0]}><cylinderGeometry args={[0.7, 0.7, 0.12, 40]} /><meshStandardMaterial color="#d9f6ff" transparent opacity={0.5} roughness={0.1} /></mesh>
      <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.88, 0.66, 1.6, 40]} /><meshStandardMaterial ref={liquid} color={color} transparent opacity={0.85} roughness={0.2} /></mesh>
      {[[-0.3, 0.55, 0.1], [0.3, 0.6, -0.15], [0, 0.45, 0.3]].map((p, i) => (
        <Float key={i} speed={2} floatIntensity={0.25}><mesh position={p as [number, number, number]} rotation={[i, i * 2, 0]}><boxGeometry args={[0.38, 0.38, 0.38]} /><meshStandardMaterial color="#bff6ff" transparent opacity={0.6} roughness={0.05} /></mesh></Float>))}
      <mesh position={[0.3, 0.4, 0]} rotation={[0, 0, -0.18]}><cylinderGeometry args={[0.04, 0.04, 2.6, 8]} /><meshStandardMaterial color="#ff6a1a" /></mesh>
      <mesh position={[0.95, 1.05, 0]} rotation={[1.2, 0, 0.3]}><torusGeometry args={[0.38, 0.07, 8, 24]} /><meshStandardMaterial color="#9be15d" /></mesh>
      <Bubbles count={mobile ? 8 : 24} still={still} />
    </group>
  )
}

export default function IceScene({ color, active }: { color: string; active: boolean }) {
  const mobile = isMobile(), still = prefersReducedMotion()
  return (
    <Canvas frameloop={active ? 'always' : 'never'} dpr={mobile ? [1, 1.25] : [1, 2]} camera={{ position: [0, 0.3, 5.2], fov: 42 }} gl={{ antialias: !mobile }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 3]} intensity={50} color="#ffffff" />
      <pointLight position={[-3, -1, 2]} intensity={40} color="#22d3ee" />
      <Drink color={color} still={still} mobile={mobile} />
      <Float speed={1.2} floatIntensity={1.4}><mesh position={[-2.4, 1.1, -0.5]} rotation={[0.4, 0.6, 0]}><boxGeometry args={[0.7, 0.7, 0.7]} /><meshStandardMaterial color="#9ff3ff" transparent opacity={0.5} roughness={0.05} /></mesh></Float>
      {!mobile && <Float speed={1.5} floatIntensity={1.2}><mesh position={[2.5, -0.8, -0.3]} rotation={[0.2, 0.9, 0.3]}><boxGeometry args={[0.55, 0.55, 0.55]} /><meshStandardMaterial color="#9ff3ff" transparent opacity={0.5} roughness={0.05} /></mesh></Float>}
    </Canvas>
  )
}
