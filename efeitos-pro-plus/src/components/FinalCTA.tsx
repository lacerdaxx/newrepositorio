import { ArrowRight } from "lucide-react";
import { PURCHASE_URL } from "../config";
import Reveal from "./ui/Reveal";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
      <div className="animate-pulse-glow pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/20 blur-[160px]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />

      <div className="container-px relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            SEUS VÍDEOS PODEM <span className="text-gradient-red">IR ALÉM</span>.
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-200">
            Tenha ferramentas visuais para deixar sua edição mais rápida, dinâmica e profissional.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <a href={PURCHASE_URL} className="btn-primary group !px-9 !py-5 !text-base">
              Quero o Efeitos PRO+
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <p className="text-xs font-medium text-ink-400">
              Acesso imediato &nbsp;•&nbsp; Pagamento seguro
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
