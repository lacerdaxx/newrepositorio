import { z } from "zod";

export const newUserSchema = z.object({
  tenantId: z.string().uuid(),
  fullName: z.string().trim().min(2, "Informe o nome"),
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(8, "Mínimo de 8 caracteres"),
  role: z.enum(["gerente", "vendedor"]),
});
export type NewUserInput = z.input<typeof newUserSchema>;

export const updateUserSchema = z.object({
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  fullName: z.string().trim().min(2).optional(),
  role: z.enum(["gerente", "vendedor"]).optional(),
  active: z.boolean().optional(),
  receivesLeads: z.boolean().optional(),
  distributionWeight: z.number().int().min(0).max(10).optional(),
});
export type UpdateUserInput = z.input<typeof updateUserSchema>;

export const ROLE_LABEL = { superadmin: "Agência", gerente: "Gerente", vendedor: "Vendedor" } as const;
