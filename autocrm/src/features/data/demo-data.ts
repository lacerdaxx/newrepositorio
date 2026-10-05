/**
 * Dados fictícios do modo demonstração (sem Supabase). Determinísticos (PRNG com semente)
 * e relativos à data atual, para o funil sempre parecer "vivo".
 */
import type {
  LeadEventRow,
  LeadRow,
  LeadSource,
  LostReason,
  MessageTemplateRow,
  PaymentMethod,
  PipelineStageRow,
  ProfileRow,
  TaskRow,
  VehicleRow,
} from "@/types/database";
import type { PipelineWithStages } from "./types";

export const DEMO_TENANT_ID = "00000000-0000-0000-0000-000000000001";

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const uuid = (prefix: string, n: number) => `${prefix}-0000-4000-8000-${String(n).padStart(12, "0")}`;

// ---------------------------------------------------------------- equipe
const nowIso = new Date().toISOString();
export const demoTeam: ProfileRow[] = (
  [
    ["Ricardo Mendes", "gerente", 1, true, false],
    ["Ana Ribeiro", "vendedor", 2, true, true],
    ["Pedro Lima", "vendedor", 1, true, true],
    ["Lucas Martins", "vendedor", 1, true, true],
    ["Fernanda Rocha", "vendedor", 0, false, false],
  ] as const
).map(([name, role, weight, active, receives], i) => ({
  id: uuid("0000000a", i + 1),
  tenant_id: DEMO_TENANT_ID,
  role,
  full_name: name,
  email: `${name.split(" ")[0]!.toLowerCase()}@abcmultimarcas.com.br`,
  phone: null,
  avatar_url: null,
  active,
  receives_leads: receives,
  distribution_weight: weight,
  last_assigned_at: null,
  created_at: nowIso,
  updated_at: nowIso,
}));

// ---------------------------------------------------------------- funis
function pipeline(n: number, name: string, isDefault: boolean, stages: [string, string, PipelineStageRow["kind"]?][]): PipelineWithStages {
  const id = uuid("0000000b", n);
  return {
    id,
    tenant_id: DEMO_TENANT_ID,
    name,
    position: n - 1,
    is_default: isDefault,
    created_at: nowIso,
    stages: stages.map(([sName, color, kind], i) => ({
      id: uuid(`0000000${n}`.slice(-8).replace(/^0/, "c"), i + 1),
      tenant_id: DEMO_TENANT_ID,
      pipeline_id: id,
      name: sName,
      position: i,
      color,
      kind: kind ?? "open",
      created_at: nowIso,
    })),
  };
}

export const demoPipelines: PipelineWithStages[] = [
  pipeline(1, "Vendas", true, [
    ["Novo Lead", "#6366f1"],
    ["Em Atendimento", "#0ea5e9"],
    ["Qualificado", "#14b8a6"],
    ["Visita Agendada", "#f59e0b"],
    ["Proposta/Simulação", "#a855f7"],
    ["Vendido", "#22c55e", "won"],
    ["Perdido", "#ef4444", "lost"],
  ]),
  pipeline(2, "Avaliação de Usados", false, [
    ["Solicitado", "#6366f1"],
    ["Avaliação Agendada", "#f59e0b"],
    ["Avaliado", "#0ea5e9"],
    ["Proposta Enviada", "#a855f7"],
    ["Comprado", "#22c55e", "won"],
    ["Perdido", "#ef4444", "lost"],
  ]),
  pipeline(3, "Financiamento", false, [
    ["Documentação", "#6366f1"],
    ["Em Análise", "#f59e0b"],
    ["Aprovado", "#14b8a6"],
    ["Contratado", "#22c55e", "won"],
    ["Reprovado", "#ef4444", "lost"],
  ]),
];

