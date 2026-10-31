/**
 * Forge plan engine: deterministic nutrition + training rules.
 * Source of truth: FORGE_APP_PLAN.md §4 (Nutrition & safety rules) and F4/F5.
 * Pure functions only, no React/Expo imports, so they can run in the app,
 * in Supabase Edge Functions and in unit tests.
 */

export type Sex = 'male' | 'female';
export type PlanGoal = 'lose_fat' | 'build_muscle' | 'recomp';

export type BodyInput = {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  trainingDays: number; // 2–6
  goal: PlanGoal;
};

export type Targets = {
  bmr: number;
  tdee: number;
  kcal: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  /** Guardrails that changed the raw number, for transparency in the UI. */
  adjustments: string[];
};

export const MIN_KCAL: Record<Sex, number> = { male: 1500, female: 1200 };
const KCAL_PER_G = { protein: 4, carbs: 4, fat: 9 } as const;

export function bmrMifflinStJeor({ sex, age, heightCm, weightKg }: BodyInput) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

export function activityFactor(trainingDays: number) {
  if (trainingDays <= 3) return 1.375;
  if (trainingDays <= 5) return 1.55;
  return 1.725;
}

const GOAL_MULTIPLIER: Record<PlanGoal, number> = {
  lose_fat: 0.8,
  build_muscle: 1.1,
  recomp: 0.975, // middle of the −5%…0% band
};

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export function calcTargets(input: BodyInput): Targets {
  if (input.age < 18) throw new Error('Forge is for users aged 18+.');
  const adjustments: string[] = [];
  const bmr = bmrMifflinStJeor(input);
  const tdee = bmr * activityFactor(input.trainingDays);

  let kcal = tdee * GOAL_MULTIPLIER[input.goal];

  // Guardrails: max 25% deficit, never below BMR, never below sex floor.
  const maxDeficitFloor = tdee * 0.75;
  if (kcal < maxDeficitFloor) {
    kcal = maxDeficitFloor;
    adjustments.push('deficit_capped_25pct');
  }
  if (kcal < bmr) {
    kcal = bmr;
    adjustments.push('raised_to_bmr');
  }
  if (kcal < MIN_KCAL[input.sex]) {
    kcal = MIN_KCAL[input.sex];
    adjustments.push('raised_to_min_kcal');
  }
  kcal = roundTo(kcal, 10);

  // Macros: protein 1.8 g/kg (cap 2.2), fat 27.5% (min 0.6 g/kg), carbs rest.
  const proteinG = Math.round(Math.min(1.8, 2.2) * input.weightKg);
  let fatG = Math.round((kcal * 0.275) / KCAL_PER_G.fat);
  const minFat = Math.ceil(0.6 * input.weightKg);
  if (fatG < minFat) {
    fatG = minFat;
    adjustments.push('fat_raised_to_min');
  }
  const carbKcal = kcal - proteinG * KCAL_PER_G.protein - fatG * KCAL_PER_G.fat;
  const carbsG = Math.max(0, Math.round(carbKcal / KCAL_PER_G.carbs));

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    kcal,
    proteinG,
    fatG,
    carbsG,
    adjustments,
  };
}

/** Expected weekly weight change range in kg, shown as an estimate. */
export function expectedWeeklyChangeKg(
  goal: PlanGoal,
  weightKg: number,
): [number, number] {
  const pct: Record<PlanGoal, [number, number]> = {
    lose_fat: [-0.01, -0.005],
    build_muscle: [0.0025, 0.005],
    recomp: [-0.0025, 0],
  };
  const [a, b] = pct[goal];
  return [
    Math.round(a * weightKg * 10) / 10,
    Math.round(b * weightKg * 10) / 10,
  ];
}

// ---------------------------------------------------------------- training

export type Split = 'full_body' | 'upper_lower' | 'ppl';

export function pickSplit(trainingDays: number): Split {
  if (trainingDays <= 3) return 'full_body';
  if (trainingDays === 4) return 'upper_lower';
  return 'ppl';
}

export type LastSession = {
  weightKg: number;
  repMax: number;
  /** Reps actually done per set in the last session. */
  reps: number[];
  /** How many sessions in a row the rep target was missed (0 if hit). */
  missedStreak: number;
  isLowerBody: boolean;
};

/**
 * Progressive overload (rules-based, F4):
 * all sets at top of range → +2.5 kg upper / +5 kg lower;
 * target missed twice in a row → −7.5% (rounded to 2.5 kg);
 * otherwise keep.
 */
export function nextWeight(last: LastSession): {
  weightKg: number;
  reason: 'increase' | 'deload' | 'keep';
} {
  const allTop =
    last.reps.length > 0 && last.reps.every((r) => r >= last.repMax);
  if (allTop) {
    return {
      weightKg: last.weightKg + (last.isLowerBody ? 5 : 2.5),
      reason: 'increase',
    };
  }
  if (last.missedStreak >= 2) {
    return {
      weightKg: Math.max(0, roundTo(last.weightKg * 0.925, 2.5)),
      reason: 'deload',
    };
  }
  return { weightKg: last.weightKg, reason: 'keep' };
}

// ---------------------------------------------------------- weekly check-in

export type CheckinInput = {
  goal: PlanGoal;
  sex: Sex;
  bmr: number;
  currentKcal: number;
  avgWeightKg: number;
  prevAvgWeightKg: number;
  /** Was last week's change also "too slow"? */
  previousWeekTooSlow: boolean;
};

export type CheckinResult = {
  kcalChange: number;
  newKcal: number;
  weeklyChangePct: number;
  verdict: 'keep' | 'eat_less' | 'eat_more' | 'slow_down';
  tooSlow: boolean;
};

const MAX_STEP = 150;

export function weeklyCheckin(input: CheckinInput): CheckinResult {
  const pct =
    (input.avgWeightKg - input.prevAvgWeightKg) / input.prevAvgWeightKg;
  let change = 0;
  let verdict: CheckinResult['verdict'] = 'keep';
  let tooSlow = false;

  if (pct < -0.015) {
    // Losing >1.5%/week: always slow down, whatever the goal.
    change = MAX_STEP;
    verdict = 'slow_down';
  } else if (input.goal === 'lose_fat') {
    if (pct > -0.0025) {
      tooSlow = true;
      if (input.previousWeekTooSlow) {
        change = -100;
        verdict = 'eat_less';
      }
    } else if (pct < -0.01) {
      change = 100;
      verdict = 'eat_more';
    }
  } else if (input.goal === 'build_muscle') {
    if (pct < 0.0025) {
      tooSlow = true;
      if (input.previousWeekTooSlow) {
        change = 100;
        verdict = 'eat_more';
      }
    } else if (pct > 0.005) {
      change = -100;
      verdict = 'eat_less';
    }
  } else {
    // recomp: hold weight roughly steady (±0.25%/week).
    if (pct > 0.0025) {
      change = -100;
      verdict = 'eat_less';
    } else if (pct < -0.0075) {
      change = 100;
      verdict = 'eat_more';
    }
  }

  change = Math.max(-MAX_STEP, Math.min(MAX_STEP, change));
  const floor = Math.max(MIN_KCAL[input.sex], input.bmr);
  const newKcal = Math.max(floor, input.currentKcal + change);

  return {
    kcalChange: newKcal - input.currentKcal,
    newKcal,
    weeklyChangePct: Math.round(pct * 10000) / 100,
    verdict:
      newKcal - input.currentKcal === 0 && verdict !== 'keep'
        ? 'keep'
        : verdict,
    tooSlow,
  };
}
