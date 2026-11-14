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
**Since 2026-11-14 every reel is a MOTION EXPLAINER (style v3, approved by Presko).** The old quiz formats (myth/mistake/versus/swap/worth, engine/build.py + skel.html) are retired — do not use them.
Forge is a gym brand. Topics = the famous, searched gym topics people argue about, one topic per reel, explained with real numbers:
fat loss & calorie deficit, carbs, protein, bulking vs cutting vs recomp, natural testosterone (sleep, body fat, training), creatine, supplements that don't work, sleep & recovery, steroids/peptides (RISKS ONLY), muscle growth science, progressive overload, training frequency/volume, soreness, cardio & gains, skinny fat, beginner gains, plateaus.
- Pick 2 topics from PLAYBOOK "Topic bank" (not in "Used topics"; different areas on the same day).
- **Steroids / TRT / peptides / SARMs:** only as risk/myth-busting education. NEVER doses, brands, cycles, sources or "how to". Max 1 per week.
- Facts must be checkable (real studies or consensus, web-search each number). No medical advice, no claims that a supplement treats anything.
- Dashboard: two campaigns `{title, format:"Reel · motion", slot:"12:00"/"17:00", stage:"strategist", step:1, status:"in_progress"}`.

## 4. Scriptwriter [writer]
10–14 short lines, **60–75 words total (≈ 24–28 s)**. Structure:
1. **Hook (line 1):** a bold, specific claim the viewer feels, ≤ 8 words ("Crash dieting is making you skinny fat."). Never a question-only hook, never "did you know", never the full answer.
2. Line 2: a 2-word turn ("Here's why.").
3. 3–6 lines of mechanism, each carrying ONE number or one concrete image.
4. 1–2 lines of proof (a named study/population, what happened).
5. 2–3 punchy rule lines, 2–3 words each ("Small deficit." "High protein." "Lift heavy.").
6. CTA line: "Save this for your next …" / "Save this before your next …" (saves > comments for reach).
Use "..." inside a line only for a deliberate beat. Write 3 hooks, pick the strongest by PLAYBOOK hook rules.

## 5. Creative Director QA [director-qa] — script gate
Facts true and conservative; every number sourced; topic not reused; hook ≤ 8 words with a claim; total 60–75 words; CTA line last. Sensitive topics: risks-only rule respected. Fix once if needed, otherwise pick another topic.

## 6. Video Editor [editor] — for each reel r1, r2 (motion engine)
Reference build: `days/2026-11-14/example/cfg.json` (calorie deficit — the approved look). Copy its patterns, never its text.
1. ElevenLabs `creative_generate_speech`: voice `RwGCfIzuc2tIJySQj0fD`, model `eleven_v4`, `generations_count: 1`, prompt = the lines joined with a space. **Once** per reel. Poll `creative_get_flow_run_status` → `curl -sL -o WORK/r1/raw0.mp3 "<url>"`.
2. `WORK/r1/cfg.json` = `{"lines":[…], "tempo":1.06, "tail":1.4, "scenes":[{"l":0,"html":""}…]}` (scene `l` values first, html later), then `python3 engine/explainer_prep.py WORK/r1`. It prints each line's duration. If any line is clearly wrong (a short line > 2 s, a long line < 1 s), run `ffmpeg -i WORK/r1/fast.mp3 -af silencedetect=noise=-35dB:d=0.05 -f null -`, set `"segs"` (start/end per line in fast.mp3 time) by hand and rerun. Then read `seg.json` for the final line times.
3. Write the scenes (one scene per idea, 7–10 scenes, a new scene every 2–4 s). Building blocks (see the example for exact markup):
   - **Hook scene** (`cap:false`): mono kicker + the claim in Anton 230–260 px with `data-fx='none'` so it is on screen at frame 0; the payoff word slams in (`slam`) on its spoken word (`data-dl`), red underline `draw`.
   - **Turn**: lime `panel` wipe + black Anton `chars` text (0.5–1 s).
   - **Bars**: `.track` + `.grow[data-w]` (energy in/out, comparisons) with mono labels + numbers; a lime `draw` bracket for the gap.
   - **Counter**: big Anton `.count[data-to]` inside a `draw` ring.
   - **Days/units**: row of `.box .fill` that fill in sequence, then the result `slam`.
   - **Bad thing** (`tint:'red'`): meter shrinking (`data-from='100' data-w='38'`) + red Anton `slam`.
   - **Study chart**: axes + lines that `draw` (good = lime, other = grey) + labels that `pop` at the line ends; mono source label on top.
   - **Rules** (`cap:false`): 2–3 Anton lines with `words`, earlier lines `data-dim`.
   - **CTA** (`cap:false`): bookmark `draw` + "SAVE THIS" `chars` + mono pill "FORGE — YOUR AI GYM COACH · LINK IN BIO".
   Rules: Anton headline lines ≤ 12 characters at 180+ px (no edge touching); one lime accent word per headline, red only for "bad"; no emojis, no mascot, no glow; every SVG attribute quoted or ending in ` />`.
   cfg extras: `hits` [[line, delay]…] = camera punch + bass hit on slams/big beats (5–8 per reel), `ticks` for box fills, `dings` [line] for a counter.
