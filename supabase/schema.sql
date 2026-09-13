-- Esquema inicial de VolunteersApp para Supabase
-- Ejecutar completo en: Supabase Dashboard -> SQL Editor -> New query -> Run

-- 1. Perfiles de usuario (datos extra sobre auth.users, que ya maneja email/password/sesión)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  cedula text,
  birthdate date,
  role text not null default 'voluntario' check (role in ('voluntario', 'admin', 'superadmin')),
  created_at timestamptz not null default now()
);

-- 2. Voluntariados (equivalente a voluntariados.json)
create table if not exists public.voluntariados (
  id bigint generated always as identity primary key,
  summary text not null,
  description text,
  type text not null check (type in ('normal', 'experience')),
  location text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

-- 3. Seguridad a nivel de fila (RLS)
alter table public.profiles enable row level security;
alter table public.voluntariados enable row level security;

-- Perfiles: cada usuario ve y edita el suyo; admin/superadmin pueden ver y editar todos
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_select_admins" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'superadmin'))
  );

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_update_superadmin" on public.profiles
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'superadmin')
  );

-- Voluntariados: cualquier usuario autenticado puede leer; solo admin/superadmin escriben
create policy "voluntariados_select_authenticated" on public.voluntariados
  for select using (auth.role() = 'authenticated');

create policy "voluntariados_insert_admins" on public.voluntariados
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'superadmin'))
  );

create policy "voluntariados_update_admins" on public.voluntariados
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'superadmin'))
  );

-- 4. Crear automáticamente un perfil "voluntario" cuando alguien se registra vía Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, cedula, birthdate, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'cedula',
    (new.raw_user_meta_data->>'birthdate')::date,
    'voluntario'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
