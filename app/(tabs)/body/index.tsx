import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { CheckinCard } from '@/features/food/CheckinCard';
import { InsightCard } from '@/features/health/ui/InsightCard';
import { ReadinessRing } from '@/features/health/ui/ReadinessRing';
import { TrendChart } from '@/features/health/ui/TrendChart';
import { useCoachRead } from '@/features/health/ui/useCoachRead';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { healthProviderLabel, useHealth } from '@/features/health/store';

const fmt = (n: number | undefined, unit = '', d = 1) =>
  n === undefined ? '—' : `${n.toFixed(d)}${unit}`;
const signed = (n: number, unit: string) =>
  `${n > 0 ? '+' : n < 0 ? '−' : '±'}${Math.abs(n).toFixed(1)}${unit}`;

function Stat({
  label,
  value,
  sub,
  subTone = 'muted',
}: {
  label: string;
  value: string;
  sub?: string;
  subTone?: 'good' | 'bad' | 'muted';
}) {
  const tone =
    subTone === 'good'
      ? 'text-mint'
      : subTone === 'bad'
        ? 'text-rose'
        : 'text-steel';
  return (
    <View className="flex-1 rounded-card bg-graphite-900 p-4">
      <Text className="font-uiMedium text-[11px] uppercase tracking-widest text-steel">
        {label}
      </Text>
      <Text
        className="mt-2 font-display text-[24px] text-bone"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {value}
      </Text>
      {sub ? (
        <Text className={`mt-1 font-uiMedium text-[13px] ${tone}`}>{sub}</Text>
      ) : null}
    </View>
  );
}

