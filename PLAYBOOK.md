# Forge content playbook (shared memory — update every run)

## Fixed IDs
- Metricool blogId `7513231`, timezone Europe/Berlin. TikTok @forge2680, Instagram @forge_gym.ai.
- ElevenLabs voice `RwGCfIzuc2tIJySQj0fD` (Ezra), model `eleven_v4`, generations_count 1.
- Media hosting: public branch `content-media` of github.com/PreskoBoy21/Forge-v1 → `https://raw.githubusercontent.com/PreskoBoy21/Forge-v1/content-media/<file>` (Metricool copies the file at scheduling time; delete files older than 3 days).
- Presko's rules: TikTok `isAigc: false`, IG `isAiGenerated: false`; captions have EXACTLY 3 hashtags, one always #gym.

## What works (data, newest first)
- 2026-11-09 Versus with a named muscle + a real study is our best non-myth format on BOTH apps (incline vs flat 2.8k IG / 1.3k TT, most comments). Keep 1 versus reel in rotation; myth quizzes hold IG at 2.0–2.3k but generic '2 gym myths' TikToks stall at 300–800.
- 2026-11-09 Low-tension openers ('Back under the bar after 60 seconds?', 'Answer in one word') are bottom-2 on both apps. Open on a felt problem/body part. First mistake + versus pair shipped today (bench mistakes, hip thrust vs squat) — measure tomorrow.
- 2026-11-08 Named body part in a quiz hook wins again: "2 arm myths that keep your arms small" = 2.0k IG / 660 TT (2 comments) in ~11 h, best of the day. Prefer "2 [body-part] myths" over generic "2 gym myths".
- 2026-11-08 Captions that give away both answers + study details ("used as an excuse" quiz) did weakest today: 1.2k IG / 373 TT. Keep captions answer-free, tease only.
- 2026-11-08 TikTok back carousel (JPEG) climbed late to 1,080 views (2nd best TT in 14 d); IG carousels still weak → carousels are a TikTok play, Reels remain the IG play.
- 2026-11 IG is the stronger channel (quizzes 2.6k–3.7k views, 99% non-followers). TikTok 250–1,700.
- Best format on both: "2 gym myths: true or false?" — 2 myths, 3-2-1 guess gap, FALSE stamp, one-line why, CTA "which one did you believe? comment 1 or 2".
- Personal hooks win: "myths you probably did today", "your gym bro still swears by", "that keep your arms small". Say "2 gym myths" (or "2 arm myths") in the first second; never give the answer in the hook.
- Name the body part (arms/chest/back/glutes) → 3–5× engagement in niche data.
- Retention: payoff by second 3, something changes every 1–1.5 s, 22–26 s total.
- "Scale went up → it's not fat" format is BURNT OUT. Diet-only topics do badly. Gym training topics first.
- Engagement CTAs that work: side-picking ("comment 1 or 2", "flat or incline?"). "Answer in one word" / "comment day one" got 0 comments.

## Formats (engine/build.py `format`)
myth · mistake · versus · swap · worth — max one myth reel per day; rotate the rest. Myth quiz = proven baseline; track the other formats in "What works" and shift the mix toward what wins.

## Hook rules
1. Never give the answer in the hook — promise it. 2. Open with tension the viewer feels, not a tip list.
3. Specific > vague (body part, lift, number). 4. No "stop scrolling / you need to see this". 5. No "Did you know…?" + known fact.
6. Two posts in one week never share the same hook template opening words.

## Used topics (never repeat) — myths so far:
more gym days = more muscle; rest day = couch; sweating = fat burn; no soreness = no growth; 30-min protein window; women get bulky; 30 g protein per meal limit; cardio kills gains; fasted cardio; fat-burning zone; fat-burning foods; creatine myths; light weights can't build muscle; need a new workout every week; squats are bad for your knees; muscle turns into fat; every set must go to failure; machines don't build real muscle; shorter rest builds more muscle; mind-muscle connection is bro science; stretching before lifting prevents injuries; slow reps build more muscle; next-day soreness is lactic acid; lifting makes you stiff; lifting stunts your growth; the squeeze at the top builds the most muscle; push-ups can't build a big chest; never let knees go past toes; can't build muscle after 40; you need protein shakes to grow; curls are all you need for big arms; hammer curls are just forearms; overhead press ruins your shoulders; deadlifts are bad for your back; beginners need a body-part split; you need 2-hour workouts; bench: bouncing the bar off the chest (mistake); bench: flaring elbows to 90° (mistake); hip thrust vs squat for glutes (tie, Plotkin 2023); hip thrust vs squat for quads/adductors (squat wins).

