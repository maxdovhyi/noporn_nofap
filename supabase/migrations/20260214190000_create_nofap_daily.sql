create table if not exists public.nofap_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  status text not null check (status in ('clean','slip')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists nofap_daily_user_day_uniq
  on public.nofap_daily (user_id, day);

create index if not exists nofap_daily_user_day_idx
  on public.nofap_daily (user_id, day desc);

alter table public.nofap_daily enable row level security;

drop policy if exists "nofap_daily_select_own" on public.nofap_daily;
create policy "nofap_daily_select_own"
on public.nofap_daily for select
using (auth.uid() = user_id);

drop policy if exists "nofap_daily_insert_own" on public.nofap_daily;
create policy "nofap_daily_insert_own"
on public.nofap_daily for insert
with check (auth.uid() = user_id);

drop policy if exists "nofap_daily_update_own" on public.nofap_daily;
create policy "nofap_daily_update_own"
on public.nofap_daily for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "nofap_daily_delete_own" on public.nofap_daily;
create policy "nofap_daily_delete_own"
on public.nofap_daily for delete
using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_nofap_daily_updated_at on public.nofap_daily;
create trigger trg_nofap_daily_updated_at
before update on public.nofap_daily
for each row execute function public.set_updated_at();
