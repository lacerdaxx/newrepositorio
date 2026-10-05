"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, CalendarPlus, Loader2 } from "lucide-react";
import { AnimatedCheck } from "@/components/ui/animated-check";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateTask, useLeadTasks, useToggleTask } from "@/features/data/queries";
import type { BoardLead } from "@/features/data/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TaskType } from "@/types/database";
import { TASK_TYPE_LABEL } from "../labels";

function tomorrowAt10() {
  const d = new Date(Date.now() + 86400000);
  d.setHours(10, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T10:00`;
}

export function TasksTab({ lead }: { lead: BoardLead }) {
  const tasks = useLeadTasks(lead.id);
  const create = useCreateTask();
  const toggle = useToggleTask(lead.id);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>("follow_up");
  const [due, setDue] = useState(tomorrowAt10);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    create.mutate(
      { leadId: lead.id, assignedTo: lead.assigned_to, type, title: title.trim(), dueAt: due ? new Date(due).toISOString() : null },
      { onSuccess: () => setTitle("") },
    );
  };

  const list = tasks.data ?? [];
  const open = list.filter((t) => !t.done_at);
  const done = list.filter((t) => t.done_at);
  const now = Date.now();

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={submit} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 shadow-xs">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nova tarefa (ex.: Ligar para enviar simulação)" aria-label="Título da tarefa" />
        <div className="flex flex-wrap gap-2">
          <Select value={type} onValueChange={(v) => setType(v as TaskType)}>
            <SelectTrigger className="h-8 w-36 text-[13px]" aria-label="Tipo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(TASK_TYPE_LABEL) as TaskType[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {TASK_TYPE_LABEL[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} className="h-8 w-auto text-[13px]" aria-label="Data e hora" />
          <Button type="submit" size="sm" className="ml-auto" disabled={!title.trim() || create.isPending}>
            {create.isPending ? <Loader2 className="animate-spin" /> : <CalendarPlus />} Criar
          </Button>
        </div>
      </form>

      {tasks.isLoading ? (
        <Skeleton className="h-24 rounded-xl" />
      ) : list.length === 0 ? (
        <p className="py-8 text-center text-sm text-subtle-foreground">Nenhuma tarefa para este lead.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          <AnimatePresence initial={false}>
            {[...open, ...done].map((t) => {
              const overdue = !t.done_at && t.due_at && new Date(t.due_at).getTime() < now;
              return (
                <motion.li
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 rounded-lg border border-border bg-surface px-3 py-2.5"
                >
                  <AnimatedCheck checked={!!t.done_at} onChange={(v) => toggle.mutate({ id: t.id, done: v })} label={`Concluir ${t.title}`} className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-[13px] font-medium transition-colors", t.done_at && "text-subtle-foreground line-through")}>{t.title}</p>
                    <p className={cn("mt-0.5 flex items-center gap-1 text-xs text-muted-foreground", overdue && "text-danger")}>
                      <CalendarClock className="size-3" />
                      {TASK_TYPE_LABEL[t.type]}
                      {t.due_at && <> · {formatDateTime(t.due_at)}</>}
                      {overdue && " · atrasada"}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
