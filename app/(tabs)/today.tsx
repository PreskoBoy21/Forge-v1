import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { mockToday } from '@/features/preview/mock-data';

export default function TodayScreen() {
  const today = new Date().toLocaleDateString('en-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return (
    <View className="flex-1 bg-background">
      <Screen scroll>
        <PreviewBanner />
        <Text className="font-bodyMedium text-sm uppercase tracking-widest text-muted">
          {today}
        </Text>
        <Text className="mt-1 font-heading text-4xl uppercase text-ink">
          Today
        </Text>
        <Text className="mt-1 font-body text-muted">
          Streak · {mockToday.streak} days
        </Text>

        <Pressable
          className="mt-6"
          onPress={() => router.push('/(tabs)/train/session')}
        >
          <Card accent="lime">
            <Text className="font-heading text-lg uppercase text-lime">
              Workout
            </Text>
            <Text className="mt-2 font-headingBold text-3xl text-ink">
              {mockToday.workoutName}
            </Text>
            <Text className="mt-1 font-body text-muted">
              {mockToday.workoutMeta}
            </Text>
            <Text className="mt-3 font-bodySemi text-lime">Open session</Text>
          </Card>
        </Pressable>

        <View className="mt-4 flex-row gap-2">
          <MacroTile
            label="Protein"
            value={`${mockToday.remaining.proteinG}g`}
          />
          <MacroTile label="Carbs" value={`${mockToday.remaining.carbsG}g`} />
          <MacroTile label="Fat" value={`${mockToday.remaining.fatG}g`} />
        </View>

        {mockToday.mealIdeas.map((idea) => (
          <View key={idea.title} className="mt-4">
            <Card>
              <Text className="font-heading text-lg uppercase text-ink">
                {idea.title}
              </Text>
              <Text className="mt-2 font-body text-muted">
                {idea.description}
              </Text>
              <Text className="mt-2 font-bodyMedium text-ink">
                {idea.kcal} kcal · {idea.proteinG}g protein
              </Text>
            </Card>
          </View>
        ))}

        <View className="mt-4 pb-16">
          <Card>
            <Text className="font-body italic text-muted">
              {mockToday.coachMessage}
            </Text>
          </Card>
        </View>
      </Screen>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/(tabs)/food/scan')}
        className="absolute bottom-6 right-5 min-h-[48px] items-center justify-center rounded-full bg-orange px-5"
      >
        <Text className="font-bodySemi text-background">Scan my meal</Text>
      </Pressable>
    </View>
  );
}

function MacroTile({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-3xl bg-surface p-4">
      <Text className="font-body text-xs uppercase text-muted">{label}</Text>
      <Text className="mt-2 font-heading text-2xl text-ink">{value}</Text>
      <Text className="mt-1 font-body text-xs text-muted">left</Text>
    </View>
  );
}
