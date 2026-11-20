import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';

import { BodyMap } from '@/components/BodyMap';
import { Card } from '@/components/Card';
import { ExerciseDemo } from '@/components/ExerciseDemo';
import { BarChart, LineChart, Progress } from '@/components/charts';
import { InstallHint } from '@/components/InstallHint';
import { Screen } from '@/components/Screen';
import { Eyebrow } from '@/components/ui';
import { dailyIntake } from '@/features/food/nutrition';
import { useFood, useToday } from '@/features/food/store';
import { weightTrend } from '@/features/health/insights';
import { hm, sleepSummary } from '@/features/health/sleep';
import { ConnectHealthCard } from '@/features/health/ui/ConnectHealthCard';
import {
  MorningCheckin,
  useNeedsCheckin,
} from '@/features/health/ui/MorningCheckin';
import { ReadinessRing } from '@/features/health/ui/ReadinessRing';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { useCoachRead } from '@/features/health/ui/useCoachRead';
import { lastDays, shortDate } from '@/features/health/vitals';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { CoachSheet, SheetText } from '@/features/progress/CoachSheet';
import { clock, dayPlan, type PlanMeal } from '@/features/progress/dayPlan';
import { useWeekly } from '@/features/progress/useWeekly';
import { MUSCLE_LABEL, musclesForMany } from '@/features/train/muscles';
import { kgLabel } from '@/features/train/program';
import { planToday, useTrain } from '@/features/train/store';
import { useColors } from '@/theme/theme';

/**
 * Coach = pure analysis, no buttons that send you away.
 * 1. Today's verdict + readiness + what the coach looked at
 * 2. Today's focus (muscles)   3. Your day, planned (timeline)
 * 4. One thing to improve this week. Tap anything → "why" sheet.
 */
type Sheet = 'ready' | 'sleep' | 'protein' | 'weight' | 'focus' | 'improve';

const LEVEL = {
  high: 'Fully recovered.',
  normal: 'Recovered.',
  low: 'Under-recovered.',
} as const;

const weekday = (d: string) =>
  new Date(`${d}T12:00:00Z`)
    .toLocaleDateString('en-GB', { weekday: 'short' })
    .slice(0, 2);

/** Number that counts up when it first appears. */
function CountUp({
  to,
  className,
  suffix = '',
}: {
  to: number;
  className: string;
  suffix?: string;
}) {
  const [shown, setShown] = useState(0);
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const id = v.addListener(({ value }) => setShown(Math.round(value)));
    Animated.timing(v, {
      toValue: to,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    return () => v.removeListener(id);
  }, [to, v]);
  return (
    <Text className={className} style={{ fontVariant: ['tabular-nums'] }}>
      {shown}
      {suffix}
    </Text>
  );
}

