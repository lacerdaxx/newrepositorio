import { Zap } from "lucide-react";

const LINKS = [
  { label: "Termos de Uso", href: "#" },
  { label: "Política de Privacidade", href: "#" },
  { label: "Suporte", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950 py-12">
      <div className="container-px mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <a href="#top" className="flex items-center gap-2 text-base font-extrabold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-red-400 to-red-600 text-white">
            <Zap size={14} strokeWidth={2.5} fill="currentColor" />
          </span>
          EFEITOS <span className="text-gradient-red">PRO+</span>
        </a>

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-xs font-medium text-ink-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="text-xs text-ink-500">© 2026 Efeitos PRO+. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
