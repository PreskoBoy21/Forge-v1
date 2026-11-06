import { useFood } from '@/features/food/store';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { useTrain } from '@/features/train/store';

/** Wipes everything Forge stored on this device. */
export function clearLocalData() {
  useOnboardingDraft.getState().reset();
  useTrain.setState({ history: [], active: null, overrides: {} });
  useFood.setState({ meals: [], kcalAdjust: 0, checkins: [] });
}
