# RUN.md — the daily run (follow exactly, top to bottom)

Output every day (Europe/Berlin):
- **11:00 Instagram Story** — a question teasing Reel 1 (TikTok Stories can't be scheduled via Metricool).
- **12:00 Reel 1** — TikTok + Instagram.
- **17:00 Reel 2** — TikTok + Instagram.

DATE = today's date (YYYY-MM-DD, Europe/Berlin). WORK = `days/DATE` (all commands run from the `agency-engine` folder unless they `cd`).
Dashboard = `https://claude.ai/artifact/13XiYSSutM5qUqbgkNqPN8` (write with ArtifactData). Agent keys are in AGENCY.md.

## 0. Setup (Director)
```
git clone -b agency https://github.com/PreskoBoy21/Forge-v1 agency-engine
git clone -b content-media --depth 1 https://github.com/PreskoBoy21/Forge-v1 media
pip install --break-system-packages numpy >/dev/null 2>&1 || true
```
Read AGENCY.md, PLAYBOOK.md, posted.md.
Check Metricool `getScheduledPosts` (blogId 7513231, today+tomorrow). **If a slot already has a post, skip that slot.** If all 3 are filled, just do the Analyst step + wrap-up.
Dashboard: `board/today` set `{date, campaigns:[], activity:[], trends:[]}`; set each `agents/<key>` to `{status:"idle"}` (ads + community `{status:"off"}`).
Log each step as an activity line `{t: ISO time, agent, text}` and set the working agent `{status:"working", task:"…"}` → `{status:"done"}` when finished. Keep it short; one batch write per step is fine.

## 1. Performance Analyst [analyst]
- Metricool `getAnalyticsDataByMetrics` for the last 14 days: TikTok videos, IG reels (views, reach, likes, comments, shares, saves, avg watch time if available).
- Find top 2 / bottom 2 per platform and say WHY (hook, topic, length, slot).
- Write 1–3 lessons into PLAYBOOK "What works" (replace stale ones; keep the section short).
- Dashboard `board/stats`: `{posts7d, views7d, avgViews7d, best:{title,views}, lessons:[…], postsThisWeek, nextRun:"08:20"}`.

## 2. Trend Scout [trends] + Intel [intel]
- WebSearch (at least one `extended`): current fitness short-form trends, hook formats, what animated/faceless gym accounts post now, gym questions people are asking this week.
- Pick 3–6 that FIT Forge (gym training, true, animated quiz-friendly). Each with a one-line reason.
- Append 1–2 lines to PLAYBOOK TREND LOG (keep ~20, drop the oldest). Dashboard `board/today.trends`.

## 3. Content Strategist [strategist]
Forge is a **gym brand, not a myth channel**. Content covers all of gym training: technique, mistakes, exercise choices, programming, progress, beginner life, recovery basics, gym motivation/culture.
- Pick a **format** for each reel from the engine's formats (all are 2-item, ~25 s, animated):
  | format | what it is | example hook | line 3 / 8 | line 5 / 10 (verdict) |
  |---|---|---|---|---|
  | `myth` | 2 gym myths, true or false | "2 arm myths that keep your arms small" | "Myth one..." | "False." |
  | `mistake` | 2 technique/training mistakes + the fix | "2 bench mistakes stealing your chest gains" | "Mistake one..." | "Big mistake." |
  | `versus` | 2 rounds of A vs B, which builds more | "Incline or flat... which builds more chest?" | "Round one..." | "<winner> wins." (or "It's a tie.") |
  | `swap` | 2 habits to swap for a better one | "2 swaps that grow your back faster" | "Swap one..." | "Swap it." |
  | `worth` | 2 "is it worth it?" gym questions | "2 things lifters waste time on... or do they?" | "Question one..." | "Worth it." / "Waste." |
- **Mix rule:** max ONE `myth` reel per day; the other reel uses a different format. Never the same format 3 days running for the same slot. Rotate body parts and topics (chest, back, arms, shoulders, legs, glutes, abs, beginner, programming, technique).
- Facts must be checkable (web search, real studies or consensus). No medical claims, no diet-only topics.
- Never repeat a topic/myth from PLAYBOOK "Used topics", nor a hook opening used in the last 7 days.
- Dashboard: two campaigns `{title, format:"Reel · <format>", slot:"12:00"/"17:00", stage:"strategist", step:1, status:"in_progress"}`.

## 4. Scriptwriter [writer]
Each reel = **exactly 14 lines** (the engine depends on it):
1. Hook sentence (personal, specific, promise — never the answer)
2. Hook follow-up (tension / tease)
3. format label line 1 (table above, e.g. "Mistake one...")
4. item 1 (lower-case statement, e.g. "bouncing the bar off your chest.")
5. verdict 1 (short, table above)
6. why / fix, part 1 (short, concrete, a number if true)
7. why / fix, part 2
8. format label line 2 (e.g. "Mistake two...")
9. item 2
10. verdict 2
11. why / fix, part 1
12. why / fix, part 2
13. CTA part 1 — "Be honest..."
14. CTA part 2 — matching the format: myth "which one did you believe?", mistake "which one do you do?", versus "which one do you train?", swap "which one will you swap?", worth "did that surprise you?"
Write 3 hook candidates, pick the best by the Hook rules. Total spoken ≈ 22–26 s (≈ 55–70 words).

## 5. Creative Director QA [director-qa] — script gate
Check: facts true and conservative; topic not reused; hook rules; no answer in the hook; lines 3,5,8,10,13,14 follow the format table; the day has max one myth reel. Fix once if needed, otherwise drop that myth and pick another from the bank.

## 6. Video Editor [editor] — for each reel r1, r2
Write `WORK/r1/cfg.json` (copy the shape from `days/2026-11-08/c/cfg.json`, without `segs`):
- `format` (myth | mistake | versus | swap | worth), `lines` (14), `hook` (on-screen, ≤ 2 short lines, `<span class="o">` for the volt word, `<br>` between lines), `hookSize` 96–110, `chipTop` 560, `hookChip` (short tease, caps),
- `myths` [2] = the two on-screen items (Title-case; for versus write "Incline vs flat bench for upper chest"),
- optional `items` [2] to override button/stamp text per item: `{"a":"FLAT","b":"INCLINE","stamp":"INCLINE WINS"}` — the right button (b) is the one that lights up, so put the correct answer/winner there (required for versus and worth),, `h2` [4] (on-screen captions for lines 6,7,11,12, caps, one `<span class="o">` each),
- `charts` [2]: either `{labels:[A,B], values:[a,b], unit, verdict}` (only for a real comparison) or `{verdict}` alone.

Voiceover:
1. ElevenLabs `creative_generate_speech`: voice_id `RwGCfIzuc2tIJySQj0fD`, model `eleven_v4`, `generations_count: 1`, prompt = the 14 lines joined with a space. Call it **once** per reel (never retry — it charges again).
2. Poll `creative_get_flow_run_status` (flow_id + session_ids) until complete; take the audio URL; `curl -sL -o WORK/r1/raw0.mp3 "<url>"`.
3. `python3 engine/prep.py WORK/r1` → prints the 14 segment durations. Short fixed lines ("Myth one...", "False.", "Be honest...") should be 0.4–0.9 s. If any line is clearly wrong (0 s, > 2× expected), add `"segs"` manually to cfg.json from the printed chunk list and rerun.
4. `python3 engine/build.py WORK/r1` → `index.html`.
5. `python3 engine/sfx.py WORK/r1/raw.mp3 WORK/r1/events.json WORK/r1/vo.mp3`
6. Stills: `cd WORK/r1 && python3 ../../../engine/render.py index.html test 0.3,3,6.5,9.5,12.5,16,19,21.5,25` → look at every PNG (Read tool). Hook must not overflow at 0.3 s; no overlaps; chart labels readable.
7. Render: `python3 ../../../engine/render.py index.html vo.mp3 out.mp4` (≈ 25 s, 1080×1920). `ffprobe` duration must be 20–30 s.

## 7. Story Designer [designer]
`WORK/story.json` = `{"kicker":"<MYTH OF THE DAY | GYM MISTAKE OF THE DAY | WHICH BUILDS MORE? | GYM QUESTION OF THE DAY>","claim":"<Reel 1 item 1>","time":"12:00","sub":"Answer in today's reel 👀","size":96}` → `python3 engine/story.py WORK/story.json WORK/story.png`. Look at it; shrink `size` if the claim wraps to > 4 lines.

## 8. Creative Director QA — visual gate
Every still + story PNG checked. Nothing half-broken ships. If a reel can't be fixed, ship only what passed and mark that campaign `failed` + tell Presko.

## 9. Copywriter [copy]
Caption per reel: hook sentence + one-line tease (myth reels add "true or false? 🤔") + the CTA from line 14 + "Comment 1 or 2 👇" + **EXACTLY 3 hashtags, one is #gym** (e.g. `#gym #gymmyths #armday`). TikTok title = first ~80 chars of the caption without hashtags.

## 10. Publisher [publisher]
1. Copy files into `media/` as `DATE-r1.mp4`, `DATE-r2.mp4`, `DATE-story.png`; delete media files older than 3 days; `git add -A && git commit -m "media DATE" && git push`.
2. Verify each `https://raw.githubusercontent.com/PreskoBoy21/Forge-v1/content-media/<file>` returns HTTP 200 (`curl -sI`). Wait/retry up to 2 min.
3. Metricool `createScheduledPost` (blogId `7513231`, timezone Europe/Berlin, autoPublish true). If a slot time has already passed, use the next free full hour.
   - Story 11:00: providers `[{network:"instagram"}]`, `text:""`, media `[story png url]`, `instagramData:{type:"STORY", isAiGenerated:false}`.
   - Reels 12:00 / 17:00: providers tiktok + instagram, text = caption, media `[mp4 url]`,
     `tiktokData:{title, isAigc:false, privacyOption:"PUBLIC_TO_EVERYONE", autoAddMusic:false}`,
     `instagramData:{type:"REEL", showReelOnFeed:true, isAiGenerated:false}`.
4. Only count a post as scheduled if Metricool returned an id.
5. Append to posted.md (`- DATE | slot | slug | hook | myths | id`); add both items to PLAYBOOK "Used topics" and remove them from the Idea bank; top up the Idea bank to ≥ 15 ideas across formats.
6. Save cfgs into `days/DATE/`, commit + push the `agency` branch (no mp3/mp4/png in this branch).

## 11. Director wrap-up [director]
- Dashboard: campaigns `status:"scheduled", step:6, slot, hook`; `board/week.posts` (next 7 days from getScheduledPosts: `{date,time,title,status}`); all agents `done`.
- PushNotification (one line): e.g. "Forge Agency: 3/3 scheduled — Story 11:00, Reels 12:00 & 17:00".
- SendUserMessage to Presko: the two hooks, times, and anything that failed or needs him. Short, friendly, no jargon.

## If something breaks
- Never post a broken or half-made video. Mark the agent `blocked` on the dashboard with the reason.
- ElevenLabs out of credits / Metricool error / git push denied → stop that part, tell Presko exactly what failed in one message.
- If this is a **DRY RUN** (the run message says so): make NO voiceovers, renders or posts. Only test access: (a) Metricool getScheduledPosts, (b) one dashboard activity line "Dry run OK", (c) `git commit --allow-empty -m "dry run DATE" && git push` on the `agency` branch, (d) check `python3 -c "import playwright, numpy"` and `ffmpeg -version`. Report each as OK / FAILED with SendUserMessage.
