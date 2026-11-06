import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useFood, useTargets } from '@/features/food/store';
import { nutritionSummary } from '@/features/food/nutrition';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { trainingSummary } from '@/features/train/stats';
import { useTrain } from '@/features/train/store';
import { useSession } from '@/features/auth/session';
import { supabase } from '@/lib/supabase';

import { aiPayload, type Analysis, type Goal } from '../insights';

export type ExplainArea =
  'recovery' | 'weight' | 'body' | 'activity' | 'training' | 'nutrition';

export type CoachRead = {
  headline: string;
  summary: string;
  today: string;
  explain?: Partial<Record<ExplainArea, string>>;
};

/**
 * AI-written daily read from the `analyze-health` Edge Function, built from
 * health data + training + nutrition summaries (numbers only, no names).
 * Only runs when signed in; screens fall back to rule-based insights.
 */
export function useCoachRead(analysis: Analysis, goal: Goal) {
  const coachStyle = useOnboardingDraft((s) => s.coach);
  const trainingDays = useOnboardingDraft((s) => s.trainingDays);
  const history = useTrain((s) => s.history);
  const meals = useFood((s) => s.meals);
  const targets = useTargets();
  const signedIn = useSession((s) => Boolean(s.session));
  const today = new Date().toISOString().slice(0, 10);

  const payload = useMemo(() => {
    const training = history.length
      ? trainingSummary(history, today, trainingDays)
      : undefined;
    const nutrition = nutritionSummary(meals, today, targets);
    return { ...aiPayload(analysis, goal), training, nutrition };
  }, [analysis, goal, history, meals, targets, today, trainingDays]);

  const hasAnything = Boolean(
    payload.readiness ||
    payload.weight ||
    payload.activity ||
    payload.training ||
    payload.nutrition,
  );

  return useQuery({
    queryKey: ['coach-read', payload, coachStyle],
    enabled: Boolean(supabase) && signedIn && hasAnything,
    staleTime: 1000 * 60 * 60 * 6,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false,
    queryFn: async (): Promise<CoachRead | null> => {
      if (!supabase) return null;
      const { data, error } = await supabase.functions.invoke<CoachRead>(
        'analyze-health',
        { body: { payload, coachStyle } },
      );
      if (error || !data || !('headline' in data)) return null;
      return data;
    },
  });
}
