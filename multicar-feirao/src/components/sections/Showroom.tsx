import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { brands, stock } from '../../config/site'
import { Text3D } from '../ui/Text3D'
import { CarSilhouette } from '../ui/CarSilhouette'

/**
 * Estoque: lista tipográfica por marca. Cada item aceita `name` e `image` reais
 * (config/site.ts → stock). Sem imagem, mostra silhueta no hover.
 */
export function Showroom() {
  const [active, setActive] = useState(0)
  const cur = stock[active]
  return (
    <section id="estoque" aria-labelledby="estoque-titulo" className="relative overflow-hidden bg-coal px-4 py-20 sm:px-8 sm:py-32">
      <div className="speed absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1500px]">
        <div className="relative" data-reveal>
          <p className="font-display text-[clamp(9rem,40vw,34rem)] leading-[0.8] outline" aria-hidden="true">+300</p>
          <h2 id="estoque-titulo" className="relative -mt-[0.12em] text-[clamp(2.4rem,9vw,7.5rem)] leading-[0.9] sm:-mt-[0.2em]">
            <span className="sr-only">Mais de 300 carros em estoque</span>
            <Text3D text="MAIS DE 300 CARROS EM ESTOQUE" variant="white" onView />
          </h2>
          <p className="mt-6 font-cond text-base font-extrabold tracking-[0.25em] text-brand sm:text-2xl">TODA LINHA ZERO KM E TAMBÉM CARROS SEMI-NOVOS</p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]" data-reveal>
          <ul className="border-t border-white/15">
            {stock.map((s, i) => (
              <li key={s.id} className="border-b border-white/15">
                <button
                  type="button" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
                  className="group flex w-full items-center justify-between gap-4 py-4 text-left sm:py-6" aria-current={active === i}
                >
                  <span className={`font-display text-[clamp(2.8rem,10vw,7.5rem)] leading-none transition-all duration-300 ${active === i ? 'text-white [text-shadow:0_0_40px_rgba(255,106,0,.7)] translate-x-3' : 'outline-w'}`}>{s.brand}</span>
                  <ArrowUpRight className={`shrink-0 transition ${active === i ? 'text-brand' : 'text-white/30'}`} size={40} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          <div className="relative hidden aspect-[4/3] self-start overflow-hidden border border-brand/40 bg-ink lg:block" aria-hidden="true">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 70% at 50% 100%, rgba(255,106,0,.4), transparent 70%)' }} />
            {cur.image
              ? <img src={cur.image} alt={cur.name ?? `Veículo ${cur.brand}`} loading="lazy" decoding="async" className="relative h-full w-full object-cover" />
              : <CarSilhouette className="absolute inset-x-[6%] bottom-[12%] w-[88%]" />}
            <p className="absolute left-4 top-4 font-cond text-xs font-extrabold tracking-[0.4em] text-brand">{cur.brand}</p>
            <p className="absolute bottom-3 right-4 font-cond text-xs font-bold tracking-[0.3em] text-steel">{cur.name ?? 'ZERO KM · SEMI-NOVOS'}</p>
            <i className="absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-brand" /><i className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-brand" />
          </div>
        </div>
        <p className="sr-only">{brands.join(', ')}</p>
      </div>
    </section>
  )
}