function Chip({
  label,
  value,
  note,
  tone,
  onPress,
}: {
  label: string;
  value: string;
  note: string;
  tone: 'good' | 'warn' | 'accent';
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityHint="Shows why"
      className="flex-1 rounded-card border border-graphite-700/60 bg-graphite-900 p-3 active:opacity-80"
    >
      <Text className="font-uiSemi text-[11px] uppercase tracking-widest text-steel">
        {label}
      </Text>
      <Text
        className="mt-1 font-display text-[22px] text-bone"
        style={{ fontVariant: ['tabular-nums'] }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      <Text
        className={`mt-0.5 font-uiSemi text-[12px] ${tone === 'good' ? 'text-mint' : tone === 'warn' ? 'text-gold' : 'text-molten'}`}
        numberOfLines={1}
      >
        {note}
      </Text>
    </Pressable>
  );
}

export default function CoachScreen() {
  const c = useColors();
  const { snapshot, analysis, goal } = useAnalysis();
  const ready = analysis.readiness;
  const needsCheckin = useNeedsCheckin();
  const { data: coach } = useCoachRead(analysis, goal);
  const food = useToday();
  const meals = useFood((s) => s.meals);
  const history = useTrain((st) => st.history);
  const active = useTrain((st) => st.active);
  const overrides = useTrain((st) => st.overrides);
  const trainingDays = useOnboardingDraft((st) => st.trainingDays);
  const { verdict, stats } = useWeekly();
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [now] = useState(() => new Date());
  const today = now.toISOString().slice(0, 10);
  const nowMinute = now.getHours() * 60 + now.getMinutes();

  const easy = ready?.training === 'easy';
  const plan = useMemo(
    () => planToday(history, easy),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, easy, overrides],
  );
  const days = snapshot.days;
  const sleep = useMemo(() => sleepSummary(days), [days]);
  const weight = analysis.weight;

  // training this week → is today a training day?
  const weekAgo = new Date(now.getTime() - 6 * 864e5)
    .toISOString()
    .slice(0, 10);
  const doneToday = history.some((w) => w.date === today);
  const thisWeek = history.filter(
    (w) => w.date >= weekAgo && w.date < today,
  ).length;
  const restDay = !doneToday && !active && thisWeek >= trainingDays;
  const focus = useMemo(
    () => musclesForMany(plan.moves.map((m) => m.name)),
    [plan],
  );
  const lead = plan.moves.find((m) => m.reason === 'increase') ?? plan.moves[0];
  const minutes = Math.round(
    plan.moves.reduce((t, mv) => t + mv.sets * (mv.restSec + 45), 0) / 60,
  );
  const focusName = focus.primary
    .slice(0, 2)
    .map((m) => MUSCLE_LABEL[m].toLowerCase())
    .join(' & ');

  // protein: last 7 days
  const intake = useMemo(() => dailyIntake(meals, today, 8), [meals, today]);
  const yesterday = intake.at(-2);
  const proteinPct =
    yesterday && yesterday.kcal > 0
      ? Math.round(
          (yesterday.protein / Math.max(1, food.targets.proteinG)) * 100,
        )
      : undefined;
  const last7 = intake.slice(0, 7);
  const proteinDays = last7.filter(
    (d) => d.protein >= food.targets.proteinG * 0.9,
  ).length;
  const loggedDays = last7.filter((d) => d.kcal > 0).length;

  // the day, planned
  const items = useMemo(() => {
    const pm: PlanMeal[] = meals.map((m) => {
      const t = new Date(m.eatenAt);
      return {
        type: m.type,
        minute: t.getHours() * 60 + t.getMinutes(),
        date: m.date,
        protein: m.items.reduce((a, i) => a + (i.protein * i.grams) / 100, 0),
        kcal: m.items.reduce((a, i) => a + (i.kcal * i.grams) / 100, 0),
      };
    });
    return dayPlan({
      today,
      nowMinute,
      meals: pm,
      proteinTarget: food.targets.proteinG,
      kcalTarget: food.targets.kcal,
      avgSleepH: sleep.avg7,
      workout: restDay
        ? undefined
        : {
            name: active ? active.dayName : plan.name,
            minutes,
            done: doneToday,
            call: ready?.training ?? 'normal',
            lead: lead
              ? `${lead.name} ${kgLabel(lead.targetKg)}${lead.reason === 'increase' ? ' (up from last time)' : ''} · ${plan.moves.length} exercises`
              : undefined,
          },
    });
  }, [
    meals,
    today,
    nowMinute,
    food.targets,
    sleep.avg7,
    restDay,
    active,
    plan,
    minutes,
    doneToday,
    ready,
    lead,
  ]);

  // the one thing to improve this week
  const improve =
    loggedDays >= 3 && proteinDays < 5
      ? {
          title: `Hit protein 5 of 7 days`,
          done: proteinDays,
          goal: 5,
          why: `You reached your ${food.targets.proteinG} g protein on ${proteinDays} of the last 7 days. Protein is what keeps (and builds) muscle, especially while losing fat.`,
        }
      : sleep.nights >= 3 && sleep.goodNights < 5
        ? {
            title: 'Sleep 7 h+ on 5 nights',
            done: sleep.goodNights,
            goal: 5,
            why: `You slept 7 hours or more on ${sleep.goodNights} of ${sleep.nights} nights. Recovery, strength and appetite all get better with 7+ hours.`,
          }
        : {
            title: `Train ${trainingDays}× this week`,
            done: Math.min(trainingDays, stats.workouts),
            goal: trainingDays,
            why: `You planned ${trainingDays} workouts a week and did ${stats.workouts} in the last 7 days. Consistency beats perfect workouts.`,
          };

  // headline
  const line1 = needsCheckin
    ? 'Morning check-in.'
    : ready
      ? LEVEL[ready.level]
      : 'Your coach.';
  const line2 = restDay
    ? 'Rest and recover today.'
    : doneToday
      ? 'Workout done. Recover well.'
      : ready?.training === 'push'
        ? `Push ${focusName || 'it'} today.`
        : ready?.training === 'easy'
          ? 'Go easy today.'
          : `Train ${focusName || 'as planned'} today.`;

  const reason =
    coach?.today ??
    [
      sleep.lastNight !== undefined
        ? `You slept ${hm(sleep.lastNight)}${sleep.delta ? ` (${sleep.delta > 0 ? '+' : '−'}${Math.round(Math.abs(sleep.delta) * 60)} min vs your week)` : ''}.`
        : undefined,
      ready?.training === 'push'
        ? 'Good day to add weight on your first lift.'
        : ready?.training === 'easy'
          ? 'Same weights today, one set less per exercise.'
          : ready
            ? 'Run the plan as written.'
            : undefined,
    ]
      .filter(Boolean)
      .join(' ');

  const d14 = lastDays(days, 14);
  const d42 = lastDays(days, 42);
  const trend = useMemo(() => {
    const by = new Map(weightTrend(days).map((t) => [t.date, t.trend]));
    return d42.map((d) => by.get(d.date));
  }, [days, d42]);

  return (
    <Screen scroll>
      <InstallHint />
      <Eyebrow>
        {now.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })}{' '}
        · your coach
      </Eyebrow>
      <Text className="mt-1 font-display text-[30px] leading-[34px] text-bone">
        {line1}
      </Text>
      <Text className="font-display text-[30px] leading-[34px] text-molten">
        {line2}
      </Text>

      {needsCheckin ? (
        <View className="mt-5">
          <MorningCheckin />
        </View>
      ) : null}

      {/* 1 — readiness + the reason */}
      {ready && !needsCheckin ? (
        <Pressable
          onPress={() => setSheet('ready')}
          accessibilityHint="Shows why"
          className="mt-5"
        >
          <Card>
            <View className="flex-row items-center">
              <ReadinessRing r={ready} size={104} />
              <Text className="ml-4 flex-1 font-ui text-[15px] leading-[22px] text-bone">
                {reason}
              </Text>
            </View>
            <Text className="mt-3 font-uiSemi text-[12px] text-molten">
              Why? Tap to see the data
            </Text>
          </Card>
        </Pressable>
      ) : !ready && !needsCheckin ? (
        <View className="mt-5">
          <ConnectHealthCard />
        </View>
      ) : null}

      {/* what the coach looked at */}
      {sleep.lastNight !== undefined || proteinPct !== undefined || weight ? (
        <>
          <Text className="mb-2 mt-6 font-uiSemi text-[12px] uppercase tracking-widest text-steel">
            What the coach looked at
          </Text>
          <View className="flex-row gap-2">
            {sleep.lastNight !== undefined ? (
              <Chip
                label="Sleep"
                value={hm(sleep.lastNight).replace('m', '')}
                note={
                  sleep.delta
                    ? `${sleep.delta > 0 ? '▲' : '▼'} ${Math.round(Math.abs(sleep.delta) * 60)} min`
                    : 'as usual'
                }
                tone={(sleep.delta ?? 0) >= 0 ? 'good' : 'warn'}
                onPress={() => setSheet('sleep')}
              />
            ) : null}
            {proteinPct !== undefined ? (
              <Chip
                label="Protein"
                value={`${proteinPct}%`}
                note="yesterday"
                tone={proteinPct >= 90 ? 'good' : 'warn'}
                onPress={() => setSheet('protein')}
              />
            ) : null}
            {weight ? (
              <Chip
                label="Weight"
                value={weight.currentTrendKg.toFixed(1)}
                note={`${weight.weeklyChangeKg > 0 ? '▲' : '▼'} ${Math.abs(weight.weeklyChangeKg).toFixed(1)} / wk`}
                tone="accent"
                onPress={() => setSheet('weight')}
              />
            ) : null}
          </View>
        </>
      ) : null}

      {/* 2 — today's focus */}
      {!restDay && focus.primary.length ? (
        <Pressable
          onPress={() => setSheet('focus')}
          accessibilityHint="Shows why"
          className="mt-4"
        >
          <Card>
            <Eyebrow>Today’s focus</Eyebrow>
            <View className="mt-2 flex-row items-center">
              <View style={{ width: 150 }}>
                <BodyMap
                  primary={focus.primary}
                  secondary={focus.secondary}
                  scale={0.32}
                  legend={false}
                />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-display text-[22px] leading-7 text-bone">
                  {active ? active.dayName : plan.name}
                  {ready?.training === 'push'
                    ? ' · heavy'
                    : ready?.training === 'easy'
                      ? ' · easy'
                      : ''}
                </Text>
                <View className="mt-2 flex-row flex-wrap gap-1.5">
                  {focus.primary.slice(0, 4).map((m) => (
                    <View
                      key={m}
                      className="rounded-full bg-molten/20 px-2.5 py-1"
                    >
                      <Text className="font-uiSemi text-[12px] text-molten">
                        {MUSCLE_LABEL[m]}
                      </Text>
                    </View>
                  ))}
                </View>
                {lead && !doneToday ? (
                  <Text className="mt-2 font-ui text-[13px] leading-[18px] text-steel">
                    Aim: {lead.name} {kgLabel(lead.targetKg)}
                  </Text>
                ) : null}
              </View>
            </View>
          </Card>
        </Pressable>
      ) : null}

      {/* 3 — your day, planned */}
      <Text className="mb-2 mt-7 font-display text-[22px] text-bone">
        Your day, <Text className="text-molten">planned</Text>
      </Text>
      <Card className="py-2">
        {items.map((it, i) => {
          const isNext = it.state === 'next';
          const faded = it.state === 'done' || it.state === 'missed';
          return (
            <View key={it.key} className="flex-row py-2.5">
              <Text
                className={`w-[50px] pt-0.5 font-uiSemi text-[13px] ${isNext ? 'text-molten' : 'text-steel'}`}
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {clock(it.minute)}
              </Text>
              <View className="w-5 items-center">
                <View
                  className={`mt-1 h-3 w-3 rounded-full border-2 ${isNext ? 'border-molten bg-molten' : it.state === 'done' ? 'border-steel bg-steel' : 'border-steel bg-graphite-900'}`}
                  style={
                    isNext
                      ? {
                          shadowColor: c.accent,
                          shadowOpacity: 0.8,
                          shadowRadius: 6,
                          shadowOffset: { width: 0, height: 0 },
                        }
                      : undefined
                  }
                />
                {i < items.length - 1 ? (
                  <View className="mt-1 w-0.5 flex-1 bg-graphite-700" />
                ) : null}
              </View>
              <View className={`ml-2 flex-1 ${faded ? 'opacity-50' : ''}`}>
                <Text
                  className={`font-uiSemi text-[15px] ${isNext ? 'text-molten' : 'text-bone'}`}
                >
                  {it.title}
                  {isNext
                    ? ' · next'
                    : it.state === 'missed'
                      ? ' · not logged'
                      : ''}
                </Text>
                <Text className="mt-0.5 font-ui text-[13px] leading-[18px] text-steel">
                  {it.body}
                </Text>
                {it.tag ? (
                  <View className="mt-1.5 flex-row">
                    <View
                      className={`rounded-full px-2 py-0.5 ${isNext ? 'bg-molten/20' : 'bg-graphite-800'}`}
                    >
                      <Text
                        className={`font-uiSemi text-[11px] ${isNext ? 'text-molten' : 'text-steel'}`}
                      >
                        {it.tag}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </Card>
      <Text className="mt-2 font-ui text-[12px] text-steel">
        Times follow your usual meals. Suggestions only.
      </Text>

      {/* 4 — one thing to improve */}
      <Pressable
        onPress={() => setSheet('improve')}
        accessibilityHint="Shows why"
        className="mt-5"
      >
        <Card>
          <Eyebrow>This week’s 1 thing to improve</Eyebrow>
          <Text className="mt-1 font-uiSemi text-[17px] text-bone">
            {improve.title}
          </Text>
          <View className="mt-3">
            <Progress
              value={improve.done}
              max={improve.goal}
              color={c.accent}
            />
          </View>
          <View className="mt-2 flex-row items-baseline">
            <CountUp
              to={improve.done}
              className="font-uiSemi text-[13px] text-molten"
            />
            <Text className="font-ui text-[13px] text-steel">
              {' '}
              of {improve.goal} done
            </Text>
          </View>
        </Card>
      </Pressable>

      {/* weekly verdict (Sun/Mon) */}
      {[0, 1].includes(now.getDay()) && stats.workouts + loggedDays > 0 ? (
        <Card className="mb-2 mt-3">
          <Eyebrow>Weekly verdict</Eyebrow>
          <Text className="mt-1 font-uiSemi text-[17px] text-molten">
            {verdict.call}
          </Text>
          <Text className="mt-1 font-ui text-[14px] leading-[20px] text-steel">
            {verdict.reason}
          </Text>
        </Card>
      ) : null}

      <Text className="mb-6 mt-5 font-ui text-[12px] leading-[18px] text-steel">
        Recommendations only, not medical advice.
      </Text>

      {/* why-sheets */}
      <CoachSheet
        open={sheet === 'ready' || sheet === 'sleep'}
        onClose={() => setSheet(null)}
        kicker={
          sheet === 'ready' ? `Why “${line2.replace(/\.$/, '')}”?` : 'Sleep'
        }
        title={
          sleep.status === 'rested'
            ? 'Your sleep is on track'
            : sleep.status === 'none'
              ? 'No sleep data yet'
              : 'Sleep is holding you back'
        }
      >
        <BarChart
          data={d14.map((d) => ({
            label: weekday(d.date),
            value: d.sleepHours,
          }))}
          color={c.accent}
          target={7}
          height={120}
          edges={
            d14.length
              ? [shortDate(d14[0]!.date), shortDate(d14.at(-1)!.date)]
              : undefined
          }
          format={(v) => hm(v)}
        />
        <SheetText
          title="What it means"
          text={coach?.explain?.recovery ?? sleep.tip.body}
        />
        {ready ? (
          <SheetText
            title={`Readiness ${ready.score}`}
            text={`Built from last night’s sleep${ready.hrvVsBaselinePct !== undefined ? ', HRV' : ''}${ready.rhrVsBaselineBpm !== undefined ? ', resting heart rate' : ''}${days.at(-1)?.feel !== undefined ? ' and how you feel' : ''}. 75+ = push, 50–74 = normal, under 50 = easy day.`}
          />
        ) : null}
      </CoachSheet>

      <CoachSheet
        open={sheet === 'protein'}
        onClose={() => setSheet(null)}
        kicker="Protein"
        title={`${proteinDays} of 7 days on target`}
      >
        <BarChart
          data={last7.map((d) => ({
            label: weekday(d.date),
            value: d.protein || undefined,
          }))}
          color={c.accent}
          target={food.targets.proteinG}
          height={120}
          format={(v) => `${Math.round(v)} g`}
        />
        <SheetText
          title="What it means"
          text={
            coach?.explain?.nutrition ??
            `Your target is ${food.targets.proteinG} g a day. Spread it over 3–4 meals of 30–50 g. Today you have ${Math.max(0, food.targets.proteinG - food.eaten.protein)} g to go.`
          }
        />
      </CoachSheet>

      <CoachSheet
        open={sheet === 'weight'}
        onClose={() => setSheet(null)}
        kicker="Weight"
        title={
          weight
            ? `${weight.weeklyChangeKg > 0 ? '+' : ''}${weight.weeklyChangeKg.toFixed(2)} kg per week`
            : 'No weight data yet'
        }
      >
        <LineChart
          series={[
            { values: d42.map((d) => d.weightKg), color: c.muted, dots: true },
            { values: trend, color: c.accent, area: true },
          ]}
          labels={
            d42.length
              ? [shortDate(d42[0]!.date), shortDate(d42.at(-1)!.date)]
              : undefined
          }
          unit=" kg"
        />
        <SheetText
          title="What it means"
          text={
            coach?.explain?.weight ??
            analysis.insights.find((i) =>
              [
                'loss_too_fast',
                'loss_stalled',
                'loss_on_track',
                'gain_too_fast',
              ].includes(i.id),
            )?.body ??
            'The orange line is your trend: daily weigh-ins jump with water and salt, the trend shows what’s really happening.'
          }
        />
      </CoachSheet>

      <CoachSheet
        open={sheet === 'focus'}
        onClose={() => setSheet(null)}
        kicker="Today’s focus"
        title={active ? active.dayName : plan.name}
      >
        <BodyMap
          primary={focus.primary}
          secondary={focus.secondary}
          scale={0.6}
        />
        <SheetText
          title="Why this workout"
          text={`It’s next in your ${trainingDays}-day plan. ${ready?.training === 'push' ? 'You’re well recovered, so the coach adds weight where you hit all your reps last time.' : ready?.training === 'easy' ? 'You’re under-recovered, so it keeps the weights and drops one set per exercise.' : 'Normal recovery: run it as written.'}`}
        />
        <View className="mt-3 gap-1">
          {plan.moves.map((m) => (
            <View key={m.name} className="flex-row items-center py-1.5">
              <ExerciseDemo name={m.name} size="thumb" />
              <Text className="ml-3 flex-1 font-ui text-[14px] text-bone">
                {m.name}
              </Text>
              <Text
                className={`font-uiSemi text-[14px] ${m.reason === 'increase' ? 'text-mint' : 'text-bone'}`}
              >
                {kgLabel(m.targetKg)}
              </Text>
            </View>
          ))}
        </View>
      </CoachSheet>

      <CoachSheet
        open={sheet === 'improve'}
        onClose={() => setSheet(null)}
        kicker="This week’s 1 thing"
        title={improve.title}
      >
        <SheetText title="Why this one" text={improve.why} />
        <SheetText
          title="Why only one?"
          text="Changing one habit at a time sticks. Once this is easy, your coach picks the next one."
        />
      </CoachSheet>
    </Screen>
  );
}
