import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { kgLabel, swapsFor } from '@/features/train/program';
import { useTrain } from '@/features/train/store';
import { BookOpen } from '@/components/icons';
import { go, replaceTo } from '@/lib/nav';
import { useColors } from '@/theme/theme';

function formatRest(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function GymModeScreen() {
  const c = useColors();
  const active = useTrain((s) => s.active);
  const { analysis } = useAnalysis();
  const easy = analysis.readiness?.training === 'easy';
  const home = useOnboardingDraft((s) => s.gym === 'home');

  useEffect(() => {
    if (!useTrain.getState().active) useTrain.getState().start(easy);
  }, [easy]);

  const move = active?.moves[active.moveIndex];
  const done = move
    ? (active?.sets.filter((s) => s.exercise === move.name).length ?? 0)
    : 0;

  // Weight/reps follow the current move's target until the user edits them.
  const moveKey = `${active?.moveIndex}-${move?.name}`;
  const [edit, setEdit] = useState<{
    key: string;
    weight: number;
    reps: number;
  }>();
  const weight = edit?.key === moveKey ? edit.weight : (move?.targetKg ?? 0);
  const reps = edit?.key === moveKey ? edit.reps : (move?.repMax ?? 8);
  const setWeight = (w: number) => setEdit({ key: moveKey, weight: w, reps });
  const setReps = (r: number) => setEdit({ key: moveKey, weight, reps: r });
  const [rest, setRest] = useState(0);
  const [swapKey, setSwapKey] = useState<string>();
  const showSwaps = swapKey === moveKey;
  const setShowSwaps = (f: (v: boolean) => boolean) =>
    setSwapKey(f(showSwaps) ? moveKey : undefined);

  useEffect(() => {
    if (rest <= 0) return;
    const id = setTimeout(() => setRest((value) => value - 1), 1000);
    return () => clearTimeout(id);
  }, [rest]);

  if (!active || !move) {
    return (
      <Screen>
        <Text className="font-ui text-[17px] text-steel">Loading workout…</Text>
      </Screen>
    );
  }

  const allDone = active.moves.every(
    (mv) => active.sets.filter((s) => s.exercise === mv.name).length >= mv.sets,
  );
  const moveComplete = done >= move.sets;
  const swaps = swapsFor(move.name, home ? 'home_dumbbells' : 'full_gym');
  const step = move.name.toLowerCase().includes('dumbbell') ? 2 : 2.5;

  const finish = async () => {
    const log = await useTrain.getState().finish();
    replaceTo(log ? '/(tabs)/train/history' : '/(tabs)/train');
  };

  return (
    <Screen scroll>
      <View className="flex-row items-center justify-between">
        <Pressable onPress={() => replaceTo('/(tabs)/train')}>
          <Text className="font-uiSemi text-[15px] text-steel">Pause</Text>
        </Pressable>
        <Text className="font-uiMedium text-[13px] uppercase tracking-widest text-steel">
          Move {active.moveIndex + 1} of {active.moves.length}
        </Text>
        <Text
          className={`font-display text-[17px] ${rest > 0 ? 'text-ember' : 'text-steel'}`}
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {rest > 0 ? formatRest(rest) : 'GO'}
        </Text>
      </View>

      <Text className="mt-6 font-display text-[34px] uppercase leading-9 tracking-wide text-bone">
        {move.name}
      </Text>
      <Pressable
        onPress={() =>
          go(`/(tabs)/train/howto?name=${encodeURIComponent(move.name)}`)
        }
        hitSlop={8}
        className="mt-2 flex-row items-center self-start rounded-full bg-graphite-800 px-3 py-1.5"
      >
        <BookOpen size={15} color={c.accent} />
        <Text className="ml-1.5 font-uiSemi text-[13px] text-bone">
          How to do it
        </Text>
      </Pressable>
      <Text className="mt-2 font-ui text-[15px] text-steel">
        Target {move.sets} × {move.repMin}–{move.repMax} ·{' '}
        {kgLabel(move.targetKg)}
        {move.reason === 'increase' ? ' (↑ you earned it)' : ''}
        {move.reason === 'deload' ? ' (↓ reset, then build back)' : ''}
      </Text>

      <View className="mt-6 flex-row gap-2">
        {Array.from({ length: move.sets }).map((_, index) => {
          const isDone = index < done;
          return (
            <View
              key={index}
              className={`flex-1 items-center rounded-btn py-3 ${isDone ? 'bg-mint' : 'bg-graphite-800'}`}
            >
              <Text
                className={`font-uiSemi text-[12px] ${isDone ? 'text-graphite-950' : 'text-steel'}`}
              >
                SET {index + 1}
              </Text>
            </View>
          );
        })}
      </View>

      <View className="mt-8 flex-row gap-4">
        <Stepper
          label="Weight"
          value={weight}
          suffix="kg"
          step={step}
          onChange={setWeight}
        />
        <Stepper
          label="Reps"
          value={reps}
          step={1}
          onChange={(value) => setReps(Math.max(1, value))}
        />
      </View>

      {allDone ? (
        <View className="mt-8">
          <Button
            label="Finish workout 🔥"
            size="gym"
            onPress={() => void finish()}
          />
        </View>
      ) : (
        <Pressable
          disabled={moveComplete}
          onPress={() => {
            useTrain.getState().logSet(weight, reps);
            setRest(move.restSec);
          }}
          className={`mt-8 h-16 items-center justify-center rounded-btn ${moveComplete ? 'bg-graphite-800' : 'bg-mint'}`}
        >
          <Text className="font-display text-[20px] uppercase text-graphite-950">
            ✓ Set done
          </Text>
        </Pressable>
      )}

      <View className="mt-4 flex-row justify-between">
        <Pressable
          disabled={active.sets.length === 0}
          onPress={() => useTrain.getState().undoSet()}
          className="py-2"
        >
          <Text className="font-uiMedium text-[13px] text-steel">
            Undo last set
          </Text>
        </Pressable>
        <View className="flex-row gap-5">
          <Pressable
            disabled={active.moveIndex === 0}
            onPress={() => useTrain.getState().goToMove(active.moveIndex - 1)}
            className="py-2"
          >
            <Text className="font-uiMedium text-[13px] text-steel">← Prev</Text>
          </Pressable>
          <Pressable
            disabled={active.moveIndex >= active.moves.length - 1}
            onPress={() => useTrain.getState().goToMove(active.moveIndex + 1)}
            className="py-2"
          >
            <Text className="font-uiMedium text-[13px] text-steel">Skip →</Text>
          </Pressable>
        </View>
      </View>

      {swaps.length && done === 0 ? (
        <>
          <Pressable
            onPress={() => setShowSwaps((v) => !v)}
            className="mt-6 self-start rounded-full border border-molten px-4 py-2"
          >
            <Text className="font-uiSemi text-[13px] uppercase text-molten">
              Machine taken?
            </Text>
          </Pressable>
          {showSwaps ? (
            <View className="mt-3 gap-2">
              {swaps.map((swap) => (
                <Pressable
                  key={swap.name}
                  onPress={() => useTrain.getState().swap(swap.name)}
                  className="rounded-card bg-graphite-900 px-4 py-3"
                >
                  <Text className="font-uiSemi text-[15px] text-bone">
                    {swap.name}
                  </Text>
                  <Text className="mt-1 font-ui text-[13px] capitalize text-steel">
                    {swap.equipment} · same muscles
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </>
      ) : null}

      {!allDone && active.sets.length > 0 ? (
        <Pressable className="mt-8 py-3" onPress={() => void finish()}>
          <Text className="text-center font-uiMedium text-[13px] text-steel">
            End workout early
          </Text>
        </Pressable>
      ) : null}
    </Screen>
  );
}

function Stepper({
  label,
  value,
  suffix,
  step,
  onChange,
}: {
  label: string;
  value: number;
  suffix?: string;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <View className="flex-1">
      <Text className="mb-2 text-center font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        {label}
      </Text>
      <View className="items-center rounded-card bg-graphite-900 py-4">
        <Text
          className="font-display text-[34px] text-bone"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {value}
          {suffix ? (
            <Text className="font-ui text-[15px] text-steel"> {suffix}</Text>
          ) : null}
        </Text>
        <View className="mt-3 flex-row gap-6">
          <Pressable
            onPress={() => onChange(Math.max(0, +(value - step).toFixed(1)))}
            className="h-12 w-12 items-center justify-center rounded-full bg-graphite-800"
          >
            <Text className="font-display text-[20px] text-bone">−</Text>
          </Pressable>
          <Pressable
            onPress={() => onChange(+(value + step).toFixed(1))}
            className="h-12 w-12 items-center justify-center rounded-full bg-graphite-800"
          >
            <Text className="font-display text-[20px] text-bone">+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
