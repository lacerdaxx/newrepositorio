"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ColorInput } from "@/components/ui/color-input";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { createTenantAction } from "@/features/tenants/actions";
import { BrandPreview } from "@/features/tenants/components/brand-preview";
import { newTenantSchema, slugify, type NewTenantInput, type NewTenantOutput } from "@/features/tenants/schemas";

function randomPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const arr = crypto.getRandomValues(new Uint32Array(12));
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

export function NewTenantForm({ rootDomain }: { rootDomain: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<NewTenantInput, unknown, NewTenantOutput>({
    resolver: zodResolver(newTenantSchema),
    defaultValues: {
      name: "",
      slug: "",
      primaryColor: "#e30613",
      secondaryColor: "#0a0a0a",
      logoUrl: null,
      whatsapp: "",
      timezone: "America/Sao_Paulo",
      offersGroupUrl: "",
      managerName: "",
      managerEmail: "",
      managerPassword: "",
    },
  });
  const { register, control, watch, setValue, formState, setError, getFieldState } = form;
  const v = watch();
  const err = formState.errors;

  const onSubmit = form.handleSubmit(() => {
    const raw = form.getValues();
    startTransition(async () => {
      const res = await createTenantAction(raw);
      if (!res.ok) {
        for (const [k, msg] of Object.entries(res.fieldErrors ?? {})) setError(k as keyof NewTenantInput, { message: msg });
        toast.error(res.error);
        return;
      }
      toast.success(`${raw.name} criada`, {
        description: `Gerente: ${raw.managerEmail} · senha: ${raw.managerPassword}`,
        duration: 15000,
      });
      router.push(`/admin/lojas/${res.data?.id}`);
    });
  });

  const host = rootDomain && rootDomain !== "localhost" ? `.${rootDomain}` : "";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="flex flex-col gap-5">
        <Card className="flex flex-col gap-5 p-5">
          <h2 className="text-sm font-semibold">Loja</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nome da loja" htmlFor="name" error={err.name?.message}>
              <Input
                id="name"
                autoFocus
                {...register("name", {
                  onChange: (e) => {
                    if (!getFieldState("slug").isDirty) setValue("slug", slugify(e.target.value));
                  },
                })}
              />
            </Field>
            <Field label="Endereço (subdomínio)" htmlFor="slug" error={err.slug?.message}>
              <div className="flex items-center rounded-lg border border-input bg-surface shadow-xs focus-within:border-[color-mix(in_oklch,var(--brand)_55%,var(--border-strong))] focus-within:ring-[3px] focus-within:ring-ring">
                <input
                  id="slug"
                  {...register("slug")}
                  className="h-9 min-w-0 flex-1 bg-transparent px-3 font-mono text-sm outline-none"
                />
                {host && <span className="pr-3 font-mono text-xs text-subtle-foreground">{host}</span>}
              </div>
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Cor primária" error={err.primaryColor?.message}>
              <Controller control={control} name="primaryColor" render={({ field }) => <ColorInput value={field.value} onChange={field.onChange} />} />
            </Field>
            <Field label="Cor secundária" error={err.secondaryColor?.message}>
              <Controller control={control} name="secondaryColor" render={({ field }) => <ColorInput value={field.value} onChange={field.onChange} />} />
            </Field>
          </div>
          <Field label="WhatsApp da loja" htmlFor="whatsapp" error={err.whatsapp?.message} optional>
            <Controller
              control={control}
              name="whatsapp"
              render={({ field }) => <PhoneInput id="whatsapp" value={field.value ?? ""} onChange={field.onChange} />}
            />
          </Field>
          <p className="text-xs text-subtle-foreground">
            A loja já nasce com os funis Vendas, Avaliação de Usados e Financiamento, templates de WhatsApp e expediente
            seg–sex 8h–18h / sáb 8h–13h. Logo e demais ajustes ficam na próxima tela.
          </p>
        </Card>

        <Card className="flex flex-col gap-5 p-5">
          <h2 className="text-sm font-semibold">Gerente da loja</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nome" htmlFor="managerName" error={err.managerName?.message}>
              <Input id="managerName" {...register("managerName")} />
            </Field>
            <Field label="E-mail" htmlFor="managerEmail" error={err.managerEmail?.message}>
              <Input id="managerEmail" type="email" autoComplete="off" {...register("managerEmail")} />
            </Field>
          </div>
          <Field label="Senha inicial" htmlFor="managerPassword" error={err.managerPassword?.message} hint="Envie ao gerente; ele pode trocar depois.">
            <div className="flex gap-2">
              <Input id="managerPassword" autoComplete="new-password" {...register("managerPassword")} className="font-mono" />
              <Button type="button" variant="secondary" onClick={() => setValue("managerPassword", randomPassword(), { shouldValidate: true })}>
                <Wand2 /> Gerar
              </Button>
            </div>
          </Field>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={pending}>
            {pending && <Loader2 className="animate-spin" />} Criar loja
          </Button>
        </div>
      </div>

      <div className="xl:sticky xl:top-16 xl:self-start">
        <BrandPreview
          name={v.name}
          primaryColor={/^#[0-9a-f]{6}$/i.test(v.primaryColor) ? v.primaryColor : "#2563eb"}
          secondaryColor={/^#[0-9a-f]{6}$/i.test(v.secondaryColor) ? v.secondaryColor : "#0a0a0a"}
          logoUrl={null}
        />
      </div>
    </form>
  );
}
