"use client";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { friendlyDbError } from "@/lib/action";
import type { VehiclePhotoRow } from "@/types/database";
import { RepoError, type BoardLead, type LeadEventWithActor, type Repo, type VehicleWithPhotos } from "./types";

const LEAD_SELECT =
  "*, assignee:profiles!leads_assigned_to_fkey(id, full_name, avatar_url), vehicle:vehicles(id, brand, model, version, year_model, km, price, cover_url, status)";

function fail(error: { code?: string; message: string } | null): asserts error is null {
  if (error) throw new RepoError(friendlyDbError(error));
}

function safeFileName(name: string) {
  const ext = name.includes(".") ? name.split(".").pop()!.toLowerCase().replace(/[^a-z0-9]/g, "") : "bin";
  const base = name.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9-_]+/g, "-").slice(0, 60);
  return `${Date.now()}-${base || "arquivo"}.${ext}`;
}

/** Repositório real: Supabase com RLS (o banco decide o que o usuário vê). */
export function createSupabaseRepo(): Repo {
  const sb = getSupabaseBrowser();

  return {
    mode: "supabase",

    async listPipelines(tenantId) {
      const { data, error } = await sb
        .from("pipelines")
        .select("*, stages:pipeline_stages(*)")
        .eq("tenant_id", tenantId)
        .order("position")
        .order("position", { referencedTable: "pipeline_stages" });
      fail(error);
      return (data ?? []) as unknown as Awaited<ReturnType<Repo["listPipelines"]>>;
    },

    async listTeam(tenantId) {
      const { data, error } = await sb
        .from("profiles")
        .select("id, full_name, avatar_url, role, active, email")
        .eq("tenant_id", tenantId)
        .order("full_name");
      fail(error);
      return data ?? [];
    },

    async listLeads(tenantId, pipelineId) {
      const { data, error } = await sb
        .from("leads")
        .select(LEAD_SELECT)
        .eq("tenant_id", tenantId)
        .eq("pipeline_id", pipelineId)
        .order("position")
        .limit(2000);
      fail(error);
      return (data ?? []) as unknown as BoardLead[];
    },

    async getLead(id) {
      const { data, error } = await sb.from("leads").select(LEAD_SELECT).eq("id", id).maybeSingle();
      fail(error);
      return data as unknown as BoardLead | null;
    },

    async updateLead(id, patch) {
      const { error } = await sb.from("leads").update(patch).eq("id", id);
      fail(error);
    },

    async deleteLead(id) {
      const { error } = await sb.from("leads").delete().eq("id", id);
      fail(error);
    },

    async listEvents(leadId) {
      const { data, error } = await sb
        .from("lead_events")
        .select("*, actor:profiles(id, full_name)")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false })
        .limit(200);
      fail(error);
      return (data ?? []) as unknown as LeadEventWithActor[];
    },

    async addEvent({ tenantId, leadId, type, data }) {
      const { data: auth } = await sb.auth.getUser();
      const { error } = await sb
        .from("lead_events")
        .insert({ tenant_id: tenantId, lead_id: leadId, type, data, actor_id: auth.user?.id ?? null });
      fail(error);
    },

    async listLeadTasks(leadId) {
      const { data, error } = await sb.from("tasks").select("*").eq("lead_id", leadId).order("due_at", { nullsFirst: false });
      fail(error);
      return data ?? [];
    },

    async createTask(input) {
      const { data: auth } = await sb.auth.getUser();
      const { data, error } = await sb
        .from("tasks")
        .insert({
          tenant_id: input.tenantId,
          lead_id: input.leadId,
          assigned_to: input.assignedTo ?? auth.user?.id ?? null,
          type: input.type,
          title: input.title,
          description: input.description ?? null,
          due_at: input.dueAt,
          template_id: input.templateId ?? null,
          created_by: auth.user?.id ?? null,
        })
        .select("*")
        .single();
      fail(error);
      if (input.leadId) {
        await sb.from("lead_events").insert({
          tenant_id: input.tenantId,
          lead_id: input.leadId,
          actor_id: auth.user?.id ?? null,
          type: "task_created",
          data: { title: input.title, type: input.type, due_at: input.dueAt },
        });
      }
      return data!;
    },

    async setTaskDone(id, done) {
      const { data, error } = await sb
        .from("tasks")
        .update({ done_at: done ? new Date().toISOString() : null })
        .eq("id", id)
        .select("tenant_id, lead_id, title")
        .single();
      fail(error);
      if (done && data?.lead_id) {
        const { data: auth } = await sb.auth.getUser();
        await sb.from("lead_events").insert({
          tenant_id: data.tenant_id,
          lead_id: data.lead_id,
          actor_id: auth.user?.id ?? null,
          type: "task_done",
          data: { title: data.title },
        });
      }
    },

    async listAttachments(leadId) {
      const { data, error } = await sb.from("lead_attachments").select("*").eq("lead_id", leadId).order("created_at", { ascending: false });
      fail(error);
      return data ?? [];
    },

    async uploadAttachment(tenantId, leadId, file) {
      const path = `${tenantId}/${leadId}/${safeFileName(file.name)}`;
      const up = await sb.storage.from("lead-attachments").upload(path, file, { contentType: file.type || undefined });
      if (up.error) throw new RepoError("Falha no upload do arquivo.");
      const { data: auth } = await sb.auth.getUser();
      const { error } = await sb.from("lead_attachments").insert({
        tenant_id: tenantId,
        lead_id: leadId,
        storage_path: path,
        file_name: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
        uploaded_by: auth.user?.id ?? null,
      });
      fail(error);
      await sb.from("lead_events").insert({
        tenant_id: tenantId,
        lead_id: leadId,
        actor_id: auth.user?.id ?? null,
        type: "attachment",
        data: { file_name: file.name },
      });
    },

    async attachmentUrl(att) {
      const { data, error } = await sb.storage.from("lead-attachments").createSignedUrl(att.storage_path, 60 * 10, { download: att.file_name });
      if (error || !data) throw new RepoError("Não foi possível abrir o arquivo.");
      return data.signedUrl;
    },

    async deleteAttachment(att) {
      await sb.storage.from("lead-attachments").remove([att.storage_path]);
      const { error } = await sb.from("lead_attachments").delete().eq("id", att.id);
      fail(error);
    },

    async listTemplates(tenantId) {
      const { data, error } = await sb.from("message_templates").select("*").eq("tenant_id", tenantId).eq("active", true).order("position");
      fail(error);
      return data ?? [];
    },

    async listVehicles(tenantId) {
      const { data, error } = await sb.from("vehicles").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false });
      fail(error);
      return data ?? [];
    },

    async vehicleInterestCounts(tenantId) {
      const { data, error } = await sb.rpc("vehicle_interest_counts", { p_tenant: tenantId });
      fail(error);
      return Object.fromEntries((data ?? []).map((r) => [r.vehicle_id, Number(r.leads)]));
    },

    async listVehicleLeads(vehicleId) {
      const { data, error } = await sb.from("leads").select(LEAD_SELECT).eq("vehicle_id", vehicleId).order("created_at", { ascending: false });
      fail(error);
      return (data ?? []) as unknown as BoardLead[];
    },

    async getVehicle(id) {
      const { data, error } = await sb
        .from("vehicles")
        .select("*, photos:vehicle_photos(*)")
        .eq("id", id)
        .order("position", { referencedTable: "vehicle_photos" })
        .maybeSingle();
      fail(error);
      return data as unknown as VehicleWithPhotos | null;
    },

    async saveVehicle(tenantId, id, input) {
      if (id) {
        const { error } = await sb.from("vehicles").update(input).eq("id", id);
        fail(error);
        return id;
      }
      const { data, error } = await sb.from("vehicles").insert({ ...input, tenant_id: tenantId }).select("id").single();
      fail(error);
      return data!.id;
    },

    async deleteVehicle(id) {
      const { data: photos } = await sb.from("vehicle_photos").select("storage_path").eq("vehicle_id", id);
      const { error } = await sb.from("vehicles").delete().eq("id", id);
      if (error?.code === "23503") throw new RepoError("Há leads vinculados a este veículo. Marque como vendido em vez de excluir.");
      fail(error);
      if (photos?.length) await sb.storage.from("vehicle-photos").remove(photos.map((p) => p.storage_path));
    },

    async uploadVehiclePhoto(tenantId, vehicleId, file, position) {
      const path = `${tenantId}/${vehicleId}/${safeFileName(file.name)}`;
      const up = await sb.storage.from("vehicle-photos").upload(path, file, { cacheControl: "31536000", contentType: file.type });
      if (up.error) throw new RepoError("Falha no upload da foto.");
      const { data, error } = await sb
        .from("vehicle_photos")
        .insert({ tenant_id: tenantId, vehicle_id: vehicleId, storage_path: path, position })
        .select("*")
        .single();
      fail(error);
      return data as VehiclePhotoRow;
    },

    async reorderVehiclePhotos(photos) {
      const results = await Promise.all(photos.map((p) => sb.from("vehicle_photos").update({ position: p.position }).eq("id", p.id)));
      fail(results.find((r) => r.error)?.error ?? null);
    },

    async deleteVehiclePhoto(photo) {
      const { error } = await sb.from("vehicle_photos").delete().eq("id", photo.id);
      fail(error);
      await sb.storage.from("vehicle-photos").remove([photo.storage_path]);
    },

    async search(tenantId, q) {
      const term = q.replace(/[%,()]/g, " ").trim();
      const digits = q.replace(/\D/g, "");
      const leadFilter = digits.length >= 4 ? `name.ilike.%${term}%,phone.like.%${digits}%` : `name.ilike.%${term}%`;
      const [leads, vehicles] = await Promise.all([
        sb.from("leads").select(LEAD_SELECT).eq("tenant_id", tenantId).or(leadFilter).order("created_at", { ascending: false }).limit(6),
        sb
          .from("vehicles")
          .select("*")
          .eq("tenant_id", tenantId)
          .or(`brand.ilike.%${term}%,model.ilike.%${term}%,version.ilike.%${term}%`)
          .limit(5),
      ]);
      fail(leads.error);
      fail(vehicles.error);
      return { leads: (leads.data ?? []) as unknown as BoardLead[], vehicles: vehicles.data ?? [] };
    },

    subscribeLeads(tenantId, onChange) {
      const channel = sb
        .channel(`leads:${tenantId}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "leads", filter: `tenant_id=eq.${tenantId}` }, onChange)
        .subscribe();
      return () => {
        void sb.removeChannel(channel);
      };
    },
  };
}
