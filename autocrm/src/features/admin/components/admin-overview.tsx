"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Building2, PhoneMissed, Search, Store, TrendingUp, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { tenantUrl } from "@/features/tenants/host";
import { fadeUpItem, staggerContainer } from "@/lib/motion";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn, initials } from "@/lib/utils";
import type { TenantOverviewRow } from "@/types/database";

export function AdminOverview({ tenants, rootDomain }: { tenants: TenantOverviewRow[]; rootDomain: string }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => tenants.filter((t) => `${t.name} ${t.slug}`.toLowerCase().includes(q.trim().toLowerCase())),
    [tenants, q],
  );
  const active = tenants.filter((t) => t.active);
  const leads = active.reduce((s, t) => s + Number(t.leads_month), 0);
  const sales = active.reduce((s, t) => s + Number(t.sales_month), 0);
  const unattended = active.reduce((s, t) => s + Number(t.unattended), 0);

  const stats = [
    { label: "Lojas ativas", value: active.length, icon: <Store /> },
    { label: "Leads no mês", value: leads, icon: <Users /> },
    { label: "Vendas no mês", value: sales, icon: <TrendingUp /> },
    { label: "Leads sem atendimento", value: unattended, icon: <PhoneMissed />, danger: unattended > 0 },
  ];

  if (tenants.length === 0) {
    return (
      <EmptyState
        icon={<Building2 />}
        title="Nenhuma loja cadastrada"
        description="Crie a primeira loja, configure a marca e o gerente já recebe acesso."
        action={
          <Button asChild>
            <Link href="/admin/lojas/nova">Criar loja</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <motion.div variants={staggerContainer(0.05)} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUpItem}>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground [&_svg]:size-3.5 [&_svg]:text-subtle-foreground">
                {s.icon} {s.label}
              </div>
              <div className={cn("mt-2.5 text-[26px] font-semibold leading-none tracking-tight", s.danger && "text-danger")}>
                <AnimatedNumber value={s.value} />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar loja…" className="pl-9" aria-label="Buscar loja" />
        </div>
        <span className="text-xs text-subtle-foreground">{filtered.length} lojas</span>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="hidden grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))_96px] gap-4 border-b border-border bg-surface-2/60 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-subtle-foreground md:grid">
          <span>Loja</span>
          <span className="text-right">Usuários</span>
          <span className="text-right">Leads/mês</span>
          <span className="text-right">Vendas/mês</span>
          <span className="text-right">Conversão</span>
          <span />
        </div>
        <motion.ul variants={staggerContainer(0.03)} initial="hidden" animate="show">
          {filtered.map((t) => {
            const conv = Number(t.leads_month) ? Number(t.sales_month) / Number(t.leads_month) : 0;
            return (
              <motion.li key={t.id} variants={fadeUpItem} className="group relative border-b border-border last:border-0">
                <div
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 transition-colors hover:bg-accent/40 md:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))_96px]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {t.logo_url ? (
                      <img src={t.logo_url} alt="" className="size-8 rounded-lg object-contain ring-1 ring-border" />
                    ) : (
                      <div
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white shadow-sm"
                        style={{ background: t.primary_color }}
                      >
                        {initials(t.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 truncate text-[13px] font-medium">
                        {/* link "esticado": a linha inteira é clicável */}
                        <Link href={`/admin/lojas/${t.id}`} className="outline-none after:absolute after:inset-0 focus-visible:underline">
                          {t.name}
                        </Link>
                        {!t.active && <Badge variant="danger">Desativada</Badge>}
                        {t.active && Number(t.unattended) > 0 && (
                          <Badge variant="warning">{t.unattended} sem contato</Badge>
                        )}
                      </div>
                      <div className="truncate text-xs text-subtle-foreground">
                        {rootDomain && rootDomain !== "localhost" ? `${t.slug}.${rootDomain}` : t.slug}
                      </div>
                    </div>
                  </div>
                  <span className="hidden text-right text-sm tabular md:block">{formatNumber(Number(t.users_count))}</span>
                  <span className="hidden text-right text-sm tabular md:block">{formatNumber(Number(t.leads_month))}</span>
                  <span className="hidden text-right text-sm tabular md:block">{formatNumber(Number(t.sales_month))}</span>
                  <span className="hidden text-right text-sm tabular md:block">{formatPercent(conv)}</span>
                  <div className="relative z-10 flex justify-end">
                    <Tooltip content="Abrir CRM da loja">
                      <Button asChild variant="ghost" size="icon-xs" className="opacity-60 group-hover:opacity-100">
                        <a href={tenantUrl(t.slug, rootDomain, "/meu-dia")} aria-label={`Abrir ${t.name}`}>
                          <ArrowUpRight />
                        </a>
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </Card>
    </div>
  );
}
