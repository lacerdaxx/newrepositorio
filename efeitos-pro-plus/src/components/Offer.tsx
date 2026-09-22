import { ArrowRight, CreditCard, Lock, Zap } from "lucide-react";
import { PRICE, PURCHASE_URL } from "../config";
import Reveal from "./ui/Reveal";

export default function Offer() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gold-500/15 blur-[150px]" />

      <div className="container-px relative mx-auto max-w-3xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            COMECE A EDITAR <span className="text-gradient-gold">COMO UM PRO</span>.
          </h2>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-gold-500/25 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-8 shadow-gold backdrop-blur sm:p-10">
            <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-gold-500/20 blur-3xl" />

            <div className="relative flex items-center justify-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950">
                <Zap size={16} fill="currentColor" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                EFEITOS <span className="text-gradient-gold">PRO+</span>
              </span>
            </div>

            <div className="relative mt-8 text-center">
              <span className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                {PRICE.current}
              </span>
              <p className="mt-2 text-sm font-medium text-ink-300">Pagamento único</p>
            </div>

            <a href={PURCHASE_URL} className="btn-primary relative mt-8 w-full !py-4 !text-sm">
              Quero acessar agora
              <ArrowRight size={16} />
            </a>

            <div className="relative mt-7 flex flex-col gap-2.5 border-t border-white/10 pt-6 text-xs text-ink-300">
              <div className="flex items-center gap-2">
                <Lock size={13} className="text-gold-400" /> Compra segura
              </div>
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-gold-400" /> Acesso imediato
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={13} className="text-gold-400" /> Pagamento protegido
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
