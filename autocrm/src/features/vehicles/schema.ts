import { z } from "zod";

const year = z
  .string()
  .trim()
  .refine((v) => !v || (/^\d{4}$/.test(v) && Number(v) >= 1950 && Number(v) <= new Date().getFullYear() + 1), "Ano inválido");

export const vehicleFormSchema = z
  .object({
    brand: z.string().trim().min(2, "Informe a marca"),
    model: z.string().trim().min(1, "Informe o modelo"),
    version: z.string().trim(),
    year_manufacture: year,
    year_model: year,
    km: z.string().trim(),
    color: z.string().trim(),
    transmission: z.enum(["manual", "automatico", "cvt", "automatizado", "none"]),
    fuel: z.enum(["flex", "gasolina", "etanol", "diesel", "hibrido", "eletrico", "gnv", "none"]),
    plate: z
      .string()
      .trim()
      .toUpperCase()
      .refine((v) => !v || /^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/.test(v), "Placa inválida (ABC1D23)"),
    price: z.number().nullable(),
    status: z.enum(["disponivel", "reservado", "vendido"]),
    description: z.string().trim().max(3000),
    features: z.array(z.string()),
  })
  .refine((v) => !v.year_manufacture || !v.year_model || Number(v.year_model) >= Number(v.year_manufacture), {
    message: "Ano/modelo não pode ser menor que o de fabricação",
    path: ["year_model"],
  });

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export const BRANDS = [
  "Chevrolet", "Fiat", "Volkswagen", "Hyundai", "Toyota", "Jeep", "Renault", "Honda", "Nissan", "Ford",
  "Peugeot", "Citroën", "Mitsubishi", "BYD", "Caoa Chery", "Kia", "BMW", "Mercedes-Benz", "Audi", "Ram",
];
