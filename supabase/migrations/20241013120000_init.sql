-- Forge MVP schema + RLS
-- All user tables are scoped to auth.uid(). Exercises are a shared library.

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  display_name text,
  sex text check (sex in ('male', 'female')),
  birth_year int,
  height_cm numeric,
  goal text check (goal in ('lose_fat', 'build_muscle', 'recomp')),
  training_days int check (training_days between 2 and 6),
  experience text check (experience in ('beginner', 'intermediate')),
  equipment text check (equipment in ('full_gym', 'basic_gym', 'home_dumbbells')),
  diet_prefs jsonb not null default '{}'::jsonb,
  coach_style text not null default 'buddy' check (coach_style in ('buddy', 'strict')),
  timezone text not null default 'Europe/Amsterdam',
  is_pro boolean not null default false,
  onboarded_at timestamptz
);

create table public.nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  valid_from date not null,
  kcal int not null,
  protein_g int not null,
  carbs_g int not null,
  fat_g int not null,
  reason text not null check (reason in ('onboarding', 'weekly_checkin')),
  unique (user_id, valid_from)
);

create table public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  measured_at timestamptz not null,
  weight_kg numeric not null,
  body_fat_pct numeric,
  source text not null check (source in ('manual', 'apple_health', 'health_connect'))
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  muscle_group text not null,
  movement_pattern text not null,
  equipment text[] not null default '{}',
  is_lower_body boolean not null default false,
  instructions text
);

create table public.training_programs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  split text not null check (split in ('full_body', 'upper_lower', 'ppl')),
  days jsonb not null
);

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  day_name text not null,
  status text not null check (status in ('planned', 'in_progress', 'done', 'skipped')),
  unique (user_id, date)
);

create table public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  workout_id uuid not null references public.workouts (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id),
  set_index int not null,
  target_reps_min int not null,
  target_reps_max int not null,
  target_weight_kg numeric,
  actual_reps int,
  actual_weight_kg numeric,
  rpe numeric,
  swapped_from uuid references public.exercises (id)
);

create table public.meals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  eaten_at timestamptz not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  photo_path text,
  source text not null check (source in ('scan', 'manual'))
);

create table public.meal_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  meal_id uuid not null references public.meals (id) on delete cascade,
  name text not null,
  grams numeric not null,
  kcal_per_100g numeric not null,
  protein_per_100g numeric not null,
  carbs_per_100g numeric not null,
  fat_per_100g numeric not null,
  ai_confidence numeric,
  user_edited boolean not null default false
);

create table public.daily_plans (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  workout_id uuid references public.workouts (id),
  meal_ideas jsonb,
  coach_message text,
  unique (user_id, date)
);

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  week_start date not null,
  avg_weight_kg numeric,
  prev_avg_weight_kg numeric,
  kcal_change int,
  coach_summary text,
  unique (user_id, week_start)
);

create table public.usage_counters (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  meal_scans int not null default 0,
  unique (user_id, date)
);

create index body_metrics_user_measured_idx on public.body_metrics (user_id, measured_at desc);
create index meals_user_eaten_idx on public.meals (user_id, eaten_at desc);
create index workouts_user_date_idx on public.workouts (user_id, date desc);
create index workout_sets_workout_idx on public.workout_sets (workout_id, set_index);
create index meal_items_meal_idx on public.meal_items (meal_id);

alter table public.profiles enable row level security;
alter table public.nutrition_targets enable row level security;
alter table public.body_metrics enable row level security;
alter table public.exercises enable row level security;
alter table public.training_programs enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;
alter table public.daily_plans enable row level security;
alter table public.checkins enable row level security;
alter table public.usage_counters enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "nutrition_targets_own" on public.nutrition_targets
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "body_metrics_own" on public.body_metrics
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "exercises_select_all" on public.exercises
  for select using (true);

create policy "training_programs_own" on public.training_programs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "workouts_own" on public.workouts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "workout_sets_own" on public.workout_sets
  for all using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_sets.workout_id and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workouts w
      where w.id = workout_sets.workout_id and w.user_id = auth.uid()
    )
  );

create policy "meals_own" on public.meals
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "meal_items_own" on public.meal_items
  for all using (
    exists (
      select 1 from public.meals m
      where m.id = meal_items.meal_id and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.meals m
      where m.id = meal_items.meal_id and m.user_id = auth.uid()
    )
  );

create policy "daily_plans_own" on public.daily_plans
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "checkins_own" on public.checkins
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "usage_counters_own" on public.usage_counters
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('meal-photos', 'meal-photos', false)
on conflict (id) do nothing;

create policy "meal_photos_select_own"
  on storage.objects for select
  using (
    bucket_id = 'meal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "meal_photos_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'meal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "meal_photos_update_own"
  on storage.objects for update
  using (
    bucket_id = 'meal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'meal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "meal_photos_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'meal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