// ---------------------------------------------------------------- estoque
type V = [string, string, string, number, number, number, string, VehicleRow["transmission"], VehicleRow["fuel"], number, VehicleRow["status"], string[]];
const vehiclesRaw: V[] = [
  ["Chevrolet", "Onix", "LTZ 1.0 Turbo", 2021, 2022, 38200, "Branco Summit", "automatico", "flex", 82900, "disponivel", ["Central multimídia", "Câmera de ré", "Android Auto / Apple CarPlay", "Único dono"]],
  ["Hyundai", "HB20", "Platinum Plus 1.0 TGDI", 2022, 2023, 24100, "Prata Sand", "automatico", "flex", 92500, "disponivel", ["Bancos de couro", "Chave presencial", "Faróis de LED", "Sensor de estacionamento"]],
  ["Jeep", "Compass", "Longitude 1.3 T270", 2021, 2022, 52300, "Cinza Granite", "automatico", "flex", 139900, "disponivel", ["Teto solar", "Bancos de couro", "Piloto automático", "Revisões na concessionária"]],
  ["Toyota", "Hilux", "SRV 2.8 4x4 Diesel", 2020, 2020, 91000, "Preto Attitude", "automatico", "diesel", 229900, "disponivel", ["Tração 4x4", "Bancos de couro", "Piloto automático", "Manual e chave reserva"]],
  ["Toyota", "Corolla", "XEi 2.0 Dynamic Force", 2022, 2023, 21400, "Prata Supernova", "cvt", "flex", 142900, "reservado", ["Central multimídia", "Piloto automático", "Faróis de LED", "Único dono"]],
  ["Fiat", "Strada", "Volcano 1.3 CD", 2023, 2023, 18900, "Vermelho Montecarlo", "manual", "flex", 109900, "disponivel", ["Central multimídia", "Rodas de liga leve", "Sensor de estacionamento"]],
  ["Volkswagen", "T-Cross", "Highline 1.4 TSI", 2021, 2022, 41700, "Azul Biscay", "automatico", "flex", 129900, "disponivel", ["Teto solar", "Câmera de ré", "Chave presencial", "Faróis de LED"]],
  ["Jeep", "Renegade", "Sport 1.3 T270", 2022, 2022, 33800, "Branco Ambiente", "automatico", "flex", 109500, "disponivel", ["Central multimídia", "Controle de tração", "Rodas de liga leve"]],
  ["Nissan", "Kicks", "SV 1.6 CVT", 2021, 2021, 47200, "Cinza Grafite", "cvt", "flex", 94900, "disponivel", ["Câmera de ré", "Piloto automático", "Central multimídia"]],
  ["Honda", "Civic", "EXL 2.0 CVT", 2019, 2020, 63500, "Preto Cristal", "cvt", "flex", 124900, "disponivel", ["Bancos de couro", "Partida por botão", "Piloto automático"]],
  ["Chevrolet", "Tracker", "Premier 1.2 Turbo", 2022, 2023, 27600, "Azul Eclipse", "automatico", "flex", 132900, "vendido", ["Teto solar", "Bancos de couro", "Chave presencial"]],
  ["Hyundai", "Creta", "Ultimate 2.0", 2022, 2022, 35100, "Branco Atlas", "automatico", "flex", 136900, "disponivel", ["Teto solar", "Bancos de couro", "Câmera de ré", "Faróis de LED"]],
];

export const demoVehicles: VehicleRow[] = vehiclesRaw.map(
  ([brand, model, version, yf, ym, km, color, transmission, fuel, price, status, features], i) => ({
    id: uuid("0000000d", i + 1),
    tenant_id: DEMO_TENANT_ID,
    brand,
    model,
    version,
    year_manufacture: yf,
    year_model: ym,
    km,
    color,
    transmission,
    fuel,
    plate: ["QTA2B41", "RKF7C19", "PBX4E22", "OVH9A08", "SFD1J63", "TAB3H90", "RJQ5D11", "SEZ8F47", "PAT2G35", "OKM6I72", "SGL0B84", "RXA4C56"][i] ?? null,
    price,
    description:
      "Veículo revisado, com laudo cautelar aprovado e garantia de 3 meses de motor e câmbio. Aceitamos seu usado na troca e financiamos em até 60x.",
    features,
    status,
    cover_url: null,
    created_at: new Date(Date.now() - (i + 2) * 86400000 * 1.7).toISOString(),
    updated_at: nowIso,
  }),
);

