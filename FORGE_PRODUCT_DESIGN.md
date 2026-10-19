# FORGE — Product Core, Brand & Design System

> Companion to `FORGE_APP_PLAN.md` (tech + build). This file defines **what the app is, why people stay, how it spreads, and how it looks**.
> Written from three seats at once: **CEO** (strategy, focus, money), **CMO** (positioning, growth loops, brand), **CTO/Product** (core loop, systems, UX).
> Section 11 is the design-token spec to implement.

---

## 0. The one-page version

| | |
|---|---|
| **Mission** | Remove the guesswork from getting fit. |
| **Promise (tagline)** | **Know what to do today.** |
| **Category we create** | *Decision coach*, not a tracker. Other apps ask you to log; Forge tells you what to do next. |
| **Who first** | Gym-goers 18–30 in NL, especially the "I go to the gym but I'm not sure I'm doing it right" majority. |
| **The habit** | Open Forge every morning → get your **Daily Call** → do it → **Forge the day** at night. |
| **The proof** | The **Forge Score** (0–100): one number for how well you followed your plan today. |
| **Why it spreads** | **Crews** (train with friends) + **Forged cards** (shareable progress made for TikTok/IG Stories). |
| **North-star metric** | **Forged Days per active user per week** (a day where you followed the plan). |
| **Business** | Freemium → Pro €9.99/mo or €59.99/yr, 7-day trial on annual. |

---

## 1. CEO view — strategy

### 1.1 The insight
People don't quit fitness because they lack data. They quit because of **decision fatigue + no visible progress + no one noticing**.
- "What do I train today? How much should I lift? What do I eat now?" → too many decisions.
- Weight moves slowly and noisily → it *feels* like nothing works.
- Nobody sees the effort → no social reward.

Forge attacks all three: **one decision per day**, **a daily score that moves even when the scale doesn't**, and **friends who see you show up**.

### 1.2 Positioning — where we sit

```
                      DECIDES FOR YOU
                            ▲
                            │        ★ FORGE
                            │   (decides + social + gym-native)
                Fitbod ●    │
         (workouts only)    │
SOLO ◄──────────────────────┼──────────────────────► SOCIAL
                            │
     MyFitnessPal ●         │             ● Strava
     Cal AI ●               │      (social, but tracks
     (food tracking only)   │       cardio, decides nothing)
                            │
                            ▼
                       ONLY TRACKS
```

**Positioning statement:** For gym-goers who want results without becoming nutrition experts, Forge is the AI coach that turns your body, food and training into **one clear plan for today**. Unlike calorie trackers and workout loggers, Forge **decides** for you and adapts every week.

### 1.3 Moat (what gets stronger over time)
1. **Personal data flywheel.** Every logged set, meal edit and weigh-in makes *your* plan better. Leaving Forge means leaving a coach that knows you.
2. **Social graph.** Crews make the app more valuable with every friend added.
3. **Gym knowledge.** Exercise alternatives and equipment by gym chain is boring data that compounds.
4. **Brand ritual.** "Did you forge today?" If that becomes a phrase, we've won.

