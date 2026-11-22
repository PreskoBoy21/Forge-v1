# RUN.md — the daily run (follow exactly, top to bottom)

Output every day (Europe/Berlin) — times from Metricool best-time data (IG + TikTok peak at 10:00 and 18:00 every day):
- **10:00 Reel** — Instagram Reel + TikTok + Facebook Reel. Either a **Tier list** or a **Form fix** (rules in step 3).
- **18:00 Carousel** — Instagram carousel post + TikTok photo carousel + Facebook post. A **save-worthy plan/list** (6 slides).
(No stories for now.)
Facebook is connected when Metricool `getBrandSettings` shows a `facebookData` entry for blog 7513231. No YouTube.
**Monday:** before step 1 the Chief writes `WEEK.md` (last week's numbers, this week's targets: visitors / sign-ups / Pro, the ONE test of the week, pillar mix) and follows it all week.
**Sunday:** after the wrap-up the Chief writes a "Weekly reviews" entry in PLAYBOOK (what worked/flopped by sign-ups, 1 content change, 1 product idea for Presko).

DATE = today's date (YYYY-MM-DD, Europe/Berlin). WORK = `days/DATE` (all commands run from the `agency-engine` folder unless they `cd`).
Dashboard = `https://claude.ai/artifact/13XiYSSutM5qUqbgkNqPN8` (write with ArtifactData). Agent keys are in AGENCY.md.

## 0. Setup (Director)
```
git clone -b agency https://github.com/PreskoBoy21/Forge-v1 agency-engine
git clone -b content-media --depth 1 https://github.com/PreskoBoy21/Forge-v1 media
pip install --break-system-packages numpy >/dev/null 2>&1 || true
```
Read AGENCY.md, PLAYBOOK.md (BRAND IDENTITY first), WEEK.md, posted.md.
Check Metricool `getScheduledPosts` (blogId 7513231, today+tomorrow). **If a slot already has a post, skip that slot.** If all 3 are filled, just do the Analyst step + wrap-up.
Dashboard: `board/today` set `{date, campaigns:[], activity:[], trends:[]}`; set each `agents/<key>` to `{status:"idle"}` (ads + community `{status:"off"}`).
Log each step as an activity line `{t: ISO time, agent, text}` and set the working agent `{status:"working", task:"…"}` → `{status:"done"}` when finished. Keep it short; one batch write per step is fine.

## 1. Performance Analyst [analyst]
- Metricool `getAnalyticsDataByMetrics` for the last 14 days: TikTok videos, IG reels (views, reach, likes, comments, shares, saves, avg watch time if available).
- Find top 2 / bottom 2 per platform and say WHY (hook, topic, length, slot).
- Write 1–3 lessons into PLAYBOOK "What works" (replace stale ones; keep the section short).
- **Audience (the goal in AUDIENCE MODE):** follower count IG + TikTok (+ FB) vs yesterday, views, 3-s view rate, comments, saves, shares per reel — judge reels by follows + comments. **Web-app traffic (info only, no promotion now):** if the Supabase tool is available, run read-only SQL on project `dxirfwtrrbjuflyiobjq`: `select props->>'ref' ref, count(distinct install_id) visitors, count(*) opens from app_events where name='app_open' and platform='web' and created_at > now()-interval '24 hours' group by 1` plus new sign-ups (`select count(*) from auth.users where created_at > now()-interval '24 hours'`) and Pro users (`select count(*) from profiles where is_pro`). Read-only, never write. Put the numbers in What works and the wrap-up message ("TikTok sent 4 visitors, IG 2, 1 sign-up"). 
- **Funnel (read-only SQL, last 24 h and last 7 days):** app visitors by ref (above) → sign-ups → plan screen views and checkout clicks (`select props->>'path' p, count(*) from app_events where name='screen' and (props->>'path' like 'checkout_%' or props->>'path' like 'upsell_%' or props->>'path' like '%paywall%') and created_at > now()-interval '7 days' group by 1`) → Pro users. Write the biggest drop-off as today's #1 weakness.
- Dashboard `board/stats`: `{posts7d, views7d, avgViews7d, best:{title,views}, lessons:[…], postsThisWeek, nextRun:"08:20"}`.

## 2. Trend Scout [trends] + Intel [intel]
- WebSearch (at least one `extended`): current fitness short-form trends, hook formats, what animated/faceless gym accounts post now, gym questions people are asking this week.
- Pick 3–6 that FIT Forge (gym training, true, animated quiz-friendly). Each with a one-line reason.
- Append 1–2 lines to PLAYBOOK TREND LOG (keep ~20, drop the oldest). Dashboard `board/today.trends`.

