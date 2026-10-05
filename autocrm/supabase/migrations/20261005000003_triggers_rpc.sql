-- =====================================================================
-- AutoCRM · 0003 · Triggers, bootstrap de loja e RPCs públicas
-- =====================================================================

-- ---------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------
create or replace function app.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['tenants', 'profiles', 'vehicles', 'leads', 'tasks', 'message_templates', 'automations'] loop
    execute format('create trigger %1$s_updated_at before update on public.%1$I for each row execute function app.set_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Novo usuário do Auth → profile.
-- Papel e loja vêm de raw_app_meta_data (só o service role consegue definir),
-- nunca de raw_user_meta_data (controlado pelo próprio usuário).
-- ---------------------------------------------------------------------
create or replace function app.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_role public.app_role := coalesce(nullif(new.raw_app_meta_data ->> 'role', ''), 'vendedor')::public.app_role;
  v_tenant uuid := app.try_uuid(new.raw_app_meta_data ->> 'tenant_id');
begin
  insert into public.profiles (id, tenant_id, role, full_name, email)
  values (
    new.id,
    case when v_role = 'superadmin' then null else v_tenant end,
    v_role,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function app.handle_new_user();

-- ---------------------------------------------------------------------
-- Proteção de colunas sensíveis (o RLS libera a linha; aqui limitamos colunas)
-- auth.uid() nulo = service role / migrations → sem restrição.
-- ---------------------------------------------------------------------
create or replace function app.guard_tenant_update()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null and not app.is_superadmin() then
    if new.slug is distinct from old.slug
      or new.custom_domain is distinct from old.custom_domain
      or new.active is distinct from old.active then
      raise exception 'Apenas a agência pode alterar subdomínio, domínio ou status da loja'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

create trigger tenants_guard before update on public.tenants
  for each row execute function app.guard_tenant_update();

create or replace function app.guard_profile_update()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or app.is_superadmin() then
    return new;
  end if;
  if new.tenant_id is distinct from old.tenant_id or new.role = 'superadmin' then
    raise exception 'Operação não permitida' using errcode = '42501';
  end if;
  if not app.is_manager_of(old.tenant_id) and (
    new.role is distinct from old.role
    or new.active is distinct from old.active
    or new.receives_leads is distinct from old.receives_leads
    or new.distribution_weight is distinct from old.distribution_weight
  ) then
    raise exception 'Apenas o gerente pode alterar papel, status ou distribuição' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger profiles_guard before update on public.profiles
  for each row execute function app.guard_profile_update();

-- ---------------------------------------------------------------------
-- Bootstrap: toda loja nova nasce com funis, etapas, templates e expediente
-- ---------------------------------------------------------------------
create or replace function app.create_pipeline(
  p_tenant uuid, p_name text, p_position smallint, p_default boolean, p_stages jsonb
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_pipeline uuid;
  v_stage jsonb;
  v_i smallint := 0;
begin
  insert into public.pipelines (tenant_id, name, position, is_default)
  values (p_tenant, p_name, p_position, p_default)
  returning id into v_pipeline;

  for v_stage in select * from jsonb_array_elements(p_stages) loop
    insert into public.pipeline_stages (tenant_id, pipeline_id, name, position, color, kind)
    values (
      p_tenant, v_pipeline, v_stage ->> 'name', v_i,
      coalesce(v_stage ->> 'color', '#64748b'),
      coalesce(v_stage ->> 'kind', 'open')::public.stage_kind
    );
    v_i := v_i + 1;
  end loop;
  return v_pipeline;
end;
$$;

create or replace function app.bootstrap_tenant()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform app.create_pipeline(new.id, 'Vendas', 0::smallint, true, '[
    {"name": "Novo Lead", "color": "#6366f1"},
    {"name": "Em Atendimento", "color": "#0ea5e9"},
    {"name": "Qualificado", "color": "#14b8a6"},
    {"name": "Visita Agendada", "color": "#f59e0b"},
    {"name": "Proposta/Simulação", "color": "#a855f7"},
    {"name": "Vendido", "color": "#22c55e", "kind": "won"},
    {"name": "Perdido", "color": "#ef4444", "kind": "lost"}
  ]'::jsonb);

  perform app.create_pipeline(new.id, 'Avaliação de Usados', 1::smallint, false, '[
    {"name": "Solicitado", "color": "#6366f1"},
    {"name": "Avaliação Agendada", "color": "#f59e0b"},
    {"name": "Avaliado", "color": "#0ea5e9"},
    {"name": "Proposta Enviada", "color": "#a855f7"},
    {"name": "Comprado", "color": "#22c55e", "kind": "won"},
    {"name": "Perdido", "color": "#ef4444", "kind": "lost"}
  ]'::jsonb);

  perform app.create_pipeline(new.id, 'Financiamento', 2::smallint, false, '[
    {"name": "Documentação", "color": "#6366f1"},
    {"name": "Em Análise", "color": "#f59e0b"},
    {"name": "Aprovado", "color": "#14b8a6"},
    {"name": "Contratado", "color": "#22c55e", "kind": "won"},
    {"name": "Reprovado", "color": "#ef4444", "kind": "lost"}
  ]'::jsonb);

  insert into public.message_templates (tenant_id, name, category, body, position) values
    (new.id, 'Saudação', 'saudacao',
     'Olá, {nome}! Aqui é {vendedor}, da {loja}. Vi seu interesse no {veiculo} e estou à disposição para te ajudar. Posso te enviar mais detalhes?', 0),
    (new.id, 'Ficha do veículo', 'ficha_veiculo',
     '{nome}, segue a ficha do {veiculo}:\n\n{ficha}\n\nQualquer dúvida, é só me chamar!', 1),
    (new.id, 'Confirmação de visita', 'visita',
     'Oi, {nome}! Passando para confirmar sua visita à {loja} para conhecer o {veiculo}. Te aguardo! — {vendedor}', 2),
    (new.id, 'Follow-up D+1', 'follow_up',
     'Oi, {nome}, tudo bem? Conseguiu ver as informações do {veiculo}? Posso simular um financiamento pra você.', 3),
    (new.id, 'Follow-up D+3', 'follow_up',
     '{nome}, o {veiculo} ainda está disponível aqui na {loja}. Quer agendar um test drive sem compromisso?', 4),
    (new.id, 'Follow-up D+7', 'follow_up',
     'Oi, {nome}! Chegaram novidades no estoque da {loja}. Ainda está procurando carro? Posso te mandar algumas opções.', 5);

  insert into public.business_hours (tenant_id, weekday, opens_at, closes_at)
  select new.id, d::smallint, time '08:00', time '18:00' from generate_series(1, 5) d
  union all select new.id, 6::smallint, time '08:00', time '13:00';

  return new;
end;
$$;

create trigger tenants_bootstrap after insert on public.tenants
  for each row execute function app.bootstrap_tenant();

-- ---------------------------------------------------------------------
-- Leads: defaults, regras de etapa e timeline automática
-- ---------------------------------------------------------------------
create or replace function app.leads_before_write()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_kind public.stage_kind;
begin
  if tg_op = 'INSERT' then
    new.created_by := coalesce(new.created_by, auth.uid());
    if new.pipeline_id is null then
      select id into new.pipeline_id from public.pipelines
      where tenant_id = new.tenant_id order by is_default desc, position limit 1;
    end if;
    if new.stage_id is null then
      select id into new.stage_id from public.pipeline_stages
      where pipeline_id = new.pipeline_id and kind = 'open' order by position limit 1;
    end if;
    -- vendedor que cadastra lead fica responsável por ele
    if new.assigned_to is null and app.current_role() = 'vendedor' then
      new.assigned_to := auth.uid();
    end if;
    if new.position = 0 then
      new.position := -extract(epoch from clock_timestamp());
    end if;
  end if;

  if tg_op = 'INSERT' or new.stage_id is distinct from old.stage_id or new.pipeline_id is distinct from old.pipeline_id then
    select kind into v_kind from public.pipeline_stages
    where id = new.stage_id and pipeline_id = new.pipeline_id;
    if v_kind is null then
      raise exception 'A etapa não pertence ao funil informado' using errcode = '23514';
    end if;

    if tg_op = 'UPDATE' then
      new.stage_changed_at := now();
    end if;

    if v_kind = 'lost' then
      if new.lost_reason is null then
        raise exception 'Informe o motivo da perda' using errcode = '23514';
      end if;
      new.lost_at := now();
      new.won_at := null;
    elsif v_kind = 'won' then
      new.won_at := now();
      new.lost_at := null;
      new.lost_reason := null;
    else
      new.won_at := null;
      new.lost_at := null;
      new.lost_reason := null;
      new.lost_note := null;
    end if;
  end if;
  return new;
end;
$$;

create trigger leads_before_write before insert or update on public.leads
  for each row execute function app.leads_before_write();

create or replace function app.leads_after_write()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.lead_events (tenant_id, lead_id, actor_id, type, data)
    values (new.tenant_id, new.id, auth.uid(), 'created',
            jsonb_build_object('source', new.source, 'campaign', new.campaign, 'stage_id', new.stage_id));
    return new;
  end if;

  if new.stage_id is distinct from old.stage_id then
    insert into public.lead_events (tenant_id, lead_id, actor_id, type, data)
    values (new.tenant_id, new.id, auth.uid(), 'stage_changed', jsonb_build_object(
      'from_stage_id', old.stage_id,
      'to_stage_id', new.stage_id,
      'from', (select name from public.pipeline_stages where id = old.stage_id),
      'to', (select name from public.pipeline_stages where id = new.stage_id),
      'lost_reason', new.lost_reason,
      'lost_note', new.lost_note
    ));
  end if;

  if new.assigned_to is distinct from old.assigned_to then
    insert into public.lead_events (tenant_id, lead_id, actor_id, type, data)
    values (new.tenant_id, new.id, auth.uid(), 'assigned', jsonb_build_object(
      'from', old.assigned_to,
      'to', new.assigned_to,
      'to_name', (select full_name from public.profiles where id = new.assigned_to)
    ));
  end if;
  return new;
end;
$$;

create trigger leads_after_write after insert or update on public.leads
  for each row execute function app.leads_after_write();

-- Contato via WhatsApp registrado → marca primeiro/último contato (tempo de resposta)
create or replace function app.lead_events_contact()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.type = 'whatsapp' then
    update public.leads
       set first_contact_at = coalesce(first_contact_at, new.created_at),
           last_contact_at = new.created_at
     where id = new.lead_id;
  end if;
  return new;
end;
$$;

create trigger lead_events_contact after insert on public.lead_events
  for each row execute function app.lead_events_contact();

-- ---------------------------------------------------------------------
-- RPCs públicas
-- ---------------------------------------------------------------------

/** Marca pública da loja (formulário, catálogo, login). Sem dados sensíveis. */
create or replace function public.get_public_tenant(p_slug text default null, p_domain text default null)
returns table (
  id uuid, name text, slug text, logo_url text, favicon_url text,
  primary_color text, secondary_color text, whatsapp text, timezone text,
  offers_group_url text, active boolean
)
language sql stable security definer set search_path = '' as $$
  select t.id, t.name, t.slug, t.logo_url, t.favicon_url, t.primary_color, t.secondary_color,
         t.whatsapp, t.timezone, t.offers_group_url, t.active
  from public.tenants t
  where (p_slug is not null and t.slug = lower(p_slug))
     or (p_domain is not null and t.custom_domain = lower(p_domain))
  limit 1;
$$;

revoke all on function public.get_public_tenant(text, text) from public;
grant execute on function public.get_public_tenant(text, text) to anon, authenticated;

/** Painel da agência: métricas consolidadas por loja. */
create or replace function public.admin_tenant_overview()
returns table (
  id uuid, name text, slug text, logo_url text, primary_color text, active boolean, created_at timestamptz,
  users_count bigint, leads_month bigint, leads_total bigint, sales_month bigint, unattended bigint
)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not app.is_superadmin() then
    raise exception 'Acesso restrito à agência' using errcode = '42501';
  end if;
  return query
  select t.id, t.name, t.slug, t.logo_url, t.primary_color, t.active, t.created_at,
    (select count(*) from public.profiles p where p.tenant_id = t.id and p.active),
    (select count(*) from public.leads l where l.tenant_id = t.id and l.created_at >= date_trunc('month', now())),
    (select count(*) from public.leads l where l.tenant_id = t.id),
    (select count(*) from public.leads l where l.tenant_id = t.id and l.won_at >= date_trunc('month', now())),
    (select count(*) from public.leads l
       join public.pipeline_stages s on s.id = l.stage_id
      where l.tenant_id = t.id and l.first_contact_at is null and s.kind = 'open')
  from public.tenants t
  order by t.active desc, t.name;
end;
$$;

revoke all on function public.admin_tenant_overview() from public;
grant execute on function public.admin_tenant_overview() to authenticated;
