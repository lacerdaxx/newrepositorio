import { offers } from '../../config/site'
import { Text3D } from '../ui/Text3D'
import { Backdrop } from '../ui/Backdrop'

export function Offers() {
  return (
    <section id="ofertas" aria-labelledby="ofertas-titulo" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      <Backdrop />
      <div className="relative mx-auto max-w-6xl">
        <h2 id="ofertas-titulo" className="mb-14 text-center text-[clamp(1.5rem,5vw,3.2rem)]" data-reveal>
          <Text3D text="CONDIÇÕES QUE VOCÊ NÃO PODE PERDER" variant="chrome" onView />
        </h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {offers.map((o, i) => (
            <li key={o.id} data-reveal data-parallax={i === 1 ? '0.04' : '0'} className="glass glow-border group relative rounded-lg p-7 transition-transform duration-500 hover:-translate-y-2 hover:[transform:perspective(900px)_rotateX(4deg)_translateY(-8px)]">
              <i className="hud-corner hud-tl" /><i className="hud-corner hud-tr" /><i className="hud-corner hud-bl" /><i className="hud-corner hud-br" />
              <p className="font-display text-xs font-bold tracking-[0.25em] text-brand">0{i + 1}</p>
              <p className="mt-3 font-display text-sm font-extrabold tracking-wider text-white">{o.kicker}</p>
              {o.pre && <p className="mt-6 text-xs font-semibold tracking-[0.3em] text-steel">{o.pre}</p>}
              <p className={`${o.pre ? 'mt-1' : 'mt-8'} text-[clamp(2rem,6vw,3rem)]`}>
                <Text3D text={o.value} variant="orange" onView />
              </p>
              <p className="mt-4 text-sm font-bold tracking-widest text-steel">{o.note}</p>
              <div className="light-line mt-6 opacity-60 transition-opacity group-hover:opacity-100" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
