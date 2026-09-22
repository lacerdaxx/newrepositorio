import { Play, Zap, Wand2, Music4, Sparkles } from "lucide-react";
import Reveal from "./ui/Reveal";

const CATEGORIES = [
  { icon: Zap, label: "Impacto" },
  { icon: Wand2, label: "Transições" },
  { icon: Sparkles, label: "Visuais" },
  { icon: Music4, label: "Áudio" },
];

export default function Demo() {
  return (
    <section className="relative bg-ink-900/40 py-24 lg:py-32">
      <div className="container-px mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Demonstração</span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            VEJA O <span className="text-gradient-gold">EFEITOS PRO+</span> EM AÇÃO
          </h2>
        </Reveal>

        <Reveal delay={120} className="relative mx-auto mt-12 max-w-3xl">
          {/* player placeholder — pronto para receber um vídeo real (troque por <video> ou embed) */}
          <button
            type="button"
            aria-label="Assistir à demonstração"
            className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 shadow-card"
          >
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(232,182,74,0.16),transparent_60%)]" />
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-gold-400/70 animate-pulse-glow"
                style={{
                  width: 3,
                  height: 3,
                  left: `${(i * 47) % 100}%`,
                  top: `${(i * 31) % 100}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}

            <div className="relative flex flex-col items-center gap-4">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold-400/30 bg-gold-500/15 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:bg-gold-500/25 group-hover:shadow-gold">
                <Play size={28} className="ml-1 text-gold-400" fill="currentColor" />
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-white/90">
                Assista à demonstração
              </span>
            </div>
          </button>

          {/* category cards ao redor */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.label} delay={i * 80}>
                <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] py-3.5 text-xs font-semibold text-ink-200">
                  <c.icon size={14} className="text-gold-400" />
                  {c.label}
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
