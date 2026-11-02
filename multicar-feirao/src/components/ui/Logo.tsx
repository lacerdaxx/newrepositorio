import { site } from '../../config/site'

/** Logo provisório. Para o oficial: coloque em /public e defina LOGO_SRC (ex.: '/logo-multicar.svg'). */
const LOGO_SRC = ''

export function Logo({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  if (LOGO_SRC) return <img src={LOGO_SRC} alt={site.brand} className={`h-10 w-auto ${className}`} />
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label={site.brand}>
      <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M8 48 L20 16 L32 38 L44 16 L56 48" fill="none" stroke={dark ? '#000' : '#FF6A00'} strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <span className="font-display leading-none tracking-wider">
        <span className="block text-xl">MULTI CAR</span>
        <span className={`block font-cond text-[0.7rem] font-bold tracking-[0.5em] ${dark ? 'text-black' : 'text-brand'}`}>VEÍCULOS</span>
      </span>
    </span>
  )
}
