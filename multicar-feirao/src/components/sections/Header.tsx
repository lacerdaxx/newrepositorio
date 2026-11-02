import { MessageCircle } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { site } from '../../config/site'
import { scrollToForm } from '../../lib/scroll'

export function Header() {
  const wa = site.contacts.whatsappNumber
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#topo" aria-label="Multi Car Veículos — início"><Logo /></a>
        <nav aria-label="Principal" className="hidden gap-8 text-xs font-semibold tracking-widest text-steel md:flex">
          <a className="hover:text-brand" href="#ofertas">OFERTAS</a>
          <a className="hover:text-brand" href="#estoque">ESTOQUE</a>
          <a className="hover:text-brand" href="#formulario">CONTATO</a>
        </nav>
        <div className="flex items-center gap-2">
          {wa && (
            <a href={`https://wa.me/${wa}`} className="hidden items-center gap-2 text-xs font-bold text-steel hover:text-white sm:flex" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </a>
          )}
          <button type="button" onClick={scrollToForm} className="rounded border border-brand/60 px-3 py-2 font-display text-[0.65rem] font-bold tracking-wider text-brand hover:bg-brand hover:text-black">
            QUERO OFERTAS
          </button>
        </div>
      </div>
    </header>
  )
}
