import { z } from "zod";
import { normalizePhone } from "@/lib/format";

export const BR_TIMEZONES = [
  { value: "America/Sao_Paulo", label: "Brasília (DF, GO, SP, RJ, MG, Sul…)" },
  { value: "America/Bahia", label: "Bahia" },
  { value: "America/Fortaleza", label: "Fortaleza (CE, RN, PB, PI, MA)" },
  { value: "America/Recife", label: "Recife (PE)" },
  { value: "America/Maceio", label: "Maceió (AL, SE)" },
  { value: "America/Belem", label: "Belém (PA, AP)" },
  { value: "America/Araguaina", label: "Araguaína (TO)" },
  { value: "America/Cuiaba", label: "Cuiabá (MT)" },
  { value: "America/Campo_Grande", label: "Campo Grande (MS)" },
  { value: "America/Manaus", label: "Manaus (AM)" },
  { value: "America/Porto_Velho", label: "Porto Velho (RO)" },
  { value: "America/Boa_Vista", label: "Boa Vista (RR)" },
  { value: "America/Rio_Branco", label: "Rio Branco (AC)" },
  { value: "America/Noronha", label: "Fernando de Noronha" },
] as const;

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida (use #RRGGBB)").transform((v) => v.toLowerCase());

const optionalPhone = z
  .string()
  .trim()
  .optional()
  .transform((v, ctx) => {
    if (!v) return null;
    const n = normalizePhone(v);
    if (!n) {
      ctx.addIssue({ code: "custom", message: "WhatsApp inválido. Ex.: (61) 99999-9999" });
      return z.NEVER;
    }
    return n;
  });

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || null)
  .refine((v) => v === null || /^https:\/\/.+/.test(v), "Use um link https:// válido");

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9](?:[a-z0-9-]{0,46}[a-z0-9])?$/, "Use letras minúsculas, números e hífen (ex.: abc-multimarcas)")
  .refine((s) => !["www", "app", "admin", "api", "agencia"].includes(s), "Endereço reservado");

export const brandingSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome da loja").max(80),
  primaryColor: hex,
  secondaryColor: hex,
  logoUrl: z.string().url().nullable().optional(),
  whatsapp: optionalPhone,
  timezone: z.string().min(1),
  offersGroupUrl: optionalUrl,
});
export type BrandingInput = z.input<typeof brandingSchema>;
export type BrandingOutput = z.output<typeof brandingSchema>;

export const newTenantSchema = brandingSchema.extend({
  slug: slugSchema,
  managerName: z.string().trim().min(2, "Informe o nome do gerente"),
  managerEmail: z.string().trim().toLowerCase().email("E-mail inválido"),
  managerPassword: z.string().min(8, "Mínimo de 8 caracteres"),
});
export type NewTenantInput = z.input<typeof newTenantSchema>;
export type NewTenantOutput = z.output<typeof newTenantSchema>;

export const tenantAdminSchema = z.object({
  slug: slugSchema,
  customDomain: z
    .string()
    .trim()
    .toLowerCase()
    .optional()
    .transform((v) => v || null)
    .refine((v) => v === null || /^[a-z0-9.-]+\.[a-z]{2,}$/.test(v), "Domínio inválido"),
  active: z.boolean(),
});
export type TenantAdminInput = z.input<typeof tenantAdminSchema>;

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
