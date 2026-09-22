import { Gift } from "lucide-react";
import Reveal from "./ui/Reveal";

// Cards de bônus editáveis. Ajuste título/descrição ou remova o card
// caso o bônus não esteja disponível na oferta atual.
const BONUSES = [
  {
    title: "Bônus #01",
    text: "Descrição editável.",
  },
  {
    title: "Bônus #02",
    text: "Descrição editável.",
  },
  {
    title: "Bônus #03",
    text: "Descrição editável.",
  },
];

export default function Bonuses() {
  return (
    <section className="relative bg-ink-900/40 py-24 lg:py-32">
      <div className="container-px mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            E AINDA TEM <span className="text-gradient-gold">MAIS</span>...
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {BONUSES.map((bonus, i) => (
            <Reveal key={bonus.title} delay={i * 100}>
              <div className="flex h-full flex-col items-start gap-3 rounded-2xl border border-dashed border-gold-500/25 bg-white/[0.02] p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
                  <Gift size={18} />
                </div>
                <h3 className="text-base font-bold text-gold-400">{bonus.title}</h3>
                <p className="text-sm leading-relaxed text-ink-300">{bonus.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
