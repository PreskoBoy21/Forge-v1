# Market research — what Forge takes from each competitor (Nov 2026)

| App | What it does well | What Forge takes | Their gap = our edge |
|---|---|---|---|
| **Bevel** (AI health coach, iOS) | Free daily scores (recovery, sleep, strain), AI coach with memory, $14.99/mo or $99.99/yr | Readiness score from sleep + HRV + resting HR; free core scores, paid AI | Reports on the body but **doesn't plan your workout or food around it**; iOS only |
| **Whoop / Athlytic** | Recovery vs strain from heart data | Personal baseline (compare to *your* 28-day normal) | Needs a band or watch, no training plan |
| **MacroFactor** | Weight **trend** (smoothed), adaptive expenditure, no-shame coaching | EMA weight trend, ignore water spikes, adherence-neutral tone | No body-composition or recovery awareness |
| **Fitbod** | Adaptive workouts from logged sets | Rules-based progressive overload | Doesn't know how you slept or what the scale says |
| **Hevy / Strong** | Fast, clean workout logging, social | Simple Gym Mode logging | No AI, no health data |
| **Cal AI / photo trackers** | Snap a meal → macros | Snap & Fix with editable estimates | Food only |
| **Withings / RENPHO / Eufy apps** | Smart-scale body composition | Read their data through Apple Health / Health Connect | They show numbers, never tell you what to do |

**Forge's position:** the only app that reads your smart scale + watch data **and changes today's workout and food because of it**.
"Readiness 48 → same weights, one set less." "Lean mass dropping → protein first."

## Data sources (no Basic-Fit API needed)
- iPhone: Apple Health (HealthKit) — weight, body fat %, lean mass, steps, sleep, resting HR, HRV, active kcal.
- Android: Health Connect — same types.
- Smart scales that sync to both: Withings Body Smart / Body+, RENPHO, Eufy P2 Pro, Wyze Scale X, Etekcity (VeSync), Garmin Index.
- Body fat from scales is a bioimpedance estimate (hydration-sensitive) → Forge uses trends over 2–4 weeks, never single readings.

Sources: lifestack.ai Bevel review; macrofactor.com algorithm overview; fitbod.me AI apps 2026; gainframe.app smart scales for Apple Health.
