import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { isMobile, prefersReducedMotion } from '../hooks/useCapabilities'

type V3 = [number, number, number]

function Pizza() {
  const tilt = useRef<THREE.Group>(null!)
  const spin = useRef<THREE.Group>(null!)
  const still = prefersReducedMotion()
  const peps = useMemo<V3[]>(() => Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2, r = i % 2 ? 0.85 : 1.4
    return [Math.cos(a) * r, 0.14, Math.sin(a) * r]
  }), [])
  const basil = useMemo<V3[]>(() => Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 + 0.6
    return [Math.cos(a) * 1.1, 0.17, Math.sin(a) * 1.1]
  }), [])

  useFrame((s) => {
    tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, 0.95 + s.pointer.y * 0.35, 0.06)
    tilt.current.rotation.z = THREE.MathUtils.lerp(tilt.current.rotation.z, -s.pointer.x * 0.35, 0.06)
    if (!still) spin.current.rotation.y += 0.004
  })

  return (
    <group ref={tilt}>
      <group ref={spin}>
        <mesh castShadow><cylinderGeometry args={[2, 2, 0.18, 64]} /><meshStandardMaterial color="#d99a4e" roughness={0.8} /></mesh>
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[1.72, 1.72, 0.08, 64]} /><meshStandardMaterial color="#f5c542" roughness={0.45} /></mesh>
        <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.9, 0.14, 16, 64]} /><meshStandardMaterial color="#c9822f" roughness={0.85} /></mesh>
        {peps.map((p, i) => (
          <mesh key={i} position={p}><cylinderGeometry args={[0.28, 0.28, 0.05, 24]} /><meshStandardMaterial color="#b3261e" roughness={0.5} /></mesh>
        ))}
        {basil.map((p, i) => (
          <mesh key={i} position={p} rotation={[0, i, 0]} scale={[1, 0.25, 0.6]}><sphereGeometry args={[0.22, 12, 12]} /><meshStandardMaterial color="#2f8f3a" /></mesh>
        ))}
      </group>
    </group>
  )
}

function IceCube({ position, scale }: { position: V3; scale: number }) {
  return (
    <Float speed={1.4} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#9ff3ff" transparent opacity={0.55} roughness={0.08} metalness={0.1} />
      </mesh>
    </Float>
  )
}

export default function HeroScene({ active = true }: { active?: boolean }) {
  const mobile = isMobile()
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={mobile ? [1, 1.25] : [1, 2]} camera={{ position: [0, 0.6, 6.2], fov: 45 }} gl={{ antialias: !mobile, powerPreference: 'high-performance' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={60} color="#ff4d6d" />
      <pointLight position={[-4, -1, 2]} intensity={40} color="#22d3ee" />
      <Float speed={1.2} floatIntensity={0.6}><Pizza /></Float>
      <IceCube position={[-3, 1.4, -0.5]} scale={0.6} />
      <IceCube position={[3.2, -1.2, 0]} scale={0.45} />
      {!mobile && <IceCube position={[2.6, 1.9, -1]} scale={0.35} />}
      <Sparkles count={mobile ? 25 : 80} scale={[10, 6, 6]} size={mobile ? 2 : 3} speed={0.4} color="#ffb067" />
    </Canvas>
  )
}
