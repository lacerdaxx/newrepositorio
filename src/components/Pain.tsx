import { CalendarX2, HandCoins, Ban, HardHat } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import SpotlightCard from "./ui/SpotlightCard";
import { RevealGroup } from "./ui/Reveal";

const pains = [
  { icon: CalendarX2, text: "Mês de agenda lotada, mês de equipe parada." },
  { icon: HandCoins, text: "Depende de indicação ou trabalha como sub, ganhando pouco por metro." },
  { icon: Ban, text: "Já pagou HomeAdvisor, Angi ou agência e recebeu lead ruim e compartilhado." },
  { icon: HardHat, text: "Está na obra o dia todo e não tem tempo para vender." },
];

export default function Pain() {
  return (
    <section className="section">
      <div className="container-site">
        <SectionHeading
          tag="O problema"
          title={
            <>
              Se isso acontece na sua empresa, você está <span className="text-gold">deixando dinheiro na mesa</span>
            </>
          }
        />
        <RevealGroup as="ul" className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-16 md:gap-5">
          {pains.map(({ icon: Icon, text }, i) => (
            <SpotlightCard as="li" key={text} className="flex gap-5 p-6 md:p-8">
              <div className="flex flex-col items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
                  <Icon aria-hidden className="h-6 w-6 text-silver" />
                </span>
              </div>
              <div>
                <span className="font-display text-sm font-extrabold text-gold/80">0{i + 1}</span>
                <p className="mt-1 text-lg font-medium leading-snug text-ink md:text-xl">{text}</p>
              </div>
            </SpotlightCard>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
