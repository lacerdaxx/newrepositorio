import { useCountdown } from '../../hooks/useCountdown'

function Unit({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <span className="t3d-letter t3d-orange font-display text-[clamp(3.2rem,15vw,10rem)] leading-none tabular-nums" data-t={v} aria-hidden="true">
        <span className="t3d-face">{v}</span>
      </span>
      <span className="sr-only">{value}</span>
      <span className="mt-3 font-cond text-[0.7rem] font-extrabold tracking-[0.35em] text-steel sm:text-sm">{label}</span>
    </div>
  )
}

export function Countdown() {
  const c = useCountdown()
  return (
    <section aria-labelledby="contador-titulo" className="relative overflow-hidden bg-coal px-4 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
      <div className="carbon absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1500px]" data-reveal>
        {c.phase === 'before' && (
          <>
            <h2 id="contador-titulo" className="mb-8 font-cond text-sm font-extrabold tracking-[0.45em] text-brand sm:text-lg">// O FEIRÃO COMEÇA EM</h2>
            <div className="flex items-start justify-between gap-1 sm:justify-start sm:gap-10" role="timer" aria-live="off">
              <Unit value={c.d} label="DIAS" /><span className="font-display text-[clamp(2.5rem,10vw,7rem)] leading-[1.15] text-white/20" aria-hidden="true">:</span>
              <Unit value={c.h} label="HORAS" /><span className="font-display text-[clamp(2.5rem,10vw,7rem)] leading-[1.15] text-white/20" aria-hidden="true">:</span>
              <Unit value={c.m} label="MINUTOS" /><span className="font-display text-[clamp(2.5rem,10vw,7rem)] leading-[1.15] text-white/20" aria-hidden="true">:</span>
              <Unit value={c.s} label="SEGUNDOS" />
            </div>
          </>
        )}
        {c.phase === 'live' && (
          <h2 id="contador-titulo" className="font-display text-[clamp(2.8rem,11vw,9rem)] leading-[0.9] text-brand">COMEÇOU O MEGA FEIRÃO!</h2>
        )}
        {c.phase === 'ended' && (
          <h2 id="contador-titulo" className="font-display text-[clamp(2rem,6vw,4rem)] leading-none text-steel">O MEGA FEIRÃO FOI ENCERRADO. OBRIGADO, LUZIÂNIA!</h2>
        )}
      </div>
    </section>
  )
}
