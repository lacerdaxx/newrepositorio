export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-10">
        <p className="display text-5xl md:text-7xl">MULTI<span className="text-ember">/</span>CAR</p>
        <p className="mono text-steel">Multi Car Veículos · Luziânia — GO<br />Mega Feirão de Aniversário · 13—14—15 Novembro</p>
        <a href="#top" className="mono text-bone transition-colors hover:text-ember">Voltar ao topo ↑</a>
      </div>
    </footer>
  )
}
