-- Roznama — full setup. Paste ALL of this into the Supabase SQL Editor and Run.

-- Roznama schema — Postgres / Supabase
-- Run via the Supabase SQL editor or `supabase db push`.
-- All tables are scoped to auth.users and protected by Row Level Security so a
-- user can only ever read/write their own rows.

create extension if not exists "pgcrypto";

-- ───────────────────────── daily tasks ─────────────────────────
create table if not exists public.daily_tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  text        text not null check (char_length(text) between 1 and 280),
  done        boolean not null default false,
  day         date not null default current_date,
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists daily_tasks_user_idx on public.daily_tasks (user_id, sort);

-- ──────────────────────── monthly goals ────────────────────────
create table if not exists public.monthly_goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  text        text not null check (char_length(text) between 1 and 280),
  target      text not null default '',
  progress    integer not null default 0 check (progress between 0 and 100),
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists monthly_goals_user_idx on public.monthly_goals (user_id, sort);

-- ───────────────────────── transactions ────────────────────────
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  type        text not null check (type in ('in', 'out')),
  amount      numeric(14, 2) not null check (amount > 0),
  cat         text not null default '',
  date        timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
create index if not exists transactions_user_date_idx on public.transactions (user_id, date desc);

-- ───────────────────── per-user preferences ────────────────────
create table if not exists public.preferences (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  notif_on    boolean not null default false,
  updated_at  timestamptz not null default now()
);

-- ─────────────────────── Row Level Security ────────────────────
alter table public.daily_tasks   enable row level security;
alter table public.monthly_goals enable row level security;
alter table public.transactions  enable row level security;
alter table public.preferences   enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['daily_tasks', 'monthly_goals', 'transactions', 'preferences']
  loop
    execute format('drop policy if exists "owner_all" on public.%I;', t);
    execute format(
      'create policy "owner_all" on public.%I
         for all using (auth.uid() = user_id) with check (auth.uid() = user_id);',
      t
    );
  end loop;
end $$;

-- Roznama schema, part 2 — profiles & roles, habits, theme/settings.

-- ───────────────────── profiles & role-based access ────────────────────
do $$ begin
  create type public.user_role as enum ('user', 'admin');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  role         public.user_role not null default 'user',
  theme        text not null default 'system' check (theme in ('light', 'dark', 'system')),
  created_at   timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used by admin policies (security definer dodges RLS recursion).
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin');
$$;

-- ──────────────────────────── habits ───────────────────────────
create table if not exists public.habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 120),
  emoji       text not null default '✅',
  color       text not null default '#3E7C5A',
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists habits_user_idx on public.habits (user_id, sort);

create table if not exists public.habit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  habit_id    uuid not null references public.habits (id) on delete cascade,
  day         date not null default current_date,
  done        boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (habit_id, day)
);
create index if not exists habit_logs_user_day_idx on public.habit_logs (user_id, day desc);

-- ─────────────────────── Row Level Security ────────────────────
alter table public.profiles    enable row level security;
alter table public.habits      enable row level security;
alter table public.habit_logs  enable row level security;

drop policy if exists "self_or_admin_read" on public.profiles;
create policy "self_or_admin_read" on public.profiles
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "self_write" on public.profiles;
create policy "self_write" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

do $$
declare t text;
begin
  foreach t in array array['habits', 'habit_logs'] loop
    execute format('drop policy if exists "owner_all" on public.%I;', t);
    execute format(
      'create policy "owner_all" on public.%I
         for all using (auth.uid() = user_id) with check (auth.uid() = user_id);', t);
  end loop;
end $$;

-- Web Push subscriptions for reminder notifications.

create table if not exists public.push_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  endpoint      text not null unique,
  p256dh        text not null,
  auth          text not null,
  last_reminded date,
  created_at    timestamptz not null default now()
);
create index if not exists push_subscriptions_user_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

drop policy if exists "owner_all" on public.push_subscriptions;
create policy "owner_all" on public.push_subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
