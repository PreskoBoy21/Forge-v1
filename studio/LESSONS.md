# Lessons (newest first) — every agent reads this before working

- 2026-11-09 Web build was unstyled + dead because SDK 58 requires `app/+html.tsx` to render `useServerDocumentContext()` headNodes/bodyNodes (JS + CSS). Fixed. Then NativeWind crashed on web ("dark mode is type media") → `darkMode: 'class'` in tailwind.config.js. Browser QA now shows the real design.
- 2026-11-09 Use `EXPO_OFFLINE=1 CI=1` for Expo CLI commands in the cloud; api.expo.dev is not reachable. `npx expo install` fails — read pinned versions from `node_modules/expo/bundledNativeModules.json` instead.
- 2026-11-09 GitHub GraphQL is blocked in agent sessions: use `gh api repos/PreskoBoy21/Forge-v1/...` (REST) for issues, labels, PRs, comments. `gh pr create` / `gh issue list` won't work.
- 2026-11-09 Checks: `npm run typecheck`, `npm run lint`, `npm test` (node test runner, `src/**/__tests__/*.test.ts`, 39 tests). Smoke: `node e2e/smoke.cjs http://127.0.0.1:8099 e2e-shots` with `npx expo start --web --port 8099` running.
- 2026-11 History: RevenueCat removed (pod failure); NSHealthUpdateUsageDescription required; App Store screenshots must be 1206×2622.
