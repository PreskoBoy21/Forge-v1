-- First-party app analytics, crash reports and in-app feedback.
-- Write-only for the app: clients can insert their own rows but never read them.
-- Rows are deleted with the account (FK cascade); rows sent before sign-in
-- (no user_id) are deleted by install_id in the delete-account function.
create table if not exists public.app_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete cascade default auth.uid(),
  install_id text not null,
  name text not null,
  props jsonb not null default '{}'::jsonb,
  app_version text,
  platform text,
  os_version text,
  created_at timestamptz not null default now(),
  constraint app_events_name_len check (char_length(name) between 1 and 64),
  constraint app_events_install_len check (char_length(install_id) between 8 and 64),
  constraint app_events_props_size check (pg_column_size(props) <= 4096),
  constraint app_events_name_known check (name in (
    'app_open', 'screen', 'onboarding_done', 'ai_consent', 'health_connected',
    'workout_started', 'workout_finished', 'meal_saved', 'meal_scan',
    'verdict_viewed', 'feedback', 'crash'
  ))
);

create index if not exists app_events_name_created_idx on public.app_events (name, created_at desc);
create index if not exists app_events_user_idx on public.app_events (user_id);

alter table public.app_events enable row level security;

-- Signed-in users write rows for themselves; signed-out (onboarding) rows carry no user.
drop policy if exists "app_events insert own" on public.app_events;
create policy "app_events insert own"
  on public.app_events for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- No select/update/delete policies: nobody reads events from the app.

comment on table public.app_events is
  'Forge first-party analytics: screen views, key actions, crashes (name=crash) and feedback (name=feedback). Insert-only from the app.';
