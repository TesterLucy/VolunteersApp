-- Ejecutar en Supabase SQL Editor DESPUÉS de schema.sql
-- Agrega el email a "profiles" (auth.users no es accesible desde el cliente)

alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, cedula, birthdate, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'cedula',
    (new.raw_user_meta_data->>'birthdate')::date,
    'voluntario'
  );
  return new;
end;
$$;
