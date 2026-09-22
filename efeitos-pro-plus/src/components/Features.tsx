import { Zap, Clapperboard, Wand2, Sparkles, Volume2, Rocket } from "lucide-react";
import Reveal from "./ui/Reveal";

const FEATURES = [
  {
    icon: Zap,
    title: "Efeitos de Impacto",
    text: "Para destacar momentos importantes.",
  },
  {
    icon: Clapperboard,
    title: "Efeitos para Reels",
    text: "Pensados para vídeos verticais.",
  },
  {
    icon: Wand2,
    title: "Efeitos de Transição",
    text: "Para deixar cortes mais dinâmicos.",
  },
  {
    icon: Sparkles,
    title: "Efeitos Visuais",
    text: "Para dar mais personalidade aos vídeos.",
  },
  {
    icon: Volume2,
    title: "Efeitos para Áudio",
    text: "Para complementar cortes e batidas.",
  },
  {
    icon: Rocket,
    title: "Elementos para Conteúdo",
    text: "Para criar vídeos mais modernos.",
  },
];

export default function Features() {
  return (
    <section id="recebe" className="relative bg-ink-950 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container-px mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">O que você recebe</span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            UM PACK CRIADO PARA QUEM
            <br className="hidden sm:block" /> QUER EDITAR MELHOR.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 100}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/25 hover:bg-white/[0.04]">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold-500/0 blur-2xl transition-colors duration-300 group-hover:bg-gold-500/15" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-ink-900 text-gold-400">
                  <f.icon size={20} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