4. `python3 engine/explainer_prep.py WORK/r1` (again, for events) → `python3 engine/motion.py WORK/r1`.
5. Stills: `cd WORK/r1 && python3 ../../../engine/render.py index.html test <one time per scene, ~70% into each scene + 0>` → look at EVERY still: frame 0 shows the hook claim, nothing touches the edges, no overlaps, charts visible.
6. Audio: `python3 ../../../engine/sfx.py raw.mp3 events.json vo.mp3 && ffmpeg -y -v error -i vo.mp3 -af apad=pad_dur=1.1 vo_pad.mp3 && python3 ../../../engine/music.py vo_pad.mp3 final.mp3 96`
7. Render: `python3 ../../../engine/render.py index.html final.mp3 out.mp4` → `ffprobe` duration 22–32 s.

## 7. Story Designer [designer]
`WORK/story.json` = `{"kicker":"<GYM TRUTH OF THE DAY | DO YOU KNOW WHY?>","claim":"<Reel 1 hook claim, short>","time":"12:00","sub":"Answer in today's reel 👀","size":96}` → `python3 engine/story.py WORK/story.json WORK/story.png`. Look at it; shrink `size` if the claim wraps to > 4 lines.

## 8. Creative Director QA — visual gate
Every still + story PNG checked. Nothing half-broken ships. If a reel can't be fixed, ship only what passed and mark that campaign `failed` + tell Presko.

## 9. Copywriter [copy]
Caption per reel: the hook claim + one line that teases the payoff (no full answer) + "Save this for your next cut/gym day 📌" + **EXACTLY 3 hashtags, one is #gym** (e.g. `#gym #fatloss #gymtips`). TikTok title = first ~80 chars of the caption without hashtags.

## 10. Publisher [publisher]
1. Copy files into `media/` as `DATE-r1.mp4`, `DATE-r2.mp4`, `DATE-story.png`; delete media files older than 3 days; `git add -A && git commit -m "media DATE" && git push`.
2. Verify each `https://raw.githubusercontent.com/PreskoBoy21/Forge-v1/content-media/<file>` returns HTTP 200 (`curl -sI`). Wait/retry up to 2 min.
3. Metricool `createScheduledPost` (blogId `7513231`, timezone Europe/Berlin, autoPublish true). If a slot time has already passed, use the next free full hour.
   - Story 11:00: providers `[{network:"instagram"}]`, `text:""`, media `[story png url]`, `instagramData:{type:"STORY", isAiGenerated:false}`.
   - Reels 12:00 / 17:00: providers tiktok + instagram, text = caption, media `[mp4 url]`,
     `tiktokData:{title, isAigc:false, privacyOption:"PUBLIC_TO_EVERYONE", autoAddMusic:false}`,
     `instagramData:{type:"REEL", showReelOnFeed:true, isAiGenerated:false}`.
4. Only count a post as scheduled if Metricool returned an id.
5. Append to posted.md (`- DATE | slot | slug | hook | myths | id`); add both topics to PLAYBOOK "Used topics" and remove them from the Topic bank; top up the Topic bank to ≥ 15 topics.
6. Save cfgs into `days/DATE/`, commit + push the `agency` branch (no mp3/mp4/png in this branch).

## 11. Director wrap-up [director]
- Dashboard: campaigns `status:"scheduled", step:6, slot, hook`; `board/week.posts` (next 7 days from getScheduledPosts: `{date,time,title,status}`); all agents `done`.
- PushNotification (one line): e.g. "Forge Agency: 3/3 scheduled — Story 11:00, Reels 12:00 & 17:00".
- SendUserMessage to Presko: the two hooks, times, and anything that failed or needs him. Short, friendly, no jargon.

## If something breaks
- Never post a broken or half-made video. Mark the agent `blocked` on the dashboard with the reason.
- ElevenLabs out of credits / Metricool error / git push denied → stop that part, tell Presko exactly what failed in one message.
- If this is a **DRY RUN** (the run message says so): make NO voiceovers, renders or posts. Only test access: (a) Metricool getScheduledPosts, (b) one dashboard activity line "Dry run OK", (c) `git commit --allow-empty -m "dry run DATE" && git push` on the `agency` branch, (d) check `python3 -c "import playwright, numpy"` and `ffmpeg -version`. Report each as OK / FAILED with SendUserMessage.
