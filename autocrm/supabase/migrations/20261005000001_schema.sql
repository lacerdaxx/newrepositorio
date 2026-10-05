-- =====================================================================
-- AutoCRM · 0001 · Schema base (multi-tenant)
-- Toda tabela de negócio carrega tenant_id e tem RLS habilitado (0002).
-- =====================================================================

create schema if not exists app;
comment on schema app is 'Funções internas (não expostas pela API REST).';

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------
create type public.app_role as enum ('superadmin', 'gerente', 'vendedor');
create type public.stage_kind as enum ('open', 'won', 'lost');
create type public.lead_source as enum (
  'meta_ads', 'instagram', 'whatsapp', 'portal', 'site', 'indicacao', 'loja_fisica', 'outro'
);
create type public.payment_method as enum ('a_vista', 'financiado', 'consorcio');
create type public.lost_reason as enum (
  'comprou_outra_loja', 'sem_credito', 'preco', 'desistiu', 'sem_estoque', 'nao_respondeu', 'outro'
);
create type public.vehicle_status as enum ('disponivel', 'reservado', 'vendido');
create type public.transmission as enum ('manual', 'automatico', 'cvt', 'automatizado');
create type public.fuel as enum ('flex', 'gasolina', 'etanol', 'diesel', 'hibrido', 'eletrico', 'gnv');
create type public.lead_event_type as enum (
  'created', 'imported', 'stage_changed', 'assigned', 'note', 'whatsapp',
  'task_created', 'task_done', 'attachment', 'field_changed', 'merged'
);
create type public.task_type as enum ('tarefa', 'ligacao', 'visita', 'test_drive', 'follow_up');
create type public.template_category as enum ('saudacao', 'ficha_veiculo', 'visita', 'follow_up', 'proposta', 'outro');

-- ---------------------------------------------------------------------
-- Lojas (tenants)
-- ---------------------------------------------------------------------
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9](?:[a-z0-9-]{0,46}[a-z0-9])?$'),
  custom_domain text unique check (custom_domain is null or custom_domain = lower(custom_domain)),
  logo_url text,
  favicon_url text,
  primary_color text not null default '#2563eb' check (primary_color ~* '^#[0-9a-f]{6}$'),
  secondary_color text not null default '#0a0a0a' check (secondary_color ~* '^#[0-9a-f]{6}$'),
  whatsapp text check (whatsapp is null or whatsapp ~ '^55\d{10,11}$'),
  timezone text not null default 'America/Sao_Paulo',
  active boolean not null default true,
  -- captação / atendimento
  offers_group_url text,
  no_contact_alert_minutes integer not null default 15 check (no_contact_alert_minutes between 1 and 1440),
  distribution_mode text not null default 'round_robin' check (distribution_mode in ('round_robin', 'manual')),
  respect_business_hours boolean not null default true,
  form_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on column public.tenants.slug is 'Subdomínio da loja: {slug}.dominio.com.br';

-- ---------------------------------------------------------------------
-- Usuários (1:1 com auth.users)
-- ---------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  tenant_id uuid references public.tenants (id) on delete cascade,
  role public.app_role not null default 'vendedor',
  full_name text not null default '',
  email text not null,
  phone text,
  avatar_url text,
  active boolean not null default true,
  -- distribuição de leads
  receives_leads boolean not null default true,
  distribution_weight smallint not null default 1 check (distribution_weight between 0 and 10),
  last_assigned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_tenant_required check (role = 'superadmin' or tenant_id is not null)
);
create index profiles_tenant_idx on public.profiles (tenant_id);

create table public.user_absences (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index user_absences_user_idx on public.user_absences (user_id, ends_at);

create table public.business_hours (
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6), -- 0 = domingo
  opens_at time not null,
  closes_at time not null,
  primary key (tenant_id, weekday),
  check (closes_at > opens_at)
);

-- ---------------------------------------------------------------------
-- Funis e etapas
-- ---------------------------------------------------------------------
create table public.pipelines (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  name text not null,
  position smallint not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  unique (id, tenant_id)
);
create index pipelines_tenant_idx on public.pipelines (tenant_id, position);
create unique index pipelines_one_default on public.pipelines (tenant_id) where is_default;

create table public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  pipeline_id uuid not null,
  name text not null,
  position smallint not null default 0,
  color text not null default '#64748b' check (color ~* '^#[0-9a-f]{6}$'),
  kind public.stage_kind not null default 'open',
  created_at timestamptz not null default now(),
  foreign key (pipeline_id, tenant_id) references public.pipelines (id, tenant_id) on delete cascade,
  unique (id, tenant_id)
);
create index pipeline_stages_pipeline_idx on public.pipeline_stages (pipeline_id, position);

