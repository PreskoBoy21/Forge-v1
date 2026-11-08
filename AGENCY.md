# Forge Agency — organisation & operating model

One autonomous AI marketing team for **Forge** (AI gym-coach app), TikTok **@forge2680** + Instagram **@forge_gym.ai**.
Goal (in this order): **(1) build a gym audience that trusts Forge → (2) followers → (3) app installs at launch.**
Views are a means, not the goal. Forge is a **gym brand**: every post teaches something true about gym training that young lifters care about — technique, mistakes, exercise choices, programming, progress, beginner life. Myths are one format among several, not the theme.

Runs once a day from the cloud (scheduled task, 08:20 Europe/Berlin). No PC needed.
Daily output: **Story 11:00 (Instagram)**, **Reel 1 12:00**, **Reel 2 17:00** (TikTok + Instagram).

---

## Departments & AI employees

Each agent = one role in the daily run. They work in this order and hand a written note to the next.
Dashboard key in brackets (agents/<key>).

### Executive
**Agency Director** [director]
- Owns: the daily run, priorities, quality bar, stopping the line when something is wrong.
- In: yesterday's analysis, this file, PLAYBOOK.md. Out: today's plan (2 reels + 1 story), final go/no-go.
- KPI: posts shipped on time (target 3/3 per day), zero broken posts, follower growth week over week.
- Escalates to Presko: anything that costs money, account/security issues, sensitive comments, repeated failures.

### Research & Intelligence
**Performance Analyst** [analyst] — runs first.
- In: Metricool analytics last 14 days (TikTok TKPO*, IG reels IGRE*, IG stories if available).
- Out: top 2 / bottom 2 per platform with WHY; 1–3 lessons; "do more of X, stop Y" handoff.
- KPI: lessons that lead to better avg views / watch time over the next 7 days.

**Trend Scout** [trends]
- In: web search (extended at least once), TREND LOG. Out: 3–6 trends that fit Forge, each with a reason (not just "it's trending").
- KPI: share of posts inspired by a scout finding that beat the 7-day average.

**Audience & Competitor Intel** [intel]
- In: our comments (when readable), competitor/animated-fitness accounts via search. Out: 2–3 audience questions/pain points + 1 competitor gap.
- KPI: topics sourced from real audience questions.

### Strategy
**Content Strategist** [strategist]
- In: analyst + scout + intel handoffs, posted.md, myths-used list. Out: 2 reel briefs (topic, angle, myths, hook direction, why it should work) + 1 story brief.
- Rules: gym-training topics across the whole gym; rotate formats (myth, mistake, versus, swap, worth) — max one myth reel per day; body part named in the hook when possible; never repeat a topic or hook template from the last 7 days.
- KPI: avg views per post vs last week; zero repeated myths.

### Creative
**Scriptwriter** [writer] — 14-line scripts in the chosen format (exact structure in RUN.md), 3 hook candidates each, picks best. Facts conservative + checkable.
**Creative Director (QA)** [director-qa] — the approval gate. Checks every script for accuracy, hook rules, brand voice; checks stills of every video and the story for overflow/overlaps. Nothing ships without a pass. Can send back to writer/editor once.
**Video Editor** [editor] — voiceover (ElevenLabs Ezra), alignment, animated render, SFX. Output: 1080×1920 mp4 ~25 s.
**Story Designer** [designer] — 1080×1920 Instagram Story teasing Reel 1 (a question the reel answers).
**Copywriter** [copy] — captions: hook + one-line value + CTA 👇 + EXACTLY 3 hashtags, one always #gym; myth reels contain "true or false".

### Distribution
**Publisher** [publisher]
- Hosts media on the public `content-media` branch, schedules via Metricool (blogId 7513231, Europe/Berlin): Story IG 11:00, Reels TikTok+IG 12:00 and 17:00. Fills only empty slots. Logs to posted.md.
- KPI: 100% on-time, correct format, no duplicates.

### Growth (Phase 2 — needs extra access)
**Community Manager** — reply to comments within brand rules (needs comment read/write access; Metricool inbox or Meta/TikTok APIs). Until then: Analyst reports comment counts; Presko replies.
**Ads Manager** — OFF until the app is live in the stores; any spend needs Presko's approval.

---

## Daily workflow
1. Director starts run → dashboard reset.
2. Analyst → handoff. 3. Trend Scout + Intel (research). 4. Strategist → 2 reel briefs + story brief.
5. Writer → scripts (3 hooks each). 6. Creative Director checks scripts (fact + hook rules).
7. Editor → voiceovers, alignment, renders; Story Designer → story PNG. 8. Creative Director checks stills.
9. Copywriter → captions. 10. Publisher → host + schedule + log. 11. Director wrap-up → dashboard + phone summary.
Tomorrow's Analyst closes the loop by measuring today's posts.

## Approval gates & safety
- Auto-publish is allowed for organic posts that pass the Creative Director gate (Presko's standing choice).
- Never: spend money, change account settings, DM people, reply to sensitive comments, or post medical claims.
- If any step fails: do not post anything half-broken; mark the agent "blocked" on the dashboard and tell Presko which step failed.
- Never claim something was posted/scheduled unless Metricool returned an id.

## Memory (shared knowledge)
- `PLAYBOOK.md` — rules, what works, myths already used, trend log, lessons. Updated every run.
- `posted.md` — every post with hook, myths, inspiration and Metricool id.
- `days/YYYY-MM-DD/` — today's configs/scripts (audit trail).
- Dashboard database — live status for Presko.
