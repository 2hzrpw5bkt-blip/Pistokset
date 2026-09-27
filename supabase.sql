-- Pistospäiväkirja: pilvitallennus.
-- Taulu on suljettu suoralta käytöltä; sovellus käyttää vain kahta funktiota,
-- jotka vaativat salaisen synkronointiavaimen (20–64 merkkiä).

create table if not exists public.diaries (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.diaries enable row level security;
revoke all on table public.diaries from anon, authenticated;

create or replace function public.diary_get(p_key text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare d jsonb;
begin
  if p_key is null or p_key !~ '^[a-z0-9]{20,64}$' then
    raise exception 'bad key';
  end if;
  select data into d from public.diaries where key = p_key;
  return coalesce(d, '{}'::jsonb);
end;
$$;

create or replace function public.diary_set(p_key text, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_key is null or p_key !~ '^[a-z0-9]{20,64}$' then
    raise exception 'bad key';
  end if;
  if p_data is null or jsonb_typeof(p_data) <> 'object' or pg_column_size(p_data) > 200000 then
    raise exception 'bad data';
  end if;
  insert into public.diaries (key, data, updated_at)
  values (p_key, p_data, now())
  on conflict (key) do update set data = excluded.data, updated_at = now();
end;
$$;

revoke all on function public.diary_get(text) from public;
revoke all on function public.diary_set(text, jsonb) from public;
grant execute on function public.diary_get(text) to anon, authenticated;
grant execute on function public.diary_set(text, jsonb) to anon, authenticated;
