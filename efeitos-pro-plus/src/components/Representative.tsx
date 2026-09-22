import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";
import { PURCHASE_URL } from "../config";
import Reveal from "./ui/Reveal";
import photo from "../assets/representante.webp";

export default function Representative() {
  return (
    <section className="relative overflow-hidden bg-ink-900/40 py-24 lg:py-32">
      <div className="animate-pulse-glow pointer-events-none absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-red-500/10 blur-[130px]" />

      <div className="container-px relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.85fr,1.15fr] lg:gap-16">
        {/* Portrait */}
        <Reveal className="relative mx-auto w-full max-w-xs lg:max-w-sm">
          <div className="animate-float-slow relative">
            <div className="pointer-events-none absolute inset-x-6 bottom-4 top-10 rounded-[2rem] bg-red-500/20 blur-3xl" />
            <img
              src={photo}
              alt="Representante do Efeitos PRO+"
              className="relative z-10 mx-auto w-full max-w-[280px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] sm:max-w-[320px]"
            />
            <span className="absolute -right-2 top-4 z-20 flex items-center gap-1.5 rounded-lg border border-red-400/30 bg-ink-900/90 px-3 py-1.5 text-[11px] font-bold text-red-400 shadow-red-sm backdrop-blur">
              <Sparkles size={12} /> Apresenta
            </span>
          </div>
        </Reveal>

        {/* Copy */}
        <div>
          <Reveal>
            <span className="section-eyebrow">
              <BadgeCheck size={13} /> Quem apresenta
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              UMA PESSOA REAL POR
              <br className="hidden sm:block" /> TRÁS DO <span className="text-gradient-red">EFEITOS PRO+</span>.
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-300">
              [Substitua este texto por uma breve apresentação: quem é, experiência com edição
              de vídeo e por que recomenda o Efeitos PRO+.]
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-red-400" />
              <div>
                <p className="text-sm font-bold text-white">Nome do representante</p>
                <p className="text-xs text-ink-400">Edite este campo com o cargo ou função</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <a href={PURCHASE_URL} className="btn-primary group mt-8 inline-flex">
              Quero o Efeitos PRO+
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
