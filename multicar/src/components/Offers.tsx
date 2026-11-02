import { useLayoutEffect, useRef } from 'react'
import { gsap, whenMotionOk } from '../lib/gsap'
import { Extruded } from './Extruded'

export function Offers() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    return whenMotionOk(el, () => {
      const q = gsap.utils.selector(el)

      q('[data-row]').forEach((row) => {
        const num = row.querySelector('[data-num]')
        const rest = row.querySelectorAll('[data-rest]')
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 72%', toggleActions: 'play none none none' },
          defaults: { ease: 'expo.out' },
        })
        tl.from(row.querySelector('[data-hair]'), { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'expo.inOut' })
        if (num)
          tl.fromTo(
            num,
            { rotateX: -55, yPercent: 28, opacity: 0, transformOrigin: '50% 100%', transformPerspective: 1100 },
            { rotateX: 0, yPercent: 0, opacity: 1, duration: 1.5 },
            0.1,
          )
        tl.from(rest, { y: 28, opacity: 0, duration: 1, stagger: 0.1 }, 0.35)
      })

      // third offer: the two lines drift in opposite directions as you scroll
      gsap.to('[data-drift="a"]', { xPercent: -3, ease: 'none', scrollTrigger: { trigger: '[data-row="3"]', scrub: true, start: 'top bottom', end: 'bottom top' } })
      gsap.to('[data-drift="b"]', { xPercent: 3, ease: 'none', scrollTrigger: { trigger: '[data-row="3"]', scrub: true, start: 'top bottom', end: 'bottom top' } })
    })
  }, [])

  return (
    <section id="ofertas" ref={root} className="relative bg-ink py-24 md:py-40">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="mb-16 flex items-end justify-between md:mb-28">
          <h2 className="mono text-steel">Condições do feirão</h2>
          <span className="mono text-ember">13 — 15 / 11</span>
        </div>

        {/* 01 — main offer */}
        <div data-row="1" className="relative">
          <div data-hair className="h-px w-full bg-white/15" />
          <div className="grid gap-6 pt-6 md:grid-cols-12 md:pt-8">
            <p data-rest className="mono text-ember md:col-span-2">01</p>
            <div className="md:col-span-10">
              <p data-rest className="display text-[clamp(2rem,5.6vw,6.2rem)]">12 primeiras parcelas</p>
              <div style={{ perspective: 1100 }} className="mt-2">
                <div data-num className="display text-[clamp(3.4rem,15.5vw,19rem)]">
                  <Extruded text="R$ 299,99" tone="ember" depth={30} />
                </div>
              </div>
              <p data-rest className="display mt-10 text-[clamp(1.4rem,3vw,3rem)] text-steel md:text-right">
                Pelo Banco Volkswagen
              </p>
            </div>
          </div>
        </div>

        {/* 02 — bonus */}
        <div data-row="2" className="relative mt-24 md:mt-44">
          <div data-hair className="h-px w-full bg-white/15" />
          <div className="grid gap-6 pt-6 md:grid-cols-12 md:pt-8">
            <p data-rest className="mono text-ember md:col-span-2">02</p>
            <div className="md:col-span-10">
              <div className="flex items-end gap-3 md:gap-6" style={{ perspective: 1100 }}>
                <span data-rest className="display mb-[0.6em] text-[clamp(2rem,6vw,7rem)] text-ember">R$</span>
                <div data-num className="display text-[clamp(5rem,24vw,28rem)]">
                  <Extruded text="5.000" depth={34} />
                </div>
              </div>
              <p data-rest className="display ml-auto mt-2 max-w-[18ch] text-[clamp(1.6rem,3.6vw,3.8rem)] md:text-right">
                De bônus no seu usado na troca
              </p>
            </div>
          </div>
        </div>

        {/* 03 — deferred first installment */}
        <div data-row="3" className="relative mt-24 overflow-hidden md:mt-44">
          <div data-hair className="h-px w-full bg-white/15" />
          <div className="grid gap-6 pt-6 md:grid-cols-12 md:pt-8">
            <p data-rest className="mono text-ember md:col-span-2">03</p>
            <div className="md:col-span-10">
              <div data-num style={{ perspective: 1100 }}>
                <p data-drift="a" className="display text-[clamp(3rem,9.2vw,11rem)] md:whitespace-nowrap">Primeira parcela</p>
                <p data-drift="b" className="display text-[clamp(3rem,9.2vw,11rem)] md:whitespace-nowrap text-ember">Só depois do Carnaval</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-32 md:pl-[16.66%]">
          <a href="#cadastro" className="btn-ember">
            <span>Quero aproveitar</span>
            <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
