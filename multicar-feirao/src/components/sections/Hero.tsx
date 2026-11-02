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

  useEffect(() => {
    if (mobile || !hasWebGL()) return
    const id = window.setTimeout(() => setGl(true), 600)
    return () => clearTimeout(id)
  }, [mobile])

  return (
    <section id="topo" className="relative isolate overflow-hidden pb-14 pt-24 sm:pb-20 md:pt-28">
      {/* camadas de fundo */}
      <div className="absolute inset-0 -z-10 bg-ink" aria-hidden="true">
        <div className="speed absolute inset-0 opacity-70" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 75% 75%, rgba(255,106,0,.35), transparent 70%)' }} />
        <div className={`absolute bottom-0 right-0 hidden md:bottom-auto md:top-[12%] md:block md:h-[52%] md:w-[62%] [mask-image:radial-gradient(closest-side,#000_55%,transparent_100%)] ${ready ? '' : 'opacity-60'}`}>
          <div className={`absolute inset-x-[6%] bottom-[8%] transition-opacity duration-1000 ${ready ? 'opacity-0' : 'opacity-100'}`}>
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
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
        {/* chamada em faixa */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="-skew-x-12 bg-brand px-4 py-1.5 font-display text-[clamp(1.1rem,3.4vw,2.2rem)] tracking-wide text-black">
            <span className="inline-block skew-x-12">ATENÇÃO, LUZIÂNIA-GO!</span>
          </span>
          <span className="font-cond text-xs font-bold tracking-[0.35em] text-steel sm:text-sm">MULTI CAR VEÍCULOS | LUZIÂNIA-GO</span>
        </motion.div>

        <h1 className="origin-left -skew-x-6 pl-2 leading-[0.82]">
          <span className="block text-[clamp(4.5rem,min(27vw,24vh),23rem)]"><Text3D text="MEGA" variant="orange" delay={0.4} sweep /></span>
          <span className="-mt-[0.03em] block text-[clamp(3.8rem,min(22vw,19vh),19rem)]"><Text3D text="FEIRÃO" variant="chrome" delay={0.7} sweep /></span>
          <motion.span initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 1.4, duration: 0.8 }} style={{ transformOrigin: 'left' }}
            className="mt-2 flex items-center gap-4 font-display text-[clamp(1.6rem,6.5vw,5rem)] tracking-[0.04em]">
            <span className="outline-w">DE ANIVERSÁRIO</span>
            <span className="h-[3px] flex-1 bg-gradient-to-r from-brand to-transparent" aria-hidden="true" />
          </motion.span>
        </h1>

        <div className="mt-6 grid gap-8 md:grid-cols-[auto_1fr] md:items-end md:gap-14">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.8 }}>
            <p className="font-display text-[clamp(2.1rem,6vw,4.6rem)] leading-[0.95] text-white">13, 14 E 15 <span className="text-brand">DE NOVEMBRO</span></p>
            <p className="mt-2 font-cond text-lg font-bold tracking-[0.18em] text-white sm:text-2xl">NA MULTI CAR VEÍCULOS</p>
            <p className="font-cond text-sm font-semibold tracking-[0.3em] text-steel sm:text-base">LUZIÂNIA-GO</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9, duration: 0.8 }} className="max-w-xl border-l-4 border-brand pl-5">
            <p className="font-cond text-sm font-extrabold tracking-[0.4em] text-white">PRIMEIRA PARCELA</p>
            <p className="mt-1 text-[clamp(2.2rem,6vw,4.2rem)]"><Text3D text="SÓ DEPOIS DO CARNAVAL" variant="orange" delay={2.1} /></p>
            <div className="mt-6"><CtaButton>QUERO APROVEITAR O FEIRÃO</CtaButton></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ReadyProbe({ onReady }: { onReady: () => void }) {
  useEffect(() => { const t = setTimeout(onReady, 300); return () => clearTimeout(t) }, [onReady])
  return null
}
