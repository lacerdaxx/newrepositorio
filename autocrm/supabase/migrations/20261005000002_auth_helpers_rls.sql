-- =====================================================================
-- AutoCRM · 0002 · Funções de autorização + Row Level Security
-- Regras:
--   superadmin → tudo (agência)
--   gerente    → tudo da própria loja
--   vendedor   → dados da loja, mas leads/tarefas/timeline só dos próprios leads
--   loja desativada → ninguém da loja acessa (exceto superadmin)
-- Funções SECURITY DEFINER leem profiles sem passar pelo RLS (evita recursão).
-- =====================================================================

create or replace function app.is_superadmin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'superadmin' and p.active
  );
$$;

create or replace function app.current_tenant_id()
returns uuid language sql stable security definer set search_path = '' as $$
  select p.tenant_id from public.profiles p where p.id = auth.uid() and p.active;
$$;

create or replace function app.current_role()
returns public.app_role language sql stable security definer set search_path = '' as $$
  select p.role from public.profiles p where p.id = auth.uid() and p.active;
$$;

/** Membro ativo de loja ativa (ou superadmin). */
create or replace function app.is_member_of(p_tenant uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select app.is_superadmin() or exists (
    select 1
    from public.profiles p
    join public.tenants t on t.id = p.tenant_id
    where p.id = auth.uid() and p.tenant_id = p_tenant and p.active and t.active
  );
$$;

/** Gerente da loja (ou superadmin). */
create or replace function app.is_manager_of(p_tenant uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select app.is_superadmin() or exists (
    select 1
    from public.profiles p
    join public.tenants t on t.id = p.tenant_id
    where p.id = auth.uid() and p.tenant_id = p_tenant and p.role = 'gerente' and p.active and t.active
  );
$$;

/** Pode ver/editar o lead: gerente da loja ou vendedor responsável. */
create or replace function app.can_access_lead(p_lead uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.leads l
    where l.id = p_lead
      and (app.is_manager_of(l.tenant_id) or (l.assigned_to = auth.uid() and app.is_member_of(l.tenant_id)))
  );
$$;

create or replace function app.try_uuid(p text)
returns uuid language plpgsql immutable as $$
begin
  return p::uuid;
exception when others then
  return null;
end;
$$;

grant usage on schema app to anon, authenticated, service_role;
grant execute on all functions in schema app to anon, authenticated, service_role;

-- ---------------------------------------------------------------------
-- Habilita RLS em todas as tabelas
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'tenants', 'profiles', 'user_absences', 'business_hours', 'pipelines', 'pipeline_stages',
    'vehicles', 'vehicle_photos', 'leads', 'lead_events', 'tasks', 'lead_attachments', 'tags',
    'message_templates', 'automations', 'campaign_investments', 'notifications', 'push_subscriptions'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- tenants
-- ---------------------------------------------------------------------
create policy tenants_select on public.tenants for select to authenticated
  using ((select app.is_superadmin()) or id = (select app.current_tenant_id()));
create policy tenants_insert on public.tenants for insert to authenticated
  with check ((select app.is_superadmin()));
create policy tenants_update on public.tenants for update to authenticated
  using (app.is_manager_of(id)) with check (app.is_manager_of(id));
create policy tenants_delete on public.tenants for delete to authenticated
  using ((select app.is_superadmin()));

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create policy profiles_select on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or (select app.is_superadmin())
    or (tenant_id is not null and tenant_id = (select app.current_tenant_id()))
  );
create policy profiles_insert on public.profiles for insert to authenticated
  with check (tenant_id is not null and app.is_manager_of(tenant_id));
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid()) or (tenant_id is not null and app.is_manager_of(tenant_id)) or (select app.is_superadmin()))
  with check (id = (select auth.uid()) or (tenant_id is not null and app.is_manager_of(tenant_id)) or (select app.is_superadmin()));
create policy profiles_delete on public.profiles for delete to authenticated
  using ((select app.is_superadmin()));

-- ---------------------------------------------------------------------
-- Tabelas de configuração da loja: membros leem, gerentes escrevem
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'business_hours', 'pipelines', 'pipeline_stages', 'vehicles', 'vehicle_photos',
    'tags', 'message_templates', 'automations', 'campaign_investments'
  ] loop
    execute format(
      'create policy %1$s_select on public.%1$I for select to authenticated using (app.is_member_of(tenant_id))', t);
    execute format(
      'create policy %1$s_insert on public.%1$I for insert to authenticated with check (app.is_manager_of(tenant_id))', t);
    execute format(
      'create policy %1$s_update on public.%1$I for update to authenticated using (app.is_manager_of(tenant_id)) with check (app.is_manager_of(tenant_id))', t);
    execute format(
      'create policy %1$s_delete on public.%1$I for delete to authenticated using (app.is_manager_of(tenant_id))', t);
  end loop;
