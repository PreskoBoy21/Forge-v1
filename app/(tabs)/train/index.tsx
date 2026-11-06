import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { BarChart, LineChart, Progress } from '@/components/charts';
import {
  CalendarDays,
  ChevronRight,
  Dumbbell,
  History,
  Sparkles,
  Trophy,
} from '@/components/icons';
import { Screen } from '@/components/Screen';
import {
  Eyebrow,
  IconBadge,
  Explain,
  Pill,
  SectionHeader,
} from '@/components/ui';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { useCoachRead } from '@/features/health/ui/useCoachRead';
import { shortDate } from '@/features/health/vitals';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { kgLabel } from '@/features/train/program';
import {
  consistency,
  liftProgress,
  musclesThisWeek,
  recentPRs,
  topLifts,
  trainingSummary,
  weeklyVolume,
} from '@/features/train/stats';
import { planToday, useTrain } from '@/features/train/store';
import { go } from '@/lib/nav';
import { useColors } from '@/theme/theme';

const ARROW = { increase: '↑', deload: '↓', keep: '', first: '' } as const;
const kg = (n: number) =>
  n >= 10_000 ? `${(n / 1000).toFixed(1)} t` : `${Math.round(n)} kg`;
const MUSCLE: Record<string, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  arms: 'Arms',
  legs: 'Legs',
  core: 'Core',
};

