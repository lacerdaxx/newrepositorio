-- =====================================================================
-- AutoCRM · 0005 · Estoque público, captação "Tenho interesse",
-- distribuição em rodízio ponderado e contadores
-- =====================================================================

-- get_public_tenant passa a expor o alerta de "sem contato" (usado nos cards do funil)
drop function if exists public.get_public_tenant(text, text);
create function public.get_public_tenant(p_slug text default null, p_domain text default null)
returns table (
  id uuid, name text, slug text, logo_url text, favicon_url text,
  primary_color text, secondary_color text, whatsapp text, timezone text,
  offers_group_url text, active boolean, no_contact_alert_minutes integer
)
language sql stable security definer set search_path = '' as $$
  select t.id, t.name, t.slug, t.logo_url, t.favicon_url, t.primary_color, t.secondary_color,
         t.whatsapp, t.timezone, t.offers_group_url, t.active, t.no_contact_alert_minutes
  from public.tenants t
  where (p_slug is not null and t.slug = lower(p_slug))
     or (p_domain is not null and t.custom_domain = lower(p_domain))
  limit 1;
$$;
revoke all on function public.get_public_tenant(text, text) from public;
grant execute on function public.get_public_tenant(text, text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Telefone BR → 55DDDNÚMERO (mesma regra de src/lib/format.ts)
-- ---------------------------------------------------------------------
create or replace function app.normalize_phone(p text)
returns text language plpgsql immutable as $$
declare d text := regexp_replace(coalesce(p, ''), '\D', '', 'g');
begin
  if d like '00%' then d := substr(d, 3); end if;
  if d like '0%' then d := substr(d, 2); end if;
  if length(d) in (10, 11) then d := '55' || d; end if;
  if d not like '55%' then return null; end if;
  if length(d) = 12 and substr(d, 5, 1) ~ '[6-9]' then
    d := substr(d, 1, 4) || '9' || substr(d, 5);
  end if;
  if length(d) in (12, 13) then return d; end if;
  return null;
end;
$$;

-- ---------------------------------------------------------------------
-- Rodízio ponderado: escolhe o vendedor ativo, que recebe leads e não está
-- ausente, com menor (leads recebidos nos últimos 7 dias ÷ peso).
-- Empate → quem recebeu há mais tempo.
-- ---------------------------------------------------------------------
create or replace function app.pick_next_seller(p_tenant uuid)
returns uuid language sql volatile security definer set search_path = '' as $$
  select p.id
  from public.profiles p
  where p.tenant_id = p_tenant
    and p.active and p.receives_leads and p.distribution_weight > 0
    and p.role in ('vendedor', 'gerente')
    and not exists (
      select 1 from public.user_absences a
      where a.user_id = p.id and now() between a.starts_at and a.ends_at
    )
  order by
    (select count(*) from public.leads l
      where l.assigned_to = p.id and l.created_at > now() - interval '7 days')::numeric / p.distribution_weight,
    p.last_assigned_at nulls first,
    p.id
  limit 1
  for update of p skip locked;
$$;

-- ---------------------------------------------------------------------
-- Captação pública (página do veículo, formulário, catálogo).
-- Deduplica por telefone: lead existente recebe um evento na timeline.
-- ---------------------------------------------------------------------
create or replace function public.submit_public_lead(
  p_tenant_slug text,
  p_name text,
  p_phone text,
  p_vehicle_id uuid default null,
  p_source text default 'site',
  p_payload jsonb default '{}'::jsonb
) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare
  v_tenant public.tenants%rowtype;
  v_phone text := app.normalize_phone(p_phone);
  v_name text := left(trim(coalesce(p_name, '')), 120);
  v_lead uuid;
  v_seller uuid;
  v_vehicle uuid;
  v_source public.lead_source;
begin
  select * into v_tenant from public.tenants where slug = lower(p_tenant_slug) and active;
  if not found then raise exception 'Loja indisponível' using errcode = 'P0002'; end if;
  if length(v_name) < 2 then raise exception 'Informe seu nome' using errcode = '22023'; end if;
  if v_phone is null then raise exception 'WhatsApp inválido' using errcode = '22023'; end if;

  begin
    v_source := coalesce(nullif(p_source, ''), 'site')::public.lead_source;
  exception when invalid_text_representation then
    v_source := 'site';
  end;

  if p_vehicle_id is not null then
    select id into v_vehicle from public.vehicles where id = p_vehicle_id and tenant_id = v_tenant.id;
  end if;

  select id into v_lead from public.leads where tenant_id = v_tenant.id and phone = v_phone;

  if v_lead is not null then
    update public.leads
       set vehicle_id = coalesce(v_vehicle, vehicle_id),
           updated_at = now()
     where id = v_lead;
    insert into public.lead_events (tenant_id, lead_id, type, data)
    values (v_tenant.id, v_lead, 'note', jsonb_build_object(
      'body', 'Novo contato pelo site' || case when v_vehicle is not null then ' (interesse em veículo)' else '' end,
      'system', true, 'source', v_source, 'vehicle_id', v_vehicle, 'payload', p_payload
    ));
    return jsonb_build_object('lead_id', v_lead, 'duplicate', true);
  end if;

  if v_tenant.distribution_mode = 'round_robin' then
    v_seller := app.pick_next_seller(v_tenant.id);
    if v_seller is not null then
      update public.profiles set last_assigned_at = now() where id = v_seller;
    end if;
  end if;

  insert into public.leads (
    tenant_id, name, phone, email, city, source, assigned_to, vehicle_id, vehicle_interest,
    campaign, ad_name, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    down_payment, has_trade_in, trade_in_model, trade_in_year, trade_in_km, payment_method
  ) values (
    v_tenant.id, v_name, v_phone,
    nullif(left(p_payload ->> 'email', 160), ''),
    nullif(left(p_payload ->> 'city', 80), ''),
    v_source, v_seller, v_vehicle,
    nullif(left(p_payload ->> 'vehicle_interest', 160), ''),
    nullif(left(coalesce(p_payload ->> 'campaign', p_payload ->> 'utm_campaign'), 160), ''),
    nullif(left(p_payload ->> 'ad_name', 160), ''),
    nullif(left(p_payload ->> 'utm_source', 160), ''),
    nullif(left(p_payload ->> 'utm_medium', 160), ''),
    nullif(left(p_payload ->> 'utm_campaign', 160), ''),
    nullif(left(p_payload ->> 'utm_content', 160), ''),
    nullif(left(p_payload ->> 'utm_term', 160), ''),
    case when p_payload ->> 'down_payment' ~ '^\d+(\.\d+)?$' then (p_payload ->> 'down_payment')::numeric end,
    coalesce((p_payload ->> 'has_trade_in')::boolean, false),
    nullif(left(p_payload ->> 'trade_in_model', 120), ''),
    case when p_payload ->> 'trade_in_year' ~ '^\d{4}$' then (p_payload ->> 'trade_in_year')::smallint end,
    case when p_payload ->> 'trade_in_km' ~ '^\d+$' then (p_payload ->> 'trade_in_km')::integer end,
    case when p_payload ->> 'payment_method' in ('a_vista', 'financiado', 'consorcio')
         then (p_payload ->> 'payment_method')::public.payment_method end
  ) returning id into v_lead;

  return jsonb_build_object('lead_id', v_lead, 'duplicate', false, 'assigned_to', v_seller);
end;
$$;
revoke all on function public.submit_public_lead(text, text, text, uuid, text, jsonb) from public;
grant execute on function public.submit_public_lead(text, text, text, uuid, text, jsonb) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Veículo público (página compartilhável) e catálogo
-- ---------------------------------------------------------------------
create or replace function public.get_public_vehicle(p_tenant_slug text, p_vehicle_id uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'id', v.id, 'brand', v.brand, 'model', v.model, 'version', v.version,
    'year_manufacture', v.year_manufacture, 'year_model', v.year_model, 'km', v.km,
    'color', v.color, 'transmission', v.transmission, 'fuel', v.fuel,
    'plate_end', right(regexp_replace(coalesce(v.plate, ''), '[^A-Za-z0-9]', '', 'g'), 1),
    'price', v.price, 'description', v.description, 'features', v.features,
    'status', v.status, 'cover_url', v.cover_url,
    'photos', coalesce((
      select jsonb_agg(ph.storage_path order by ph.position)
      from public.vehicle_photos ph where ph.vehicle_id = v.id
    ), '[]'::jsonb)
  )
  from public.vehicles v
  join public.tenants t on t.id = v.tenant_id
  where t.slug = lower(p_tenant_slug) and t.active and v.id = p_vehicle_id;
$$;
revoke all on function public.get_public_vehicle(text, uuid) from public;
grant execute on function public.get_public_vehicle(text, uuid) to anon, authenticated;

create or replace function public.list_public_vehicles(p_tenant_slug text)
returns setof jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'id', v.id, 'brand', v.brand, 'model', v.model, 'version', v.version,
    'year_model', v.year_model, 'km', v.km, 'price', v.price, 'status', v.status,
    'transmission', v.transmission, 'fuel', v.fuel, 'cover_url', v.cover_url
  )
  from public.vehicles v
  join public.tenants t on t.id = v.tenant_id
  where t.slug = lower(p_tenant_slug) and t.active and v.status <> 'vendido'
  order by v.created_at desc;
