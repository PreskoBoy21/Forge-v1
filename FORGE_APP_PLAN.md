# Forge — AI Fitness Coach (Mobile App) · Build Plan

> Working name: **Forge**. This file is the source of truth for building the MVP.

---

## 1. Product summary

**One-liner:** An AI coach app that knows your body, your food and your training, and tells you exactly what to do **today**.

**Core idea:** Most fitness apps only *track*. Forge *decides*: it combines body data + nutrition + training into one daily plan and adjusts it every week based on real progress.

**Platform:** Mobile app for **iOS + Android** (one codebase). No web app for the MVP, except a simple landing page with a waitlist.

**First users:** Gym-goers aged 18–30 in the Netherlands (Basic-Fit-type members). Users must be **18+**.

**Business model:** Freemium subscription.
- **Free:** onboarding, daily plan, workout logging, **3 meal scans/day**, manual weigh-ins.
- **Pro (€9.99/month or €59.99/year):** unlimited meal scans, adaptive weekly plan adjustments, Apple Health / Health Connect sync, fridge mode (later), progress stories.

---

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| App | **Expo (React Native) + TypeScript** | Use **Expo Router** (file-based routing). Needs a **development build** (not Expo Go) because of health + purchases native modules. |
| Styling | NativeWind (Tailwind for RN) | Dark-first theme. |
| Server state | TanStack Query | |
| Local state | Zustand | Onboarding draft, UI state. |
| Forms / validation | react-hook-form + zod | Share zod schemas with edge functions where possible. |
| Backend | **Supabase** | Postgres, Auth, Storage (meal photos), Edge Functions (Deno). |
| AI | Vision-capable LLM API, called **only from Supabase Edge Functions** | Never put API keys in the app. Keep the provider behind one `ai.ts` wrapper so it can be swapped. |
| Payments | **RevenueCat** (`react-native-purchases`) | Entitlement: `pro`. Sync to Supabase via RevenueCat webhook. |
| Health data | iOS: `react-native-health` (HealthKit) · Android: `react-native-health-connect` | Read: body mass, body fat %, steps. Pro only. |
| Camera | `expo-camera` / `expo-image-picker` + `expo-image-manipulator` | Resize to max 1024px, JPEG ~0.7 before upload. |
| Notifications | `expo-notifications` | Morning plan reminder, weekly check-in reminder. |
| Analytics / errors | PostHog + Sentry | Add in Phase 5. |
| Builds | EAS Build + EAS Submit | |

---

## 3. MVP features (scope)

Only these five. Everything else waits.

### F1 — Onboarding
- Sign up / log in (Supabase Auth: email magic link + Sign in with Apple + Google).
- Age check: must confirm 18+ (store birth year, block if under 18).
- Inputs: sex, birth year, height (cm), weight (kg), goal (`lose_fat` / `build_muscle` / `recomp`), training days per week (2–6), experience (`beginner` / `intermediate`), equipment (`full_gym` / `basic_gym` / `home_dumbbells`), dietary preferences (none / vegetarian / vegan / halal / no pork / allergies free text).
- Output: calculated calorie + macro targets and a weekly training split, shown on a "Your plan" screen before entering the app.

### F2 — Daily plan (home screen)
- One screen, one card: **today's workout** (or rest day), **macro targets with remaining amounts**, **1–2 meal ideas** that fit the remaining macros.
- Generated once per day (on first open after midnight local time), cached in `daily_plans`.
- Pull to refresh regenerates meal ideas only.

### F3 — Meal scan
- Take/pick photo → upload to Storage → edge function `scan-meal` → returns items with estimated grams + kcal + protein/carbs/fat + confidence.
- User **must see and can edit** every item (name, grams) before saving. Macros recalc on gram edits (per-100g values are returned).
- Manual add option (search a basic food list / free text → AI estimate).
- Free tier limit: 3 scans/day (enforced server-side).

### F4 — Workout logging
- Today's workout shows exercises with target sets × reps × weight.
- Log each set (weight, reps, RPE optional). Rest timer.
- **"Machine taken" button:** swap to an alternative exercise with the same movement pattern + muscle group from the exercise library.
- **Progressive overload (rules-based, not AI):** if all sets hit the top of the rep range last session → +2.5 kg (upper body) / +5 kg (lower body) next session; if target missed twice in a row → keep or −5–10%.

