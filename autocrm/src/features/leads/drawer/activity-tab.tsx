"use client";
import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  Download,
  Loader2,
  Paperclip,
  Pencil,
  Sparkles,
  StickyNote,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAddEvent, useLeadEvents } from "@/features/data/queries";
import type { LeadEventWithActor } from "@/features/data/types";
import { formatDateTime } from "@/lib/format";
import { fadeUpItem, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { LeadSource, LostReason } from "@/types/database";
import { LOST_REASON_LABEL, SOURCE_META, TASK_TYPE_LABEL } from "../labels";

type D = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v : "");

function describe(e: LeadEventWithActor): { icon: LucideIcon | typeof WhatsAppIcon; tone: string; title: React.ReactNode; body?: string } {
  const d = (e.data ?? {}) as D;
  switch (e.type) {
    case "created":
      return {
        icon: Sparkles,
        tone: "text-brand",
        title: (
          <>
            Lead criado via <b>{SOURCE_META[(d.source as LeadSource) ?? "outro"]?.label ?? "—"}</b>
            {str(d.campaign) && <> · campanha {str(d.campaign)}</>}
          </>
        ),
      };
    case "imported":
      return { icon: Download, tone: "text-info", title: <>Importado de planilha</> };
    case "stage_changed":
      return {
        icon: ArrowRight,
        tone: "text-info",
        title: (
          <>
            Moveu de <b>{str(d.from) || "—"}</b> para <b>{str(d.to)}</b>
            {str(d.lost_reason) && <> · {LOST_REASON_LABEL[d.lost_reason as LostReason]}</>}
          </>
        ),
        body: str(d.lost_note) || undefined,
      };
    case "assigned":
      return { icon: UserCheck, tone: "text-warning", title: <>Atribuído a <b>{str(d.to_name) || "ninguém"}</b></> };
    case "note":
      return { icon: d.system ? Sparkles : StickyNote, tone: d.system ? "text-brand" : "text-muted-foreground", title: d.system ? str(d.body) : "Nota", body: d.system ? undefined : str(d.body) };
    case "whatsapp":
      return {
        icon: WhatsAppIcon,
        tone: "text-whatsapp",
        title: (
          <>
            Contato via WhatsApp{str(d.template) && <> · {str(d.template)}</>}
          </>
        ),
        body: str(d.text) || undefined,
      };
    case "task_created":
      return {
        icon: CalendarPlus,
        tone: "text-muted-foreground",
        title: (
          <>
            {TASK_TYPE_LABEL[(d.type as keyof typeof TASK_TYPE_LABEL) ?? "tarefa"] ?? "Tarefa"}: <b>{str(d.title)}</b>
            {str(d.due_at) && <> · {formatDateTime(str(d.due_at))}</>}
          </>
        ),
      };
    case "task_done":
      return { icon: CheckCircle2, tone: "text-success", title: <>Concluiu <b>{str(d.title)}</b></> };
    case "attachment":
      return { icon: Paperclip, tone: "text-muted-foreground", title: <>Anexou <b>{str(d.file_name)}</b></> };
    default:
      return { icon: Pencil, tone: "text-muted-foreground", title: e.type };
  }
}

export function ActivityTab({ leadId }: { leadId: string }) {
  const events = useLeadEvents(leadId);
  const add = useAddEvent();
  const [note, setNote] = useState("");

  const submit = () => {
    const body = note.trim();
    if (!body) return;
    add.mutate({ leadId, type: "note", data: { body } }, { onSuccess: () => setNote("") });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-border bg-surface p-2 shadow-xs focus-within:border-[color-mix(in_oklch,var(--brand)_45%,var(--border-strong))]">
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Escreva uma nota interna…"
          rows={2}
          className="min-h-14 resize-none border-0 bg-transparent px-1.5 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-between px-1">
          <span className="flex items-center gap-1 text-[11px] text-subtle-foreground">
            <Kbd>Ctrl</Kbd>
            <Kbd>Enter</Kbd> para salvar
          </span>
          <Button size="sm" onClick={submit} disabled={!note.trim() || add.isPending}>
            {add.isPending && <Loader2 className="animate-spin" />} Adicionar nota
          </Button>
        </div>
      </div>

      {events.isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-7 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.ol variants={staggerContainer(0.03)} initial="hidden" animate="show" className="relative flex flex-col">
          <div className="absolute bottom-3 left-[13px] top-3 w-px bg-border" aria-hidden />
          <AnimatePresence initial={false}>
            {(events.data ?? []).map((e) => {
              const info = describe(e);
              const Icon = info.icon;
              return (
                <motion.li key={e.id} variants={fadeUpItem} layout="position" className="relative flex gap-3 pb-4">
                  <span className={cn("relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background", info.tone)}>
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1 pt-1">
                    <p className="text-[13px] leading-snug text-foreground/90 [&_b]:font-medium [&_b]:text-foreground">{info.title}</p>
                    {info.body && (
                      <p
                        className={cn(
                          "mt-1.5 whitespace-pre-wrap rounded-lg border border-border px-3 py-2 text-[13px]",
                          e.type === "note" ? "bg-[color-mix(in_oklch,var(--warning)_8%,var(--surface))]" : "bg-surface-2 text-muted-foreground",
                        )}
                      >
                        {info.body}
                      </p>
                    )}
                    <p className="mt-1 text-[11.5px] text-subtle-foreground" title={formatDateTime(e.created_at)}>
                      {e.actor?.full_name ? `${e.actor.full_name} · ` : ""}
                      há {formatDistanceToNowStrict(new Date(e.created_at), { locale: ptBR })}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ol>
      )}
    </div>
  );
}
