# Forge content playbook (shared memory — update every run)

## Fixed IDs
- Metricool blogId `7513231`, timezone Europe/Berlin. TikTok @forge2680, Instagram @forge_gym.ai.
- ElevenLabs voice `RwGCfIzuc2tIJySQj0fD` (Ezra), model `eleven_v4`, generations_count 1.
- Media hosting: public branch `content-media` of github.com/PreskoBoy21/Forge-v1 → `https://raw.githubusercontent.com/PreskoBoy21/Forge-v1/content-media/<file>` (Metricool copies the file at scheduling time; delete files older than 3 days).
- Presko's rules: TikTok `isAigc: false`, IG `isAiGenerated: false`; captions have EXACTLY 3 hashtags, one always #gym.

## ⚠️ AUDIENCE MODE (Presko, 2026-11-22) — overrides everything below about promoting the app
- Build an audience first. NO promotional videos: no app screens, no "Try Forge", no link-in-bio CTA, no prices/Pro/trial. The app isn't published and the web app isn't ready to push.
- Content = the proven animated quiz reels (myth · mistake · versus · swap · worth), black & orange (engine/build.py + skel.html, recoloured 2026-11-22). Motion explainers + app demos are paused.
- Why: IG avg views — quiz reels ~1.9k (Nov 3–14), motion explainers ~330 (Nov 15–19), app promo ~130 (Nov 20–21). TikTok flat ~700 for all reels; Presko's own "I built this tracker" Notion video hit 12.2k.
- Captions end with a comment question ("Comment 1 or 2 👇") + exactly 3 hashtags incl. #gym. No links.

