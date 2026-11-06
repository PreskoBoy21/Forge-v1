import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Progress, Sparkline } from '@/components/charts';
import {
  Activity,
  Dumbbell,
  Flame,
  Footprints,
  Heart,
  Moon,
  Sparkles,
  Utensils,
  type LucideIcon,
} from '@/components/icons';
import { Screen } from '@/components/Screen';
import { Eyebrow, IconBadge, SectionHeader } from '@/components/ui';
import { useToday } from '@/features/food/store';
import { hasHealthData } from '@/features/health/store';
import { ConnectHealthCard } from '@/features/health/ui/ConnectHealthCard';
import { InsightCard } from '@/features/health/ui/InsightCard';
import { ReadinessRing } from '@/features/health/ui/ReadinessRing';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { useCoachRead } from '@/features/health/ui/useCoachRead';
import { vital, type Vital } from '@/features/health/vitals';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { kgLabel } from '@/features/train/program';
import { weekStreak } from '@/features/train/stats';
import { planToday, useTrain } from '@/features/train/store';
import { go } from '@/lib/nav';
import { useColors } from '@/theme/theme';

/**
 * Today = your body's data → the coach's call → the plan.
 * 1. Readiness + AI read of today   2. Vitals   3. Workout   4. Food
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

function VitalTile({
  v,
  Icon,
  color,
  label,
  format,
  better,
}: {
  v: Vital;
  Icon: LucideIcon;
  color: string;
  label: string;
  format: (n: number) => string;
  /** Which direction is good vs your baseline. */
  better: 'up' | 'down';
}) {
  const c = useColors();
  let delta = '';
  let tone = c.muted;
  if (v.latest !== undefined && v.baseline) {
    const d = v.latest - v.baseline;
    const pct = Math.round((d / v.baseline) * 100);
    if (Math.abs(pct) >= 3) {
      delta = `${pct > 0 ? '+' : ''}${pct}% vs usual`;
      tone = d > 0 === (better === 'up') ? c.good : c.warn;
    } else delta = 'Normal for you';
  }
  return (
    <Pressable
      onPress={() => go('/(tabs)/body')}
      className="flex-1 rounded-card border border-graphite-700/60 bg-graphite-900 p-3.5"
    >
      <View className="flex-row items-center justify-between">
        <IconBadge Icon={Icon} color={color} size={30} />
        <Sparkline values={v.week} color={color} width={58} height={22} />
      </View>
      <Text className="mt-3 font-uiMedium text-[12px] text-steel">{label}</Text>
      <Text
        className="mt-0.5 font-display text-[22px] text-bone"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {v.latest === undefined ? '—' : format(v.latest)}
      </Text>
      <Text
        className="mt-0.5 font-uiMedium text-[12px]"
        style={{ color: tone }}
        numberOfLines={1}
      >
        {v.latest === undefined ? 'No reading' : delta || ' '}
      </Text>
    </Pressable>
  );
}

