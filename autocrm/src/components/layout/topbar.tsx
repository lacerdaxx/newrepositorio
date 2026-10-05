"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { allNavItems } from "@/config/nav";
import { TenantMark } from "@/components/brand/tenant-logo";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { ThemeToggle } from "./theme-toggle";
import { useShell } from "./shell-state";

export function Topbar() {
  const pathname = usePathname();
  const { setMobileOpen, setPaletteOpen } = useShell();
  const current = allNavItems.find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`));

  return (
    <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/65 md:px-5">
      <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
        <Menu />
      </Button>
      <Link href="/meu-dia" className="md:hidden" aria-label="Início">
        <TenantMark className="size-6 rounded-md text-[9px]" />
      </Link>

      <nav aria-label="Trilha" className="flex min-w-0 items-center gap-1.5 text-[13px]">
        {current && (
          <>
            <current.icon className="hidden size-4 text-subtle-foreground md:block" />
            <span className="truncate font-medium">{current.title}</span>
          </>
        )}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={() => setPaletteOpen(true)} aria-label="Buscar">
          <Search />
        </Button>
        <Tooltip content={<>Notificações</>} side="bottom">
          <Button variant="ghost" size="icon-sm" aria-label="Notificações" className="relative">
            <Bell />
            <span className="absolute right-2 top-2 flex size-1.5">
              <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-brand" />
              <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
            </span>
          </Button>
        </Tooltip>
        <ThemeToggle />
        <Tooltip content={<>Paleta de comandos <Kbd>Ctrl K</Kbd></>} side="bottom">
          <Button variant="secondary" size="sm" className="hidden gap-1.5 lg:inline-flex" onClick={() => setPaletteOpen(true)}>
            <Search className="!size-3.5" /> Buscar <Kbd className="ml-1">⌘K</Kbd>
          </Button>
        </Tooltip>
      </div>
    </header>
  );
}
