import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { mockPrs, mockWeights } from '@/features/preview/mock-data';

export default function ProgressIndexScreen() {
  const max = Math.max(...mockWeights);
  const min = Math.min(...mockWeights);

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">Progress</Text>
      <Text className="mt-2 font-body text-base text-muted">
        7-day average {mockWeights[mockWeights.length - 1]?.toFixed(1)} kg ·
        down 1.0 kg
      </Text>

      <Card>
        <Text className="font-heading text-lg uppercase text-ink">Weight</Text>
        <View className="mt-4 h-32 flex-row items-end gap-2">
          {mockWeights.map((weight, index) => {
            const height = 40 + ((weight - min) / (max - min || 1)) * 70;
            return (
              <View
                key={index}
                className="flex-1 rounded-t-lg bg-lime"
                style={{ height }}
              />
            );
          })}
        </View>
      </Card>

      <View className="mt-4 gap-3">
        {mockPrs.map((pr) => (
          <Card key={pr.name}>
            <Text className="font-body text-xs uppercase text-muted">
              {pr.name}
            </Text>
            <Text className="mt-1 font-heading text-xl uppercase text-ink">
              {pr.value}
            </Text>
          </Card>
        ))}
      </View>

      <View className="mt-8">
        <Button
          label="Weekly check-in"
          onPress={() => router.push('/(tabs)/progress/checkin')}
        />
      </View>
    </Screen>
  );
}
