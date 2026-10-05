-- =====================================================================
-- AutoCRM · 0004 · Storage (buckets + políticas) e Realtime
-- Convenção de caminhos: {tenant_id}/... (e {tenant_id}/{lead_id}/... nos anexos)
-- =====================================================================

insert into storage.buckets (id, name, public)
values
  ('tenant-assets', 'tenant-assets', true),     -- logos, favicons
  ('vehicle-photos', 'vehicle-photos', true),   -- fotos do estoque (páginas públicas)
  ('lead-attachments', 'lead-attachments', false)
on conflict (id) do nothing;

-- públicos: leitura liberada pelo bucket; escrita só gerente da loja dona da pasta
create policy "assets: gerente escreve" on storage.objects for insert to authenticated
  with check (
    bucket_id in ('tenant-assets', 'vehicle-photos')
    and app.is_manager_of(app.try_uuid((storage.foldername(name))[1]))
  );
create policy "assets: gerente atualiza" on storage.objects for update to authenticated
  using (
    bucket_id in ('tenant-assets', 'vehicle-photos')
    and app.is_manager_of(app.try_uuid((storage.foldername(name))[1]))
  );
create policy "assets: gerente remove" on storage.objects for delete to authenticated
  using (
    bucket_id in ('tenant-assets', 'vehicle-photos')
    and app.is_manager_of(app.try_uuid((storage.foldername(name))[1]))
  );

-- anexos: privados, acesso de quem acessa o lead
create policy "anexos: leitura" on storage.objects for select to authenticated
  using (
    bucket_id = 'lead-attachments'
    and app.can_access_lead(app.try_uuid((storage.foldername(name))[2]))
  );
create policy "anexos: upload" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'lead-attachments'
    and app.can_access_lead(app.try_uuid((storage.foldername(name))[2]))
  );
create policy "anexos: remover" on storage.objects for delete to authenticated
  using (
    bucket_id = 'lead-attachments'
    and app.can_access_lead(app.try_uuid((storage.foldername(name))[2]))
  );

-- Realtime (o filtro por linha respeita o RLS de cada tabela)
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.leads, public.lead_events, public.tasks, public.notifications;
  end if;
end $$;
