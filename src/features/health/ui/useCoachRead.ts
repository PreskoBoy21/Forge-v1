import { useQuery } from '@tanstack/react-query';

import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { supabase } from '@/lib/supabase';

import { aiPayload, type Analysis, type Goal } from '../insights';

export type CoachRead = { headline: string; summary: string; today: string };

/**
 * AI-written daily read from the `analyze-health` Edge Function.
 * Only runs when Supabase is configured and the user is signed in; otherwise
 * the Body screen shows the rule-based insights on their own.
 */
export function useCoachRead(analysis: Analysis, goal: Goal) {
  const coachStyle = useOnboardingDraft((s) => s.coach);
  const payload = aiPayload(analysis, goal);
  return useQuery({
    queryKey: ['coach-read', payload, coachStyle],
    enabled: Boolean(supabase),
    staleTime: 1000 * 60 * 60 * 6,
    retry: false,
    queryFn: async (): Promise<CoachRead | null> => {
      if (!supabase) return null;
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return null;
      const { data, error } = await supabase.functions.invoke<CoachRead>(
        'analyze-health',
        {
          body: { payload, coachStyle },
        },
      );
      if (error || !data || !('headline' in data)) return null;
      return data;
    },
  });
}