## 3. Content Strategist [strategist]
**AUDIENCE MODE (Presko, 2026-11-22): build an audience — NO promotion.** No app screens, no "Try Forge", no links, prices, Pro or trials. Forge = account name + small "FORGE." watermark only.
**FORMATS v2 (approved by Presko 2026-11-22 — quiz reels, motion explainers and app demos are retired):**
| slot | format | template (`engine/v2/`) | reference cfg | what it is |
|---|---|---|---|---|
| 10:00 | **Tier list** | `tier.html` | `ref/tier.json` | "Ranking every <muscle/topic> exercise" S→D, 6 items (≈ 25 s), each drops in with a one-line reason; ends "Agree? Comment what you'd move 👇" |
| 10:00 | **Form fix** | `formfix.html` | `ref/formfix.json` | bad rep (red ✕ + body callouts) → fix (green ✓ + working muscles in orange), ≈ 20 s, "Save this for ___ day" |
| 18:00 | **Carousel** | `car.html` | `ref/carousel.json` | 6 slides 1080×1350: hook slide, 4 item slides (sets × reps, rest, one cue), save slide |
- **10:00 rotation:** Tier list Mon/Wed/Fri/Sun, Form fix Tue/Thu/Sat — BUT a Form fix is only possible for an exercise that exists in the figure library (`engine/v2/ex2.js`; today only `squat`, and its sample was already posted 2026-11-23). If no new library exercise exists, make a Tier list instead. Never invent poses.
- **Tier list topics** (one per day, never repeat; log in PLAYBOOK "Used v2 topics"): back, shoulder, biceps, triceps, leg, glute, ab, calf exercises; also "gym supplements", "beginner mistakes", "cardio types for fat loss", "home workout exercises", "gym machines". Rankings must be defensible by evidence/consensus (stretch, loadability, stability, range of motion) — no medical claims. Exactly 6 items, use all 5 tiers S A B C D at least once across the list where honest.
- **Carousel topics** (never repeat): "Steal my <back/leg/shoulder/arm/push/pull> day", "<N> exercises for wider shoulders / bigger arms…", "Beginner week 1 plan", "Warm-up before heavy lifts", "Full-body in 45 min". Sets/reps/rest must be sensible hypertrophy defaults (6–15 reps, 2–4 sets, 1.5–3 min for compounds).
- Dashboard: two campaigns `{title, format:"Tier list"|"Form fix"|"Carousel", slot:"10:00"/"18:00", stage:"strategist", step:1, status:"in_progress"}`.

## 4. Scriptwriter [writer]
- **Tier list voice script** (one ElevenLabs call): `Ranking every <topic>. ... <Item 1>. <X> tier. <reason, ≤ 9 words>. ... <Item 2>. … ... Agree? Comment what you'd move.` (6 items → ≈ 25 s after tightening).
- **Form fix voice script** (9 short lines separated by " ... "): hook · "Watch the bad rep." · fault 1 · fault 2 · "Here's the fix." · fix 1 · fix 2 · what the right muscles do · "Save this for ___ day."
- Carousel: no voice. Write slide text: hook title (≤ 4 words + orange word), sub line, 4 items (name, sets, rest, cue ≤ 20 words with 1–2 `<b>` words), save slide.
- Hook rules from PLAYBOOK still apply (specific, personal, never the full answer).

## 5. Creative Director QA [director-qa] — script gate
Facts true and conservative; topic not used before; exactly 6 tier items; carousel numbers sensible; no promotion anywhere.

## 6. Video Editor [editor]
Voice: ElevenLabs `creative_generate_speech` voice_id `RwGCfIzuc2tIJySQj0fD`, model `eleven_v4`, `generations_count: 1`, ONE call per reel (never retry). Poll `creative_get_flow_run_status`, `curl -sL -o WORK/vo_raw.mp3 "<url>"`.
**Tier list:**
1. Tighten: `ffmpeg -y -i WORK/vo_raw.mp3 -af "silenceremove=stop_periods=-1:stop_duration=0.32:stop_threshold=-38dB:stop_silence=0.3,atempo=1.12" WORK/vo.mp3`
2. List pauses: `ffmpeg -i WORK/vo.mp3 -af silencedetect=noise=-35dB:d=0.12 -f null - 2>&1 | grep silence_` → item starts = the end of the pause before each exercise name (pattern per item: name · pause · "X tier" · pause · reason). Write `at` (6 start times), `ctaAt` (start of "Agree?") and `end` (= audio length + 0.6) into `WORK/tier.json` (copy shape from `engine/v2/ref/tier.json`).
3. Stills: `cd WORK && python3 ../../engine/v2/render.py ../../engine/v2/tier.html tier.json test 1,<at[2]+1>,<ctaAt+1>` → look at them.
4. Frames: `python3 ../../engine/v2/render.py ../../engine/v2/tier.html tier.json video <end>`; mix: `python3 ../../engine/music.py vo.mp3 mix.mp3 116`; encode: `ffmpeg -y -framerate 30 -i frames/%04d.jpg -i mix.mp3 -c:v libx264 -pix_fmt yuv420p -crf 19 -c:a aac -b:a 160k -af "apad,loudnorm=I=-14" -t <end> r1.mp4`.
**Form fix:** same voice steps (no tightening), `python3 ../../engine/v2/segs.py vo.mp3 9` → 9 segments; set `T.bad=[seg2.start, seg5.start]`, `T.good=[seg5.start, seg9.start]`, `T.end`=audio+0.8, `lineT.bad=[seg3.start, seg4.start]`, `lineT.good=[seg6.start, seg7.start]` in `WORK/formfix.json`; render + mix + encode as above with `formfix.html`.
**Carousel:** `cd WORK && python3 ../../engine/v2/render.py ../../engine/v2/car.html car.json slides` → slide-1.png … slide-6.png. Look at every slide.

