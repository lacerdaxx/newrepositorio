"use client";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { PhoneInput, maskPhone } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TagInput } from "@/components/ui/tag-input";
import { useUpdateLead, useVehicles } from "@/features/data/queries";
import type { BoardLead, LeadPatch } from "@/features/data/types";
import { vehicleTitle } from "@/features/vehicles/utils";
import { normalizePhone } from "@/lib/format";
import type { LeadSource, PaymentMethod } from "@/types/database";
import { PAYMENT_LABEL, SOURCE_META, SOURCES } from "../labels";

type FormValues = {
  name: string;
  phone: string;
  email: string;
  city: string;
  cpf: string;
  vehicle_id: string;
  vehicle_interest: string;
  price_max: number | null;
  down_payment: number | null;
  payment_method: PaymentMethod | "none";
  has_trade_in: boolean;
  trade_in_model: string;
  trade_in_year: string;
  trade_in_km: string;
  value: number | null;
  tags: string[];
  source: LeadSource;
  campaign: string;
  ad_name: string;
};

const SUGGESTED_TAGS = ["Quente", "Frio", "Troca", "Financiamento aprovado", "Retornar", "VIP", "Test drive"];

function toForm(l: BoardLead): FormValues {
  return {
    name: l.name,
    phone: maskPhone(l.phone),
    email: l.email ?? "",
    city: l.city ?? "",
    cpf: l.cpf ?? "",
    vehicle_id: l.vehicle_id ?? "none",
    vehicle_interest: l.vehicle_interest ?? "",
    price_max: l.price_max === null ? null : Number(l.price_max),
    down_payment: l.down_payment === null ? null : Number(l.down_payment),
    payment_method: l.payment_method ?? "none",
    has_trade_in: l.has_trade_in,
    trade_in_model: l.trade_in_model ?? "",
    trade_in_year: l.trade_in_year ? String(l.trade_in_year) : "",
    trade_in_km: l.trade_in_km ? String(l.trade_in_km) : "",
    value: l.value === null ? null : Number(l.value),
    tags: l.tags,
    source: l.source,
    campaign: l.campaign ?? "",
    ad_name: l.ad_name ?? "",
  };
}

const nul = (s: string) => (s.trim() ? s.trim() : null);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-3 text-[11px] font-medium uppercase tracking-wider text-subtle-foreground">{title}</legend>
      {children}
    </fieldset>
  );
}

