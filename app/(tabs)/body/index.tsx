import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { BarChart, LineChart } from '@/components/charts';
import { Brain, RefreshCw, Sparkles } from '@/components/icons';
import { Screen } from '@/components/Screen';
import { Eyebrow, Explain, Segmented } from '@/components/ui';
import { CheckinCard } from '@/features/food/CheckinCard';
import { dailyIntake } from '@/features/food/nutrition';
import { useFood, useTargets } from '@/features/food/store';
import { weightTrend } from '@/features/health/insights';
import {
  hasHealthData,
  healthProviderLabel,
  healthSupported,
  useHealth,
} from '@/features/health/store';
import { ConnectHealthCard } from '@/features/health/ui/ConnectHealthCard';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { useCoachRead } from '@/features/health/ui/useCoachRead';
import { lastDays, shortDate } from '@/features/health/vitals';
import { useColors } from '@/theme/theme';

/**
 * Body = the AI's read on top, then ONE area at a time:
 * Recovery · Weight · Activity · Food. Each area is one number, one graph
 * and one plain-language explanation.
 */
type Area = 'recovery' | 'weight' | 'activity' | 'food';

const fmt = (n: number | undefined, unit = '', d = 1) =>
  n === undefined ? '—' : `${n.toFixed(d)}${unit}`;
const signed = (n: number, unit: string, d = 1) =>
  `${n > 0 ? '+' : n < 0 ? '−' : '±'}${Math.abs(n).toFixed(d)}${unit}`;
const avg = (xs: (number | undefined)[]) => {
  const v = xs.filter((x): x is number => x !== undefined);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : undefined;
};
const weekday = (d: string) =>
  new Date(`${d}T12:00:00Z`)
    .toLocaleDateString('en-GB', { weekday: 'short' })
    .slice(0, 2);

function Big({
  value,
  label,
  note,
  tone,
}: {
  value: string;
  label: string;
  note?: string;
  tone?: 'good' | 'warn';
}) {
  return (
    <View>
      <Text
        className="font-display text-[32px] text-bone"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {value}
      </Text>
      <Text className="font-ui text-[13px] text-steel">
        {label}
        {note ? (
          <Text className={tone === 'warn' ? 'text-gold' : 'text-mint'}>
            {'  '}
            {note}
          </Text>
        ) : null}
      </Text>
    </View>
  );
}

function Small({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-2xl bg-graphite-800 px-3 py-2.5">
      <Text className="font-ui text-[12px] text-steel">{label}</Text>
      <Text className="font-uiSemi text-[16px] text-bone">{value}</Text>
    </View>
  );
}

