This is **Forge**, an Expo/React Native fitness coach app. Source of truth: `docs/PLAN.md`.

## Expo

Expo ships breaking changes every SDK. Before using an Expo/EAS/RN API:

1. Read the major version of `expo` in `package.json`.
2. Fetch `https://docs.expo.dev/versions/v<major>.0.0/`
3. Or `https://docs.expo.dev/llms.txt`

Use `npx expo install <package>` instead of npm for Expo modules.

```bash
npx expo start
npx expo lint
npx tsc --noEmit
```

## App rules

- Expo Router lives in `app/`. Feature logic in `src/features/*`. Screens stay thin.
- TypeScript strict. No `any`.
- Build phase by phase. Do not start the next phase until the current "Done when" passes.
- Never put AI or secret keys in the app.
- Nutrition math only in `src/lib/nutrition.ts` (Phase 1).
- Ask before adding a dependency not listed in section 2 of the plan.
