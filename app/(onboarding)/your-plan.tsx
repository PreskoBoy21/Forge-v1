import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { mockPlan } from '@/features/preview/mock-data';

export default function YourPlanScreen() {
  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">
        Your plan
      </Text>
      <Text className="mt-2 font-body text-base text-muted">
        Sample targets for a 24-year-old, 180 cm, 82 kg, lose fat, 4 days.
      </Text>
      <View className="mt-8 gap-4">
        <Card accent="lime">
          <Text className="font-heading text-xl uppercase text-lime">
            Calories
          </Text>
          <Text className="mt-2 font-headingBold text-4xl text-ink">
            {mockPlan.kcal} kcal
          </Text>
          <Text className="mt-3 font-body text-base text-ink">
            P {mockPlan.proteinG}g · C {mockPlan.carbsG}g · F {mockPlan.fatG}g
          </Text>
        </Card>
        <Card>
          <Text className="font-heading text-xl uppercase text-ink">
            {mockPlan.split}
          </Text>
          <View className="mt-3 gap-2">
            {mockPlan.splitDays.map((day, index) => (
              <Text
                key={day + index}
                className="font-body text-base text-muted"
              >
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]} ·{' '}
                {day}
              </Text>
            ))}
          </View>
        </Card>
      </View>
      <View className="mt-10">
        <Button label="Start" onPress={() => router.replace('/(tabs)/today')} />
      </View>
    </Screen>
  );
}
