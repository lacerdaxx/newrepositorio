import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/** Silhueta esportiva procedural (não representa nenhum modelo real do estoque). */
function carShape(roof: boolean) {
  const s = new THREE.Shape()
  if (!roof) {
    s.moveTo(-2.2, 0.28)
    s.lineTo(-2.25, 0.66)
    s.quadraticCurveTo(-2.2, 0.8, -1.6, 0.86)
    s.lineTo(-1.0, 0.92)
    s.quadraticCurveTo(-0.55, 1.28, 0.05, 1.3)
    s.quadraticCurveTo(0.7, 1.3, 1.2, 0.95)
    s.lineTo(2.0, 0.8)
    s.quadraticCurveTo(2.3, 0.72, 2.3, 0.5)
    s.lineTo(2.25, 0.28)
    s.closePath()
  } else {
    // vidros
    s.moveTo(-0.95, 0.97)
    s.quadraticCurveTo(-0.58, 1.24, 0.05, 1.26)
    s.quadraticCurveTo(0.62, 1.26, 1.08, 0.97)
    s.closePath()
  }
  return s
}

function Wheel({ x, z }: { x: number; z: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, d) => { if (ref.current) ref.current.rotation.z -= d * 3 })
  return (
    <group position={[x, 0.42, z]} rotation={[Math.PI / 2, 0, 0]}>
      <group ref={ref}>
        <mesh>
          <cylinderGeometry args={[0.42, 0.42, 0.3, 32]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.155, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.02, 24]} />
          <meshStandardMaterial color="#cfcfcf" metalness={1} roughness={0.2} emissive="#ff6a00" emissiveIntensity={0.25} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, 0.17, 0]} rotation={[0, i * ((Math.PI * 2) / 5), 0]}>
            <boxGeometry args={[0.06, 0.02, 0.5]} />
            <meshStandardMaterial color="#ff6a00" metalness={1} roughness={0.3} emissive="#ff6a00" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Car({ pointer, mobile }: { pointer: React.MutableRefObject<{ x: number; y: number }>; mobile: boolean }) {
  const group = useRef<THREE.Group>(null)
  const geo = useMemo(
    () => new THREE.ExtrudeGeometry(carShape(false), { depth: 1.5, bevelEnabled: true, bevelSize: 0.16, bevelThickness: 0.2, bevelSegments: 8, curveSegments: 24 }),
    [],
  )
  const glass = useMemo(
    () => new THREE.ExtrudeGeometry(carShape(true), { depth: 1.6, bevelEnabled: true, bevelSize: 0.16, bevelThickness: 0.2, bevelSegments: 4 }),
    [],
  )
  useEffect(() => () => { geo.dispose(); glass.dispose() }, [geo, glass])
  useFrame((st) => {
    if (!group.current) return
    const t = st.clock.elapsedTime
    const targetY = -0.6 + pointer.current.x * 0.35 + Math.sin(t * 0.3) * 0.12
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04
    group.current.rotation.x += (pointer.current.y * -0.05 - group.current.rotation.x) * 0.04
    group.current.position.y = Math.sin(t * 0.8) * 0.02
  })
  return (
    <group ref={group} position={mobile ? [0.3, -0.2, 0] : [1.9, 0, 0]} scale={mobile ? 0.62 : 0.85}>
      <mesh geometry={geo} position={[0, 0, -0.75]} castShadow>
        <meshPhysicalMaterial color="#3a3a3e" metalness={0.9} roughness={0.22} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1.6} />
      </mesh>
      <mesh geometry={glass} position={[0, 0.003, -0.8]}>
        <meshPhysicalMaterial color="#05070a" metalness={0.6} roughness={0.05} clearcoat={1} envMapIntensity={2} />
      </mesh>
      {/* friso laranja lateral */}
      {[0.97, -0.97].map((z) => (
        <mesh key={z} position={[0, 0.58, z]}><boxGeometry args={[4.2, 0.03, 0.02]} /><meshBasicMaterial color="#ff6a00" /></mesh>
      ))}
      {/* faixa de luz laranja */}
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[4.5, 0.02, 1.95]} />
        <meshBasicMaterial color="#ff6a00" transparent opacity={0.0} />
      </mesh>
      <mesh position={[2.32, 0.6, 0.45]}><boxGeometry args={[0.04, 0.06, 0.4]} /><meshBasicMaterial color="#ffffff" /></mesh>
      <mesh position={[2.32, 0.6, -0.45]}><boxGeometry args={[0.04, 0.06, 0.4]} /><meshBasicMaterial color="#ffffff" /></mesh>
      <mesh position={[-2.3, 0.66, 0]}><boxGeometry args={[0.04, 0.05, 1.3]} /><meshBasicMaterial color="#ff3a00" /></mesh>
      {[1.3, -1.3].flatMap((x) => [0.82, -0.82].map((z) => <Wheel key={`${x}${z}`} x={x} z={z} />))}
    </group>
  )
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 14
      a[i * 3 + 1] = Math.random() * 5
      a[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return a
  }, [count])
  useFrame((_, d) => {
    if (!ref.current) return
    ref.current.rotation.y += d * 0.03
    ref.current.position.y = ((ref.current.position.y + d * 0.08) % 0.6)
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ff8a00" size={0.035} transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function Env() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl)
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => { scene.environment = null; env.dispose(); pm.dispose() }
  }, [gl, scene])
  return null
}

function Rig({ pointer, reduced, mobile }: { pointer: React.MutableRefObject<{ x: number; y: number }>; reduced: boolean; mobile: boolean }) {
  useFrame((st) => {
    const cam = st.camera
    // dolly de entrada + parallax do mouse
    const t = reduced ? 1 : Math.min(st.clock.elapsedTime / 3, 1)
    const ease = 1 - Math.pow(1 - t, 3)
    const z = (mobile ? 13 : 11) - ease * 3.2
    cam.position.x += (pointer.current.x * 0.6 - cam.position.x) * 0.04
    cam.position.y += (1.4 + pointer.current.y * 0.3 - cam.position.y) * 0.04
    cam.position.z = z
    cam.lookAt(mobile ? 0 : 1.2, 0.6, 0)
  })
  return null
}

export default function HeroScene({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    if (mobile) return
    const on = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [mobile])

  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: 38, position: [0, 1.4, 11] }}
      gl={{ antialias: !mobile, powerPreference: 'high-performance', alpha: true }}
      frameloop={reduced ? 'demand' : 'always'}
      aria-hidden="true"
    >
      <Env />
      <fog attach="fog" args={['#050505', 8, 20]} />
      <ambientLight intensity={0.15} />
      <spotLight position={[-4, 6, 4]} angle={0.5} penumbra={1} intensity={60} color="#ffffff" />
      <pointLight position={[4, 1.2, -3]} intensity={30} color="#ff6a00" distance={14} />
      <pointLight position={[-4, 0.8, 3]} intensity={14} color="#ff8a00" distance={10} />
      <Car pointer={pointer} mobile={mobile} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial color="#040404" metalness={0.4} roughness={0.7} envMapIntensity={0.1} />
      </mesh>
      <gridHelper args={[18, 36, '#7a3300', '#1a0c03']} position={[0, 0.003, 0]} />
      <Particles count={mobile ? 60 : 180} />
      <Rig pointer={pointer} reduced={reduced} mobile={mobile} />
    </Canvas>
  )
}
