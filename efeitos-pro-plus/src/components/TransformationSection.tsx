import { Flame, Gauge, Sparkle, Trophy } from "lucide-react";
import Reveal from "./ui/Reveal";
import BeforeAfterSlider from "./ui/BeforeAfterSlider";

const INDICATORS = [
  { icon: Flame, label: "Impacto visual" },
  { icon: Gauge, label: "Dinamismo" },
  { icon: Sparkle, label: "Retenção" },
  { icon: Trophy, label: "Profissionalismo" },
];

export default function TransformationSection() {
  return (
    <section id="como-funciona" className="relative bg-ink-900/40 py-24 lg:py-32">
      <div className="container-px mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Antes & depois</span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            DO VÍDEO COMUM AO
            <br className="hidden sm:block" /> VÍDEO <span className="text-gradient-gold">PROFISSIONAL</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-300">
            Arraste o controle para comparar. Placeholder ilustrativo — substitua pelos seus
            próprios vídeos de antes e depois.
          </p>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-12 max-w-3xl">
          <BeforeAfterSlider />
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
          {INDICATORS.map((item, i) => (
            <Reveal key={item.label} delay={i * 80}>
              <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] py-5 text-center">
                <item.icon size={18} className="text-gold-400" />
                <span className="text-xs font-semibold text-ink-200">{item.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
