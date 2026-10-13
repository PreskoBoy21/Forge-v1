import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionChip } from '@/components/OptionChip';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';

export default function CoachStyleScreen() {
  const coachStyle = useOnboardingDraft((s) => s.coachStyle);
  const update = useOnboardingDraft((s) => s.update);

  return (
    <Screen>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">
        Coach style
      </Text>
      <Text className="mt-2 font-body text-base text-muted">
        Buddy is friendly. Strict is direct — never insulting.
      </Text>
      <View className="mt-8 gap-3">
        <OptionChip
          label="Buddy"
          selected={coachStyle === 'buddy'}
          onPress={() => update({ coachStyle: 'buddy' })}
        />
        <OptionChip
          label="Strict"
          selected={coachStyle === 'strict'}
          onPress={() => update({ coachStyle: 'strict' })}
        />
      </View>
      <View className="mt-auto pb-6">
        <Button
          label="See your plan"
          onPress={() => router.push('/(onboarding)/your-plan')}
        />
      </View>
    </Screen>
  );
}
