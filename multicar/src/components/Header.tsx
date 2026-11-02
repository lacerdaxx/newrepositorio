import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#ofertas', label: 'Ofertas' },
  { href: '#estoque', label: 'Estoque' },
  { href: '#cadastro', label: 'Cadastro' },
]

export default function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 60)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => {
      window.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid || open ? 'bg-ink/95' : 'bg-transparent'
      }`}
    >
      <div className="gutter flex h-16 items-center justify-between">
        <a href="#topo" className="display text-2xl tracking-wide" aria-label="Multi Car Veículos — início">
          MULTI<span className="text-ember">·</span>CAR
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="mono text-bone/80 transition-colors hover:text-ember">
              {l.label}
            </a>
          ))}
          <a href="#cadastro" className="mono border border-bone/30 px-4 py-2 transition-colors hover:border-ember hover:text-ember">
            Quero aproveitar
          </a>
        </nav>
        <button
          type="button"
          className="mono flex h-11 items-center md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Fechar' : 'Menu'}
        </button>
      </div>
      {open && (
        <nav id="menu-mobile" aria-label="Principal" className="gutter flex h-[calc(100svh-4rem)] flex-col justify-center gap-6 md:hidden">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="display text-6xl">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
