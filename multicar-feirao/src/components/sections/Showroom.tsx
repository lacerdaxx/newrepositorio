import { useRef } from 'react'
import { brands, stock, type StockItem } from '../../config/site'
import { Text3D } from '../ui/Text3D'
import { CarSilhouette } from '../ui/CarSilhouette'
import { Backdrop } from '../ui/Backdrop'

/** Card preparado para dados reais: preencha `stock` em config/site.ts (ou carregue de uma API). */
function VehicleCard({ item }: { item: StockItem }) {
  const ref = useRef<HTMLElement>(null)
  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 12}deg) translateZ(10px)`
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`)
  }
  const leave = () => { if (ref.current) ref.current.style.transform = '' }
  return (
    <article
      ref={ref} onPointerMove={move} onPointerLeave={leave}
      className="glass glow-border group relative overflow-hidden rounded-lg transition-transform duration-200 ease-out will-change-transform"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-ink">
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,106,0,.35), transparent 55%)' }} />
        {item.image ? (
          <img src={item.image} alt={item.name ?? `Veículo ${item.brand}`} loading="lazy" decoding="async" className="relative h-full w-full object-cover" data-parallax="0.03" />
        ) : (
          <CarSilhouette className="absolute inset-x-[8%] bottom-[10%] w-[84%] opacity-80 transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <div className="flex items-center justify-between p-5">
        <div>
          <p className="font-display text-lg font-black tracking-widest text-white">{item.brand}</p>
          <p className="text-xs tracking-widest text-steel">{item.name ?? 'ZERO KM E SEMI-NOVOS'}</p>
        </div>
        <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_#FF6A00]" aria-hidden="true" />
      </div>
    </article>
  )
}

export function Showroom() {
  return (
    <section id="estoque" aria-labelledby="estoque-titulo" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      <Backdrop variant="warm" />
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center" data-reveal>
          <h2 id="estoque-titulo" className="text-[clamp(1.6rem,5.5vw,3.6rem)]"><Text3D text="MAIS DE 300 CARROS EM ESTOQUE" variant="orange" onView /></h2>
          <p className="mt-5 font-display text-xs font-bold tracking-[0.25em] text-white sm:text-sm">TODA LINHA ZERO KM E TAMBÉM CARROS SEMI-NOVOS</p>
          <p className="mt-4 text-sm font-semibold tracking-[0.3em] text-brand">{brands.join(' • ')}</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
          {stock.map((s) => <VehicleCard key={s.id} item={s} />)}
        </div>
      </div>
    </section>
  )
}
