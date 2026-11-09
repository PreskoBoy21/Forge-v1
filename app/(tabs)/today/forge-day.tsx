import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ForgedStamp } from '@/components/ForgedStamp';
import { Screen } from '@/components/Screen';
import { dayTotals } from '@/features/food/nutrition';
import { useFood, useTargets } from '@/features/food/store';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import {
  activeStreak,
  FORGED_AT,
  forgeScore,
} from '@/features/progress/forgeScore';
import { mondayOf } from '@/features/train/stats';
import { planToday, useTrain } from '@/features/train/store';
import { goBack } from '@/lib/nav';
import { useTodayIso } from '@/lib/useTodayIso';
import { colors } from '@/theme/tokens';

/** Forge the Day: tonight's score from what you actually did today. */
export default function ForgeDayScreen() {
  const today = useTodayIso();
  const history = useTrain((s) => s.history);
  const meals = useFood((s) => s.meals);
  const targets = useTargets();
  const planned = useOnboardingDraft((s) => s.trainingDays);

  const { score, rows, streak, next } = useMemo(() => {
    const eaten = dayTotals(meals, today);
    const weekWorkouts = new Set(
      history.filter((w) => w.date >= mondayOf(today)).map((w) => w.date),
    ).size;
    const result = forgeScore({
      trained: history.some((w) => w.date === today),
      weekDone: weekWorkouts >= planned,
      proteinG: eaten.protein,
      proteinTargetG: targets.proteinG,
      kcal: eaten.kcal,
      kcalTarget: targets.kcal,
      mealsLogged: meals.filter((m) => m.date === today).length,
    });
    const end = Date.parse(`${today}T00:00:00Z`);
    const active = Array.from({ length: 60 }, (_, i) => {
      const d = new Date(end - (59 - i) * 864e5).toISOString().slice(0, 10);
      return (
        history.some((w) => w.date === d) || meals.some((m) => m.date === d)
      );
    });
    return {
      ...result,
      streak: activeStreak(active),
      next: planToday(history, false).name,
    };
  }, [history, meals, targets, planned, today]);

  const [shown, setShown] = useState(0);
  useEffect(() => {
    const ticks = setInterval(() => {
      setShown((v) => {
        if (v + 3 >= score) {
          clearInterval(ticks);
          return score;
        }
        return v + 3;
      });
    }, 30);
    return () => clearInterval(ticks);
  }, [score]);

  const forged = score >= FORGED_AT;
  const when = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <Screen>
      <Text className="text-center font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        {when} · Forge the day
      </Text>

      <View className="mt-8 items-center">
        <LinearGradient
          colors={[...colors.gradient.forge]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 168,
            width: 168,
            alignItems: 'center',
            borderRadius: 84,
            justifyContent: 'center',
          }}
        >
          <View className="h-[148px] w-[148px] items-center justify-center rounded-full bg-graphite-950">
            <Text
              className="font-display text-[56px] text-bone"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {shown}
            </Text>
            <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
              Forge score
            </Text>
          </View>
        </LinearGradient>
      </View>

      {forged ? (
        <View className="mt-8">
          <ForgedStamp />
        </View>
      ) : (
        <Text className="mt-8 text-center font-uiSemi text-[17px] text-bone">
          {FORGED_AT - score} points to forge today
        </Text>
      )}
      {streak > 0 ? (
        <Text className="mt-4 text-center font-uiSemi text-[15px] text-ember">
          🔥 {streak}-day streak · trained or logged food
        </Text>
      ) : null}

      <View className="mt-8 gap-3">
        {rows.map((row) => (
          <View key={row.label} className="flex-row justify-between">
            <Text className="flex-1 font-ui text-[15px] text-steel">
              {row.label}
            </Text>
            <Text
              className={`font-uiSemi text-[15px] ${row.points === row.max ? 'text-mint' : 'text-bone'}`}
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {row.points}/{row.max}
            </Text>
          </View>
        ))}
      </View>
      <Text className="mt-6 font-ui text-[13px] text-steel">
        Next workout: {next}
      </Text>

      <View className="mt-auto pb-4 pt-6">
        <Button label="Done" onPress={() => goBack()} />
      </View>
    </Screen>
  );
}
