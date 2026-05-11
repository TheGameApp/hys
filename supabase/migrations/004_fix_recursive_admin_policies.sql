-- Fix infinite recursion in RLS policies.
-- Policies that checked "is admin" by selecting from `profiles` while themselves
-- being attached to `profiles` (or to tables whose policies referenced profiles)
-- caused PostgreSQL to error with "infinite recursion detected in policy".
-- The standard fix is a SECURITY DEFINER helper that bypasses RLS when checking role.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon, service_role;

drop policy if exists "Admins can view all profiles" on profiles;
create policy "Admins can view all profiles" on profiles
  for select using (public.is_admin());

drop policy if exists "Admins can view all projects" on projects;
create policy "Admins can view all projects" on projects
  for select using (public.is_admin());

drop policy if exists "Admins can update all projects" on projects;
create policy "Admins can update all projects" on projects
  for update using (public.is_admin());

drop policy if exists "Admins can view contact messages" on contact_messages;
create policy "Admins can view contact messages" on contact_messages
  for select using (public.is_admin());
