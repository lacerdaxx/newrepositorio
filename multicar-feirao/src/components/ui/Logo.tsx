import { site } from '../../config/site'

/**
 * Logo placeholder. Para usar o logotipo oficial, coloque o arquivo em
 * /public/logo-multicar.svg (ou .png) e defina LOGO_SRC abaixo.
 */
const LOGO_SRC = '' // ex.: '/logo-multicar.svg'

export function Logo({ className = '' }: { className?: string }) {
  if (LOGO_SRC) return <img src={LOGO_SRC} alt={site.brand} className={`h-10 w-auto ${className}`} />
  return (
    <span className={`inline-flex items-center gap-2 font-display font-black tracking-widest ${className}`} aria-label={site.brand}>
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M8 46 L20 18 L32 38 L44 18 L56 46" fill="none" stroke="#FF6A00" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <span className="leading-none">
        <span className="block text-base text-white">MULTI CAR</span>
        <span className="block text-[0.55rem] tracking-[0.35em] text-brand">VEÍCULOS</span>
      </span>
    </span>
  )
}