end $$;

-- Ausências: membros veem; gerente gerencia todas, vendedor as próprias
create policy user_absences_select on public.user_absences for select to authenticated
  using (app.is_member_of(tenant_id));
create policy user_absences_write on public.user_absences for all to authenticated
  using (app.is_manager_of(tenant_id) or (user_id = (select auth.uid()) and app.is_member_of(tenant_id)))
  with check (app.is_manager_of(tenant_id) or (user_id = (select auth.uid()) and app.is_member_of(tenant_id)));

-- ---------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------
create policy leads_select on public.leads for select to authenticated
  using (
    app.is_manager_of(tenant_id)
    or (assigned_to = (select auth.uid()) and app.is_member_of(tenant_id))
  );
create policy leads_insert on public.leads for insert to authenticated
  with check (
    app.is_manager_of(tenant_id)
    or (assigned_to = (select auth.uid()) and app.is_member_of(tenant_id))
  );
create policy leads_update on public.leads for update to authenticated
  using (
    app.is_manager_of(tenant_id)
    or (assigned_to = (select auth.uid()) and app.is_member_of(tenant_id))
  )
  with check (
    app.is_manager_of(tenant_id)
    or (assigned_to = (select auth.uid()) and app.is_member_of(tenant_id))
  );
create policy leads_delete on public.leads for delete to authenticated
  using (app.is_manager_of(tenant_id));

-- ---------------------------------------------------------------------
-- Timeline, anexos (seguem o acesso ao lead)
-- ---------------------------------------------------------------------
create policy lead_events_select on public.lead_events for select to authenticated
  using (app.can_access_lead(lead_id));
create policy lead_events_insert on public.lead_events for insert to authenticated
  with check (app.can_access_lead(lead_id) and actor_id = (select auth.uid()));
create policy lead_events_delete on public.lead_events for delete to authenticated
  using (app.is_manager_of(tenant_id));

create policy lead_attachments_select on public.lead_attachments for select to authenticated
  using (app.can_access_lead(lead_id));
create policy lead_attachments_insert on public.lead_attachments for insert to authenticated
  with check (app.can_access_lead(lead_id) and uploaded_by = (select auth.uid()));
create policy lead_attachments_delete on public.lead_attachments for delete to authenticated
  using (app.is_manager_of(tenant_id) or uploaded_by = (select auth.uid()));

-- ---------------------------------------------------------------------
-- tarefas
-- ---------------------------------------------------------------------
create policy tasks_select on public.tasks for select to authenticated
  using (
    app.is_manager_of(tenant_id)
    or (app.is_member_of(tenant_id) and (assigned_to = (select auth.uid()) or (lead_id is not null and app.can_access_lead(lead_id))))
  );
create policy tasks_insert on public.tasks for insert to authenticated
  with check (
    app.is_manager_of(tenant_id)
    or (app.is_member_of(tenant_id) and assigned_to = (select auth.uid())
        and (lead_id is null or app.can_access_lead(lead_id)))
  );
create policy tasks_update on public.tasks for update to authenticated
  using (app.is_manager_of(tenant_id) or (assigned_to = (select auth.uid()) and app.is_member_of(tenant_id)))
  with check (app.is_manager_of(tenant_id) or (assigned_to = (select auth.uid()) and app.is_member_of(tenant_id)));
create policy tasks_delete on public.tasks for delete to authenticated
  using (app.is_manager_of(tenant_id) or (created_by = (select auth.uid()) and app.is_member_of(tenant_id)));

-- ---------------------------------------------------------------------
-- notificações e push (por usuário)
-- ---------------------------------------------------------------------
create policy notifications_select on public.notifications for select to authenticated
  using (user_id = (select auth.uid()));
create policy notifications_insert on public.notifications for insert to authenticated
  with check (app.is_member_of(tenant_id));
create policy notifications_update on public.notifications for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy notifications_delete on public.notifications for delete to authenticated
  using (user_id = (select auth.uid()));

create policy push_subscriptions_own on public.push_subscriptions for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and app.is_member_of(tenant_id));

-- anon não acessa tabelas diretamente; captação pública passa por RPCs SECURITY DEFINER
do $$
declare t text;
begin
  foreach t in array array[
    'tenants', 'profiles', 'user_absences', 'business_hours', 'pipelines', 'pipeline_stages',
    'vehicles', 'vehicle_photos', 'leads', 'lead_events', 'tasks', 'lead_attachments', 'tags',
    'message_templates', 'automations', 'campaign_investments', 'notifications', 'push_subscriptions'
  ] loop
    execute format('revoke all on public.%I from anon', t);
  end loop;
end $$;