## 7. (no stories for now)

## 8. Creative Director QA — visual gate
Every still/slide checked: text inside the frame, nothing overlapping, tier chips readable, form-fix callouts on the right body part. Nothing half-broken ships.

## 9. Copywriter [copy]
Caption: hook + one line of value + a comment question ("Agree? Comment what you'd move 👇" / "Do you do this? Comment 1 for yes, 2 for no 👇" / "What would you add? 👇") + "Save this 📌" where it fits + **EXACTLY 3 hashtags, one is #gym**. No links, no app. TikTok title = first ~80 chars without hashtags.

## 10. Publisher [publisher]
1. Copy files into `media/DATE/` (`r1.mp4`, `car-1.png` … `car-6.png`); `git add -A && git commit -m "media DATE" && git push` (content-media branch).
2. Verify each `https://raw.githubusercontent.com/PreskoBoy21/Forge-v1/content-media/DATE/<file>` returns HTTP 200 (`curl -s -o /dev/null -w "%{http_code}"`). Retry up to 2 min.
3. Metricool `createScheduledPost` (blogId `7513231`, timezone Europe/Berlin, autoPublish true). If a slot has passed, use the next free full hour.
   - **10:00 reel:** providers instagram + tiktok + facebook, media `[mp4 url]`, `instagramData:{type:"REEL", showReelOnFeed:true, isAiGenerated:false}`, `tiktokData:{title, privacyOption:"PUBLIC_TO_EVERYONE", isAigc:false, commercialContentOwnBrand:false, autoAddMusic:false}`, `facebookData:{type:"REEL"}`.
   - **18:00 carousel:** providers instagram + tiktok + facebook, media = the 6 slide urls in order, `instagramData:{type:"POST", isAiGenerated:false}`, `tiktokData:{title, privacyOption:"PUBLIC_TO_EVERYONE", isAigc:false, commercialContentOwnBrand:false, autoAddMusic:true, photoCoverIndex:0}`, `facebookData:{type:"POST"}`. If TikTok rejects the photo post, schedule IG + FB only and say so.
4. Only count a post as scheduled if Metricool returned an id.
5. Append to posted.md (`- DATE | slot | format | topic | hook | id`); add the topic to PLAYBOOK "Used v2 topics".
6. Save cfgs into `days/DATE/`, commit + push the `agency` branch (no mp3/mp4/png in this branch).

## 11. Director wrap-up [director]
- Dashboard: campaigns `status:"scheduled", step:6, slot, hook`; `board/week.posts` (next 7 days from getScheduledPosts: `{date,time,title,status}`); all agents `done`.
- PushNotification (one line): e.g. "Forge Agency: 2/2 scheduled — Reel 10:00 & Carousel 18:00".
- SendUserMessage to Presko: yesterday's views + new followers per platform, the two hooks, times, and anything that failed or needs him. Short, friendly, no jargon.

## If something breaks
- Never post a broken or half-made video. Mark the agent `blocked` on the dashboard with the reason.
- ElevenLabs out of credits / Metricool error / git push denied → stop that part, tell Presko exactly what failed in one message.
- If this is a **DRY RUN** (the run message says so): make NO voiceovers, renders or posts. Only test access: (a) Metricool getScheduledPosts, (b) one dashboard activity line "Dry run OK", (c) `git commit --allow-empty -m "dry run DATE" && git push` on the `agency` branch, (d) check `python3 -c "import playwright, numpy"` and `ffmpeg -version`. Report each as OK / FAILED with SendUserMessage.
