import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { nextWeight, pickSplit } from '@/features/plan/engine';
import { deviceStorage } from '@/lib/storage';

import {
  easier,
  lastSessionFor,
  startingWeight,
  todaysDay,
  type EquipmentAccess,
  type LoggedSet,
  type PlannedMove,
  type WorkoutLog,
} from './program';
import { pushWorkout } from './sync';

export type ActiveMove = PlannedMove & {
  targetKg: number;
  reason: 'increase' | 'deload' | 'keep' | 'first';
};

export type ActiveWorkout = {
  dayName: string;
  date: string;
  startedAt: number;
  moves: ActiveMove[];
  moveIndex: number;
  sets: LoggedSet[];
};

type TrainState = {
  history: WorkoutLog[];
  active: ActiveWorkout | null;
  start: (easy?: boolean) => void;
  logSet: (weightKg: number, reps: number) => void;
  undoSet: () => void;
  goToMove: (index: number) => void;
  swap: (name: string) => void;
  finish: () => Promise<WorkoutLog | null>;
  discard: () => void;
  markSynced: (id: string) => void;
  setHistory: (history: WorkoutLog[]) => void;
};

const today = () => new Date().toISOString().slice(0, 10);

function userContext() {
  const d = useOnboardingDraft.getState();
  return {
    split: pickSplit(d.trainingDays),
    access: (d.gym === 'home'
      ? 'home_dumbbells'
      : 'full_gym') as EquipmentAccess,
    beginner: d.experience !== 'intermediate',
    female: d.sex === 'female',
  };
}

export function targetFor(
  move: PlannedMove,
  history: WorkoutLog[],
): Pick<ActiveMove, 'targetKg' | 'reason'> {
  const last = lastSessionFor(history, move.name);
  if (!last) {
    const ctx = userContext();
    return { targetKg: startingWeight(move.name, ctx), reason: 'first' };
  }
  const n = nextWeight({ ...last, repMax: move.repMax });
  return { targetKg: n.weightKg, reason: n.reason };
}

/** Today's planned session (before starting), with target weights. */
export function planToday(
  history: WorkoutLog[],
  easy = false,
): { name: string; moves: ActiveMove[] } {
  const ctx = userContext();
  const base = todaysDay(ctx.split, history.length, ctx.access);
  const day = easy ? easier(base) : base;
  return {
    ...day,
    moves: day.moves.map((mv) => ({ ...mv, ...targetFor(mv, history) })),
  };
}

export const useTrain = create<TrainState>()(
  persist(
    (set, get) => ({
      history: [],
      active: null,
      start: (easy = false) => {
        if (get().active) return;
        const plan = planToday(get().history, easy);
        set({
          active: {
            dayName: plan.name,
            date: today(),
            startedAt: Date.now(),
            moves: plan.moves,
            moveIndex: 0,
            sets: [],
          },
        });
      },
      logSet: (weightKg, reps) => {
        const a = get().active;
        if (!a) return;
        const mv = a.moves[a.moveIndex];
        if (!mv) return;
        const done = a.sets.filter((s) => s.exercise === mv.name).length;
        const sets = [
          ...a.sets,
          {
            exercise: mv.name,
            setIndex: done,
            weightKg,
            reps,
            repMin: mv.repMin,
            repMax: mv.repMax,
          },
        ];
        const moveIndex =
          done + 1 >= mv.sets
            ? Math.min(a.moves.length - 1, a.moveIndex + 1)
            : a.moveIndex;
        set({ active: { ...a, sets, moveIndex } });
      },
      undoSet: () => {
        const a = get().active;
        if (!a || a.sets.length === 0) return;
        const last = a.sets[a.sets.length - 1]!;
        const idx = a.moves.findIndex((m) => m.name === last.exercise);
        set({
          active: {
            ...a,
            sets: a.sets.slice(0, -1),
            moveIndex: idx >= 0 ? idx : a.moveIndex,
          },
        });
      },
      goToMove: (index) => {
        const a = get().active;
        if (!a) return;
        set({
          active: {
            ...a,
            moveIndex: Math.max(0, Math.min(a.moves.length - 1, index)),
          },
        });
      },
      swap: (name) => {
        const a = get().active;
        if (!a) return;
        const moves = a.moves.map((mv, i) => {
          if (i !== a.moveIndex) return mv;
          const next = { ...mv, name };
          return { ...next, ...targetFor(next, get().history) };
        });
        set({ active: { ...a, moves } });
      },
      finish: async () => {
        const a = get().active;
        if (!a) return null;
        if (a.sets.length === 0) {
          set({ active: null });
          return null;
        }
        const log: WorkoutLog = {
          id: `${a.date}-${a.startedAt}`,
          date: a.date,
          dayName: a.dayName,
          sets: a.sets,
          synced: false,
        };
        set({ history: [log, ...get().history], active: null });
        void pushWorkout(log)
          .then((ok) => ok && get().markSynced(log.id))
          .catch(() => undefined);
        return log;
      },
      discard: () => set({ active: null }),
      markSynced: (id) =>
        set({
          history: get().history.map((w) =>
            w.id === id ? { ...w, synced: true } : w,
          ),
        }),
      setHistory: (history) => set({ history }),
    }),
    {
      name: 'forge-training',
      storage: deviceStorage,
      partialize: (s) => ({ history: s.history, active: s.active }),
    },
  ),
);

/** Push workouts that were logged offline or before signing in. */
export async function syncPendingWorkouts() {
  const { history, markSynced } = useTrain.getState();
  for (const w of history.filter((h) => !h.synced)) {
    const ok = await pushWorkout(w).catch(() => false);
    if (ok) markSynced(w.id);
  }
}
