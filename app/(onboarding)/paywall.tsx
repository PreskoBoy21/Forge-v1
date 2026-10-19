import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionChip } from '@/components/OptionChip';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { replaceTo } from '@/lib/nav';

export default function OnboardingPaywallScreen() {
  const [yearly, setYearly] = useState(true);

  return (
    <Screen>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Forge Pro
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        After the value, never before. Continue free is always visible.
      </Text>
      <View className="mt-8 flex-row gap-3">
        <View className="flex-1">
          <OptionChip
            label="€9.99 / mo"
            selected={!yearly}
            onPress={() => setYearly(false)}
          />
        </View>
        <View className="flex-1">
          <OptionChip
            label="€59.99 / yr"
            hint="7-day trial"
            selected={yearly}
            onPress={() => setYearly(true)}
          />
        </View>
      </View>
      <View className="mt-auto gap-3 pb-6">
        <Button
          label={yearly ? 'Start 7-day trial' : 'Go Pro'}
          onPress={() => replaceTo('/(tabs)/today')}
        />
        <Button
          label="Continue free"
          variant="ghost"
          onPress={() => replaceTo('/(tabs)/today')}
        />
      </View>
    </Screen>
  );
}