$$;
revoke all on function public.list_public_vehicles(text) from public;
grant execute on function public.list_public_vehicles(text) to anon, authenticated;

-- Interessados por veículo (conta todos os leads da loja, inclusive de outros vendedores)
create or replace function public.vehicle_interest_counts(p_tenant uuid)
returns table (vehicle_id uuid, leads bigint)
language sql stable security definer set search_path = '' as $$
  select l.vehicle_id, count(*)
  from public.leads l
  where l.tenant_id = p_tenant and l.vehicle_id is not null and app.is_member_of(p_tenant)
  group by l.vehicle_id;
$$;
revoke all on function public.vehicle_interest_counts(uuid) from public;
grant execute on function public.vehicle_interest_counts(uuid) to authenticated;

-- capa do veículo = primeira foto (mantida automaticamente)
create or replace function app.sync_vehicle_cover()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_vehicle uuid := coalesce(new.vehicle_id, old.vehicle_id);
begin
  update public.vehicles
     set cover_url = (select storage_path from public.vehicle_photos where vehicle_id = v_vehicle order by position, created_at limit 1)
   where id = v_vehicle;
  return null;
end;
$$;
create trigger vehicle_photos_cover after insert or update or delete on public.vehicle_photos
  for each row execute function app.sync_vehicle_cover();
