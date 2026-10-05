import { env } from "@/lib/env";
import { formatKm } from "@/lib/format";
import type { Fuel, Transmission, VehicleRow, VehicleStatus } from "@/types/database";

type VehicleLike = Pick<VehicleRow, "brand" | "model"> &
  Partial<Pick<VehicleRow, "version" | "year_model" | "year_manufacture" | "km">>;

export function vehicleTitle(v: VehicleLike, opts?: { year?: boolean }) {
  const base = [v.brand, v.model, v.version].filter(Boolean).join(" ");
  return opts?.year === false || !v.year_model ? base : `${base} ${v.year_model}`;
}

export function vehicleShortTitle(v: VehicleLike) {
  return [v.model, v.year_model].filter(Boolean).join(" ");
}

export function vehicleYears(v: Pick<VehicleRow, "year_manufacture" | "year_model">) {
  if (!v.year_manufacture && !v.year_model) return "";
  if (!v.year_manufacture || v.year_manufacture === v.year_model) return String(v.year_model ?? v.year_manufacture);
  return `${v.year_manufacture}/${v.year_model}`;
}

export function vehicleSpecsLine(v: Partial<Pick<VehicleRow, "year_manufacture" | "year_model" | "km" | "transmission">>) {
  return [
    v.year_model ? vehicleYears({ year_manufacture: v.year_manufacture ?? null, year_model: v.year_model }) : null,
    typeof v.km === "number" ? formatKm(v.km) : null,
    v.transmission ? TRANSMISSION_LABEL[v.transmission] : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** URL pública de uma foto: caminho do Storage, URL absoluta ou blob local (modo demonstração). */
export function photoUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^(https?:|blob:|data:|\/)/.test(path)) return path;
  return `${env.supabaseUrl}/storage/v1/object/public/vehicle-photos/${path}`;
}

export const STATUS_LABEL: Record<VehicleStatus, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

export const TRANSMISSION_LABEL: Record<Transmission, string> = {
  manual: "Manual",
  automatico: "Automático",
  cvt: "CVT",
  automatizado: "Automatizado",
};

export const FUEL_LABEL: Record<Fuel, string> = {
  flex: "Flex",
  gasolina: "Gasolina",
  etanol: "Etanol",
  diesel: "Diesel",
  hibrido: "Híbrido",
  eletrico: "Elétrico",
  gnv: "GNV",
};

export const COMMON_FEATURES = [
  "Ar-condicionado",
  "Direção elétrica",
  "Vidros elétricos",
  "Travas elétricas",
  "Central multimídia",
  "Android Auto / Apple CarPlay",
  "Câmera de ré",
  "Sensor de estacionamento",
  "Bancos de couro",
  "Teto solar",
  "Rodas de liga leve",
  "Piloto automático",
  "Airbags laterais",
  "Faróis de LED",
  "Chave presencial",
  "Partida por botão",
  "Controle de tração",
  "Tração 4x4",
  "Único dono",
  "Revisões na concessionária",
  "Manual e chave reserva",
];

export type BodyType = "hatch" | "sedan" | "suv" | "pickup";

const BODY_BY_MODEL: Record<string, BodyType> = {
  onix: "hatch", hb20: "hatch", polo: "hatch", gol: "hatch", argo: "hatch", mobi: "hatch", kwid: "hatch", fit: "hatch", "208": "hatch", up: "hatch",
  corolla: "sedan", civic: "sedan", virtus: "sedan", cruze: "sedan", sentra: "sedan", city: "sedan", cronos: "sedan", "hb20s": "sedan", "onix plus": "sedan", jetta: "sedan", versa: "sedan",
  compass: "suv", "t-cross": "suv", renegade: "suv", kicks: "suv", creta: "suv", tracker: "suv", "hr-v": "suv", nivus: "suv", taos: "suv", tiguan: "suv", "corolla cross": "suv", pulse: "suv", fastback: "suv", duster: "suv", "sw4": "suv", commander: "suv",
  hilux: "pickup", strada: "pickup", toro: "pickup", s10: "pickup", ranger: "pickup", amarok: "pickup", saveiro: "pickup", montana: "pickup", frontier: "pickup", l200: "pickup", oroch: "pickup",
};

export function bodyTypeOf(model: string): BodyType {
  const m = model.toLowerCase().trim();
  return BODY_BY_MODEL[m] ?? BODY_BY_MODEL[m.split(" ")[0] ?? ""] ?? "hatch";
}