-- ---------------------------------------------------------------------
-- Estoque
-- ---------------------------------------------------------------------
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  brand text not null,
  model text not null,
  version text,
  year_manufacture smallint check (year_manufacture between 1950 and 2100),
  year_model smallint check (year_model between 1950 and 2100),
  km integer check (km >= 0),
  color text,
  transmission public.transmission,
  fuel public.fuel,
  plate text,
  price numeric(12, 2) check (price >= 0),
  description text,
  features text[] not null default '{}',
  status public.vehicle_status not null default 'disponivel',
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, tenant_id)
);
create index vehicles_tenant_status_idx on public.vehicles (tenant_id, status);

create table public.vehicle_photos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  vehicle_id uuid not null,
  storage_path text not null,
  position smallint not null default 0,
  created_at timestamptz not null default now(),
  foreign key (vehicle_id, tenant_id) references public.vehicles (id, tenant_id) on delete cascade
);
create index vehicle_photos_vehicle_idx on public.vehicle_photos (vehicle_id, position);

-- ---------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  pipeline_id uuid not null,
  stage_id uuid not null,
  assigned_to uuid references public.profiles (id) on delete set null,
  -- contato
  name text not null check (length(trim(name)) between 1 and 120),
  phone text not null check (phone ~ '^55\d{10,11}$'),
  email text,
  city text,
  cpf text check (cpf is null or cpf ~ '^\d{11}$'),
  -- origem
  source public.lead_source not null default 'outro',
  campaign text,
  ad_name text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  -- interesse
  vehicle_id uuid,
  vehicle_interest text,
  price_min numeric(12, 2),
  price_max numeric(12, 2),
  down_payment numeric(12, 2),
  has_trade_in boolean not null default false,
  trade_in_model text,
  trade_in_year smallint,
  trade_in_km integer,
  payment_method public.payment_method,
  value numeric(12, 2),
  tags text[] not null default '{}',
  -- funil
  position double precision not null default 0,
  lost_reason public.lost_reason,
  lost_note text,
  stage_changed_at timestamptz not null default now(),
  first_contact_at timestamptz,
  last_contact_at timestamptz,
  won_at timestamptz,
  lost_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, tenant_id),
  unique (tenant_id, phone), -- deduplicação por telefone normalizado
  foreign key (pipeline_id, tenant_id) references public.pipelines (id, tenant_id),
  foreign key (stage_id, tenant_id) references public.pipeline_stages (id, tenant_id),
  foreign key (vehicle_id, tenant_id) references public.vehicles (id, tenant_id)
);
create index leads_board_idx on public.leads (tenant_id, pipeline_id, stage_id, position);
create index leads_assigned_idx on public.leads (assigned_to);
create index leads_created_idx on public.leads (tenant_id, created_at desc);
create index leads_vehicle_idx on public.leads (vehicle_id);
create index leads_tags_idx on public.leads using gin (tags);

create table public.lead_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  lead_id uuid not null,
  actor_id uuid references public.profiles (id) on delete set null,
  type public.lead_event_type not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  foreign key (lead_id, tenant_id) references public.leads (id, tenant_id) on delete cascade
);
create index lead_events_lead_idx on public.lead_events (lead_id, created_at desc);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  lead_id uuid,
  assigned_to uuid references public.profiles (id) on delete set null,
  type public.task_type not null default 'tarefa',
  title text not null,
  description text,
  due_at timestamptz,
  done_at timestamptz,
  template_id uuid,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (lead_id, tenant_id) references public.leads (id, tenant_id) on delete cascade
);
create index tasks_assigned_due_idx on public.tasks (assigned_to, due_at) where done_at is null;
create index tasks_lead_idx on public.tasks (lead_id);

create table public.lead_attachments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  lead_id uuid not null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes integer,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (lead_id, tenant_id) references public.leads (id, tenant_id) on delete cascade
);
create index lead_attachments_lead_idx on public.lead_attachments (lead_id);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  name text not null,
  color text not null default '#64748b' check (color ~* '^#[0-9a-f]{6}$'),
  unique (tenant_id, name)
);

-- ---------------------------------------------------------------------
-- Mensagens, automações, investimento, notificações
-- ---------------------------------------------------------------------
create table public.message_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  name text not null,
  category public.template_category not null default 'outro',
  body text not null,
  position smallint not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index message_templates_tenant_idx on public.message_templates (tenant_id, position);

alter table public.tasks
  add constraint tasks_template_fk foreign key (template_id) references public.message_templates (id) on delete set null;

create table public.automations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  name text not null,
  trigger_type text not null check (trigger_type in ('lead_created', 'stage_changed', 'no_contact', 'tag_added')),
  trigger_config jsonb not null default '{}'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index automations_tenant_idx on public.automations (tenant_id, trigger_type) where active;

create table public.campaign_investments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  campaign text not null,
  month date not null check (extract(day from month) = 1),
  amount numeric(12, 2) not null check (amount >= 0),
  created_at timestamptz not null default now(),
  unique (tenant_id, campaign, month)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  lead_id uuid references public.leads (id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now()
);
