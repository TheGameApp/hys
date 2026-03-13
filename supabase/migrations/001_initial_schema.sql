-- Perfiles de usuario
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  company text,
  role text default 'client' check (role in ('client', 'admin')),
  created_at timestamptz default now()
);

-- Proyectos / Peticiones
create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  status text default 'pending' check (status in ('pending', 'in_progress', 'review', 'completed', 'cancelled')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  budget_range text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mensajes del formulario de contacto
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table projects enable row level security;
alter table contact_messages enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Admins can view all profiles
create policy "Admins can view all profiles" on profiles
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Projects: clients can view their own projects
create policy "Clients can view own projects" on projects
  for select using (client_id = auth.uid());

-- Projects: clients can insert their own projects
create policy "Clients can create projects" on projects
  for insert with check (client_id = auth.uid());

-- Projects: admins can view all projects
create policy "Admins can view all projects" on projects
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Projects: admins can update all projects
create policy "Admins can update all projects" on projects
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Contact messages: admins can view all
create policy "Admins can view contact messages" on contact_messages
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Contact messages: anyone can insert (public form)
create policy "Anyone can insert contact messages" on contact_messages
  for insert with check (true);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, company)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
