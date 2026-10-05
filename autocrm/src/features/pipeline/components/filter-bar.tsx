"use client";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TeamMember } from "@/features/data/types";
import { SOURCE_META, SOURCES } from "@/features/leads/labels";
import { vehicleShortTitle } from "@/features/vehicles/utils";
import { cn } from "@/lib/utils";
import type { VehicleRow } from "@/types/database";
import { activeFilterCount, EMPTY_FILTERS, type BoardFilters, type Period } from "../filters";

function FilterSelect({
  value,
  onChange,
  label,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const active = value !== "all";
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          "h-8 w-auto min-w-0 gap-1.5 text-[13px]",
          active && "border-[color-mix(in_oklch,var(--brand)_45%,var(--border))] bg-[color-mix(in_oklch,var(--brand)_8%,var(--surface))]",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label}: todos</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function FilterBar({
  filters,
  onChange,
  team,
  vehicles,
  campaigns,
  tags,
  showSeller,
}: {
  filters: BoardFilters;
  onChange: (f: BoardFilters) => void;
  team: TeamMember[];
  vehicles: VehicleRow[];
  campaigns: string[];
  tags: string[];
  showSeller: boolean;
}) {
  const set = <K extends keyof BoardFilters>(k: K, v: BoardFilters[K]) => onChange({ ...filters, [k]: v });
  const count = activeFilterCount(filters);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full sm:w-56">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-subtle-foreground" />
        <Input
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
          placeholder="Nome, telefone, veículo…"
          className="h-8 pl-8 text-[13px]"
          aria-label="Buscar no funil"
        />
      </div>
      <SlidersHorizontal className="hidden size-3.5 text-subtle-foreground sm:block" />
      {showSeller && (
        <FilterSelect
          label="Vendedor"
          value={filters.seller}
          onChange={(v) => set("seller", v)}
          options={[{ value: "none", label: "Sem vendedor" }, ...team.filter((m) => m.active).map((m) => ({ value: m.id, label: m.full_name }))]}
        />
      )}
      <FilterSelect
        label="Origem"
        value={filters.source}
        onChange={(v) => set("source", v as BoardFilters["source"])}
        options={SOURCES.map((s) => ({ value: s, label: SOURCE_META[s].label }))}
      />
      {campaigns.length > 0 && (
        <FilterSelect label="Campanha" value={filters.campaign} onChange={(v) => set("campaign", v)} options={campaigns.map((c) => ({ value: c, label: c }))} />
      )}
      {tags.length > 0 && <FilterSelect label="Tag" value={filters.tag} onChange={(v) => set("tag", v)} options={tags.map((t) => ({ value: t, label: t }))} />}
      <FilterSelect
        label="Veículo"
        value={filters.vehicle}
        onChange={(v) => set("vehicle", v)}
        options={vehicles.map((v) => ({ value: v.id, label: vehicleShortTitle(v) }))}
      />
      <FilterSelect
        label="Período"
        value={filters.period}
        onChange={(v) => set("period", v as Period)}
        options={[
          { value: "today", label: "Hoje" },
          { value: "7d", label: "Últimos 7 dias" },
          { value: "30d", label: "Últimos 30 dias" },
        ]}
      />
      {count > 0 && (
        <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
          <X /> Limpar ({count})
        </Button>
      )}
    </div>
  );
}
