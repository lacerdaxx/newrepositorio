"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Fragment, useState } from "react";
import { Languages, Play, Receipt, ShieldCheck } from "lucide-react";
import Button from "./ui/Button";
import Tag from "./ui/Tag";
import GrowthBars from "./ui/GrowthBars";
import { siteConfig } from "@/config/site";
import { EASE } from "@/lib/motion";

const title: { w: string; gold?: boolean }[] = [
  { w: "Agenda" },
  { w: "cheia" },
  { w: "de" },
  { w: "orçamentos" },
  { w: "direto", gold: true },
  { w: "com", gold: true },
  { w: "o", gold: true },
  { w: "dono", gold: true },
  { w: "da", gold: true },
  { w: "casa", gold: true },
];

const badges = [
  { icon: Languages, label: "Atendimento em português" },
  { icon: ShieldCheck, label: "Leads exclusivos" },
  { icon: Receipt, label: "Relatório com resultado em dólar" },
];

const WORD_STAGGER = 0.05;
const afterTitle = 0.15 + title.length * WORD_STAGGER + 0.15;

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="topo" className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-40">
      {/* Glow radial pulsante */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[620px] w-[620px] -translate-x-1/2 rounded-full md:left-[38%] md:h-[820px] md:w-[820px]"
        style={{ background: "radial-gradient(closest-side, rgba(247,181,44,0.22), rgba(242,154,30,0.08) 45%, transparent 75%)" }}
        animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Grade sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.25] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* Barras crescentes ao fundo */}
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-[-8%] h-[70%] w-[80%] opacity-[0.09] md:right-[-2%] md:w-[46%] md:opacity-[0.11]">
        <GrowthBars bars={8} className="h-full w-full" delay={0.1} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

      <div className="container-site relative grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <Tag align="left" className="!tracking-[0.2em] sm:!tracking-[0.28em]">
              Para empresas de construção e reforma nos EUA
            </Tag>
          </motion.div>

          <h1 className="font-display mt-6 text-balance text-[clamp(40px,8.4vw,72px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink">
            {title.map(({ w, gold }, i) => (
              <Fragment key={i}>
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: "0.45em", filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.15 + i * WORD_STAGGER, ease: EASE }}
              >
                <span className={gold ? "text-gold" : undefined}>{w}</span>
                {i === title.length - 1 ? "." : null}
              </motion.span>
              {i < title.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: afterTitle, ease: EASE }}
          >
            Sem depender de indicação ou de contractor. A BuildScale monta o sistema completo de captação da sua empresa:{" "}
            <span className="text-ink">Google Meu Negócio, anúncios no Meta e roteiros de vídeo</span>, com atendimento em português.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: afterTitle + 0.1, ease: EASE }}
          >
            <Button href="#diagnostico" arrow className="w-full sm:w-auto">
              Quero meu diagnóstico gratuito
            </Button>
            <Button href="#como-funciona" variant="outline" className="w-full sm:w-auto">
              Ver como funciona
            </Button>
          </motion.div>

          <motion.ul
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: afterTitle + 0.2, ease: EASE }}
          >
            {badges.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm text-[#D4D4D8]">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <Icon aria-hidden className="h-4 w-4 text-silver" />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: afterTitle + 0.15, ease: EASE }}
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(siteConfig.heroVideoUrl);

  return (
    <div className="relative mx-auto w-[min(78vw,300px)] lg:ml-auto lg:mr-0">
      <div aria-hidden className="absolute -inset-6 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(247,181,44,0.25),transparent)] blur-2xl" />
      <div className="relative rounded-[2.6rem] border border-white/15 bg-gradient-to-b from-[#2a2a2a] to-[#111] p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[2.1rem] bg-[#151515]">
          <div aria-hidden className="absolute left-1/2 top-2.5 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
          {playing && hasVideo ? (
            <video src={siteConfig.heroVideoUrl} className="h-full w-full object-cover" autoPlay controls playsInline />
          ) : (
            <>
              <Image
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=70"
                alt="Equipe de construção trabalhando em uma obra"
                fill
                sizes="300px"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/85" />
              <button
                type="button"
                onClick={() => (hasVideo ? setPlaying(true) : document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" }))}
                className="group absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
                aria-label="Assistir: como funciona em 90 segundos"
              >
                <span className="relative grid h-20 w-20 place-items-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-gold/30 [animation-duration:2.4s]" />
                  <span className="relative grid h-20 w-20 place-items-center rounded-full bg-gold shadow-[0_10px_40px_-5px_rgba(247,181,44,0.7)] transition-transform group-hover:scale-110">
                    <Play aria-hidden className="ml-1 h-8 w-8 fill-[#140d00] text-[#140d00]" />
                  </span>
                </span>
              </button>
              <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">Vídeo · 1:30</p>
                <p className="font-display mt-1 text-xl font-extrabold leading-tight tracking-[-0.02em] text-ink">Como funciona em 90 segundos</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
