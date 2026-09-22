import { Quote } from "lucide-react";
import Reveal from "./ui/Reveal";

export default function Testimonials() {
  return (
    <section className="relative bg-ink-950 py-24 lg:py-32">
      <div className="container-px mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            QUEM USA, <span className="text-gradient-red">SENTE A DIFERENÇA</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="group flex h-full flex-col gap-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/[0.04]">
                <Quote
                  size={22}
                  className="text-red-500/40 transition-transform duration-300 group-hover:scale-110 group-hover:text-red-500/70"
                />
                <p className="text-sm italic leading-relaxed text-ink-300">
                  "Adicione aqui um depoimento real de cliente."
                </p>
                <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-ink-400">
                    ?
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-ink-300">Nome do cliente</p>
                    <p className="text-[11px] text-ink-500">A substituir</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
