/**
 * Tipos do banco (espelham supabase/migrations).
 * Para regenerar a partir do projeto: `npx supabase gen types typescript --linked > src/types/database.ts`
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamps = { created_at: string; updated_at: string };

type Table<Row, Required extends keyof Row, Optional extends keyof Row = Exclude<keyof Row, Required>> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Pick<Row, Optional>>;
  Update: Partial<Row>;
  Relationships: [];
};

export type AppRole = "superadmin" | "gerente" | "vendedor";
export type StageKind = "open" | "won" | "lost";
export type LeadSource =
  | "meta_ads"
  | "instagram"
  | "whatsapp"
  | "portal"
  | "site"
  | "indicacao"
  | "loja_fisica"
  | "outro";
export type PaymentMethod = "a_vista" | "financiado" | "consorcio";
export type LostReason =
  | "comprou_outra_loja"
  | "sem_credito"
  | "preco"
  | "desistiu"
  | "sem_estoque"
  | "nao_respondeu"
  | "outro";
export type VehicleStatus = "disponivel" | "reservado" | "vendido";
export type Transmission = "manual" | "automatico" | "cvt" | "automatizado";
export type Fuel = "flex" | "gasolina" | "etanol" | "diesel" | "hibrido" | "eletrico" | "gnv";
export type LeadEventType =
  | "created"
  | "imported"
  | "stage_changed"
  | "assigned"
  | "note"
  | "whatsapp"
  | "task_created"
  | "task_done"
  | "attachment"
  | "field_changed"
  | "merged";
export type TaskType = "tarefa" | "ligacao" | "visita" | "test_drive" | "follow_up";
export type TemplateCategory = "saudacao" | "ficha_veiculo" | "visita" | "follow_up" | "proposta" | "outro";

export type TenantRow = Timestamps & {
  id: string;
  name: string;
  slug: string;
  custom_domain: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  whatsapp: string | null;
  timezone: string;
  active: boolean;
  offers_group_url: string | null;
  no_contact_alert_minutes: number;
  distribution_mode: "round_robin" | "manual";
  respect_business_hours: boolean;
  form_config: Json;
};

export type ProfileRow = Timestamps & {
  id: string;
  tenant_id: string | null;
  role: AppRole;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  active: boolean;
  receives_leads: boolean;
  distribution_weight: number;
  last_assigned_at: string | null;
};

export type UserAbsenceRow = {
  id: string;
  tenant_id: string;
  user_id: string;
  starts_at: string;
  ends_at: string;
  reason: string | null;
  created_at: string;
};

export type BusinessHoursRow = { tenant_id: string; weekday: number; opens_at: string; closes_at: string };

export type PipelineRow = {
  id: string;
  tenant_id: string;
  name: string;
  position: number;
  is_default: boolean;
  created_at: string;
};

export type PipelineStageRow = {
  id: string;
  tenant_id: string;
  pipeline_id: string;
  name: string;
  position: number;
  color: string;
  kind: StageKind;
  created_at: string;
};

export type VehicleRow = Timestamps & {
  id: string;
  tenant_id: string;
  brand: string;
  model: string;
  version: string | null;
  year_manufacture: number | null;
  year_model: number | null;
  km: number | null;
  color: string | null;
  transmission: Transmission | null;
  fuel: Fuel | null;
  plate: string | null;
  price: number | null;
  description: string | null;
  features: string[];
  status: VehicleStatus;
  cover_url: string | null;
};

export type VehiclePhotoRow = {
  id: string;
  tenant_id: string;
  vehicle_id: string;
  storage_path: string;
  position: number;
  created_at: string;
};

export type LeadRow = Timestamps & {
  id: string;
  tenant_id: string;
  pipeline_id: string;
  stage_id: string;
  assigned_to: string | null;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  cpf: string | null;
  source: LeadSource;
  campaign: string | null;
  ad_name: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  vehicle_id: string | null;
  vehicle_interest: string | null;
  price_min: number | null;
  price_max: number | null;
  down_payment: number | null;
  has_trade_in: boolean;
  trade_in_model: string | null;
  trade_in_year: number | null;
  trade_in_km: number | null;
  payment_method: PaymentMethod | null;
  value: number | null;
  tags: string[];
  position: number;
  lost_reason: LostReason | null;
  lost_note: string | null;
  stage_changed_at: string;
  first_contact_at: string | null;
  last_contact_at: string | null;
  won_at: string | null;
  lost_at: string | null;
  created_by: string | null;
};

export type LeadEventRow = {
  id: string;
  tenant_id: string;
  lead_id: string;
  actor_id: string | null;
  type: LeadEventType;
  data: Json;
  created_at: string;
};

export type TaskRow = Timestamps & {
  id: string;
  tenant_id: string;
  lead_id: string | null;
  assigned_to: string | null;
  type: TaskType;
  title: string;
  description: string | null;
  due_at: string | null;
  done_at: string | null;
  template_id: string | null;
  created_by: string | null;
};

export type LeadAttachmentRow = {
  id: string;
  tenant_id: string;
  lead_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  created_at: string;
};

export type TagRow = { id: string; tenant_id: string; name: string; color: string };

export type MessageTemplateRow = Timestamps & {
  id: string;
  tenant_id: string;
  name: string;
  category: TemplateCategory;
  body: string;
  position: number;
  active: boolean;
};

export type AutomationRow = Timestamps & {
  id: string;
  tenant_id: string;
  name: string;
  trigger_type: "lead_created" | "stage_changed" | "no_contact" | "tag_added";
  trigger_config: Json;
  actions: Json;
  active: boolean;
};

export type CampaignInvestmentRow = {
  id: string;
  tenant_id: string;
  campaign: string;
  month: string;
  amount: number;
  created_at: string;
};

export type NotificationRow = {
  id: string;
  tenant_id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  lead_id: string | null;
  read_at: string | null;
  created_at: string;
};

export type PushSubscriptionRow = {
  id: string;
  tenant_id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  created_at: string;
};

export type PublicTenant = Pick<
  TenantRow,
  | "id"
  | "name"
  | "slug"
  | "logo_url"
  | "favicon_url"
  | "primary_color"
  | "secondary_color"
  | "whatsapp"
  | "timezone"
  | "offers_group_url"
  | "active"
  | "no_contact_alert_minutes"
>;

export type PublicVehicle = Pick<
  VehicleRow,
  | "id"
  | "brand"
  | "model"
  | "version"
  | "year_manufacture"
  | "year_model"
  | "km"
  | "color"
  | "transmission"
  | "fuel"
  | "price"
  | "description"
  | "features"
  | "status"
  | "cover_url"
> & { plate_end: string; photos: string[] };

export type PublicVehicleSummary = Pick<
  VehicleRow,
  "id" | "brand" | "model" | "version" | "year_model" | "km" | "price" | "status" | "transmission" | "fuel" | "cover_url"
>;

export type TenantOverviewRow = Pick<
  TenantRow,
  "id" | "name" | "slug" | "logo_url" | "primary_color" | "active" | "created_at"
> & {
  users_count: number;
  leads_month: number;
  leads_total: number;
  sales_month: number;
  unattended: number;
};

export type Database = {
  public: {
    Tables: {
      tenants: Table<TenantRow, "name" | "slug">;
      profiles: Table<ProfileRow, "id" | "email">;
      user_absences: Table<UserAbsenceRow, "tenant_id" | "user_id" | "starts_at" | "ends_at">;
      business_hours: Table<BusinessHoursRow, "tenant_id" | "weekday" | "opens_at" | "closes_at">;
      pipelines: Table<PipelineRow, "tenant_id" | "name">;
      pipeline_stages: Table<PipelineStageRow, "tenant_id" | "pipeline_id" | "name">;
      vehicles: Table<VehicleRow, "tenant_id" | "brand" | "model">;
      vehicle_photos: Table<VehiclePhotoRow, "tenant_id" | "vehicle_id" | "storage_path">;
      leads: Table<LeadRow, "tenant_id" | "name" | "phone">;
      lead_events: Table<LeadEventRow, "tenant_id" | "lead_id" | "type">;
      tasks: Table<TaskRow, "tenant_id" | "title">;
      lead_attachments: Table<LeadAttachmentRow, "tenant_id" | "lead_id" | "storage_path" | "file_name">;
      tags: Table<TagRow, "tenant_id" | "name">;
      message_templates: Table<MessageTemplateRow, "tenant_id" | "name" | "body">;
      automations: Table<AutomationRow, "tenant_id" | "name" | "trigger_type">;
      campaign_investments: Table<CampaignInvestmentRow, "tenant_id" | "campaign" | "month" | "amount">;
      notifications: Table<NotificationRow, "tenant_id" | "user_id" | "type" | "title">;
      push_subscriptions: Table<PushSubscriptionRow, "tenant_id" | "user_id" | "endpoint" | "p256dh" | "auth">;
    };
    Views: { [_ in never]: never };
    Functions: {
      get_public_tenant: { Args: { p_slug?: string; p_domain?: string }; Returns: PublicTenant[] };
      admin_tenant_overview: { Args: Record<string, never>; Returns: TenantOverviewRow[] };
      submit_public_lead: {
        Args: {
          p_tenant_slug: string;
          p_name: string;
          p_phone: string;
          p_vehicle_id?: string | null;
          p_source?: string;
          p_payload?: Json;
        };
        Returns: { lead_id: string; duplicate: boolean; assigned_to?: string | null };
      };
      get_public_vehicle: { Args: { p_tenant_slug: string; p_vehicle_id: string }; Returns: PublicVehicle | null };
      list_public_vehicles: { Args: { p_tenant_slug: string }; Returns: PublicVehicleSummary[] };
      vehicle_interest_counts: { Args: { p_tenant: string }; Returns: { vehicle_id: string; leads: number }[] };
    };
    Enums: {
      app_role: AppRole;
      stage_kind: StageKind;
      lead_source: LeadSource;
      payment_method: PaymentMethod;
      lost_reason: LostReason;
      vehicle_status: VehicleStatus;
      transmission: Transmission;
      fuel: Fuel;
      lead_event_type: LeadEventType;
      task_type: TaskType;
      template_category: TemplateCategory;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
