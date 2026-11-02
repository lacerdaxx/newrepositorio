import { Text3D } from '../ui/Text3D'
import { CtaButton } from '../ui/CtaButton'
import { Logo } from '../ui/Logo'
import { CarSilhouette } from '../ui/CarSilhouette'

export function FinalCta() {
  return (
    <section aria-labelledby="final-titulo" className="relative isolate overflow-hidden px-4 py-24 text-center sm:px-6 sm:py-36">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0" data-depth-bg style={{ background: 'radial-gradient(70% 60% at 50% 100%, rgba(255,106,0,.4), transparent 70%), #050505' }} />
        <div className="carbon absolute inset-0 opacity-30" />
        <CarSilhouette className="absolute bottom-6 left-1/2 w-[130%] max-w-[1100px] -translate-x-1/2 opacity-25 drop-shadow-[0_0_50px_rgba(255,106,0,.6)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      </div>
      <div className="mx-auto max-w-4xl" data-reveal>
        <Logo className="mb-8 scale-125" />
        <h2 id="final-titulo" className="text-[clamp(1.7rem,6.5vw,4rem)]"><Text3D text="LUZIÂNIA, ESSA É A SUA OPORTUNIDADE!" variant="orange" onView sweep /></h2>
        <p className="mx-auto mt-6 max-w-2xl font-display text-xs font-bold leading-relaxed tracking-[0.15em] text-white sm:text-sm">
          13, 14 E 15 DE NOVEMBRO. O MEGA FEIRÃO DE ANIVERSÁRIO DA MULTI CAR VEÍCULOS ESPERA POR VOCÊ.
        </p>
        <div className="mt-9"><CtaButton>QUERO PARTICIPAR DO FEIRÃO</CtaButton></div>
      </div>
    </section>
  )
}
