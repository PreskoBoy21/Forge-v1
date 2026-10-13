import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { mockMeals, mockPlan, mockToday } from '@/features/preview/mock-data';

export default function FoodIndexScreen() {
  const eatenKcal = mockMeals.reduce((sum, meal) => sum + meal.kcal, 0);

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">Food</Text>
      <Text className="mt-2 font-body text-base text-muted">
        {eatenKcal} / {mockPlan.kcal} kcal · {mockToday.remaining.proteinG}g
        protein left
      </Text>

      <View className="mt-6 flex-row gap-2">
        <Ring label="P" value="73" />
        <Ring label="C" value="35" />
        <Ring label="F" value="40" />
      </View>

      <View className="mt-6 gap-3">
        {mockMeals.map((meal) => (
          <Card key={meal.name}>
            <Text className="font-body text-xs uppercase text-muted">
              {meal.name}
            </Text>
            <Text className="mt-1 font-heading text-xl uppercase text-ink">
              {meal.title}
            </Text>
            <Text className="mt-1 font-body text-muted">
              {meal.kcal} kcal · {meal.proteinG}g protein
            </Text>
          </Card>
        ))}
      </View>

      <View className="mt-8 gap-3">
        <Button
          label="Scan a meal"
          variant="orange"
          onPress={() => router.push('/(tabs)/food/scan')}
        />
        <Button
          label="Add manually"
          variant="secondary"
          onPress={() => router.push('/(tabs)/food/add-manual')}
        />
      </View>
    </Screen>
  );
}

function Ring({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center rounded-3xl bg-surface py-5">
      <Text className="font-headingBold text-3xl text-lime">{value}%</Text>
      <Text className="mt-1 font-body text-xs uppercase text-muted">
        {label}
      </Text>
    </View>
  );
}
