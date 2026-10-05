import type { BoardLead } from "@/features/data/types";
import type { LeadSource } from "@/types/database";

export type Period = "all" | "today" | "7d" | "30d";

export type BoardFilters = {
  q: string;
  seller: string; // "all" | "none" | id
  source: LeadSource | "all";
  campaign: string; // "all" | nome
  tag: string; // "all" | tag
  vehicle: string; // "all" | id
  period: Period;
};

export const EMPTY_FILTERS: BoardFilters = { q: "", seller: "all", source: "all", campaign: "all", tag: "all", vehicle: "all", period: "all" };

export function activeFilterCount(f: BoardFilters) {
  return (["seller", "source", "campaign", "tag", "vehicle", "period"] as const).filter((k) => f[k] !== "all").length + (f.q ? 1 : 0);
}

function startOfPeriod(p: Period): number {
  const d = new Date();
  if (p === "today") return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  if (p === "7d") return d.getTime() - 7 * 86400000;
  if (p === "30d") return d.getTime() - 30 * 86400000;
  return 0;
}

export function applyFilters(leads: BoardLead[], f: BoardFilters): BoardLead[] {
  const q = f.q.trim().toLowerCase();
  const digits = q.replace(/\D/g, "");
  const since = startOfPeriod(f.period);
  return leads.filter((l) => {
    if (f.seller === "none" ? l.assigned_to : f.seller !== "all" && l.assigned_to !== f.seller) return false;
    if (f.source !== "all" && l.source !== f.source) return false;
    if (f.campaign !== "all" && (l.campaign ?? l.utm_campaign) !== f.campaign) return false;
    if (f.tag !== "all" && !l.tags.includes(f.tag)) return false;
    if (f.vehicle !== "all" && l.vehicle_id !== f.vehicle) return false;
    if (since && new Date(l.created_at).getTime() < since) return false;
    if (q) {
      const hay = `${l.name} ${l.email ?? ""} ${l.city ?? ""} ${l.vehicle?.model ?? ""} ${l.vehicle_interest ?? ""}`.toLowerCase();
      if (!hay.includes(q) && !(digits.length >= 4 && l.phone.includes(digits))) return false;
    }
    return true;
  });
}

export function leadValue(l: BoardLead) {
  return Number(l.value ?? l.vehicle?.price ?? 0);
}

/** Posição fracionária entre vizinhos (evita renumerar a coluna inteira). */
export function positionBetween(prev: number | undefined, next: number | undefined) {
  if (prev === undefined && next === undefined) return 0;
  if (prev === undefined) return next! - 1;
  if (next === undefined) return prev + 1;
  return (prev + next) / 2;
}
