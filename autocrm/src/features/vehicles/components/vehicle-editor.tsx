"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Copy, ExternalLink, Loader2, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TagInput } from "@/components/ui/tag-input";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/features/auth/user-provider";
import { qk, useDeleteVehicle, useSaveVehicle, useVehicle, useVehicleLeads } from "@/features/data/queries";
import { useRepo } from "@/features/data/repo-provider";
import type { VehicleWithPhotos } from "@/features/data/types";
import { useLeadDrawer } from "@/features/leads/use-lead-drawer";
import { useTenant } from "@/features/tenants/tenant-provider";
import { usePublicVehicleUrl } from "@/features/whatsapp/use-whatsapp";
import { formatElapsed } from "@/lib/format";
import type { Fuel, Transmission } from "@/types/database";
import { BRANDS, vehicleFormSchema, type VehicleFormValues } from "../schema";
import { COMMON_FEATURES, FUEL_LABEL, photoUrl, STATUS_LABEL, TRANSMISSION_LABEL, vehicleTitle } from "../utils";
import { PhotoManager, type PhotoItem } from "./photo-manager";

const EMPTY: VehicleFormValues = {
  brand: "",
  model: "",
  version: "",
  year_manufacture: "",
  year_model: "",
  km: "",
  color: "",
  transmission: "none",
  fuel: "flex",
  plate: "",
  price: null,
  status: "disponivel",
  description: "",
  features: [],
};

function toForm(v: VehicleWithPhotos): VehicleFormValues {
  return {
    brand: v.brand,
    model: v.model,
    version: v.version ?? "",
    year_manufacture: v.year_manufacture ? String(v.year_manufacture) : "",
    year_model: v.year_model ? String(v.year_model) : "",
    km: v.km !== null ? String(v.km) : "",
    color: v.color ?? "",
    transmission: v.transmission ?? "none",
    fuel: v.fuel ?? "none",
    plate: v.plate ?? "",
    price: v.price !== null ? Number(v.price) : null,
    status: v.status,
    description: v.description ?? "",
    features: v.features,
  };
}

export function VehicleEditor({ vehicleId }: { vehicleId: string | null }) {
  const vehicle = useVehicle(vehicleId);
  if (vehicleId && vehicle.isLoading) return <EditorSkeleton />;
  if (vehicleId && !vehicle.data) {
    return (
      <PageBody className="pt-10 text-center text-sm text-muted-foreground">
        Veículo não encontrado. <Link className="underline" href="/estoque">Voltar ao estoque</Link>
      </PageBody>
    );
  }
  return <EditorForm key={vehicle.data?.id ?? "new"} vehicle={vehicle.data ?? null} />;
}

