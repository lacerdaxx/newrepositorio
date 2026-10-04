import { CalendarX2, HandCoins, SearchX, PhoneMissed, Flame } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import SpotlightCard from "./ui/SpotlightCard";
import { Reveal, RevealGroup } from "./ui/Reveal";

const pains = [
  {
    icon: CalendarX2,
    title: "Mês cheio, mês vazio.",
    text: "Tem mês que você recusa serviço. No outro, a equipe fica parada e você paga do bolso para não perder gente boa.",
  },
  {
    icon: HandCoins,
    title: "Preso como sub.",
    text: "Você faz o trabalho pesado, o contractor americano fica com o cliente e com a margem, e você ainda espera semanas para receber.",
  },
  {
    icon: SearchX,
    title: "O cliente pesquisa e não confia.",
    text: "Poucas reviews no Google, Instagram abandonado. O dono da casa olha e escolhe a empresa que parece maior, mesmo que ela trabalhe pior que você.",
  },
  {
    icon: PhoneMissed,
    title: "Não tenho tempo para vender.",
    text: "Você está na obra o dia inteiro. O cliente liga, ninguém atende, e quando você retorna ele já fechou com outro.",
  },
  {
    icon: Flame,
    title: "Já me queimei com marketing.",
    text: "Pagou HomeAdvisor, Angi ou agência e recebeu lead ruim, dividido com mais 5 empresas brigando por preço.",
  },
];

export default function Pain() {
  return (
    <section className="section">
      <div className="container-site">
        <SectionHeading
          tag="O problema"
          title={
            <>
              Você trabalha de sol a sol. Por que a sua agenda ainda <span className="text-gold">depende da sorte?</span>
            </>
          }
          subtitle="Seus clientes elogiam, sua equipe entrega e o acabamento fala por si. Mas toda semana volta a mesma pergunta: de onde vem a próxima obra?"
        />
        <RevealGroup as="ul" className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-16 md:gap-5 lg:grid-cols-6">
          {pains.map(({ icon: Icon, title, text }, i) => (
            <SpotlightCard
              as="li"
              key={title}
              className={`flex flex-col gap-4 p-6 md:p-7 lg:col-span-2 ${i === 3 ? "lg:col-start-2" : ""} ${i === 4 ? "sm:col-span-2 lg:col-span-2" : ""}`}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
                <Icon aria-hidden className="h-6 w-6 text-silver" />
              </span>
              <div>
                <h3 className="font-display text-xl font-extrabold leading-tight tracking-[-0.02em] text-ink">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
              </div>
            </SpotlightCard>
          ))}
        </RevealGroup>
        <Reveal className="mx-auto mt-12 max-w-3xl text-center md:mt-16">
          <p className="text-pretty text-lg leading-relaxed text-[#D4D4D8] md:text-xl">
            O problema não é a qualidade do seu trabalho. É que ninguém está trazendo{" "}
            <span className="font-semibold text-ink">o cliente certo</span> até você e garantindo que ele seja atendido.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
