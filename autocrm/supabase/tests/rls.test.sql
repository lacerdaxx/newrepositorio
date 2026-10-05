-- Testes de isolamento multi-tenant e papéis. Rode via tests/run.sh.
\set ON_ERROR_STOP 1
begin;

-- ---------- fixtures (como postgres) ----------
insert into public.tenants (id, name, slug, primary_color) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Loja A', 'loja-a', '#e30613'),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'Loja B', 'loja-b', '#2563eb');

insert into auth.users (id, email, raw_app_meta_data, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000a6e1', 'super@agencia.com', '{"role":"superadmin"}', '{"full_name":"Agência"}'),
  ('00000000-0000-0000-0000-0000000000a1', 'gerente@a.com', '{"role":"gerente","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001"}', '{"full_name":"Gerente A"}'),
  ('00000000-0000-0000-0000-0000000000a2', 'vend1@a.com', '{"role":"vendedor","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001"}', '{"full_name":"Vendedor A1"}'),
  ('00000000-0000-0000-0000-0000000000a3', 'vend2@a.com', '{"role":"vendedor","tenant_id":"aaaaaaaa-0000-0000-0000-000000000001"}', '{"full_name":"Vendedor A2"}'),
  ('00000000-0000-0000-0000-0000000000b1', 'gerente@b.com', '{"role":"gerente","tenant_id":"bbbbbbbb-0000-0000-0000-000000000001"}', '{"full_name":"Gerente B"}');

-- bootstrap criou funis, etapas, templates e expediente
do $$ begin
  assert (select count(*) from public.pipelines where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 3, 'bootstrap: 3 funis';
  assert (select count(*) from public.pipeline_stages s join public.pipelines p on p.id = s.pipeline_id
          where p.is_default and p.tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 7, 'bootstrap: 7 etapas no funil Vendas';
  assert (select count(*) from public.message_templates where tenant_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 6, 'bootstrap: templates';
  assert (select role from public.profiles where email = 'super@agencia.com') = 'superadmin', 'profile superadmin criado';
  assert (select tenant_id from public.profiles where email = 'super@agencia.com') is null, 'superadmin sem loja';
end $$;

insert into public.leads (id, tenant_id, name, phone, assigned_to, source) values
  ('11111111-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Carlos', '5561999990001', '00000000-0000-0000-0000-0000000000a2', 'meta_ads'),
  ('11111111-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'Juliana', '5562999990002', '00000000-0000-0000-0000-0000000000a3', 'instagram'),
  ('22222222-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Rafael', '5561999990003', null, 'site');

do $$ begin
  assert (select stage_id is not null and pipeline_id is not null from public.leads where name = 'Carlos'), 'lead recebe funil/etapa padrão';
  assert (select count(*) from public.lead_events where type = 'created') = 3, 'evento created na timeline';
end $$;

-- dedup: mesmo telefone na mesma loja falha; em outra loja passa
do $$ begin
  begin
    insert into public.leads (tenant_id, name, phone) values ('aaaaaaaa-0000-0000-0000-000000000001', 'Dup', '5561999990001');
    raise exception 'deveria falhar (telefone duplicado)';
  exception when unique_violation then null;
  end;
end $$;

-- ---------- vendedor A1 ----------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);

do $$ begin
  assert (select count(*) from public.leads) = 1, 'vendedor vê só os próprios leads';
  assert (select count(*) from public.tenants) = 1, 'vendedor vê só a própria loja';
  assert (select count(*) from public.profiles) = 3, 'vendedor vê colegas da loja (3)';
  assert (select count(*) from public.pipelines) = 3, 'vendedor vê funis da loja';
  assert (select count(*) from public.lead_events) = 1, 'timeline só dos próprios leads';
end $$;

-- vendedor cria lead → fica responsável automaticamente
insert into public.leads (tenant_id, name, phone, source)
values ('aaaaaaaa-0000-0000-0000-000000000001', 'Walk-in', '5561988887777', 'loja_fisica');
do $$ begin
  assert (select assigned_to from public.leads where name = 'Walk-in') = '00000000-0000-0000-0000-0000000000a2', 'auto-atribuição ao criar';
end $$;

-- vendedor não cria lead em outra loja
do $$ begin
  begin
    insert into public.leads (tenant_id, name, phone) values ('bbbbbbbb-0000-0000-0000-000000000001', 'X', '5561977776666');
    raise exception 'deveria falhar (outra loja)';
  exception when insufficient_privilege then null;
  end;
end $$;

-- vendedor não repassa lead para outro vendedor
do $$ begin
  begin
    update public.leads set assigned_to = '00000000-0000-0000-0000-0000000000a3' where name = 'Carlos';
    raise exception 'deveria falhar (repasse)';
  exception when insufficient_privilege then null;
  end;
end $$;

-- mover para Perdido exige motivo
do $$
declare v_lost uuid;
begin
  select s.id into v_lost from public.pipeline_stages s join public.pipelines p on p.id = s.pipeline_id
   where p.is_default and s.kind = 'lost';
  begin
    update public.leads set stage_id = v_lost where name = 'Carlos';
    raise exception 'deveria exigir motivo';
  exception when check_violation then null;
  end;
  update public.leads set stage_id = v_lost, lost_reason = 'preco' where name = 'Carlos';
  assert (select lost_at is not null from public.leads where name = 'Carlos'), 'lost_at preenchido';
  assert exists (select 1 from public.lead_events where type = 'stage_changed' and data ->> 'to' = 'Perdido'), 'evento de etapa';
end $$;

-- contato via WhatsApp marca primeiro contato
insert into public.lead_events (tenant_id, lead_id, actor_id, type, data)
values ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000a2', 'whatsapp', '{"template":"Saudação"}');
do $$ begin
  assert (select first_contact_at is not null from public.leads where name = 'Carlos'), 'first_contact_at';
end $$;

-- vendedor não promove a si mesmo nem altera marca da loja
do $$ begin
  begin
    update public.profiles set role = 'gerente' where id = '00000000-0000-0000-0000-0000000000a2';
    raise exception 'deveria falhar (autopromoção)';
  exception when insufficient_privilege then null;
  end;
  update public.tenants set primary_color = '#000000';
  assert (select primary_color from public.tenants) = '#e30613', 'vendedor não altera a loja (RLS filtra)';
end $$;
-- mas pode editar o próprio nome
update public.profiles set full_name = 'Vendedor A1 Silva' where id = '00000000-0000-0000-0000-0000000000a2';

-- ---------- gerente A ----------
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
do $$ begin
  assert (select count(*) from public.leads) = 3, 'gerente vê todos os leads da loja';
  assert not exists (select 1 from public.leads where tenant_id = 'bbbbbbbb-0000-0000-0000-000000000001'), 'gerente não vê outra loja';
end $$;
update public.tenants set primary_color = '#111111' where id = 'aaaaaaaa-0000-0000-0000-000000000001';
update public.leads set assigned_to = '00000000-0000-0000-0000-0000000000a3' where name = 'Walk-in';
do $$ begin
  assert (select primary_color from public.tenants where id = 'aaaaaaaa-0000-0000-0000-000000000001') = '#111111', 'gerente altera marca';
  assert exists (select 1 from public.lead_events where type = 'assigned' and data ->> 'to_name' = 'Vendedor A2'), 'evento de atribuição';
  begin
    update public.tenants set active = false where id = 'aaaaaaaa-0000-0000-0000-000000000001';
    raise exception 'deveria falhar (gerente desativando loja)';
  exception when insufficient_privilege then null;
  end;
  begin
    perform * from public.admin_tenant_overview();
    raise exception 'deveria falhar (overview restrito)';
  exception when insufficient_privilege then null;
  end;
end $$;

-- ---------- superadmin ----------
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000a6e1","role":"authenticated"}', true);
do $$ begin
  assert (select count(*) from public.tenants) = 2, 'superadmin vê todas as lojas';
  assert (select count(*) from public.admin_tenant_overview()) = 2, 'overview da agência';
end $$;
update public.tenants set active = false where id = 'bbbbbbbb-0000-0000-0000-000000000001';

-- ---------- gerente B (loja desativada) ----------
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
do $$ begin
  assert (select count(*) from public.leads) = 0, 'loja desativada perde acesso aos leads';
end $$;

-- ---------- anônimo ----------
reset role;
set local role anon;
select set_config('request.jwt.claims', '', true);
do $$ begin
  assert (select name from public.get_public_tenant('loja-a')) = 'Loja A', 'marca pública por slug';
  begin
    perform 1 from public.leads;
    raise exception 'anon não deveria ler leads';
  exception when insufficient_privilege then null;
  end;
end $$;

-- ---------- captação pública (anon) ----------
do $$
declare r jsonb; r2 jsonb;
begin
  assert app.normalize_phone('(61) 99999-1234') = '5561999991234', 'normaliza celular';
  assert app.normalize_phone('6188881234') = '5561988881234', 'adiciona o 9';
  assert app.normalize_phone('123') is null, 'telefone inválido';
  r := public.submit_public_lead('loja-a', 'Lead Site', '(61) 97777-0001', null, 'meta_ads', '{"utm_campaign":"onix-outubro"}');
  assert (r ->> 'duplicate')::boolean = false, 'lead novo';
  assert (r ->> 'assigned_to') is not null, 'rodízio atribuiu vendedor';
  r2 := public.submit_public_lead('loja-a', 'Lead Site', '61977770001', null, 'site', '{}');
  assert (r2 ->> 'duplicate')::boolean = true and r2 ->> 'lead_id' = r ->> 'lead_id', 'deduplicação';
  begin
    perform public.submit_public_lead('loja-b', 'X', '61977770002');
    raise exception 'loja desativada não deveria captar';
  exception when no_data_found then null;
  end;
end $$;

reset role;
rollback;
\echo 'RLS: todos os testes passaram'
