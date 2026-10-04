"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Megaphone, MapPinned, Clapperboard, MessageSquareReply } from "lucide-react";
import Instagram from "./ui/InstagramIcon";
import Tag from "./ui/Tag";
import { Reveal } from "./ui/Reveal";

const steps = [
  {
    n: "01",
    icon: Megaphone,
    title: "Tráfego pago",
    pain: "Dependo de indicação.",
    text: "Anúncios em inglês no Facebook e Instagram, mostrados só para proprietários dos bairros de maior renda da sua região. Pedidos de orçamento chegando toda semana, sem esperar ninguém te indicar.",
  },
  {
    n: "02",
    icon: MapPinned,
    title: "Google Meu Negócio",
    pain: "O cliente pesquisa e não confia.",
    text: "O americano pesquisa sua empresa antes de deixar você entrar na casa dele. Deixamos seu perfil impecável, com fotos de obras reais, serviços, área atendida e mais reviews. Quem pesquisa, confia. Quem confia, liga.",
  },
  {
    n: "03",
    icon: Instagram,
    title: "Instagram organizado",
    pain: "Meu perfil está abandonado.",
    text: "Perfil em inglês, destaques com seus melhores projetos e posts toda semana. Quem vê seu anúncio e entra no seu perfil encontra uma empresa séria, e não uma página parada há meses.",
  },
  {
    n: "04",
    icon: Clapperboard,
    title: "Roteiros e criativos",
    pain: "Não sei o que gravar.",
    text: "Você recebe roteiros prontos, grava no celular durante a obra em poucos minutos, e a gente edita e transforma em anúncio. Nada vende mais reforma do que o antes e depois do seu próprio trabalho.",
  },
  {
    n: "05",
    icon: MessageSquareReply,
    title: "Pré-vendas",
    pain: "Não consigo atender todo mundo.",
    text: "Cada novo cliente recebe uma mensagem da sua empresa em segundos. Você recebe tudo no seu WhatsApp, e o sistema faz o follow-up por você. Scripts prontos em inglês para agendar a visita, mesmo com inglês básico.",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="como-funciona" className="section scroll-mt-16">
      <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-32">
            <Tag align="left">Como funciona</Tag>
            <h2 className="h-section mt-5 text-balance">
              Cinco frentes trabalhando juntas <span className="text-gold">enquanto você está na obra</span>
            </h2>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted md:text-lg">
              Cada uma resolve um problema que hoje trava o crescimento da sua empresa.
            </p>
          </Reveal>
        </div>

        <ol ref={ref} className="relative space-y-6 lg:col-span-7 md:space-y-8">
          {/* Linha conectora que se desenha com o scroll */}
          <svg aria-hidden className="absolute left-[23px] top-6 h-[calc(100%-48px)] w-[2px]" preserveAspectRatio="none" viewBox="0 0 2 100">
            <line x1="1" y1="0" x2="1" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            <motion.line x1="1" y1="0" x2="1" y2="100" stroke="url(#lg-v)" strokeWidth="2" style={{ pathLength: progress }} />
            <defs>
              <linearGradient id="lg-v" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#E5E5E5" />
                <stop offset="1" stopColor="#F7B52C" />
              </linearGradient>
            </defs>
          </svg>

          {steps.map(({ n, icon: Icon, title, pain, text }) => (
            <li key={n} className="relative pl-16 md:pl-20">
              <Reveal>
                <span className="absolute left-0 top-0 z-10 grid h-12 w-12 place-items-center rounded-full border border-gold/50 bg-[#0A0A0A] font-display text-sm font-extrabold text-gold shadow-[0_0_0_6px_#0A0A0A]">
                  {n}
                </span>
                <div className="glass rounded-2xl p-6 transition-colors hover:border-gold/40 md:p-7">
                  <div className="flex items-center gap-3">
                    <Icon aria-hidden className="h-5 w-5 shrink-0 text-silver" />
                    <h3 className="font-display text-xl font-extrabold tracking-[-0.02em] text-ink md:text-2xl">{title}</h3>
                  </div>
                  <p className="mt-3 inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                    Resolve: “{pain}”
                  </p>
                  <p className="mt-4 leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
