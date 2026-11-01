import { useMemo } from 'react';

import { useOnboardingDraft } from '@/features/onboarding/draft-store';

import { analyze, type Goal } from '../insights';
import { useHealth } from '../store';

export function useGoal(): Goal {
  const goal = useOnboardingDraft((s) => s.goal);
  return goal === 'both' || !goal ? 'recomp' : goal;
}

export function useAnalysis() {
  const snapshot = useHealth((s) => s.snapshot);
  const goal = useGoal();
  const analysis = useMemo(
    () => analyze(snapshot.days, goal),
    [snapshot, goal],
  );
  return { snapshot, analysis, goal };
}