export default function TodayScreen() {
  const c = useColors();
  const { snapshot, analysis, goal } = useAnalysis();
  const hasData = hasHealthData(snapshot);
  const ready = analysis.readiness;
  const { data: coach, isFetching } = useCoachRead(analysis, goal);
  const tips = analysis.insights
    .filter((i) => !i.id.startsWith('readiness'))
    .slice(0, 2);
  const food = useToday();
  const easy = ready?.training === 'easy';
  const history = useTrain((st) => st.history);
  const active = useTrain((st) => st.active);
  const trainingDays = useOnboardingDraft((st) => st.trainingDays);
  const plan = useMemo(() => planToday(history, easy), [history, easy]);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [weekAgo] = useState(() =>
    new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10),
  );
  const thisWeek = history.filter((w) => w.date >= weekAgo).length;
  const streak = weekStreak(history, today);
  const doneToday = history.some((w) => w.date === today);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const minutes = Math.round(
    plan.moves.reduce((t, mv) => t + mv.sets * (mv.restSec + 45), 0) / 60,
  );
  const days = snapshot.days;
  const vitals = useMemo(
    () => ({
      sleep: vital(days, 'sleepHours'),
      rhr: vital(days, 'restingHr'),
      hrv: vital(days, 'hrvMs'),
      steps: vital(days, 'steps'),
    }),
    [days],
  );

  return (
    <Screen scroll>
      {/* header */}
      <View className="flex-row items-start justify-between">
        <View>
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
        </View>
        <View className="flex-row items-center rounded-full bg-graphite-900 px-3 py-2">
          <Flame size={16} color={c.warn} />
          <Text className="ml-1 font-uiSemi text-[13px] text-bone">
            {thisWeek}/{trainingDays}
          </Text>
          {streak > 1 ? (
            <Text className="ml-1 font-ui text-[12px] text-steel">
              · {streak} wk
            </Text>
          ) : null}
        </View>
      </View>

      {/* 1 — readiness + the coach's call */}
      {ready ? (
        <Card className="mt-5">
          <View className="flex-row items-center">
            <ReadinessRing r={ready} size={116} />
            <View className="ml-4 flex-1">
              <Eyebrow>Readiness</Eyebrow>
              <Text className="mt-1 font-uiSemi text-[18px] text-bone">
                {LEVEL[ready.level]}
              </Text>
              <Text className="mt-1 font-ui text-[14px] leading-[20px] text-steel">
                {coach?.headline ??
                  [
                    ready.sleepHours !== undefined
                      ? `Slept ${ready.sleepHours} h`
                      : null,
                    ready.hrvVsBaselinePct !== undefined
                      ? `HRV ${ready.hrvVsBaselinePct > 0 ? '+' : ''}${ready.hrvVsBaselinePct}% vs usual`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
              </Text>
            </View>
          </View>
          <View className="mt-4 flex-row rounded-2xl bg-graphite-800 p-3">
            <Sparkles size={16} color={c.accent} />
            <View className="ml-2 flex-1">
              <Text className="font-uiSemi text-[12px] uppercase tracking-widest text-molten">
                Coach · today
              </Text>
              <Text className="mt-1 font-ui text-[14px] leading-[20px] text-bone">
                {coach?.today ??
                  (isFetching ? 'Reading your data…' : CALL[ready.training])}
              </Text>
            </View>
          </View>
        </Card>
      ) : (
        <View className="mt-5">
          <ConnectHealthCard />
        </View>
      )}

      {/* 2 — vitals */}
      {hasData ? (
        <>
          <SectionHeader
            title="Your body today"
            action="Details"
            onPress={() => go('/(tabs)/body')}
          />
          <View className="gap-3">
            <View className="flex-row gap-3">
              <VitalTile
                v={vitals.sleep}
                Icon={Moon}
                color={c.violet}
                label="Sleep"
                format={(n) => `${n.toFixed(1)} h`}
                better="up"
              />
              <VitalTile
                v={vitals.rhr}
                Icon={Heart}
                color={c.bad}
                label="Resting HR"
                format={(n) => `${Math.round(n)} bpm`}
                better="down"
              />
            </View>
            <View className="flex-row gap-3">
              <VitalTile
                v={vitals.hrv}
                Icon={Activity}
                color={c.aqua}
                label="HRV"
                format={(n) => `${Math.round(n)} ms`}
                better="up"
              />
              <VitalTile
                v={vitals.steps}
                Icon={Footprints}
                color={c.info}
                label="Steps"
                format={(n) => Math.round(n).toLocaleString('en-GB')}
                better="up"
              />
            </View>
          </View>
        </>
      ) : null}

      {/* 3 — the workout */}
      <SectionHeader
        title="Today’s workout"
        action="Plan"
        onPress={() => go('/(tabs)/train')}
      />
      <Card molten>
        <View className="flex-row items-center">
          <IconBadge Icon={Dumbbell} color={c.accent} size={40} />
          <View className="ml-3 flex-1">
            <Text className="font-display text-[24px] uppercase leading-7 text-bone">
              {active ? active.dayName : plan.name}
            </Text>
            <Text className="font-ui text-[13px] text-steel">
              ~{minutes} min · {plan.moves.length} moves
              {easy ? ' · easy day' : ''}
            </Text>
          </View>
        </View>
        <View className="mt-4 gap-2">
          {plan.moves.slice(0, 3).map((mv) => (
            <View key={mv.name} className="flex-row justify-between">
              <Text className="flex-1 font-ui text-[15px] text-bone">
                {mv.name}
                <Text className="text-steel">
                  {' '}
                  {mv.sets}×{mv.repMax}
                </Text>
              </Text>
              <Text
                className={`font-uiSemi text-[15px] ${mv.reason === 'increase' ? 'text-mint' : 'text-bone'}`}
              >
                {kgLabel(mv.targetKg)}
                {mv.reason === 'increase' ? ' ↑' : ''}
              </Text>
            </View>
          ))}
          {plan.moves.length > 3 ? (
            <Text className="font-ui text-[13px] text-steel">
              + {plan.moves.length - 3} more
            </Text>
          ) : null}
        </View>
        <View className="mt-4">
          <Button
            label={
              active
                ? 'Resume workout'
                : doneToday
                  ? 'Train again'
                  : 'Start Gym Mode'
            }
            onPress={() => {
              if (!active) useTrain.getState().start(easy);
              go('/(tabs)/train/gym');
            }}
          />
        </View>
      </Card>

      {/* 4 — food */}
      <SectionHeader
        title="Fuel"
        action="Log food"
        onPress={() => go('/(tabs)/snap')}
      />
      <Card>
        <View className="flex-row items-center">
          <IconBadge Icon={Utensils} color={c.warn} />
          <Text className="ml-3 flex-1 font-uiSemi text-[15px] text-bone">
            {food.meals.length
              ? `${food.meals.length} ${food.meals.length === 1 ? 'meal' : 'meals'} logged`
              : 'Nothing logged yet'}
          </Text>
        </View>
        <View className="mt-4 gap-3">
          <View>
            <View className="mb-1.5 flex-row justify-between">
              <Text className="font-uiMedium text-[13px] text-steel">
                Protein
              </Text>
              <Text className="font-uiSemi text-[13px] text-bone">
                {food.eaten.protein} / {food.targets.proteinG} g
              </Text>
            </View>
            <Progress
              value={food.eaten.protein}
              max={food.targets.proteinG}
              color={c.accent}
            />
          </View>
          <View>
            <View className="mb-1.5 flex-row justify-between">
              <Text className="font-uiMedium text-[13px] text-steel">
                Calories
              </Text>
              <Text className="font-uiSemi text-[13px] text-bone">
                {food.eaten.kcal} / {food.targets.kcal} kcal
              </Text>
            </View>
            <Progress
              value={food.eaten.kcal}
              max={food.targets.kcal}
              color={c.aqua}
            />
          </View>
        </View>
      </Card>

      {/* 5 — coach tips from the data */}
      {tips.length ? (
        <>
          <SectionHeader title="Coach tips" />
          <View className="gap-3">
            {tips.map((t) => (
              <Pressable key={t.id} onPress={() => go('/(tabs)/body')}>
                <InsightCard insight={t} />
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      <View className="h-4" />
    </Screen>
  );
}
