import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { InsightCard } from '@/features/health/ui/InsightCard';
import { ReadinessRing } from '@/features/health/ui/ReadinessRing';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { useToday } from '@/features/food/store';
import { kgLabel } from '@/features/train/program';
import { planToday, useTrain } from '@/features/train/store';
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
  const food = useToday();
  const proteinLeft = Math.max(0, food.targets.proteinG - food.eaten.protein);
  const easy = ready?.training === 'easy';
  const history = useTrain((st) => st.history);
  const active = useTrain((st) => st.active);
  const trainingDays = useOnboardingDraft((st) => st.trainingDays);
  const plan = useMemo(() => planToday(history, easy), [history, easy]);
  const first = plan.moves[0];
  const [weekAgo] = useState(() =>
    new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10),
  );
  const thisWeek = history.filter((w) => w.date >= weekAgo).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
  const minutes = Math.round(
    plan.moves.reduce((t, mv) => t + mv.sets * (mv.restSec + 45), 0) / 60,
  );

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
            {greeting}
          </Text>
        </View>
        <View className="rounded-full bg-graphite-800 px-3 py-2">
          <Text className="font-uiSemi text-[13px] text-ember">
            🔥 {thisWeek}/{trainingDays} this week
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
            {active ? active.dayName : plan.name}
          </Text>
          <Text className="mb-1 font-ui text-[13px] text-steel">
            ~{minutes} min · {plan.moves.length} moves
          </Text>
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="font-ui text-[15px] text-steel">
            {first ? `${first.name} ${first.sets}×${first.repMax}` : ''}
          </Text>
          <Text className="font-uiSemi text-[15px] text-mint">
            {first ? kgLabel(first.targetKg) : ''}
            {first?.reason === 'increase' ? ' ↑' : ''}
          </Text>
        </View>
        <View className="mt-5">
          <Button
            label={active ? 'Resume workout' : 'Start Gym Mode'}
            onPress={() => {
              if (!active) useTrain.getState().start(easy);
              go('/(tabs)/train/gym');
            }}
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
            {food.eaten.kcal} / {food.targets.kcal} kcal · {food.meals.length}{' '}
            {food.meals.length === 1 ? 'meal' : 'meals'} logged
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
