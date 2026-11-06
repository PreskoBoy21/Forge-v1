import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { BarChart, LineChart } from '@/components/charts';
import {
  Activity,
  Brain,
  Footprints,
  Moon,
  RefreshCw,
  Scale,
  Sparkles,
  Utensils,
} from '@/components/icons';
import { Screen } from '@/components/Screen';
import {
  Eyebrow,
  Explain,
  IconBadge,
  Pill,
  SectionHeader,
} from '@/components/ui';
import { CheckinCard } from '@/features/food/CheckinCard';
import { dailyIntake } from '@/features/food/nutrition';
import { useFood, useTargets } from '@/features/food/store';
import {
  hasHealthData,
  healthProviderLabel,
  healthSupported,
  useHealth,
} from '@/features/health/store';
import { weightTrend } from '@/features/health/insights';
import { ConnectHealthCard } from '@/features/health/ui/ConnectHealthCard';
import { InsightCard } from '@/features/health/ui/InsightCard';
import { ReadinessRing } from '@/features/health/ui/ReadinessRing';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { useCoachRead } from '@/features/health/ui/useCoachRead';
import { lastDays, shortDate } from '@/features/health/vitals';
import { useColors } from '@/theme/theme';

const fmt = (n: number | undefined, unit = '', d = 1) =>
  n === undefined ? '—' : `${n.toFixed(d)}${unit}`;
const signed = (n: number, unit: string, d = 1) =>
  `${n > 0 ? '+' : n < 0 ? '−' : '±'}${Math.abs(n).toFixed(d)}${unit}`;
const avg = (xs: (number | undefined)[]) => {
  const v = xs.filter((x): x is number => x !== undefined);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : undefined;
};

const barLabel = (d: string) =>
  new Date(`${d}T12:00:00Z`)
    .toLocaleDateString('en-GB', { weekday: 'short' })
    .slice(0, 2);

const RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '6W', days: 42 },
] as const;

