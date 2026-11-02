import { brands } from '../../config/site'

/** Faixa diagonal com as marcas, em movimento contínuo. */
export function Ticker() {
  const row = [...brands, ...brands, ...brands]
  return (
    <div className="relative z-10 -my-3 -rotate-1 overflow-hidden bg-brand py-3 text-black" role="presentation">
      <div className="marquee-track" aria-hidden="true">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((b, i) => (
              <span key={i} className="flex items-center font-display text-3xl tracking-wide sm:text-5xl">
                <span className="px-6 sm:px-10">{b}</span><span className="text-2xl opacity-60">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">Marcas: {brands.join(', ')}</span>
    </div>
  )
}
