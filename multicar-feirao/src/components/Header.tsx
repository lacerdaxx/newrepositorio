import { useEffect, useState } from 'react'
import { NAV } from '../data/content'

export function Header() {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 40)
      setHidden(y > last + 6 && y > 400 ? true : y < last - 6 ? false : hiddenRef.current)
      hiddenRef.current = y > last + 6 && y > 400 ? true : y < last - 6 ? false : hiddenRef.current
      last = y
    }
    const hiddenRef = { current: false }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  return (
    <header className={`header ${solid ? 'is-solid' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
      <div className="gutter flex items-center justify-between py-4">
        <a href="#feirao" className="leading-tight" aria-label="Multi Car Veículos — Luziânia, Goiás">
          <span className="mono block text-[0.72rem] text-bone">MULTI CAR VEÍCULOS</span>
          <span className="mono block text-steel">LUZIÂNIA — GO</span>
        </a>
        <nav aria-label="Principal" className="mono hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="nav-link">{n.label}</a>
          ))}
          <a href="#cadastro" className="bg-brand px-4 py-2 text-ink transition-colors hover:bg-bone">Receber ofertas</a>
        </nav>
        <button
          className="mono relative z-[60] md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Fechar' : 'Menu'}
        </button>
      </div>
      <div
        id="menu-mobile"
        hidden={!open}
        className="fixed inset-0 z-[55] flex flex-col justify-end gap-2 bg-ink px-5 pb-12 md:hidden"
      >
        {NAV.map((n, i) => (
          <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="font-display flex items-baseline gap-4 border-b border-bone/10 py-3 text-[3.4rem] text-bone">
            <span className="mono text-brand">0{i + 1}</span>{n.label}
          </a>
        ))}
      </div>
    </header>
  )
}
