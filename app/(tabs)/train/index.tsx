import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { mockExercises, mockToday } from '@/features/preview/mock-data';

export default function TrainIndexScreen() {
  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">Train</Text>
      <Text className="mt-2 font-body text-base text-muted">
        {mockToday.workoutName} · {mockToday.workoutMeta}
      </Text>
      <View className="mt-6 gap-3">
        {mockExercises.map((exercise) => (
          <Card key={exercise.name}>
            <Text className="font-heading text-lg uppercase text-ink">
              {exercise.name}
            </Text>
            <Text className="mt-1 font-body text-muted">
              {exercise.sets} × {exercise.repMin}–{exercise.repMax} ·{' '}
              {exercise.weight} kg
            </Text>
          </Card>
        ))}
      </View>
      <View className="mt-8 gap-3">
        <Button
          label="Start session"
          onPress={() => router.push('/(tabs)/train/session')}
        />
        <Button
          label="History"
          variant="secondary"
          onPress={() => router.push('/(tabs)/train/history')}
        />
      </View>
    </Screen>
  );
}
