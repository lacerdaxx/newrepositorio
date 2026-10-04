"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { BellRing, Kanban, MessageSquareText, Repeat2, ScrollText, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Tag from "./ui/Tag";
import WhatsAppIcon from "./ui/WhatsAppIcon";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { EASE } from "@/lib/motion";

const items = [
  { icon: MessageSquareText, title: "Resposta em segundos", text: "SMS automático da sua empresa assim que o cliente pede orçamento." },
  { icon: Smartphone, title: "Lead no seu WhatsApp", text: "Nome, telefone, serviço, ZIP e prazo, na hora." },
  { icon: Repeat2, title: "Follow-up automático", text: "Quem não respondeu recebe mensagens por 7 dias." },
  { icon: ScrollText, title: "Scripts em inglês", text: "Você sabe exatamente o que falar para agendar a visita." },
  { icon: Kanban, title: "Funil organizado", text: "Cada cliente numa etapa, sem perder ninguém." },
];

export default function PreSales() {
  return (
    <section className="section overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/4 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(247,181,44,0.12),transparent)]" />
      <div className="container-site relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
        <div className="lg:col-span-7 lg:row-start-1">
          <Reveal>
            <Tag align="left">O que ninguém te entrega</Tag>
            <h2 className="h-section mt-5 text-balance">
              O cliente pede orçamento para 3 empresas. <span className="text-gold">Fecha com quem responde primeiro.</span>
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted md:text-lg">
              A maioria das agências entrega o lead e some. A BuildScale garante que nenhum pedido de orçamento fique sem resposta, mesmo
              quando você está em cima de um telhado.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
          <LeadPhone />
        </div>
        <div className="lg:col-span-7 lg:row-start-2">
          <RevealGroup as="ul" gap={0.07} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-10">
            {items.map(({ icon: Icon, title, text }, i) => (
              <RevealItem
                as="li"
                key={title}
                className={`glass flex gap-4 rounded-xl p-4 transition-colors hover:border-gold/40 md:p-5 ${i === items.length - 1 ? "sm:col-span-2" : ""}`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold/10 ring-1 ring-gold/30">
                  <Icon aria-hidden className="h-5 w-5 text-gold" />
                </span>
                <div>
                  <p className="font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

/** Celular que encena: pedido chega → SMS sai em segundos → lead cai no WhatsApp do dono. */
function LeadPhone() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(reduce ? 4 : 0);

  useEffect(() => {
    if (reduce) {
      setStage(4);
      return;
    }
    if (!inView) return;
    // 0 vazio · 1 pedido · 2 digitando · 3 SMS enviado · 4 WhatsApp do dono
    const timeline = [600, 1500, 2700, 4000];
    let timers: number[] = [];
    const run = () => {
      setStage(0);
      timers = timeline.map((t, i) => window.setTimeout(() => setStage(i + 1), t));
      timers.push(window.setTimeout(run, 9500));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce]);

  const pop = { initial: { opacity: 0, y: -16, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0 }, transition: { duration: 0.45, ease: EASE } };

  return (
    <div ref={ref} className="relative mx-auto w-[min(84vw,320px)]" aria-label="Exemplo: o cliente pede orçamento, recebe um SMS da sua empresa em segundos e o lead chega no seu WhatsApp" role="img">
      <div aria-hidden className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(247,181,44,0.22),transparent)] blur-2xl" />
      <div className="relative rounded-[2.6rem] border border-white/15 bg-gradient-to-b from-[#2a2a2a] to-[#111] p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
        <div className="relative flex aspect-[9/18.5] flex-col overflow-hidden rounded-[2.1rem] bg-[linear-gradient(160deg,#1d1a14,#0d0d0d_55%)] px-3.5 pb-4 pt-3">
          <div className="flex items-center justify-between px-2 text-[11px] font-semibold text-ink">
            <span>9:41</span>
            <span className="h-5 w-20 rounded-full bg-black" />
            <span className="tabular-nums">5G</span>
          </div>
          <p className="mt-6 text-center font-display text-5xl font-extrabold tracking-[-0.03em] text-ink/90">9:41</p>
          <p className="text-center text-xs text-muted">Today</p>

          <div className="mt-6 flex flex-1 flex-col gap-2.5">
            <AnimatePresence>
              {stage >= 1 && (
                <motion.div key="req" {...pop} className="rounded-2xl border border-white/10 bg-white/[0.08] p-3 backdrop-blur">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    <span className="grid h-4 w-4 place-items-center rounded bg-gold">
                      <BellRing className="h-2.5 w-2.5 text-[#140d00]" />
                    </span>
                    Lead form · now
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-ink">New estimate request</p>
                  <p className="text-xs text-muted">John D. · Kitchen remodel · ZIP 02118</p>
                </motion.div>
              )}
              {stage >= 2 && (
                <motion.div key="sms" {...pop} className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">SMS · XYZ Remodeling → John</p>
                  {stage === 2 ? (
                    <div className="mt-2 inline-flex gap-1 rounded-2xl rounded-br-sm bg-[#2b6cf6]/80 px-3 py-2.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-white"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 rounded-2xl rounded-br-sm bg-[#2b6cf6] px-3 py-2 text-[13px] leading-snug text-white"
                    >
                      Hi John! This is Carlos from XYZ Remodeling. Got your request. When&apos;s a good time to talk?
                    </motion.p>
                  )}
                  <p className="mt-1 text-right text-[10px] text-muted">{stage >= 3 ? "Delivered · 4s after request" : "Sending…"}</p>
                </motion.div>
              )}
              {stage >= 4 && (
                <motion.div key="wa" {...pop} className="rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 p-3">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#5be38f]">
                    <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp · BuildScale
                  </div>
                  <p className="mt-1.5 text-[13px] font-medium leading-snug text-ink">🔔 Novo lead: John, Kitchen remodel, ZIP 02118</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
