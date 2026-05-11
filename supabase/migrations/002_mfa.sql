-- MFA / 2FA support tables
-- Phase 1 uses Supabase native auth.mfa_factors for TOTP — no schema changes needed there.
-- These tables are for Phase 2 (backup codes) and Phase 3 (SMS fallback via Twilio).
-- Created upfront to avoid extra migrations later.

create table mfa_backup_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code_hash text not null,
  code_salt text not null,
  used_at timestamptz,
  created_at timestamptz default now()
);
create index mfa_backup_codes_user_idx on mfa_backup_codes(user_id);

create table mfa_phone_factors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  phone_e164 text not null,
  verified_at timestamptz,
  created_at timestamptz default now()
);

alter table mfa_backup_codes enable row level security;
alter table mfa_phone_factors enable row level security;

create policy "own_backup_codes_select" on mfa_backup_codes
  for select using (auth.uid() = user_id);

create policy "own_phone_factor_select" on mfa_phone_factors
  for select using (auth.uid() = user_id);

-- Writes happen only via service_role from server endpoints.
