import { ArrowRight, Play, Sparkles, Wand2, Zap, Music4, Film } from "lucide-react";
import { PURCHASE_URL } from "../config";
import Reveal from "./ui/Reveal";
import photo from "../assets/representante.webp";

const WAVE_HEIGHTS = [30, 55, 40, 70, 45, 90, 60, 35, 75, 50, 65, 40, 80, 55, 30, 60, 45, 70, 35, 55];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink-950 pb-20 pt-28 lg:pb-28 lg:pt-36">
      {/* background grid + glow */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-red-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-red-400/10 blur-[100px]" />

      <div className="container-px relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr,0.95fr] lg:gap-10">
        {/* Copy */}
        <div>
          <Reveal>
            <span className="section-eyebrow">
              <Zap size={13} fill="currentColor" />
              Novo pack de efeitos para CapCut
            </span>
          </Reveal>

          <Reveal delay={40}>
            <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-4 backdrop-blur">
              <img
                src={photo}
                alt="Representante do Efeitos PRO+"
                className="h-8 w-8 rounded-full border border-red-400/40 object-cover shadow-red-sm"
                style={{ objectPosition: "50% 12%" }}
              />
              <span className="text-xs font-semibold text-white/90">
                Apresentado por <span className="text-red-400">Nome do representante</span>
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4rem]">
              SEUS VÍDEOS
              <br />
              MERECEM MAIS
              <br />
              <span className="relative inline-block text-gradient-red">
                IMPACTO.
                <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-red-400/0 via-red-400 to-red-400/0" />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-200">
              Tenha acesso a uma coleção de efeitos prontos para deixar seus vídeos mais
              dinâmicos, profissionais e envolventes — direto no CapCut.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col items-start gap-4">
              <a href={PURCHASE_URL} className="btn-primary group w-full sm:w-auto">
                Quero o Efeitos PRO+
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <p className="text-xs font-medium text-ink-400">
                Acesso imediato &nbsp;•&nbsp; Pagamento seguro &nbsp;•&nbsp; Use no CapCut
              </p>
            </div>
          </Reveal>
        </div>

        {/* Visual mockup */}
        <Reveal delay={200} className="relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* floating badges */}
            <div className="animate-float-slow absolute -left-4 top-6 z-20 hidden items-center gap-1.5 rounded-lg border border-red-400/30 bg-ink-900/90 px-3 py-1.5 text-[11px] font-bold text-red-400 shadow-red-sm backdrop-blur sm:flex">
              <Sparkles size={12} /> NEW
            </div>
            <div className="animate-float absolute -right-3 top-24 z-20 hidden items-center gap-1.5 rounded-lg border border-white/15 bg-ink-900/90 px-3 py-1.5 text-[11px] font-bold text-white/90 shadow-card backdrop-blur sm:flex">
              <Wand2 size={12} className="text-red-400" /> FX
            </div>
            <div className="animate-float-slow absolute -bottom-6 -left-6 z-20 hidden items-center gap-1.5 rounded-lg border border-red-400/30 bg-ink-900/90 px-3 py-1.5 text-[11px] font-bold text-red-400 shadow-red-sm backdrop-blur sm:flex">
              <Zap size={12} fill="currentColor" /> PRO
            </div>

            {/* editor window */}
            <div className="glass-card relative overflow-hidden shadow-card transition-transform duration-500 hover:-translate-y-1">
              <div className="flex items-center justify-between border-b border-white/10 bg-ink-900/60 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <span className="text-[11px] font-medium text-ink-400">editor.capcut</span>
                <span className="flex items-center gap-1 rounded-md bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">
                  PRO+
                </span>
              </div>

              {/* preview canvas */}
              <div className="relative aspect-[9/12] w-full overflow-hidden bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 sm:aspect-[9/11]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(228,25,47,0.18),transparent_55%)]" />
                {/* particles */}
                {[...Array(14)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full bg-red-400/70 animate-pulse-glow"
                    style={{
                      width: `${2 + (i % 3)}px`,
                      height: `${2 + (i % 3)}px`,
                      left: `${(i * 37) % 100}%`,
                      top: `${(i * 53) % 100}%`,
                      animationDelay: `${i * 0.25}s`,
                    }}
                  />
                ))}

                {/* central play mockup */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                    <Play size={22} className="ml-0.5 text-white" fill="white" />
                  </div>
                </div>

                {/* floating effect chips over the canvas */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg border border-white/10 bg-ink-950/70 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                  <Film size={11} className="text-red-400" /> Transição Glitch
                </div>
                <div className="absolute right-3 top-16 flex items-center gap-1.5 rounded-lg border border-white/10 bg-ink-950/70 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                  <Sparkles size={11} className="text-red-400" /> Flash Zoom
                </div>
                <div className="absolute bottom-4 left-3 flex items-center gap-1.5 rounded-lg border border-white/10 bg-ink-950/70 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                  <Music4 size={11} className="text-red-400" /> Beat Sync
                </div>
              </div>

              {/* timeline / waveform */}
              <div className="border-t border-white/10 bg-ink-900/60 px-4 py-3.5">
                <div className="flex h-9 items-end gap-[3px]">
                  {WAVE_HEIGHTS.map((h, i) => (
                    <span
                      key={i}
                      className="animate-wave w-1 rounded-full bg-gradient-to-t from-red-600 to-red-400"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.06}s`,
                        animationDuration: `${1 + (i % 3) * 0.3}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-2.5 flex gap-2">
                  {["Efeitos", "Transições", "Áudio", "Texto"].map((tab, i) => (
                    <span
                      key={tab}
                      className={`rounded-md px-2.5 py-1 text-[10px] font-semibold ${
                        i === 0
                          ? "bg-red-500/20 text-red-400"
                          : "bg-white/5 text-ink-400"
                      }`}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
