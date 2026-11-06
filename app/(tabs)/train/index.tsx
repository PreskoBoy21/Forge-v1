import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { BarChart, LineChart } from '@/components/charts';
import { ChevronRight, History, Trophy } from '@/components/icons';
import { Screen } from '@/components/Screen';
import { Eyebrow, IconBadge, Pill, Segmented } from '@/components/ui';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { shortDate } from '@/features/health/vitals';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { kgLabel } from '@/features/train/program';
import {
  consistency,
  liftProgress,
  recentPRs,
  topLifts,
  trainingSummary,
  weeklyVolume,
} from '@/features/train/stats';
import { planToday, useTrain } from '@/features/train/store';
import { go } from '@/lib/nav';
import { useColors } from '@/theme/theme';

/** Train = today's plan first; progress is one card with one graph at a time. */
const ARROW = { increase: ' ↑', deload: ' ↓', keep: '', first: '' } as const;
const kg = (n: number) =>
  n >= 10_000 ? `${(n / 1000).toFixed(1)} t` : `${Math.round(n)} kg`;

type View_ = 'strength' | 'volume' | 'calendar';

export default function TrainScreen() {
  const c = useColors();
  const history = useTrain((s) => s.history);
  const active = useTrain((s) => s.active);
  const trainingDays = useOnboardingDraft((s) => s.trainingDays);
  const { analysis } = useAnalysis();
  const easy = analysis.readiness?.training === 'easy';
  const plan = useMemo(() => planToday(history, easy), [history, easy]);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [view, setView] = useState<View_>('strength');

  const stats = useMemo(
    () => ({
      summary: trainingSummary(history, today, trainingDays),
      volume: weeklyVolume(history, today, 8),
      lifts: topLifts(history),
      pr: recentPRs(history, 1)[0],
      days: consistency(history, today, 28),
    }),
    [history, today, trainingDays],
  );
  const [lift, setLift] = useState<string | null>(null);
  const shownLift = lift ?? stats.lifts[0] ?? null;
  const progress = useMemo(
    () => (shownLift ? liftProgress(history, shownLift) : []),
    [history, shownLift],
  );
  const gain =
    progress.length > 1
      ? Math.round((progress.at(-1)!.e1rm - progress[0]!.e1rm) * 10) / 10
      : 0;
  const s = stats.summary;
  const trained28 = stats.days.filter((d) => d.trained).length;

  return (
    <Screen scroll>
      <Eyebrow>
        {s.workouts7d} of {trainingDays} workouts this week
      </Eyebrow>
      <Text className="mt-1 font-display text-[28px] uppercase tracking-wide text-bone">
        Train
      </Text>

      {/* today's plan */}
      <Card molten className="mt-5">
        <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-molten">
          {easy ? 'Today · easy day' : 'Today'}
        </Text>
        <Text className="mt-1 font-display text-[26px] uppercase text-bone">
          {active ? active.dayName : plan.name}
        </Text>
        <View className="mt-2">
          {plan.moves.map((mv) => (
            <View key={mv.name} className="flex-row items-center py-2">
              <Text className="flex-1 font-ui text-[15px] text-bone">
                {mv.name}
              </Text>
              <Text className="mr-3 font-ui text-[13px] text-steel">
                {mv.sets}×{mv.repMin}–{mv.repMax}
              </Text>
              <Text
                className={`min-w-[72px] text-right font-uiSemi text-[15px] ${mv.reason === 'increase' ? 'text-mint' : mv.reason === 'deload' ? 'text-gold' : 'text-bone'}`}
              >
                {kgLabel(mv.targetKg)}
                {ARROW[mv.reason]}
              </Text>
            </View>
          ))}
        </View>
        <View className="mt-4">
          <Button
            label={active ? 'Resume workout' : 'Start workout'}
            size="gym"
            onPress={() => {
              if (!active) useTrain.getState().start(easy);
              go('/(tabs)/train/gym');
            }}
          />
        </View>
        <Text className="mt-3 text-center font-ui text-[12px] text-steel">
          ↑ = weight goes up because you hit the top of the reps last time
        </Text>
      </Card>

      {/* progress: one graph at a time */}
      <Text className="mb-3 mt-8 font-display text-[19px] uppercase tracking-wide text-bone">
        Progress
      </Text>
      {history.length === 0 ? (
        <Card>
          <Text className="font-ui text-[15px] leading-[21px] text-steel">
            Finish your first workout and your progress graphs show up here.
          </Text>
        </Card>
      ) : (
        <Card>
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: 'strength', label: 'Strength' },
              { value: 'volume', label: 'Volume' },
              { value: 'calendar', label: 'Calendar' },
            ]}
          />

          {view === 'strength' ? (
            shownLift ? (
              <View className="mt-4">
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
                <Text className="mt-4 font-display text-[32px] text-bone">
                  {progress.at(-1)?.e1rm ?? '—'} kg
                </Text>
                <Text className="font-ui text-[13px] text-steel">
                  Estimated 1-rep max
                  {gain > 0 ? (
                    <Text className="text-mint">
                      {'  '}+{gain} kg since {shortDate(progress[0]!.date)}
                    </Text>
                  ) : null}
                </Text>
                <View className="mt-4">
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
              </View>
            ) : (
              <Text className="mt-4 font-ui text-[14px] text-steel">
                Do the same lift twice and its strength line appears here.
              </Text>
            )
          ) : null}

          {view === 'volume' ? (
            <View className="mt-4">
              <Text className="font-display text-[32px] text-bone">
                {kg(s.volume7dKg)}
              </Text>
              <Text className="font-ui text-[13px] text-steel">
                Lifted in the last 7 days
                {s.volumeChangePct !== undefined ? (
                  <Text
                    className={
                      s.volumeChangePct >= 0 ? 'text-mint' : 'text-gold'
                    }
                  >
                    {'  '}
                    {s.volumeChangePct > 0 ? '+' : ''}
                    {s.volumeChangePct}% vs last week
                  </Text>
                ) : null}
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
            </View>
          ) : null}

          {view === 'calendar' ? (
            <View className="mt-4">
              <Text className="font-display text-[32px] text-bone">
                {trained28} / {trainingDays * 4}
              </Text>
              <Text className="font-ui text-[13px] text-steel">
                Workouts in the last 4 weeks
                {s.weekStreak > 1 ? ` · ${s.weekStreak}-week streak` : ''}
              </Text>
              <View className="mt-4 flex-row flex-wrap" style={{ gap: 6 }}>
                {stats.days.map((d) => (
                  <View
                    key={d.date}
                    style={{ width: '12.4%', aspectRatio: 1 }}
                    className={`rounded-md ${d.trained ? 'bg-molten' : 'bg-graphite-800'} ${d.date === today ? 'border-2 border-bone' : ''}`}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </Card>
      )}

      {/* latest PR + history, as two quiet rows */}
      <View className="mb-6 mt-4 rounded-card border border-graphite-700/60 bg-graphite-900 px-4">
        {stats.pr ? (
          <Pressable
            onPress={() => go('/(tabs)/train/history')}
            className="flex-row items-center border-b border-graphite-700/60 py-3.5"
          >
            <IconBadge Icon={Trophy} color={c.warn} size={30} />
            <View className="ml-3 flex-1">
              <Text className="font-uiSemi text-[15px] text-bone">
                Latest PR: {stats.pr.exercise}
              </Text>
              <Text className="font-ui text-[12px] text-steel">
                {stats.pr.kg} kg · {shortDate(stats.pr.date)}
              </Text>
            </View>
          </Pressable>
        ) : null}
        <Pressable
          onPress={() => go('/(tabs)/train/history')}
          className="flex-row items-center py-3.5"
        >
          <History size={20} color={c.muted} />
          <Text className="ml-3 flex-1 font-uiMedium text-[15px] text-bone">
            Workout history
          </Text>
          <Text className="mr-1 font-ui text-[14px] text-steel">
            {history.length}
          </Text>
          <ChevronRight size={18} color={c.muted} />
        </Pressable>
      </View>
    </Screen>
  );
}
