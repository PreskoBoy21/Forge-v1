# Forge — product direction (owned by the Product Manager, approved by Presko)

**In Presko's words:** a gym app where the AI has the client's data and gives feedback and optimization for their daily life and their gym training.

Detailed brand, features and design system: `FORGE_PRODUCT_DESIGN.md` (core loop: Daily Call → Do → Forge the Day → Coach learns; Weekly Verdict; Forged Cards; Crews).

## What the AI should know about the client
Profile (goal, body stats, experience, training days, equipment, food preferences, coach style) · Apple Health (sleep, resting HR, HRV, steps, weight) · training log (sets, reps, weights, PRs) · food log (calories, protein) · consistency (streaks, missed days).

## What it should do with it
1. **Daily:** one clear call — train / how hard / what to eat / one life habit (sleep, steps), with a one-line why.
2. **In the gym:** exact weights, auto-progression from last sessions + today's recovery.
3. **Weekly:** a verdict that changes the plan (calories, volume, deload) and explains why.
4. **Always:** short, honest, no medical claims ("Not medical advice" on health-based calls).

## Status (Nov 2026)
v1.1 on TestFlight: onboarding, Today (readiness + coach call), Train (plan, Gym Mode, how-to, edit plan, progress), Snap (photo/barcode/search), Body (AI analysis), You (settings, reminders, Sign in with Apple). Subscriptions off for launch.
**Blocker:** AI features need `AI_API_KEY` set in Supabase by Presko (issue labelled `needs:presko`).

## Priorities (Product Manager keeps this list current)
See GitHub issues sorted by `prio:` label. Gym training + daily-life optimization first; social (Crews) and monetization later.
