import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Eyebrow } from '@/components/ui';
import { useWeekly } from '@/features/progress/useWeekly';
import { goBack } from '@/lib/nav';
import { track } from '@/lib/telemetry';
import { useColors } from '@/theme/theme';

const DAY = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** Weekly Verdict: one decision for next week, from the real last 7 days. */
export default function VerdictScreen() {
  const c = useColors();
  const { verdict, week, stats } = useWeekly();
  useEffect(() => track('verdict_viewed', { key: verdict.key }), [verdict.key]);
  const tone =
    verdict.tone === 'good'
      ? c.good
      : verdict.tone === 'warn'
        ? c.warn
        : c.info;

  return (
    <Screen scroll>
      <Eyebrow>Weekly verdict · last 7 days</Eyebrow>
      <Text className="mt-6 font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        The call
      </Text>
      <Text
        className="mt-2 font-display text-[48px] uppercase leading-[50px] tracking-wide"
        style={{ color: tone }}
      >
        {verdict.call}
      </Text>
      <Text className="mt-4 font-ui text-[17px] leading-6 text-bone">
        {verdict.reason}
      </Text>

      <Card className="mt-8">
        <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
          Training days
        </Text>
        <View className="mt-3 flex-row gap-2">
          {week.map((d) => {
            const wd = (new Date(`${d.date}T00:00:00Z`).getUTCDay() + 6) % 7;
            return (
              <View key={d.date} className="flex-1 items-center">
                <View
                  className={`h-10 w-full rounded-md ${d.trained ? 'bg-molten' : 'bg-graphite-700'}`}
                />
                <Text className="mt-1 font-ui text-[11px] text-steel">
                  {DAY[wd]}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>

      <View className="mt-4 flex-row flex-wrap">
        <Stat value={`${stats.workouts}/${stats.planned}`} label="Workouts" />
        <Stat value={String(stats.prs)} label="New PRs" />
        <Stat
          value={stats.protein !== undefined ? `${stats.protein} g` : '–'}
          label={`Protein / ${stats.proteinTarget} g`}
        />
        <Stat
          value={stats.sleep !== undefined ? `${stats.sleep} h` : '–'}
          label="Avg sleep"
        />
      </View>
      {stats.prNames.length ? (
        <Text className="mt-2 font-ui text-[13px] text-steel">
          PRs: {stats.prNames.join(' · ')}
        </Text>
      ) : null}

      <View className="mt-8 pb-4">
        <Button label="Got it, coach" onPress={() => goBack()} />
      </View>
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View className="mb-3 w-1/2">
      <Text
        className="font-display text-[24px] text-bone"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {value}
      </Text>
      <Text className="mt-1 font-ui text-[12px] text-steel">{label}</Text>
    </View>
  );
}
