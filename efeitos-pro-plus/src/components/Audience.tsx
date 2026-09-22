import { Users, Megaphone, Clapperboard, Briefcase, Sprout } from "lucide-react";
import Reveal from "./ui/Reveal";

const AUDIENCE = [
  { icon: Users, title: "Criadores", text: "Para quem publica constantemente." },
  { icon: Megaphone, title: "Social media", text: "Para produzir conteúdos mais rápidos." },
  { icon: Clapperboard, title: "Videomakers", text: "Para acelerar o processo de edição." },
  { icon: Briefcase, title: "Empreendedores", text: "Para melhorar o conteúdo da própria marca." },
  {
    icon: Sprout,
    title: "Iniciantes",
    text: "Para conseguir resultados mais profissionais sem precisar dominar edição avançada.",
  },
];

export default function Audience() {
  return (
    <section className="relative bg-ink-900/40 py-24 lg:py-32">
      <div className="container-px mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            FEITO PARA QUEM <span className="text-gradient-red">CRIA CONTEÚDO</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {AUDIENCE.map((a, i) => (
            <Reveal key={a.title} delay={i * 70} className={i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <div className="flex h-full flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/25">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <a.icon size={18} />
                </div>
                <h3 className="text-base font-bold">{a.title}</h3>
                <p className="text-sm leading-relaxed text-ink-300">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
