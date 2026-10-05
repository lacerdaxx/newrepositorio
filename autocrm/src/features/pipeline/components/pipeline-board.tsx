"use client";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { Kanban, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/features/auth/user-provider";
import {
  useLeads,
  useLeadsRealtime,
  usePipelines,
  useTeam,
  useTemplates,
  useUpdateLead,
  useVehicles,
} from "@/features/data/queries";
import type { BoardLead } from "@/features/data/types";
import { useLeadDrawer } from "@/features/leads/use-lead-drawer";
import { useTenant } from "@/features/tenants/tenant-provider";
import { greetingTemplate } from "@/features/whatsapp/lib";
import { useWhatsAppSender } from "@/features/whatsapp/use-whatsapp";
import { useNow } from "@/hooks/use-now";
import { formatCurrency, formatNumber } from "@/lib/format";
import { transition } from "@/lib/motion";
import type { LostReason, PipelineStageRow } from "@/types/database";
import { applyFilters, EMPTY_FILTERS, leadValue, positionBetween, type BoardFilters } from "../filters";
import { FilterBar } from "./filter-bar";
import { KanbanColumn } from "./kanban-column";
import { cardStatus, LeadCardView } from "./lead-card";
import { LostReasonDialog } from "./lost-reason-dialog";
import { MobileBoard } from "./mobile-board";

type Columns = Record<string, string[]>;
type PendingMove = { leadId: string; stageId: string; position: number };

// Prioriza o ponteiro (colunas vazias funcionam bem) e cai para cantos mais próximos
const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length ? hits : closestCorners(args);
};

