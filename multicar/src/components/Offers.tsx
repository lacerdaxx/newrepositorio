import Extruded from './Extruded'

export default function Offers() {
  return (
    <section id="ofertas" aria-labelledby="ofertas-titulo">
      <h2 id="ofertas-titulo" className="sr-only">Condições do Mega Feirão</h2>

      {/* 01 — Oferta principal */}
      <article className="gutter relative overflow-hidden bg-graphite py-24 md:py-36">
        <div className="mono flex items-center gap-4 text-steel" data-rise>
          <span className="text-ember">01</span>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span>Condição principal</span>
        </div>

        <div className="mt-14 grid items-end gap-x-10 md:grid-cols-12">
          <div className="md:col-span-5" data-rise>
            <p className="display text-[clamp(7rem,24vw,22rem)] leading-[0.8] text-ember">12</p>
          </div>
          <div className="md:col-span-7 md:pb-6" data-rise>
            <p className="display text-[clamp(2.2rem,6vw,5.5rem)]">
              Primeiras
              <br />
              parcelas
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 md:mt-0" style={{ perspective: '1200px' }}>
          <span className="display mt-[0.6em] text-[clamp(1.6rem,5vw,4.6rem)] text-bone" data-rise>R$</span>
          <p data-price className="display text-[clamp(5.6rem,25vw,24rem)] leading-[0.82] whitespace-nowrap">
            <Extruded tone="bone" depth={14}>299,99</Extruded>
          </p>
        </div>

        <div className="mt-10 flex items-center gap-6 md:ml-auto md:max-w-[58%]" data-rise>
          <span className="h-[2px] flex-1 bg-ember" aria-hidden="true" />
          <p className="mono text-sm text-bone sm:text-base">Pelo Banco Volkswagen</p>
        </div>
      </article>

      {/* 02 — Bônus */}
      <article className="relative isolate overflow-hidden py-24 text-ink md:py-36">
        <div data-wipe className="absolute inset-0 -z-10 bg-bone" />
        <div className="gutter">
          <div className="mono flex items-center gap-4 text-ink/60" data-rise>
            <span className="text-ember">02</span>
            <span className="h-px flex-1 bg-ink/15" aria-hidden="true" />
            <span>Seu usado vale mais</span>
          </div>

          <div className="mt-10 flex flex-wrap items-baseline gap-x-3" style={{ perspective: '1200px' }}>
            <span className="display text-[clamp(2.4rem,9vw,8rem)] text-ember" data-rise>R$</span>
            <p data-price data-slide className="display text-[clamp(6rem,31vw,30rem)] leading-[0.8]">
              <Extruded tone="ink" depth={12} side="#bdb8af">5.000</Extruded>
            </p>
          </div>

          <div className="mt-8 grid md:grid-cols-12">
            <p data-rise className="display text-[clamp(1.8rem,4.6vw,4rem)] md:col-span-7 md:col-start-6">
              De bônus no seu <span className="text-ember">usado</span>
              <br />
              na troca
            </p>
          </div>
        </div>
      </article>

      {/* 03 — Primeira parcela */}
      <article className="gutter relative overflow-hidden bg-ink py-24 md:py-40">
        <div className="mono flex items-center gap-4 text-steel" data-rise>
          <span className="text-ember">03</span>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span>Fôlego no orçamento</span>
        </div>

        <div className="mt-14 md:ml-[8%]" data-rise>
          <p className="display outline-text text-[clamp(3.4rem,13vw,12rem)] text-bone/80">Primeira parcela</p>
          <p className="display -mt-[0.02em] text-[clamp(3.4rem,13vw,12rem)]">
            Só depois do
            <br />
            <span className="text-ember">Carnaval</span>
          </p>
        </div>
      </article>
    </section>
  )
}
