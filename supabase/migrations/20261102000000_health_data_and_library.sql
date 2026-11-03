-- Forge: health data, coach personas, auto profile, exercise library.

-- 1) Coach personas match the app (buddy / sergeant / scientist).
alter table public.profiles drop constraint if exists profiles_coach_style_check;
update public.profiles set coach_style = 'sergeant' where coach_style = 'strict';
alter table public.profiles
  add constraint profiles_coach_style_check
  check (coach_style in ('buddy', 'sergeant', 'scientist'));

-- Gym chain from onboarding (basic_fit / fit_for_free / home / other).
alter table public.profiles add column if not exists gym text;

-- 2) Smart-scale body composition.
alter table public.body_metrics add column if not exists lean_mass_kg numeric;

-- 3) Daily health data from Apple Health / Health Connect (one row per day).
create table if not exists public.health_days (
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  weight_kg numeric,
  body_fat_pct numeric,
  lean_mass_kg numeric,
  steps int,
  sleep_hours numeric,
  resting_hr numeric,
  hrv_ms numeric,
  active_kcal int,
  source text not null check (source in ('apple_health', 'health_connect', 'manual')),
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

alter table public.health_days enable row level security;

create policy "health_days_own" on public.health_days
  for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- 4) Create an empty profile row when someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5) Exercise library (used by Gym Mode and "machine taken" swaps).
alter table public.exercises add constraint exercises_name_key unique (name);

insert into public.exercises (name, muscle_group, movement_pattern, equipment, is_lower_body) values
  ('Barbell bench press',        'chest',     'push_h',    '{barbell}',      false),
  ('Dumbbell bench press',       'chest',     'push_h',    '{dumbbell}',     false),
  ('Chest press machine',        'chest',     'push_h',    '{machine}',      false),
  ('Push-up',                    'chest',     'push_h',    '{bodyweight}',   false),
  ('Incline dumbbell press',     'chest',     'push_h',    '{dumbbell}',     false),
  ('Incline chest press machine','chest',     'push_h',    '{machine}',      false),
  ('Cable fly',                  'chest',     'isolation', '{cable}',        false),
  ('Pec deck',                   'chest',     'isolation', '{machine}',      false),
  ('Overhead press',             'shoulders', 'push_v',    '{barbell}',      false),
  ('Seated dumbbell press',      'shoulders', 'push_v',    '{dumbbell}',     false),
  ('Shoulder press machine',     'shoulders', 'push_v',    '{machine}',      false),
  ('Lateral raise',              'shoulders', 'isolation', '{dumbbell}',     false),
  ('Cable lateral raise',        'shoulders', 'isolation', '{cable}',        false),
  ('Lat pulldown',               'back',      'pull_v',    '{cable}',        false),
  ('Pull-up',                    'back',      'pull_v',    '{bodyweight}',   false),
  ('Assisted pull-up machine',   'back',      'pull_v',    '{machine}',      false),
  ('Seated cable row',           'back',      'pull_h',    '{cable}',        false),
  ('Chest-supported row machine','back',      'pull_h',    '{machine}',      false),
  ('One-arm dumbbell row',       'back',      'pull_h',    '{dumbbell}',     false),
  ('Barbell row',                'back',      'pull_h',    '{barbell}',      false),
  ('Face pull',                  'shoulders', 'pull_h',    '{cable}',        false),
  ('Back squat',                 'legs',      'squat',     '{barbell}',      true),
  ('Leg press',                  'legs',      'squat',     '{machine}',      true),
  ('Hack squat machine',         'legs',      'squat',     '{machine}',      true),
  ('Goblet squat',               'legs',      'squat',     '{dumbbell}',     true),
  ('Romanian deadlift',          'legs',      'hinge',     '{barbell}',      true),
  ('Dumbbell Romanian deadlift', 'legs',      'hinge',     '{dumbbell}',     true),
  ('Hip thrust',                 'legs',      'hinge',     '{barbell}',      true),
  ('Hip thrust machine',         'legs',      'hinge',     '{machine}',      true),
  ('Walking lunge',              'legs',      'lunge',     '{dumbbell}',     true),
  ('Bulgarian split squat',      'legs',      'lunge',     '{dumbbell}',     true),
  ('Leg extension',              'legs',      'isolation', '{machine}',      true),
  ('Lying leg curl',             'legs',      'isolation', '{machine}',      true),
  ('Seated leg curl',            'legs',      'isolation', '{machine}',      true),
  ('Standing calf raise',        'legs',      'isolation', '{machine}',      true),
  ('Dumbbell curl',              'arms',      'isolation', '{dumbbell}',     false),
  ('Cable curl',                 'arms',      'isolation', '{cable}',        false),
  ('Preacher curl machine',      'arms',      'isolation', '{machine}',      false),
  ('Triceps pushdown',           'arms',      'isolation', '{cable}',        false),
  ('Overhead cable extension',   'arms',      'isolation', '{cable}',        false),
  ('Dips',                       'arms',      'push_v',    '{bodyweight}',   false),
  ('Cable crunch',               'core',      'isolation', '{cable}',        false),
  ('Plank',                      'core',      'isolation', '{bodyweight}',   false),
  ('Hanging knee raise',         'core',      'isolation', '{bodyweight}',   false)
on conflict (name) do nothing;

-- The trigger function must not be callable through the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
