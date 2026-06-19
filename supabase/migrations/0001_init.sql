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
