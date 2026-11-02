import { Text3D } from '../ui/Text3D'
import { CtaButton } from '../ui/CtaButton'
import { Logo } from '../ui/Logo'

/** Momento de maior contraste da página: bloco laranja sólido com tipografia preta. */
export function FinalCta() {
  return (
    <section aria-labelledby="final-titulo" className="relative overflow-hidden bg-brand px-4 py-20 text-black sm:px-8 sm:py-32">
      <div className="absolute inset-0 opacity-[0.12]" aria-hidden="true" style={{ background: 'repeating-linear-gradient(100deg,transparent 0 38px,#000 38px 42px,transparent 42px 90px)' }} />
      <div className="relative mx-auto max-w-[1500px]" data-reveal>
        <Logo dark className="mb-10 text-black" />
        <h2 id="final-titulo" className="text-[clamp(3.2rem,12.5vw,11rem)] leading-[0.86]"><Text3D text="LUZIÂNIA, ESSA É A SUA OPORTUNIDADE!" variant="black" onView /></h2>
        <p className="mt-8 max-w-3xl font-cond text-lg font-extrabold leading-snug tracking-[0.08em] sm:text-2xl">
          13, 14 E 15 DE NOVEMBRO. O MEGA FEIRÃO DE ANIVERSÁRIO DA MULTI CAR VEÍCULOS ESPERA POR VOCÊ.
        </p>
        <div className="mt-10"><CtaButton dark>QUERO PARTICIPAR DO FEIRÃO</CtaButton></div>
      </div>
    </section>
  )
}
