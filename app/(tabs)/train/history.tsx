import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { type WorkoutLog } from '@/features/train/program';
import { useTrain } from '@/features/train/store';

function summary(w: WorkoutLog, older: WorkoutLog[]) {
  const prs: string[] = [];
  const best: Record<string, number> = {};
  for (const o of older)
    for (const s of o.sets)
      best[s.exercise] = Math.max(best[s.exercise] ?? 0, s.weightKg);
  for (const s of w.sets) {
    const prev = best[s.exercise];
    if (prev !== undefined && s.weightKg > prev && !prs.includes(s.exercise))
      prs.push(s.exercise);
  }
  const volume = w.sets.reduce((t, s) => t + s.weightKg * s.reps, 0);
  return {
    detail: prs.length
      ? `PR: ${prs.slice(0, 2).join(', ')}`
      : `${w.sets.length} sets · ${Math.round(volume).toLocaleString('en-GB')} kg moved`,
    pr: prs.length > 0,
  };
}

export default function HistoryScreen() {
  const history = useTrain((s) => s.history);
  const rows = useMemo(
    () => history.map((w, i) => ({ w, ...summary(w, history.slice(i + 1)) })),
    [history],
  );

  return (
    <Screen scroll>
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        History
      </Text>
      {rows.length === 0 ? (
        <Text className="mt-4 font-ui text-[17px] text-steel">
          No workouts yet. Your first session shows up here.
        </Text>
      ) : null}
      <View className="mt-6 gap-3 pb-6">
        {rows.map(({ w, detail, pr }) => (
          <Card key={w.id}>
            <Text className="font-ui text-[13px] uppercase text-steel">
              {new Date(w.date).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
              {w.synced ? '' : ' · not synced yet'}
            </Text>
            <Text className="mt-1 font-display text-[24px] uppercase text-bone">
              {w.dayName}
            </Text>
            <Text
              className={`mt-1 font-ui text-[15px] ${pr ? 'text-mint' : 'text-steel'}`}
            >
              {detail}
            </Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
