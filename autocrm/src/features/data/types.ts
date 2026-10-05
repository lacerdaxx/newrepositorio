import type {
  Json,
  LeadEventRow,
  LeadEventType,
  LeadAttachmentRow,
  LeadRow,
  MessageTemplateRow,
  PipelineRow,
  PipelineStageRow,
  ProfileRow,
  TaskRow,
  TaskType,
  VehiclePhotoRow,
  VehicleRow,
} from "@/types/database";

export type PipelineWithStages = PipelineRow & { stages: PipelineStageRow[] };

export type TeamMember = Pick<ProfileRow, "id" | "full_name" | "avatar_url" | "role" | "active" | "email">;

export type LeadVehicle = Pick<
  VehicleRow,
  "id" | "brand" | "model" | "version" | "year_model" | "km" | "price" | "cover_url" | "status"
>;

export type BoardLead = LeadRow & {
  assignee: Pick<ProfileRow, "id" | "full_name" | "avatar_url"> | null;
  vehicle: LeadVehicle | null;
};

export type LeadEventWithActor = LeadEventRow & { actor: Pick<ProfileRow, "id" | "full_name"> | null };

export type VehicleWithPhotos = VehicleRow & { photos: VehiclePhotoRow[] };

export type LeadPatch = Partial<
  Pick<
    LeadRow,
    | "name"
    | "phone"
    | "email"
    | "city"
    | "cpf"
    | "source"
    | "campaign"
    | "ad_name"
    | "utm_source"
    | "utm_medium"
    | "utm_campaign"
    | "vehicle_id"
    | "vehicle_interest"
    | "price_min"
    | "price_max"
    | "down_payment"
    | "has_trade_in"
    | "trade_in_model"
    | "trade_in_year"
    | "trade_in_km"
    | "payment_method"
    | "value"
    | "tags"
    | "assigned_to"
    | "stage_id"
    | "pipeline_id"
    | "position"
    | "lost_reason"
    | "lost_note"
  >
>;

export type NewTask = {
  tenantId: string;
  leadId: string | null;
  assignedTo: string | null;
  type: TaskType;
  title: string;
  description?: string | null;
  dueAt: string | null;
  templateId?: string | null;
};

export type NewEvent = { tenantId: string; leadId: string; type: LeadEventType; data: Json };

export type VehicleInput = Omit<
  VehicleRow,
  "id" | "tenant_id" | "created_at" | "updated_at" | "cover_url"
>;

export interface Repo {
  readonly mode: "supabase" | "demo";
  listPipelines(tenantId: string): Promise<PipelineWithStages[]>;
  listTeam(tenantId: string): Promise<TeamMember[]>;
  listLeads(tenantId: string, pipelineId: string): Promise<BoardLead[]>;
  getLead(id: string): Promise<BoardLead | null>;
  updateLead(id: string, patch: LeadPatch): Promise<void>;
  deleteLead(id: string): Promise<void>;
  listEvents(leadId: string): Promise<LeadEventWithActor[]>;
  addEvent(input: NewEvent): Promise<void>;
  listLeadTasks(leadId: string): Promise<TaskRow[]>;
  createTask(input: NewTask): Promise<TaskRow>;
  setTaskDone(id: string, done: boolean): Promise<void>;
  listAttachments(leadId: string): Promise<LeadAttachmentRow[]>;
  uploadAttachment(tenantId: string, leadId: string, file: File): Promise<void>;
  attachmentUrl(att: LeadAttachmentRow): Promise<string>;
  deleteAttachment(att: LeadAttachmentRow): Promise<void>;
  listTemplates(tenantId: string): Promise<MessageTemplateRow[]>;
  listVehicles(tenantId: string): Promise<VehicleRow[]>;
  vehicleInterestCounts(tenantId: string): Promise<Record<string, number>>;
  listVehicleLeads(vehicleId: string): Promise<BoardLead[]>;
  getVehicle(id: string): Promise<VehicleWithPhotos | null>;
  saveVehicle(tenantId: string, id: string | null, input: VehicleInput): Promise<string>;
  deleteVehicle(id: string): Promise<void>;
  uploadVehiclePhoto(tenantId: string, vehicleId: string, file: File, position: number): Promise<VehiclePhotoRow>;
  reorderVehiclePhotos(photos: Pick<VehiclePhotoRow, "id" | "position">[]): Promise<void>;
  deleteVehiclePhoto(photo: VehiclePhotoRow): Promise<void>;
  /** Busca da paleta de comandos (Ctrl+K). */
  search(tenantId: string, q: string): Promise<{ leads: Pick<BoardLead, "id" | "name" | "phone" | "vehicle">[]; vehicles: VehicleRow[] }>;
  /** Realtime: chama `onChange` quando leads da loja mudam. Retorna a função de cancelamento. */
  subscribeLeads(tenantId: string, onChange: () => void): () => void;
}

export class RepoError extends Error {}
