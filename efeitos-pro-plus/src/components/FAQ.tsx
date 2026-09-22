import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./ui/Reveal";

const FAQ_ITEMS = [
  {
    q: "Funciona no CapCut?",
    a: "Sim. O Efeitos PRO+ foi desenvolvido para ser utilizado dentro do fluxo de edição do CapCut, aplicativo mais usado por criadores de conteúdo.",
  },
  {
    q: "Preciso saber editar para usar?",
    a: "Não. O produto foi pensado para facilitar o processo de edição, inclusive para quem está começando agora.",
  },
  {
    q: "Como recebo o produto?",
    a: "O acesso é enviado conforme o sistema de entrega da plataforma de compra. [Edite esta resposta de acordo com a sua plataforma de entrega.]",
  },
  {
    q: "O acesso é imediato?",
    a: "[Edite esta resposta conforme o seu sistema de entrega — ex: liberação automática após confirmação do pagamento.]",
  },
  {
    q: "Posso usar nos meus vídeos?",
    a: "[Edite esta resposta de acordo com os termos reais de licença e uso do produto.]",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-ink-900/40 py-24 lg:py-32">
      <div className="container-px mx-auto max-w-3xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            AINDA TEM ALGUMA <span className="text-gradient-gold">DÚVIDA</span>?
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 60}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    isOpen ? "border-gold-500/30 bg-white/[0.04]" : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-sm font-bold text-white sm:text-base">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-gold-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-ink-300">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
