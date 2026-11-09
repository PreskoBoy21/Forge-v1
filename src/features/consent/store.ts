import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { deviceStorage } from '@/lib/storage';

/**
 * Permission to send data to the AI provider (Anthropic) — App Store
 * guideline 5.1.2(i). Nothing goes to the AI until this is 'granted'.
 * 'unknown' = never asked (existing users are asked the first time an AI
 * feature needs it).
 */
export type AiConsent = 'unknown' | 'granted' | 'denied';

type ConsentState = {
  ai: AiConsent;
  decidedAt: string | null;
  setAi: (v: Exclude<AiConsent, 'unknown'>) => void;
};

export const useConsent = create<ConsentState>()(
  persist(
    (set) => ({
      ai: 'unknown',
      decidedAt: null,
      setAi: (ai) => set({ ai, decidedAt: new Date().toISOString() }),
    }),
    {
      name: 'forge-consent',
      storage: deviceStorage,
      partialize: (s) => ({ ai: s.ai, decidedAt: s.decidedAt }),
    },
  ),
);

export const aiAllowed = () => useConsent.getState().ai === 'granted';

/** What leaves the phone when AI is on — shown on the consent screen and in You. */
export const AI_DATA_SHARED = [
  'Health numbers: sleep, HRV, resting heart rate, steps, weight trend',
  'Training and food totals: workouts done, PRs, calories, protein',
  'Meal photos you choose to scan (not stored after the estimate)',
] as const;

export const AI_DATA_NOT_SHARED =
  'Never your name, email or contacts. Not used for ads, never sold.';
