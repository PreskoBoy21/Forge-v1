/**
 * "Your day, planned": when to eat what and when to train, built from the
 * user's own meal times (defaults until there is history), today's logged
 * meals, their targets and today's workout. Recommendations only.
 */
export type PlanMeal = {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  /** Minutes after local midnight. */
  minute: number;
  date: string;
  protein: number;
  kcal: number;
};

export type DayPlanInput = {
  today: string;
  /** Minutes after local midnight right now. */
  nowMinute: number;
  /** Recent meals (any day) — used for typical times and today's log. */
  meals: PlanMeal[];
  proteinTarget: number;
  kcalTarget: number;
  workout?: {
    name: string;
    minutes: number;
    done: boolean;
    call: 'push' | 'normal' | 'easy';
    lead?: string;
  };
  avgSleepH?: number;
};

export type PlanItem = {
  key: string;
  minute: number;
  title: string;
  body: string;
  tag?: string;
  state: 'done' | 'next' | 'later' | 'missed';
};

const DEFAULT = { breakfast: 480, lunch: 780, snack: 960, dinner: 1170 };

export const clock = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

const round15 = (m: number) => Math.round(m / 15) * 15;

/** Median minute of the user's meals of one type (last 14 days). */
export function typicalTime(
  meals: PlanMeal[],
  type: PlanMeal['type'],
  today: string,
): number {
  const from = new Date(Date.parse(`${today}T12:00:00Z`) - 14 * 864e5)
    .toISOString()
    .slice(0, 10);
  const ms = meals
    .filter((m) => m.type === type && m.date >= from && m.date < today)
    .map((m) => m.minute)
    .sort((a, b) => a - b);
  if (ms.length < 3) return DEFAULT[type];
  return round15(ms[Math.floor(ms.length / 2)]!);
}

export function dayPlan(p: DayPlanInput): PlanItem[] {
  const todays = p.meals.filter((m) => m.date === p.today);
  const eatenProtein = todays.reduce((a, m) => a + m.protein, 0);
  const types: PlanMeal['type'][] = ['breakfast', 'lunch', 'snack', 'dinner'];
  const t = Object.fromEntries(
    types.map((k) => [k, typicalTime(p.meals, k, p.today)]),
  ) as Record<PlanMeal['type'], number>;

  const training = p.workout && !p.workout.done ? p.workout : undefined;
  // Train ~3 h after lunch, at least 1 h before dinner.
  const trainAt = round15(
    Math.min(Math.max(t.lunch + 180, 1020), t.dinner - 120),
  );

  const open = types.filter((k) => !todays.some((m) => m.type === k));
  const openMain = open.filter((k) => k !== 'snack').length;
  const left = Math.max(0, p.proteinTarget - eatenProtein);
  const snackShare = open.includes('snack') ? Math.min(25, left) : 0;
  const perMeal = openMain
    ? Math.round((left - snackShare) / openMain / 5) * 5
    : 0;

  const items: Omit<PlanItem, 'state'>[] = [];
  for (const k of types) {
    const logged = todays.filter((m) => m.type === k);
    if (logged.length) {
      const prot = logged.reduce((a, m) => a + m.protein, 0);
      const kcal = logged.reduce((a, m) => a + m.kcal, 0);
      items.push({
        key: k,
        minute: logged[0]!.minute,
        title: k[0]!.toUpperCase() + k.slice(1),
        body: `Logged · ${Math.round(prot)} g protein`,
        tag: `${Math.round(kcal)} kcal`,
      });
      continue;
    }
    if (k === 'snack') {
      items.push({
        key: k,
        minute: training ? trainAt - 90 : t.snack,
        title: training ? 'Pre-workout snack' : 'Snack',
        body: training
          ? `Something light with carbs + ~${snackShare || 20} g protein, 60–90 min before training.`
          : `~${snackShare || 20} g protein: yogurt, a shake or a sandwich.`,
      });
      continue;
    }
    const carbs =
      training && (k === 'lunch' || (k === 'dinner' && trainAt < t.dinner))
        ? k === 'lunch'
          ? ' Bigger carbs to fuel training.'
          : ' Carbs + protein to recover.'
        : '';
    items.push({
      key: k,
      minute: t[k],
      title: k[0]!.toUpperCase() + k.slice(1),
      body: `~${perMeal} g protein.${carbs}`,
    });
  }

  if (p.workout) {
    items.push({
      key: 'workout',
      minute: p.workout.done ? Math.min(p.nowMinute, trainAt) : trainAt,
      title: p.workout.done
        ? `${p.workout.name} · done`
        : `${p.workout.name}${p.workout.call === 'push' ? ' · go heavy' : p.workout.call === 'easy' ? ' · easy' : ''}`,
      body: p.workout.done
        ? 'Nice. Eat protein within a few hours and sleep well tonight.'
        : (p.workout.lead ??
          (p.workout.call === 'easy'
            ? 'Same weights, one set less per exercise.'
            : 'Follow the plan in the Gym tab.')),
      tag: p.workout.done ? undefined : `~${p.workout.minutes} min`,
    });
  } else {
    items.push({
      key: 'rest',
      minute: trainAt,
      title: 'Rest day',
      body: 'A 20–30 min walk helps recovery without tiring your legs.',
    });
  }

  const sleepNeed =
    p.avgSleepH !== undefined && p.avgSleepH < 7
      ? `You average ${p.avgSleepH} h — go to bed 30 min earlier.`
      : 'Aim for 7+ hours. Same time as usual.';
  items.push({
    key: 'sleep',
    minute: Math.max(t.dinner + 180, 22 * 60 + 30),
    title: 'Lights out',
    body: sleepNeed,
  });

  items.sort((a, b) => a.minute - b.minute);
  let nextSet = false;
  return items.map((it) => {
    const done =
      it.body.startsWith('Logged') ||
      (it.key === 'workout' && p.workout?.done === true);
    if (done) return { ...it, state: 'done' as const };
    if (it.minute + 90 < p.nowMinute && it.key !== 'sleep') {
      return { ...it, state: 'missed' as const };
    }
    if (!nextSet) {
      nextSet = true;
      return { ...it, state: 'next' as const };
    }
    return { ...it, state: 'later' as const };
  });
}
