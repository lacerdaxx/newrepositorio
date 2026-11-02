/** Fundo atmosférico reutilizável: carbono + luzes laranja. */
export function Backdrop({ variant = 'default' }: { variant?: 'default' | 'warm' }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="carbon absolute inset-0 opacity-40" />
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === 'warm'
              ? 'radial-gradient(60% 50% at 50% 100%, rgba(255,106,0,.28), transparent 70%), linear-gradient(#050505, #0b0603)'
              : 'radial-gradient(50% 40% at 85% 0%, rgba(255,106,0,.16), transparent 70%), radial-gradient(40% 40% at 0% 100%, rgba(255,138,0,.10), transparent 70%)',
        }}
      />
    </div>
  )
}