// ---------------------------------------------------------------- leads
const FIRST = ["Carlos", "Juliana", "Rafael", "Patrícia", "Bruno", "Camila", "Diego", "Larissa", "Thiago", "Aline", "Gustavo", "Mariana", "Felipe", "Renata", "Rodrigo", "Vanessa", "Leonardo", "Beatriz", "André", "Tatiane", "Marcelo", "Daniela", "Eduardo", "Priscila", "Vinícius", "Natália", "Fábio", "Jéssica", "Henrique", "Letícia", "Paulo", "Sabrina", "Igor", "Débora", "Mateus", "Karina", "Wellington", "Bianca"];
const LAST = ["Souza", "Ferreira", "Oliveira", "Almeida", "Santos", "Pereira", "Costa", "Rodrigues", "Gomes", "Martins", "Araújo", "Carvalho", "Ribeiro", "Barbosa", "Rocha", "Dias", "Moreira", "Nascimento", "Teixeira", "Cardoso"];
const CITIES = ["Brasília", "Taguatinga", "Águas Claras", "Ceilândia", "Gama", "Sobradinho", "Goiânia", "Aparecida de Goiânia", "Anápolis", "Valparaíso de Goiás", "Luziânia", "Formosa"];
const CAMPAIGNS = ["Onix Outubro", "Feirão SUV", "Remarketing Estoque", "Pickups Agro", null];
const TAGS = ["Quente", "Financiamento aprovado", "Troca", "Retornar", "VIP"];

const r = rng(20261005);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(r() * arr.length)] as T;

const sales = demoPipelines[0]!;
const stageWeights = [9, 8, 6, 4, 4, 5, 4]; // quantidade de leads por etapa do funil Vendas
const sellerIds = demoTeam.filter((m) => m.receives_leads).map((m) => m.id);
const sources: LeadSource[] = ["meta_ads", "meta_ads", "meta_ads", "instagram", "instagram", "whatsapp", "portal", "site", "indicacao", "loja_fisica"];
const lostReasons: LostReason[] = ["comprou_outra_loja", "sem_credito", "preco", "desistiu", "nao_respondeu"];
const payments: (PaymentMethod | null)[] = ["financiado", "financiado", "a_vista", "consorcio", null];

const leads: LeadRow[] = [];
let n = 0;
sales.stages.forEach((stage, si) => {
  for (let k = 0; k < (stageWeights[si] ?? 3); k++) {
    n++;
    const first = FIRST[(n * 7) % FIRST.length]!;
    const name = `${first} ${pick(LAST)}${r() > 0.7 ? ` ${pick(LAST)}` : ""}`;
    const ddd = r() > 0.45 ? "61" : "62";
    const phone = `55${ddd}9${String(81000000 + Math.floor(r() * 18999999)).slice(0, 8)}`;
    const vehicle = r() > 0.15 ? pick(demoVehicles) : null;
    const source = pick(sources);
    // idade do lead: etapas iniciais são mais recentes
    const ageMin =
      si === 0 ? [4, 9, 22, 41, 75, 130, 300, 600, 1500][k] ?? 60 * (k + 1) : (si + 1) * 60 * 24 * (0.3 + r() * 1.8) + k * 300;
    const created = new Date(Date.now() - ageMin * 60000);
    const contacted = si > 0 || k >= 5;
    const firstContact = contacted ? new Date(created.getTime() + (3 + r() * 40) * 60000) : null;
    const kind = stage.kind;
    const campaign = source === "meta_ads" || source === "instagram" ? pick(CAMPAIGNS) : null;
    const hasTrade = r() > 0.65;
    leads.push({
      id: uuid("0000000e", n),
      tenant_id: DEMO_TENANT_ID,
      pipeline_id: sales.id,
      stage_id: stage.id,
      assigned_to: si === 0 && k === 0 ? null : sellerIds[n % sellerIds.length]!,
      name,
      phone,
      email: r() > 0.5 ? `${first.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}${Math.floor(r() * 90 + 10)}@gmail.com` : null,
      city: pick(CITIES),
      cpf: null,
      source,
      campaign,
      ad_name: campaign ? `${campaign} · Criativo ${1 + Math.floor(r() * 3)}` : null,
      utm_source: source === "meta_ads" ? "facebook" : source === "instagram" ? "instagram" : null,
      utm_medium: campaign ? "paid_social" : null,
      utm_campaign: campaign ? campaign.toLowerCase().replace(/\s+/g, "-") : null,
      utm_content: null,
      utm_term: null,
      vehicle_id: vehicle?.id ?? null,
      vehicle_interest: vehicle ? null : pick(["SUV automático até 120 mil", "Picape diesel", "Hatch econômico", "Sedan para Uber"]),
      price_min: null,
      price_max: vehicle ? null : Math.round((60 + r() * 90) * 1000),
      down_payment: r() > 0.4 ? Math.round((10 + r() * 40)) * 1000 : null,
      has_trade_in: hasTrade,
      trade_in_model: hasTrade ? pick(["Gol 1.6 2015", "Palio 1.0 2013", "Corolla 2016", "Fox 2017", "Uno Way 2018", "Ka SE 2019"]) : null,
      trade_in_year: hasTrade ? 2013 + Math.floor(r() * 7) : null,
      trade_in_km: hasTrade ? 60000 + Math.floor(r() * 90000) : null,
      payment_method: pick(payments),
      value: vehicle?.price ?? null,
      tags: r() > 0.6 ? [pick(TAGS)] : [],
      position: k,
      lost_reason: kind === "lost" ? pick(lostReasons) : null,
      lost_note: null,
      stage_changed_at: new Date(created.getTime() + ageMin * 60000 * 0.5).toISOString(),
      first_contact_at: firstContact?.toISOString() ?? null,
      last_contact_at: firstContact?.toISOString() ?? null,
      won_at: kind === "won" ? new Date(Date.now() - k * 86400000).toISOString() : null,
      lost_at: kind === "lost" ? new Date(Date.now() - k * 86400000).toISOString() : null,
      created_by: null,
      created_at: created.toISOString(),
      updated_at: created.toISOString(),
    });
  }
});
export const demoLeads = leads;

