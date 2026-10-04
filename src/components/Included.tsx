import { BarChart3, Check, Clapperboard, MapPinned, Megaphone, MessageSquareReply } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import SpotlightCard from "./ui/SpotlightCard";
import InstagramIcon from "./ui/InstagramIcon";
import { RevealGroup } from "./ui/Reveal";

const groups = [
  {
    icon: Megaphone,
    title: "Tráfego pago",
    items: [
      "Campanhas de Meta Ads gerenciadas e otimizadas toda semana",
      "Segmentação por bairros de alta renda dentro da sua área",
      "Formulário que filtra curioso (serviço, ZIP, prazo e dono do imóvel)",
    ],
  },
  {
    icon: MapPinned,
    title: "Google Meu Negócio",
    items: ["Perfil completo e otimizado em inglês", "4 posts e 8 a 12 fotos novas por mês", "Resposta a todas as reviews e processo para conseguir mais"],
  },
  {
    icon: InstagramIcon,
    title: "Instagram",
    items: ["Bio, destaques e grade organizados em inglês", "8 a 12 posts e reels por mês", "Legendas e hashtags locais"],
  },
  {
    icon: Clapperboard,
    title: "Roteiros e criativos",
    items: ["Guia de gravação e roteiros prontos", "Edição de vídeos com legenda em inglês", "Criativos novos todo mês para anúncios e posts"],
  },
  {
    icon: MessageSquareReply,
    title: "Pré-vendas",
    items: [
      "SMS automático em segundos para cada lead",
      "Lead entregue no seu WhatsApp na hora",
      "Follow-up automático de 7 dias",
      "CRM com o funil da sua empresa",
      "Scripts de ligação e objeções em inglês + treinamento",
    ],
  },
  {
    icon: BarChart3,
    title: "Acompanhamento",
    items: ["Relatório mensal em português com leads, visitas e obras fechadas", "Suporte direto pelo WhatsApp com quem cuida da sua conta"],
  },
];

export default function Included() {
  return (
    <section className="section">
      <div className="container-site">
        <SectionHeading
          tag="O que está incluso"
          title={
            <>
              Tudo o que sua empresa precisa para <span className="text-gold">ter cliente todo mês</span>
            </>
          }
        />
        <RevealGroup className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {groups.map(({ icon: Icon, title, items }) => (
            <SpotlightCard key={title} className="p-6 md:p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
                  <Icon aria-hidden className="h-5 w-5 text-silver" />
                </span>
                <h3 className="font-display text-xl font-extrabold tracking-[-0.02em] text-ink">{title}</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-[#D4D4D8]">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold">
                      <Check aria-hidden strokeWidth={3.5} className="h-3 w-3 text-[#140d00]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
