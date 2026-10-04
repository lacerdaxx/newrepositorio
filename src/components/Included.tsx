import { Check } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import { RevealGroup, RevealItem } from "./ui/Reveal";

const items = [
  "Google Meu Negócio completo e atualizado",
  "Meta Ads gerenciado toda semana",
  "Formulário qualificador (serviço, ZIP, prazo, dono do imóvel)",
  "5 roteiros + guia de gravação",
  "Criativos editados todo mês",
  "Relatório mensal em português",
  "Suporte direto pelo WhatsApp",
];

export default function Included() {
  return (
    <section className="section">
      <div className="container-site">
        <SectionHeading
          tag="O que está incluso"
          title={
            <>
              Tudo que sua empresa precisa para <span className="text-gold">gerar orçamentos</span>
            </>
          }
        />
        <RevealGroup as="ul" gap={0.06} className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-3 md:mt-16 md:grid-cols-2 md:gap-4">
          {items.map((item) => (
            <RevealItem
              as="li"
              key={item}
              className="glass flex items-start gap-4 rounded-xl px-5 py-4 transition-colors hover:border-gold/40 md:px-6 md:py-5"
            >
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold shadow-[0_0_20px_-4px_rgba(247,181,44,0.7)]">
                <Check aria-hidden strokeWidth={3} className="h-4 w-4 text-[#140d00]" />
              </span>
              <span className="text-base font-medium leading-snug text-ink md:text-[17px]">{item}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
