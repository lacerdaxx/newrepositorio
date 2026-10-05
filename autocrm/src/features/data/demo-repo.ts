"use client";
import type { LeadAttachmentRow, LeadEventRow, LeadRow, TaskRow, VehiclePhotoRow, VehicleRow } from "@/types/database";
import { demoEvents, demoLeads, demoPipelines, demoTasks, demoTeam, demoTemplates, demoVehicles } from "./demo-data";
import { RepoError, type BoardLead, type Repo, type VehicleWithPhotos } from "./types";

/**
 * Repositório em memória para o modo demonstração: tudo funciona (arrastar, notas, tarefas,
 * estoque), mas some ao recarregar a página. Imita as regras dos triggers do banco.
 */
const db = {
  leads: structuredClone(demoLeads) as LeadRow[],
  events: structuredClone(demoEvents) as LeadEventRow[],
  tasks: structuredClone(demoTasks) as TaskRow[],
  vehicles: structuredClone(demoVehicles) as VehicleRow[],
  photos: [] as VehiclePhotoRow[],
  attachments: [] as (LeadAttachmentRow & { blobUrl: string })[],
};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const wait = (ms = 120) => new Promise((r) => setTimeout(r, ms));
const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const ME = demoTeam[0]!.id;

function toBoard(l: LeadRow): BoardLead {
  const a = demoTeam.find((m) => m.id === l.assigned_to);
  const v = db.vehicles.find((x) => x.id === l.vehicle_id);
  return {
    ...l,
    assignee: a ? { id: a.id, full_name: a.full_name, avatar_url: a.avatar_url } : null,
    vehicle: v
      ? { id: v.id, brand: v.brand, model: v.model, version: v.version, year_model: v.year_model, km: v.km, price: v.price, cover_url: v.cover_url, status: v.status }
      : null,
  };
}

function stageOf(stageId: string) {
  for (const p of demoPipelines) {
    const s = p.stages.find((x) => x.id === stageId);
    if (s) return s;
  }
  return null;
}

function pushEvent(e: Omit<LeadEventRow, "id" | "created_at" | "tenant_id"> & { tenant_id?: string }) {
  db.events.push({ id: id(), created_at: now(), tenant_id: demoPipelines[0]!.tenant_id, ...e });
}

