# Phone test — Forge v1.1 launch build (≈ 30 min)

Do this on your iPhone with the new TestFlight build, **after** the AI key and the 2 database tables are in. Tick each box; anything that fails → tell Claude the step number + a screenshot.

## A. Fresh install (10 min)
Delete the old Forge app first, then install the new TestFlight build.
1. [ ] App opens without a crash; Welcome screen looks right (light mode).
2. [ ] Get my plan → answer goal, body, training, food, coach.
3. [ ] **Connect** → Apple Health permission sheet appears → allow.
4. [ ] **Your AI coach** screen appears next. Read it — is it clear what is sent? Tap **Allow AI coaching**.
5. [ ] Plan reveal → reminder screen → land on Today.
6. [ ] Create an account / Sign in with Apple works.

## B. Daily use (10 min)
7. [ ] Today: readiness ring shows real data (or "connect" if Health has none), the workout, protein line, and a **sleep or steps habit** line.
8. [ ] Start workout → log 2 sets → finish. Train tab shows it in history.
9. [ ] Food → **Photo** → take a photo of real food → items + grams appear (needs the AI key). Save it.
10. [ ] Food → **Barcode** → scan any packaged food → it's found → save.
11. [ ] Today protein line updated after saving.
12. [ ] Body tab: Coach's analysis text appears (AI) within ~10 s.

## C. New screens (5 min)
13. [ ] You → **AI coaching** → shows On → turn Off → go to Food → Photo shows the "turn on AI coaching" card, not an error → turn it back On.
14. [ ] You → **Weekly verdict** → shows a call + reason + your training days.
15. [ ] You → **Send feedback** → send "test from Presko" → Thanks screen. (Claude checks it arrived in Supabase.)
16. [ ] You → Daily reminder → set a time → notification arrives at that time.

## D. Edge cases (5 min)
17. [ ] Airplane mode → open the app → nothing crashes; Today still shows the workout.
18. [ ] Dark mode (You → Appearance → Dark) → screens readable.
19. [ ] Sign out → sign back in → your workout history is still there.
20. [ ] You → Delete account flow shows the confirmation (don't confirm on your real account).

All ticked → reply **"ship it"** and the build gets submitted to App Review.
