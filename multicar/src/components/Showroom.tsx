import Photo from './Photo'
import Extruded from './Extruded'
import { PHOTOS } from '../config'

const BRANDS = ['BYD', 'Citroën', 'Peugeot', 'Ford', 'Nissan']

function Frame({ children, className = '', caption }: { children: React.ReactNode; className?: string; caption: string }) {
  return (
    <figure className={className}>
      <div data-mask className="relative overflow-hidden bg-graphite">
        <div data-parallax className="absolute inset-[-8%]">{children}</div>
      </div>
      <figcaption className="mono mt-3 flex justify-between text-steel">{caption}</figcaption>
    </figure>
  )
}

export default function Showroom() {
  return (
    <section id="estoque" aria-labelledby="estoque-titulo" className="relative bg-ink py-24 md:py-40">
      <div className="gutter">
        <div className="mono flex items-center gap-4 text-steel" data-rise>
          <span className="text-ember">04</span>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span>Showroom</span>
        </div>

        <h2 id="estoque-titulo" className="mt-14" style={{ perspective: '1200px' }}>
          <span className="display block text-[clamp(1.6rem,4vw,3.4rem)]" data-rise>Mais de</span>
          <span data-price className="display mt-2 block text-[clamp(8rem,34vw,32rem)] leading-[0.8]">
            <Extruded tone="ember" depth={14}>300</Extruded>
          </span>
          <span className="display block text-[clamp(2.2rem,7.4vw,7rem)]" data-rise>Carros em estoque</span>
        </h2>

        <p className="mono mt-8 max-w-xl text-bone/80" data-rise>
          Toda linha zero km e também carros semi-novos
        </p>
      </div>

      {/* Grade assimétrica */}
      <div className="gutter mt-20 grid grid-cols-12 gap-x-4 gap-y-12 md:mt-32 md:gap-x-8">
        <Frame className="col-span-12 md:col-span-8" caption="Zero km">
          <Photo {...PHOTOS.zero} className="h-full w-full object-cover" />
        </Frame>
        <Frame className="col-span-8 col-start-5 md:col-span-4 md:col-start-9 md:mt-[28%]" caption="Semi-novos">
          <Photo {...PHOTOS.seminovo} className="h-full w-full object-cover" />
        </Frame>
        <Frame className="col-span-7 md:col-span-4 md:col-start-2 md:-mt-[6%]" caption="Acabamento">
          <Photo {...PHOTOS.detalhe} className="h-full w-full object-cover" />
        </Frame>
        <Frame className="col-span-12 md:col-span-12" caption="Pátio Multi Car — Luziânia">
          <Photo {...PHOTOS.panorama} className="h-full w-full object-cover" />
        </Frame>
      </div>

      {/* Marcas */}
      <div className="gutter mt-24 md:mt-40">
        <p className="mono text-steel" data-rise>Marcas</p>
        <ul className="brands mt-6 flex flex-wrap items-baseline gap-x-[0.35em] gap-y-1 text-[clamp(2.6rem,9.5vw,9rem)]" data-rise>
          {BRANDS.map((b, i) => (
            <li key={b} className="display brand flex items-baseline gap-[0.35em] text-bone">
              {b}
              {i < BRANDS.length - 1 && <span className="text-ember" aria-hidden="true">•</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
