"use client";

import Image from "next/image";
import { Quote, TrendingUp, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import SectionHeading from "./ui/SectionHeading";
import SpotlightCard from "./ui/SpotlightCard";
import { RevealGroup } from "./ui/Reveal";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

export default function Testimonials() {
  const items = siteConfig.depoimentos;
  const scroller = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    setActive(Math.round(el.scrollLeft / (card.offsetWidth + 16)));
  };

  const goTo = (i: number) => {
    const el = scroller.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    <section className="section">
      <div className="container-site">
        <SectionHeading
          tag="Depoimentos"
          title={
            <>
              Quem já saiu da <span className="text-gold">dependência de indicação</span>
            </>
          }
        />
        <RevealGroup className="mt-12 md:mt-16">
          <ul
            ref={scroller}
            onScroll={onScroll}
            aria-label="Depoimentos de clientes"
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {items.map((t, i) => (
              <SpotlightCard as="li" key={i} className="flex w-[85%] shrink-0 snap-start flex-col p-6 sm:w-[60%] md:w-auto md:p-8">
                <div className="flex items-center justify-between">
                  <Quote aria-hidden className="h-8 w-8 fill-gold/20 text-gold" />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                    <TrendingUp aria-hidden className="h-3.5 w-3.5" />
                    {t.result}
                  </span>
                </div>
                <blockquote className="mt-6 flex-1 text-lg leading-relaxed text-ink">“{t.quote}”</blockquote>
                <div className="mt-8 flex items-center gap-3 border-t border-white/[0.08] pt-5">
                  <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02]">
                    {t.photo ? (
                      <Image src={t.photo} alt="" fill sizes="44px" className="object-cover" />
                    ) : (
                      <UserRound aria-hidden className="h-5 w-5 text-silver" />
                    )}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{t.name}</p>
                    <p className="text-sm text-muted">
                      {t.company}, {t.location}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </ul>
          <div className="mt-4 flex justify-center gap-1 md:hidden">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ver depoimento ${i + 1}`}
                aria-current={active === i}
                className="grid h-11 w-11 place-items-center"
              >
                <span className={cn("block h-2 rounded-full transition-all", active === i ? "w-6 bg-gold" : "w-2 bg-white/20")} />
              </button>
            ))}
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
