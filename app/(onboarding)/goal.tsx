import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionChip } from '@/components/OptionChip';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import {
  type Goal,
  useOnboardingDraft,
} from '@/features/onboarding/draft-store';
import { go } from '@/lib/nav';

const GOALS: { value: Goal; label: string; hint: string }[] = [
  { value: 'lose_fat', label: 'Lose fat', hint: 'Keep muscle, drop weight' },
  { value: 'build_muscle', label: 'Build muscle', hint: 'Eat for growth' },
  { value: 'both', label: 'Both', hint: 'Recomp. Slow and honest.' },
];

export default function GoalScreen() {
  const goal = useOnboardingDraft((s) => s.goal);
  const update = useOnboardingDraft((s) => s.update);

  return (
    <Screen>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        What’s the goal?
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">One tap.</Text>
      <View className="mt-8 gap-3">
        {GOALS.map((item) => (
          <OptionChip
            key={item.value}
            label={item.label}
            hint={item.hint}
            selected={goal === item.value}
            onPress={() => update({ goal: item.value })}
          />
        ))}
      </View>
      <View className="mt-auto pb-6">
        <Button
          label="Continue"
          disabled={!goal}
          onPress={() => go('/(onboarding)/body')}
        />
      </View>
    </Screen>
  );
}
