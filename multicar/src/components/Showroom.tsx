import { useLayoutEffect, useRef } from 'react'
import { gsap, whenMotionOk } from '../lib/gsap'
import { Photo } from './Photo'

type Shot = { brand: string; file: string; cls: string; ratio: string; pos?: string }

// Layout is asymmetric on purpose; swap files in /public/images, keep the brand captions truthful.
const shots: Shot[] = [
  { brand: 'BYD', file: 'byd.jpg', cls: 'md:col-span-7', ratio: 'aspect-[16/10]' },
  { brand: 'Citroën', file: 'citroen.jpg', cls: 'md:col-span-4 md:col-start-9 md:mt-32', ratio: 'aspect-[4/5]' },
  { brand: 'Peugeot', file: 'peugeot.jpg', cls: 'md:col-span-4 md:col-start-2 md:-mt-16', ratio: 'aspect-[4/5]' },
  { brand: 'Ford', file: 'ford.jpg', cls: 'md:col-span-7 md:col-start-6 md:mt-24', ratio: 'aspect-[21/10]' },
  { brand: 'Nissan', file: 'nissan.jpg', cls: 'md:col-span-8 md:col-start-3', ratio: 'aspect-[16/8]' },
]

export function Showroom() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    return whenMotionOk(el, () => {
      const q = gsap.utils.selector(el)

      q('[data-shot]').forEach((s) => {
        const img = s.querySelector('[data-par]')
        gsap.fromTo(s, { clipPath: 'inset(100% 0 0 0)' }, {
          clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut',
          scrollTrigger: { trigger: s, start: 'top 85%', toggleActions: 'play none none none' },
        })
        if (img) {
          gsap.fromTo(img, { yPercent: -9, scale: 1.18 }, {
            yPercent: 9, scale: 1.18, ease: 'none',
            scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        }
      })

      q('[data-title-line]').forEach((l) =>
        gsap.from(l, {
          yPercent: 105, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: l, start: 'top 90%' },
        }),
      )

      gsap.to(q('[data-brands]'), {
        xPercent: -22, ease: 'none',
        scrollTrigger: { trigger: q('[data-brands]')[0], start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
  }, [])

  return (
    <section id="estoque" ref={root} className="relative overflow-hidden bg-bone py-24 text-ink md:py-40">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="flex items-end justify-between">
          <h2 className="mono text-ink/60">Showroom</h2>
          <span className="mono text-ink/60">Zero km · Semi-novos</span>
        </div>

        <div className="mt-10 md:mt-16">
          <div className="line-mask"><p data-title-line className="display text-[clamp(3.2rem,12.5vw,15rem)]">Mais de <span className="text-ember">300</span></p></div>
          <div className="line-mask"><p data-title-line className="display text-[clamp(3.2rem,12.5vw,15rem)]">carros em estoque</p></div>
        </div>

        <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-12">
          <p className="display text-[clamp(1.4rem,2.6vw,2.6rem)] md:col-span-6 md:col-start-7">
            Toda linha zero km e também carros semi&#8209;novos
          </p>
        </div>

        <div className="mt-20 grid gap-y-14 md:mt-32 md:grid-cols-12 md:gap-x-8">
          {shots.map((s, i) => (
            <figure key={s.brand} className={s.cls}>
              <div data-shot className={`overflow-hidden ${s.ratio}`}>
                <div data-par className="h-full w-full">
                  <Photo
                    src={`/images/${s.file}`}
                    alt={`Veículo ${s.brand} no estoque da Multi Car`}
                    className="h-full w-full"
                    slot={`public/images/${s.file}`}
                    position={s.pos}
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between border-t border-ink/20 pt-3">
                <span className="display text-3xl md:text-4xl">{s.brand}</span>
                <span className="mono text-ink/50">0{i + 1} / 05</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* brand line */}
      <div className="mt-24 border-y border-ink/20 py-5 md:mt-40" aria-label="Marcas: BYD, Citroën, Peugeot, Ford, Nissan">
        <div data-brands className="display flex w-max items-center gap-8 whitespace-nowrap text-[clamp(3rem,9vw,9rem)]" aria-hidden="true">
          {['BYD', 'Citroën', 'Peugeot', 'Ford', 'Nissan', 'BYD', 'Citroën', 'Peugeot', 'Ford', 'Nissan'].map((b, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>{b}</span>
              <span className="text-ember">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
