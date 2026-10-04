import { Check, X } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import SpotlightCard from "./ui/SpotlightCard";
import { RevealGroup } from "./ui/Reveal";

const yes = [
  "Tem empresa de reforma ou construção nos EUA",
  "Quer vender direto ao dono da casa",
  "Tem equipe para mais obras",
  "Responde leads rápido",
];
const no = [
  "Está começando sem equipe",
  "Não tem verba para anunciar (mínimo recomendado de US$ 1.500/mês)",
  "Não atende o telefone",
];

export default function ForWho() {
  return (
    <section className="section">
      <div className="container-site">
        <SectionHeading
          tag="Para quem é"
          title={
            <>
              Feito para quem quer <span className="text-gold">crescer de verdade</span>
            </>
          }
        />
        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2">
          <SpotlightCard className="p-6 md:p-10">
            <h3 className="font-display flex items-center gap-3 text-2xl font-extrabold tracking-[-0.02em] text-ink">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40">
                <Check aria-hidden strokeWidth={3} className="h-5 w-5 text-emerald-400" />
              </span>
              É para você se…
            </h3>
            <ul className="mt-7 space-y-4">
              {yes.map((t) => (
                <li key={t} className="flex items-start gap-3 text-base leading-snug text-[#D4D4D8] md:text-lg">
                  <Check aria-hidden strokeWidth={3} className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  {t}
                </li>
              ))}
            </ul>
          </SpotlightCard>
          <SpotlightCard className="p-6 md:p-10">
            <h3 className="font-display flex items-center gap-3 text-2xl font-extrabold tracking-[-0.02em] text-ink">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-red-500/15 ring-1 ring-red-400/40">
                <X aria-hidden strokeWidth={3} className="h-5 w-5 text-red-400" />
              </span>
              Não é para você se…
            </h3>
            <ul className="mt-7 space-y-4">
              {no.map((t) => (
                <li key={t} className="flex items-start gap-3 text-base leading-snug text-[#D4D4D8] md:text-lg">
                  <X aria-hidden strokeWidth={3} className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                  {t}
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </RevealGroup>
      </div>
    </section>
  );
}