function EditorForm({ vehicle }: { vehicle: VehicleWithPhotos | null }) {
  const router = useRouter();
  const tenant = useTenant();
  const me = useCurrentUser();
  const repo = useRepo();
  const qc = useQueryClient();
  const save = useSaveVehicle();
  const del = useDeleteVehicle();
  const publicUrl = usePublicVehicleUrl();
  const readOnly = me.role === "vendedor";

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: vehicle ? toForm(vehicle) : EMPTY,
  });
  const { register, control, formState, handleSubmit, reset, watch } = form;
  const err = formState.errors;

  // fotos: veículo existente envia na hora; veículo novo enfileira até salvar
  const [queue, setQueue] = useState<{ id: string; url: string; file: File }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [remoteOrder, setRemoteOrder] = useState<PhotoItem[] | null>(null);
  const remoteItems = useMemo<PhotoItem[]>(
    () => (vehicle?.photos ?? []).map((p) => ({ id: p.id, url: photoUrl(p.storage_path) ?? "" })),
    [vehicle?.photos],
  );
  useEffect(() => setRemoteOrder(null), [vehicle?.photos]);
  const photoItems = vehicle ? (remoteOrder ?? remoteItems) : queue;

  const refreshVehicle = (id: string) => {
    void qc.invalidateQueries({ queryKey: qk.vehicle(id) });
    void qc.invalidateQueries({ queryKey: qk.vehicles(tenant.id) });
  };

  const uploadFiles = async (id: string, files: File[], startAt: number) => {
    if (!repo) return;
    setUploading(true);
    try {
      for (const [i, f] of files.entries()) await repo.uploadVehiclePhoto(tenant.id, id, f, startAt + i);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha no upload");
    } finally {
      setUploading(false);
      refreshVehicle(id);
    }
  };

  const onSubmit = handleSubmit(async (v) => {
    const input = {
      brand: v.brand,
      model: v.model,
      version: v.version || null,
      year_manufacture: v.year_manufacture ? Number(v.year_manufacture) : null,
      year_model: v.year_model ? Number(v.year_model) : v.year_manufacture ? Number(v.year_manufacture) : null,
      km: v.km ? Number(v.km.replace(/\D/g, "")) : null,
      color: v.color || null,
      transmission: v.transmission === "none" ? null : (v.transmission as Transmission),
      fuel: v.fuel === "none" ? null : (v.fuel as Fuel),
      plate: v.plate ? v.plate.replace("-", "") : null,
      price: v.price,
      status: v.status,
      description: v.description || null,
      features: v.features,
    };
    const id = await save.mutateAsync({ id: vehicle?.id ?? null, input });
    reset(v);
    if (!vehicle) {
      if (queue.length) await uploadFiles(id, queue.map((q) => q.file), 0);
      toast.success("Veículo cadastrado");
      router.replace(`/estoque/${id}`);
    } else {
      toast.success("Alterações salvas");
    }
  });

  const title = vehicle ? vehicleTitle(vehicle) : "Novo veículo";
  const link = vehicle ? publicUrl(vehicle.id) : null;
  const status = watch("status");

  return (
    <>
      <PageHeader
        title={title}
        description={
          <span className="flex items-center gap-2">
            <Link href="/estoque" className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="size-3.5" /> Estoque
            </Link>
            {vehicle && <Badge variant={status === "disponivel" ? "success" : status === "reservado" ? "warning" : "danger"}>{STATUS_LABEL[status]}</Badge>}
          </span>
        }
        actions={
          !readOnly && (
            <Button onClick={onSubmit} disabled={save.isPending || uploading || (!!vehicle && !formState.isDirty)}>
              {(save.isPending || uploading) && <Loader2 className="animate-spin" />}
              {vehicle ? "Salvar alterações" : "Cadastrar veículo"}
            </Button>
          )
        }
      />
      <PageBody className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <fieldset disabled={readOnly} className="contents">
            <Card className="flex flex-col gap-4 p-5">
              <h2 className="text-sm font-semibold">Veículo</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Marca" htmlFor="v-brand" error={err.brand?.message}>
                  <Input id="v-brand" list="brands" {...register("brand")} />
                  <datalist id="brands">
                    {BRANDS.map((b) => (
                      <option key={b} value={b} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Modelo" htmlFor="v-model" error={err.model?.message}>
                  <Input id="v-model" placeholder="Onix" {...register("model")} />
                </Field>
                <Field label="Versão" htmlFor="v-version" optional>
                  <Input id="v-version" placeholder="LTZ 1.0 Turbo" {...register("version")} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Field label="Ano fabricação" htmlFor="v-yf" error={err.year_manufacture?.message}>
                  <Input id="v-yf" inputMode="numeric" maxLength={4} {...register("year_manufacture")} />
                </Field>
                <Field label="Ano modelo" htmlFor="v-ym" error={err.year_model?.message}>
                  <Input id="v-ym" inputMode="numeric" maxLength={4} {...register("year_model")} />
                </Field>
                <Field label="Quilometragem" htmlFor="v-km">
                  <Input id="v-km" inputMode="numeric" placeholder="38000" {...register("km")} />
                </Field>
                <Field label="Cor" htmlFor="v-color" optional>
                  <Input id="v-color" {...register("color")} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Field label="Câmbio">
                  <Controller
                    control={control}
                    name="transmission"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={readOnly}>
                        <SelectTrigger aria-label="Câmbio">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">—</SelectItem>
                          {(Object.keys(TRANSMISSION_LABEL) as Transmission[]).map((t) => (
                            <SelectItem key={t} value={t}>
                              {TRANSMISSION_LABEL[t]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field label="Combustível">
                  <Controller
                    control={control}
                    name="fuel"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={readOnly}>
                        <SelectTrigger aria-label="Combustível">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">—</SelectItem>
                          {(Object.keys(FUEL_LABEL) as Fuel[]).map((f) => (
                            <SelectItem key={f} value={f}>
                              {FUEL_LABEL[f]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field label="Placa" htmlFor="v-plate" error={err.plate?.message} hint="Na página pública aparece só o final.">
                  <Input id="v-plate" className="font-mono uppercase" maxLength={8} {...register("plate")} />
                </Field>
                <Field label="Status">
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={readOnly}>
                        <SelectTrigger aria-label="Status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(["disponivel", "reservado", "vendido"] as const).map((s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
              <Field label="Preço" error={err.price?.message}>
                <Controller
                  control={control}
                  name="price"
                  render={({ field }) => <MoneyInput value={field.value} onChange={field.onChange} className="sm:max-w-60" aria-label="Preço" disabled={readOnly} />}
                />
              </Field>
            </Card>

            <Card className="flex flex-col gap-4 p-5">
              <h2 className="text-sm font-semibold">Fotos</h2>
              <PhotoManager
                items={photoItems}
                uploading={uploading}
                disabled={readOnly}
                onAdd={(files) => {
                  if (vehicle) void uploadFiles(vehicle.id, files, photoItems.length);
                  else setQueue((q) => [...q, ...files.map((file) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(file), file }))]);
                }}
                onRemove={(item) => {
                  if (!vehicle) return setQueue((q) => q.filter((x) => x.id !== item.id));
                  const photo = vehicle.photos.find((p) => p.id === item.id);
                  if (photo && repo) void repo.deleteVehiclePhoto(photo).then(() => refreshVehicle(vehicle.id));
                }}
                onReorder={(items) => {
                  if (!vehicle) return setQueue((q) => items.map((i) => q.find((x) => x.id === i.id)!));
                  setRemoteOrder(items);
                  void repo
                    ?.reorderVehiclePhotos(items.map((i, position) => ({ id: i.id, position })))
                    .then(() => refreshVehicle(vehicle.id))
                    .catch(() => toast.error("Não foi possível reordenar"));
                }}
              />
            </Card>

            <Card className="flex flex-col gap-4 p-5">
              <h2 className="text-sm font-semibold">Descrição e opcionais</h2>
              <Field label="Opcionais" htmlFor="v-features">
                <Controller
                  control={control}
                  name="features"
                  render={({ field }) => <TagInput id="v-features" value={field.value} onChange={field.onChange} suggestions={COMMON_FEATURES} />}
                />
              </Field>
              <Field label="Descrição" htmlFor="v-desc" optional hint="Aparece na página pública do veículo.">
                <Textarea id="v-desc" rows={4} {...register("description")} />
              </Field>
            </Card>
          </fieldset>
        </form>

        <aside className="flex flex-col gap-4">
          {vehicle && link && (
            <Card className="flex flex-col gap-3 p-4">
              <h2 className="text-sm font-semibold">Página pública</h2>
              <p className="truncate rounded-lg bg-surface-2 px-3 py-2 font-mono text-xs text-muted-foreground">{link}</p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    void navigator.clipboard.writeText(link);
                    toast("Link copiado");
                  }}
                >
                  <Copy /> Copiar link
                </Button>
                <Button asChild variant="secondary" size="sm" className="flex-1">
                  <a href={link} target="_blank" rel="noreferrer">
                    <ExternalLink /> Abrir
                  </a>
                </Button>
              </div>
            </Card>
          )}
          {vehicle && <InterestedLeads vehicleId={vehicle.id} />}
          {vehicle && !readOnly && (
            <Button
              variant="ghost"
              className="justify-start text-danger hover:bg-danger/10 hover:text-danger"
              disabled={del.isPending}
              onClick={() => {
                if (!window.confirm("Excluir este veículo e as fotos? Essa ação não pode ser desfeita.")) return;
                del.mutate(vehicle.id, {
                  onSuccess: () => {
                    toast("Veículo excluído");
                    router.replace("/estoque");
                  },
                });
              }}
            >
              <Trash2 /> Excluir veículo
            </Button>
          )}
        </aside>
      </PageBody>
    </>
  );
}

function InterestedLeads({ vehicleId }: { vehicleId: string }) {
  const leads = useVehicleLeads(vehicleId);
  const drawer = useLeadDrawer();
  const list = leads.data ?? [];
  return (
    <Card className="flex flex-col gap-3 p-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Users className="size-4 text-brand" /> Interessados <span className="text-subtle-foreground tabular">{list.length}</span>
      </h2>
      {leads.isLoading ? (
        <Skeleton className="h-16" />
      ) : list.length === 0 ? (
        <p className="text-[13px] text-subtle-foreground">Nenhum lead vinculado ainda.</p>
      ) : (
        <ul className="-mx-2 flex flex-col">
          {list.slice(0, 12).map((l) => (
            <li key={l.id}>
              <button
                onClick={() => drawer.open(l.id)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-accent"
              >
                <Avatar name={l.name} className="size-6 text-[9px]" />
                <span className="min-w-0 flex-1 truncate text-[13px]">{l.name}</span>
                <span className="text-xs text-subtle-foreground">{formatElapsed(l.created_at)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function EditorSkeleton() {
  return (
    <PageBody className="grid gap-5 pt-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex flex-col gap-5">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
      <Skeleton className="h-48 rounded-xl" />
    </PageBody>
  );
}
