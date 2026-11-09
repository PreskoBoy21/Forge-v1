/**
 * Forge Score (0–100): how well today followed the plan.
 * Training 40 · protein 30 · calories in range 20 · logging 10.
 * Pure function so it is easy to test.
 */
export type ScoreInput = {
  trained: boolean;
  weekDone: boolean; // this week's planned sessions already done → rest counts
  proteinG: number;
  proteinTargetG: number;
  kcal: number;
  kcalTarget: number;
  mealsLogged: number;
};

export type ScoreRow = { label: string; points: number; max: number };

export const FORGED_AT = 60;

export function forgeScore(i: ScoreInput): { score: number; rows: ScoreRow[] } {
  const training = i.trained ? 40 : i.weekDone ? 40 : 0;
  const protein =
    i.proteinTargetG > 0
      ? Math.round(Math.min(1, i.proteinG / i.proteinTargetG) * 30)
      : 0;
  const off =
    i.kcalTarget > 0 ? Math.abs(i.kcal - i.kcalTarget) / i.kcalTarget : 1;
  const calories = i.kcal <= 0 ? 0 : off <= 0.1 ? 20 : off <= 0.2 ? 10 : 0;
  const logged = i.mealsLogged >= 2 ? 10 : i.mealsLogged === 1 ? 5 : 0;
  const rows: ScoreRow[] = [
    {
      label: i.trained
        ? 'Workout done'
        : i.weekDone
          ? 'Rest day (week’s sessions done)'
          : 'Workout not done',
      points: training,
      max: 40,
    },
    {
      label: `Protein ${Math.round(i.proteinG)} / ${i.proteinTargetG} g`,
      points: protein,
      max: 30,
    },
    {
      label: `Calories ${Math.round(i.kcal)} / ${i.kcalTarget}`,
      points: calories,
      max: 20,
    },
    { label: `Meals logged: ${i.mealsLogged}`, points: logged, max: 10 },
  ];
  return { score: training + protein + calories + logged, rows };
}

/**
 * Days in a row (ending today, or yesterday if today isn't active yet) where
 * the user trained or logged food. `active` is oldest → newest, last = today.
 */
export function activeStreak(active: boolean[]): number {
  let i = active.length - 1;
  if (i >= 0 && !active[i]) i -= 1;
  let n = 0;
  while (i >= 0 && active[i]) {
    n += 1;
    i -= 1;
  }
  return n;
}