### F5 — Weekly check-in
- Every 7 days: prompt for weigh-in (or pull from Health in Pro).
- Compare 7-day average weight trend vs goal rate → adjust calories (rules below) → AI writes a short coach summary ("Down 0.4 kg this week, right on track. Keeping calories the same.").

---

## 4. Nutrition & safety rules (deterministic — implement in code, not AI)

**Calories**
- BMR: Mifflin–St Jeor.
  - Men: `10*kg + 6.25*cm − 5*age + 5`
  - Women: `10*kg + 6.25*cm − 5*age − 161`
- TDEE = BMR × activity factor: 2–3 training days = 1.375, 4–5 = 1.55, 6 = 1.725.
- Goal adjustment: `lose_fat` −20%, `build_muscle` +10%, `recomp` −5% to 0%.

**Macros**
- Protein: 1.8 g/kg bodyweight (cap at 2.2 g/kg).
- Fat: 25–30% of calories, **never below 0.6 g/kg**.
- Carbs: remaining calories.

**Safety guardrails (hard limits)**
- Calories never below **1,500 kcal (men) / 1,200 kcal (women)** and never below BMR × 1.0.
- Max deficit 25% of TDEE. Max target weight loss 1% of bodyweight per week.
- Weekly adjustment step: max ±150 kcal per check-in.
- If the weekly loss is >1.5% of bodyweight → raise calories and show a gentle note.
- No extreme diets, fasting protocols, supplements dosing or medical claims. Show "Not medical advice — consult a doctor for health conditions" in onboarding and settings.
- Under-18 users are blocked.

**Weekly adjustment logic**
- Compare this week's 7-day average weight vs last week's.
- `lose_fat`: target −0.5% to −1%/week. Too slow (< −0.25%) two weeks in a row → −100 kcal. Too fast (> −1%) → +100 kcal.
- `build_muscle`: target +0.25% to +0.5%/week. Too slow → +100 kcal. Too fast → −100 kcal.
- `recomp`: keep calories, adjust only if weight drifts > 1% in 2 weeks.

---

## 5. Data model (Supabase / Postgres)

All tables have `id uuid pk default gen_random_uuid()`, `created_at timestamptz default now()`. Enable **Row Level Security** on every table: users can only read/write rows where `user_id = auth.uid()`.

```sql
profiles (
  id uuid pk references auth.users,
  display_name text,
  sex text check (sex in ('male','female')),
  birth_year int,
  height_cm numeric,
  goal text check (goal in ('lose_fat','build_muscle','recomp')),
  training_days int check (training_days between 2 and 6),
  experience text check (experience in ('beginner','intermediate')),
  equipment text check (equipment in ('full_gym','basic_gym','home_dumbbells')),
  diet_prefs jsonb default '{}',
  coach_style text default 'buddy' check (coach_style in ('buddy','strict')),
  timezone text default 'Europe/Amsterdam',
  is_pro boolean default false,          -- set by RevenueCat webhook
  onboarded_at timestamptz
)

nutrition_targets (
  user_id uuid references profiles,
  valid_from date,
  kcal int, protein_g int, carbs_g int, fat_g int,
  reason text                             -- 'onboarding' | 'weekly_checkin'
)

body_metrics (
  user_id uuid references profiles,
  measured_at timestamptz,
  weight_kg numeric,
  body_fat_pct numeric null,
  source text check (source in ('manual','apple_health','health_connect'))
)

exercises (                               -- seeded library, readable by all
  name text,
  muscle_group text,                      -- chest, back, legs, shoulders, arms, core
  movement_pattern text,                  -- push_h, push_v, pull_h, pull_v, squat, hinge, lunge, isolation
  equipment text[],                       -- barbell, dumbbell, machine, cable, bodyweight
  is_lower_body boolean,
  instructions text
)

training_programs (
  user_id uuid references profiles,
  split text,                             -- 'full_body' | 'upper_lower' | 'ppl'
  days jsonb                              -- [{day_index, name, exercises:[{exercise_id, sets, rep_min, rep_max}]}]
)

workouts (
  user_id uuid references profiles,
  date date,
  day_name text,
  status text check (status in ('planned','in_progress','done','skipped'))
)

workout_sets (
  workout_id uuid references workouts on delete cascade,
  exercise_id uuid references exercises,
  set_index int,
  target_reps_min int, target_reps_max int, target_weight_kg numeric,
  actual_reps int null, actual_weight_kg numeric null, rpe numeric null,
  swapped_from uuid null references exercises
)

meals (
  user_id uuid references profiles,
  eaten_at timestamptz,
  meal_type text check (meal_type in ('breakfast','lunch','dinner','snack')),
  photo_path text null,
  source text check (source in ('scan','manual'))
)

meal_items (
  meal_id uuid references meals on delete cascade,
  name text,
  grams numeric,
  kcal_per_100g numeric, protein_per_100g numeric, carbs_per_100g numeric, fat_per_100g numeric,
  ai_confidence numeric null,
  user_edited boolean default false
)

daily_plans (
  user_id uuid references profiles,
  date date,
  workout_id uuid null references workouts,
  meal_ideas jsonb,                       -- [{title, description, kcal, protein_g, carbs_g, fat_g}]
  coach_message text,
  unique (user_id, date)
)

checkins (
  user_id uuid references profiles,
  week_start date,
  avg_weight_kg numeric,
  prev_avg_weight_kg numeric,
  kcal_change int,
  coach_summary text
)

usage_counters (
  user_id uuid references profiles,
  date date,
  meal_scans int default 0,
  unique (user_id, date)
)
```

