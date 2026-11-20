import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { BarChart } from '@/components/charts';
import { RefreshCw, Sparkles } from '@/components/icons';
import { Screen } from '@/components/Screen';
import { Eyebrow, Segmented } from '@/components/ui';
import { hm, sleepSummary } from '@/features/health/sleep';
import {
  hasHealthData,
  healthProviderLabel,
  healthSupported,
  manualHealth,
  useHealth,
} from '@/features/health/store';
import { ConnectHealthCard } from '@/features/health/ui/ConnectHealthCard';
import {
  MorningCheckin,
  useNeedsCheckin,
} from '@/features/health/ui/MorningCheckin';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { useCoachRead } from '@/features/health/ui/useCoachRead';
import { lastDays, shortDate } from '@/features/health/vitals';
import { useColors } from '@/theme/theme';

/**
 * Sleep = last night, your week as a graph, and one recommendation.
 * (Route stays /body so old links keep working.)
 */
const STATUS = {
  rested: 'Well rested',
  short: 'A bit short',
  very_short: 'Short night',
  none: 'No data yet',
} as const;

const weekday = (d: string) =>
  new Date(`${d}T12:00:00Z`)
    .toLocaleDateString('en-GB', { weekday: 'short' })
    .slice(0, 2);

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-2xl bg-graphite-800 px-3 py-2.5">
      <Text className="font-ui text-[12px] text-steel">{label}</Text>
      <Text
        className="font-uiSemi text-[16px] text-bone"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {value}
      </Text>
    </View>
  );
}

export default function SleepScreen() {
  const c = useColors();
  const { snapshot, analysis, goal } = useAnalysis();
  const { connected, loading, refresh } = useHealth();
  const needsCheckin = useNeedsCheckin();
  const { data: coach } = useCoachRead(analysis, goal);
  const isDemo = snapshot.provider === 'demo';
  const all = snapshot.days;
  const s = useMemo(() => sleepSummary(all), [all]);
  const [range, setRange] = useState<'7' | '30'>('7');
  const shown = useMemo(
    () => lastDays(all, range === '7' ? 7 : 30),
    [all, range],
  );
  const ready = analysis.readiness;
  const rhr = shown.map((d) => d.restingHr).filter((v): v is number => !!v);
  const hrv = shown.map((d) => d.hrvMs).filter((v): v is number => !!v);
  const avg = (xs: number[]) =>
    xs.length
      ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length)
      : undefined;

  return (
    <Screen scroll>
      <View className="flex-row items-start justify-between">
        <View>
          <Eyebrow>
            {isDemo
              ? 'Sample data'
              : connected
                ? `From ${healthProviderLabel}`
                : 'Not connected'}
          </Eyebrow>
          <Text className="mt-1 font-display text-[28px] uppercase tracking-wide text-bone">
            Sleep
          </Text>
        </View>
        {connected && !manualHealth ? (
          <Pressable
            onPress={() => void refresh()}
            hitSlop={12}
            accessibilityLabel="Sync health data"
            className="mt-1 h-10 w-10 items-center justify-center rounded-full bg-graphite-900"
          >
            <RefreshCw size={17} color={loading ? c.accent : c.muted} />
          </Pressable>
        ) : null}
      </View>

      {needsCheckin ? (
        <View className="mt-5">
          <MorningCheckin />
        </View>
      ) : !hasHealthData(snapshot) && healthSupported ? (
        <View className="mt-5">
          <ConnectHealthCard />
        </View>
      ) : null}

      {/* last night */}
      {s.lastNight !== undefined ? (
        <Card className="mt-5">
          <Eyebrow>
            {s.lastDate
              ? `Last night · ${shortDate(s.lastDate)}`
              : 'Last night'}
          </Eyebrow>
          <View className="mt-1 flex-row items-end">
            <Text
              className="font-display text-[46px] leading-[52px] text-bone"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {hm(s.lastNight)}
            </Text>
            {s.delta !== undefined && s.delta !== 0 ? (
              <Text
                className={`mb-2 ml-3 font-uiSemi text-[15px] ${s.delta > 0 ? 'text-mint' : 'text-gold'}`}
              >
                {s.delta > 0 ? '▲' : '▼'} {Math.round(Math.abs(s.delta) * 60)}{' '}
                min vs your week
              </Text>
            ) : null}
          </View>
          <View className="mt-2 flex-row">
            <View
              className={`rounded-full px-3 py-1 ${s.status === 'rested' ? 'bg-molten' : 'bg-graphite-800'}`}
            >
              <Text
                className="font-uiSemi text-[13px]"
                style={{ color: s.status === 'rested' ? '#000' : c.text }}
              >
                {STATUS[s.status]}
              </Text>
            </View>
          </View>

          <View className="mt-5">
            <Segmented
              value={range}
              onChange={setRange}
              options={[
                { value: '7', label: '7 days' },
                { value: '30', label: '30 days' },
              ]}
            />
          </View>
          <View className="mt-4">
            <BarChart
              data={shown.map((d) => ({
                label: weekday(d.date),
                value: d.sleepHours,
              }))}
              color={c.accent}
              target={7}
              height={130}
              edges={
                shown.length > 12
                  ? [shortDate(shown[0]!.date), shortDate(shown.at(-1)!.date)]
                  : undefined
              }
              format={(v) => hm(v)}
            />
          </View>
          <Text className="mt-2 font-ui text-[12px] text-steel">
            Dashed line = 7 hours, the minimum for good recovery.
          </Text>
        </Card>
      ) : null}

      {/* recommendation */}
      {s.status !== 'none' ? (
        <Card className="mt-3">
          <View className="flex-row items-center">
            <Sparkles size={15} color={c.accent} />
            <Text className="ml-2 font-uiSemi text-[12px] uppercase tracking-widest text-molten">
              Coach’s tip
            </Text>
          </View>
          <Text className="mt-2 font-uiSemi text-[18px] leading-6 text-bone">
            {s.tip.title}
          </Text>
          <Text className="mt-1 font-ui text-[15px] leading-[22px] text-steel">
            {coach?.explain?.recovery ?? s.tip.body}
          </Text>
        </Card>
      ) : null}

      {/* the week in numbers */}
      {s.nights ? (
        <View className="mt-3 flex-row gap-2">
          <Stat label="7-day average" value={hm(s.avg7)} />
          <Stat label="7 h+ nights" value={`${s.goodNights} of ${s.nights}`} />
          <Stat label="Readiness" value={ready ? String(ready.score) : '—'} />
        </View>
      ) : null}
      {!manualHealth && (rhr.length || hrv.length) ? (
        <View className="mt-2 flex-row gap-2">
          <Stat label="Resting HR" value={avg(rhr) ? `${avg(rhr)} bpm` : '—'} />
          <Stat label="HRV" value={avg(hrv) ? `${avg(hrv)} ms` : '—'} />
        </View>
      ) : null}

      <Text className="mb-6 mt-6 font-ui text-[12px] leading-[18px] text-steel">
        {snapshot.sources.length && !isDemo
          ? `Data from ${snapshot.sources.join(', ')}. `
          : ''}
        Not medical advice.
      </Text>
    </Screen>
  );
}
