import { useRef } from 'react'
import { motion } from 'motion/react'
import Photo from './Photo'
import Extruded from './Extruded'
import { PHOTOS } from '../config'

export default function Hero() {
  const title = useRef<HTMLDivElement>(null)

  // A direção da extrusão acompanha o ponteiro: como se a luz do estúdio mudasse de lugar.
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !title.current) return
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2
    title.current.style.setProperty('--ex', `${(-x * 0.009).toFixed(4)}em`)
    title.current.style.setProperty('--ey', `${(0.011 + y * 0.004).toFixed(4)}em`)
  }

  return (
    <section id="topo" className="relative isolate overflow-hidden bg-ink" onPointerMove={onMove}>
      {/* Fotografia */}
      <div data-hero-photo className="absolute inset-y-0 right-0 -z-10 w-full md:w-[82%]">
        <div data-hero-cam className="absolute inset-[-4%]">
          <Photo {...PHOTOS.hero} eager className="h-full w-full object-cover" position="60% 55%" />
        </div>
        {/* Escurecimento funcional para leitura do texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-transparent md:via-ink/20" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="gutter relative flex min-h-[100svh] flex-col pt-24 pb-8 md:min-h-[92svh]">
        {/* Assinatura */}
        <div data-hero-fade className="mono flex items-center gap-4 text-bone/80">
          <span>Multi Car Veículos</span>
          <span className="h-px w-8 bg-steel" aria-hidden="true" />
          <span className="text-steel">Luziânia — GO</span>
        </div>

        {/* Título */}
        <div ref={title} className="mt-auto pt-10" style={{ perspective: '1400px' }}>
          <h1 className="display text-[clamp(3.1rem,14.2vw,15rem)] [&>span]:leading-[1]" aria-label="Mega Feirão de Aniversário">
            <span aria-hidden="true" data-title-line className="block origin-bottom">
              <Extruded tone="bone" depth={12}>MEGA FEIRÃO</Extruded>
            </span>
            <span aria-hidden="true" data-title-line className="block origin-bottom">
              <Extruded tone="bone" depth={12}>DE ANIVERSÁRIO</Extruded>
            </span>
          </h1>
        </div>

        <div data-hero-rule className="rule-ember mt-6 w-full" />

        {/* Linha editorial + oferta + CTA */}
        <div className="mt-6 grid gap-8 md:grid-cols-12 md:items-end">
          <div data-hero-fade className="md:col-span-5">
            <p className="font-mono text-2xl tracking-[0.08em] sm:text-3xl">
              13 <span className="text-ember">—</span> 14 <span className="text-ember">—</span> 15
              <span className="ml-3 text-ember">NOVEMBRO</span>
            </p>
            <p className="mono mt-3 text-steel">Multi Car Veículos | Luziânia-GO</p>
          </div>

          <div data-hero-offer className="md:col-span-4" style={{ perspective: '900px' }}>
            <p className="display text-[clamp(1.5rem,3.2vw,2.6rem)] text-bone">Primeira parcela</p>
            <p className="display text-[clamp(1.5rem,3.2vw,2.6rem)] text-ember">Só depois do Carnaval</p>
          </div>

          <div data-hero-fade className="md:col-span-3 md:justify-self-end">
            <motion.a
              href="#cadastro"
              className="btn-ember"
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              Quero aproveitar <span className="arrow" aria-hidden="true">→</span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  )
}