export const demoRepo: Repo = {
  mode: "demo",

  async listPipelines() {
    await wait(60);
    return structuredClone(demoPipelines);
  },
  async listTeam() {
    return demoTeam.map(({ id, full_name, avatar_url, role, active, email }) => ({ id, full_name, avatar_url, role, active, email }));
  },
  async listLeads(_t, pipelineId) {
    await wait();
    return db.leads.filter((l) => l.pipeline_id === pipelineId).map(toBoard);
  },
  async getLead(leadId) {
    await wait(60);
    const l = db.leads.find((x) => x.id === leadId);
    return l ? toBoard(l) : null;
  },
  async updateLead(leadId, patch) {
    await wait(80);
    const l = db.leads.find((x) => x.id === leadId);
    if (!l) throw new RepoError("Lead não encontrado");
    if (patch.phone && db.leads.some((x) => x.phone === patch.phone && x.id !== leadId)) {
      throw new RepoError("Já existe um lead com este telefone.");
    }
    const before = { ...l };
    Object.assign(l, patch, { updated_at: now() });
    if (patch.stage_id && patch.stage_id !== before.stage_id) {
      const to = stageOf(patch.stage_id);
      if (to?.kind === "lost" && !l.lost_reason) {
        Object.assign(l, before);
        throw new RepoError("Informe o motivo da perda");
      }
      l.stage_changed_at = now();
      l.won_at = to?.kind === "won" ? now() : null;
      l.lost_at = to?.kind === "lost" ? now() : null;
      if (to?.kind !== "lost") {
        l.lost_reason = null;
        l.lost_note = null;
      }
      pushEvent({
        lead_id: leadId,
        actor_id: ME,
        type: "stage_changed",
        data: { from: stageOf(before.stage_id)?.name ?? null, to: to?.name ?? null, lost_reason: l.lost_reason, lost_note: l.lost_note },
      });
    }
    if ("assigned_to" in patch && patch.assigned_to !== before.assigned_to) {
      pushEvent({
        lead_id: leadId,
        actor_id: ME,
        type: "assigned",
        data: { to: l.assigned_to, to_name: demoTeam.find((m) => m.id === l.assigned_to)?.full_name ?? null },
      });
    }
    emit();
  },
  async deleteLead(leadId) {
    db.leads = db.leads.filter((l) => l.id !== leadId);
    emit();
  },

  async listEvents(leadId) {
    await wait(60);
    return db.events
      .filter((e) => e.lead_id === leadId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((e) => {
        const actor = demoTeam.find((m) => m.id === e.actor_id);
        return { ...e, actor: actor ? { id: actor.id, full_name: actor.full_name } : null };
      });
  },
  async addEvent({ leadId, type, data }) {
    await wait(60);
    pushEvent({ lead_id: leadId, actor_id: ME, type, data });
    if (type === "whatsapp") {
      const l = db.leads.find((x) => x.id === leadId);
      if (l) {
        l.first_contact_at ??= now();
        l.last_contact_at = now();
      }
    }
    emit();
  },

  async listLeadTasks(leadId) {
    await wait(60);
    return db.tasks.filter((t) => t.lead_id === leadId).sort((a, b) => (a.due_at ?? "").localeCompare(b.due_at ?? ""));
  },
  async createTask(input) {
    await wait(80);
    const t: TaskRow = {
      id: id(),
      tenant_id: input.tenantId,
      lead_id: input.leadId,
      assigned_to: input.assignedTo,
      type: input.type,
      title: input.title,
      description: input.description ?? null,
      due_at: input.dueAt,
      done_at: null,
      template_id: input.templateId ?? null,
      created_by: ME,
      created_at: now(),
      updated_at: now(),
    };
    db.tasks.push(t);
    if (input.leadId) pushEvent({ lead_id: input.leadId, actor_id: ME, type: "task_created", data: { title: t.title, type: t.type, due_at: t.due_at } });
    return t;
  },
  async setTaskDone(taskId, done) {
    await wait(60);
    const t = db.tasks.find((x) => x.id === taskId);
    if (!t) return;
    t.done_at = done ? now() : null;
    if (done && t.lead_id) pushEvent({ lead_id: t.lead_id, actor_id: ME, type: "task_done", data: { title: t.title } });
  },

  async listAttachments(leadId) {
    return db.attachments.filter((a) => a.lead_id === leadId);
  },
  async uploadAttachment(tenantId, leadId, file) {
    await wait(300);
    db.attachments.push({
      id: id(),
      tenant_id: tenantId,
      lead_id: leadId,
      storage_path: file.name,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: ME,
      created_at: now(),
      blobUrl: URL.createObjectURL(file),
    });
    pushEvent({ lead_id: leadId, actor_id: ME, type: "attachment", data: { file_name: file.name } });
  },
  async attachmentUrl(att) {
    return db.attachments.find((a) => a.id === att.id)?.blobUrl ?? "#";
  },
  async deleteAttachment(att) {
    db.attachments = db.attachments.filter((a) => a.id !== att.id);
  },

  async listTemplates() {
    return structuredClone(demoTemplates);
  },

  async listVehicles() {
    await wait();
    return [...db.vehicles].sort((a, b) => b.created_at.localeCompare(a.created_at));
  },
  async vehicleInterestCounts() {
    const out: Record<string, number> = {};
    for (const l of db.leads) if (l.vehicle_id) out[l.vehicle_id] = (out[l.vehicle_id] ?? 0) + 1;
    return out;
  },
  async listVehicleLeads(vehicleId) {
    return db.leads.filter((l) => l.vehicle_id === vehicleId).map(toBoard);
  },
  async getVehicle(vehicleId) {
    await wait(60);
    const v = db.vehicles.find((x) => x.id === vehicleId);
    if (!v) return null;
    const photos = db.photos.filter((p) => p.vehicle_id === vehicleId).sort((a, b) => a.position - b.position);
    return { ...v, photos } satisfies VehicleWithPhotos;
  },
  async saveVehicle(tenantId, vehicleId, input) {
    await wait(150);
    if (vehicleId) {
      const v = db.vehicles.find((x) => x.id === vehicleId);
      if (!v) throw new RepoError("Veículo não encontrado");
      Object.assign(v, input, { updated_at: now() });
      return vehicleId;
    }
    const v: VehicleRow = { ...input, id: id(), tenant_id: tenantId, cover_url: null, created_at: now(), updated_at: now() };
    db.vehicles.push(v);
    return v.id;
  },
  async deleteVehicle(vehicleId) {
    if (db.leads.some((l) => l.vehicle_id === vehicleId)) {
      throw new RepoError("Há leads vinculados a este veículo. Marque como vendido em vez de excluir.");
    }
    db.vehicles = db.vehicles.filter((v) => v.id !== vehicleId);
  },
  async uploadVehiclePhoto(tenantId, vehicleId, file, position) {
    await wait(250);
    const photo: VehiclePhotoRow = { id: id(), tenant_id: tenantId, vehicle_id: vehicleId, storage_path: URL.createObjectURL(file), position, created_at: now() };
    db.photos.push(photo);
    syncCover(vehicleId);
    return photo;
  },
  async reorderVehiclePhotos(photos) {
    for (const p of photos) {
      const row = db.photos.find((x) => x.id === p.id);
      if (row) row.position = p.position;
    }
    const vid = db.photos.find((x) => x.id === photos[0]?.id)?.vehicle_id;
    if (vid) syncCover(vid);
  },
  async deleteVehiclePhoto(photo) {
    db.photos = db.photos.filter((p) => p.id !== photo.id);
    syncCover(photo.vehicle_id);
  },

  async search(_t, q) {
    const term = q.toLowerCase();
    const digits = q.replace(/\D/g, "");
    const leads = db.leads
      .filter((l) => l.name.toLowerCase().includes(term) || (digits.length >= 4 && l.phone.includes(digits)))
      .slice(0, 6)
      .map(toBoard);
    const vehicles = db.vehicles.filter((v) => `${v.brand} ${v.model} ${v.version ?? ""}`.toLowerCase().includes(term)).slice(0, 5);
    return { leads, vehicles };
  },

  subscribeLeads(_t, onChange) {
    listeners.add(onChange);
    return () => listeners.delete(onChange);
  },
};

function syncCover(vehicleId: string) {
  const v = db.vehicles.find((x) => x.id === vehicleId);
  if (!v) return;
  v.cover_url = db.photos.filter((p) => p.vehicle_id === vehicleId).sort((a, b) => a.position - b.position)[0]?.storage_path ?? null;
}
