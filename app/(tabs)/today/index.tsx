import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ChevronRight, Sparkles, Utensils } from '@/components/icons';
import { Screen } from '@/components/Screen';
import { Eyebrow, IconBadge } from '@/components/ui';
import { useToday } from '@/features/food/store';
import { ConnectHealthCard } from '@/features/health/ui/ConnectHealthCard';
import { ReadinessRing } from '@/features/health/ui/ReadinessRing';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { useCoachRead } from '@/features/health/ui/useCoachRead';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { planToday, useTrain } from '@/features/train/store';
import { go } from '@/lib/nav';
import { useColors } from '@/theme/theme';

/**
 * Today = three things, nothing else:
 * 1. How ready you are + the coach's call   2. The workout   3. Protein left
 * Everything else lives one tap away (Body, Train, Food).
 */
const CALL = {
  push: 'You’re recovered. Go for a rep PR on your first lift.',
  normal: 'Normal day. Run the plan as written.',
  easy: 'Under-recovered. Same weights, one set less per move.',
} as const;

const LEVEL = {
  high: 'Fully recovered',
  normal: 'Recovered',
  low: 'Needs recovery',
} as const;

export default function TodayScreen() {
  const c = useColors();
  const { analysis, goal } = useAnalysis();
  const ready = analysis.readiness;
  const { data: coach, isFetching } = useCoachRead(analysis, goal);
  const food = useToday();
  const easy = ready?.training === 'easy';
  const history = useTrain((st) => st.history);
  const active = useTrain((st) => st.active);
  const trainingDays = useOnboardingDraft((st) => st.trainingDays);
  const overrides = useTrain((st) => st.overrides);
  const plan = useMemo(
    () => planToday(history, easy),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, easy, overrides],
  );
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [weekAgo] = useState(() =>
    new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10),
  );
  const thisWeek = history.filter((w) => w.date >= weekAgo).length;
  const doneToday = history.some((w) => w.date === today);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const minutes = Math.round(
    plan.moves.reduce((t, mv) => t + mv.sets * (mv.restSec + 45), 0) / 60,
  );
  const proteinLeft = Math.max(0, food.targets.proteinG - food.eaten.protein);

  return (
    <Screen scroll>
      <Eyebrow>
        {new Date().toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
      </Eyebrow>
      <Text className="mt-1 font-display text-[28px] uppercase tracking-wide text-bone">
        {greeting}
      </Text>

      {/* 1 — how ready you are */}
      {ready ? (
        <Pressable onPress={() => go('/(tabs)/body')} className="mt-6">
          <Card>
            <View className="flex-row items-center">
              <ReadinessRing r={ready} size={104} />
              <View className="ml-4 flex-1">
                <Text className="font-uiSemi text-[18px] text-bone">
                  {LEVEL[ready.level]}
                </Text>
                <Text className="mt-1 font-ui text-[15px] leading-[21px] text-steel">
                  {coach?.today ??
                    (isFetching ? 'Reading your data…' : CALL[ready.training])}
                </Text>
              </View>
            </View>
            {coach ? (
              <View className="mt-3 flex-row items-center">
                <Sparkles size={14} color={c.accent} />
                <Text className="ml-1.5 font-uiMedium text-[12px] text-molten">
                  AI coach · tap for your full analysis
                </Text>
              </View>
            ) : null}
          </Card>
        </Pressable>
      ) : (
        <View className="mt-6">
          <ConnectHealthCard />
        </View>
      )}

      {/* 2 — the workout */}
      <Card molten className="mt-4">
        <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-molten">
          {doneToday ? 'Done today ✓' : 'Today’s workout'}
        </Text>
        <Text className="mt-2 font-display text-[30px] uppercase leading-8 text-bone">
          {active ? active.dayName : plan.name}
        </Text>
        <Text className="mt-1 font-ui text-[14px] text-steel">
          ~{minutes} min · {plan.moves.length} exercises · workout{' '}
          {Math.min(thisWeek + (doneToday ? 0 : 1), trainingDays)} of{' '}
          {trainingDays} this week
        </Text>
        <View className="mt-5">
          <Button
            label={
              active
                ? 'Resume workout'
                : doneToday
                  ? 'Train again'
                  : 'Start workout'
            }
            size="gym"
            onPress={() => {
              if (!active) useTrain.getState().start(easy);
              go('/(tabs)/train/gym');
            }}
          />
        </View>
        <Pressable
          onPress={() => go('/(tabs)/train')}
          hitSlop={8}
          className="mt-3 items-center"
        >
          <Text className="font-uiMedium text-[14px] text-steel">
            See the exercises
          </Text>
        </Pressable>
      </Card>

      {/* 3 — food in one line */}
      <Pressable
        onPress={() => go('/(tabs)/snap')}
        className="mb-6 mt-4 flex-row items-center rounded-card border border-graphite-700/60 bg-graphite-900 p-4"
      >
        <IconBadge Icon={Utensils} color={c.warn} />
        <View className="ml-3 flex-1">
          <Text className="font-uiSemi text-[16px] text-bone">
            {proteinLeft > 0
              ? `${proteinLeft} g protein to go`
              : 'Protein goal hit'}
          </Text>
          <Text className="font-ui text-[13px] text-steel">
            {food.eaten.kcal} / {food.targets.kcal} kcal today
          </Text>
        </View>
        <ChevronRight size={20} color={c.muted} />
      </Pressable>
    </Screen>
  );
}
