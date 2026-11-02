export function Footer() {
  return (
    <footer className="gutter bg-ink pb-10 pt-20">
      <p className="font-display stroke-text text-[clamp(4rem,16vw,15rem)] leading-[.8]" aria-hidden="true">Multi Car</p>
      <div className="mono mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-bone/15 pt-6 text-steel">
        <span>Multi Car Veículos · Luziânia — GO</span>
        <span>© {new Date().getFullYear()} Todos os direitos reservados</span>
      </div>
    </footer>
  )
}
