import { Check } from "lucide-react";
import Reveal from "./ui/Reveal";

const BENEFITS = [
  "Efeitos prontos para usar",
  "Mais velocidade na edição",
  "Mais possibilidades criativas",
  "Visual mais profissional",
  "Fácil de utilizar",
  "Compatível com fluxo de edição no CapCut",
];

export default function Benefits() {
  return (
    <section id="beneficios" className="relative bg-ink-950 py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-[140px]" />
      <div className="container-px relative mx-auto max-w-4xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            MENOS TEMPO EDITANDO.
            <br className="hidden sm:block" /> MAIS TEMPO <span className="text-gradient-gold">CRIANDO</span>.
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-2xl gap-3 sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <Reveal key={b} delay={i * 90}>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-white/90">{b}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
