-- الأب (El-Ab) module schema — personal operating system.
-- Plan → Execute → Track → Evaluate, across life areas.

create extension if not exists "pgcrypto";

-- areas (work / gym / creative, but user-extensible)
create table if not exists public.el_areas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  key         text not null,
  name        text not null,
  emoji       text not null default '⬛',
  color       text not null default '#C1272D',
  created_at  timestamptz not null default now()
);

create table if not exists public.el_tasks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  area_key     text not null default 'work',
  title        text not null check (char_length(title) between 1 and 400),
  priority     boolean not null default false,
  status       text not null default 'todo' check (status in ('todo','doing','done','postponed','dropped')),
  estimate_min int not null default 30,
  last_step    int not null default 0,
  day          date not null default current_date,
  created_at   timestamptz not null default now()
);
create index if not exists el_tasks_user_day_idx on public.el_tasks (user_id, day);

create table if not exists public.el_subtasks (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users (id) on delete cascade,
  task_id   uuid not null references public.el_tasks (id) on delete cascade,
  title     text not null,
  done      boolean not null default false,
  sort      int not null default 0
);

create table if not exists public.el_habits (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users (id) on delete cascade,
  name      text not null,
  area_key  text,
  streak    int not null default 0,
  last_done date
);

create table if not exists public.el_expenses (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users (id) on delete cascade,
  amount    numeric(14,2) not null check (amount > 0),
  category  text not null default '',
  note      text,
  spent_at  timestamptz not null default now()
);

create table if not exists public.el_budgets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  category      text not null,
  monthly_limit numeric(14,2) not null default 0
);

create table if not exists public.el_day_reviews (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  day            date not null,
  energy         int,
  completion_pct int,
  points         int,
  blocker        text,
  note           text,
  unique (user_id, day)
);

-- RLS: each row scoped to its owner.
do $$
declare t text;
begin
  foreach t in array array[
    'el_areas','el_tasks','el_subtasks','el_habits','el_expenses','el_budgets','el_day_reviews'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "owner_all" on public.%I;', t);
    execute format(
      'create policy "owner_all" on public.%I
         for all using (auth.uid() = user_id) with check (auth.uid() = user_id);', t);
  end loop;
end $$;
