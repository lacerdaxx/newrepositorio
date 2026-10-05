"use client";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTenant } from "@/features/tenants/tenant-provider";
import { useRepo } from "./repo-provider";
import type { BoardLead, LeadPatch, NewEvent, NewTask, Repo, VehicleInput } from "./types";

export const qk = {
  pipelines: (t: string) => ["pipelines", t] as const,
  team: (t: string) => ["team", t] as const,
  leads: (t: string, p: string) => ["leads", t, p] as const,
  lead: (id: string) => ["lead", id] as const,
  events: (id: string) => ["events", id] as const,
  leadTasks: (id: string) => ["tasks", "lead", id] as const,
  attachments: (id: string) => ["attachments", id] as const,
  templates: (t: string) => ["templates", t] as const,
  vehicles: (t: string) => ["vehicles", t] as const,
  vehicle: (id: string) => ["vehicle", id] as const,
  vehicleCounts: (t: string) => ["vehicle-counts", t] as const,
  vehicleLeads: (id: string) => ["vehicle-leads", id] as const,
};

/** useQuery que espera o repositório carregar. */
function useRepoQuery<T>(key: QueryKey, fn: (repo: Repo) => Promise<T>, enabled = true) {
  const repo = useRepo();
  return useQuery({ queryKey: key, queryFn: () => fn(repo!), enabled: !!repo && enabled });
}

const onError = (e: unknown) => toast.error(e instanceof Error ? e.message : "Algo deu errado");

// ------------------------------------------------------------------ leitura
export const usePipelines = () => {
  const t = useTenant().id;
  return useRepoQuery(qk.pipelines(t), (r) => r.listPipelines(t));
};
export const useTeam = () => {
  const t = useTenant().id;
  return useRepoQuery(qk.team(t), (r) => r.listTeam(t));
};
export const useLeads = (pipelineId: string | undefined) => {
  const t = useTenant().id;
  return useRepoQuery(qk.leads(t, pipelineId ?? ""), (r) => r.listLeads(t, pipelineId!), !!pipelineId);
};
export const useLead = (id: string | null) => useRepoQuery(qk.lead(id ?? ""), (r) => r.getLead(id!), !!id);
export const useLeadEvents = (id: string | null) => useRepoQuery(qk.events(id ?? ""), (r) => r.listEvents(id!), !!id);
export const useLeadTasks = (id: string | null) => useRepoQuery(qk.leadTasks(id ?? ""), (r) => r.listLeadTasks(id!), !!id);
export const useAttachments = (id: string | null) => useRepoQuery(qk.attachments(id ?? ""), (r) => r.listAttachments(id!), !!id);
export const useTemplates = () => {
  const t = useTenant().id;
  return useRepoQuery(qk.templates(t), (r) => r.listTemplates(t));
};
export const useVehicles = () => {
  const t = useTenant().id;
  return useRepoQuery(qk.vehicles(t), (r) => r.listVehicles(t));
};
export const useVehicle = (id: string | null) => useRepoQuery(qk.vehicle(id ?? ""), (r) => r.getVehicle(id!), !!id);
export const useVehicleCounts = () => {
  const t = useTenant().id;
  return useRepoQuery(qk.vehicleCounts(t), (r) => r.vehicleInterestCounts(t));
};
export const useVehicleLeads = (id: string | null) => useRepoQuery(qk.vehicleLeads(id ?? ""), (r) => r.listVehicleLeads(id!), !!id);

/** Realtime: qualquer mudança em leads da loja invalida as listas. */
export function useLeadsRealtime() {
  const repo = useRepo();
  const t = useTenant().id;
  const qc = useQueryClient();
  useEffect(() => {
    if (!repo) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsub = repo.subscribeLeads(t, () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        void qc.invalidateQueries({ queryKey: ["leads", t] });
        void qc.invalidateQueries({ queryKey: ["lead"] });
      }, 250);
    });
    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, [repo, t, qc]);
}

