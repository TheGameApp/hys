-- Harden the handle_new_user trigger function:
-- 1. Set explicit search_path (prevents search_path injection)
-- 2. Revoke EXECUTE from anon/authenticated so it cannot be invoked via /rest/v1/rpc/
--    (it should only run as a trigger on auth.users insert)

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, full_name, company)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company'
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from anon, authenticated, public;
