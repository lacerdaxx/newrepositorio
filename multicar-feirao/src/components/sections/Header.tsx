import { Logo } from '../ui/Logo'
import { scrollToForm } from '../../lib/scroll'

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-4 sm:px-8">
        <a href="#topo" aria-label="Multi Car Veículos — início"><Logo /></a>
        <nav aria-label="Principal" className="hidden gap-10 font-cond text-sm font-bold tracking-[0.25em] text-white/70 md:flex">
          <a className="hover:text-brand" href="#ofertas">OFERTAS</a>
          <a className="hover:text-brand" href="#estoque">ESTOQUE</a>
          <a className="hover:text-brand" href="#formulario">CONTATO</a>
        </nav>
        <button type="button" onClick={scrollToForm} className="border-b-2 border-brand pb-1 font-cond text-sm font-extrabold tracking-[0.25em] text-brand hover:text-white">
          QUERO OFERTAS
        </button>
      </div>
    </header>
  )
}
