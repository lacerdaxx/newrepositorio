import { useLayoutEffect, useRef } from 'react'
import { gsap, MQ_DESKTOP, MQ_MOTION } from '../lib/gsap'
import { Extrude } from './Extrude'

const Index = ({ n }: { n: number }) => (
  <p className="mono flex items-center gap-4 opacity-80">
    <span>Oferta 0{n} / 03</span>
    <span className="h-px w-16 bg-current opacity-50" />
  </p>
)

export function Offers() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const mm = gsap.matchMedia()

    // Desktop: palco fixo, as ofertas trocam como cortes de cena.
    mm.add(`${MQ_MOTION} and ${MQ_DESKTOP}`, () => {
      el.classList.add('is-pinned')
      const [p1, p2, p3] = q('.offer')
      gsap.set([p2, p3], { clipPath: 'inset(100% 0 0 0)' })
      gsap.set(q('.offer-2 .inner, .offer-3 .inner'), { y: 80 })
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: { trigger: el, start: 'top top', end: '+=240%', pin: true, scrub: 0.6, anticipatePin: 1 },
      })
      tl.fromTo(q('.offer-1 .inner'), { y: 0 }, { y: 0, duration: 0.6 }) // respiro inicial
        .to(p2, { clipPath: 'inset(0% 0 0 0)', duration: 1 })
        .to(q('.offer-1 .inner'), { scale: 0.92, opacity: 0.25, y: -40, duration: 1 }, '<')
        .to(q('.offer-2 .inner'), { y: 0, duration: 1 }, '<')
        .to({}, { duration: 0.7 })
        .to(p3, { clipPath: 'inset(0% 0 0 0)', duration: 1 })
        .to(q('.offer-2 .inner'), { scale: 0.92, opacity: 0.25, y: -40, duration: 1 }, '<')
        .to(q('.offer-3 .inner'), { y: 0, duration: 1 }, '<')
        .to({}, { duration: 0.6 })
      gsap.to(q('.rot'), { rotationY: -2, rotationX: 2, scrollTrigger: { trigger: el, start: 'top top', end: '+=240%', scrub: 1 } })
      void p1
      return () => el.classList.remove('is-pinned')
    })

    // Mobile / tablet: ofertas empilhadas com entrada discreta.
    mm.add(`${MQ_MOTION} and (max-width: 1023px)`, () => {
      q('.offer .inner').forEach((n) =>
        gsap.from(n, { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: n, start: 'top 85%' } }),
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="ofertas" ref={root} className="offers" aria-label="Condições do Mega Feirão">
      {/* 01 — parcelas */}
      <article className="offer offer-1">
        <div className="inner gutter flex flex-col justify-between">
          <Index n={1} />
          <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-12">
              <h2 className="font-display text-[clamp(2.2rem,5.6vw,5.4rem)] text-bone">
                <span className="text-brand">12</span> primeiras parcelas
              </h2>
              <p className="rot font-display mt-1 flex items-start" style={{ perspective: 1200 }}>
                <span className="mt-[.5em] mr-[.15em] text-[clamp(2rem,5vw,5rem)] text-brand" style={{ lineHeight: 1 }}>R$</span>
                <Extrude face="metal" tone="steel" layers={16} step={0.014}>
                  <span className="big-num block">299,99</span>
                </Extrude>
              </p>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-5">
            <span className="h-[2px] w-24 bg-brand" />
            <p className="font-display text-[clamp(1.6rem,3vw,2.6rem)] tracking-[.08em] text-bone">Pelo Banco Volkswagen</p>
          </div>
        </div>
      </article>

      {/* 02 — bônus */}
      <article className="offer offer-2">
        <div className="inner gutter flex flex-col justify-between">
          <Index n={2} />
          <div className="mt-6 grid items-end gap-6 lg:grid-cols-12">
            <p className="font-display text-[clamp(2.2rem,5vw,4.8rem)] lg:col-span-4 lg:pb-[.6em]">
              De bônus<br />no seu usado<br />na troca
            </p>
            <p className="rot font-display lg:col-span-8 lg:text-right" style={{ perspective: 1200 }}>
              <Extrude face="bone" tone="ink" layers={16} step={0.014}>
                <span className="big-num block" style={{ fontSize: 'min(24vw, 44svh)' }}>
                  <span className="text-[.38em] align-top">R$ </span>5.000
                </span>
              </Extrude>
            </p>
          </div>
          <span className="mono">Mega Feirão · Luziânia-GO</span>
        </div>
      </article>

      {/* 03 — carnaval */}
      <article className="offer offer-3">
        <div className="inner gutter flex flex-col justify-between">
          <Index n={3} />
          <div className="relative mt-6">
            <h2 className="font-display text-[clamp(3.6rem,13.5vw,14rem)] leading-[.82]">
              Primeira<br />parcela
            </h2>
            <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-2 lg:ml-[18%]">
              <span className="mb-[.9rem] hidden h-[3px] w-20 bg-ink md:block" />
              <p className="font-display text-[clamp(2.6rem,7.6vw,7.4rem)] leading-[.86]">
                Só depois <span className="whitespace-nowrap">do <span className="text-brand">Carnaval</span></span>
              </p>
            </div>
          </div>
          <div className="flex items-end justify-between gap-6">
            <span className="mono">Mega Feirão · 13—14—15 nov</span>
            <a href="#cadastro" className="btn btn-ink">Quero aproveitar <span className="arrow" aria-hidden="true">→</span></a>
          </div>
        </div>
      </article>
    </section>
  )
}
