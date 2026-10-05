"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { CarFront, Moon, PanelLeft, Plus, Sun, Upload, UserRound } from "lucide-react";
import { allNavItems, isVisible } from "@/config/nav";
import { useCurrentUser } from "@/features/auth/user-provider";
import { useTenant } from "@/features/tenants/tenant-provider";
import { AGENCY_TENANT_ID } from "@/features/tenants/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { transition } from "@/lib/motion";
import { useShell } from "./shell-state";
import { useCommandSearch } from "./command-search";
import { usePathname } from "next/navigation";

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, toggleCollapsed } = useShell();
  const router = useRouter();
  const user = useCurrentUser();
  const isAgency = useTenant().id === AGENCY_TENANT_ID;
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = React.useState("");

  const run = (fn: () => void) => {
    setPaletteOpen(false);
    setQuery("");
    fn();
  };

  const results = useCommandSearch(query);
  const pathname = usePathname();
  const openLead = (id: string) => router.push(`${pathname}?lead=${id}`, { scroll: false });

  return (
    <DialogPrimitive.Root open={paletteOpen} onOpenChange={setPaletteOpen}>
      <AnimatePresence>
        {paletteOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.fast}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                style={{ x: "-50%" }}
                className="fixed left-1/2 top-[12vh] z-50 w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-xl border border-border shadow-lg"
                initial={{ opacity: 0, scale: 0.97, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -4 }}
                transition={transition.spring}
              >
                <DialogPrimitive.Title className="sr-only">Paleta de comandos</DialogPrimitive.Title>
                <Command loop>
                  <CommandInput
                    placeholder="Buscar leads, veículos ou ir para…"
                    value={query}
                    onValueChange={setQuery}
                  />
                  <CommandList>
                    <CommandEmpty>Nada encontrado para “{query}”.</CommandEmpty>

                    {results.leads.length > 0 && (
                      <CommandGroup heading="Leads">
                        {results.leads.map((l) => (
                          <CommandItem
                            key={l.id}
                            value={`lead ${l.id} ${l.title}`}
                            keywords={[query]}
                            onSelect={() => run(() => openLead(l.id))}
                          >
                            <UserRound />
                            <span className="truncate">{l.title}</span>
                            <span className="ml-auto truncate text-xs text-subtle-foreground">{l.subtitle}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    {results.vehicles.length > 0 && (
                      <CommandGroup heading="Veículos">
                        {results.vehicles.map((v) => (
                          <CommandItem
                            key={v.id}
                            value={`veiculo ${v.id} ${v.title}`}
                            keywords={[query]}
                            onSelect={() => run(() => router.push(v.href))}
                          >
                            <CarFront />
                            <span className="truncate">{v.title}</span>
                            <span className="ml-auto truncate text-xs text-subtle-foreground">{v.subtitle}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {!isAgency && (
                    <CommandGroup heading="Ações">
                      <CommandItem
                        value="novo lead criar cadastrar"
                        onSelect={() => run(() => window.dispatchEvent(new CustomEvent("autocrm:new-lead")))}
                      >
                        <Plus /> Novo lead <Kbd className="ml-auto">N</Kbd>
                      </CommandItem>
                      <CommandItem value="importar csv meta leads" onSelect={() => run(() => router.push("/leads/importar"))}>
                        <Upload /> Importar leads (CSV)
                      </CommandItem>
                      <CommandItem value="cadastrar veiculo estoque" onSelect={() => run(() => router.push("/estoque/novo"))}>
                        <CarFront /> Cadastrar veículo
                      </CommandItem>
                    </CommandGroup>
                    )}

                    <CommandSeparator />
                    <CommandGroup heading="Navegar">
                      {allNavItems
                        .filter((i) => isVisible(i, user.role, isAgency))
                        .map((item) => (
                          <CommandItem
                            key={item.href}
                            value={`ir ${item.title}`}
                            onSelect={() => run(() => router.push(item.href))}
                          >
                            <item.icon /> {item.title}
                            {item.chord && (
                              <span className="ml-auto flex gap-1">
                                <Kbd>G</Kbd>
                                <Kbd>{item.chord.toUpperCase()}</Kbd>
                              </span>
                            )}
                          </CommandItem>
                        ))}
                    </CommandGroup>

                    <CommandSeparator />
                    <CommandGroup heading="Preferências">
                      <CommandItem
                        value="alternar tema escuro claro dark light"
                        onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}
                      >
                        {resolvedTheme === "dark" ? <Sun /> : <Moon />}
                        Tema {resolvedTheme === "dark" ? "claro" : "escuro"}
                        <span className="ml-auto flex gap-1">
                          <Kbd>⇧</Kbd>
                          <Kbd>T</Kbd>
                        </span>
                      </CommandItem>
                      <CommandItem value="recolher expandir menu lateral sidebar" onSelect={() => run(toggleCollapsed)}>
                        <PanelLeft /> Recolher/expandir menu <Kbd className="ml-auto">[</Kbd>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                  <div className="flex items-center gap-3 border-t border-border bg-surface-2 px-3 py-2 text-[11px] text-subtle-foreground">
                    <span className="flex items-center gap-1">
                      <Kbd>↑</Kbd>
                      <Kbd>↓</Kbd> navegar
                    </span>
                    <span className="flex items-center gap-1">
                      <Kbd>↵</Kbd> abrir
                    </span>
                    <span className="ml-auto flex items-center gap-1">
                      <Kbd>Esc</Kbd> fechar
                    </span>
                  </div>
                </Command>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