export default function BodyScreen() {
  const { snapshot, analysis, goal } = useAnalysis();
  const { connected, loading, connect, refresh, permission } = useHealth();
  const { weight, composition, readiness, activity, insights } = analysis;
  const isDemo = snapshot.provider === 'demo';
  const { data: coachRead } = useCoachRead(analysis, goal);

  return (
    <Screen scroll>
      <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        {isDemo ? 'Sample data' : `Synced from ${healthProviderLabel}`}
      </Text>
      <Text className="mt-1 font-display text-[34px] uppercase tracking-wide text-bone">
        Your body
      </Text>

      {!connected ? (
        <View className="mt-4 rounded-card border border-molten/40 bg-graphite-900 p-4">
          <Text className="font-uiSemi text-[17px] text-bone">
            Connect your scale and watch
          </Text>
          <Text className="mt-1 font-ui text-[15px] leading-[21px] text-steel">
            Forge reads weight, body fat, sleep and heart data from{' '}
            {healthProviderLabel === 'Sample data'
              ? 'Apple Health or Health Connect'
              : healthProviderLabel}{' '}
            and turns it into today’s plan.
          </Text>
          <View className="mt-4">
            <Button
              label={
                loading
                  ? 'Connecting…'
                  : `Connect ${healthProviderLabel === 'Sample data' ? 'health data' : healthProviderLabel}`
              }
              disabled={loading}
              onPress={() => void connect()}
            />
          </View>
          {permission === 'unavailable' ? (
            <Text className="mt-3 font-ui text-[13px] text-gold">
              Health data isn’t available on this device. Showing sample data.
            </Text>
          ) : null}
        </View>
      ) : null}

      {readiness ? (
        <View className="mt-5 flex-row items-center rounded-card bg-graphite-900 p-4">
          <ReadinessRing r={readiness} />
          <View className="ml-4 flex-1 gap-2">
            <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
              Readiness today
            </Text>
            <Text className="font-ui text-[15px] text-bone">
              Sleep {fmt(readiness.sleepHours, ' h')}
            </Text>
            <Text className="font-ui text-[15px] text-bone">
              HRV{' '}
              {readiness.hrvVsBaselinePct === undefined
                ? '—'
                : `${readiness.hrvVsBaselinePct > 0 ? '+' : ''}${readiness.hrvVsBaselinePct}% vs normal`}
            </Text>
            <Text className="font-ui text-[15px] text-bone">
              Resting HR{' '}
              {readiness.rhrVsBaselineBpm === undefined
                ? '—'
                : `${signed(readiness.rhrVsBaselineBpm, ' bpm')}`}
            </Text>
          </View>
        </View>
      ) : null}

      {!isDemo ? <CheckinCard days={snapshot.days} /> : null}

      <Text className="mt-7 font-uiMedium text-[12px] uppercase tracking-widest text-molten">
        Coach’s read
      </Text>
      {coachRead ? (
        <View className="mt-3 rounded-card border border-molten/40 bg-graphite-900 p-4">
          <Text className="font-uiSemi text-[17px] text-bone">
            {coachRead.headline}
          </Text>
          <Text className="mt-1 font-ui text-[15px] leading-[21px] text-steel">
            {coachRead.summary}
          </Text>
          <Text className="mt-2 font-uiMedium text-[13px] text-molten">
            → {coachRead.today}
          </Text>
        </View>
      ) : null}
      <View className="mt-3 gap-3">
        {insights.length ? (
          insights
            .slice(0, 4)
            .map((i) => <InsightCard key={i.id} insight={i} />)
        ) : (
          <Text className="font-ui text-[15px] text-steel">
            Not enough data yet. Weigh in and wear your watch for a few days.
          </Text>
        )}
      </View>

      <View className="mt-7 rounded-card bg-graphite-900 p-4">
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
              Weight trend
            </Text>
            <Text
              className="mt-1 font-display text-[34px] text-bone"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {fmt(weight?.currentTrendKg, ' kg')}
            </Text>
          </View>
          {weight ? (
            <Text
              className={`mb-2 font-uiSemi text-[15px] ${
                (
                  goal === 'build_muscle'
                    ? weight.weeklyChangeKg >= 0
                    : weight.weeklyChangeKg <= 0
                )
                  ? 'text-mint'
                  : 'text-gold'
              }`}
            >
              {signed(weight.weeklyChangeKg, ' kg')} / week
            </Text>
          ) : null}
        </View>
        <Text className="mt-1 font-ui text-[13px] text-steel">
          The line ignores daily water swings. Dots are your weigh-ins.
        </Text>
        <View className="mt-4">
          <TrendChart days={snapshot.days} />
        </View>
      </View>

      {composition ? (
        <>
          <Text className="mt-7 font-uiMedium text-[12px] uppercase tracking-widest text-steel">
            Body composition · last {composition.windowDays} days
          </Text>
          <View className="mt-3 flex-row gap-3">
            <Stat
              label="Body fat"
              value={fmt(composition.bodyFatPct, '%')}
              sub={signed(composition.fatChangeKg, ' kg fat')}
              subTone={composition.fatChangeKg <= 0 ? 'good' : 'bad'}
            />
            <Stat
              label="Lean mass"
              value={fmt(composition.leanMassKg, ' kg')}
              sub={signed(composition.leanChangeKg, ' kg')}
              subTone={composition.leanChangeKg >= -0.2 ? 'good' : 'bad'}
            />
          </View>
        </>
      ) : null}

      {activity ? (
        <View className="mt-3 flex-row gap-3">
          <Stat
            label="Steps / day"
            value={
              activity.avgSteps7d === undefined
                ? '—'
                : activity.avgSteps7d.toLocaleString('en')
            }
            sub={
              activity.stepsChangePct === undefined
                ? '7-day average'
                : `${activity.stepsChangePct > 0 ? '+' : ''}${activity.stepsChangePct}% vs usual`
            }
          />
          <Stat
            label="Sleep"
            value={fmt(activity.avgSleep7d, ' h')}
            sub="7-day average"
          />
        </View>
      ) : null}

      <View className="mt-7 rounded-card border border-graphite-700 p-4">
        <Text className="font-uiSemi text-[15px] text-bone">
          Where this comes from
        </Text>
        <Text className="mt-1 font-ui text-[13px] leading-[19px] text-steel">
          {snapshot.sources.length
            ? snapshot.sources.join(' · ')
            : 'No sources yet'}
        </Text>
        <Text className="mt-3 font-ui text-[13px] leading-[19px] text-steel">
          Works with any smart scale that syncs to Apple Health or Health
          Connect: Withings, RENPHO, Eufy, Wyze, Etekcity, Garmin Index and
          more. Body fat from scales is an estimate, so Forge watches the trend,
          not single readings.
        </Text>
        {connected ? (
          <Pressable className="mt-3" onPress={() => void refresh()}>
            <Text className="font-uiMedium text-[13px] text-molten">
              {loading ? 'Syncing…' : 'Sync now'}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <Text className="mt-6 font-ui text-[12px] text-steel">
        Not medical advice. Talk to a doctor about health conditions.
      </Text>
    </Screen>
  );
}
