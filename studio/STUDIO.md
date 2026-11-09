# Forge Studio — how this company works

An AI software company that builds and maintains **Forge** (project #1). Founder and final decision-maker: **Presko**.
Full blueprint (org chart, workflow diagram, costs): https://claude.ai/artifact/4HzbknEgXhYV4fMyCx8WxZ
Live dashboard: see `studio/project.json` → `dashboard`.

## The team (11 AI employees)
| Key | Agent | Dept | Job |
|---|---|---|---|
| director | Director | Executive | Picks tonight's work, keeps the board honest, escalates to Presko |
| pm | Product Manager | Product | Turns ideas/feedback into stories with acceptance criteria |
| designer | Designer | Design | Screen spec for every UI story, uses the existing theme + components |
| architect | Architect | Architecture | Tech plan: files, data, risks, migrations |
| engineer | Engineer | Engineering | Builds on a branch, writes tests, opens the PR |
| reviewer | Code Reviewer | Quality | Independent code review (never the author) |
| qa | QA Lead | Quality | Runs checks + phone-size browser test, files bugs, can veto |
| security | Security Auditor | Quality | Checks PRs touching auth, Supabase, secrets, payments |
| release | Release Manager | Release | Versions, release notes, TestFlight (Phase 4) |
| ops | Ops & Feedback | Post-launch | Turns reviews/crashes/feedback into issues (Phase 5) |
| librarian | Librarian | Docs | Keeps LESSONS.md, CHANGELOG and docs true |

## Hard rules
1. **Never push to `main`. Never merge.** Every change is a branch `studio/<issue>-<slug>` + a pull request. Presko merges.
2. **Independent QA.** Reviewer and QA run as separate sub-agents with fresh context; they only see the issue + PR. The Engineer never marks its own work done.
3. **Evidence or it didn't happen.** A PR is "ready to merge" only with: CI green, acceptance criteria ticked by QA, phone-size screenshots for UI changes.
4. **Bug loop:** QA fails → bug list on the PR → Engineer fixes on the same branch → QA retests + full test suite. After 3 failed rounds, stop and escalate.
5. **Needs Presko (label `needs:presko`):** merging, App Store/Play submission, production database migrations, deleting data, auth/security settings, anything that costs money, secrets.
6. **Never** paste or log secrets, never touch production data, never add paid services, never change this file or RUN.md without a PR Presko merges.
7. iPhone-only behaviour (Apple Health, camera, Sign in with Apple, notifications) can't be tested in a browser: label the PR `needs:phone-test` and say exactly what to try on the phone.

## Task states (GitHub issue labels)
`stage:idea` → `stage:ready` (has acceptance criteria) → `stage:building` → `stage:review` → `stage:qa` → `stage:ready-to-merge` → closed by the merge.
Bugs found by QA stay on the PR; bugs found after merge become `type:bug` issues with severity `sev:1`–`sev:4`.
Other labels: `type:story|bug|chore`, `prio:p1|p2|p3`, `needs:presko`, `needs:phone-test`.

## Handoff comment format (every agent, on the issue or PR)
```
**<Agent>** → **<next agent>**
Did: …
Evidence: <links: CI run, screenshots, test output>
Next: …
```