Storage bucket: `meal-photos` (private, path `user_id/yyyy-mm-dd/uuid.jpg`, RLS by folder).

---

## 6. Edge functions (Supabase, Deno)

All functions: verify JWT, load profile, validate input with zod, return typed JSON. AI output must be **strict JSON** validated with zod; on invalid output retry once, then return a friendly error.

| Function | Input | Does | Output |
|---|---|---|---|
| `calc-targets` | profile fields | Runs section 4 formulas + guardrails, writes `nutrition_targets`, builds `training_programs` | targets + program |
| `generate-daily-plan` | date | Creates today's `workouts` + `workout_sets` from program + overload rules; asks AI for 1–2 meal ideas fitting remaining macros + diet prefs; short coach message | `daily_plans` row |
| `scan-meal` | photo_path | Checks scan limit (free = 3/day), sends image to vision model, returns items | `{items:[{name, grams, kcal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, confidence}]}` |
| `swap-exercise` | workout_set id | Finds alternatives: same movement_pattern + muscle_group + user equipment, excluding current | list of 3 exercises |
| `weekly-checkin` | — | Computes averages, applies adjustment rules, writes new targets + `checkins`, AI writes summary | checkin row |
| `revenuecat-webhook` | RevenueCat event | Verifies auth header, sets `profiles.is_pro` | 200 |

**AI prompt rules (put in `supabase/functions/_shared/prompts.ts`):**
- System prompt: "You are Forge, a supportive fitness coach. You never give medical advice, never suggest below the provided calorie target, never recommend supplements, fasting or extreme diets. Respond only with JSON matching the schema."
- Pass the **numbers** (targets, remaining macros) to the AI — the AI never calculates targets itself.
- Coach tone from `coach_style` (`buddy` = friendly, `strict` = direct but never insulting).
- Meal scan prompt: identify each food, estimate grams from visual portion, give per-100g macros, give confidence 0–1. If not food → return `{items: [], error: "not_food"}`.

---

## 7. Screens & navigation (Expo Router)

```
app/
  _layout.tsx                 # providers: QueryClient, auth session, theme
  (auth)/
    welcome.tsx               # value prop + "Get started"
    sign-in.tsx
  (onboarding)/
    age.tsx                   # 18+ gate
    body.tsx                  # sex, birth year, height, weight
    goal.tsx
    training.tsx              # days, experience, equipment
    diet.tsx
    coach-style.tsx
    your-plan.tsx             # shows targets + split, CTA "Start"
  (tabs)/
    _layout.tsx               # tab bar: Today · Food · Train · Progress · Profile
    today.tsx                 # daily plan card (F2)
    food/
      index.tsx               # today's meals + macro rings
      scan.tsx                # camera (F3)
      review.tsx              # edit scanned items, save
      add-manual.tsx
    train/
      index.tsx               # today's workout overview
      session.tsx             # set logging + rest timer + swap (F4)
      history.tsx
    progress/
      index.tsx               # weight trend chart, strength PRs
      checkin.tsx             # weekly check-in (F5)
    profile/
      index.tsx               # settings, goal edit, coach style, health sync, disclaimer
      paywall.tsx             # RevenueCat paywall
```