## Idea bank (not used yet — check accuracy before use)
### mistake
Squat: cutting depth on heavy days; knees caving — Rows: using the lower back to swing — Curls: swinging the weight up — Lat pulldown: pulling behind the neck — Skipping warm-up sets before heavy work — Never tracking weights/reps — Same weight for months (no progressive overload) — Lat pulldown: leaning way back so it turns into a row — Bench: lifting the butt off the bench
### versus
- Dumbbell vs barbell bench — Pull-ups vs lat pulldown — Squat vs leg press for quads — Romanian deadlift vs lying leg curl for hamstrings (both work; do both) — Free weights vs machines for size (both work) — High reps vs low reps for size (both build muscle when hard)
### swap
- Crunches → cable crunches / hanging leg raises (loadable) — Half reps → full range — Ego lifting → controlled reps — Random workouts → a set plan you progress — 5 min treadmill warm-up only → ramp-up sets
### worth
- Lifting belts — Lifting straps — Training to failure every set — Ab training if you have high body fat — Deload weeks — Mind-muscle connection cues — Hip abduction machine for glutes
### myth
- "You need to bench to build a big chest" (dips/press variations work) — "Abs are made in the kitchen only" (both matter) — "High reps for definition, low reps for size" (both build muscle when hard; Schoenfeld 2017) — "You can't train the same muscle 2 days in a row" — "Lifting belts make your core weak" — "Bigger forearms need forearm-only training" — "Pull-ups are only for back" (biceps too) — "Warm-up sets are a waste" — "Calves are pure genetics" (they grow with hard, full-range training) — "Wide grip = wider back" (grip width matters less than full stretch) — "You must lift fast to build power for size" — "Training to failure every set is required" (used) — "One set per exercise is useless" (1 hard set still builds muscle; more is better) — "Leg day once a week is enough for big legs" (2x/week usually better).

## TREND LOG (keep ~20, newest last)
- 2026-11-03: Body-part-specific videos get 3–5× engagement → name the muscle in the hook.
- 2026-11-03: "[A] vs [B]" hooks invite side-picking in comments.
- 2026-11-04: Specific numbers + timeframes are the #1 fitness-hook win; open mid-action.
- 2026-11-05: "Take-first" hot-take hooks: state a debatable claim at frame 0.
- 2026-11-05: Withheld reveal: show both options first, crown the winner after sec 3.
- 2026-11-06: Mistake-correction lists are the most consistent fitness hook — rotate, they fade when overused.
- 2026-11-06: IG "did today" quiz reached 3.7k / 15.3 s avg watch / 69% 3-s rate — personal myth hooks keep winning on IG.
- 2026-11-09: 'Act out the bad rep, then fix it' is this week's top fitness format (~20x median); 'popular belief called wrong in line 1' ~15x; muscle-diagram overlays ~6x.
- 2026-11-09: Warm-up hooks ('This is not a good warm up') spiking → warm-up mistakes reel candidate.

## STYLE (cloud quiz engine)
- engine/skel.html = quiz template in brand look: ink #0A0C10, volt #C6F24E, aqua #47D7E8, red #FF4D5E; mascot in volt tank; word-pop captions; FALSE stamp; countdown ring; 2-bar chart or verdict chip per myth.
- Hook on screen ≤ 2 short lines at ~96–110 px (3 lines max) — check frame 0.3 s for overflow.
- STYLE LOG (newest last):
  - 2026-11-08: robust audio alignment (prep.py dynamic programming over pauses); Instagram Story generator (story.py).
  - 2026-11-09: story.py takes optional "a"/"b" button labels (e.g. FINE / MISTAKE for mistake stories); sub text already gets 👀 appended — don't add it to "sub".
