"use client";

import { motion, useReducedMotion } from "framer-motion";
import Button from "./ui/Button";
import GrowthBars from "./ui/GrowthBars";
import { Reveal } from "./ui/Reveal";

export default function FinalCta() {
  const reduce = useReducedMotion();
  return (
    <section className="section">
      <div className="container-site">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#111] px-6 py-16 text-center sm:px-10 md:py-24">
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[720px] md:w-[720px]"
            style={{ background: "radial-gradient(closest-side, rgba(247,181,44,0.28), rgba(242,154,30,0.08) 50%, transparent)" }}
            animate={reduce ? undefined : { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 mx-auto h-[75%] max-w-4xl opacity-[0.14]">
            <GrowthBars bars={9} trigger="view" className="h-full w-full" />
          </div>
          <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[#111] to-transparent" />
          <Reveal>
            <h2 className="font-display mx-auto max-w-3xl text-balance text-[34px] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink sm:text-5xl md:text-6xl">
              Pronto para parar de <span className="text-gold">depender de indicação?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted md:text-lg">
              Faça o diagnóstico gratuito e veja quantos orçamentos sua empresa pode gerar por mês.
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="#diagnostico" arrow className="w-full sm:w-auto">
                Quero meu diagnóstico gratuito
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
