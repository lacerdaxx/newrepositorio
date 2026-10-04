import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import Logo from "@/components/ui/Logo";
import { siteConfig } from "@/config/site";
import { getLogoSrc } from "@/lib/logo";

export const metadata: Metadata = {
  title: `Política de Privacidade | ${siteConfig.nome}`,
  description: `Como a ${siteConfig.nome} coleta, usa e protege seus dados.`,
};

const sections = [
  {
    h: "Quais dados coletamos",
    p: "Quando você preenche o formulário de diagnóstico, coletamos nome, nome da empresa, WhatsApp, e-mail, Instagram (opcional), cidade e estado de atuação, além das suas respostas sobre serviços, equipe, faturamento, ticket médio, origem dos clientes, presença no Google e no Instagram, verba e momento. Esses dados são enviados por você por meio de uma mensagem no WhatsApp e podem ser registrados em nossa ferramenta de atendimento.",
  },
  {
    h: "Como usamos os dados",
    p: "Usamos as informações apenas para entrar em contato, preparar e realizar o diagnóstico gratuito e apresentar nossos serviços. Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais.",
  },
  {
    h: "Cookies e Meta Pixel",
    p: "Este site usa o Meta Pixel (Facebook) para medir visitas e conversões dos nossos anúncios. O Pixel pode usar cookies e identificadores do seu navegador. Você pode gerenciar suas preferências de anúncios nas configurações da sua conta Meta e bloquear cookies no seu navegador.",
  },
  {
    h: "Seus direitos",
    p: "Você pode pedir a qualquer momento acesso, correção ou exclusão dos seus dados entrando em contato pelo nosso WhatsApp.",
  },
  {
    h: "Alterações",
    p: "Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre disponível nesta página.",
  },
];

export default function Privacidade() {
  const logoSrc = getLogoSrc("header");
  const footerLogoSrc = getLogoSrc("footer");
  return (
    <>
      <header className="border-b border-white/[0.08]">
        <div className="container-site flex h-[72px] items-center justify-between md:h-24">
          <Link href="/" aria-label="Voltar para o início">
            <Logo src={logoSrc} className="h-12 md:h-14" />
          </Link>
          <Link href="/" className="inline-flex min-h-[48px] items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
            <ArrowLeft aria-hidden className="h-4 w-4" /> Voltar
          </Link>
        </div>
      </header>
      <main className="container-site max-w-3xl py-16 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Privacidade</p>
        <h1 className="font-display mt-4 text-4xl font-extrabold tracking-[-0.03em] text-ink md:text-5xl">Política de Privacidade</h1>
        <p className="mt-6 leading-relaxed">
          A {siteConfig.nome} respeita a sua privacidade. Esta página explica, de forma simples, como tratamos os dados enviados por este site.
        </p>
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-xl font-extrabold tracking-[-0.02em] text-ink md:text-2xl">{s.h}</h2>
              <p className="mt-3 leading-relaxed">{s.p}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer logoSrc={footerLogoSrc} />
    </>
  );
}
