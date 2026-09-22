import { Clock, LayoutGrid, TrendingDown } from "lucide-react";
import Reveal from "./ui/Reveal";

const CARDS = [
  {
    icon: TrendingDown,
    title: "Edições sem impacto",
    text: "Vídeos bons, mas que não prendem atenção.",
  },
  {
    icon: Clock,
    title: "Horas editando",
    text: "Muito tempo procurando e configurando efeitos.",
  },
  {
    icon: LayoutGrid,
    title: "Falta de padrão",
    text: "Cada vídeo fica com uma aparência diferente.",
  },
];

export default function ProblemSection() {
  return (
    <section className="relative bg-ink-950 py-24 lg:py-32">
      <div className="container-px mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            SEU VÍDEO NÃO PRECISA
            <br className="hidden sm:block" /> SER COMPLICADO.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-300">
            Editar vídeos do zero pode consumir horas. Procurar efeitos, baixar arquivos, testar
            combinações e tentar deixar tudo profissional acaba tornando a edição muito mais
            demorada.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/25 hover:bg-white/[0.04]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-ink-900 text-red-400 transition-colors group-hover:border-red-500/30">
                  <card.icon size={20} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300} className="mt-14 text-center">
          <p className="text-xl font-semibold text-white sm:text-2xl">
            O <span className="text-gradient-red">EFEITOS PRO+</span> foi criado para simplificar
            esse processo.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
