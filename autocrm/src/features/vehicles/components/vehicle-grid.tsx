"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CarFront, Plus, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/features/auth/user-provider";
import { useVehicleCounts, useVehicles } from "@/features/data/queries";
import { fadeUpItem, staggerContainer } from "@/lib/motion";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { VehicleStatus } from "@/types/database";
import { STATUS_LABEL, vehicleSpecsLine, vehicleTitle } from "../utils";
import { VehicleImage } from "../vehicle-image";

type Sort = "recent" | "price_asc" | "price_desc" | "leads";
const STATUS_VARIANT = { disponivel: "success", reservado: "warning", vendido: "danger" } as const;

export function VehicleGrid() {
  const me = useCurrentUser();
  const vehicles = useVehicles();
  const counts = useVehicleCounts();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<VehicleStatus | "all">("all");
  const [sort, setSort] = useState<Sort>("recent");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const c = counts.data ?? {};
    return (vehicles.data ?? [])
      .filter((v) => (status === "all" ? true : v.status === status))
      .filter((v) => !term || `${vehicleTitle(v)} ${v.color ?? ""} ${v.plate ?? ""}`.toLowerCase().includes(term))
      .sort((a, b) =>
        sort === "price_asc"
          ? Number(a.price ?? 0) - Number(b.price ?? 0)
          : sort === "price_desc"
            ? Number(b.price ?? 0) - Number(a.price ?? 0)
            : sort === "leads"
              ? (c[b.id] ?? 0) - (c[a.id] ?? 0)
              : b.created_at.localeCompare(a.created_at),
      );
  }, [vehicles.data, counts.data, q, status, sort]);

  const totals = useMemo(() => {
    const all = vehicles.data ?? [];
    return {
      all: all.length,
      disponivel: all.filter((v) => v.status === "disponivel").length,
      reservado: all.filter((v) => v.status === "reservado").length,
      vendido: all.filter((v) => v.status === "vendido").length,
      value: all.filter((v) => v.status !== "vendido").reduce((s, v) => s + Number(v.price ?? 0), 0),
    };
  }, [vehicles.data]);

  const canEdit = me.role !== "vendedor";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-border bg-surface-2 p-1" role="tablist" aria-label="Status">
          {(["all", "disponivel", "reservado", "vendido"] as const).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={status === s}
              onClick={() => setStatus(s)}
              className={cn(
                "relative rounded-md px-2.5 py-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground",
                status === s && "text-foreground",
              )}
            >
              {status === s && <motion.span layoutId="vehicle-status" className="absolute inset-0 rounded-md border border-border bg-surface shadow-xs" />}
              <span className="relative">
                {s === "all" ? "Todos" : STATUS_LABEL[s]} <span className="text-subtle-foreground tabular">{totals[s]}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="relative min-w-48 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-subtle-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Marca, modelo, cor, placa…" className="h-8 pl-8 text-[13px]" aria-label="Buscar veículo" />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
          <SelectTrigger className="h-8 w-auto text-[13px]" aria-label="Ordenar">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais recentes</SelectItem>
            <SelectItem value="price_asc">Menor preço</SelectItem>
            <SelectItem value="price_desc">Maior preço</SelectItem>
            <SelectItem value="leads">Mais interessados</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-auto hidden text-xs text-subtle-foreground md:block">
          {formatCurrency(totals.value, { compact: true })} em estoque
        </span>
      </div>

      {vehicles.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="flex flex-col gap-2 p-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={<CarFront />}
          title={vehicles.data?.length ? "Nenhum veículo com esses filtros" : "Nenhum veículo cadastrado"}
          description="Cada veículo ganha uma página pública com a marca da loja e botão “Tenho interesse”."
          action={
            canEdit && (
              <Button asChild>
                <Link href="/estoque/novo">
                  <Plus /> Cadastrar veículo
                </Link>
              </Button>
            )
          }
        />
      ) : (
        <motion.ul
          variants={staggerContainer(0.03)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
        >
          {list.map((v) => {
            const leads = counts.data?.[v.id] ?? 0;
            return (
              <motion.li key={v.id} variants={fadeUpItem}>
                <Link
                  href={`/estoque/${v.id}`}
                  className="surface group block overflow-hidden rounded-xl border border-border bg-surface shadow-xs outline-none transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <VehicleImage
                      src={v.cover_url}
                      brand={v.brand}
                      model={v.model}
                      rounded="rounded-none"
                      className={cn("size-full transition-transform duration-500 group-hover:scale-[1.03]", v.status === "vendido" && "grayscale")}
                    />
                    <div className="absolute left-2 top-2 flex gap-1">
                      <Badge variant={STATUS_VARIANT[v.status]} className="bg-background/85 backdrop-blur">
                        {STATUS_LABEL[v.status]}
                      </Badge>
                    </div>
                    {leads > 0 && (
                      <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/85 px-1.5 py-0.5 text-[11px] font-medium backdrop-blur">
                        <Users className="size-3 text-brand" /> {leads}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 p-3">
                    <p className="truncate text-[13.5px] font-semibold">{vehicleTitle(v, { year: false })}</p>
                    <p className="truncate text-xs text-muted-foreground">{vehicleSpecsLine(v)}</p>
                    <p className="mt-1 text-base font-semibold tracking-tight tabular">{v.price ? formatCurrency(Number(v.price)) : "Consulte"}</p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}