## BRAND IDENTITY (approved by Presko 2026-11-20 — every post follows this)
- **Who we are:** Forge — the AI gym coach that adapts to your real life: your sleep, your food, your schedule.
- **One line:** *Know what to do today.*
- **Mission:** give every regular gym-goer the guidance of a personal trainer — without paying €100+/month for one.
- **Audience:** 18–30, trains 3–5×/week, past beginner, wants muscle or fat loss, tracks in a notes app or not at all, can't afford a PT. Mainly guys (EU + US), women second.
- **Enemy:** guessing — notes apps, copy-paste programs, gym-bro myths.
- **Why Forge:** reads your sleep and changes today's workout, exact weight for every set, food from a photo, and tells you *why*.
- **Personality:** a straight-talking coach friend — direct, science-backed, a bit funny. Never aggressive "no excuses", never wellness-fluffy, never medical claims.
- **Voice:** short sentences, real numbers, "you", no hype words (game-changer, revolutionary, insane), honest.
- **Face:** Presko, ICT student in the Netherlands who built the coach he wanted (founder clips when he sends them).
- **Price story:** a year of Pro costs less than one PT session. Plans: Free, or Pro €4.99/mo · €29.99/yr. **No free trial** (Presko's choice) — never promise one.
- **Pillars (weekly mix):** (1) **Gym truths** ~50% — science-backed hooks/debates ("true or false?", "comment 1 or 2") → reach. (2) **Coach calls** ~35% — a real situation → what the app decides (real app screens) → clicks. (3) **Building Forge** ~15% — behind the scenes, founder, later real user wins (never invented) → trust.
- **Funnel targets (to 100 paying):** ~2,500 sign-ups ≈ 12–15k app visitors. Weekly targets live in WEEK.md.
- **CTA:** "link in bio" (TikTok `?ref=tiktok`, IG `?ref=ig`, FB `?ref=fb`). When PLAYBOOK says `DM_KEYWORD: COACH` is live, switch captions to "Comment COACH and I'll send you the link".
- DM_KEYWORD: off

## BRAND LOOK (since 2026-11-20, Presko): ONE look everywhere — app, icon, website, videos, stories
- Black #000000 + orange #FF6A1A + white text, grey #8E8E8E for details. NO lime, NO aqua/blue, NO other accent (red only for "bad").
- Anton headlines, Inter Tight text, JetBrains Mono small labels.
- Only 2 video formats, same look: (1) short voiced reels (story/POV/debate hook, real app footage, captions synced to the voice, soft end card "FORGE · link in bio"), (2) app demo / problem→Forge explainer in motion v3. No other styles.

## GOAL since 2026-11-19: traffic to the WEB APP
- Presko: "make them all about the web app so it can actually bring traffic there… i want to see if people will use it."
- Web app `https://preskoboy21.github.io/Forge-v1/app` (free in browser, no download; Pro €4.99/mo or €29.99/yr via Stripe). Bio links: TikTok `…/app/?ref=tiktok`, IG `…/app/?ref=ig`.
- Success = web visitors by ref + sign-ups (Supabase `app_events` name='app_open', platform='web', props.ref), not just views.
- 12:00 = "Problem → Forge" (gym topic + real numbers → app screen that solves it). 17:00 = "App demo" (POV/feature demo in phone mockups). Story 11:00 = app promise + "Try Forge free — link in bio".
- Every caption ends "Try Forge free 👉 link in bio (no download)" + 3 hashtags incl. #gym. TikTok `commercialContentOwnBrand:true`.
- App screens: `engine/assets/app/*.jpg` (welcome, checkin, today_ready, train, snap, body, paywall). Reference build: `days/2026-11-19/app-demo/cfg.json` (Presko's first app demo, 25 s).
- Never fake results, testimonials or features; example numbers labelled EXAMPLE.

Used demo angles: Price: PT €60–90/h (Trustlocal 2026, DE) vs Forge Pro €29.99/yr → today plan, exact weights, protein left, paywall, 'trainer or app?' (2026-11-22); Coach call: when to add weight — 3 checks (sleep 8h/protein 104%/weight 83.1) → readiness 100 → 'add weight on your first lift' → leg press 145 kg EXAMPLE, debate 'feel or plan?' (2026-11-21); POV: I let an AI coach plan my gym day (check-in → readiness 93 → exact weights → snap protein → weekly verdict) (2026-11-19 reference); Stop logging sets in your notes app (notes card vs train exact weights → tap exercise how-to → body 14-day sleep → snap photo/barcode) (2026-11-20)

## What works (data, newest first)
- 2026-11-22 FUNNEL: web 24 h = 6 visitors (fb 3 — first day of Facebook, all from the clickable ?ref=fb caption link; ig 1; untagged 2) → 2 sign-ups → 1 paywall view → 0 checkout clicks → Pro count now 1 (account created 11-21 12:27 already Pro, no checkout screen logged — ask Presko if it's his test). 7 days: ~50 visitors → 20 reached sign-in → 4 sign-ups → 3 paywall → 0 checkout. #1 weakness = sign-in → sign-up (80% drop). Week test day 1 (short debate + app): IG 127 / 113 (62–66% skip, 4–6 s watch), TT 670 / 600 → the debate ending alone does NOT rescue app reels on IG; the first 3 s are the problem. FB clickable link = best visitors per post so far.
- 2026-11-21 FUNNEL: web 24 h = 12 visitors (3 tagged ?ref=ig — first tagged traffic, 9 untagged) → 10 reached sign-in → 0 sign-ups → 3 saw the paywall → 0 checkout → 0 Pro (6 users total). #1 weakness = sign-in → sign-up (100% drop). First app reels were our lowest IG ever: sleep→check-in 148 (47% skip), notes-app demo 115 (64% skip, 3.8 s watch); TikTok 656 / 643. Debate 'comment 1 or 2' reels still hold 1.1–2.1k IG → today = week test day 1: two ~20 s debate reels (skinny fat cut-or-bulk; coach call 'add weight by feel or plan') on TT + IG + FB (Facebook now connected; FB posts carry a clickable ?ref=fb link).
- 2026-11-20 WEB APP day 1: 10 web visitors / 24 opens in 24 h, ALL with ref = null (bio links may not carry ?ref=tiktok/?ref=ig, or ref isn't captured) → asked Presko to check; 0 new sign-ups (6 users, 0 Pro). Last pre-app motion day: steroids & heart 178 IG but best motion retention (46% skip, 11.1 s), carbs 128 (58% skip); TikTok 663 / 650. Shipped first full app day: sleep loss → check-in/readiness (12:00) + notes-app-vs-Forge demo (17:00). Judge by visitors from tomorrow.
- 2026-11-19 IG motion day 5: alcohol 209 (61.7% skip) + body fat & T 158 (57%) at ~20 h — result-first frame 0 didn't lift IG. 9 motion reels avg ~380 IG vs quiz 1.1–2.1k; only sleep & T (1.38k) and protein (647) broke 500 (everyday, personal stakes). TikTok flat ~700 (body fat & T 712 / 12 likes best). Today: highest-stakes topic (steroids & heart, risk-only, 71% number at frame 0) at 12:00 + famous debate claim (carbs) at 17:00. Flagged Presko again: motion costs ~75% of IG reach vs quiz — his call.
- 2026-11-18 IG drop day 4, worst yet: 11-17 sets volume 152 IG (68% skip) + T-boosters 123 (70% skip) at ~20 h, vs quiz reels 26–40% skip. Protein climbed to 639, sleep & T stays best motion reel (1.38k). TikTok unchanged (695 / 680). Presko's own manual Notion-tracker TikTok (11-17 14:31, not ours) hit 12.2k / 788 likes. Flagged Presko again. Today: result-first frame 0 (the payoff number −24% huge on screen) + personal-stakes topics (alcohol, body fat & T).
- 2026-11-17 IG drop day 3: 11-16 motion reels 303 (reps vs weight, 59% skip) + 428 (protein, 53%) at ~20 h, even with a training topic at 12:00 and the hook fully static at frame 0. BUT sleep & T (11-15) climbed late to 1,377 IG / 45% skip — personal-stakes (testosterone/body) topics can work in motion style. TikTok unchanged (694 / 729). Flagged Presko (debate hook or one quiz-style reel back?). Today: debate-style claim + stat hook (sets volume) and a T topic (T-boosters) → measure.
- 2026-11-17 Unknown IG reel at 13:07 on 11-16 ('#gym #gymtok #creatine', 127 views, 80% skip) is not in posted.md — likely posted manually; ignore in baselines.
- 2026-11-16 ALERT — first motion v3 day on IG collapsed: creatine 178 views (56.8% skip, 6.2 s avg watch), sleep & T 395 (52.5% skip, 7.1 s) vs quiz/worth reels 1.5–2.1k (26–40% skip, 10–14 s). TikTok unchanged (724 / 755). → It's the first 3 s on IG, not the slot. Test today: whole claim readable at frame 0 (no words animating in), training topic at 12:00 (progressive overload), one huge number/symbol at frame 0. If IG stays < 500 again tomorrow, flag Presko: consider a debate/'is it…?' hook or mixing one quiz-style reel back in.
- 2026-11-15 17:00 is NOT dead: straps & belts 'cheating' reel = 2.1k IG (beat 12:00's 1.8k) + 910 TT (best TikTok reel since 11-08), lowest IG skip (25.9%), 13.7 s avg watch. The 2-day 17:00 slump was topic (shoulder swap, back myths), not slot → keep 17:00; debate/'is it cheating' claims work on both apps.
- 2026-11-15 First style-v3 motion explainers shipped: creatine water myth (12:00, 26.5 s) + sleep & testosterone (17:00, 25.4 s) → measure tomorrow vs quiz baseline (IG ~1.5–2.1k, TT ~700). Note: grain makes the mp4 ~50 MB — fine for GitHub raw/Metricool so far.
- 2026-11-14 17:00 IG reel collapsed 2 days running (shoulder swap 192, back myths 302) while 12:00 held ~1.5k (curl mistakes 1.6k, chest versus 1.5k). Back myths had a normal 38% skip → it's reach, not the hook. Put the strongest reel at 12:00; if 17:00 stays <500 on IG for a 3rd day, ask Presko about moving Reel 2's slot.
- 2026-11-14 Shipped chest mistakes (incline too steep + butt off bench) at 12:00 and the first WORTH reel (straps + belt, 'cheating?' opener) at 17:00 → measure tomorrow.
- 2026-11-13 SWAP + question opener flopped: 'Shoulders not getting any wider?' = 162 IG views / 58% skip, 526 TT (worst in 14 d). Chest versus held 1.5k IG. → pause swap; open on a bold body-part claim, not a question. Myth + mistake still hold IG ~2.1k.
- 2026-11-13 Shipped curl mistakes (arms, 12:00) + back myths (17:00) with statement hooks ('These 2 curl mistakes…', 'Back day myths you still believe') → measure whether statement openers beat question openers on TT frame 0.
- 2026-11-12 Upper body back on track on IG: chest myths + pulldown mistakes both ~1.7k in ~20 h (calves versus stuck at 915) → keep IG on chest/back/arms/shoulders. TikTok reels flat at 660–730 for 8 in a row regardless of format; only the 2 TT carousels (1.1k) and incline versus (1.3k) broke 1k → TikTok needs a different first frame or more carousels, not a new reel format.
- 2026-11-11 Legs are bottom on IG for the 3rd time (calves versus 422 views, 50% skip rate) → no leg reels on IG until a strong upper-body streak; if legs, TikTok-only test.
- 2026-11-11 TikTok is flat at ~710–730 for 6 posts in a row (myth, mistake, versus all the same) → the first frame, not the format, is the limit; test bolder frame-0 claims. Ab myths dropped to 1.2k IG (myth quizzes were 2.0k+) → chest/back/arms myths only.
- 2026-11-10 TikTok sits at 700–800 for every format; only versus reels with a named muscle + study broke 1k (incline 1.3k, press vs raise 1.2k). Shipped first ab myth quiz + calves versus today — measure tomorrow.
- 2026-11-09 Versus with a named muscle + a real study is our best non-myth format on BOTH apps (incline vs flat 2.8k IG / 1.3k TT, most comments). Keep 1 versus reel in rotation; myth quizzes hold IG at 2.0–2.3k but generic '2 gym myths' TikToks stall at 300–800.
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
more gym days = more muscle; rest day = couch; sweating = fat burn; no soreness = no growth; 30-min protein window; women get bulky; 30 g protein per meal limit; cardio kills gains; fasted cardio; fat-burning zone; fat-burning foods; creatine myths; light weights can't build muscle; need a new workout every week; squats are bad for your knees; muscle turns into fat; every set must go to failure; machines don't build real muscle; shorter rest builds more muscle; mind-muscle connection is bro science; stretching before lifting prevents injuries; slow reps build more muscle; next-day soreness is lactic acid; lifting makes you stiff; lifting stunts your growth; the squeeze at the top builds the most muscle; push-ups can't build a big chest; never let knees go past toes; can't build muscle after 40; you need protein shakes to grow; curls are all you need for big arms; hammer curls are just forearms; overhead press ruins your shoulders; deadlifts are bad for your back; beginners need a body-part split; you need 2-hour workouts; bench: bouncing the bar off the chest (mistake); bench: flaring elbows to 90° (mistake); hip thrust vs squat for glutes (tie, Plotkin 2023); hip thrust vs squat for quads/adductors (squat wins); crunches burn belly fat (myth, Vispute 2011); abs only need high reps, no weight (myth); standing vs seated calf raise (standing wins, Kinoshita 2023); full vs stretched bottom-half calf reps (stretch wins, Kassiano 2023); lat pulldown behind the neck (mistake); lat pulldown leaning/swinging way back (mistake); squeeze presses build inner chest (myth); dips are only a triceps exercise (myth, McKenzie 2022); chest once vs twice a week (twice wins, Schoenfeld 2016); 1 vs 3 sets per exercise (multiple sets win ~40%, Krieger 2010); heavy swinging lateral raises (swap → strict); only pressing for shoulders (swap → add rear delt flyes); curls: swinging the weight up (mistake); curls: never lowering all the way down (mistake, Pedrosa 2023 initial vs final ROM); pull-ups only work your back (myth, biceps work hard); you need deadlifts for a big back (myth); incline bench set too steep (mistake, >45° shifts work to front delts, Rodríguez-Ridao 2020); bench: lifting the butt off the bench (mistake); lifting straps (worth it); lifting belts (worth it, don't weaken the core).

## Idea bank (not used yet — check accuracy before use)
### mistake
Squat: cutting depth on heavy days; knees caving — Rows: using the lower back to swing — Skipping warm-up sets before heavy work — Never tracking weights/reps — Same weight for months (no progressive overload) — Calf raises: bouncing out of the bottom — Pull-ups: half reps without dead hang — Shoulder press: arching the lower back hard — Curls: elbows drifting forward — Pushdowns: leaning over the bar and pressing — Warm-up: only cardio, no ramp-up sets
### versus
- Dumbbell vs barbell bench — Incline dumbbell vs incline barbell press — Close-grip bench vs dips for triceps — Pull-ups vs lat pulldown — Squat vs leg press for quads — Romanian deadlift vs lying leg curl for hamstrings (both work; do both) — Free weights vs machines for size (both work) — High reps vs low reps for size (both build muscle when hard) — Chin-ups vs pull-ups (chin-ups more biceps, both build lats)
### swap
- Skipping legs → 2 short leg sessions — Phone scrolling between sets → timed rests — Same rep range forever → mix heavy + moderate — Half reps → full range — Ego lifting → controlled reps — Random workouts → a set plan you progress — 5 min treadmill warm-up only → ramp-up sets
### worth
- Cable vs dumbbell lateral raises (both work) — Training to failure every set — Ab training if you have high body fat — Deload weeks — Mind-muscle connection cues — Hip abduction machine for glutes — Chalk — Lifting gloves (vs straps) — Knee sleeves
### myth
- "You need to bench to build a big chest" (dips/press variations work) — "Abs are made in the kitchen only" (both matter) — "High reps for definition, low reps for size" (both build muscle when hard; Schoenfeld 2017) — "You can't train the same muscle 2 days in a row" — "Bigger forearms need forearm-only training" — "Warm-up sets are a waste" — "Calves are pure genetics" (they grow with hard, full-range training) — "Wide grip = wider back" (CHECKED 2026-11-10: EMG evidence mixed, wide grip slightly higher lat activity in Andersen 2014 → do NOT use as a myth) — "You must lift fast to build power for size" — "Training to failure every set is required" (used) — "Leg day once a week is enough for big legs" (2x/week usually better).

## TREND LOG (keep ~20, newest last)
- 2026-11-10: Audience pains used: 'my calves won't grow', 'crunches every day, still no abs'.
- 2026-11-11: tryvolume: 'wrong form then right form, marked on screen' 23x and 'act out the bad form first' 29x lead → keep mistake reels with the FINE/MISTAKE stamp.
- 2026-11-11: Audience pains used: 'pulldowns but no back growth', 'how do I grow my inner chest?'.
- 2026-11-12: tryvolume: before/after flash 16x, bad-rep-then-fix 20x, muscle-diagram overlay 7x (gap: we never show the muscle hit). Pains used: 'how often should I train chest?', 'shoulders won't get wider'.
- 2026-11-13: tryvolume: before/after flash 17x, bad-rep-then-fix 20x, muscle overlay 6x, 'age named against body goal' 17x. Pains used: 'curls every week, arms still small', 'is a big back just deadlifts?'.
- 2026-11-14: tryvolume: bad-rep-then-fix 21x, before/after flash 17x, age-vs-goal 17x, muscle overlay 6x; 'This is not a good WARM UP' 130x outlier → warm-up mistakes reel next. Pains used: 'incline bench hits my shoulders', 'are straps/belts cheating?'.
- 2026-11-15: Own data: 'is it cheating?' debate opener beat every other reel on TT + IG; creatine 'water weight' fear and 'natural T' via sleep are top young-lifter questions. Pains used: 'will creatine make me look bloated?', 'how do I raise testosterone naturally?'.

- 2026-11-16: tryvolume: bad-rep-then-fix 21x, before/after flash 17x, age-vs-goal 17x, muscle diagram 7x (still our gap). Pains used: 'stuck on the same weight for weeks', 'how much protein do I really need?'.
- 2026-11-17: tryvolume fitness page leads with before/after flash (17x, 19 accounts). Own data: testosterone topic is our only motion reel to break 1k on IG. Pains used: 'how many sets should I do?', 'do T-boosters work?'.
- 2026-11-18: tryvolume: 'show the finished result in second 1' is the top pattern across all niches (8–20x); health 'one-image chart viewers zoom in and save' 17x; wellness 'Ranking ways to…' 1306x outlier. Pains used: 'does drinking kill my gains?', 'does body fat lower testosterone?'.
- 2026-11-19: tryvolume: fitness before/after flash 17x (18 accounts), health 'one-image chart viewers zoom in and save' 17x. 'Natty or not' steroid debate + low-carb vs low-fat are evergreen arguments. Pains used: 'are steroids really that bad?', 'why did I drop 2 kg in week one of keto?'.

- 2026-11-20: tryvolume: 'numbers on screen as proof' 20x, 'progress tracker stays on screen' 14x, before/after flash 17x; app outliers (Handler) are screen-recording demos; MyFitnessPal 'let's see how fast I can log my whole day' speed-run opener → future demo angle. Pains used: 'slept 5 h, train heavy?', 'my gym log is a mess in Notes'.
- 2026-11-21: tryvolume: physique-proof-first 22x, bad-rep-then-fix 21x, age-vs-goal 21x, before/after flash 17x (18 accts); no debate or app-demo format in the fitness top list. Pains used: 'I'm skinny fat — cut or bulk first?', 'when should I add weight?'.
- 2026-11-22: tryvolume (Nov 21, 714 posts): physique-proof-first 22x, bad-rep-then-fix 21x, age-vs-goal 21x, before/after flash 17x (19 accts), 'Strava numbers on screen as proof' 25x, progress tracker on screen 14x. Pains used: 'is pre-workout at night ruining my sleep?', 'can't afford a PT'.

## STYLE v3 — MOTION EXPLAINER (current, approved by Presko 2026-11-14)
- Presko: "Now this is something, this is actually good." Old quiz/mascot style looked AI-made; real stock footage (Descript) was rejected ("slideshow of bad footage").
- Look: black #000000 + film grain, Anton headlines, Inter Tight captions, JetBrains Mono labels, ONE accent orange #FF6A1A, red #FF4B4B only for "bad". No mascot, emojis, glow, grid.
- Motion: mask/word/char reveals with expo easing, orange panel wipe, self-drawing lines/charts/rings, counters, camera punch only on hits, chapter counter "01 / 09".
- Retention: claim on screen at frame 0, payoff slams on its word, a new scene every 2–4 s, 24–28 s total, CTA "Save this…".
- Engine: engine/explainer_prep.py → engine/motion.py → sfx.py → music.py → render.py. Example: days/2026-11-14/example/cfg.json.

## Topic bank (motion explainers — famous gym topics; check facts before use)
- Warm-up vs static stretching before lifting — careful: 'stretching prevents injuries' myth is used; only the performance angle
- Steroids & fertility (risk only; NOT before 2026-11-23 — max 1 steroid/TRT/peptide reel per week)
- Peptides hype vs evidence (BPC-157: mostly animal data, unapproved) — RISKS ONLY
- Rep ranges: heavy vs light both build muscle near failure (Schoenfeld 2017 — check; not the used 'light weights' myth angle) → train exact weights
- Deload weeks: do you need them? (check evidence first)
- Warm-up sets before heavy lifts (ramp-up, tryvolume warm-up hooks trending)
- Beginner gains: why year 1 is magic
- Why your weight jumps 2 kg overnight (water, glycogen, salt)
- Plateau? The 3 reasons you stopped growing
- How muscle actually grows (tension, volume, recovery)
- Protein timing vs daily total (total matters most)
- Rest between sets: 2–3 min beats 1 min for growth (Schoenfeld 2016) — check vs used 'shorter rest' myth first
- Caffeine as pre-workout: what the evidence says (~3–6 mg/kg used in studies; no dosing advice)
- Ranking explainer: 'Ranking supplements by evidence' (creatine/caffeine/protein top; BCAAs, T-boosters, fat burners bottom) — tryvolume 'Ranking ways to…' trend
- Soreness: does DOMS mean growth? (soreness ≠ growth signal; check study)
- Cardio and gains: interference effect is small for most lifters (Wilson 2012 meta — check)
- Training frequency: 2x per muscle vs 1x when volume is equal (Schoenfeld 2019 — check)

Used motion topics: calorie deficit / crash dieting (example, 2026-11-14); creatine water myth + 3 g/day saturation + ~1 kg extra lean mass (Hultman 1996, Delpino 2022) (2026-11-15); sleep & testosterone, 1 week of 5 h = −10–15% (Leproult 2011) (2026-11-15); progressive overload — adding reps ≈ adding weight, 38 trained lifters 8 wk (Plotkin 2022, PeerJ) (2026-11-16); protein ceiling ≈1.6 g/kg/day, upper 2.2 (Morton 2018, 49 RCTs) (2026-11-16); weekly training volume, <5 vs 5–9 vs 10+ sets/muscle/week = 5.4 / 6.6 / 9.8% growth (Schoenfeld 2017, 15 studies) (2026-11-17); T-boosters, 50 products, 90% claim, ~1 in 4 ingredients with data showing a rise, >60% no data, 13 over upper limits (Clemesha 2020, WJMH) (2026-11-17); alcohol after training, ~12 drinks after lifting+cardio = −24% muscle protein synthesis even with 25 g whey, −37% without protein, 8 active men (Parr 2014, PLoS One) (2026-11-18); body fat & testosterone, aromatase converts T→estrogen, 24-study review of men with obesity: diet weight loss raised total T, more weight lost = bigger rise (Corona 2013, Eur J Endocrinol) (2026-11-18); steroids & heart RISK ONLY (Baggish 2017) (2026-11-19); carbs & fat loss, DIETFITS (Gardner 2018) (2026-11-19); sleep loss & performance, 69 publications / 959 people, −7.56% overall, late restriction (waking early) −7.39% sig. vs early −5.85% n.s., ~−0.4% per hour awake (Craven 2022, Sports Med) → check-in + readiness (2026-11-20); skinny fat: cut or bulk? → recomp for new lifters (Barakat 2020, Strength Cond J) → Snap protein left, short debate (2026-11-21) [covers bulking vs cutting vs recomp too]; caffeine timing & sleep, 400 mg 6 h before bed = >1 h less total sleep, 12 sleepers, unnoticed (Drake 2013, J Clin Sleep Med) → check-in + readiness, short debate (2026-11-22)

## STYLE (old cloud quiz engine — RETIRED 2026-11-14, kept for reference)
- engine/skel.html = quiz template in brand look: ink #0A0C10, volt #C6F24E, aqua #47D7E8, red #FF4D5E; mascot in volt tank; word-pop captions; FALSE stamp; countdown ring; 2-bar chart or verdict chip per myth.
- Hook on screen ≤ 2 short lines at ~96–110 px (3 lines max) — check frame 0.3 s for overflow.
- STYLE LOG (newest last):
  - 2026-11-08: robust audio alignment (prep.py dynamic programming over pauses); Instagram Story generator (story.py).
  - 2026-11-09: story.py takes optional "a"/"b" button labels (e.g. FINE / MISTAKE for mistake stories); sub text already gets 👀 appended — don't add it to "sub".
  - 2026-11-11: verdict chips > ~18 chars (SIT TALL, ELBOWS DOWN / TRAIN THE WHOLE CHEST) touch the right edge → keep chip text ≤ 14 chars. Don't invent chart numbers; verdict-only if no study value.
  - 2026-11-12: hook 'CHEST ONCE A WEEK.' at 96 px touched both edges → 84 px. Swap format renders fine with default KEEP / SWAP IT buttons.
  - 2026-11-10: items button labels > ~9 chars (e.g. BOTTOM HALF) overflow the right edge → keep a/b labels short (FULL / STRETCH). Hook 92 px with a long 2nd line touches the edges → 84 px.
  - 2026-11-13: end card 'COMMENT 1 OR 2' text sits over the mascot's head (all formats) → engine fix candidate (move comment line above the mascot or mascot lower).
  - 2026-11-14: FIXED — build.py end-card comment line moved from top 740 → 535 (between the question and the buttons); clear of the mascot. Item card text ~28+ chars wraps one word onto line 2 ("ARE LIFTING STRAPS WORTH / IT?") → keep `myths` short for worth reels ("Lifting straps").

## Weekly reviews (Sunday, newest first — what worked, what flopped, 1 content change + 1 product idea)
### Week ending 2026-11-22 (Chief Marketing Agent)
- **Numbers (7 d):** ~50 web visitors (IG-tagged 4, FB-tagged 3 in its first day, ~43 untagged) → 20 reached sign-in → 4 sign-ups → 3 saw the paywall → 0 checkout clicks; Pro count 1 (unverified, no checkout logged). Target was 300 visitors / 30 sign-ups / first Pro → missed by ~6x on visitors. Reels: IG ~110–220 per motion/app reel (only protein 647 and sleep & T 1,384 broke 500); TikTok flat 600–760.
- **Worked:** Facebook with a clickable ?ref=fb link (3 visitors on day 1 with ~0 reported views); the 2 sign-ups came on the first debate + FB day. Personal-stakes topics (sleep & T, protein) are the only motion reels that travel on IG.
- **Flopped:** app-first reels on IG (113–154, 62–66% skip) — debate endings didn't fix it; the skip is in the first 3 s, before the app or debate appears. Untagged traffic (~85%) means most visitors still can't be attributed.
- **1 content change (next week):** rebuild our proven IG winner — '2 gym myths: true or false?' (1.5–2.7k IG, 26–40% skip) — in the black/orange motion look, with the app turn only in the last 5 s. Keep 1 app-demo reel per day at 17:00.
- **1 product idea for Presko:** let visitors see their first plan (check-in → today's workout) BEFORE creating an account and ask for sign-up only when they save — 80% of visitors stop at the sign-in screen. Also: check why bio-link traffic arrives without ?ref (~43 untagged visitors).
