import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { PURCHASE_URL } from "../config";

const LINKS = [
  { label: "O que você recebe", href: "#recebe" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-ink-950/85 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
      }`}
    >
      <nav className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between lg:h-20">
        <a href="#top" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 shadow-gold-sm">
            <Zap size={16} strokeWidth={2.5} fill="currentColor" />
          </span>
          EFEITOS <span className="text-gradient-gold">PRO+</span>
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-ink-200 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href={PURCHASE_URL} className="btn-primary hidden !px-5 !py-2.5 !text-xs lg:inline-flex">
          Quero meus efeitos
        </a>

        <button
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-ink-950/97 backdrop-blur-lg lg:hidden">
          <ul className="container-px mx-auto flex flex-col gap-1 py-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-ink-200 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a href={PURCHASE_URL} className="btn-primary w-full">
                Quero meus efeitos
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
