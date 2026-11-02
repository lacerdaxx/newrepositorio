import { whatsappLink } from '../config'

export default function Footer() {
  const wa = whatsappLink('Olá! Quero saber mais sobre o Mega Feirão de Aniversário da Multi Car.')
  return (
    <footer className="gutter bg-ink py-14">
      <div className="flex flex-col gap-8 border-t border-white/10 pt-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="display text-4xl">MULTI<span className="text-ember">·</span>CAR</p>
          <p className="mono mt-3 text-steel">Veículos — Luziânia, GO</p>
        </div>
        <p className="mono text-bone/80">
          Mega Feirão de Aniversário <span className="text-ember">/</span> 13 — 14 — 15 Novembro
        </p>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="mono underline decoration-ember underline-offset-4 hover:text-ember">
            Falar no WhatsApp
          </a>
        )}
      </div>
    </footer>
  )
}
