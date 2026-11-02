import { useLayoutEffect, useRef } from 'react'
import { gsap, MQ_MOTION } from '../lib/gsap'
import { LeadForm } from './LeadForm'

export function Lead() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const q = gsap.utils.selector(root.current!)
    const mm = gsap.matchMedia()
    mm.add(MQ_MOTION, () => {
      q('.mask-in').forEach((n, i) => gsap.from(n, { yPercent: 110, duration: 1.1, delay: i * 0.08, ease: 'power4.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } }))
      gsap.from(q('.form-wrap'), { y: 50, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: q('.form-wrap')[0], start: 'top 88%' } })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="cadastro" ref={root} className="bg-graphite py-24 md:py-36" aria-labelledby="lead-h">
      <div className="gutter grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6 lg:pr-10">
          <div className="lg:sticky lg:top-28">
            <p className="mono text-brand">05 — Cadastro</p>
            <h2 id="lead-h" className="font-display mt-6 text-[clamp(3.4rem,8.4vw,8.4rem)]">
              <span className="block overflow-hidden"><span className="mask-in block">Seu próximo</span></span>
              <span className="block overflow-hidden"><span className="mask-in block">carro começa</span></span>
              <span className="block overflow-hidden"><span className="mask-in block text-brand">aqui.</span></span>
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-bone/80">
              Cadastre seu interesse e receba informações sobre as condições especiais do Mega Feirão de Aniversário da Multi Car Veículos.
            </p>
            <p className="mono mt-10 text-steel">13 — 14 — 15 Novembro<br />Multi Car Veículos | Luziânia-GO</p>
          </div>
        </div>
        <div className="form-wrap lg:col-span-6 lg:col-start-7 lg:pt-6">
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
