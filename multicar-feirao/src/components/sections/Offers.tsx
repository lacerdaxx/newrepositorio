import { Text3D } from '../ui/Text3D'

/** Três ofertas em composições editoriais diferentes (não é grade de cards). */
export function Offers() {
  return (
    <section id="ofertas" aria-labelledby="ofertas-titulo" className="relative overflow-hidden bg-ink px-4 py-20 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1500px]">
        <h2 id="ofertas-titulo" className="mb-16 max-w-5xl text-[clamp(2.4rem,8vw,6.5rem)] leading-[0.9]" data-reveal>
          <Text3D text="CONDIÇÕES QUE VOCÊ NÃO PODE PERDER" variant="white" onView />
        </h2>

        {/* 01 */}
        <article className="relative border-t border-white/15 py-10 sm:py-16" data-reveal>
          <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-cond text-[clamp(1.4rem,3.5vw,2.6rem)] font-extrabold tracking-[0.08em] text-white">12 PRIMEIRAS PARCELAS</p>
              <p className="font-cond text-sm font-bold tracking-[0.4em] text-brand sm:text-lg">POR APENAS</p>
              <p className="mt-2 text-[clamp(4rem,19vw,17rem)] leading-[0.9]"><Text3D text="R$ 299,99" variant="orange" onView sweep /></p>
            </div>
            <p className="inline-block -skew-x-12 self-start bg-white px-4 py-2 font-cond text-base font-extrabold tracking-[0.15em] text-black md:self-end sm:text-xl">
              <span className="inline-block skew-x-12">PELO BANCO VOLKSWAGEN</span>
            </p>
          </div>
        </article>

        {/* 02 */}
        <article className="relative border-t border-white/15 py-10 sm:py-16 md:text-right" data-reveal>
          <p className="font-cond text-[clamp(1.4rem,3.5vw,2.6rem)] font-extrabold tracking-[0.08em] text-brand">BÔNUS DE</p>
          <p className="text-[clamp(4rem,19vw,17rem)] leading-[0.9]"><Text3D text="R$ 5.000" variant="chrome" onView /></p>
          <p className="mt-2 font-cond text-[clamp(1.2rem,3vw,2.2rem)] font-extrabold tracking-[0.12em] text-white">NO SEU USADO NA TROCA</p>
        </article>

        {/* 03 */}
        <article className="relative -mx-4 overflow-hidden border-t border-white/15 bg-brand px-4 py-12 text-black sm:-mx-8 sm:px-8 sm:py-20" data-reveal>
          <div className="mx-auto max-w-[1500px]">
            <p className="font-cond text-[clamp(1.4rem,3.5vw,2.6rem)] font-extrabold tracking-[0.3em]">PRIMEIRA PARCELA</p>
            <p className="text-[clamp(3.2rem,13vw,12rem)] leading-[0.88]"><Text3D text="SÓ DEPOIS DO CARNAVAL" variant="black" onView /></p>
          </div>
        </article>
      </div>
    </section>
  )
}
