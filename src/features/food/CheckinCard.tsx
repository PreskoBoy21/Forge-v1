import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';

import type { DayPoint } from '../health/types';
import { computeCheckin, useFood, type CheckinRecord } from './store';

const VERDICT: Record<CheckinRecord['verdict'], string> = {
  keep: 'Right on track. Keep calories the same.',
  eat_less: 'Progress stalled. Small cut to get it moving.',
  eat_more: 'Moving faster than planned. A little more food protects muscle.',
  slow_down: 'Dropping too fast. Eat more so you keep your muscle.',
};

/** Weekly check-in: average weight vs last week → calorie change. */
export function CheckinCard({ days }: { days: DayPoint[] }) {
  const draft = useOnboardingDraft();
  const { kcalAdjust, checkins, applyCheckin } = useFood();
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const c = computeCheckin(days, draft, kcalAdjust, checkins, today);
  const last = checkins[0];

  if (c === null) {
    if (!last) return null;
    return (
      <View className="mt-4 rounded-card bg-graphite-900 p-4">
        <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
          Weekly check-in · done
        </Text>
        <Text className="mt-1 font-ui text-[15px] text-bone">
          {VERDICT[last.verdict]}
          {last.kcalChange
            ? ` (${last.kcalChange > 0 ? '+' : ''}${last.kcalChange} kcal/day)`
            : ''}
        </Text>
      </View>
    );
  }

  if ('missing' in c) {
    return (
      <View className="mt-4 rounded-card bg-graphite-900 p-4">
        <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
          Weekly check-in
        </Text>
        <Text className="mt-1 font-ui text-[15px] text-steel">
          Weigh in {c.missing} more {c.missing === 1 ? 'time' : 'times'} this
          week and your calories adjust automatically.
        </Text>
      </View>
    );
  }

  const diff = c.avgWeightKg - c.prevAvgWeightKg;
  return (
    <View className="mt-4 rounded-card border border-molten/40 bg-graphite-900 p-4">
      <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-molten">
        Weekly check-in
      </Text>
      <Text className="mt-2 font-display text-[24px] text-bone">
        {diff > 0 ? '+' : diff < 0 ? '−' : '±'}
        {Math.abs(diff).toFixed(1)} kg
        <Text className="font-ui text-[15px] text-steel">
          {' '}
          avg this week ({c.avgWeightKg.toFixed(1)} kg)
        </Text>
      </Text>
      <Text className="mt-2 font-ui text-[15px] text-bone">
        {VERDICT[c.verdict]}
      </Text>
      <Text className="mt-1 font-uiSemi text-[15px] text-mint">
        {c.kcalChange === 0
          ? `Stay at ${c.newKcal} kcal`
          : `New target: ${c.newKcal} kcal (${c.kcalChange > 0 ? '+' : ''}${c.kcalChange})`}
      </Text>
      <View className="mt-4">
        <Button label="Apply" onPress={() => applyCheckin(c)} />
      </View>
    </View>
  );
}
