import { useLayoutEffect, useRef } from 'react'
import { gsap, whenMotionOk } from '../lib/gsap'
import { Extruded } from './Extruded'
import { Photo } from './Photo'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    return whenMotionOk(el, () => {
      const q = gsap.utils.selector(el)
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.fromTo(q('[data-photo]'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'expo.inOut' })
        .fromTo(q('[data-cam]'), { scale: 1.28, xPercent: 3 }, { scale: 1.06, xPercent: 0, duration: 3, ease: 'power3.out' }, 0)
        .fromTo(q('[data-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'expo.inOut' }, 0.5)
        .from(q('[data-sign]'), { y: 14, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.9)
        .from(q('[data-line]'), { yPercent: 55, rotateX: -42, opacity: 0, transformOrigin: '50% 100%', duration: 1.3, stagger: 0.14 }, 1.0)
        .from(q('[data-meta]'), { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 1.6)
        .fromTo(
          q('[data-offer]'),
          { z: -260, rotateX: 24, y: 50, opacity: 0, transformPerspective: 900, transformOrigin: '50% 100%' },
          { z: 0, rotateX: 0, y: 0, opacity: 1, duration: 1.6 },
          1.75,
        )

      // sustained camera drift + scroll parallax on the photograph
      gsap.to(q('[data-cam-par]'), {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(q('[data-title-wrap]'), {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })

      // light pointer tilt on the title (fine pointers only)
      const fine = window.matchMedia('(pointer: fine)').matches
      const title = stage.current
      let off = () => {}
      if (fine && title) {
        const rx = gsap.quickTo(title, 'rotationX', { duration: 0.9, ease: 'power3.out' })
        const ry = gsap.quickTo(title, 'rotationY', { duration: 0.9, ease: 'power3.out' })
        const move = (e: PointerEvent) => {
          ry(((e.clientX / window.innerWidth) - 0.5) * 7)
          rx(-((e.clientY / window.innerHeight) - 0.5) * 5)
        }
        window.addEventListener('pointermove', move)
        off = () => window.removeEventListener('pointermove', move)
      }
      return off
    })
  }, [])

  return (
    <section id="top" ref={root} className="relative isolate flex min-h-[92svh] flex-col overflow-hidden bg-ink">
      {/* photograph */}
      <div data-photo className="absolute inset-0 -z-10">
        <div data-cam-par className="absolute -inset-y-[8%] inset-x-0">
          <div data-cam className="h-full w-full">
            <Photo
              src="/images/hero.jpg"
              alt="Veículo em destaque no Mega Feirão de Aniversário da Multi Car"
              className="h-full w-full"
              priority
              position="68% 55%"
              slot="public/images/hero.jpg"
            />
          </div>
        </div>
        {/* scrim: protects the type, keeps the car lit */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-transparent md:via-ink/25" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* top signature + orange line */}
      <div className="relative mx-auto w-full max-w-[1680px] px-5 pt-24 md:px-10 md:pt-28">
        <div className="flex items-end justify-between">
          <p data-sign className="mono leading-relaxed text-bone">
            Multi Car Veículos
            <br />
            <span className="text-steel">Luziânia — GO</span>
          </p>
          <p data-sign className="mono hidden text-steel sm:block">Edição de aniversário · 2026</p>
        </div>
        <div data-rule className="mt-5 h-px origin-left bg-ember" />
      </div>

      {/* composition */}
      <div className="relative mx-auto mt-auto flex w-full max-w-[1680px] flex-col gap-10 px-5 pb-10 pt-10 md:px-10 md:pb-12">
        <div data-title-wrap style={{ perspective: 1400 }}>
          <div ref={stage} style={{ transformStyle: 'preserve-3d' }}>
            <h1 className="display text-[clamp(3.2rem,12.4vw,15rem)]" aria-label="Mega Feirão de Aniversário">
              <span data-line className="block" aria-hidden="true">
                <Extruded text="MEGA FEIRÃO" depth={26} />
              </span>
              <span data-line className="block" aria-hidden="true">
                <Extruded text="DE ANIVERSÁRIO" depth={26} />
              </span>
            </h1>
          </div>
        </div>

        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p data-meta className="display text-[clamp(2rem,4.2vw,4rem)] leading-none">
              <span className="text-ember">13</span> — <span className="text-ember">14</span> — <span className="text-ember">15</span>{' '}
              <span className="text-bone">Novembro</span>
            </p>
            <p data-meta className="mono mt-4 text-steel">Multi Car Veículos &nbsp;|&nbsp; Luziânia-GO</p>
          </div>

          <div data-offer className="md:col-span-7 md:pl-[4%]" style={{ transformStyle: 'preserve-3d' }}>
            <p className="display text-[clamp(1.6rem,3.2vw,3.2rem)] text-bone">Primeira parcela</p>
            <p className="display text-[clamp(2.2rem,4.6vw,5rem)] text-ember md:whitespace-nowrap">Só depois do Carnaval</p>
            <a href="#cadastro" className="btn-ember mt-7">
              <span>Quero aproveitar</span>
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