export function PipelineBoard() {
  const tenant = useTenant();
  const me = useCurrentUser();
  const isManager = me.role !== "vendedor";
  const now = useNow();
  const drawer = useLeadDrawer();
  const pipelines = usePipelines();
  const [pipelineId, setPipelineId] = useState<string | undefined>();
  const pipeline = pipelines.data?.find((p) => p.id === pipelineId) ?? pipelines.data?.find((p) => p.is_default) ?? pipelines.data?.[0];
  const leadsQ = useLeads(pipeline?.id);
  const team = useTeam();
  const vehicles = useVehicles();
  const templates = useTemplates();
  const update = useUpdateLead();
  const wa = useWhatsAppSender();
  useLeadsRealtime();

  const [filters, setFilters] = useState<BoardFilters>(EMPTY_FILTERS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragColumns, setDragColumns] = useState<Columns | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);
  const [pendingLost, setPendingLost] = useState<PendingMove | null>(null);

  const stages = useMemo(() => pipeline?.stages ?? [], [pipeline]);
  const allLeads = useMemo(() => leadsQ.data ?? [], [leadsQ.data]);
  const leadById = useMemo(() => new Map(allLeads.map((l) => [l.id, l])), [allLeads]);
  const filtered = useMemo(() => applyFilters(allLeads, filters), [allLeads, filters]);

  const serverColumns = useMemo<Columns>(() => {
    const cols: Columns = Object.fromEntries(stages.map((s) => [s.id, [] as string[]]));
    for (const l of [...filtered].sort((a, b) => a.position - b.position)) cols[l.stage_id]?.push(l.id);
    return cols;
  }, [filtered, stages]);
  const columns = dragColumns ?? serverColumns;

  const campaigns = useMemo(
    () => [...new Set(allLeads.map((l) => l.campaign ?? l.utm_campaign).filter((c): c is string => !!c))].sort(),
    [allLeads],
  );
  const tags = useMemo(() => [...new Set(allLeads.flatMap((l) => l.tags))].sort(), [allLeads]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const stageOfId = (id: string, cols: Columns) => {
    if (id.startsWith("stage:")) return id.slice(6);
    return Object.keys(cols).find((k) => cols[k]!.includes(id));
  };

  const onDragStart = (e: DragStartEvent) => {
    setActiveId(String(e.active.id));
    setDragColumns(structuredClone(serverColumns));
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || !dragColumns) return;
    const from = stageOfId(String(active.id), dragColumns);
    const to = stageOfId(String(over.id), dragColumns);
    setOverStage(to ?? null);
    if (!from || !to || from === to) return;
    setDragColumns((cols) => {
      if (!cols) return cols;
      const fromItems = cols[from]!.filter((id) => id !== active.id);
      const toItems = [...cols[to]!];
      const overIndex = toItems.indexOf(String(over.id));
      const index = overIndex >= 0 ? overIndex : toItems.length;
      toItems.splice(index, 0, String(active.id));
      return { ...cols, [from]: fromItems, [to]: toItems };
    });
  };

  const reset = () => {
    setActiveId(null);
    setDragColumns(null);
    setOverStage(null);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    const cols = dragColumns;
    const lead = leadById.get(String(active.id));
    if (!over || !cols || !lead) return reset();
    const to = stageOfId(String(over.id), cols);
    if (!to) return reset();

    let items = cols[to]!;
    const oldIndex = items.indexOf(lead.id);
    const overIndex = items.indexOf(String(over.id));
    if (oldIndex >= 0 && overIndex >= 0 && oldIndex !== overIndex) items = arrayMove(items, oldIndex, overIndex);
    const index = items.indexOf(lead.id);
    const prev = items[index - 1] ? leadById.get(items[index - 1]!)?.position : undefined;
    const next = items[index + 1] ? leadById.get(items[index + 1]!)?.position : undefined;
    const position = positionBetween(prev, next);
    reset();

    if (to === lead.stage_id && Math.abs(position - lead.position) < 1e-9) return;
    if (to === lead.stage_id && serverColumns[to]?.indexOf(lead.id) === index) return;
    commitMove({ leadId: lead.id, stageId: to, position });
  };

  const commitMove = (move: PendingMove, lost?: { reason: LostReason; note: string }) => {
    const stage = stages.find((s) => s.id === move.stageId);
    const lead = leadById.get(move.leadId);
    if (!stage || !lead) return;
    if (stage.kind === "lost" && move.stageId !== lead.stage_id && !lost) {
      setPendingLost(move);
      return;
    }
    update.mutate(
      {
        id: move.leadId,
        patch: {
          stage_id: move.stageId,
          position: move.position,
          ...(lost && { lost_reason: lost.reason, lost_note: lost.note || null }),
        },
      },
      {
        onSuccess: () => {
          if (move.stageId === lead.stage_id) return;
          if (stage.kind === "won") toast.success(`Venda registrada: ${lead.name} 🎉`);
          else toast(`${lead.name} → ${stage.name}`);
        },
      },
    );
  };

  /** Mover pelo menu (mobile / teclado): vai para o topo da etapa. */
  const moveTo = (leadId: string, stageId: string) => {
    const first = serverColumns[stageId]?.[0];
    commitMove({ leadId, stageId, position: positionBetween(undefined, first ? leadById.get(first)?.position : undefined) });
  };

  const sendGreeting = (lead: BoardLead) => wa.send(lead, { name: "Saudação", body: greetingTemplate(templates.data ?? []) });

  // fecha o arraste se os dados mudarem por baixo (realtime)
  useEffect(() => {
    if (!activeId) setDragColumns(null);
  }, [leadsQ.data, activeId]);

  const activeLead = activeId ? leadById.get(activeId) : undefined;
  const activeStage = activeLead ? stages.find((s) => s.id === activeLead.stage_id) : undefined;
  const openTotal = filtered.filter((l) => stages.find((s) => s.id === l.stage_id)?.kind === "open");
  const pipelineValue = openTotal.reduce((s, l) => s + leadValue(l), 0);

  return (
    <div className="flex min-h-0 flex-1 select-none flex-col md:h-[calc(100dvh-3rem)] md:flex-none">
      <div className="flex flex-col gap-3 px-4 pt-5 pb-3 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight md:text-[22px]">Funil</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {leadsQ.isLoading ? (
                <Skeleton className="inline-block h-3.5 w-48 align-middle" />
              ) : (
                <>
                  {formatNumber(openTotal.length)} em andamento · {formatCurrency(pipelineValue, { compact: pipelineValue >= 1_000_000 })} em negociação
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(pipelines.data?.length ?? 0) > 1 && (
              <Tabs value={pipeline?.id} onValueChange={setPipelineId}>
                <TabsList className="max-w-[calc(100vw-2rem)] overflow-x-auto scrollbar-none">
                  {pipelines.data!.map((p) => (
                    <TabsTrigger key={p.id} value={p.id}>
                      {p.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
            <Button onClick={() => window.dispatchEvent(new CustomEvent("autocrm:new-lead", { detail: { pipelineId: pipeline?.id } }))}>
              <Plus /> <span className="hidden sm:inline">Novo lead</span>
            </Button>
          </div>
        </div>
        <FilterBar
          filters={filters}
          onChange={setFilters}
          team={team.data ?? []}
          vehicles={vehicles.data ?? []}
          campaigns={campaigns}
          tags={tags}
          showSeller={isManager}
        />
      </div>

      {pipelines.isLoading || leadsQ.isLoading || !pipeline ? (
        <BoardSkeleton />
      ) : allLeads.length === 0 ? (
        <div className="px-4 md:px-8">
          <EmptyState
            icon={<Kanban />}
            title="Nenhum lead neste funil"
            description="Leads chegam pelo formulário público, página dos veículos, importação CSV ou cadastro rápido (tecla N)."
          />
        </div>
      ) : (
        <>
          <div className="md:hidden">
            <MobileBoard
              stages={stages}
              columns={serverColumns}
              leadById={leadById}
              now={now}
              alertMinutes={tenant.noContactAlertMinutes}
              onOpen={drawer.open}
              onWhatsApp={sendGreeting}
              onMove={moveTo}
            />
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={collision}
            measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDragCancel={reset}
            autoScroll={{ threshold: { x: 0.15, y: 0.2 }, acceleration: 12 }}
            accessibility={{
              announcements: {
                onDragStart: ({ active }) => `Movendo ${leadById.get(String(active.id))?.name ?? "lead"}`,
                onDragOver: ({ over }) => (over ? `Sobre ${stageName(stages, over.id, columns)}` : "Fora das etapas"),
                onDragEnd: ({ over }) => (over ? `Solto em ${stageName(stages, over.id, columns)}` : "Movimento cancelado"),
                onDragCancel: () => "Movimento cancelado",
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition.base}
              className="hidden min-h-0 flex-1 gap-3 overflow-x-auto px-4 pb-4 md:flex md:px-8"
            >
              {stages.map((stage) => (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  leads={(columns[stage.id] ?? []).map((id) => leadById.get(id)!).filter(Boolean)}
                  now={now}
                  alertMinutes={tenant.noContactAlertMinutes}
                  onOpen={drawer.open}
                  onWhatsApp={sendGreeting}
                  isOver={!!activeId && overStage === stage.id}
                />
              ))}
            </motion.div>
            <DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}>
              {activeLead && activeStage ? (
                <LeadCardView
                  lead={activeLead}
                  status={cardStatus(activeLead, activeStage.kind, tenant.noContactAlertMinutes, now)}
                  now={now}
                  onOpen={() => undefined}
                  onWhatsApp={() => undefined}
                  dragging
                  className="w-[268px]"
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </>
      )}

      <LostReasonDialog
        open={!!pendingLost}
        leadName={pendingLost ? leadById.get(pendingLost.leadId)?.name : undefined}
        onCancel={() => setPendingLost(null)}
        onConfirm={(reason, note) => {
          if (pendingLost) commitMove(pendingLost, { reason, note });
          setPendingLost(null);
        }}
      />
    </div>
  );
}

function stageName(stages: PipelineStageRow[], id: string | number, cols: Columns) {
  const sid = String(id).startsWith("stage:") ? String(id).slice(6) : Object.keys(cols).find((k) => cols[k]!.includes(String(id)));
  return stages.find((s) => s.id === sid)?.name ?? "etapa";
}

function BoardSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden px-4 pb-4 md:px-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex w-[284px] shrink-0 flex-col gap-2 rounded-xl bg-surface-2/70 p-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mb-2 h-3 w-16" />
          {Array.from({ length: 4 - (i % 3) }).map((__, k) => (
            <Skeleton key={k} className="h-[88px] rounded-xl" />
          ))}
        </div>
      ))}
    </div>
  );
}
