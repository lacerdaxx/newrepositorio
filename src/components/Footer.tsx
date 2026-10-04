import Logo from "./ui/Logo";
import WhatsAppIcon from "./ui/WhatsAppIcon";
import { siteConfig, whatsappLink } from "@/config/site";

export default function Footer({ logoSrc }: { logoSrc: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.08] bg-[#070707]">
      <div className="container-site flex flex-col gap-10 py-12 md:flex-row md:items-center md:justify-between md:py-14">
        <div>
          <Logo src={logoSrc} className="h-28 md:h-32" />
          {/* O logo completo já traz o slogan; o placeholder não */}
          {logoSrc.endsWith(".svg") && (
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-muted">{siteConfig.slogan}</p>
          )}
          <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-muted">
            Não entregamos apenas leads. Estruturamos o caminho entre o anúncio e a obra fechada.
          </p>
        </div>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[48px] items-center gap-3 self-start rounded-xl border border-white/10 px-5 text-sm font-semibold text-ink transition-colors hover:border-[#25D366]/60 md:self-auto"
        >
          <WhatsAppIcon className="h-5 w-5 text-[#25D366]" /> Falar no WhatsApp
        </a>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container-site flex flex-col gap-3 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.nome}
          </p>
          <a href="/privacidade" className="underline-offset-4 hover:text-ink hover:underline">
            Política de Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}
