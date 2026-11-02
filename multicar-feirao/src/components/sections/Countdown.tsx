import { useCountdown } from '../../hooks/useCountdown'

function Digit({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, '0')
  return (
    <div className="glass relative flex flex-col items-center rounded-md px-3 py-4 sm:px-6 sm:py-6" style={{ perspective: 600 }}>
      <i className="hud-corner hud-tl" /><i className="hud-corner hud-br" />
      <span
        className="t3d-letter t3d-orange font-display text-[clamp(2rem,9vw,4.5rem)] font-black tabular-nums"
        data-t={v}
        style={{ transform: 'rotateX(8deg)' }}
        aria-hidden="true"
      >
        <span className="t3d-face">{v}</span>
      </span>
      <span className="sr-only">{value}</span>
      <span className="mt-2 font-display text-[0.55rem] font-bold tracking-[0.3em] text-steel sm:text-xs">{label}</span>
    </div>
  )
}

export function Countdown() {
  const c = useCountdown()
  return (
    <section aria-labelledby="contador-titulo" className="relative px-4 py-16 sm:px-6">
      <div className="light-line absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        {c.phase === 'before' && (
          <>
            <h2 id="contador-titulo" className="mb-6 font-display text-xs font-bold tracking-[0.35em] text-brand sm:text-sm">O FEIRÃO COMEÇA EM</h2>
            <div className="grid grid-cols-4 gap-2 sm:gap-4" role="timer" aria-live="off">
              <Digit value={c.d} label="DIAS" />
              <Digit value={c.h} label="HORAS" />
              <Digit value={c.m} label="MINUTOS" />
              <Digit value={c.s} label="SEGUNDOS" />
            </div>
          </>
        )}
        {c.phase === 'live' && (
          <h2 id="contador-titulo" className="font-display text-[clamp(1.6rem,6vw,3.5rem)] font-black text-brand drop-shadow-[0_0_24px_rgba(255,106,0,.7)]">COMEÇOU O MEGA FEIRÃO!</h2>
        )}
        {c.phase === 'ended' && (
          <h2 id="contador-titulo" className="font-display text-xl font-bold tracking-wider text-steel">O MEGA FEIRÃO DE ANIVERSÁRIO FOI ENCERRADO. OBRIGADO, LUZIÂNIA!</h2>
        )}
      </div>
    </section>
  )
}
