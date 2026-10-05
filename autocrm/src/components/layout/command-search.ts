"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRepo } from "@/features/data/repo-provider";
import { AGENCY_TENANT_ID } from "@/features/tenants/types";
import { useTenant } from "@/features/tenants/tenant-provider";
import { vehicleShortTitle, vehicleSpecsLine, vehicleTitle } from "@/features/vehicles/utils";
import { formatPhone } from "@/lib/format";

export type SearchHit = { id: string; title: string; subtitle: string; href: string };

function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

/** Busca de leads e veículos para a paleta (Ctrl+K). */
export function useCommandSearch(query: string) {
  const repo = useRepo();
  const tenant = useTenant();
  const q = useDebounced(query.trim(), 180);
  const enabled = !!repo && q.length >= 2 && tenant.id !== AGENCY_TENANT_ID;
  const res = useQuery({
    queryKey: ["search", tenant.id, q],
    queryFn: () => repo!.search(tenant.id, q),
    enabled,
    staleTime: 10_000,
  });
  const leads: SearchHit[] = (res.data?.leads ?? []).map((l) => ({
    id: l.id,
    title: l.name,
    subtitle: [formatPhone(l.phone), l.vehicle ? vehicleShortTitle(l.vehicle) : null].filter(Boolean).join(" · "),
    href: `?lead=${l.id}`,
  }));
  const vehicles: SearchHit[] = (res.data?.vehicles ?? []).map((v) => ({
    id: v.id,
    title: vehicleTitle(v, { year: false }),
    subtitle: vehicleSpecsLine(v),
    href: `/estoque/${v.id}`,
  }));
  return { leads: enabled ? leads : [], vehicles: enabled ? vehicles : [], loading: res.isFetching };
}
