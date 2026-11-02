import { Suspense, lazy, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Text3D } from '../ui/Text3D'
import { CtaButton } from '../ui/CtaButton'
import { CarSilhouette } from '../ui/CarSilhouette'
import { hasWebGL, useIsMobile, useReducedMotion } from '../../hooks/useEnv'

const HeroScene = lazy(() => import('../three/HeroScene'))

export function Hero() {
  const mobile = useIsMobile()
  const reduced = useReducedMotion()
  const [gl, setGl] = useState(false)
  const [ready, setReady] = useState(false)

  // Carregamento progressivo: o 3D só entra após o primeiro paint/idle.
  useEffect(() => {
    if (!hasWebGL()) return
    const id = window.setTimeout(() => setGl(true), 600)
    return () => clearTimeout(id)
  }, [])

  return (
    <section id="topo" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-20">
      <div className="absolute inset-0 -z-10 bg-ink" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 55% at 70% 65%, rgba(255,106,0,.28), transparent 70%), radial-gradient(40% 30% at 15% 10%, rgba(255,138,0,.12), transparent 70%)' }} />
        {/* Fallback / placeholder visual enquanto o WebGL carrega */}
        <div className={`absolute bottom-[8%] right-[-10%] w-[85%] max-w-[900px] opacity-60 transition-opacity duration-1000 md:right-[2%] ${ready ? 'opacity-0' : ''}`}>
          <CarSilhouette className="w-full drop-shadow-[0_0_40px_rgba(255,106,0,.5)]" />
        </div>
        {gl && (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <Suspense fallback={null}>
              <ReadyProbe onReady={() => setReady(true)} />
              <HeroScene mobile={mobile} reduced={reduced} />
            </Suspense>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent md:from-ink/90 md:via-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
          className="mb-5 inline-flex items-center gap-2 rounded-sm border border-brand/40 bg-black/50 px-3 py-1.5 font-display text-[0.62rem] font-bold tracking-[0.25em] text-brand sm:text-xs"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" aria-hidden="true" />
          MULTI CAR VEÍCULOS | LUZIÂNIA-GO
        </motion.p>

        <h1 className="max-w-4xl leading-[0.9]">
          <span className="block text-[clamp(1.4rem,5vw,3.2rem)]"><Text3D text="ATENÇÃO, LUZIÂNIA-GO!" variant="white" delay={0.3} /></span>
          <span className="mt-2 block text-[clamp(3.4rem,17vw,8rem)]">
            <Text3D text="MEGA" variant="orange" delay={0.8} sweep />
          </span>
          <span className="block text-[clamp(3rem,14vw,7rem)]">
            <Text3D text="FEIRÃO" variant="chrome" delay={1.0} sweep />
          </span>
          <span className="mt-1 block text-[clamp(1rem,3.6vw,2.6rem)]">
            <Text3D text="DE ANIVERSÁRIO" variant="white" delay={1.3} />
          </span>
        </h1>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.8 }} className="mt-5 space-y-1">
          <p className="font-display text-lg font-black tracking-wider text-white sm:text-2xl">13, 14 E 15 DE NOVEMBRO</p>
          <p className="text-sm font-semibold tracking-[0.2em] text-steel">NA MULTI CAR VEÍCULOS · LUZIÂNIA-GO</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, duration: 0.8 }} className="glass glow-border relative mt-5 max-w-md rounded-md p-5">
          <i className="hud-corner hud-tl" /><i className="hud-corner hud-br" />
          <p className="font-display text-xs font-bold tracking-[0.3em] text-steel">PRIMEIRA PARCELA</p>
          <p className="mt-1 text-[clamp(1.5rem,6vw,2.4rem)]"><Text3D text="SÓ DEPOIS DO CARNAVAL" variant="orange" delay={2.2} /></p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, duration: 0.8 }} className="mt-6">
          <CtaButton>QUERO APROVEITAR O FEIRÃO</CtaButton>
        </motion.div>
      </div>
    </section>
  )
}

/** Dispara onReady quando o chunk 3D foi resolvido (Suspense deixa de suspender). */
function ReadyProbe({ onReady }: { onReady: () => void }) {
  useEffect(() => { const t = setTimeout(onReady, 300); return () => clearTimeout(t) }, [onReady])
  return null
}
