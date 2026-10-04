"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import SectionHeading from "./ui/SectionHeading";
import { Reveal } from "./ui/Reveal";
import { EASE } from "@/lib/motion";

const flow = [
  { value: 2000, prefix: "US$ ", label: "em anúncios" },
  { value: 33, label: "pedidos de orçamento" },
  { value: 13, label: "visitas" },
  { value: 3, label: "obras fechadas" },
  { value: 24000, prefix: "US$ ", label: "em vendas", highlight: true },
];

const fmt = (n: number) => Math.round(n).toLocaleString("pt-BR");

function Counter({ to, prefix = "", start }: { to: number; prefix?: string; start: boolean }) {
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!start) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: setVal });
    return () => controls.stop();
  }, [start, to, reduce]);

  return (
    <span className="tabular-nums">
      {prefix}
      {fmt(val)}
    </span>
  );
}

export default function TheMath() {
  const ref = useRef<HTMLDivElement>(null);
  const isIn = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="section">
      <div className="container-site">
        <SectionHeading
          tag="Faça a conta"
          title={
            <>
              Quanto vale <span className="text-gold">uma obra a mais por semana?</span>
            </>
          }
        />
        <Reveal className="mt-12 md:mt-16">
          <div ref={ref} className="gold-border relative overflow-hidden rounded-3xl p-6 shadow-[0_30px_100px_-40px_rgba(247,181,44,0.35)] sm:p-8 md:p-12">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(247,181,44,0.18),transparent)]" />
            <ol className="relative flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
              {flow.map((s, i) => (
                <Fragment key={s.label}>
                  <motion.li
                    initial={{ opacity: 0, y: 16 }}
                    animate={isIn ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.6, delay: i * 0.15, ease: EASE }}
                    className={
                      s.highlight
                        ? "rounded-2xl border border-gold/40 bg-gold/[0.07] px-5 py-4 text-center lg:px-6"
                        : "rounded-2xl px-5 py-3 text-center lg:px-2"
                    }
                  >
                    <p
                      className={`font-display whitespace-nowrap font-extrabold leading-none tracking-[-0.03em] ${
                        s.highlight ? "text-gold text-[34px] sm:text-5xl lg:text-[38px] xl:text-[44px]" : "text-ink text-[32px] sm:text-[40px] lg:text-[30px] xl:text-[36px]"
                      }`}
                    >
                      <Counter to={s.value} prefix={s.prefix} start={isIn} />
                    </p>
                    <p className="mx-auto mt-2 max-w-[11rem] text-balance text-sm font-medium uppercase tracking-[0.14em] text-muted lg:text-xs">{s.label}</p>
                  </motion.li>
                  {i < flow.length - 1 && (
                    <motion.li
                      aria-hidden
                      initial={{ opacity: 0 }}
                      animate={isIn ? { opacity: 1 } : undefined}
                      transition={{ duration: 0.5, delay: i * 0.15 + 0.1 }}
                      className="flex justify-center text-gold/70"
                    >
                      <ChevronRight className="h-6 w-6 rotate-90 lg:rotate-0" />
                    </motion.li>
                  )}
                </Fragment>
              ))}
            </ol>
            <div className="relative mt-8 border-t border-white/[0.08] pt-6 text-center">
              <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-ink md:text-lg">
                Com um ticket médio de US$ 8 mil, <span className="text-gold">uma única obra já paga o investimento do mês.</span> O resto é
                lucro e agenda cheia.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Exemplo ilustrativo. Os números variam conforme serviço, região e velocidade de atendimento.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
