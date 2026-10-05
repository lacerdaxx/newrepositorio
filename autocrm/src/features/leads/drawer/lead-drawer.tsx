"use client";
import { useState } from "react";
import Link from "next/link";
import { formatDistanceStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Activity, Copy, FileText, Link2, ListChecks, MoreHorizontal, Paperclip, Phone, Timer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/features/auth/user-provider";
import { useDeleteLead, useLead, usePipelines, useTeam, useUpdateLead } from "@/features/data/queries";
import type { BoardLead } from "@/features/data/types";
import { LostReasonDialog } from "@/features/pipeline/components/lost-reason-dialog";
import { VehicleImage } from "@/features/vehicles/vehicle-image";
import { vehicleSpecsLine, vehicleTitle } from "@/features/vehicles/utils";
import { formatCurrency, formatDateTime, formatPhone } from "@/lib/format";
import type { LostReason } from "@/types/database";
import { LOST_REASON_LABEL, SOURCE_META, SourceIcon } from "../labels";
import { useLeadDrawer } from "../use-lead-drawer";
import { ActivityTab } from "./activity-tab";
import { AttachmentsTab } from "./attachments-tab";
import { DetailsTab } from "./details-tab";
import { TasksTab } from "./tasks-tab";
import { WhatsAppMenu } from "./whatsapp-menu";

/** Montado uma vez no shell: abre a ficha quando a URL tem ?lead=<id>. */
export function LeadDrawerHost() {
  const { leadId, close } = useLeadDrawer();
  const lead = useLead(leadId);
  return (
    <Sheet open={!!leadId} onOpenChange={(o) => !o && close()} title={lead.data?.name ?? "Lead"}>
      {lead.isLoading || !leadId ? (
        <DrawerSkeleton />
      ) : lead.data ? (
        <LeadDrawerContent key={lead.data.id} lead={lead.data} onClose={close} />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
          <p className="font-medium">Lead não encontrado</p>
          <p className="text-sm text-muted-foreground">Ele pode ter sido excluído ou atribuído a outro vendedor.</p>
          <SheetClose className="mt-2" />
        </div>
      )}
    </Sheet>
  );
}

function LeadDrawerContent({ lead, onClose }: { lead: BoardLead; onClose: () => void }) {
  const me = useCurrentUser();
  const isManager = me.role !== "vendedor";
  const pipelines = usePipelines();
  const team = useTeam();
  const update = useUpdateLead();
  const del = useDeleteLead();
  const [pendingLost, setPendingLost] = useState<string | null>(null);
  const pipeline = pipelines.data?.find((p) => p.id === lead.pipeline_id);
  const stage = pipeline?.stages.find((s) => s.id === lead.stage_id);

  const moveTo = (stageId: string, lost?: { reason: LostReason; note: string }) => {
    const target = pipeline?.stages.find((s) => s.id === stageId);
    if (!target || stageId === lead.stage_id) return;
    if (target.kind === "lost" && !lost) return setPendingLost(stageId);
    update.mutate(
      {
        id: lead.id,
        patch: { stage_id: stageId, position: -Date.now() / 1000, ...(lost && { lost_reason: lost.reason, lost_note: lost.note || null }) },
      },
      { onSuccess: () => toast(target.kind === "won" ? `Venda registrada: ${lead.name} 🎉` : `Movido para ${target.name}`) },
    );
  };

  const responseTime = lead.first_contact_at
    ? formatDistanceStrict(new Date(lead.first_contact_at), new Date(lead.created_at), { locale: ptBR })
    : null;

  return (
    <>
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        {pipeline && (
          <Select value={lead.stage_id} onValueChange={(v) => moveTo(v)}>
            <SelectTrigger className="h-8 w-auto gap-2 text-[13px]" aria-label="Etapa">
              <span className="size-2 rounded-full" style={{ background: stage?.color }} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pipeline.stages.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <span className="truncate text-xs text-subtle-foreground">{pipeline?.name}</span>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Mais ações">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  void navigator.clipboard.writeText(window.location.href);
                  toast("Link da ficha copiado");
                }}
              >
                <Link2 /> Copiar link da ficha
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  void navigator.clipboard.writeText(formatPhone(lead.phone));
                  toast("Telefone copiado");
                }}
              >
                <Copy /> Copiar telefone
              </DropdownMenuItem>
              {isManager && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    destructive
                    onSelect={() => {
                      if (!window.confirm(`Excluir ${lead.name}? Essa ação não pode ser desfeita.`)) return;
                      del.mutate(lead.id, {
                        onSuccess: () => {
                          toast("Lead excluído");
                          onClose();
                        },
                      });
                    }}
                  >
                    <Trash2 /> Excluir lead
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <SheetClose />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 px-5 pt-5 pb-4">
          <div className="flex items-start gap-3">
            <Avatar name={lead.name} className="size-11 text-sm" />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold tracking-tight">{lead.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
                <a href={`tel:+${lead.phone}`} className="flex items-center gap-1 tabular hover:text-foreground">
                  <Phone className="size-3.5" /> {formatPhone(lead.phone)}
                </a>
                <span className="flex items-center gap-1">
                  <SourceIcon source={lead.source} className="size-3.5" />
                  {SOURCE_META[lead.source].label}
                  {lead.campaign && <span className="text-subtle-foreground">· {lead.campaign}</span>}
                </span>
                {lead.city && <span>{lead.city}</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <WhatsAppMenu lead={lead} />
            {isManager ? (
              <Select
                value={lead.assigned_to ?? "none"}
                onValueChange={(v) =>
                  update.mutate({
                    id: lead.id,
                    patch: { assigned_to: v === "none" ? null : v },
                    optimistic: { assignee: team.data?.find((m) => m.id === v) ?? null },
                  })
                }
              >
                <SelectTrigger className="h-8 w-auto gap-2 text-[13px]" aria-label="Vendedor responsável">
                  {lead.assignee && <Avatar name={lead.assignee.full_name} className="size-5 text-[8px]" />}
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem vendedor</SelectItem>
                  {(team.data ?? [])
                    .filter((m) => m.active || m.id === lead.assigned_to)
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.full_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              lead.assignee && (
                <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <Avatar name={lead.assignee.full_name} className="size-5 text-[8px]" /> {lead.assignee.full_name}
                </span>
              )
            )}
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border text-[12.5px] sm:grid-cols-3">
            <div className="bg-surface px-3 py-2">
              <dt className="text-subtle-foreground">Entrou em</dt>
              <dd className="mt-0.5 font-medium tabular">{formatDateTime(lead.created_at)}</dd>
            </div>
            <div className="bg-surface px-3 py-2">
              <dt className="flex items-center gap-1 text-subtle-foreground">
                <Timer className="size-3" /> 1º contato
              </dt>
              <dd className={lead.first_contact_at ? "mt-0.5 font-medium" : "mt-0.5 font-medium text-danger"}>{responseTime ? `em ${responseTime}` : "Ainda não"}</dd>
            </div>
            <div className="col-span-2 bg-surface px-3 py-2 sm:col-span-1">
              <dt className="text-subtle-foreground">Pagamento / entrada</dt>
              <dd className="mt-0.5 font-medium">
                {lead.payment_method ? { a_vista: "À vista", financiado: "Financiado", consorcio: "Consórcio" }[lead.payment_method] : "—"}
                {lead.down_payment ? ` · ${formatCurrency(Number(lead.down_payment))}` : ""}
              </dd>
            </div>
          </dl>

          {lead.lost_reason && (
            <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-[13px] text-danger">
              Perdido: <b>{LOST_REASON_LABEL[lead.lost_reason]}</b>
              {lead.lost_note && <span className="text-danger/80"> — {lead.lost_note}</span>}
            </div>
          )}

          {lead.vehicle ? (
            <Link
              href={`/estoque/${lead.vehicle.id}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-2 pr-3 transition-colors hover:border-border-strong"
            >
              <VehicleImage src={lead.vehicle.cover_url} model={lead.vehicle.model} className="h-14 w-20 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{vehicleTitle(lead.vehicle)}</p>
                <p className="text-xs text-muted-foreground">{vehicleSpecsLine(lead.vehicle)}</p>
              </div>
              <div className="text-right">
                {lead.vehicle.price && <p className="text-sm font-semibold tabular">{formatCurrency(Number(lead.vehicle.price))}</p>}
                {lead.vehicle.status !== "disponivel" && (
                  <Badge variant={lead.vehicle.status === "vendido" ? "danger" : "warning"}>{lead.vehicle.status}</Badge>
                )}
              </div>
            </Link>
          ) : lead.vehicle_interest ? (
            <p className="rounded-xl border border-dashed border-border px-3 py-2.5 text-[13px] text-muted-foreground">
              Procura: <span className="text-foreground">{lead.vehicle_interest}</span>
            </p>
          ) : null}
        </div>

        <Tabs defaultValue="atividade" className="px-5 pb-6">
          <TabsList className="w-full justify-start overflow-x-auto scrollbar-none">
            <TabsTrigger value="atividade">
              <Activity /> Atividade
            </TabsTrigger>
            <TabsTrigger value="dados">
              <FileText /> Dados
            </TabsTrigger>
            <TabsTrigger value="tarefas">
              <ListChecks /> Tarefas
            </TabsTrigger>
            <TabsTrigger value="anexos">
              <Paperclip /> Anexos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="atividade">
            <ActivityTab leadId={lead.id} />
          </TabsContent>
          <TabsContent value="dados">
            <DetailsTab lead={lead} />
          </TabsContent>
          <TabsContent value="tarefas">
            <TasksTab lead={lead} />
          </TabsContent>
          <TabsContent value="anexos">
            <AttachmentsTab leadId={lead.id} />
          </TabsContent>
        </Tabs>
      </div>

      <LostReasonDialog
        open={!!pendingLost}
        leadName={lead.name}
        onCancel={() => setPendingLost(null)}
        onConfirm={(reason, note) => {
          if (pendingLost) moveTo(pendingLost, { reason, note });
          setPendingLost(null);
        }}
      />
    </>
  );
}

function DrawerSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5">
      <Skeleton className="h-8 w-40" />
      <div className="flex items-center gap-3">
        <Skeleton className="size-11 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </div>
  );
}
