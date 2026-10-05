"use server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";
import { normalizePhone } from "@/lib/format";
import type { ActionResult } from "@/lib/action";
import { getPublicTenantOrNull } from "@/features/tenants/server";
import { sourceFromUtm } from "./utm";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120),
  phone: z.string().trim(),
  vehicleId: z.string().uuid().nullable().optional(),
  utm: z.record(z.string(), z.string().max(160)).optional(),
  extra: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  website: z.string().optional(), // honeypot anti-spam
});

/**
 * Captação pública (página do veículo, formulário, catálogo).
 * A loja vem do host da requisição (middleware), nunca do cliente.
 */
export async function submitPublicLeadAction(input: z.input<typeof schema>): Promise<ActionResult<{ duplicate: boolean }>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  const d = parsed.data;
  if (d.website) return { ok: true, data: { duplicate: false } }; // bot: finge sucesso

  const phone = normalizePhone(d.phone);
  if (!phone) return { ok: false, error: "WhatsApp inválido. Ex.: (61) 99999-9999", fieldErrors: { phone: "WhatsApp inválido" } };

  const tenant = await getPublicTenantOrNull();
  if (!tenant) return { ok: false, error: "Loja indisponível no momento." };
  if (!isSupabaseConfigured) return { ok: true, data: { duplicate: false } }; // modo demonstração

  const utm = d.utm ?? {};
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.rpc("submit_public_lead", {
    p_tenant_slug: tenant.slug,
    p_name: d.name,
    p_phone: phone,
    p_vehicle_id: d.vehicleId ?? null,
    p_source: sourceFromUtm(utm),
    p_payload: { ...utm, ...(d.extra ?? {}) },
  });
  if (error) return { ok: false, error: "Não foi possível enviar agora. Tente novamente em instantes." };
  return { ok: true, data: { duplicate: Boolean(data?.duplicate) } };
}