// ---------------------------------------------------------------- timeline + tarefas
export const demoEvents: LeadEventRow[] = [];
export const demoTasks: TaskRow[] = [];
let ev = 0;
for (const l of leads) {
  demoEvents.push({
    id: uuid("0000000f", ++ev),
    tenant_id: DEMO_TENANT_ID,
    lead_id: l.id,
    actor_id: null,
    type: "created",
    data: { source: l.source, campaign: l.campaign },
    created_at: l.created_at,
  });
  if (l.first_contact_at) {
    demoEvents.push({
      id: uuid("0000000f", ++ev),
      tenant_id: DEMO_TENANT_ID,
      lead_id: l.id,
      actor_id: l.assigned_to,
      type: "whatsapp",
      data: { template: "Saudação" },
      created_at: l.first_contact_at,
    });
  }
  const stageIdx = sales.stages.findIndex((s) => s.id === l.stage_id);
  if (stageIdx > 0) {
    demoEvents.push({
      id: uuid("0000000f", ++ev),
      tenant_id: DEMO_TENANT_ID,
      lead_id: l.id,
      actor_id: l.assigned_to,
      type: "stage_changed",
      data: { from: sales.stages[0]!.name, to: sales.stages[stageIdx]!.name, lost_reason: l.lost_reason },
      created_at: l.stage_changed_at,
    });
  }
  if (stageIdx === 3) {
    demoTasks.push({
      id: uuid("00000010", demoTasks.length + 1),
      tenant_id: DEMO_TENANT_ID,
      lead_id: l.id,
      assigned_to: l.assigned_to,
      type: "visita",
      title: "Visita na loja",
      description: null,
      due_at: new Date(Date.now() + (demoTasks.length + 1) * 3 * 3600000).toISOString(),
      done_at: null,
      template_id: null,
      created_by: l.assigned_to,
      created_at: l.stage_changed_at,
      updated_at: l.stage_changed_at,
    });
  }
}

// ---------------------------------------------------------------- templates
export const demoTemplates: MessageTemplateRow[] = (
  [
    ["Saudação", "saudacao", "Olá, {nome}! Aqui é {vendedor}, da {loja}. Vi seu interesse no {veiculo} e estou à disposição para te ajudar. Posso te enviar mais detalhes?"],
    ["Ficha do veículo", "ficha_veiculo", "{nome}, segue a ficha do {veiculo}:\n\n{ficha}\n\nQualquer dúvida, é só me chamar!"],
    ["Confirmação de visita", "visita", "Oi, {nome}! Passando para confirmar sua visita à {loja} para conhecer o {veiculo}. Te aguardo! — {vendedor}"],
    ["Follow-up D+1", "follow_up", "Oi, {nome}, tudo bem? Conseguiu ver as informações do {veiculo}? Posso simular um financiamento pra você."],
    ["Follow-up D+3", "follow_up", "{nome}, o {veiculo} ainda está disponível aqui na {loja}. Quer agendar um test drive sem compromisso?"],
    ["Follow-up D+7", "follow_up", "Oi, {nome}! Chegaram novidades no estoque da {loja}. Ainda está procurando carro? Posso te mandar algumas opções."],
  ] as const
).map(([name, category, body], i) => ({
  id: uuid("00000011", i + 1),
  tenant_id: DEMO_TENANT_ID,
  name,
  category,
  body,
  position: i,
  active: true,
  created_at: nowIso,
  updated_at: nowIso,
}));
