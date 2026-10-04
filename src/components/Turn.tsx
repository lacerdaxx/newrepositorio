import Image from "next/image";
import { Reveal } from "./ui/Reveal";
import Tag from "./ui/Tag";

/** "Virada": a cena do depois, logo após a dor. */
export default function Turn() {
  return (
    <section className="section">
      <div className="container-site grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-6">
          <Tag align="left">Agora imagine</Tag>
          <p className="font-display mt-6 text-balance text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink sm:text-3xl md:text-[34px]">
            Abrir o celular de manhã e ver novos pedidos de orçamento de donos de casa{" "}
            <span className="text-gold">dos melhores bairros da sua região.</span>
          </p>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted md:text-lg">
            Cada um já recebeu uma resposta da sua empresa em segundos. Seu Google e seu Instagram mostram uma empresa séria. E você só
            precisa fazer o que sabe: <span className="text-ink">visitar, orçar e fechar.</span>
          </p>
          <p className="mt-8 border-l-2 border-gold pl-4 text-lg font-semibold text-ink">É isso que a BuildScale monta para a sua empresa.</p>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#1A1A1A] to-[#111]">
            <Image
              src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1100&q=70"
              alt="Cozinha reformada em uma casa americana"
              fill
              sizes="(min-width: 1024px) 560px, 92vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
