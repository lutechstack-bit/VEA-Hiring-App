-- =========================================================================
-- 002_rls_policies.sql — Row Level Security
-- =========================================================================

-- Helper: is the current session an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.users where id = auth.uid()),
    false
  );
$$;

-- Helper: is the current session an approved user?
create or replace function public.is_approved()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select status = 'approved' from public.users where id = auth.uid()),
    false
  );
$$;

alter table public.users         enable row level security;
alter table public.profiles      enable row level security;
alter table public.jobs          enable row level security;
alter table public.applications  enable row level security;
alter table public.messages      enable row level security;
alter table public.saved_jobs    enable row level security;
alter table public.activity_log  enable row level security;

-- ========================= users ========================================
drop policy if exists users_self_read     on public.users;
drop policy if exists users_approved_read on public.users;
drop policy if exists users_admin_all     on public.users;
drop policy if exists users_admin_update  on public.users;

create policy users_self_read on public.users
  for select using (auth.uid() = id);

create policy users_approved_read on public.users
  for select using (
    public.is_approved() and status = 'approved'
  );

create policy users_admin_all on public.users
  for select using (public.is_admin());

create policy users_admin_update on public.users
  for update using (public.is_admin()) with check (public.is_admin());

-- ========================= profiles =====================================
drop policy if exists profiles_self_all       on public.profiles;
drop policy if exists profiles_approved_read  on public.profiles;
drop policy if exists profiles_admin_all      on public.profiles;

create policy profiles_self_all on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy profiles_approved_read on public.profiles
  for select using (
    public.is_approved()
    and exists (
      select 1 from public.users u
      where u.id = profiles.user_id and u.status = 'approved'
    )
  );

create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ========================= jobs =========================================
drop policy if exists jobs_approved_read     on public.jobs;
drop policy if exists jobs_owner_read        on public.jobs;
drop policy if exists jobs_owner_insert      on public.jobs;
drop policy if exists jobs_owner_update      on public.jobs;
drop policy if exists jobs_admin_all         on public.jobs;

create policy jobs_approved_read on public.jobs
  for select using (public.is_approved() and status = 'approved');

create policy jobs_owner_read on public.jobs
  for select using (auth.uid() = posted_by);

create policy jobs_owner_insert on public.jobs
  for insert with check (
    auth.uid() = posted_by
    and public.is_approved()
    and (select role from public.users where id = auth.uid()) in ('partner','admin')
  );

-- Posters can update their own job only while it is still pending
create policy jobs_owner_update on public.jobs
  for update using (auth.uid() = posted_by and status = 'pending')
           with check (auth.uid() = posted_by and status = 'pending');

create policy jobs_admin_all on public.jobs
  for all using (public.is_admin()) with check (public.is_admin());

-- ========================= applications =================================
drop policy if exists apps_editor_read   on public.applications;
drop policy if exists apps_editor_insert on public.applications;
drop policy if exists apps_partner_read  on public.applications;
drop policy if exists apps_partner_update on public.applications;
drop policy if exists apps_admin_all     on public.applications;

create policy apps_editor_read on public.applications
  for select using (auth.uid() = editor_id);

create policy apps_editor_insert on public.applications
  for insert with check (
    auth.uid() = editor_id
    and public.is_approved()
    and (select role from public.users where id = auth.uid()) = 'editor'
  );

create policy apps_partner_read on public.applications
  for select using (
    exists (
      select 1 from public.jobs j
      where j.id = applications.job_id and j.posted_by = auth.uid()
    )
  );

create policy apps_partner_update on public.applications
  for update using (
    exists (
      select 1 from public.jobs j
      where j.id = applications.job_id and j.posted_by = auth.uid()
    )
  );

create policy apps_admin_all on public.applications
  for all using (public.is_admin()) with check (public.is_admin());

-- ========================= messages =====================================
drop policy if exists messages_participants_read on public.messages;
drop policy if exists messages_sender_insert      on public.messages;
drop policy if exists messages_admin_all          on public.messages;

create policy messages_participants_read on public.messages
  for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy messages_sender_insert on public.messages
  for insert with check (
    auth.uid() = from_user_id
    and public.is_approved()
  );

create policy messages_admin_all on public.messages
  for all using (public.is_admin()) with check (public.is_admin());

-- ========================= saved_jobs ===================================
drop policy if exists saved_self_all  on public.saved_jobs;
drop policy if exists saved_admin_all on public.saved_jobs;

create policy saved_self_all on public.saved_jobs
  for all using (auth.uid() = editor_id) with check (auth.uid() = editor_id);

create policy saved_admin_all on public.saved_jobs
  for all using (public.is_admin()) with check (public.is_admin());

-- ========================= activity_log =================================
drop policy if exists activity_admin_read on public.activity_log;
create policy activity_admin_read on public.activity_log
  for select using (public.is_admin());

-- Realtime publication for messages
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end$$;

alter publication supabase_realtime add table public.messages;
