-- Users must not be able to grant themselves Pro or reset their scan counter.
revoke insert, update on public.profiles from authenticated, anon;
grant insert (
  id, display_name, sex, birth_year, height_cm, goal, training_days, experience,
  equipment, gym, coach_style, diet_prefs, timezone, onboarded_at
) on public.profiles to authenticated;
grant update (
  id, display_name, sex, birth_year, height_cm, goal, training_days, experience,
  equipment, gym, coach_style, diet_prefs, timezone, onboarded_at
) on public.profiles to authenticated;

-- Scan counter is written only by the scan-meal function (service role).
revoke insert, update, delete on public.usage_counters from authenticated, anon;
