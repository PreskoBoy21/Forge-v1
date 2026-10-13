import { create } from 'zustand';

import type {
  CoachStyle,
  Equipment,
  Experience,
  Goal,
  Sex,
} from '@/types/database';

export type DietPref =
  'none' | 'vegetarian' | 'vegan' | 'halal' | 'no_pork' | 'allergies';

export type OnboardingDraft = {
  confirmed18Plus: boolean;
  sex: Sex | null;
  birthYear: number | null;
  heightCm: number | null;
  weightKg: number | null;
  goal: Goal | null;
  trainingDays: number | null;
  experience: Experience | null;
  equipment: Equipment | null;
  dietPref: DietPref;
  allergies: string;
  coachStyle: CoachStyle;
};

type OnboardingState = OnboardingDraft & {
  update: (patch: Partial<OnboardingDraft>) => void;
  reset: () => void;
};

const initialDraft: OnboardingDraft = {
  confirmed18Plus: false,
  sex: null,
  birthYear: null,
  heightCm: null,
  weightKg: null,
  goal: null,
  trainingDays: null,
  experience: null,
  equipment: null,
  dietPref: 'none',
  allergies: '',
  coachStyle: 'buddy',
};

export const useOnboardingDraft = create<OnboardingState>((set) => ({
  ...initialDraft,
  update: (patch) => set(patch),
  reset: () => set(initialDraft),
}));
