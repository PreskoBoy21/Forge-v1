import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { InsightCard } from '@/features/health/ui/InsightCard';
import { ReadinessRing } from '@/features/health/ui/ReadinessRing';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { mockCall } from '@/features/preview/mock-data';
import { go } from '@/lib/nav';

/**
 * Today = one decision. Morning: readiness → today's workout → one tip.
 * The Forge Score (did you follow the plan?) lives in the evening ritual,
 * so the morning screen has a single main number.
 */
const CALL = {
  push: 'Recovered. Go for a rep PR on your first lift.',
  normal: 'Normal day. Run the plan as written.',
  easy: 'Under-recovered. Same weights, one set less per move.',
} as const;

export default function TodayScreen() {
  const { analysis } = useAnalysis();
  const ready = analysis.readiness;
  const tip = analysis.insights.find((i) => !i.id.startsWith('readiness'));
  const proteinLeft = mockCall.protein.target - mockCall.protein.current;
  const easy = ready?.training === 'easy';

  return (
    <Screen scroll>
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
            {new Date()
              .toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })
              .toUpperCase()}
          </Text>
          <Text className="mt-1 font-display text-[24px] uppercase tracking-wide text-bone">
            {mockCall.greeting}
          </Text>
        </View>
        <View className="rounded-full bg-graphite-800 px-3 py-2">
          <Text className="font-uiSemi text-[13px] text-ember">
            🔥 {mockCall.streak}
          </Text>
        </View>
      </View>

      {/* 1 — the one number */}
      {ready ? (
        <Pressable
          onPress={() => go('/(tabs)/body')}
          className="mt-6 items-center"
        >
          <ReadinessRing r={ready} size={176} />
          <Text className="mt-3 font-uiMedium text-[12px] uppercase tracking-widest text-steel">
            Readiness
          </Text>
          <Text className="mt-1 px-6 text-center font-uiSemi text-[17px] text-bone">
            {CALL[ready.training]}
          </Text>
        </Pressable>
      ) : null}

      {/* 2 — the one thing to do */}
      <View className="mt-7 rounded-card border border-molten/40 bg-graphite-900 p-4">
        <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-molten">
          Today’s workout
        </Text>
        <View className="mt-3 flex-row items-end justify-between">
          <Text className="font-display text-[34px] uppercase leading-9 tracking-wide text-bone">
            {mockCall.workout}
          </Text>
          <Text className="mb-1 font-ui text-[13px] text-steel">
            {mockCall.minutes} min ·{' '}
            {easy ? mockCall.moves - 1 : mockCall.moves} moves
          </Text>
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="font-ui text-[15px] text-steel">
            {easy ? 'Bench press 3×8' : mockCall.exercise}
          </Text>
          <Text className="font-uiSemi text-[15px] text-mint">
            {mockCall.weight} ↑ {mockCall.overload}
          </Text>
        </View>
        <View className="mt-5">
          <Button
            label="Start Gym Mode"
            onPress={() => go('/(tabs)/train/gym')}
          />
        </View>
      </View>

      {/* 3 — one coach tip */}
      {tip ? (
        <Pressable className="mt-4" onPress={() => go('/(tabs)/body')}>
          <InsightCard insight={tip} />
        </Pressable>
      ) : null}

      {/* food in one line — details live in Snap */}
      <Pressable
        onPress={() => go('/(tabs)/snap')}
        className="mt-4 flex-row items-center justify-between rounded-card bg-graphite-900 px-4 py-3"
      >
        <View className="flex-1">
          <Text className="font-uiSemi text-[15px] text-bone">
            {proteinLeft} g protein left
          </Text>
          <Text className="mt-0.5 font-ui text-[13px] text-steel">
            Next: {mockCall.nextMeal.title.toLowerCase()} ·{' '}
            {mockCall.nextMeal.protein} g
          </Text>
        </View>
        <Text className="font-uiSemi text-[15px] text-molten">Snap →</Text>
      </Pressable>

      <Pressable
        className="mt-6 py-3"
        onPress={() => go('/(tabs)/today/forge-day')}
      >
        <Text className="text-center font-uiMedium text-[13px] text-steel">
          Tonight · Forge the day and get your score
        </Text>
      </Pressable>
    </Screen>
  );
}
