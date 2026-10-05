"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ColorInput } from "@/components/ui/color-input";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateBrandingAction } from "../actions";
import { BR_TIMEZONES, brandingSchema, type BrandingInput, type BrandingOutput } from "../schemas";
import { BrandPreview } from "./brand-preview";
import { LogoUpload } from "./logo-upload";

export function BrandingForm({ tenantId, defaults }: { tenantId: string; defaults: BrandingInput }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<BrandingInput, unknown, BrandingOutput>({
    resolver: zodResolver(brandingSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });
  const { register, control, watch, formState, setError, reset } = form;
  const values = watch();

  const onSubmit = form.handleSubmit(() => {
    const raw = form.getValues();
    startTransition(async () => {
      const res = await updateBrandingAction(tenantId, raw);
      if (!res.ok) {
        for (const [k, msg] of Object.entries(res.fieldErrors ?? {})) setError(k as keyof BrandingInput, { message: msg });
        toast.error(res.error);
        return;
      }
      toast.success(res.message ?? "Salvo");
      reset(raw);
      router.refresh();
    });
  });

  const err = formState.errors;

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <Card className="flex flex-col gap-5 p-5">
        <Field label="Logo">
          <Controller
            control={control}
            name="logoUrl"
            render={({ field }) => (
              <LogoUpload tenantId={tenantId} value={field.value ?? null} onChange={(v) => field.onChange(v)} />
            )}
          />
        </Field>
        <Field label="Nome da loja" htmlFor="name" error={err.name?.message}>
          <Input id="name" {...register("name")} aria-invalid={!!err.name} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Cor primária" htmlFor="primaryColor" error={err.primaryColor?.message} hint="Botões, destaques e gráficos.">
            <Controller
              control={control}
              name="primaryColor"
              render={({ field }) => <ColorInput id="primaryColor" value={field.value} onChange={field.onChange} invalid={!!err.primaryColor} />}
            />
          </Field>
          <Field label="Cor secundária" htmlFor="secondaryColor" error={err.secondaryColor?.message} hint="Páginas públicas e PDF.">
            <Controller
              control={control}
              name="secondaryColor"
              render={({ field }) => <ColorInput id="secondaryColor" value={field.value} onChange={field.onChange} invalid={!!err.secondaryColor} />}
            />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="WhatsApp da loja" htmlFor="whatsapp" error={err.whatsapp?.message} optional>
            <Controller
              control={control}
              name="whatsapp"
              render={({ field }) => (
                <PhoneInput id="whatsapp" value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} aria-invalid={!!err.whatsapp} />
              )}
            />
          </Field>
          <Field label="Fuso horário" error={err.timezone?.message}>
            <Controller
              control={control}
              name="timezone"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="Fuso horário">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BR_TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
        <Field
          label="Link do grupo de ofertas"
          htmlFor="offersGroupUrl"
          error={err.offersGroupUrl?.message}
          hint="Convite do grupo de WhatsApp exibido após o envio do formulário."
          optional
        >
          <Input id="offersGroupUrl" placeholder="https://chat.whatsapp.com/…" {...register("offersGroupUrl")} />
        </Field>
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="ghost" disabled={!formState.isDirty || pending} onClick={() => reset()}>
            Descartar
          </Button>
          <Button type="submit" disabled={!formState.isDirty || pending}>
            {pending && <Loader2 className="animate-spin" />} Salvar marca
          </Button>
        </div>
      </Card>

      <div className="xl:sticky xl:top-16 xl:self-start">
        <BrandPreview
          name={values.name}
          primaryColor={/^#[0-9a-f]{6}$/i.test(values.primaryColor) ? values.primaryColor : "#2563eb"}
          secondaryColor={/^#[0-9a-f]{6}$/i.test(values.secondaryColor) ? values.secondaryColor : "#0a0a0a"}
          logoUrl={values.logoUrl ?? null}
        />
      </div>
    </form>
  );
}
