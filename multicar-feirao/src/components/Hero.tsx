import { useLayoutEffect, useRef } from 'react'
import { gsap, MQ_MOTION } from '../lib/gsap'
import { Extrude } from './Extrude'
import { Photo } from './Photo'
import { CarLineArt } from './CarLineArt'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const stages = q('.extrude-stage')
    const mm = gsap.matchMedia()

    mm.add(MQ_MOTION, () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.fromTo(q('.hero-photo'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'expo.inOut' })
        .fromTo(q('.cam'), { scale: 1.3 }, { scale: 1, duration: 2.4, ease: 'power3.out' }, 0)
        .fromTo(q('.hero-title .extrude-stage'), { y: 90, rotationX: 55, opacity: 0, transformOrigin: '30% 100%' }, { y: 0, rotationX: 4, opacity: 1, duration: 1.4, stagger: 0.14 }, 0.7)
        .fromTo(q('.hero-rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'expo.inOut' }, 1.0)
        .fromTo(q('.hero-meta > *'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, 1.5)
        .fromTo(q('.hero-offer'), { z: -260, scale: 0.9, y: 40, opacity: 0 }, { z: 0, scale: 1, y: 0, opacity: 1, duration: 1.4 }, 1.7)
        .fromTo(q('.hero-cta'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 2.2)

      // Câmera: parallax sutil no scroll
      gsap.to(q('.cam'), { yPercent: 9, scale: 1.07, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to(q('.hero-copy'), { yPercent: -8, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: el, start: '55% top', end: 'bottom top', scrub: true } })

      // Tilt do texto 3D seguindo o ponteiro (só dispositivos com mouse)
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const rx = gsap.quickTo(stages, 'rotationX', { duration: 0.9, ease: 'power3.out' })
        const ry = gsap.quickTo(stages, 'rotationY', { duration: 0.9, ease: 'power3.out' })
        const cx = gsap.quickTo(q('.cam'), 'x', { duration: 1.4, ease: 'power3.out' })
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          ry(-12 + nx * 14)
          rx(4 - ny * 8)
          cx(nx * -22)
        }
        window.addEventListener('pointermove', move, { passive: true })
        return () => window.removeEventListener('pointermove', move)
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="feirao" ref={root} className="hero" aria-labelledby="hero-h">
      <div className="hero-photo" aria-hidden={false}>
        <div className="cam">
          <Photo
            photo="hero"
            eager
            sizes="100vw"
            imgClassName="object-[70%_55%]"
            fallback={
              <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_68%_62%,#2b2b2b_0%,#141414_55%,#080808_100%)]">
                <CarLineArt className="absolute right-[-4%] top-[14%] w-[104%] md:right-[2%] md:top-[12%] md:w-[60%]" />
              </div>
            }
          />
        </div>
        <div className="hero-shade" />
      </div>

      <div className="hero-copy gutter relative z-10 flex flex-col justify-end pb-10 pt-28 md:pb-14">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 id="hero-h" className="hero-title font-display">
              <span className="sr-only">Mega Feirão de Aniversário</span>
              <span aria-hidden="true" className="block">
                <Extrude face="metal" tone="steel" layers={14}>MEGA FEIRÃO</Extrude>
              </span>
              <span aria-hidden="true" className="l2 mt-[.04em] block">
                <Extrude face="metal" tone="steel" layers={14}>DE ANIVERSÁRIO</Extrude>
              </span>
            </h1>

            <div className="relative mt-8 md:mt-10">
              <div className="hero-rule h-[2px] w-full origin-left bg-brand" />
              <div className="hero-meta mt-5 flex flex-wrap items-baseline gap-x-10 gap-y-3">
                <p className="font-display text-[clamp(1.9rem,3.6vw,3rem)] tracking-[.04em] text-bone" style={{ lineHeight: 1 }}>
                  <time dateTime="2026-11-13">13</time><span className="text-brand"> — </span>
                  <time dateTime="2026-11-14">14</time><span className="text-brand"> — </span>
                  <time dateTime="2026-11-15">15</time> NOVEMBRO
                </p>
                <p className="mono text-steel">MULTI CAR VEÍCULOS&nbsp;|&nbsp;LUZIÂNIA-GO</p>
              </div>
            </div>
          </div>

          <div className="hero-offer font-display lg:col-span-4 lg:text-right" style={{ transformStyle: 'preserve-3d' }}>
            <p className="text-[clamp(1.6rem,2.6vw,2.4rem)] tracking-[.06em] text-bone">Primeira parcela</p>
            <p className="mono mt-2 text-steel" style={{ fontWeight: 400 }}>só depois do</p>
            <p className="mt-1 text-[clamp(3rem,5.8vw,5.6rem)] text-brand">Carnaval</p>
            <a href="#cadastro" className="hero-cta btn mt-6">
              Quero aproveitar <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