function Metric({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'good' | 'warn';
}) {
  return (
    <View className="flex-1">
      <Text className="font-uiMedium text-[12px] text-steel">{label}</Text>
      <Text
        className="mt-0.5 font-display text-[22px] text-bone"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {value}
      </Text>
      {sub ? (
        <Text
          className={`font-uiMedium text-[12px] ${tone === 'good' ? 'text-mint' : tone === 'warn' ? 'text-gold' : 'text-steel'}`}
        >
          {sub}
        </Text>
      ) : null}
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
  const [range, setRange] = useState<number>(30);
  const days = useMemo(
    () => lastDays(snapshot.days, range),
    [snapshot.days, range],
  );
  const labels: [string, string] | undefined = days.length
    ? [shortDate(days[0]!.date), shortDate(days.at(-1)!.date)]
    : undefined;
  const trend = useMemo(() => {
    const full = weightTrend(snapshot.days);
    const byDate = new Map(full.map((t) => [t.date, t.trend]));
    return days.map((d) => byDate.get(d.date));
  }, [snapshot.days, days]);
  const meals = useFood((s) => s.meals);
  const targets = useTargets();
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const intake = useMemo(() => dailyIntake(meals, today, 7), [meals, today]);
  const loggedDays = intake.filter((d) => d.kcal > 0);
  const insightFor = (ids: string[]) =>
    insights.find((i) => ids.includes(i.id))?.body;

  const has = (k: keyof (typeof days)[number]) =>
    days.some((d) => d[k] !== undefined);
  const sleepAvg = avg(days.map((d) => d.sleepHours));
  const rhrAvg = avg(days.map((d) => d.restingHr));
  const hrvAvg = avg(days.map((d) => d.hrvMs));
  const stepsAvg = avg(days.map((d) => d.steps));
  const fatSeries = days.map((d) => d.bodyFatPct);

  return (
    <Screen scroll>
      <View className="flex-row items-start justify-between">
        <View>
          <Eyebrow>
            {isDemo
              ? 'Sample data'
              : connected
                ? `Synced from ${healthProviderLabel}`
                : 'Not connected'}
          </Eyebrow>
          <Text className="mt-1 font-display text-[28px] uppercase tracking-wide text-bone">
            Your body
          </Text>
        </View>
        {connected ? (
          <Pressable
            onPress={() => void refresh()}
            hitSlop={10}
            className="mt-1 flex-row items-center rounded-full bg-graphite-900 px-3 py-2"
          >
            <RefreshCw size={15} color={c.muted} />
            <Text className="ml-1.5 font-uiMedium text-[13px] text-steel">
              {loading ? 'Syncing…' : 'Sync'}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {!hasData && healthSupported ? (
        <View className="mt-5">
          <ConnectHealthCard />
        </View>
      ) : null}

      {/* AI analysis */}
      {hasData || loggedDays.length ? (
        <Card molten className="mt-5">
          <View className="flex-row items-center">
            <Sparkles size={18} color={c.accent} />
            <Text className="ml-2 font-uiSemi text-[12px] uppercase tracking-widest text-molten">
              Coach’s analysis
            </Text>
          </View>
          {coach ? (
            <>
              <Text className="mt-2 font-uiSemi text-[18px] text-bone">
                {coach.headline}
              </Text>
              <Text className="mt-1 font-ui text-[15px] leading-[22px] text-steel">
                {coach.summary}
              </Text>
              <Text className="mt-3 font-uiSemi text-[14px] text-molten">
                → {coach.today}
              </Text>
            </>
          ) : (
            <Text className="mt-2 font-ui text-[15px] leading-[22px] text-steel">
              {isFetching
                ? 'Your coach is reading your data…'
                : insights[0]
                  ? `${insights[0].title}. ${insights[0].body}`
                  : 'Keep logging. The more days of data, the sharper the analysis.'}
            </Text>
          )}
        </Card>
      ) : null}

      {hasData ? (
        <View className="mt-5 flex-row gap-2">
          {RANGES.map((r) => (
            <Pill
              key={r.label}
              label={r.label}
              active={range === r.days}
              onPress={() => setRange(r.days)}
            />
          ))}
        </View>
      ) : null}

      {/* recovery */}
      {readiness || has('sleepHours') || has('restingHr') ? (
        <>
          <SectionHeader title="Recovery" />
          <Card>
            {readiness ? (
              <View className="mb-4 flex-row items-center">
                <ReadinessRing r={readiness} size={92} />
                <View className="ml-4 flex-1 gap-1">
                  <Text className="font-ui text-[14px] text-bone">
                    Sleep last night{' '}
                    <Text className="font-uiSemi">
                      {fmt(readiness.sleepHours, ' h')}
                    </Text>
                  </Text>
                  <Text className="font-ui text-[14px] text-bone">
                    HRV{' '}
                    <Text className="font-uiSemi">
                      {readiness.hrvVsBaselinePct === undefined
                        ? '—'
                        : `${readiness.hrvVsBaselinePct > 0 ? '+' : ''}${readiness.hrvVsBaselinePct}% vs usual`}
                    </Text>
                  </Text>
                  <Text className="font-ui text-[14px] text-bone">
                    Resting HR{' '}
                    <Text className="font-uiSemi">
                      {readiness.rhrVsBaselineBpm === undefined
                        ? '—'
                        : signed(readiness.rhrVsBaselineBpm, ' bpm')}
                    </Text>
                  </Text>
                </View>
              </View>
            ) : null}
            {has('sleepHours') ? (
              <>
                <View className="flex-row items-center">
                  <IconBadge Icon={Moon} color={c.violet} size={28} />
                  <Text className="ml-2 flex-1 font-uiSemi text-[15px] text-bone">
                    Sleep
                  </Text>
                  <Text className="font-ui text-[13px] text-steel">
                    avg {fmt(sleepAvg, ' h')} · goal 7 h+
                  </Text>
                </View>
                <View className="mt-3">
                  <BarChart
                    data={days.map((d) => ({
                      label: barLabel(d.date),
                      value: d.sleepHours,
                    }))}
                    color={c.violet}
                    edges={labels}
                    target={7}
                    height={100}
                    format={(v) => `${v.toFixed(1)} h`}
                  />
                </View>
              </>
            ) : null}
            {has('restingHr') || has('hrvMs') ? (
              <>
                <View className="mt-5 flex-row items-center">
                  <IconBadge Icon={Activity} color={c.aqua} size={28} />
                  <Text className="ml-2 flex-1 font-uiSemi text-[15px] text-bone">
                    Heart
                  </Text>
                  <Text className="font-ui text-[13px] text-steel">
                    RHR {fmt(rhrAvg, '', 0)} · HRV {fmt(hrvAvg, ' ms', 0)}
                  </Text>
                </View>
                <View className="mt-3 flex-row gap-4">
                  <View className="flex-1">
                    <Text className="mb-1 font-ui text-[12px] text-steel">
                      Resting HR (lower = better)
                    </Text>
                    <LineChart
                      series={[
                        {
                          values: days.map((d) => d.restingHr),
                          color: c.bad,
                        },
                      ]}
                      height={80}
                      decimals={0}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 font-ui text-[12px] text-steel">
                      HRV (higher = better)
                    </Text>
                    <LineChart
                      series={[
                        { values: days.map((d) => d.hrvMs), color: c.aqua },
                      ]}
                      height={80}
                      decimals={0}
                    />
                  </View>
                </View>
              </>
            ) : null}
            <Explain
              Icon={Brain}
              text={
                ex.recovery ??
                insightFor(['readiness_low', 'readiness_high', 'short_sleep'])
              }
            />
          </Card>
        </>
      ) : null}

      {/* weight */}
      {has('weightKg') ? (
        <>
          <SectionHeader title="Weight" />
          <Card>
            <View className="flex-row items-center">
              <IconBadge Icon={Scale} color={c.accent} size={28} />
              <Text className="ml-2 flex-1 font-uiSemi text-[15px] text-bone">
                Trend weight
              </Text>
            </View>
            <View className="mt-3 flex-row">
              <Metric
                label="Trend"
                value={fmt(weight?.currentTrendKg, ' kg')}
              />
              <Metric
                label="Per week"
                value={weight ? signed(weight.weeklyChangeKg, ' kg', 2) : '—'}
                sub={weight ? `${weight.weeklyChangePct}% of body weight` : ''}
                tone={
                  !weight
                    ? undefined
                    : (
                          goal === 'build_muscle'
                            ? weight.weeklyChangeKg >= 0
                            : weight.weeklyChangeKg <= 0
                        )
                      ? 'good'
                      : 'warn'
                }
              />
              <Metric
                label="Last weigh-in"
                value={fmt(weight?.latestScaleKg, ' kg')}
              />
            </View>
            <View className="mt-4">
              <LineChart
                series={[
                  {
                    values: days.map((d) => d.weightKg),
                    color: c.muted,
                    dots: true,
                  },
                  { values: trend, color: c.accent, area: true },
                ]}
                labels={labels}
                unit=" kg"
              />
            </View>
            <Text className="mt-2 font-ui text-[12px] text-steel">
              Line = trend (ignores daily water swings). Dots = weigh-ins.
            </Text>
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
          </Card>
          {!isDemo ? <CheckinCard days={snapshot.days} /> : null}
        </>
      ) : null}

      {/* composition */}
      {composition ? (
        <>
          <SectionHeader title="Body composition" />
          <Card>
            <View className="flex-row">
              <Metric
                label="Body fat"
                value={fmt(composition.bodyFatPct, '%')}
                sub={signed(composition.fatChangeKg, ' kg fat')}
                tone={composition.fatChangeKg <= 0 ? 'good' : 'warn'}
              />
              <Metric
                label="Lean mass"
                value={fmt(composition.leanMassKg, ' kg')}
                sub={signed(composition.leanChangeKg, ' kg lean')}
                tone={composition.leanChangeKg >= -0.2 ? 'good' : 'warn'}
              />
            </View>
            <Text className="mt-1 font-ui text-[12px] text-steel">
              Change over the last {composition.windowDays} days
            </Text>
            <View className="mt-4">
              <LineChart
                series={[{ values: fatSeries, color: c.warn, area: true }]}
                labels={labels}
                unit="%"
              />
            </View>
            <Explain
              Icon={Brain}
              text={ex.body ?? insightFor(['lean_loss', 'recomp_win'])}
            />
          </Card>
        </>
      ) : null}

      {/* activity */}
      {has('steps') ? (
        <>
          <SectionHeader title="Activity" />
          <Card>
            <View className="flex-row items-center">
              <IconBadge Icon={Footprints} color={c.info} size={28} />
              <Text className="ml-2 flex-1 font-uiSemi text-[15px] text-bone">
                Steps
              </Text>
              <Text className="font-ui text-[13px] text-steel">
                avg{' '}
                {stepsAvg === undefined
                  ? '—'
                  : Math.round(stepsAvg).toLocaleString('en-GB')}{' '}
                / day
              </Text>
            </View>
            <View className="mt-3">
              <BarChart
                data={days.map((d) => ({
                  label: barLabel(d.date),
                  value: d.steps,
                }))}
                color={c.info}
                edges={labels}
                target={8000}
                height={100}
                format={(v) => Math.round(v).toLocaleString('en-GB')}
              />
            </View>
            <Explain
              Icon={Brain}
              text={ex.activity ?? insightFor(['steps_drop'])}
            />
          </Card>
        </>
      ) : null}

      {/* nutrition from the food log */}
      {loggedDays.length ? (
        <>
          <SectionHeader title="Nutrition · 7 days" />
          <Card>
            <View className="flex-row items-center">
              <IconBadge Icon={Utensils} color={c.warn} size={28} />
              <Text className="ml-2 flex-1 font-uiSemi text-[15px] text-bone">
                Protein per day
              </Text>
              <Text className="font-ui text-[13px] text-steel">
                goal {targets.proteinG} g
              </Text>
            </View>
            <View className="mt-3">
              <BarChart
                data={intake.map((d) => ({
                  label: new Date(`${d.date}T12:00:00Z`)
                    .toLocaleDateString('en-GB', { weekday: 'short' })
                    .slice(0, 2),
                  value: d.protein || undefined,
                }))}
                color={c.accent}
                target={targets.proteinG}
                height={100}
              />
            </View>
            <View className="mt-4 flex-row">
              <Metric
                label="Avg protein"
                value={`${Math.round(avg(loggedDays.map((d) => d.protein)) ?? 0)} g`}
              />
              <Metric
                label="Avg calories"
                value={`${Math.round(avg(loggedDays.map((d) => d.kcal)) ?? 0)}`}
                sub={`target ${targets.kcal}`}
              />
              <Metric label="Days logged" value={`${loggedDays.length}/7`} />
            </View>
            <Explain Icon={Brain} text={ex.nutrition} />
          </Card>
        </>
      ) : null}

      {/* other insights */}
      {insights.length > 1 ? (
        <>
          <SectionHeader title="Coach notes" />
          <View className="gap-3">
            {insights.slice(0, 4).map((i) => (
              <InsightCard key={i.id} insight={i} />
            ))}
          </View>
        </>
      ) : null}

      <View className="mt-7 rounded-card border border-graphite-700/60 p-4">
        <Text className="font-uiSemi text-[15px] text-bone">
          Where this comes from
        </Text>
        <Text className="mt-1 font-ui text-[13px] leading-[19px] text-steel">
          {snapshot.sources.length
            ? snapshot.sources.join(' · ')
            : 'No sources yet'}
        </Text>
        <Text className="mt-3 font-ui text-[13px] leading-[19px] text-steel">
          Works with any watch or smart scale that syncs to Apple Health or
          Health Connect: Apple Watch, Garmin, Withings, RENPHO, Eufy and more.
          Scale body fat is an estimate, so Forge watches the trend.
        </Text>
      </View>

      <Text className="mb-6 mt-6 font-ui text-[12px] text-steel">
        Not medical advice. Talk to a doctor about health conditions.
      </Text>
    </Screen>
  );
}
