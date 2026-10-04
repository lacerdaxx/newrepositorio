"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { MapPinned, Megaphone, Clapperboard } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import { Reveal } from "./ui/Reveal";

const steps = [
  {
    n: "01",
    icon: MapPinned,
    title: "Google Meu Negócio organizado",
    text: "Seu perfil vira prova social: fotos de obras, serviços, área atendida e mais reviews.",
    img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=70",
    alt: "Casa americana com jardim na frente",
  },
  {
    n: "02",
    icon: Megaphone,
    title: "Anúncios no Meta nas regiões certas",
    text: "Campanhas em inglês para donos de casa nos bairros de maior renda, com formulário que filtra curioso.",
    img: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=70",
    alt: "Cozinha reformada com acabamento moderno",
  },
  {
    n: "03",
    icon: Clapperboard,
    title: "Roteiros de vídeo",
    text: "Você grava no celular, na obra. A gente edita e transforma em anúncio.",
    img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=70",
    alt: "Pintor aplicando tinta na parede com rolo",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="como-funciona" className="section scroll-mt-16">
      <div className="container-site">
        <SectionHeading
          tag="Como funciona"
          title={
            <>
              Um sistema simples para <span className="text-gold">vender direto ao cliente final</span>
            </>
          }
        />

        <ol ref={ref} className="relative mt-14 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-8">
          {/* Linha conectora — vertical no mobile */}
          <svg aria-hidden className="absolute left-[23px] top-6 h-[calc(100%-48px)] w-[2px] md:hidden" preserveAspectRatio="none" viewBox="0 0 2 100">
            <line x1="1" y1="0" x2="1" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            <motion.line x1="1" y1="0" x2="1" y2="100" stroke="url(#lg-v)" strokeWidth="2" style={{ pathLength: progress }} />
            <defs>
              <linearGradient id="lg-v" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#E5E5E5" />
                <stop offset="1" stopColor="#F7B52C" />
              </linearGradient>
            </defs>
          </svg>
          {/* Linha conectora — horizontal no desktop */}
          <div aria-hidden className="absolute left-[24px] right-[calc((100%-64px)/3-24px)] top-[23px] hidden h-[2px] md:block">
          <svg className="block h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 2">
            <line x1="0" y1="1" x2="100" y2="1" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            <motion.line x1="0" y1="1" x2="100" y2="1" stroke="url(#lg-h)" strokeWidth="2" style={{ pathLength: progress }} />
            <defs>
              <linearGradient id="lg-h" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#E5E5E5" />
                <stop offset="1" stopColor="#F7B52C" />
              </linearGradient>
            </defs>
          </svg>
          </div>

          {steps.map(({ n, icon: Icon, title, text, img, alt }, i) => (
            <li key={n} className="relative pl-16 md:pl-0">
              <Reveal delay={i * 0.12}>
                <span className="absolute left-0 top-0 z-10 grid h-12 w-12 place-items-center rounded-full border border-gold/50 bg-[#0A0A0A] font-display text-sm font-extrabold text-gold shadow-[0_0_0_6px_#0A0A0A] md:relative">
                  {n}
                </span>
                <div className="mt-0 md:mt-8">
                  <div className="flex items-center gap-3">
                    <Icon aria-hidden className="h-5 w-5 text-silver" />
                    <h3 className="font-display text-xl font-extrabold tracking-[-0.02em] text-ink md:text-2xl">{title}</h3>
                  </div>
                  <p className="mt-3 leading-relaxed text-muted">{text}</p>
                  <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#1A1A1A] to-[#111]">
                    <Image src={img} alt={alt} fill sizes="(min-width: 768px) 380px, 90vw" className="object-cover opacity-90 transition-transform duration-700 hover:scale-105" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
