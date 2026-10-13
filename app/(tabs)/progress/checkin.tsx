import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';

export default function CheckinScreen() {
  const [weight, setWeight] = useState('81.4');
  const [done, setDone] = useState(false);

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">Check-in</Text>
      <Text className="mt-2 font-body text-base text-muted">
        Week 2 · lose fat · target −0.5% to −1%
      </Text>
      <Text className="mb-2 mt-8 font-bodyMedium text-ink">Weight (kg)</Text>
      <TextInput
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        placeholderTextColor={colors.muted}
        className="min-h-[48px] rounded-2xl bg-surface px-4 font-body text-base text-ink"
      />
      {done ? (
        <View className="mt-6">
          <Card accent="lime">
            <Text className="font-heading text-lg uppercase text-lime">
              Coach
            </Text>
            <Text className="mt-3 font-body text-base text-ink">
              Down 0.4 kg this week, right on track. Keeping calories the same.
            </Text>
            <Text className="mt-3 font-body text-sm text-muted">
              Change: 0 kcal · still 2,140 kcal
            </Text>
          </Card>
          <View className="mt-6">
            <Button
              label="Back to progress"
              onPress={() => router.replace('/(tabs)/progress')}
            />
          </View>
        </View>
      ) : (
        <View className="mt-8">
          <Button label="Get this week’s recap" onPress={() => setDone(true)} />
        </View>
      )}
    </Screen>
  );
}
