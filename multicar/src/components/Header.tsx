import { useEffect, useState } from 'react'

const links = [
  { href: '#ofertas', label: 'Ofertas' },
  { href: '#estoque', label: 'Estoque' },
  { href: '#cadastro', label: 'Cadastro' },
]

export function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 60)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid || open ? 'bg-ink/90 backdrop-blur-sm' : ''}`}
    >
      <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="flex items-baseline gap-3" aria-label="Multi Car Veículos — início">
          <span className="display text-2xl tracking-[0.02em]">
            MULTI<span className="text-ember">/</span>CAR
          </span>
          <span className="mono hidden text-steel sm:inline">Luziânia — GO</span>
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="mono text-bone/80 transition-colors hover:text-ember">
              {l.label}
            </a>
          ))}
          <a href="#cadastro" className="mono border border-ember px-4 py-2 text-ember transition-colors hover:bg-ember hover:text-ink">
            13—15 Nov
          </a>
        </nav>

        <button
          type="button"
          className="mono md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Fechar' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Principal (mobile)" className="border-t border-white/10 bg-ink px-5 pb-8 pt-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display block border-b border-white/10 py-4 text-4xl"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
