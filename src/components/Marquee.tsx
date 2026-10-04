const services = ["Pintura", "Piso", "Siding", "Telhado", "Cozinha", "Banheiro", "Deck", "Basement"];

export default function Marquee() {
  return (
    <section aria-label="Serviços atendidos" className="relative border-y border-white/[0.08] bg-[#0d0d0d] py-5 md:py-6">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <ul className="flex w-max animate-marquee motion-reduce:animate-none hover:[animation-play-state:paused]">
          {[0, 1].map((k) => (
            <li key={k} aria-hidden={k === 1} className="flex shrink-0 items-center">
              {services.map((s, i) => (
                <span key={i} className="flex items-center">
                  <span className="font-display px-6 text-xl font-extrabold uppercase tracking-[0.02em] text-silver md:px-9 md:text-3xl">{s}</span>
                  <span aria-hidden className="h-2 w-2 rotate-45 bg-gold" />
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