function Stat({
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
    <View className="flex-1 rounded-card border border-graphite-700/60 bg-graphite-900 p-3.5">
      <Text className="font-uiMedium text-[12px] text-steel">{label}</Text>
      <Text
        className="mt-1 font-display text-[22px] text-bone"
        style={{ fontVariant: ['tabular-nums'] }}
        numberOfLines={1}
      >
        {value}
      </Text>
      {sub ? (
        <Text
          numberOfLines={1}
          className={`mt-0.5 font-uiMedium text-[12px] ${tone === 'good' ? 'text-mint' : tone === 'warn' ? 'text-gold' : 'text-steel'}`}
        >
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

export default function TrainScreen() {
  const c = useColors();
  const history = useTrain((s) => s.history);
  const active = useTrain((s) => s.active);
  const trainingDays = useOnboardingDraft((s) => s.trainingDays);
  const { analysis, goal } = useAnalysis();
  const { data: coach } = useCoachRead(analysis, goal);
  const easy = analysis.readiness?.training === 'easy';
  const plan = useMemo(() => planToday(history, easy), [history, easy]);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  const stats = useMemo(() => {
    const lifts = topLifts(history);
    return {
      summary: trainingSummary(history, today, trainingDays),
      volume: weeklyVolume(history, today, 8),
      lifts,
      prs: recentPRs(history, 4),
      muscles: musclesThisWeek(history, today),
      days: consistency(history, today, 28),
    };
  }, [history, today, trainingDays]);
  const [lift, setLift] = useState<string | null>(null);
  const shownLift = lift ?? stats.lifts[0] ?? null;
  const progress = useMemo(
    () => (shownLift ? liftProgress(history, shownLift) : []),
    [history, shownLift],
  );
  const s = stats.summary;
  const gain =
    progress.length > 1
      ? Math.round((progress.at(-1)!.e1rm - progress[0]!.e1rm) * 10) / 10
      : 0;

  return (
    <Screen scroll>
      <Eyebrow>
        Session {history.length + 1}
        {easy ? ' · easy day' : ''}
      </Eyebrow>
      <Text className="mt-1 font-display text-[28px] uppercase tracking-wide text-bone">
        Train
      </Text>

      {/* stats */}
      <View className="mt-4 flex-row gap-3">
        <Stat
          label="This week"
          value={`${s.workouts7d}/${trainingDays}`}
          sub={
            s.workouts7d >= trainingDays
              ? 'Goal hit'
              : `${trainingDays - s.workouts7d} to go`
          }
          tone={s.workouts7d >= trainingDays ? 'good' : undefined}
        />
        <Stat
          label="Volume 7d"
          value={kg(s.volume7dKg)}
          sub={
            s.volumeChangePct === undefined
              ? 'Sets × reps × kg'
              : `${s.volumeChangePct > 0 ? '+' : ''}${s.volumeChangePct}% vs last wk`
          }
          tone={
            s.volumeChangePct === undefined
              ? undefined
              : s.volumeChangePct >= 0
                ? 'good'
                : 'warn'
          }
        />
        <Stat
          label="PRs 30d"
          value={String(s.prs30d)}
          sub={s.weekStreak > 0 ? `${s.weekStreak} wk streak` : 'Lift heavy'}
        />
      </View>

      {coach?.explain?.training ? (
        <Explain Icon={Sparkles} text={coach.explain.training} />
      ) : null}

      {/* today's plan */}
      <SectionHeader title={active ? active.dayName : plan.name} />
      <Card molten>
        <Text className="font-ui text-[14px] text-steel">
          {easy
            ? 'Under-recovered: same weights, one set less per move.'
            : 'Weights go up when you hit the top of the rep range.'}
        </Text>
        <View className="mt-3">
          {plan.moves.map((mv, i) => (
            <View
              key={mv.name}
              className={`flex-row items-center py-2.5 ${i ? 'border-t border-graphite-700/60' : ''}`}
            >
              <View className="flex-1 pr-3">
                <Text className="font-uiSemi text-[16px] text-bone">
                  {mv.name}
                </Text>
                <Text className="font-ui text-[13px] text-steel">
                  {mv.sets} × {mv.repMin}–{mv.repMax}
                </Text>
              </View>
              <Text
                className={`font-uiSemi text-[15px] ${mv.reason === 'increase' ? 'text-mint' : mv.reason === 'deload' ? 'text-gold' : 'text-bone'}`}
              >
                {kgLabel(mv.targetKg)} {ARROW[mv.reason]}
              </Text>
            </View>
          ))}
        </View>
        <View className="mt-3">
          <Button
            label={active ? 'Resume workout' : 'Start Gym Mode'}
            size="gym"
            onPress={() => {
              if (!active) useTrain.getState().start(easy);
              go('/(tabs)/train/gym');
            }}
          />
        </View>
      </Card>

      {history.length === 0 ? (
        <Card className="mt-6">
          <View className="flex-row items-center">
            <IconBadge Icon={Dumbbell} color={c.accent} />
            <Text className="ml-3 flex-1 font-ui text-[15px] leading-[21px] text-steel">
              Finish your first workout and your strength graphs, volume and PRs
              show up here.
            </Text>
          </View>
        </Card>
      ) : (
        <>
          {/* strength */}
          {shownLift ? (
            <>
              <SectionHeader title="Strength" />
              <Card>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-2"
                >
                  {stats.lifts.map((l) => (
                    <Pill
                      key={l}
                      label={l}
                      active={l === shownLift}
                      onPress={() => setLift(l)}
                    />
                  ))}
                </ScrollView>
                <View className="mt-4 flex-row items-end justify-between">
                  <View>
                    <Text className="font-uiMedium text-[12px] text-steel">
                      Est. 1-rep max
                    </Text>
                    <Text className="font-display text-[30px] text-bone">
                      {progress.at(-1)?.e1rm ?? '—'} kg
                    </Text>
                  </View>
                  {gain !== 0 ? (
                    <Text
                      className={`mb-1 font-uiSemi text-[14px] ${gain > 0 ? 'text-mint' : 'text-gold'}`}
                    >
                      {gain > 0 ? '+' : ''}
                      {gain} kg since {shortDate(progress[0]!.date)}
                    </Text>
                  ) : null}
                </View>
                <View className="mt-3">
                  <LineChart
                    series={[
                      {
                        values: progress.map((p) => p.e1rm),
                        color: c.accent,
                        area: true,
                      },
                    ]}
                    labels={
                      progress.length
                        ? [
                            shortDate(progress[0]!.date),
                            shortDate(progress.at(-1)!.date),
                          ]
                        : undefined
                    }
                    unit=" kg"
                    decimals={0}
                  />
                </View>
              </Card>
            </>
          ) : null}

          {/* volume */}
          <SectionHeader title="Weekly volume" />
          <Card>
            <Text className="font-ui text-[13px] text-steel">
              Total kg lifted per week (sets × reps × weight). Going up over
              time = progressive overload.
            </Text>
            <View className="mt-4">
              <BarChart
                data={stats.volume.map((w) => ({
                  label: w.label,
                  value: w.volume,
                }))}
                color={c.accent}
                format={kg}
              />
            </View>
          </Card>

          {/* consistency */}
          <SectionHeader title="Last 4 weeks" />
          <Card>
            <View className="flex-row items-center">
              <CalendarDays size={18} color={c.muted} />
              <Text className="ml-2 font-ui text-[14px] text-steel">
                {stats.days.filter((d) => d.trained).length} workouts ·{' '}
                {trainingDays * 4} planned
              </Text>
            </View>
            <View className="mt-3 flex-row flex-wrap" style={{ gap: 6 }}>
              {stats.days.map((d) => (
                <View
                  key={d.date}
                  style={{ width: '12.4%', aspectRatio: 1 }}
                  className={`rounded-md ${d.trained ? 'bg-molten' : 'bg-graphite-800'} ${d.date === today ? 'border-2 border-bone' : ''}`}
                />
              ))}
            </View>
          </Card>

          {/* muscles */}
          {stats.muscles.length ? (
            <>
              <SectionHeader title="Sets per muscle · 7 days" />
              <Card>
                <View className="gap-3">
                  {stats.muscles.slice(0, 8).map((m) => (
                    <View key={m.muscle}>
                      <View className="mb-1 flex-row justify-between">
                        <Text className="font-uiMedium text-[14px] text-bone">
                          {MUSCLE[m.muscle] ?? m.muscle}
                        </Text>
                        <Text className="font-ui text-[13px] text-steel">
                          {m.sets} / 10 sets
                        </Text>
                      </View>
                      <Progress
                        value={m.sets}
                        max={10}
                        color={m.sets >= 10 ? c.good : c.aqua}
                      />
                    </View>
                  ))}
                </View>
                <Text className="mt-3 font-ui text-[12px] text-steel">
                  About 10 hard sets per muscle per week is a solid target for
                  growth.
                </Text>
              </Card>
            </>
          ) : null}

          {/* PRs */}
          {stats.prs.length ? (
            <>
              <SectionHeader title="Recent PRs" />
              <Card>
                {stats.prs.map((p, i) => (
                  <View
                    key={`${p.date}-${p.exercise}`}
                    className={`flex-row items-center py-2.5 ${i ? 'border-t border-graphite-700/60' : ''}`}
                  >
                    <IconBadge Icon={Trophy} color={c.warn} size={30} />
                    <View className="ml-3 flex-1">
                      <Text className="font-uiSemi text-[15px] text-bone">
                        {p.exercise}
                      </Text>
                      <Text className="font-ui text-[12px] text-steel">
                        {shortDate(p.date)} · was {p.prevKg} kg
                      </Text>
                    </View>
                    <Text className="font-display text-[18px] text-mint">
                      {p.kg} kg
                    </Text>
                  </View>
                ))}
              </Card>
            </>
          ) : null}
        </>
      )}

      <Pressable
        className="mb-6 mt-6 flex-row items-center rounded-card border border-graphite-700/60 bg-graphite-900 p-4"
        onPress={() => go('/(tabs)/train/history')}
      >
        <History size={20} color={c.muted} />
        <Text className="ml-3 flex-1 font-uiMedium text-[16px] text-bone">
          Workout history
        </Text>
        <Text className="mr-1 font-ui text-[14px] text-steel">
          {history.length}
        </Text>
        <ChevronRight size={18} color={c.muted} />
      </Pressable>
    </Screen>
  );
}
