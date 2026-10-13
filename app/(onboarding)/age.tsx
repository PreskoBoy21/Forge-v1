import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionChip } from '@/components/OptionChip';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';

export default function AgeScreen() {
  const confirmed18Plus = useOnboardingDraft((s) => s.confirmed18Plus);
  const update = useOnboardingDraft((s) => s.update);

  return (
    <Screen>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">
        Are you 18+?
      </Text>
      <Text className="mt-2 font-body text-base text-muted">
        Forge is only for adults. We store your birth year next and block
        under-18 accounts.
      </Text>
      <View className="mt-8">
        <OptionChip
          label="Yes, I am 18 or older"
          selected={confirmed18Plus}
          onPress={() => update({ confirmed18Plus: true })}
        />
      </View>
      <View className="mt-auto pb-6">
        <Button
          label="Continue"
          disabled={!confirmed18Plus}
          onPress={() => router.push('/(onboarding)/body')}
        />
      </View>
    </Screen>
  );
}
