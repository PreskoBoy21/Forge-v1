import { create } from 'zustand';

export type Sex = 'male' | 'female';
export type Goal = 'lose_fat' | 'build_muscle' | 'both';
export type Experience = 'beginner' | 'intermediate';
export type GymChain = 'basic_fit' | 'fit_for_free' | 'home' | 'other';
export type CoachPersona = 'buddy' | 'sergeant' | 'scientist';

export type OnboardingDraft = {
  goal: Goal | null;
  sex: Sex | null;
  birthYear: number | null;
  confirmed18Plus: boolean;
  heightCm: number;
  weightKg: number;
  trainingDays: number;
  experience: Experience | null;
  gym: GymChain | null;
  dietNotes: string;
  hateEating: string;
  coach: CoachPersona;
};

type OnboardingState = OnboardingDraft & {
  update: (patch: Partial<OnboardingDraft>) => void;
  reset: () => void;
};

const initialDraft: OnboardingDraft = {
  goal: null,
  sex: null,
  birthYear: null,
  confirmed18Plus: false,
  heightCm: 178,
  weightKg: 80,
  trainingDays: 4,
  experience: null,
  gym: null,
  dietNotes: '',
  hateEating: '',
  coach: 'buddy',
};

export const useOnboardingDraft = create<OnboardingState>((set) => ({
  ...initialDraft,
  update: (patch) => set(patch),
  reset: () => set(initialDraft),
}));
