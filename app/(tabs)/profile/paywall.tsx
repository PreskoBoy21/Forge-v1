import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { OptionChip } from '@/components/OptionChip';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';

export default function PaywallScreen() {
  const [yearly, setYearly] = useState(true);

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">
        Forge Pro
      </Text>
      <Text className="mt-2 font-body text-base text-muted">
        Unlimited scans, weekly adjustments, Apple Health / Health Connect.
      </Text>
      <View className="mt-6 flex-row gap-3">
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
            selected={yearly}
            onPress={() => setYearly(true)}
          />
        </View>
      </View>
      <View className="mt-6 gap-3">
        {[
          'Unlimited meal scans',
          'Adaptive weekly calorie changes',
          'Health app sync',
          'Progress stories (later)',
        ].map((perk) => (
          <Card key={perk}>
            <Text className="font-bodyMedium text-ink">{perk}</Text>
          </Card>
        ))}
      </View>
      <View className="mt-8">
        <Button
          label={
            yearly ? 'Unlock yearly (preview)' : 'Unlock monthly (preview)'
          }
          onPress={() => router.replace('/(tabs)/profile')}
        />
      </View>
    </Screen>
  );
}
