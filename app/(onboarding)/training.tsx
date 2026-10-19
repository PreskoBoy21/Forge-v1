import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionChip } from '@/components/OptionChip';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { Stepper } from '@/components/Stepper';
import {
  type Experience,
  type GymChain,
  useOnboardingDraft,
} from '@/features/onboarding/draft-store';
import { go } from '@/lib/nav';

const GYMS: { value: GymChain; label: string }[] = [
  { value: 'basic_fit', label: 'Basic-Fit' },
  { value: 'fit_for_free', label: 'Fit For Free' },
  { value: 'home', label: 'Home dumbbells' },
  { value: 'other', label: 'Other gym' },
];

export default function TrainingScreen() {
  const draft = useOnboardingDraft();

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Training
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        Pick a chain and we set the equipment.
      </Text>
      <View className="mt-8">
        <Stepper
          label="Days per week"
          value={draft.trainingDays}
          min={2}
          max={6}
          onChange={(trainingDays) => draft.update({ trainingDays })}
        />
      </View>
      <Text className="mb-2 mt-8 font-uiMedium text-[13px] uppercase tracking-wide text-steel">
        Experience
      </Text>
      <View className="gap-3">
        {(['beginner', 'intermediate'] as Experience[]).map((value) => (
          <OptionChip
            key={value}
            label={value === 'beginner' ? 'Beginner' : 'Intermediate'}
            selected={draft.experience === value}
            onPress={() => draft.update({ experience: value })}
          />
        ))}
      </View>
      <Text className="mb-2 mt-8 font-uiMedium text-[13px] uppercase tracking-wide text-steel">
        Gym
      </Text>
      <View className="gap-3">
        {GYMS.map((gym) => (
          <OptionChip
            key={gym.value}
            label={gym.label}
            selected={draft.gym === gym.value}
            onPress={() => draft.update({ gym: gym.value })}
          />
        ))}
      </View>
      <View className="mt-10">
        <Button
          label="Continue"
          disabled={!draft.experience || !draft.gym}
          onPress={() => go('/(onboarding)/food')}
        />
      </View>
    </Screen>
  );
}
