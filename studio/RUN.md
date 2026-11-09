# RUN.md — the nightly build run (follow top to bottom)

One run = one shippable step: move ONE story (two if both are small) to "ready to merge", or fix what Presko flagged.
Repo: `PreskoBoy21/Forge-v1`. GitHub API: REST only via `gh api repos/PreskoBoy21/Forge-v1/...` (GraphQL is blocked).
Dashboard: URL in `studio/project.json` → write with the ArtifactData tool (collections below). Dashboard writes never block the work.

## 0. Setup — Director [director]
```
git clone https://github.com/PreskoBoy21/Forge-v1 forge && cd forge
npm ci
export EXPO_OFFLINE=1 CI=1 BROWSER=none
```
Read `studio/STUDIO.md`, `studio/PRODUCT.md`, `studio/LESSONS.md` (if `studio/` is missing on `main`, check out the open `studio-foundations` branch to read them).
Dashboard: set every `agents/<key>` to `{status:"idle"}` (`ops`, `release` → `{status:"off", task:"Phase 4/5"}` until enabled); `board/today` = `{date, tasks:[], activity:[], prs:[], qa:{}}`.

## 1. Pick tonight's work — Director
Read open issues and PRs (`gh api repos/PreskoBoy21/Forge-v1/issues?state=open&per_page=100`, `.../pulls?state=open`).
Priority order:
1. An open studio PR with comments from Presko or failing CI → fix that first (skip to step 5 on that branch).
2. The highest-priority `stage:ready` issue (`prio:p1` before p2 before p3, oldest first).
3. No `stage:ready` issue → step 2 (Product Manager) grooms the top `stage:idea` issue, then build it.
Never pick issues labelled `needs:presko` (they wait for Presko). Set the issue to `stage:building`. Dashboard task card `{issue, title, stage, step, status:"in_progress"}`.

## 2. Spec — Product Manager [pm] (only if the issue has no acceptance criteria)
Comment on the issue: user story ("As a … I want … so that …"), 3–7 acceptance criteria as `- [ ]` checkboxes (testable, observable on screen), out-of-scope list. Keep it small enough for one night. If it's too big, split it into new issues (`stage:idea`) and build the first slice.

## 3. Design — Designer [designer] (UI stories only)
Comment: which screen(s), layout top-to-bottom, copy (exact words), states (loading / empty / error), which existing components from `src/components` and theme tokens to use (`src/theme`). Follow "one job per screen" — Presko asked for less UI, not more. No new colours or fonts.

## 4. Plan — Architect [architect]
Comment: files to touch, data shape, state (zustand stores), Supabase changes (migrations are written as files in the PR and labelled `needs:presko`, never applied to production), risks, test plan.

## 5. Build — Engineer [engineer]
- Branch `studio/<issue>-<short-slug>` from `main`.
- Implement the plan. Small, readable changes; follow existing patterns.
- Add or update unit tests for logic (`src/**/__tests__/*.test.ts`).
- Run `npm run typecheck && npm run lint && npm test` — all must pass.
- Start `npx expo start --web --port 8099 &`, wait for it, run `SMOKE_ROUTES=<changed routes> node e2e/smoke.cjs http://127.0.0.1:8099 e2e-shots` and look at the screenshots.
- Commit (message ends with the Co-Authored-By / Claude-Session lines this session gives you), push, open a PR via REST:
  `gh api repos/PreskoBoy21/Forge-v1/pulls -f title=... -f head=<branch> -f base=main -f body=...`
  PR body: `Closes #<n>`, what changed, the acceptance criteria checklist (unticked), test output, screenshots (commit them under `studio/evidence/<issue>/` on the branch so they show in the PR), and "Phone test needed: …" if iPhone-only behaviour changed (+ label `needs:phone-test`).
- Label the issue `stage:review`.

## 6. Independent review — Code Reviewer [reviewer] + Security Auditor [security]
Start a **separate sub-agent** (Agent tool, fresh context) for the review. Give it only: the issue text, the PR diff (`gh api .../pulls/<n>/files`), STUDIO.md rules. It checks correctness against acceptance criteria, readability, dead code, risky patterns, missing tests. It posts ONE review comment (`gh api .../pulls/<n>/reviews -f event=COMMENT -f body=...`) starting with `VERDICT: PASS` or `VERDICT: CHANGES` + a numbered list.
If the PR touches auth, Supabase, secrets, payments or permissions, the same sub-agent also does the security pass (`SECURITY: OK` / `SECURITY: ISSUE`).

## 7. QA — QA Lead [qa]
Another **separate sub-agent** with fresh context: issue + PR branch. It checks out the branch, runs typecheck, lint, tests, the smoke test on all main routes (regression) and on the changed screens, looks at every screenshot, and ticks each acceptance criterion it could verify. Posts ONE PR comment: `QA: PASS` or `QA: FAIL` + bugs as `- [ ] sev:N — steps — expected — actual`.
CI on the PR (GitHub Actions) must also be green: `gh api repos/PreskoBoy21/Forge-v1/commits/<sha>/check-runs`.

## 8. Bug loop
CHANGES or FAIL → Engineer fixes on the same branch → back to step 6 and 7 (new sub-agents each time). Max 3 rounds; then label `stage:blocked`, comment what's stuck, and tell Presko.

## 9. Ready — Director
All PASS + CI green → label issue `stage:ready-to-merge` + `needs:presko`. Librarian adds a line to `studio/LESSONS.md` (on the same branch) for anything learned the hard way.

## 10. Wrap-up — Director
- Dashboard: task status, PR link, QA result, activity lines, agents done.
- `board/stats`: open issues by stage, PRs waiting, last run time, next run.
- PushNotification (one line): e.g. `Forge Studio: PR #23 "Auto-progression" ready to merge — tests + QA passed (phone test: none)`.
- SendUserMessage to Presko: what was built, PR link, what he needs to test on his phone (if anything), what's next.
- Nothing built tonight (blocked / nothing ready) → say why in one line.

## Never
Push to `main`, merge, apply migrations to production, touch real user data, create paid resources, change STUDIO.md / RUN.md outside a PR, paste secrets, post on social media.