### 1.4 Focus rules (what we say NO to)
- No social feed of strangers, no likes on bodies, no weight leaderboards.
- No in-app ads. Ever. Trust is the product.
- No features that add a second decision to the home screen.
- No "before/after" pressure by default (it's opt-in).

---

## 2. Product core — the experience

### 2.1 The core loop (daily)

```
   07:30  ┌─────────────────────┐
  PUSH ──►│  1. THE DAILY CALL  │  "Push day · 55 min · 160g protein"
          │  one screen, 1 plan │
          └──────────┬──────────┘
                     ▼
          ┌─────────────────────┐
          │  2. DO              │  Gym Mode (log sets, swap machines)
          │                     │  Snap meals (2-sec scan, 1-tap fix)
          └──────────┬──────────┘
                     ▼
   21:00  ┌─────────────────────┐
  PUSH ──►│  3. FORGE THE DAY   │  Forge Score revealed → "FORGED" stamp
          │  (evening ritual)   │  Streak +1 · Crew sees you showed up
          └──────────┬──────────┘
                     ▼
          ┌─────────────────────┐
          │  4. COACH LEARNS    │  Tomorrow's plan adapts to today
          └──────────┬──────────┘
                     └──────────► back to 1
```

**Weekly layer:** Sunday **Weekly Verdict**: the coach reviews the week, makes one decision ("+100 kcal", "deload", "keep going") and explains why in 2 lines. This is the **variable reward**: you never know exactly what the verdict will be, so you open it.

**Monthly layer:** **Forged Card**, an auto-generated 9:16 recap (days forged, strength gained, best streak). It's built to post, and it's the main organic marketing engine.

### 2.2 Signature features (the things only Forge has, named so people talk about them)

| Feature | What it does | Why it matters |
|---|---|---|
| **The Daily Call** | Home = one card: today's workout, macros left, next meal idea. One primary button. | Kills decision fatigue. The whole brand in one screen. |
| **Forge Score** (0–100) | Daily score: training done as planned (40) + protein hit (30) + calories in range (20) + logged consistently (10). | Progress you can feel *daily*, even when the scale stalls. |
| **"Forge the Day"** | Evening ritual: score animates in, a hammer-strike "FORGED" stamp, haptic thud. Rest days count when you rested as planned. | A satisfying daily close, like closing rings. This creates the habit. |
| **Gym Mode** | Big buttons, one-hand, screen stays on, rest timer on the lock screen (Live Activity / ongoing notification). | Built for sweaty hands between sets. Competitors are built for sofas. |
| **Machine Taken** | One tap → 3 equivalent exercises with the equipment your gym has. | Solves a real, daily gym pain no one else owns. Great demo for marketing. |
| **Snap & Fix** | Photo → meal in 2 seconds → fix any item by tapping or saying "it was 200g". | Accurate enough because the user fixes it, not because the AI is perfect. |
| **Weekly Verdict** | Sunday coach decision + reason. | The reason to come back weekly, and proof the app "thinks". |
| **Crews** | Private groups of 2–8 friends. You see who **forged** today, streaks, PRs. **Never** weight or calories. | Social accountability without body comparison. The invite loop. |
| **Forged Cards** | Shareable 9:16 recaps (weekly + monthly), small Forge watermark + invite link. | Every share is a free ad aimed at the right audience. |
| **Coach Persona** | Pick your coach voice: **Buddy** (warm), **Sergeant** (direct, never insulting), **Scientist** (numbers + why). | Personality = attachment. People screenshot funny coach lines. |

### 2.3 Information architecture

```
Tab bar:   TODAY    TRAIN    [ ◉ SNAP ]    CREW    YOU
                               (center, molten, always 1 tap away)

TODAY  → Daily Call · Forge Score ring · Forge the Day
TRAIN  → Today's session · Gym Mode · History · PRs
SNAP   → Camera → Fix → Save (opens straight to camera)
CREW   → Today's board (who forged) · Streaks · Nudges · Invite
YOU    → Progress (weight trend, strength, Forged Cards) · Coach persona · Pro · Settings
```

### 2.4 Onboarding: "aha" in under 90 seconds

| Step | Screen | Design intent |
|---|---|---|
| 1 | **Hook:** "Stop guessing at the gym." + 6-sec loop of the Daily Call | Show the outcome before asking anything. |
| 2 | Goal: Lose fat / Build muscle / Both | One tap. Big cards. |
| 3 | Body: sex, age (18+ gate), height, weight | Sliders, metric default, no typing. |
| 4 | Training: days/week, experience, gym type (pick chain → equipment auto-set) | "Basic-Fit" etc. as quick picks. |
| 5 | Food: preferences + "What do you hate eating?" | Personal touch, better meal ideas. |
| 6 | Coach persona: hear a sample line from each | First moment of delight. |
| 7 | **"Forging your plan…"** 3-sec build animation | Perceived effort = perceived value. |
| 8 | **Plan reveal:** split, calories, protein + a realistic **estimated** projection range, clearly labeled as an estimate | The "aha". |
| 9 | Push permission *in context*: "Want your Daily Call at 07:30?" | Context = much higher opt-in. |
| 10 | Paywall (soft): annual with 7-day free trial · "Continue free" clearly visible | After value, never before. |
| 11 | Land on **Today** with the first action ready (first meal snap or first workout) | Day 0 must end with a forged day if possible. |

Sign-up (Apple/Google/email) happens at step 8, when the user wants to *save* their plan. Not at step 1.

---

## 3. Retention system: why people stay

### 3.1 The habit model (Trigger → Action → Reward → Investment)

| Stage | Forge mechanism |
|---|---|
| **Trigger** | External: 07:30 Daily Call push, 21:00 "Forge the day", Crew nudges. Internal: "What do I do today?" |
| **Action** | Open → see the one card → tap. Under 5 seconds to value. |
| **Reward** | *Self:* Forge Score + FORGED stamp. *Tribe:* Crew sees you showed up. *Hunt:* Weekly Verdict, new PRs. |
| **Investment** | Every log teaches the coach; streak grows; Crew bonds; Forged Cards collection. |

### 3.2 Lifecycle: what happens when

| Moment | What the user experiences | Goal |
|---|---|---|
| **Day 0** | Plan reveal → first snap or workout → first FORGED stamp | Activation: 1 forged day |
| **Day 1** | Morning: "Day 2. Your coach adjusted today based on yesterday." | Prove adaptation |
| **Day 3** | First "Machine Taken" or meal-idea moment, plus a prompt to invite 1 gym buddy | First Crew |
| **Day 7** | **First Weekly Verdict** + first Forged Card to share | Big reward moment |
| **Day 14** | First strength PR highlight ("+7.5 kg on bench") | Visible progress |
| **Day 30** | Monthly Forged Card, persona unlocks new lines, "30-day Forger" badge | Identity |
| **Day 60+** | Phase change: coach introduces a new training block | Novelty prevents boredom |

### 3.3 Streaks done right (learned from Duolingo, without the guilt)
- **Rest days count** when rest was planned. We reward following the plan, not grinding.
- **Streak Shield:** 1 free per week (Pro: 2) auto-saves a missed day.
- **Comeback Plan:** missed 2+ days means **no guilt message**. "Welcome back. Here's a lighter day to restart." Today's plan auto-scales down.
- Never shame. Copy rule: we celebrate showing up, we never punish missing.

### 3.4 Churn defense
- **At-risk signals:** no open 48h, Forge Score < 40 for 3 days, skipped Weekly Verdict. These trigger the Comeback Plan, a Crew nudge, and a softer coach tone.
- **Cancel flow (fair + EU-compliant, one-tap to cancel):** offer **Pause 1 month**, **switch to annual (save 50%)**, or a quick reason survey. Never hide the cancel button.
- **Win-back:** 14 days after churn, send a personal Forged Card ("You forged 41 days with us"). Data they don't want to lose.

---

## 4. Growth: how it spreads

### 4.1 Built-in loops

```
 ┌────────────── CONTENT LOOP ──────────────┐
 │ Forge days → Forged Card → post to       │
 │ TikTok/IG Story → viewer scans/link →    │
 │ installs → forges days → …               │
 └──────────────────────────────────────────┘
 ┌──────────────── CREW LOOP ───────────────┐
 │ Join → "Who do you train with?" →        │
 │ invite (both get 7 days Pro) → friend    │
 │ joins Crew → accountability → retention  │
 └──────────────────────────────────────────┘
 ┌──────────────── GYM LOOP ────────────────┐
 │ Forge Ambassadors (1 per gym) with codes │
 │ → gym-floor word of mouth → crews form   │
 │ inside the same gym → local density      │
 └──────────────────────────────────────────┘
```

### 4.2 Forged Card design rules (our free ad unit)
- 9:16, readable in 1 second: **one big number** ("23 DAYS FORGED"), 2 small stats, the user's streak flame.
- Optional photo/selfie background (user choice). Body numbers are never shown unless the user opts in.
- Small watermark: `forged with FORGE · forge.app/u/presko` (the invite link).
- Templates rotate monthly so feeds don't look identical.

### 4.3 Launch marketing (camera-shy friendly)
- **Faceless content pillars:** (1) "Machine taken? Do this instead" screen-recordings, (2) "What 160g protein looks like" food snaps, (3) Forge Score day-in-the-life, (4) funny Sergeant coach lines.
- **Micro-creators:** gym creators (5k–50k) get a custom coach line pack + affiliate code.
- **Campus + gym first:** Fontys/Venlo students → Eindhoven → Randstad. Win density in one city before spreading.

---

## 5. Monetization: fair freemium

| | **Free** | **Pro** (€9.99/mo · €59.99/yr) |
|---|---|---|
| Daily Call + Forge Score | ✓ | ✓ |
| Gym Mode + Machine Taken | ✓ | ✓ |
| Meal snaps | 3 / day | Unlimited + voice fix |
| Weekly Verdict | Summary only | **Adaptive plan changes** + full why |
| Crews | 1 crew, up to 3 people | Unlimited crews, up to 8 |
| Streak Shields | 1 / week | 2 / week |
| Health sync (Apple Health / Health Connect) | — | ✓ |
| Forged Cards | Standard template | All templates + monthly deep recap |
| Coach personas | Buddy | All 3 |

**Paywall moments (when the value is felt):** after the plan reveal, at the 4th snap of a day, when opening the Weekly Verdict detail, and when creating a 2nd crew. Never mid-workout.

---

## 6. Brand

### 6.1 Name & meaning
**FORGE**: heat + pressure + repetition = something stronger. Every day you show up, you *forge* yourself. Verbs we own: **forge the day**, **forged**, **Forger** (user), **Crew**.

### 6.2 Voice
| We are | We are not |
|---|---|
| Direct, short, confident | Preachy, clinical, long |
| Encouraging about effort | Commenting on bodies |
| Gym-floor real ("machine's taken? no stress") | Influencer hype ("unlock your best self ✨") |
| Honest ("estimate", "about") | Over-promising ("lose 10 kg in 30 days") |

**Copy examples**
- Morning push: *"Push day. 55 min. You've got this."*
- Evening push: *"3 sets and one meal left. Forge it."*
- Comeback: *"No lecture. Here's an easy day to get back in."*
- Sergeant persona: *"Bench went up. Excuses didn't. Good."*

---

## 7. Visual design system

### 7.1 Concept: **"Molten on Graphite"**
Dark, calm graphite (the anvil), with **molten heat** that appears only where effort happens. The app gets visually "hotter" as you complete the day. Grey at 0, glowing molten at a forged day. **Colour = progress.** It's distinct from the field: MyFitnessPal (blue), Strava (flat orange on white), Whoop (black/teal), Nike (volt). Our signature is the **molten gradient on graphite**.

### 7.2 Colour palette

**Brand**
| Token | Hex | Use |
|---|---|---|
| `molten-500` | `#FF5A1F` | Primary actions, Snap button, active states. **Text on it = graphite, not white.** |
| `molten-gradient` | `#FFB224 → #FF5A1F → #E8336D` (135°) | **Max one moment per screen:** Forge Score ring, FORGED stamp, Forged Cards. |
| `ember-300` | `#FFB224` | Highlights, streak flame, Pro badge. |

**Neutrals (dark, default)**
| Token | Hex | Use |
|---|---|---|
| `graphite-950` | `#0F1115` | App background |
| `graphite-900` | `#171A21` | Cards / surfaces |
| `graphite-800` | `#22262F` | Elevated: sheets, inputs |
| `graphite-700` | `#2E3340` | Borders, dividers |
| `steel-400` | `#8B93A7` | Secondary text, labels |
| `bone-50` | `#F4F1EA` | Primary text (warm white, never pure #FFF) |

**Neutrals (light mode)**
| Token | Hex | Use |
|---|---|---|
| `bone-100` | `#F7F5F0` | Background |
| `white-warm` | `#FFFDF9` | Cards |
| `stone-300` | `#DDD8CE` | Borders |
| `slate-600` | `#5B6273` | Secondary text |
| `graphite-950` | `#0F1115` | Primary text |

**Status**
| Token | Hex | Use |
|---|---|---|
| `mint-400` | `#3EE6B0` | Done / forged / on track (paired with ✓ + word) |
| `gold-400` | `#F4C542` | Warning / close to limit |
| `rose-500` | `#FF4D5E` | Error / destructive only |
| `signal-400` | `#4C8DFF` | Info, links |

**Macros (fixed everywhere, always with a label)**
| Macro | Hex | Why |
|---|---|---|
| Protein | `#FF5A1F` molten | The macro we care most about gets the brand colour |
| Carbs | `#4C8DFF` signal blue | Opposite hue to protein, easy to tell apart |
| Fat | `#F4C542` gold | Lighter value, distinguishable in greyscale |

**Rules**
1. Graphite is 80–90% of every screen. Molten is a reward, not decoration.
2. One gradient moment per screen, max.
3. Colour never carries meaning alone: always a label, number, or icon.
4. Contrast: body text ≥ 4.5:1, large numbers ≥ 3:1. `molten-500` on `graphite-950` ≈ 6:1 ✓. White on molten fails, so use graphite text on molten buttons.

### 7.3 Typography
| Role | Font | Spec |
|---|---|---|
| Display / numbers | **Archivo** (variable, width 112–125 "expanded", weight 700–800) | Uppercase for headlines, tabular numbers for scores/weights. Athletic, wide, ownable. |
| UI / body | **Inter** | 400/500/600. Calm and legible. |

**Type scale (pt):** 56 score · 34 title · 24 heading · 17 body · 15 secondary · 13 caption. Numbers always `tabular-nums`.

### 7.4 Shape, space, depth
- Spacing base 4: `4 · 8 · 12 · 16 · 24 · 32 · 48`.
- Radius: cards 20, buttons 16, chips full-pill, phone-sheet top 28.
- Depth by **surface lightness**, not shadows (dark UI). A molten glow is used only on the active/hero element: `0 0 24px rgba(255,90,31,.35)`.
- Touch targets ≥ 48pt. Gym Mode buttons ≥ 64pt.

### 7.5 Motion & haptics: "heat and impact"
| Moment | Motion | Haptic |
|---|---|---|
| Set logged | Row fills molten left→right (200ms) | Light impact |
| Exercise done | Card collapses with ✓ in mint | Medium impact |
| Forge Score reveal | Ring fills with gradient, number counts up (900ms ease-out) | Soft ticks |
| **FORGED stamp** | Stamp drops + slight screen shake (≤ 4px) + ember particles | **Heavy impact** (the signature feel) |
| New PR | Gold flare on the number | Success notification |
| Reduce Motion on | All of the above become fades | Haptics stay |

### 7.6 Iconography & imagery
- Icons: rounded 2px stroke (Phosphor or Lucide), filled variant for active tab.
- No stock gym photos in the UI. Real user photos only in Forged Cards (opt-in).
- Illustrations: minimal ember/spark shapes, never body silhouettes.

---

## 8. Key screens (spec)

### TODAY — The Daily Call
```
┌───────────────────────────────┐
│ WED 14 OCT          🔥 12     │  ← streak (ember)
│                               │
│   ╭──────────╮                │
│   │   72     │  FORGE SCORE   │  ← gradient ring (the 1 moment)
│   ╰──────────╯  "On track"    │
│                               │
│ ┌───────────────────────────┐ │
│ │ PUSH DAY · 55 MIN         │ │  ← hero card, molten border
│ │ Bench 4×8 · 62.5 kg ↑     │ │
│ │ [  START GYM MODE  ]      │ │
│ └───────────────────────────┘ │
│  PROTEIN   CARBS     FAT      │
│  98/160g   140/220g  41/70g   │  ← macro bars, labeled
│ ┌───────────────────────────┐ │
│ │ NEXT MEAL · 45g protein   │ │
│ │ Chicken rice bowl         │ │
│ └───────────────────────────┘ │
│ TODAY TRAIN  (◉)  CREW  YOU   │
└───────────────────────────────┘
```

### GYM MODE
Full-screen, one exercise at a time, huge weight/reps steppers, **"✓ SET DONE"** (64pt, molten), **"MACHINE TAKEN"** chip, rest timer ring. Screen stays awake.

### SNAP → FIX
Camera opens instantly → 2s scan shimmer → item list with grams + per-item macros → tap to edit or 🎤 "it was 200 grams" → **Save** → macro bars animate.

### FORGE THE DAY (evening)
Dimmed screen → score counts up → **FORGED** stamp drops (heavy haptic) → "Crew notified" → tomorrow's preview → "Share card" (optional).

### CREW
List of members with today's status: **Forged ✓** (mint) / *In progress* / *Rest day*, streak counts, one-tap "nudge 👊". No weights, no calories, ever.

### WEEKLY VERDICT (Sunday)
Card flip reveal → verdict headline ("KEEP GOING" / "+100 KCAL" / "DELOAD WEEK") → 2-line reason → week chart → "Got it" (Pro: see full breakdown).

---

## 9. Metrics: how we know it works

| Layer | Metric | Target to aim for (early) |
|---|---|---|
| North star | Forged Days / active user / week | ≥ 4 |
| Activation | % new users with 1 forged day within 24h | ≥ 50% |
| Retention | D1 / D7 / D30 | 45% / 25% / 15% (stretch goals for us) |
| Engagement | Daily Call opens / DAU | ≥ 1.5 |
| Social | % users in a Crew | ≥ 30% |
| Virality | Forged Cards shared / WAU · invites per user | Track from week 1 |
| Money | Trial start → paid | ≥ 30% |
| Quality | Snap edits per meal (lower = better AI) | Trending down |

These are internal goals, not industry benchmarks. Measure from day 1 and adjust.

---

## 10. Trust & safety (part of the brand, not an afterthought)
- 18+ only. Safe calorie floors and max loss rate are enforced in code (see `FORGE_APP_PLAN.md` §4).
- Crews never see weight, body fat, calories or photos unless the user shares.
- "Estimate" wording on all AI food numbers. Users can always fix them.
- Not medical advice, with a visible link in settings. No supplements or extreme diets suggested.
- GDPR: export + delete account in 2 taps. Health data is never sold or used for ads.

---

## 11. Design tokens (implement exactly)

```ts
// src/theme/tokens.ts
export const colors = {
  molten:   { 500: '#FF5A1F' },
  ember:    { 300: '#FFB224' },
  magenta:  { 500: '#E8336D' },
  gradient: { forge: ['#FFB224', '#FF5A1F', '#E8336D'] as const }, // 135deg
  graphite: { 950: '#0F1115', 900: '#171A21', 800: '#22262F', 700: '#2E3340' },
  steel:    { 400: '#8B93A7' },
  bone:     { 50: '#F4F1EA', 100: '#F7F5F0' },
  light:    { card: '#FFFDF9', border: '#DDD8CE', textSecondary: '#5B6273' },
  status:   { success: '#3EE6B0', warning: '#F4C542', error: '#FF4D5E', info: '#4C8DFF' },
  macro:    { protein: '#FF5A1F', carbs: '#4C8DFF', fat: '#F4C542' },
} as const;

export const fonts = {
  display: 'Archivo_800ExtraBold_Expanded', // load via expo-font, wdth ~125
  ui: 'Inter_500Medium',
  uiRegular: 'Inter_400Regular',
  uiSemibold: 'Inter_600SemiBold',
} as const;

export const type = { score: 56, title: 34, heading: 24, body: 17, secondary: 15, caption: 13 } as const;
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48 } as const;
export const radius = { card: 20, button: 16, sheet: 28, pill: 999 } as const;
export const touch = { min: 48, gym: 64 } as const;
export const glow = { shadowColor: '#FF5A1F', shadowOpacity: 0.35, shadowRadius: 24 } as const;
```

---

## 12. Priority order (what to build first for maximum impact)
1. **Daily Call + Forge Score + Forge the Day.** This *is* the product and the habit.
2. **Gym Mode + Machine Taken.** Daily gym value and the best marketing demo.
3. **Snap & Fix.** The nutrition half of the promise.
4. **Weekly Verdict.** The reason to return weekly and the Pro hook.
5. **Crews + Forged Cards.** Growth engine (start right after beta proves retention).

> CEO note: don't build growth loops before the core loop retains. If D7 is weak, fix Daily Call → Forge the Day first. Virality only multiplies what retention already keeps.
