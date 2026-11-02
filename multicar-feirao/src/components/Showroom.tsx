import { useLayoutEffect, useRef } from 'react'
import { gsap, MQ_MOTION } from '../lib/gsap'
import { BRANDS, type PhotoKey } from '../data/content'
import { Photo } from './Photo'

interface Tile { key: PhotoKey; brand: string; n: string; grid: string; ratio: string; sizes: string; pos: string }

// Grade assimétrica: cada recorte tem proporção e posição próprias.
const TILES: Tile[] = [
  { key: 'byd', brand: BRANDS[0], n: '01', grid: 'lg:col-span-7', ratio: 'aspect-[4/3]', sizes: '(min-width:1024px) 58vw, 100vw', pos: '' },
  { key: 'citroen', brand: BRANDS[1], n: '02', grid: 'lg:col-span-4 lg:col-start-9 lg:mt-40', ratio: 'aspect-[3/4]', sizes: '(min-width:1024px) 33vw, 80vw', pos: '' },
  { key: 'peugeot', brand: BRANDS[2], n: '03', grid: 'lg:col-span-5 lg:col-start-2 lg:-mt-24', ratio: 'aspect-square', sizes: '(min-width:1024px) 40vw, 90vw', pos: '' },
  { key: 'ford', brand: BRANDS[3], n: '04', grid: 'lg:col-span-6 lg:col-start-7 lg:mt-24', ratio: 'aspect-video', sizes: '(min-width:1024px) 50vw, 100vw', pos: '' },
  { key: 'nissan', brand: BRANDS[4], n: '05', grid: 'lg:col-span-10 lg:col-start-3', ratio: 'aspect-[21/9]', sizes: '(min-width:1024px) 83vw, 100vw', pos: '' },
]

export function Showroom() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const mm = gsap.matchMedia()
    mm.add(MQ_MOTION, () => {
      // contador
      const counter = { v: 0 }
      const num = q('.count')[0]
      gsap.to(counter, { v: 300, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: num, start: 'top 85%', once: true }, onUpdate: () => { num.textContent = String(Math.round(counter.v)) } })
      // títulos em máscara
      q('.mask-in').forEach((n) => gsap.from(n, { yPercent: 110, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: n, start: 'top 92%' } }))
      // imagens: máscara de entrada + parallax interno
      q('.tile').forEach((t) => {
        gsap.fromTo(t, { clipPath: 'inset(14% 8% 0% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power3.out', duration: 1.3, scrollTrigger: { trigger: t, start: 'top 88%' } })
        gsap.fromTo(t.querySelector('.ph'), { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      gsap.from(q('.brand-line > *'), { opacity: 0, y: 24, stagger: 0.08, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: q('.brand-line')[0], start: 'top 90%' } })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="estoque" ref={root} className="relative bg-ink py-24 md:py-40" aria-labelledby="estoque-h">
      <div className="gutter">
        <p className="mono text-brand">04 — Showroom</p>
        <h2 id="estoque-h" className="font-display mt-6">
          <span className="block overflow-hidden"><span className="mask-in block text-[clamp(2rem,5vw,4.6rem)] text-steel">Mais de</span></span>
          <span className="flex items-end gap-4 overflow-hidden">
            <span className="mask-in block text-[clamp(8rem,31vw,30rem)] leading-[.78] text-brand">
              <span className="count">300</span>
            </span>
            <span className="mask-in mb-[.4em] block text-[clamp(2.2rem,6.2vw,6.4rem)] leading-[.86]">carros<br />em estoque</span>
          </span>
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <p className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] tracking-[.05em] md:col-span-6 md:col-start-1">
            Toda linha zero km e também carros semi-novos
          </p>
        </div>

        <ul className="brand-line font-display mt-14 flex flex-wrap items-center gap-x-5 gap-y-1 border-y border-bone/15 py-5 text-[clamp(1.6rem,4vw,3.4rem)] tracking-[.04em]" aria-label="Marcas">
          {BRANDS.map((b, i) => (
            <li key={b} className="flex items-center gap-5">
              {b}
              {i < BRANDS.length - 1 && <span aria-hidden="true" className="text-brand">•</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="gutter mt-20 grid grid-cols-1 gap-y-14 md:mt-28 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
        {TILES.map((t) => (
          <figure key={t.key} className={`relative ${t.grid}`}>
            <div className={`tile ${t.ratio}`}>
              <div className="ph">
                <Photo
                  photo={t.key}
                  sizes={t.sizes}
                  fallback={
                    <div className="tile-fallback">
                      <span className="font-display stroke-text text-[clamp(2.4rem,5.2vw,5.6rem)] " aria-hidden="true">{t.brand}</span>
                    </div>
                  }
                />
              </div>
            </div>
            <figcaption className="mono mt-3 flex items-center justify-between text-steel">
              <span>{t.n}</span>
              <span className="text-bone">{t.brand}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
