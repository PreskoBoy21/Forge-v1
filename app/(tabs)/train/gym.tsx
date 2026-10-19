import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { mockGym } from '@/features/preview/mock-data';
import { replaceTo } from '@/lib/nav';

function formatRest(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function GymModeScreen() {
  const [logged, setLogged] = useState(1);
  const [weight, setWeight] = useState(mockGym.weight);
  const [reps, setReps] = useState(mockGym.reps);
  const [rest, setRest] = useState(162);
  const [name, setName] = useState(mockGym.name);

  useEffect(() => {
    if (rest <= 0) return;
    const id = setTimeout(() => setRest((value) => value - 1), 1000);
    return () => clearTimeout(id);
  }, [rest]);

  return (
    <Screen>
      <View className="flex-row items-center justify-between">
        <Pressable onPress={() => replaceTo('/(tabs)/today')}>
          <Text className="font-uiSemi text-[15px] text-steel">Exit</Text>
        </Pressable>
        <Text className="font-uiMedium text-[13px] uppercase tracking-widest text-steel">
          Move {mockGym.move} of {mockGym.totalMoves}
        </Text>
        <Text
          className="font-display text-[17px] text-ember"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {formatRest(rest)}
        </Text>
      </View>

      <Text className="mt-6 font-display text-[34px] uppercase leading-9 tracking-wide text-bone">
        {name}
      </Text>
      <Text className="mt-2 font-ui text-[15px] text-steel">
        Target {mockGym.sets} × {mockGym.repMin}–{mockGym.repMax} · RIR{' '}
        {mockGym.rir}
      </Text>

      <View className="mt-6 flex-row gap-2">
        {Array.from({ length: mockGym.sets }).map((_, index) => {
          const done = index < logged;
          return (
            <View
              key={index}
              className={`flex-1 items-center rounded-btn py-3 ${done ? 'bg-mint' : 'bg-graphite-800'}`}
            >
              <Text
                className={`font-uiSemi text-[12px] ${done ? 'text-graphite-950' : 'text-steel'}`}
              >
                SET {index + 1}/{mockGym.sets}
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
          step={2.5}
          onChange={setWeight}
        />
        <Stepper
          label="Reps"
          value={reps}
          step={1}
          onChange={(value) => setReps(Math.max(1, value))}
        />
      </View>

      <Pressable
        onPress={() => {
          setLogged((value) => Math.min(mockGym.sets, value + 1));
          setRest(90);
        }}
        className="mt-8 h-16 items-center justify-center rounded-btn bg-mint"
      >
        <Text className="font-display text-[20px] uppercase text-graphite-950">
          ✓ Set done
        </Text>
      </Pressable>

      <View className="mt-6 rounded-full self-start border border-molten px-4 py-2">
        <Text className="font-uiSemi text-[13px] uppercase text-molten">
          Machine taken?
        </Text>
      </View>
      <Text className="mt-2 font-ui text-[13px] text-steel">
        Swap. Same pattern your gym has.
      </Text>
      <View className="mt-3 gap-2">
        {mockGym.swaps.map((swap) => (
          <Pressable
            key={swap.name}
            onPress={() => setName(swap.name)}
            className="rounded-card bg-graphite-900 px-4 py-3"
          >
            <Text className="font-uiSemi text-[15px] text-bone">
              {swap.name}
            </Text>
            <Text className="mt-1 font-ui text-[13px] text-steel">
              {swap.meta}
            </Text>
          </Pressable>
        ))}
      </View>
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
            className="h-10 w-10 items-center justify-center rounded-full bg-graphite-800"
          >
            <Text className="font-display text-[20px] text-bone">−</Text>
          </Pressable>
          <Pressable
            onPress={() => onChange(+(value + step).toFixed(1))}
            className="h-10 w-10 items-center justify-center rounded-full bg-graphite-800"
          >
            <Text className="font-display text-[20px] text-bone">+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
