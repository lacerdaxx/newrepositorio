"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ChevronsLeft, ChevronsUpDown, LogOut, Moon, Plus, Search, Sun, UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import { navSections, type NavItem } from "@/config/nav";
import { canSee, useCurrentUser } from "@/features/auth/user-provider";
import { useTenant } from "@/features/tenants/tenant-provider";
import { TenantMark } from "@/components/brand/tenant-logo";
import { Avatar } from "@/components/ui/avatar";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useShell } from "./shell-state";

const roleLabel = { superadmin: "Agência", gerente: "Gerente", vendedor: "Vendedor" } as const;

export function Sidebar() {
  const { collapsed, toggleCollapsed } = useShell();
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)" }}
      transition={transition.spring}
      className="sticky top-0 z-30 hidden h-dvh shrink-0 flex-col border-r border-border bg-surface-2/60 md:flex"
    >
      <SidebarContent collapsed={collapsed} />
      <div className={cn("border-t border-border p-2", collapsed && "flex justify-center")}>
        <Tooltip content="Expandir menu" side="right" disabled={!collapsed}>
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            className="flex h-8 w-full items-center gap-2 rounded-lg px-2 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={transition.spring} className="flex">
              <ChevronsLeft className="size-4" />
            </motion.span>
            {!collapsed && <span>Recolher</span>}
            {!collapsed && <Kbd className="ml-auto">[</Kbd>}
          </button>
        </Tooltip>
      </div>
    </motion.aside>
  );
}

export function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useCurrentUser();
  const { setPaletteOpen } = useShell();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <WorkspaceSwitcher collapsed={collapsed} />

      <div className={cn("flex gap-1.5 px-2 pb-2", collapsed && "flex-col items-center")}>
        <Tooltip content={<>Buscar <Kbd>Ctrl K</Kbd></>} side="right" disabled={!collapsed}>
          <button
            onClick={() => setPaletteOpen(true)}
            className={cn(
              "flex h-8 items-center gap-2 rounded-lg border border-border bg-surface px-2 text-[13px] text-subtle-foreground shadow-xs transition-colors hover:border-border-strong hover:text-muted-foreground",
              collapsed ? "w-8 justify-center px-0" : "flex-1",
            )}
          >
            <Search className="size-3.5" />
            {!collapsed && (
              <>
                <span>Buscar…</span>
                <Kbd className="ml-auto">⌘K</Kbd>
              </>
            )}
          </button>
        </Tooltip>
        <Tooltip content={<>Novo lead <Kbd>N</Kbd></>} side={collapsed ? "right" : "bottom"}>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("autocrm:new-lead"))}
            aria-label="Novo lead"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm transition-transform hover:brightness-110 active:scale-95 inset-ring inset-ring-white/10"
          >
            <Plus className="size-4" />
          </button>
        </Tooltip>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-3 scrollbar-none" aria-label="Navegação principal">
        <LayoutGroup id="sidebar-nav">
          {navSections.map((section, i) => {
            const items = section.items.filter((it) => canSee(user.role, it.roles));
            if (items.length === 0) return null;
            return (
              <div key={i} className="mt-3 first:mt-1">
                {section.label &&
                  (collapsed ? (
                    <div className="mx-auto mb-2 h-px w-5 bg-border" />
                  ) : (
                    <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-subtle-foreground">
                      {section.label}
                    </div>
                  ))}
                <ul className="flex flex-col gap-px">
                  {items.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        item={item}
                        active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                        collapsed={collapsed}
                        onNavigate={onNavigate}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </LayoutGroup>
      </nav>
    </div>
  );
}

function NavLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Tooltip
      side="right"
      disabled={!collapsed}
      content={
        <>
          {item.title}
          {item.chord && <span className="text-subtle-foreground">G {item.chord.toUpperCase()}</span>}
        </>
      }
    >
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex h-8 items-center gap-2.5 rounded-lg px-2 text-[13px] font-medium outline-none transition-colors",
          "focus-visible:ring-[3px] focus-visible:ring-ring",
          active ? "text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          collapsed && "justify-center px-0",
        )}
      >
        {active && (
          <motion.span
            layoutId="sidebar-active"
            transition={transition.spring}
            className="absolute inset-0 rounded-lg border border-border bg-surface shadow-xs"
          >
            <span className="absolute top-1/2 -left-2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-brand" />
          </motion.span>
        )}
        <Icon
          className={cn(
            "relative size-4 shrink-0 transition-colors",
            active ? "text-brand" : "text-subtle-foreground group-hover:text-muted-foreground",
          )}
        />
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={transition.fast}
              className="relative truncate"
            >
              {item.title}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </Tooltip>
  );
}

function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const tenant = useTenant();
  const user = useCurrentUser();
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex h-11 w-full items-center gap-2.5 rounded-lg px-1.5 text-left outline-none transition-colors hover:bg-accent/70 focus-visible:ring-[3px] focus-visible:ring-ring data-[state=open]:bg-accent",
              collapsed && "justify-center px-0",
            )}
          >
            <TenantMark />
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold leading-tight">{tenant.name}</div>
                  <div className="truncate text-[11px] text-subtle-foreground">
                    {user.name.split(" ")[0]} · {roleLabel[user.role]}
                  </div>
                </div>
                <ChevronsUpDown className="size-3.5 text-subtle-foreground" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <Avatar name={user.name} src={user.avatarUrl} className="size-8" />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium">{user.name}</div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Conta</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/configuracoes/perfil">
              <UserRound /> Meu perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun /> : <Moon />} Alternar tema
            <DropdownMenuShortcut>⇧T</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive asChild>
            <Link href="/logout">
              <LogOut /> Sair
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