// ------------------------------------------------------------------ escrita
export function useUpdateLead() {
  const repo = useRepo();
  const qc = useQueryClient();
  const t = useTenant().id;
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: LeadPatch; optimistic?: Partial<BoardLead> }) => repo!.updateLead(id, patch),
    onMutate: async ({ id, patch, optimistic }) => {
      await qc.cancelQueries({ queryKey: ["leads", t] });
      const lists = qc.getQueriesData<BoardLead[]>({ queryKey: ["leads", t] });
      const single = qc.getQueryData<BoardLead | null>(qk.lead(id));
      const apply = (l: BoardLead) => (l.id === id ? { ...l, ...patch, ...optimistic } : l);
      for (const [key, data] of lists) if (data) qc.setQueryData(key, data.map(apply));
      if (single) qc.setQueryData(qk.lead(id), apply(single));
      return { lists, single };
    },
    onError: (e, { id }, ctx) => {
      for (const [key, data] of ctx?.lists ?? []) qc.setQueryData(key, data);
      if (ctx?.single) qc.setQueryData(qk.lead(id), ctx.single);
      onError(e);
    },
    onSettled: (_d, _e, { id }) => {
      void qc.invalidateQueries({ queryKey: ["leads", t] });
      void qc.invalidateQueries({ queryKey: qk.lead(id) });
      void qc.invalidateQueries({ queryKey: qk.events(id) });
    },
  });
}

export function useDeleteLead() {
  const repo = useRepo();
  const qc = useQueryClient();
  const t = useTenant().id;
  return useMutation({
    mutationFn: (id: string) => repo!.deleteLead(id),
    onError,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads", t] }),
  });
}

export function useAddEvent() {
  const repo = useRepo();
  const qc = useQueryClient();
  const t = useTenant().id;
  return useMutation({
    mutationFn: (e: Omit<NewEvent, "tenantId">) => repo!.addEvent({ ...e, tenantId: t }),
    onError,
    onSuccess: (_d, e) => {
      void qc.invalidateQueries({ queryKey: qk.events(e.leadId) });
      if (e.type === "whatsapp") {
        void qc.invalidateQueries({ queryKey: qk.lead(e.leadId) });
        void qc.invalidateQueries({ queryKey: ["leads", t] });
      }
    },
  });
}

export function useCreateTask() {
  const repo = useRepo();
  const qc = useQueryClient();
  const t = useTenant().id;
  return useMutation({
    mutationFn: (input: Omit<NewTask, "tenantId">) => repo!.createTask({ ...input, tenantId: t }),
    onError,
    onSuccess: (task) => {
      if (task.lead_id) {
        void qc.invalidateQueries({ queryKey: qk.leadTasks(task.lead_id) });
        void qc.invalidateQueries({ queryKey: qk.events(task.lead_id) });
      }
      void qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useToggleTask(leadId: string | null) {
  const repo = useRepo();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) => repo!.setTaskDone(id, done),
    onMutate: ({ id, done }) => {
      if (!leadId) return;
      qc.setQueryData(qk.leadTasks(leadId), (old: Awaited<ReturnType<Repo["listLeadTasks"]>> | undefined) =>
        old?.map((t) => (t.id === id ? { ...t, done_at: done ? new Date().toISOString() : null } : t)),
      );
    },
    onError,
    onSettled: () => {
      if (leadId) void qc.invalidateQueries({ queryKey: qk.events(leadId) });
      void qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUploadAttachment(leadId: string) {
  const repo = useRepo();
  const qc = useQueryClient();
  const t = useTenant().id;
  return useMutation({
    mutationFn: (file: File) => repo!.uploadAttachment(t, leadId, file),
    onError,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.attachments(leadId) });
      void qc.invalidateQueries({ queryKey: qk.events(leadId) });
    },
  });
}

export function useDeleteAttachment(leadId: string) {
  const repo = useRepo();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (att: Parameters<Repo["deleteAttachment"]>[0]) => repo!.deleteAttachment(att),
    onError,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.attachments(leadId) }),
  });
}

export function useSaveVehicle() {
  const repo = useRepo();
  const qc = useQueryClient();
  const t = useTenant().id;
  return useMutation({
    mutationFn: ({ id, input }: { id: string | null; input: VehicleInput }) => repo!.saveVehicle(t, id, input),
    onError,
    onSuccess: (id) => {
      void qc.invalidateQueries({ queryKey: qk.vehicles(t) });
      void qc.invalidateQueries({ queryKey: qk.vehicle(id) });
      void qc.invalidateQueries({ queryKey: ["leads", t] });
    },
  });
}

export function useDeleteVehicle() {
  const repo = useRepo();
  const qc = useQueryClient();
  const t = useTenant().id;
  return useMutation({
    mutationFn: (id: string) => repo!.deleteVehicle(id),
    onError,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.vehicles(t) }),
  });
}