export default function BodyScreen() {
  const c = useColors();
  const { snapshot, analysis, goal } = useAnalysis();
  const { connected, loading, refresh } = useHealth();
  const { weight, composition, readiness, insights } = analysis;
  const isDemo = snapshot.provider === 'demo';
  const hasData = hasHealthData(snapshot);
  const { data: coach, isFetching } = useCoachRead(analysis, goal);
  const ex = coach?.explain ?? {};
  // Without AI, the top card already shows insights[0]; don't repeat it below.
  const headlineId = coach ? null : insights[0]?.id;
  const insightFor = (ids: string[]) =>
    insights.find((i) => ids.includes(i.id) && i.id !== headlineId)?.body;

  const all = snapshot.days;
  const d14 = useMemo(() => lastDays(all, 14), [all]);
  const d42 = useMemo(() => lastDays(all, 42), [all]);
  const trend = useMemo(() => {
    const byDate = new Map(weightTrend(all).map((t) => [t.date, t.trend]));
    return d42.map((d) => byDate.get(d.date));
  }, [all, d42]);
  const meals = useFood((s) => s.meals);
  const targets = useTargets();
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const intake = useMemo(() => dailyIntake(meals, today, 7), [meals, today]);
  const logged = intake.filter((d) => d.kcal > 0);

  const has = (k: 'sleepHours' | 'restingHr' | 'weightKg' | 'steps') =>
    all.some((d) => d[k] !== undefined);
  const areas = (
    [
      {
        value: 'recovery',
        label: 'Recovery',
        on: has('sleepHours') || has('restingHr'),
      },
      { value: 'weight', label: 'Weight', on: has('weightKg') },
      { value: 'activity', label: 'Activity', on: has('steps') },
      { value: 'food', label: 'Food', on: logged.length > 0 },
    ] as const
  ).filter((a) => a.on);
  const [picked, setPicked] = useState<Area | null>(null);
  const area: Area | undefined =
    picked && areas.some((a) => a.value === picked) ? picked : areas[0]?.value;
  const r14 = (k: 'sleepHours' | 'restingHr' | 'hrvMs' | 'steps') =>
    avg(d14.map((d) => d[k]));
  const label14: [string, string] | undefined = d14.length
    ? [shortDate(d14[0]!.date), shortDate(d14.at(-1)!.date)]
    : undefined;
  const label42: [string, string] | undefined = d42.length
    ? [shortDate(d42[0]!.date), shortDate(d42.at(-1)!.date)]
    : undefined;
  const goodWeight =
    weight &&
    (goal === 'build_muscle'
      ? weight.weeklyChangeKg >= 0
      : weight.weeklyChangeKg <= 0);

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
            Your body
          </Text>
        </View>
        {connected ? (
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

      {!hasData && healthSupported ? (
        <View className="mt-5">
          <ConnectHealthCard />
        </View>
      ) : null}

      {/* the AI's read of everything */}
      {areas.length ? (
        <Card className="mt-5">
          <View className="flex-row items-center">
            <Sparkles size={16} color={c.accent} />
            <Text className="ml-2 font-uiSemi text-[12px] uppercase tracking-widest text-molten">
              Coach’s analysis
            </Text>
          </View>
          <Text className="mt-2 font-uiSemi text-[18px] leading-6 text-bone">
            {coach?.headline ??
              (isFetching
                ? 'Reading your data…'
                : (insights[0]?.title ?? 'Keep logging'))}
          </Text>
          <Text className="mt-1 font-ui text-[15px] leading-[22px] text-steel">
            {coach?.summary ??
              (isFetching
                ? ''
                : (insights[0]?.body ??
                  'The more days of data, the sharper the analysis.'))}
          </Text>
        </Card>
      ) : null}

      {/* one area at a time */}
      {area ? (
        <>
          <View className="mt-6">
            <Segmented
              value={area}
              onChange={setPicked}
              options={areas.map((a) => ({ value: a.value, label: a.label }))}
            />
          </View>

          <Card className="mt-3">
            {area === 'recovery' ? (
              <>
                <Big
                  value={fmt(r14('sleepHours'), ' h')}
                  label="Average sleep · 14 days"
                  note={
                    (r14('sleepHours') ?? 8) < 7
                      ? 'below the 7 h goal'
                      : undefined
                  }
                  tone="warn"
                />
                <View className="mt-4">
                  <BarChart
                    data={d14.map((d) => ({
                      label: weekday(d.date),
                      value: d.sleepHours,
                    }))}
                    color={c.violet}
                    target={7}
                    edges={label14}
                    height={110}
                    format={(v) => `${v.toFixed(1)} h`}
                  />
                </View>
                <View className="mt-4 flex-row gap-2">
                  <Small
                    label="Readiness"
                    value={readiness ? String(readiness.score) : '—'}
                  />
                  <Small
                    label="Resting HR"
                    value={fmt(r14('restingHr'), ' bpm', 0)}
                  />
                  <Small label="HRV" value={fmt(r14('hrvMs'), ' ms', 0)} />
                </View>
                <Explain
                  Icon={Brain}
                  text={
                    ex.recovery ??
                    insightFor([
                      'readiness_low',
                      'readiness_high',
                      'short_sleep',
                    ])
                  }
                />
              </>
            ) : null}

            {area === 'weight' ? (
              <>
                <Big
                  value={fmt(weight?.currentTrendKg, ' kg')}
                  label="Trend weight"
                  note={
                    weight
                      ? `${signed(weight.weeklyChangeKg, ' kg', 2)} / week`
                      : undefined
                  }
                  tone={goodWeight ? 'good' : 'warn'}
                />
                <View className="mt-4">
                  <LineChart
                    series={[
                      {
                        values: d42.map((d) => d.weightKg),
                        color: c.muted,
                        dots: true,
                      },
                      { values: trend, color: c.accent, area: true },
                    ]}
                    labels={label42}
                    unit=" kg"
                  />
                </View>
                {composition ? (
                  <View className="mt-4 flex-row gap-2">
                    <Small
                      label="Body fat"
                      value={`${fmt(composition.bodyFatPct, '%')} (${signed(composition.fatChangeKg, ' kg')})`}
                    />
                    <Small
                      label="Lean mass"
                      value={`${fmt(composition.leanMassKg, ' kg')} (${signed(composition.leanChangeKg, ' kg')})`}
                    />
                  </View>
                ) : null}
                <Explain
                  Icon={Brain}
                  text={
                    ex.weight ??
                    insightFor([
                      'loss_too_fast',
                      'loss_stalled',
                      'loss_on_track',
                      'gain_too_fast',
                    ])
                  }
                />
                {composition ? (
                  <Explain
                    Icon={Brain}
                    text={ex.body ?? insightFor(['lean_loss', 'recomp_win'])}
                  />
                ) : null}
              </>
            ) : null}

            {area === 'activity' ? (
              <>
                <Big
                  value={
                    r14('steps') === undefined
                      ? '—'
                      : Math.round(r14('steps')!).toLocaleString('en-GB')
                  }
                  label="Steps per day · 14 days"
                />
                <View className="mt-4">
                  <BarChart
                    data={d14.map((d) => ({
                      label: weekday(d.date),
                      value: d.steps,
                    }))}
                    color={c.info}
                    target={8000}
                    edges={label14}
                    height={110}
                    format={(v) => Math.round(v).toLocaleString('en-GB')}
                  />
                </View>
                <Explain
                  Icon={Brain}
                  text={ex.activity ?? insightFor(['steps_drop'])}
                />
              </>
            ) : null}

            {area === 'food' ? (
              <>
                <Big
                  value={`${Math.round(avg(logged.map((d) => d.protein)) ?? 0)} g`}
                  label={`Average protein · goal ${targets.proteinG} g`}
                />
                <View className="mt-4">
                  <BarChart
                    data={intake.map((d) => ({
                      label: weekday(d.date),
                      value: d.protein || undefined,
                    }))}
                    color={c.accent}
                    target={targets.proteinG}
                    height={110}
                  />
                </View>
                <View className="mt-4 flex-row gap-2">
                  <Small
                    label="Avg calories"
                    value={`${Math.round(avg(logged.map((d) => d.kcal)) ?? 0)} / ${targets.kcal}`}
                  />
                  <Small label="Days logged" value={`${logged.length} of 7`} />
                </View>
                <Explain Icon={Brain} text={ex.nutrition} />
              </>
            ) : null}
          </Card>

          {area === 'weight' && !isDemo ? <CheckinCard days={all} /> : null}
        </>
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
