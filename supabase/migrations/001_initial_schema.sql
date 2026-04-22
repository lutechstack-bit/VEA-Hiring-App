-- =========================================================================
-- 001_initial_schema.sql
-- LevelUp Talent Network — tables, indexes, triggers
-- =========================================================================

create extension if not exists "pgcrypto";

-- ----------------------- users (public profile mirror) -------------------
create table if not exists public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text unique not null,
  role         text not null check (role in ('editor','partner','admin')),
  name         text not null,
  status       text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at   timestamptz not null default now(),
  approved_at  timestamptz,
  approved_by  uuid references public.users(id)
);

create index if not exists users_email_idx  on public.users(email);
create index if not exists users_status_idx on public.users(status);
create index if not exists users_role_idx   on public.users(role);

-- ----------------------- profiles ----------------------------------------
create table if not exists public.profiles (
  user_id         uuid primary key references public.users(id) on delete cascade,
  bio             text,
  location        text,
  experience      text check (experience in ('Beginner','Intermediate','Advanced')),
  skills          text[] not null default '{}',
  portfolio_links jsonb  not null default '[]'::jsonb,
  tags            text[] not null default '{}',
  website         text,
  avatar_url      text,
  qualifications  text[] not null default '{}',
  updated_at      timestamptz not null default now()
);

-- ----------------------- jobs --------------------------------------------
create table if not exists public.jobs (
  id              uuid primary key default gen_random_uuid(),
  posted_by       uuid not null references public.users(id) on delete cascade,
  type            text not null check (type in ('job','gig')),
  employment_type text check (employment_type in ('Full-time','Part-time','Internship','Contract','Freelance')),
  title           text not null,
  company         text not null,
  location        text not null,
  work_mode       text not null check (work_mode in ('Remote','Hybrid','On-site')),
  budget          text not null,
  budget_type     text check (budget_type in ('salary','project')),
  description     text not null,
  skills          text[] not null default '{}',
  qualifications  text[] not null default '{}',
  experience      text not null check (experience in ('Beginner','Intermediate','Advanced')),
  status          text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at      timestamptz not null default now(),
  approved_at     timestamptz
);

create index if not exists jobs_status_idx      on public.jobs(status);
create index if not exists jobs_type_idx        on public.jobs(type);
create index if not exists jobs_posted_by_idx   on public.jobs(posted_by);
create index if not exists jobs_created_at_idx  on public.jobs(created_at desc);

-- ----------------------- applications ------------------------------------
create table if not exists public.applications (
  id         uuid primary key default gen_random_uuid(),
  job_id     uuid not null references public.jobs(id)  on delete cascade,
  editor_id  uuid not null references public.users(id) on delete cascade,
  status     text not null default 'Applied' check (status in ('Applied','Shortlisted','Hired','Rejected')),
  note       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, editor_id)
);

create index if not exists applications_editor_idx on public.applications(editor_id);
create index if not exists applications_job_idx    on public.applications(job_id);
create index if not exists applications_status_idx on public.applications(status);

-- ----------------------- messages ----------------------------------------
create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  thread_id    text not null,
  from_user_id uuid not null references public.users(id) on delete cascade,
  to_user_id   uuid not null references public.users(id) on delete cascade,
  text         text not null,
  created_at   timestamptz not null default now(),
  read_at      timestamptz
);

create index if not exists messages_thread_idx on public.messages(thread_id, created_at);
create index if not exists messages_to_idx     on public.messages(to_user_id);

-- ----------------------- saved_jobs --------------------------------------
create table if not exists public.saved_jobs (
  id         uuid primary key default gen_random_uuid(),
  editor_id  uuid not null references public.users(id) on delete cascade,
  job_id     uuid not null references public.jobs(id)  on delete cascade,
  created_at timestamptz not null default now(),
  unique (editor_id, job_id)
);

create index if not exists saved_jobs_editor_idx on public.saved_jobs(editor_id);

-- ----------------------- activity_log ------------------------------------
create table if not exists public.activity_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references public.users(id),
  action      text not null,
  target_type text,
  target_id   uuid,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists activity_created_idx on public.activity_log(created_at desc);

-- ----------------------- triggers ----------------------------------------
-- Create a public.users row + empty public.profiles row when a new auth
-- user signs up. Role and name come from the user's signup metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _role text;
  _name text;
begin
  _role := coalesce(new.raw_user_meta_data->>'role', 'editor');
  _name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));

  insert into public.users (id, email, role, name)
  values (new.id, new.email, _role, _name)
  on conflict (id) do nothing;

  insert into public.profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at maintenance
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists applications_touch on public.applications;
create trigger applications_touch before update on public.applications
  for each row execute function public.touch_updated_at();

-- Activity log helpers ----------------------------------------------------
create or replace function public.log_activity(
  _actor uuid, _action text, _target_type text, _target_id uuid, _metadata jsonb default '{}'::jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.activity_log (actor_id, action, target_type, target_id, metadata)
  values (_actor, _action, _target_type, _target_id, coalesce(_metadata, '{}'::jsonb));
end;
$$;
