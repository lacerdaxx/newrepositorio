import { Camera, MessageCircle } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { site } from '../../config/site'

export function Footer() {
  const c = site.contacts
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-steel">{site.city}</p>
          {c.address && <p className="mt-1 text-sm text-steel">{c.address}</p>}
          {c.phone && <p className="mt-1 text-sm text-steel">{c.phone}</p>}
        </div>
        <nav aria-label="Rodapé" className="flex flex-col gap-2 text-sm text-steel">
          <a className="hover:text-brand" href="#ofertas">Ofertas</a>
          <a className="hover:text-brand" href="#estoque">Estoque</a>
          <a className="hover:text-brand" href="#formulario">Fale conosco</a>
          {c.privacyUrl ? <a className="hover:text-brand" href={c.privacyUrl} target="_blank" rel="noopener noreferrer">Política de privacidade</a> : <span className="opacity-50">Política de privacidade (em breve)</span>}
        </nav>
        <div className="flex gap-3">
          {c.instagramUrl ? (
            <a href={c.instagramUrl} aria-label="Instagram da Multi Car" target="_blank" rel="noopener noreferrer" className="rounded border border-white/15 p-3 text-steel hover:border-brand hover:text-brand"><Camera size={20} /></a>
          ) : null}
          {c.whatsappNumber ? (
            <a href={`https://wa.me/${c.whatsappNumber}`} aria-label="WhatsApp da Multi Car" target="_blank" rel="noopener noreferrer" className="rounded border border-white/15 p-3 text-steel hover:border-brand hover:text-brand"><MessageCircle size={20} /></a>
          ) : null}
          {!c.instagramUrl && !c.whatsappNumber && <p className="text-xs text-steel/60">Instagram e WhatsApp: configurar em .env</p>}
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-white/5 pt-6 text-xs leading-relaxed text-steel/70">{site.legalText}</p>
    </footer>
  )
}