**Home ("Today") layout:** date + streak → big workout card (lime accent) → 3 macro tiles (protein/carbs/fat remaining) → meal idea card → floating "Scan my meal" button.

---

## 8. Project structure

```
forge/
  app/                        # Expo Router screens (above)
  src/
    components/               # UI: Card, MacroRing, SetRow, Button, Sheet…
    features/
      auth/  onboarding/  plan/  food/  train/  progress/  paywall/
    lib/
      supabase.ts             # client
      health.ts               # HealthKit / Health Connect wrapper (platform split)
      purchases.ts            # RevenueCat wrapper
      nutrition.ts            # pure functions: bmr, tdee, macros, guardrails (+ unit tests)
      overload.ts             # progressive overload rules (+ unit tests)
    hooks/
    types/                    # generated Supabase types: `supabase gen types typescript`
    theme/
  supabase/
    migrations/
    seed.sql                  # exercise library (~80 exercises)
    functions/
      _shared/ (ai.ts, prompts.ts, schemas.ts, auth.ts)
      calc-targets/ generate-daily-plan/ scan-meal/ swap-exercise/ weekly-checkin/ revenuecat-webhook/
  docs/PLAN.md                # this file
```

`nutrition.ts` and `overload.ts` are pure TypeScript and must have unit tests (Jest) covering guardrails and edge cases.

---

## 9. Design direction

- Dark-first. Background `#121614`, surface `#1B211E`, text `#F2F3EC`, muted `#8A948E`.
- Accent lime `#C6F24E` (primary actions, workout card), accent orange `#FF8A50` (scan button, warnings).
- Fonts: **Oswald** (headings, uppercase) + **DM Sans** (body) via `expo-font`.
- Big touch targets (min 48px), one primary action per screen, works one-handed at the gym.

---

## 10. Environment variables

```
# app (.env, public)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_REVENUECAT_IOS_KEY=
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=

# supabase function secrets (never in the app)
AI_API_KEY=
AI_MODEL=
REVENUECAT_WEBHOOK_SECRET=
```

---

## 11. Build phases (do in order)

**Phase 0 — Setup (day 1–2)**
- `npx create-expo-app forge -t` (TypeScript, Expo Router), NativeWind, ESLint + Prettier.
- Supabase project, CLI linked, first migration with all tables + RLS.
- ✅ Done when: app runs on a device via dev build and can query Supabase.

**Phase 1 — Auth + onboarding (week 1)**
- Auth screens, onboarding flow, `nutrition.ts` + tests, `calc-targets` function.
- ✅ Done when: new user finishes onboarding and sees correct targets + split.

**Phase 2 — Training (week 2)**
- Seed exercise library, program generation, workout session screen, set logging, rest timer, swap, `overload.ts` + tests.
- ✅ Done when: user can complete a workout and next session's weights update correctly.

**Phase 3 — Food + meal scan (week 3)**
- Camera, upload, `scan-meal`, review/edit screen, manual add, macro rings, free scan limit.
- ✅ Done when: a photo of a real meal returns editable items and totals update.

**Phase 4 — Daily plan + check-in (week 4)**
- `generate-daily-plan`, Today screen, notifications, weight entry, `weekly-checkin`, progress chart.
- ✅ Done when: home screen shows a full plan and a check-in changes targets within guardrails.

**Phase 5 — Pro + polish (week 5–6)**
- RevenueCat paywall + webhook, Health sync (Pro), Sentry, PostHog, empty/error/loading states, App Store assets.
- ✅ Done when: TestFlight + Google internal testing builds work end-to-end with a test subscription.

**Phase 6 — Private beta (week 7–8)**
- 20–50 testers, track: D1/D7 retention, scans per user, edits per scan (accuracy signal), free → Pro conversion.

---

## 12. Later (NOT in MVP)

Fridge mode · supermarket mode with AH/Lidl/Jumbo prices · shareable monthly progress story · AI coach chat · gym-specific equipment lists · barcode scanning · smart-scale direct Bluetooth · gym partnerships · more languages (NL, DE, FR).

