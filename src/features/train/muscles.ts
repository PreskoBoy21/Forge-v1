import { HOWTO } from './howto.ts';
import type { WorkoutLog } from './program.ts';

/** Body-map muscle ids (react-native-body-highlighter slugs). */
export type MuscleSlug =
  | 'chest'
  | 'deltoids'
  | 'triceps'
  | 'biceps'
  | 'forearm'
  | 'upper-back'
  | 'lower-back'
  | 'trapezius'
  | 'abs'
  | 'obliques'
  | 'quadriceps'
  | 'gluteal'
  | 'hamstring'
  | 'adductors'
  | 'calves';

export const MUSCLE_LABEL: Record<MuscleSlug, string> = {
  chest: 'Chest',
  deltoids: 'Shoulders',
  triceps: 'Triceps',
  biceps: 'Biceps',
  forearm: 'Forearms',
  'upper-back': 'Back',
  'lower-back': 'Lower back',
  trapezius: 'Traps',
  abs: 'Abs',
  obliques: 'Obliques',
  quadriceps: 'Quads',
  gluteal: 'Glutes',
  hamstring: 'Hamstrings',
  adductors: 'Inner thighs',
  calves: 'Calves',
};

/** Words used in the how-to guides → body-map muscles. */
const WORDS: [RegExp, MuscleSlug[]][] = [
  [/lower back/, ['lower-back']],
  [/chest/, ['chest']],
  [/shoulders/, ['deltoids']],
  [/triceps/, ['triceps']],
  [/biceps/, ['biceps']],
  [/forearm|grip/, ['forearm']],
  [/lats|mid back|upper back|^back/, ['upper-back']],
  [/traps/, ['trapezius']],
  [/core/, ['abs', 'obliques']],
  [/abs/, ['abs']],
  [/hip flexors/, ['quadriceps']],
  [/quads/, ['quadriceps']],
  [/glutes/, ['gluteal']],
  [/hamstrings/, ['hamstring']],
  [/calves/, ['calves']],
  [/inner thigh|adductor/, ['adductors']],
];

const LEGS: MuscleSlug[] = ['quadriceps', 'gluteal', 'hamstring'];

export type MuscleMap = { primary: MuscleSlug[]; secondary: MuscleSlug[] };

function slugsOf(part: string): MuscleSlug[] {
  const p = part.trim().toLowerCase();
  return WORDS.filter(([re]) => re.test(p)).flatMap(([, s]) => s);
}

/**
 * Which muscles an exercise works, from its how-to guide ("Chest, front
 * shoulders, triceps"): the first group is primary, the rest secondary.
 * Leg compounds (squat, hip thrust, RDL) count their first two leg muscles
 * as primary.
 */
export function musclesFor(exercise: string): MuscleMap | undefined {
  const works = HOWTO[exercise]?.works;
  if (!works) return undefined;
  const parts = works
    .split(',')
    .map(slugsOf)
    .filter((s) => s.length);
  if (!parts.length) return undefined;
  const primary = new Set(parts[0]);
  const rest = parts.slice(1);
  if (LEGS.includes(parts[0]![0]!) && rest[0]?.some((s) => LEGS.includes(s))) {
    rest.shift()!.forEach((s) => primary.add(s));
  }
  const secondary = new Set(rest.flat().filter((s) => !primary.has(s)));
  return { primary: [...primary], secondary: [...secondary] };
}

/** Union of the muscles a list of exercises works (primary wins). */
export function musclesForMany(exercises: string[]): MuscleMap {
  const primary = new Set<MuscleSlug>();
  const secondary = new Set<MuscleSlug>();
  for (const e of exercises) {
    const m = musclesFor(e);
    m?.primary.forEach((s) => primary.add(s));
    m?.secondary.forEach((s) => secondary.add(s));
  }
  primary.forEach((s) => secondary.delete(s));
  return { primary: [...primary], secondary: [...secondary] };
}

const DAY = 86_400_000;

/**
 * Sets per muscle in the 7 days up to `today` (primary = 1 set,
 * secondary = ½ set), for the weekly body map.
 */
export function weeklyMuscleSets(
  history: WorkoutLog[],
  today: string,
): Partial<Record<MuscleSlug, number>> {
  const from = new Date(Date.parse(`${today}T12:00:00Z`) - 6 * DAY)
    .toISOString()
    .slice(0, 10);
  const out: Partial<Record<MuscleSlug, number>> = {};
  for (const w of history) {
    if (w.date < from || w.date > today) continue;
    for (const s of w.sets) {
      const m = musclesFor(s.exercise);
      m?.primary.forEach((k) => (out[k] = (out[k] ?? 0) + 1));
      m?.secondary.forEach((k) => (out[k] = (out[k] ?? 0) + 0.5));
    }
  }
  return out;
}

/** Big groups worth calling out when untrained this week. */
export const MAIN_GROUPS: MuscleSlug[] = [
  'chest',
  'upper-back',
  'deltoids',
  'quadriceps',
  'hamstring',
  'gluteal',
  'biceps',
  'triceps',
];
