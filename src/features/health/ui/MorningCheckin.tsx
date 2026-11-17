import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Moon } from '@/components/icons';
import { IconBadge } from '@/components/ui';
import { track } from '@/lib/telemetry';
import { useColors } from '@/theme/theme';

import { localDate, useManualLog, type Feel } from '../manual';
import { manualHealth, useHealth } from '../store';

const SLEEP = [5, 6, 7, 8, 9] as const;
const FEEL: { v: Feel; label: string }[] = [
  { v: 1, label: 'Tired' },
  { v: 2, label: 'OK' },
  { v: 3, label: 'Fresh' },
];

function Chip({
  label,
  on,
  onPress,
}: {
  label: string;
  on: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      onPress={onPress}
      className={`min-h-[44px] flex-1 items-center justify-center rounded-xl ${on ? 'bg-molten' : 'bg-graphite-800'}`}
    >
      <Text
        className={`font-uiSemi text-[15px] ${on ? 'text-graphite-950' : 'text-bone'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Web only: true when today's check-in still has to be done. */
export function useNeedsCheckin() {
  const entries = useManualLog((s) => s.entries);
  const connected = useHealth((s) => s.connected);
  return (
    manualHealth &&
    (!connected || entries[localDate()]?.sleepHours === undefined)
  );
}

/**
 * Web replacement for Apple Health: a 3-second morning check-in
 * (sleep, how you feel, optional weight) that feeds readiness and trends.
 */
export function MorningCheckin() {
  const c = useColors();
  const logDay = useManualLog((s) => s.logDay);
  const { connected, connect, refresh } = useHealth();
  const [sleep, setSleep] = useState<number>();
  const [feel, setFeel] = useState<Feel>();
  const [weight, setWeight] = useState('');
  const kg = Number(weight.replace(',', '.'));
  const weightOk = weight === '' || (kg >= 30 && kg <= 300);

  const save = async () => {
    logDay(localDate(), {
      sleepHours: sleep,
      feel,
      ...(weight && weightOk ? { weightKg: Math.round(kg * 10) / 10 } : {}),
    });
    track('health_connected', { result: 'checkin' });
    if (!connected) await connect();
    else await refresh();
  };

  return (
    <Card molten>
      <View className="flex-row items-center">
        <IconBadge Icon={Moon} color={c.accent} size={40} />
        <View className="ml-3 flex-1">
          <Text className="font-uiSemi text-[17px] text-bone">
            Daily check-in
          </Text>
          <Text className="font-ui text-[14px] text-steel">
            3 seconds. Your coach plans today around it.
          </Text>
        </View>
      </View>

      <Text className="mb-2 mt-5 font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        Hours slept
      </Text>
      <View className="flex-row gap-2">
        {SLEEP.map((h) => (
          <Chip
            key={h}
            label={h === 9 ? '9+' : String(h)}
            on={sleep === h}
            onPress={() => setSleep(h)}
          />
        ))}
      </View>

      <Text className="mb-2 mt-4 font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        How do you feel?
      </Text>
      <View className="flex-row gap-2">
        {FEEL.map((f) => (
          <Chip
            key={f.v}
            label={f.label}
            on={feel === f.v}
            onPress={() => setFeel(f.v)}
          />
        ))}
      </View>

      <Text className="mb-2 mt-4 font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        Weight (optional)
      </Text>
      <TextInput
        value={weight}
        onChangeText={setWeight}
        placeholder="e.g. 82.4 kg"
        placeholderTextColor={c.muted}
        keyboardType="decimal-pad"
        inputMode="decimal"
        accessibilityLabel="Weight in kilograms"
        className="min-h-[48px] rounded-xl bg-graphite-800 px-4 font-ui text-[17px] text-bone"
      />
      {!weightOk ? (
        <Text className="mt-1 font-ui text-[13px] text-gold">
          Enter your weight in kg.
        </Text>
      ) : null}

      <View className="mt-5">
        <Button
          label="Save check-in"
          disabled={sleep === undefined || feel === undefined || !weightOk}
          onPress={() => void save()}
        />
      </View>
    </Card>
  );
}
