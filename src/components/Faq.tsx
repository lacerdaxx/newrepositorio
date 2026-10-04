"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import SectionHeading from "./ui/SectionHeading";
import { RevealGroup, RevealItem } from "./ui/Reveal";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

const faqs = [
  {
    q: "Vocês atendem em português?",
    a: "Sim. Atendimento, reuniões e relatórios em português. Os anúncios são em inglês, porque falam com o dono da casa americano.",
  },
  {
    q: "Quanto preciso investir em anúncios?",
    a: "Recomendamos a partir de US$ 1.500/mês, pagos direto ao Facebook no seu cartão. Esse valor não passa por nós.",
  },
  {
    q: "Em quanto tempo vejo resultado?",
    a: "Os primeiros pedidos de orçamento costumam chegar nas primeiras semanas após o lançamento. Resultado consistente em 60 a 90 dias.",
  },
  {
    q: "Tem fidelidade?",
    a: "Contrato mínimo de 3 meses, que é o tempo para otimizar. Depois, cancelamento com 30 dias de aviso.",
  },
  {
    q: "Preciso falar inglês?",
    a: "Não para trabalhar com a gente. Para atender os leads, ajuda; passamos scripts prontos.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section className="section">
      <div className="container-site">
        <SectionHeading tag="Perguntas frequentes" title={<>Ficou alguma <span className="text-gold">dúvida?</span></>} />
        <RevealGroup as="ul" gap={0.06} className="mx-auto mt-12 max-w-3xl space-y-3 md:mt-16">
          {faqs.map(({ q, a }, i) => {
            const isOpen = open === i;
            const btnId = `${base}-b${i}`;
            const panelId = `${base}-p${i}`;
            return (
              <RevealItem
                as="li"
                key={q}
                className={cn(
                  "glass overflow-hidden rounded-2xl transition-colors",
                  isOpen ? "border-gold/40 bg-white/[0.05]" : "hover:border-white/20",
                )}
              >
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-[64px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-ink focus-visible:outline-offset-[-2px] md:px-7 md:text-lg"
                  >
                    {q}
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors",
                        isOpen ? "border-gold bg-gold text-[#140d00]" : "border-white/15 text-silver",
                      )}
                    >
                      <Plus aria-hidden className="h-4 w-4" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <p className="px-5 pb-6 leading-relaxed text-muted md:px-7">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