export function DetailsTab({ lead }: { lead: BoardLead }) {
  const vehicles = useVehicles();
  const update = useUpdateLead();
  const form = useForm<FormValues>({ defaultValues: toForm(lead) });
  const { register, control, watch, reset, formState, setError, handleSubmit } = form;
  const hasTrade = watch("has_trade_in");

  // sincroniza quando o lead muda por fora (realtime/outra aba) e o form está limpo
  useEffect(() => {
    if (!formState.isDirty) reset(toForm(lead));
  }, [lead, formState.isDirty, reset]);

  const onSubmit = handleSubmit((v) => {
    const phone = normalizePhone(v.phone);
    if (!phone) return setError("phone", { message: "WhatsApp inválido" });
    if (v.name.trim().length < 2) return setError("name", { message: "Informe o nome" });
    const cpf = v.cpf.replace(/\D/g, "");
    if (cpf && cpf.length !== 11) return setError("cpf", { message: "CPF deve ter 11 dígitos" });
    const vehicle = vehicles.data?.find((x) => x.id === v.vehicle_id);
    const patch: LeadPatch = {
      name: v.name.trim(),
      phone,
      email: nul(v.email),
      city: nul(v.city),
      cpf: cpf || null,
      vehicle_id: v.vehicle_id === "none" ? null : v.vehicle_id,
      vehicle_interest: nul(v.vehicle_interest),
      price_max: v.price_max,
      down_payment: v.down_payment,
      payment_method: v.payment_method === "none" ? null : v.payment_method,
      has_trade_in: v.has_trade_in,
      trade_in_model: v.has_trade_in ? nul(v.trade_in_model) : null,
      trade_in_year: v.has_trade_in && v.trade_in_year ? Number(v.trade_in_year) : null,
      trade_in_km: v.has_trade_in && v.trade_in_km ? Number(v.trade_in_km.replace(/\D/g, "")) : null,
      value: v.value ?? (vehicle?.price ? Number(vehicle.price) : null),
      tags: v.tags,
      source: v.source,
      campaign: nul(v.campaign),
      ad_name: nul(v.ad_name),
    };
    update.mutate({ id: lead.id, patch }, { onSuccess: () => reset(v) });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-7 pb-20">
      <Section title="Contato">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome" htmlFor="ld-name" error={formState.errors.name?.message}>
            <Input id="ld-name" {...register("name")} />
          </Field>
          <Field label="WhatsApp" htmlFor="ld-phone" error={formState.errors.phone?.message}>
            <Controller control={control} name="phone" render={({ field }) => <PhoneInput id="ld-phone" value={field.value} onChange={field.onChange} />} />
          </Field>
          <Field label="E-mail" htmlFor="ld-email" optional>
            <Input id="ld-email" type="email" {...register("email")} />
          </Field>
          <Field label="Cidade" htmlFor="ld-city" optional>
            <Input id="ld-city" {...register("city")} />
          </Field>
          <Field label="CPF" htmlFor="ld-cpf" optional error={formState.errors.cpf?.message}>
            <Input id="ld-cpf" inputMode="numeric" placeholder="000.000.000-00" {...register("cpf")} />
          </Field>
        </div>
      </Section>

      <Section title="Interesse">
        <Field label="Veículo do estoque">
          <Controller
            control={control}
            name="vehicle_id"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-label="Veículo do estoque">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum veículo vinculado</SelectItem>
                  {(vehicles.data ?? []).map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {vehicleTitle(v)}
                      {v.status !== "disponivel" ? ` (${v.status})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="O que procura" htmlFor="ld-interest" optional hint="Quando não há veículo específico no estoque.">
          <Input id="ld-interest" placeholder="Ex.: SUV automático até R$ 120 mil" {...register("vehicle_interest")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Até (faixa de preço)" optional>
            <Controller control={control} name="price_max" render={({ field }) => <MoneyInput value={field.value} onChange={field.onChange} aria-label="Preço máximo" />} />
          </Field>
          <Field label="Entrada" optional>
            <Controller control={control} name="down_payment" render={({ field }) => <MoneyInput value={field.value} onChange={field.onChange} aria-label="Entrada" />} />
          </Field>
          <Field label="Pagamento">
            <Controller
              control={control}
              name="payment_method"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="Forma de pagamento">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não informado</SelectItem>
                    {(Object.keys(PAYMENT_LABEL) as PaymentMethod[]).map((p) => (
                      <SelectItem key={p} value={p}>
                        {PAYMENT_LABEL[p]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
        <div className="rounded-lg border border-border p-3">
          <label className="flex items-center justify-between gap-3 text-[13px] font-medium">
            Tem carro na troca?
            <Controller control={control} name="has_trade_in" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
          </label>
          <AnimatePresence initial={false}>
            {hasTrade && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="grid gap-3 pt-3 sm:grid-cols-3">
                  <Input placeholder="Modelo (ex.: Gol 1.6)" aria-label="Modelo da troca" {...register("trade_in_model")} />
                  <Input placeholder="Ano" inputMode="numeric" maxLength={4} aria-label="Ano da troca" {...register("trade_in_year")} />
                  <Input placeholder="Km" inputMode="numeric" aria-label="Km da troca" {...register("trade_in_km")} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Valor da negociação" optional hint="Vazio = preço do veículo vinculado.">
            <Controller control={control} name="value" render={({ field }) => <MoneyInput value={field.value} onChange={field.onChange} aria-label="Valor" />} />
          </Field>
          <Field label="Tags" htmlFor="ld-tags">
            <Controller control={control} name="tags" render={({ field }) => <TagInput id="ld-tags" value={field.value} onChange={field.onChange} suggestions={SUGGESTED_TAGS} />} />
          </Field>
        </div>
      </Section>

      <Section title="Origem">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Origem">
            <Controller
              control={control}
              name="source"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="Origem">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {SOURCE_META[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Campanha" htmlFor="ld-campaign" optional>
            <Input id="ld-campaign" {...register("campaign")} />
          </Field>
          <Field label="Anúncio" htmlFor="ld-ad" optional>
            <Input id="ld-ad" {...register("ad_name")} />
          </Field>
        </div>
        {(lead.utm_source || lead.utm_medium || lead.utm_campaign || lead.utm_content) && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg bg-surface-2 p-3 font-mono text-[11.5px] sm:grid-cols-4">
            {(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const).map((k) =>
              lead[k] ? (
                <div key={k} className="min-w-0">
                  <dt className="text-subtle-foreground">{k}</dt>
                  <dd className="truncate">{lead[k]}</dd>
                </div>
              ) : null,
            )}
          </dl>
        )}
      </Section>

      <AnimatePresence>
        {formState.isDirty && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-4 right-4 z-10 flex items-center gap-2 rounded-xl border border-border bg-popover p-2 pl-4 shadow-lg"
          >
            <span className="text-[13px] text-muted-foreground">Alterações não salvas</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => reset(toForm(lead))}>
              Descartar
            </Button>
            <Button type="submit" size="sm" disabled={update.isPending}>
              {update.isPending && <Loader2 className="animate-spin" />} Salvar
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
