import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionChip } from '@/components/OptionChip';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import type { Goal } from '@/types/database';

const GOALS: { value: Goal; label: string }[] = [
  { value: 'lose_fat', label: 'Lose fat' },
  { value: 'build_muscle', label: 'Build muscle' },
  { value: 'recomp', label: 'Recomp' },
];

export default function GoalScreen() {
  const goal = useOnboardingDraft((s) => s.goal);
  const update = useOnboardingDraft((s) => s.update);

  return (
    <Screen>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">Goal</Text>
      <Text className="mt-2 font-body text-base text-muted">
        This sets the calorie adjustment. Targets are calculated in code, not by
        the model.
      </Text>
      <View className="mt-8 gap-3">
        {GOALS.map((item) => (
          <OptionChip
            key={item.value}
            label={item.label}
            selected={goal === item.value}
            onPress={() => update({ goal: item.value })}
          />
        ))}
      </View>
      <View className="mt-auto pb-6">
        <Button
          label="Continue"
          disabled={!goal}
          onPress={() => router.push('/(onboarding)/training')}
        />
      </View>
    </Screen>
  );
}
