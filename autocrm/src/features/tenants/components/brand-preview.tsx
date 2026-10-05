"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { motion } from "framer-motion";
import { CarFront, Kanban, LayoutDashboard, Moon, Plus, Sun, Users } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/icons";
import { cn, initials } from "@/lib/utils";
import { tenantCssVars } from "../theme";

/** Mini-réplica do app com as cores informadas — atualiza ao vivo enquanto o usuário edita. */
export function BrandPreview({
  name,
  primaryColor,
  secondaryColor,
  logoUrl,
}: {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
}) {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const vars = tenantCssVars({ primaryColor, secondaryColor });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-muted-foreground">Pré-visualização</span>
        <div className="flex rounded-md border border-border p-0.5">
          {(["dark", "light"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-label={m === "dark" ? "Prévia escura" : "Prévia clara"}
              className={cn(
                "flex size-6 items-center justify-center rounded text-muted-foreground transition-colors",
                mode === m && "bg-accent text-foreground",
              )}
            >
              {m === "dark" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <div
        style={vars as React.CSSProperties}
        className={cn(
          mode === "dark" ? "theme-dark" : "theme-light",
          "overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-md transition-colors duration-300",
        )}
      >
        <div className="flex h-[300px]">
          {/* sidebar */}
          <div className="flex w-36 shrink-0 flex-col gap-1 border-r border-border bg-surface-2 p-2">
            <div className="mb-2 flex items-center gap-2 px-1 py-1">
              {logoUrl ? (
                <img src={logoUrl} alt="" className="size-6 rounded-md object-contain" />
              ) : (
                <motion.div
                  layout
                  className="flex size-6 items-center justify-center rounded-md bg-brand text-[9px] font-bold text-brand-foreground"
                >
                  {initials(name || "Loja")}
                </motion.div>
              )}
              <span className="truncate text-[11px] font-semibold">{name || "Nome da loja"}</span>
            </div>
            {[
              { icon: LayoutDashboard, label: "Dashboard" },
              { icon: Kanban, label: "Funil", active: true },
              { icon: Users, label: "Leads" },
              { icon: CarFront, label: "Estoque" },
            ].map((i) => (
              <div
                key={i.label}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[10.5px] text-muted-foreground",
                  i.active && "border border-border bg-surface text-foreground",
                )}
              >
                {i.active && <span className="absolute -left-2 top-1/2 h-3 w-[2px] -translate-y-1/2 rounded-r bg-brand" />}
                <i.icon className={cn("size-3", i.active && "text-brand")} />
                {i.label}
              </div>
            ))}
          </div>
          {/* conteúdo */}
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold">Funil de vendas</span>
              <span className="flex items-center gap-1 rounded-md bg-brand px-2 py-1 text-[10px] font-medium text-brand-foreground">
                <Plus className="size-3" /> Novo lead
              </span>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-2">
              {["Novo Lead", "Em Atendimento"].map((col, ci) => (
                <div key={col} className="flex flex-col gap-1.5 rounded-lg bg-surface-2 p-1.5">
                  <div className="flex items-center gap-1 px-1 text-[10px] font-medium text-muted-foreground">
                    <span className="size-1.5 rounded-full" style={{ background: ci ? "#0ea5e9" : "#6366f1" }} />
                    {col}
                  </div>
                  {[0, 1].map((k) => (
                    <div key={k} className="surface rounded-md border border-border bg-surface p-1.5 shadow-xs">
                      <div className="text-[10px] font-medium">{ci ? "Juliana F." : k ? "Rafael O." : "Carlos H."}</div>
                      <div className="text-[9px] text-subtle-foreground">{k ? "Compass 2021" : "Onix LTZ 2022"}</div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="rounded bg-[color-mix(in_oklch,var(--brand)_14%,transparent)] px-1 text-[8.5px] font-medium text-brand">
                          Meta Ads
                        </span>
                        <span className="flex size-4 items-center justify-center rounded bg-whatsapp text-[#04210f]">
                          <WhatsAppIcon className="size-2.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
