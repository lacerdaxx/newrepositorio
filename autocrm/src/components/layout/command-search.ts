/**
 * Fontes de busca da paleta de comandos.
 * Fase 1: dados de demonstração. Na Fase 3 é trocado por busca no Supabase (TanStack Query).
 */
export type SearchHit = { id: string; title: string; subtitle: string; href: string };

const demoLeads: SearchHit[] = [
  { id: "l1", title: "Carlos Henrique Souza", subtitle: "(61) 99812-4471 · Onix LTZ", href: "/funil?lead=l1" },
  { id: "l2", title: "Juliana Ferreira", subtitle: "(62) 98144-2093 · Compass Longitude", href: "/funil?lead=l2" },
  { id: "l3", title: "Rafael Oliveira", subtitle: "(61) 99107-5530 · Hilux SRV", href: "/funil?lead=l3" },
  { id: "l4", title: "Patrícia Almeida", subtitle: "(62) 99655-8812 · T-Cross Highline", href: "/funil?lead=l4" },
];

const demoVehicles: SearchHit[] = [
  { id: "v1", title: "Chevrolet Onix LTZ 1.0 Turbo", subtitle: "2022 · 38.000 km", href: "/estoque/v1" },
  { id: "v2", title: "Jeep Compass Longitude", subtitle: "2021 · 52.300 km", href: "/estoque/v2" },
  { id: "v3", title: "Toyota Hilux SRV 2.8", subtitle: "2020 · 91.000 km", href: "/estoque/v3" },
  { id: "v4", title: "Toyota Corolla XEi 2.0", subtitle: "2023 · 21.400 km", href: "/estoque/v4" },
  { id: "v5", title: "Fiat Strada Volcano", subtitle: "2023 · 18.900 km", href: "/estoque/v5" },
];

export function searchProviders(query: string) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return { leads: [], vehicles: [] };
  const match = (h: SearchHit) => `${h.title} ${h.subtitle}`.toLowerCase().includes(q);
  return { leads: demoLeads.filter(match).slice(0, 5), vehicles: demoVehicles.filter(match).slice(0, 5) };
}
